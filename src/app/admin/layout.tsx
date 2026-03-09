'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const stored = localStorage.getItem('sirak-admin-token');
    setToken(stored);
    setChecking(false);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoggingIn(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setLoginError(data.error || 'Login failed');
        return;
      }

      localStorage.setItem('sirak-admin-token', data.token);
      setToken(data.token);
    } catch {
      setLoginError('Network error. Please try again.');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('sirak-admin-token');
    setToken(null);
    setUsername('');
    setPassword('');
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-sirak-black flex items-center justify-center">
        <div className="animate-pulse text-sirak-text-secondary">Loading...</div>
      </div>
    );
  }

  // Login screen
  if (!token) {
    return (
      <div className="min-h-screen bg-sirak-black flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="bg-sirak-card border border-sirak-border rounded-xl p-8">
            <div className="text-center mb-8">
              <h1 className="font-[family-name:var(--font-teko)] text-3xl font-bold text-sirak-red uppercase tracking-wider">
                Sirak Studios
              </h1>
              <p className="text-sirak-text-secondary text-sm mt-1">Admin Panel</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sirak-text-secondary text-xs uppercase tracking-wider mb-1.5">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-sirak-surface border border-sirak-border rounded-lg px-4 py-2.5 text-sirak-text placeholder-sirak-text-tertiary focus:outline-none focus:border-sirak-red transition-colors"
                  placeholder="Enter username"
                  required
                />
              </div>

              <div>
                <label className="block text-sirak-text-secondary text-xs uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-sirak-surface border border-sirak-border rounded-lg px-4 py-2.5 text-sirak-text placeholder-sirak-text-tertiary focus:outline-none focus:border-sirak-red transition-colors"
                  placeholder="Enter password"
                  required
                />
              </div>

              {loginError && (
                <p className="text-sirak-red text-sm">{loginError}</p>
              )}

              <button
                type="submit"
                disabled={loggingIn}
                className="w-full bg-sirak-red text-white font-semibold rounded-lg py-2.5 hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loggingIn ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Admin layout with sidebar
  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: '◆' },
    { href: '/admin/tasks', label: 'Tasks', icon: '◫' },
    { href: '/admin/pipeline', label: 'Pipeline', icon: '◎' },
    { href: '/admin/bookings', label: 'Bookings', icon: '◈' },
    { href: '/admin/settings', label: 'Settings', icon: '◇' },
  ];

  return (
    <div className="min-h-screen bg-sirak-black flex">
      {/* Sidebar */}
      <aside className="w-64 bg-sirak-surface border-r border-sirak-border flex flex-col shrink-0">
        <div className="p-6 border-b border-sirak-border">
          <Link href="/admin">
            <h1 className="font-[family-name:var(--font-teko)] text-2xl font-bold text-sirak-red uppercase tracking-wider">
              Sirak Studios
            </h1>
            <p className="text-sirak-text-tertiary text-xs uppercase tracking-wider mt-0.5">
              Admin Panel
            </p>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-sirak-red/10 text-sirak-red border border-sirak-red/20'
                    : 'text-sirak-text-secondary hover:text-sirak-text hover:bg-sirak-card'
                }`}
              >
                <span className="text-xs">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sirak-border">
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2.5 rounded-lg text-sm text-sirak-text-tertiary hover:text-sirak-red hover:bg-sirak-card transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
