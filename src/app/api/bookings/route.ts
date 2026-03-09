import { NextRequest, NextResponse } from 'next/server';
import { getDb, Booking } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const date = searchParams.get('date');

    let query = 'SELECT * FROM bookings';
    const conditions: string[] = [];
    const params: string[] = [];

    if (status) {
      conditions.push('status = ?');
      params.push(status);
    }

    if (date) {
      conditions.push('date = ?');
      params.push(date);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY date DESC, time_slot DESC';

    const bookings = db.prepare(query).all(...params) as Booking[];
    return NextResponse.json({ bookings });
  } catch (error) {
    console.error('GET /api/bookings error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const body = await request.json();

    const { name, email, phone, service_type, studio_type, date, time_slot, duration_hours, message, total_estimate } = body;

    // Validate required fields
    const requiredFields = { name, email, phone, service_type, date, time_slot, duration_hours };
    const missing = Object.entries(requiredFields)
      .filter(([, value]) => !value && value !== 0)
      .map(([key]) => key);

    if (missing.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missing.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if date is blocked
    const blockedDate = db.prepare(
      'SELECT id FROM blocked_dates WHERE date = ? AND (studio_type IS NULL OR studio_type = ?)'
    ).get(date, studio_type || null);

    if (blockedDate) {
      return NextResponse.json(
        { error: 'The selected date is not available for booking' },
        { status: 409 }
      );
    }

    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);

    const result = db.prepare(`
      INSERT INTO bookings (name, email, phone, service_type, studio_type, date, time_slot, duration_hours, message, status, total_estimate, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?)
    `).run(
      name, email, phone, service_type, studio_type || null,
      date, time_slot, duration_hours, message || null,
      total_estimate || null, now, now
    );

    const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(result.lastInsertRowid) as Booking;

    // Auto-create lead from booking
    const { createLeadFromBooking } = await import('@/lib/webhooks');
    const lead = createLeadFromBooking(booking.id);
    if (lead) {
      const { fireWebhooks } = await import('@/lib/webhooks');
      fireWebhooks('lead.created', { lead, source: 'booking' }).catch(() => {});
    }

    return NextResponse.json({ booking }, { status: 201 });
  } catch (error) {
    console.error('POST /api/bookings error:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}
