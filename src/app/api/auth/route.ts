import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const body = await request.json();

    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    const passwordHash = crypto.createHash('sha256').update(password).digest('hex');

    const user = db.prepare(
      'SELECT id, username FROM admin_users WHERE username = ? AND password_hash = ?'
    ).get(username, passwordHash);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      token: 'admin-session',
    });
  } catch (error) {
    console.error('POST /api/auth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
