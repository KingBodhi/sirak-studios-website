'use client';

import { useState, useEffect, useCallback } from 'react';

interface BlockedDate {
  id: number;
  date: string;
  studio_type: string | null;
  reason: string | null;
  created_at: string;
}

interface WebhookConfig {
  id: number;
  url: string;
  events: string;
  active: number;
  created_at: string;
}

const WEBHOOK_EVENT_OPTIONS = [
  { value: 'all', label: 'All Events' },
  { value: 'lead.created', label: 'Lead Created' },
  { value: 'lead.stage_changed', label: 'Lead Stage Changed' },
  { value: 'consultation.scheduled', label: 'Consultation Scheduled' },
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function formatDate(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export default function SettingsPage() {
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Webhook state
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([]);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhookEvents, setWebhookEvents] = useState('all');
  const [webhookSubmitting, setWebhookSubmitting] = useState(false);
  const [webhookMessage, setWebhookMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [webhookDeleteLoading, setWebhookDeleteLoading] = useState<number | null>(null);

  const now = new Date();
  const [calYear, setCalYear] = useState(now.getFullYear());
  const [calMonth, setCalMonth] = useState(now.getMonth());

  const fetchBlockedDates = useCallback(async () => {
    try {
      const res = await fetch('/api/blocked-dates');
      const data = await res.json();
      setBlockedDates(data.blocked_dates || []);
    } catch (error) {
      console.error('Failed to fetch blocked dates:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchWebhooks = useCallback(async () => {
    try {
      const res = await fetch('/api/webhooks');
      const data = await res.json();
      setWebhooks(data.webhooks || []);
    } catch (error) {
      console.error('Failed to fetch webhooks:', error);
    }
  }, []);

  useEffect(() => {
    fetchBlockedDates();
    fetchWebhooks();
  }, [fetchBlockedDates, fetchWebhooks]);

  const handleAddWebhook = async () => {
    if (!webhookUrl.trim()) return;
    setWebhookSubmitting(true);
    setWebhookMessage(null);

    try {
      const res = await fetch('/api/webhooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: webhookUrl.trim(), events: webhookEvents }),
      });
      const data = await res.json();
      if (!res.ok) {
        setWebhookMessage({ type: 'error', text: data.error || 'Failed to add webhook' });
        return;
      }
      setWebhookMessage({ type: 'success', text: 'Webhook added' });
      setWebhookUrl('');
      setWebhookEvents('all');
      await fetchWebhooks();
    } catch {
      setWebhookMessage({ type: 'error', text: 'Network error' });
    } finally {
      setWebhookSubmitting(false);
    }
  };

  const toggleWebhook = async (id: number, active: boolean) => {
    try {
      await fetch('/api/webhooks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, active }),
      });
      await fetchWebhooks();
    } catch (error) {
      console.error('Failed to toggle webhook:', error);
    }
  };

  const deleteWebhook = async (id: number) => {
    setWebhookDeleteLoading(id);
    try {
      await fetch(`/api/webhooks?id=${id}`, { method: 'DELETE' });
      await fetchWebhooks();
    } catch (error) {
      console.error('Failed to delete webhook:', error);
    } finally {
      setWebhookDeleteLoading(null);
    }
  };

  const blockedSet = new Set(blockedDates.map((d) => d.date));

  const handleBlockDate = async () => {
    if (!selectedDate) return;
    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch('/api/blocked-dates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: selectedDate, reason: reason || null }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: 'error', text: data.error || 'Failed to block date' });
        return;
      }

      setMessage({ type: 'success', text: `Blocked ${selectedDate}` });
      setSelectedDate(null);
      setReason('');
      await fetchBlockedDates();
    } catch {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleUnblock = async (id: number) => {
    setDeleteLoading(id);
    try {
      const res = await fetch(`/api/blocked-dates?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchBlockedDates();
      }
    } catch (error) {
      console.error('Failed to unblock date:', error);
    } finally {
      setDeleteLoading(null);
    }
  };

  // Calendar
  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDay = getFirstDayOfMonth(calYear, calMonth);
  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

  const prevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear(calYear - 1); }
    else setCalMonth(calMonth - 1);
  };

  const nextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear(calYear + 1); }
    else setCalMonth(calMonth + 1);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="font-[family-name:var(--font-teko)] text-3xl font-bold text-sirak-text uppercase tracking-wider">
          Settings
        </h1>
        <div className="bg-sirak-card border border-sirak-border rounded-xl p-12 text-center animate-pulse">
          <p className="text-sirak-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="font-[family-name:var(--font-teko)] text-3xl font-bold text-sirak-text uppercase tracking-wider">
        Settings
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Calendar for blocking dates */}
        <div className="bg-sirak-card border border-sirak-border rounded-xl p-6">
          <h2 className="font-[family-name:var(--font-teko)] text-xl font-semibold text-sirak-text uppercase tracking-wider mb-4">
            Block Dates
          </h2>
          <p className="text-sirak-text-tertiary text-sm mb-4">
            Click a date to block it from bookings. Blocked dates appear in red.
          </p>

          {/* Calendar nav */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={prevMonth}
              className="px-3 py-1 text-sirak-text-secondary hover:text-sirak-text transition-colors"
            >
              &larr;
            </button>
            <h3 className="font-[family-name:var(--font-teko)] text-lg font-semibold text-sirak-text uppercase tracking-wider">
              {MONTH_NAMES[calMonth]} {calYear}
            </h3>
            <button
              onClick={nextMonth}
              className="px-3 py-1 text-sirak-text-secondary hover:text-sirak-text transition-colors"
            >
              &rarr;
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
              <div key={d} className="text-center text-xs text-sirak-text-tertiary uppercase py-2">
                {d}
              </div>
            ))}
            {calendarDays.map((day, i) => {
              if (day === null) return <div key={`empty-${i}`} className="p-2" />;

              const dateStr = formatDate(calYear, calMonth, day);
              const isBlocked = blockedSet.has(dateStr);
              const isSelected = selectedDate === dateStr;

              return (
                <button
                  key={dateStr}
                  onClick={() => {
                    if (isBlocked) return;
                    setSelectedDate(isSelected ? null : dateStr);
                    setMessage(null);
                  }}
                  disabled={isBlocked}
                  className={`p-2 rounded-lg text-sm transition-colors ${
                    isBlocked
                      ? 'bg-sirak-red/20 text-sirak-red cursor-not-allowed'
                      : isSelected
                      ? 'bg-sirak-red/30 border border-sirak-red/50 text-sirak-text'
                      : 'text-sirak-text-secondary hover:bg-sirak-surface/50'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Block form */}
          {selectedDate && (
            <div className="mt-4 pt-4 border-t border-sirak-border space-y-3">
              <p className="text-sm text-sirak-text">
                Block <span className="text-sirak-red font-medium">{selectedDate}</span>
              </p>
              <div>
                <label className="block text-sirak-text-tertiary text-xs uppercase tracking-wider mb-1">
                  Reason (optional)
                </label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g., Holiday, Maintenance, Private event"
                  className="w-full bg-sirak-surface border border-sirak-border rounded-lg px-4 py-2 text-sm text-sirak-text placeholder-sirak-text-tertiary focus:outline-none focus:border-sirak-red transition-colors"
                />
              </div>
              <button
                onClick={handleBlockDate}
                disabled={submitting}
                className="w-full bg-sirak-red text-white font-medium rounded-lg py-2 text-sm hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {submitting ? 'Blocking...' : 'Block This Date'}
              </button>
            </div>
          )}

          {/* Status message */}
          {message && (
            <p
              className={`mt-3 text-sm ${
                message.type === 'success' ? 'text-green-400' : 'text-sirak-red'
              }`}
            >
              {message.text}
            </p>
          )}
        </div>

        {/* List of blocked dates */}
        <div className="bg-sirak-card border border-sirak-border rounded-xl p-6">
          <h2 className="font-[family-name:var(--font-teko)] text-xl font-semibold text-sirak-text uppercase tracking-wider mb-4">
            Blocked Dates
          </h2>

          {blockedDates.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sirak-text-secondary text-sm">No dates are currently blocked.</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {blockedDates.map((bd) => (
                <div
                  key={bd.id}
                  className="flex items-center justify-between bg-sirak-surface rounded-lg px-4 py-3"
                >
                  <div>
                    <p className="text-sm text-sirak-text font-medium">{bd.date}</p>
                    {bd.reason && (
                      <p className="text-xs text-sirak-text-tertiary mt-0.5">{bd.reason}</p>
                    )}
                    {bd.studio_type && (
                      <p className="text-xs text-sirak-text-tertiary">Studio: {bd.studio_type}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleUnblock(bd.id)}
                    disabled={deleteLoading === bd.id}
                    className="px-3 py-1 text-xs font-medium rounded bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                  >
                    {deleteLoading === bd.id ? '...' : 'Remove'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Webhook Integrations */}
      <div className="bg-sirak-card border border-sirak-border rounded-xl p-6">
        <h2 className="font-[family-name:var(--font-teko)] text-xl font-semibold text-sirak-text uppercase tracking-wider mb-2">
          Webhook Integrations
        </h2>
        <p className="text-sirak-text-tertiary text-sm mb-6">
          Configure endpoints to receive notifications when leads are created, stages change, or consultations are scheduled. Connect to PCG CC MCP or any external service.
        </p>

        {/* Add webhook form */}
        <div className="bg-sirak-surface rounded-lg p-4 mb-6 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3">
            <div>
              <label className="block text-sirak-text-tertiary text-xs uppercase tracking-wider mb-1">
                Endpoint URL
              </label>
              <input
                type="url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://your-pcg-instance.com/api/webhooks/sirak"
                className="w-full bg-sirak-black border border-sirak-border rounded-lg px-4 py-2 text-sm text-sirak-text placeholder-sirak-text-tertiary focus:outline-none focus:border-sirak-red transition-colors"
              />
            </div>
            <div>
              <label className="block text-sirak-text-tertiary text-xs uppercase tracking-wider mb-1">
                Events
              </label>
              <select
                value={webhookEvents}
                onChange={(e) => setWebhookEvents(e.target.value)}
                className="w-full bg-sirak-black border border-sirak-border rounded-lg px-4 py-2 text-sm text-sirak-text focus:outline-none focus:border-sirak-red transition-colors"
              >
                {WEBHOOK_EVENT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={handleAddWebhook}
            disabled={webhookSubmitting || !webhookUrl.trim()}
            className="bg-sirak-red text-white font-medium rounded-lg px-4 py-2 text-sm hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {webhookSubmitting ? 'Adding...' : 'Add Webhook'}
          </button>
          {webhookMessage && (
            <p className={`text-sm ${webhookMessage.type === 'success' ? 'text-green-400' : 'text-sirak-red'}`}>
              {webhookMessage.text}
            </p>
          )}
        </div>

        {/* Webhook list */}
        {webhooks.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sirak-text-secondary text-sm">No webhooks configured.</p>
            <p className="text-sirak-text-tertiary text-xs mt-1">Add a PCG CC MCP endpoint to enable pipeline notifications.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {webhooks.map((wh) => (
              <div
                key={wh.id}
                className="flex items-center gap-4 bg-sirak-surface rounded-lg px-4 py-3"
              >
                <button
                  onClick={() => toggleWebhook(wh.id, !wh.active)}
                  className={`w-10 h-5 rounded-full relative transition-colors shrink-0 ${
                    wh.active ? 'bg-green-500' : 'bg-sirak-border'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                      wh.active ? 'left-5' : 'left-0.5'
                    }`}
                  />
                </button>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-sirak-text truncate">{wh.url}</p>
                  <p className="text-xs text-sirak-text-tertiary mt-0.5">
                    Events: {wh.events} · Added {wh.created_at}
                  </p>
                </div>
                <button
                  onClick={() => deleteWebhook(wh.id)}
                  disabled={webhookDeleteLoading === wh.id}
                  className="px-3 py-1 text-xs font-medium rounded bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors disabled:opacity-50 shrink-0"
                >
                  {webhookDeleteLoading === wh.id ? '...' : 'Remove'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
