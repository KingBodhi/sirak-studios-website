import { NextRequest, NextResponse } from 'next/server';
import { getDb, type WebhookConfig } from '@/lib/db';

export async function GET() {
  try {
    const db = getDb();
    const webhooks = db.prepare('SELECT * FROM webhook_configs ORDER BY created_at DESC').all() as WebhookConfig[];
    return NextResponse.json({ webhooks });
  } catch (error) {
    console.error('GET /api/webhooks error:', error);
    return NextResponse.json({ error: 'Failed to fetch webhooks' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const body = await request.json();
    const { url, events } = body;

    if (!url?.trim()) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const result = db.prepare(
      'INSERT INTO webhook_configs (url, events, active, created_at) VALUES (?, ?, 1, ?)'
    ).run(url.trim(), events || 'all', now);

    const webhook = db.prepare('SELECT * FROM webhook_configs WHERE id = ?').get(result.lastInsertRowid) as WebhookConfig;
    return NextResponse.json({ webhook }, { status: 201 });
  } catch (error) {
    console.error('POST /api/webhooks error:', error);
    return NextResponse.json({ error: 'Failed to create webhook' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const db = getDb();
    const body = await request.json();
    const { id, active } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    db.prepare('UPDATE webhook_configs SET active = ? WHERE id = ?').run(active ? 1 : 0, id);
    const webhook = db.prepare('SELECT * FROM webhook_configs WHERE id = ?').get(id) as WebhookConfig;
    return NextResponse.json({ webhook });
  } catch (error) {
    console.error('PATCH /api/webhooks error:', error);
    return NextResponse.json({ error: 'Failed to update webhook' }, { status: 500 });
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

    db.prepare('DELETE FROM webhook_configs WHERE id = ?').run(parseInt(id, 10));
    return NextResponse.json({ message: 'Webhook deleted' });
  } catch (error) {
    console.error('DELETE /api/webhooks error:', error);
    return NextResponse.json({ error: 'Failed to delete webhook' }, { status: 500 });
  }
}
