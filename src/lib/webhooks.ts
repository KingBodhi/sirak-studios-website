import { getDb, type Lead, type WebhookConfig } from './db';

export async function fireWebhooks(event: string, payload: Record<string, unknown>) {
  const db = getDb();
  const configs = db.prepare(
    "SELECT * FROM webhook_configs WHERE active = 1 AND (events = 'all' OR events LIKE ?)"
  ).all(`%${event}%`) as WebhookConfig[];

  for (const config of configs) {
    try {
      await fetch(config.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Sirak-Event': event },
        body: JSON.stringify({ event, timestamp: new Date().toISOString(), data: payload }),
        signal: AbortSignal.timeout(5000),
      });
    } catch (err) {
      console.error(`Webhook failed for ${config.url}:`, err);
    }
  }
}

export function createLeadFromBooking(bookingId: number): Lead | null {
  const db = getDb();
  const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(bookingId) as Record<string, unknown> | undefined;
  if (!booking) return null;

  const existing = db.prepare('SELECT id FROM leads WHERE booking_id = ?').get(bookingId);
  if (existing) return null;

  const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
  const result = db.prepare(`
    INSERT INTO leads (name, email, phone, source, stage, service_interest, estimated_value, consultation_date, consultation_time, booking_id, created_at, updated_at)
    VALUES (?, ?, ?, 'booking', 'new', ?, ?, ?, ?, ?, ?, ?)
  `).run(
    booking.name, booking.email, booking.phone,
    booking.service_type, booking.total_estimate || null,
    booking.date, booking.time_slot, bookingId, now, now
  );

  const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(result.lastInsertRowid) as Lead;

  db.prepare(`INSERT INTO lead_activities (lead_id, type, description, created_at) VALUES (?, 'created', ?, ?)`)
    .run(lead.id, `Lead created from booking #${bookingId} — ${booking.service_type}`, now);

  return lead;
}

export function createLeadFromContact(contactId: number): Lead | null {
  const db = getDb();
  const contact = db.prepare('SELECT * FROM contacts WHERE id = ?').get(contactId) as Record<string, unknown> | undefined;
  if (!contact) return null;

  const existing = db.prepare('SELECT id FROM leads WHERE contact_id = ?').get(contactId);
  if (existing) return null;

  const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
  const serviceInterest = (contact.subject as string) || null;

  const result = db.prepare(`
    INSERT INTO leads (name, email, phone, source, stage, service_interest, notes, contact_id, created_at, updated_at)
    VALUES (?, ?, ?, 'contact_form', 'new', ?, ?, ?, ?, ?)
  `).run(
    contact.name, contact.email, contact.phone || null,
    serviceInterest, contact.message || null, contactId, now, now
  );

  const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(result.lastInsertRowid) as Lead;

  db.prepare(`INSERT INTO lead_activities (lead_id, type, description, created_at) VALUES (?, 'created', ?, ?)`)
    .run(lead.id, `Lead created from contact form — ${serviceInterest || 'General Inquiry'}`, now);

  return lead;
}
