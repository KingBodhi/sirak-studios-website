import { NextRequest, NextResponse } from 'next/server';
import { getDb, type Lead, type LeadActivity, LEAD_STAGES } from '@/lib/db';
import { fireWebhooks } from '@/lib/webhooks';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = getDb();
    const { id } = await params;
    const leadId = parseInt(id, 10);
    if (isNaN(leadId)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(leadId) as Lead | undefined;
    if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 });

    const activities = db.prepare('SELECT * FROM lead_activities WHERE lead_id = ? ORDER BY created_at DESC').all(leadId) as LeadActivity[];

    return NextResponse.json({ lead, activities });
  } catch (error) {
    console.error('GET /api/leads/[id] error:', error);
    return NextResponse.json({ error: 'Failed to fetch lead' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = getDb();
    const { id } = await params;
    const leadId = parseInt(id, 10);
    if (isNaN(leadId)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    const existing = db.prepare('SELECT * FROM leads WHERE id = ?').get(leadId) as Lead | undefined;
    if (!existing) return NextResponse.json({ error: 'Lead not found' }, { status: 404 });

    const body = await request.json();
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);

    const updates: string[] = [];
    const values: unknown[] = [];

    const allowedFields = ['name', 'email', 'phone', 'company', 'stage', 'service_interest', 'estimated_value', 'consultation_date', 'consultation_time', 'notes'];

    for (const field of allowedFields) {
      if (field in body) {
        updates.push(`${field} = ?`);
        values.push(body[field]);
      }
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    // Validate stage if provided
    if (body.stage) {
      const validStages = LEAD_STAGES.map(s => s.id);
      if (!validStages.includes(body.stage)) {
        return NextResponse.json({ error: `Invalid stage. Must be one of: ${validStages.join(', ')}` }, { status: 400 });
      }
    }

    updates.push('updated_at = ?');
    values.push(now);
    values.push(leadId);

    db.prepare(`UPDATE leads SET ${updates.join(', ')} WHERE id = ?`).run(...values);

    // Log activity for stage changes
    if (body.stage && body.stage !== existing.stage) {
      const fromLabel = LEAD_STAGES.find(s => s.id === existing.stage)?.label || existing.stage;
      const toLabel = LEAD_STAGES.find(s => s.id === body.stage)?.label || body.stage;
      db.prepare(`INSERT INTO lead_activities (lead_id, type, description, created_at) VALUES (?, 'stage_change', ?, ?)`)
        .run(leadId, `Stage changed: ${fromLabel} → ${toLabel}`, now);

      fireWebhooks('lead.stage_changed', {
        lead_id: leadId,
        from_stage: existing.stage,
        to_stage: body.stage,
        lead_name: existing.name,
        lead_email: existing.email,
      }).catch(() => {});

      // Fire special event for consultation scheduled
      if (body.stage === 'consultation_scheduled') {
        fireWebhooks('consultation.scheduled', {
          lead_id: leadId,
          lead_name: existing.name,
          lead_email: existing.email,
          lead_phone: existing.phone,
          service_interest: existing.service_interest,
          consultation_date: body.consultation_date || existing.consultation_date,
          consultation_time: body.consultation_time || existing.consultation_time,
        }).catch(() => {});
      }
    }

    // Log activity for note additions
    if (body.activity_note) {
      db.prepare(`INSERT INTO lead_activities (lead_id, type, description, created_at) VALUES (?, 'note', ?, ?)`)
        .run(leadId, body.activity_note, now);
    }

    const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(leadId) as Lead;
    const activities = db.prepare('SELECT * FROM lead_activities WHERE lead_id = ? ORDER BY created_at DESC LIMIT 10').all(leadId) as LeadActivity[];

    return NextResponse.json({ lead, activities });
  } catch (error) {
    console.error('PATCH /api/leads/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = getDb();
    const { id } = await params;
    const leadId = parseInt(id, 10);
    if (isNaN(leadId)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    const existing = db.prepare('SELECT id FROM leads WHERE id = ?').get(leadId);
    if (!existing) return NextResponse.json({ error: 'Lead not found' }, { status: 404 });

    db.prepare('DELETE FROM leads WHERE id = ?').run(leadId);
    return NextResponse.json({ message: 'Lead deleted' });
  } catch (error) {
    console.error('DELETE /api/leads/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete lead' }, { status: 500 });
  }
}
