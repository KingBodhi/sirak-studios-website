import { NextRequest, NextResponse } from 'next/server';
import { getDb, type Lead, type LeadActivity, LEAD_STAGES } from '@/lib/db';
import { fireWebhooks } from '@/lib/webhooks';

export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const stage = searchParams.get('stage');

    let query = 'SELECT * FROM leads';
    const params: string[] = [];

    if (stage) {
      query += ' WHERE stage = ?';
      params.push(stage);
    }

    query += ' ORDER BY updated_at DESC';

    const leads = db.prepare(query).all(...params) as Lead[];

    // Group by stage for pipeline view
    const pipeline: Record<string, Lead[]> = {};
    for (const s of LEAD_STAGES) {
      pipeline[s.id] = [];
    }
    for (const lead of leads) {
      if (pipeline[lead.stage]) {
        pipeline[lead.stage].push(lead);
      }
    }

    return NextResponse.json({ leads, pipeline });
  } catch (error) {
    console.error('GET /api/leads error:', error);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const body = await request.json();
    const { name, email, phone, company, source, service_interest, estimated_value, notes } = body;

    if (!name?.trim() || !email?.trim()) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);

    const result = db.prepare(`
      INSERT INTO leads (name, email, phone, company, source, stage, service_interest, estimated_value, notes, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, 'new', ?, ?, ?, ?, ?)
    `).run(
      name.trim(), email.trim(), phone?.trim() || null, company?.trim() || null,
      source || 'manual', service_interest || null, estimated_value || null,
      notes?.trim() || null, now, now
    );

    const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(result.lastInsertRowid) as Lead;

    db.prepare(`INSERT INTO lead_activities (lead_id, type, description, created_at) VALUES (?, 'created', ?, ?)`)
      .run(lead.id, `Lead manually created — ${service_interest || 'No service specified'}`, now);

    fireWebhooks('lead.created', { lead }).catch(() => {});

    return NextResponse.json({ lead }, { status: 201 });
  } catch (error) {
    console.error('POST /api/leads error:', error);
    return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 });
  }
}
