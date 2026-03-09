import { NextRequest, NextResponse } from 'next/server';
import { getDb, Contact } from '@/lib/db';

export async function GET() {
  try {
    const db = getDb();
    const contacts = db.prepare('SELECT * FROM contacts ORDER BY created_at DESC').all() as Contact[];
    return NextResponse.json({ contacts });
  } catch (error) {
    console.error('GET /api/contact error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const body = await request.json();

    const { name, email, phone, subject, message } = body;

    // Validate required fields
    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    if (!email || !email.trim()) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    if (!message || !message.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);

    const result = db.prepare(`
      INSERT INTO contacts (name, email, phone, subject, message, status, created_at)
      VALUES (?, ?, ?, ?, ?, 'unread', ?)
    `).run(
      name.trim(), email.trim(), phone?.trim() || null,
      subject?.trim() || null, message.trim(), now
    );

    const contact = db.prepare('SELECT * FROM contacts WHERE id = ?').get(result.lastInsertRowid) as Contact;

    // Auto-create lead from contact
    const { createLeadFromContact, fireWebhooks } = await import('@/lib/webhooks');
    const lead = createLeadFromContact(contact.id);
    if (lead) {
      fireWebhooks('lead.created', { lead, source: 'contact_form' }).catch(() => {});
    }

    return NextResponse.json({ contact }, { status: 201 });
  } catch (error) {
    console.error('POST /api/contact error:', error);
    return NextResponse.json(
      { error: 'Failed to submit contact form' },
      { status: 500 }
    );
  }
}
