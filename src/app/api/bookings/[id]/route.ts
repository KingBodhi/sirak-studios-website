import { NextRequest, NextResponse } from 'next/server';
import { getDb, Booking } from '@/lib/db';

const VALID_STATUSES = ['pending', 'confirmed', 'cancelled', 'completed'];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = getDb();
    const { id } = await params;
    const bookingId = parseInt(id, 10);

    if (isNaN(bookingId)) {
      return NextResponse.json({ error: 'Invalid booking ID' }, { status: 400 });
    }

    const existing = db.prepare('SELECT id FROM bookings WHERE id = ?').get(bookingId);
    if (!existing) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    const body = await request.json();
    const { status } = body;

    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` },
        { status: 400 }
      );
    }

    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);

    db.prepare('UPDATE bookings SET status = ?, updated_at = ? WHERE id = ?').run(status, now, bookingId);

    const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(bookingId) as Booking;

    return NextResponse.json({ booking });
  } catch (error) {
    console.error('PATCH /api/bookings/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = getDb();
    const { id } = await params;
    const bookingId = parseInt(id, 10);

    if (isNaN(bookingId)) {
      return NextResponse.json({ error: 'Invalid booking ID' }, { status: 400 });
    }

    const existing = db.prepare('SELECT id FROM bookings WHERE id = ?').get(bookingId);
    if (!existing) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    db.prepare('DELETE FROM bookings WHERE id = ?').run(bookingId);

    return NextResponse.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/bookings/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to delete booking' },
      { status: 500 }
    );
  }
}
