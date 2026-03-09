import { NextRequest, NextResponse } from 'next/server';
import { getDb, BlockedDate } from '@/lib/db';

export async function GET() {
  try {
    const db = getDb();
    const dates = db.prepare('SELECT * FROM blocked_dates ORDER BY date ASC').all() as BlockedDate[];
    return NextResponse.json({ blocked_dates: dates });
  } catch (error) {
    console.error('GET /api/blocked-dates error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blocked dates' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const body = await request.json();

    const { date, studio_type, reason } = body;

    if (!date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 });
    }

    // Check if date is already blocked
    const existing = db.prepare(
      'SELECT id FROM blocked_dates WHERE date = ? AND (studio_type IS NULL OR studio_type = ?)'
    ).get(date, studio_type || null);

    if (existing) {
      return NextResponse.json(
        { error: 'This date is already blocked' },
        { status: 409 }
      );
    }

    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);

    const result = db.prepare(
      'INSERT INTO blocked_dates (date, studio_type, reason, created_at) VALUES (?, ?, ?, ?)'
    ).run(date, studio_type || null, reason || null, now);

    const blocked = db.prepare('SELECT * FROM blocked_dates WHERE id = ?').get(result.lastInsertRowid) as BlockedDate;

    return NextResponse.json({ blocked_date: blocked }, { status: 201 });
  } catch (error) {
    console.error('POST /api/blocked-dates error:', error);
    return NextResponse.json(
      { error: 'Failed to block date' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const existing = db.prepare('SELECT id FROM blocked_dates WHERE id = ?').get(parseInt(id, 10));
    if (!existing) {
      return NextResponse.json({ error: 'Blocked date not found' }, { status: 404 });
    }

    db.prepare('DELETE FROM blocked_dates WHERE id = ?').run(parseInt(id, 10));

    return NextResponse.json({ message: 'Blocked date removed' });
  } catch (error) {
    console.error('DELETE /api/blocked-dates error:', error);
    return NextResponse.json(
      { error: 'Failed to remove blocked date' },
      { status: 500 }
    );
  }
}
