import { NextRequest, NextResponse } from 'next/server';
import { getDb, type Task, TASK_STATUSES, TASK_PRIORITIES } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');

    let query = 'SELECT * FROM tasks';
    const conditions: string[] = [];
    const params: string[] = [];

    if (status) {
      conditions.push('status = ?');
      params.push(status);
    }
    if (category) {
      conditions.push('category = ?');
      params.push(category);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY CASE priority WHEN \'urgent\' THEN 0 WHEN \'high\' THEN 1 WHEN \'medium\' THEN 2 WHEN \'low\' THEN 3 END, updated_at DESC';

    const tasks = db.prepare(query).all(...params) as Task[];

    // Group by status for board view
    const board: Record<string, Task[]> = {};
    for (const s of TASK_STATUSES) {
      board[s.id] = [];
    }
    for (const task of tasks) {
      if (board[task.status]) {
        board[task.status].push(task);
      }
    }

    return NextResponse.json({ tasks, board });
  } catch (error) {
    console.error('GET /api/tasks error:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const body = await request.json();
    const { title, description, status, priority, category, assigned_to, due_date } = body;

    if (!title?.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const validStatuses = TASK_STATUSES.map(s => s.id);
    const validPriorities = TASK_PRIORITIES.map(p => p.id);

    const finalStatus = validStatuses.includes(status) ? status : 'todo';
    const finalPriority = validPriorities.includes(priority) ? priority : 'medium';

    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);

    const result = db.prepare(`
      INSERT INTO tasks (title, description, status, priority, category, assigned_to, due_date, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      title.trim(),
      description?.trim() || null,
      finalStatus,
      finalPriority,
      category || 'general',
      assigned_to?.trim() || null,
      due_date || null,
      now,
      now
    );

    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid) as Task;

    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    console.error('POST /api/tasks error:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}
