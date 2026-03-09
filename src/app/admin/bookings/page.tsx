'use client';

import { useState, useEffect, useCallback } from 'react';

interface Booking {
  id: number;
  name: string;
  email: string;
  phone: string;
  service_type: string;
  studio_type: string | null;
  date: string;
  time_slot: string;
  duration_hours: number;
  message: string | null;
  status: string;
  total_estimate: number | null;
  created_at: string;
  updated_at: string;
}

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  confirmed: 'bg-green-500/10 text-green-400 border-green-500/20',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
  completed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
};

const TABS = ['all', 'pending', 'confirmed', 'cancelled', 'completed'] as const;

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

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  // Calendar state
  const now = new Date();
  const [calYear, setCalYear] = useState(now.getFullYear());
  const [calMonth, setCalMonth] = useState(now.getMonth());

  const fetchBookings = useCallback(async () => {
    try {
      const res = await fetch('/api/bookings');
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const updateStatus = async (id: number, status: string) => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) await fetchBookings();
    } catch (error) {
      console.error('Failed to update booking:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const deleteBooking = async (id: number) => {
    if (!confirm('Are you sure you want to delete this booking?')) return;
    setActionLoading(id);
    try {
      const res = await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
      if (res.ok) await fetchBookings();
    } catch (error) {
      console.error('Failed to delete booking:', error);
    } finally {
      setActionLoading(null);
    }
  };

  // Filter bookings
  const filtered = bookings.filter((b) => {
    if (activeTab !== 'all' && b.status !== activeTab) return false;
    if (dateFrom && b.date < dateFrom) return false;
    if (dateTo && b.date > dateTo) return false;
    return true;
  });

  // Bookings by date for calendar
  const bookingsByDate = bookings.reduce<Record<string, Booking[]>>((acc, b) => {
    if (!acc[b.date]) acc[b.date] = [];
    acc[b.date].push(b);
    return acc;
  }, {});

  // Calendar rendering
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

  const selectedDayBookings = selectedDay ? (bookingsByDate[selectedDay] || []) : [];

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="font-[family-name:var(--font-teko)] text-3xl font-bold text-sirak-text uppercase tracking-wider">
          Bookings
        </h1>
        <div className="bg-sirak-card border border-sirak-border rounded-xl p-12 text-center animate-pulse">
          <p className="text-sirak-text-secondary">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="font-[family-name:var(--font-teko)] text-3xl font-bold text-sirak-text uppercase tracking-wider">
        Bookings
      </h1>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Status tabs */}
        <div className="flex bg-sirak-surface border border-sirak-border rounded-lg p-1 gap-0.5">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded text-xs font-medium capitalize transition-colors ${
                activeTab === tab
                  ? 'bg-sirak-red text-white'
                  : 'text-sirak-text-secondary hover:text-sirak-text'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Date filters */}
        <div className="flex items-center gap-2 ml-auto">
          <label className="text-sirak-text-tertiary text-xs uppercase tracking-wider">From</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="bg-sirak-surface border border-sirak-border rounded-lg px-3 py-1.5 text-sm text-sirak-text focus:outline-none focus:border-sirak-red transition-colors"
          />
          <label className="text-sirak-text-tertiary text-xs uppercase tracking-wider">To</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="bg-sirak-surface border border-sirak-border rounded-lg px-3 py-1.5 text-sm text-sirak-text focus:outline-none focus:border-sirak-red transition-colors"
          />
          {(dateFrom || dateTo) && (
            <button
              onClick={() => { setDateFrom(''); setDateTo(''); }}
              className="text-sirak-text-tertiary hover:text-sirak-red text-xs"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Calendar View */}
      <div className="bg-sirak-card border border-sirak-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={prevMonth}
            className="px-3 py-1 text-sirak-text-secondary hover:text-sirak-text transition-colors"
          >
            &larr;
          </button>
          <h3 className="font-[family-name:var(--font-teko)] text-xl font-semibold text-sirak-text uppercase tracking-wider">
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
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d} className="text-center text-xs text-sirak-text-tertiary uppercase py-2">
              {d}
            </div>
          ))}
          {calendarDays.map((day, i) => {
            if (day === null) {
              return <div key={`empty-${i}`} className="p-2" />;
            }
            const dateStr = formatDate(calYear, calMonth, day);
            const dayBookings = bookingsByDate[dateStr] || [];
            const hasBookings = dayBookings.length > 0;
            const isSelected = selectedDay === dateStr;

            return (
              <button
                key={dateStr}
                onClick={() => setSelectedDay(isSelected ? null : dateStr)}
                className={`p-2 rounded-lg text-sm transition-colors relative ${
                  isSelected
                    ? 'bg-sirak-red/20 border border-sirak-red/40 text-sirak-text'
                    : hasBookings
                    ? 'bg-sirak-surface hover:bg-sirak-surface/80 text-sirak-text'
                    : 'text-sirak-text-secondary hover:bg-sirak-surface/50'
                }`}
              >
                {day}
                {hasBookings && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-sirak-red" />
                )}
              </button>
            );
          })}
        </div>

        {/* Selected day bookings */}
        {selectedDay && (
          <div className="mt-4 pt-4 border-t border-sirak-border">
            <h4 className="text-sm font-medium text-sirak-text mb-3">
              Bookings for {selectedDay}
            </h4>
            {selectedDayBookings.length === 0 ? (
              <p className="text-sirak-text-tertiary text-sm">No bookings on this day.</p>
            ) : (
              <div className="space-y-2">
                {selectedDayBookings.map((b) => (
                  <div
                    key={b.id}
                    className="flex items-center justify-between bg-sirak-surface rounded-lg px-4 py-2"
                  >
                    <div>
                      <span className="text-sm text-sirak-text">{b.name}</span>
                      <span className="text-sirak-text-tertiary mx-2">|</span>
                      <span className="text-sm text-sirak-text-secondary">{b.service_type}</span>
                      <span className="text-sirak-text-tertiary mx-2">|</span>
                      <span className="text-sm text-sirak-text-secondary">{b.time_slot}</span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                        STATUS_STYLES[b.status] || ''
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bookings Table */}
      <div className="bg-sirak-card border border-sirak-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-sirak-border">
                {['Name', 'Email', 'Phone', 'Service', 'Studio', 'Date', 'Time', 'Hours', 'Status', 'Actions'].map(
                  (header) => (
                    <th
                      key={header}
                      className="text-left px-4 py-3 text-xs uppercase tracking-wider text-sirak-text-tertiary font-medium whitespace-nowrap"
                    >
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="px-4 py-12 text-center text-sirak-text-secondary"
                  >
                    No bookings found.
                  </td>
                </tr>
              ) : (
                filtered.map((booking) => (
                  <tr
                    key={booking.id}
                    className="border-b border-sirak-border/50 last:border-0 hover:bg-sirak-surface/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-sirak-text whitespace-nowrap">
                      {booking.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-sirak-text-secondary">
                      {booking.email}
                    </td>
                    <td className="px-4 py-3 text-sm text-sirak-text-secondary whitespace-nowrap">
                      {booking.phone}
                    </td>
                    <td className="px-4 py-3 text-sm text-sirak-text-secondary whitespace-nowrap">
                      {booking.service_type}
                    </td>
                    <td className="px-4 py-3 text-sm text-sirak-text-tertiary whitespace-nowrap">
                      {booking.studio_type || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-sirak-text-secondary whitespace-nowrap">
                      {booking.date}
                    </td>
                    <td className="px-4 py-3 text-sm text-sirak-text-secondary whitespace-nowrap">
                      {booking.time_slot}
                    </td>
                    <td className="px-4 py-3 text-sm text-sirak-text-secondary text-center">
                      {booking.duration_hours}h
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium border whitespace-nowrap ${
                          STATUS_STYLES[booking.status] || ''
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {booking.status === 'pending' && (
                          <button
                            onClick={() => updateStatus(booking.id, 'confirmed')}
                            disabled={actionLoading === booking.id}
                            className="px-2 py-1 text-xs font-medium rounded bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-colors disabled:opacity-50"
                          >
                            Confirm
                          </button>
                        )}
                        {(booking.status === 'pending' || booking.status === 'confirmed') && (
                          <button
                            onClick={() => updateStatus(booking.id, 'cancelled')}
                            disabled={actionLoading === booking.id}
                            className="px-2 py-1 text-xs font-medium rounded bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                          >
                            Cancel
                          </button>
                        )}
                        <button
                          onClick={() => deleteBooking(booking.id)}
                          disabled={actionLoading === booking.id}
                          className="px-2 py-1 text-xs font-medium rounded bg-sirak-surface text-sirak-text-tertiary border border-sirak-border hover:text-sirak-red hover:border-sirak-red/20 transition-colors disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
