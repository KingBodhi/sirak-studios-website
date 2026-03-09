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

interface Lead {
  id: number;
  name: string;
  stage: string;
  estimated_value: number | null;
  consultation_date: string | null;
}

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  confirmed: 'bg-green-500/10 text-green-400 border-green-500/20',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
  completed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
};

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [contactCount, setContactCount] = useState(0);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [bookingsRes, contactsRes, leadsRes] = await Promise.all([
        fetch('/api/bookings'),
        fetch('/api/contact'),
        fetch('/api/leads'),
      ]);

      const bookingsData = await bookingsRes.json();
      const contactsData = await contactsRes.json();
      const leadsData = await leadsRes.json();

      setBookings(bookingsData.bookings || []);
      setContactCount(contactsData.contacts?.length || 0);
      setLeads(leadsData.leads || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateStatus = async (id: number, status: string) => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        await fetchData();
      }
    } catch (error) {
      console.error('Failed to update booking:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter((b) => b.status === 'pending').length;
  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed').length;
  const recentBookings = bookings.slice(0, 10);

  const activeLeads = leads.filter((l) => !['closed_won', 'closed_lost'].includes(l.stage)).length;
  const pipelineValue = leads
    .filter((l) => !['closed_won', 'closed_lost'].includes(l.stage))
    .reduce((sum, l) => sum + (l.estimated_value || 0), 0);
  const wonRevenue = leads
    .filter((l) => l.stage === 'closed_won')
    .reduce((sum, l) => sum + (l.estimated_value || 0), 0);
  const today = new Date().toISOString().slice(0, 10);
  const consultationsToday = leads.filter((l) => l.consultation_date === today).length;

  const stats = [
    { label: 'Total Bookings', value: totalBookings, color: 'text-sirak-text' },
    { label: 'Pending', value: pendingBookings, color: 'text-yellow-400' },
    { label: 'Confirmed', value: confirmedBookings, color: 'text-green-400' },
    { label: 'Contact Messages', value: contactCount, color: 'text-sirak-cyan' },
  ];

  const pipelineStats = [
    { label: 'Active Leads', value: activeLeads, color: 'text-blue-400' },
    { label: 'Pipeline Value', value: `$${pipelineValue.toLocaleString()}`, color: 'text-purple-400' },
    { label: 'Won Revenue', value: `$${wonRevenue.toLocaleString()}`, color: 'text-green-400' },
    { label: 'Consultations Today', value: consultationsToday, color: 'text-orange-400' },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="font-[family-name:var(--font-teko)] text-3xl font-bold text-sirak-text uppercase tracking-wider">
          Dashboard
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-sirak-card border border-sirak-border rounded-xl p-6 animate-pulse">
              <div className="h-4 bg-sirak-surface rounded w-24 mb-3" />
              <div className="h-8 bg-sirak-surface rounded w-16" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="font-[family-name:var(--font-teko)] text-3xl font-bold text-sirak-text uppercase tracking-wider">
        Dashboard
      </h1>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-sirak-card border border-sirak-border rounded-xl p-6"
          >
            <p className="text-sirak-text-tertiary text-xs uppercase tracking-wider mb-1">
              {stat.label}
            </p>
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Pipeline stats */}
      <div>
        <h2 className="font-[family-name:var(--font-teko)] text-xl font-semibold text-sirak-text uppercase tracking-wider mb-4">
          Sales Pipeline
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {pipelineStats.map((stat) => (
            <div
              key={stat.label}
              className="bg-sirak-card border border-sirak-border rounded-xl p-6"
            >
              <p className="text-sirak-text-tertiary text-xs uppercase tracking-wider mb-1">
                {stat.label}
              </p>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent bookings */}
      <div>
        <h2 className="font-[family-name:var(--font-teko)] text-xl font-semibold text-sirak-text uppercase tracking-wider mb-4">
          Recent Bookings
        </h2>

        {recentBookings.length === 0 ? (
          <div className="bg-sirak-card border border-sirak-border rounded-xl p-12 text-center">
            <p className="text-sirak-text-secondary">No bookings yet.</p>
          </div>
        ) : (
          <div className="bg-sirak-card border border-sirak-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-sirak-border">
                    <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-sirak-text-tertiary font-medium">
                      Name
                    </th>
                    <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-sirak-text-tertiary font-medium">
                      Service
                    </th>
                    <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-sirak-text-tertiary font-medium">
                      Date
                    </th>
                    <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-sirak-text-tertiary font-medium">
                      Time
                    </th>
                    <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-sirak-text-tertiary font-medium">
                      Status
                    </th>
                    <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-sirak-text-tertiary font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="border-b border-sirak-border/50 last:border-0 hover:bg-sirak-surface/50 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm text-sirak-text">
                        {booking.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-sirak-text-secondary">
                        {booking.service_type}
                      </td>
                      <td className="px-4 py-3 text-sm text-sirak-text-secondary">
                        {booking.date}
                      </td>
                      <td className="px-4 py-3 text-sm text-sirak-text-secondary">
                        {booking.time_slot}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            STATUS_STYLES[booking.status] || ''
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {booking.status === 'pending' && (
                            <button
                              onClick={() => updateStatus(booking.id, 'confirmed')}
                              disabled={actionLoading === booking.id}
                              className="px-2.5 py-1 text-xs font-medium rounded bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-colors disabled:opacity-50"
                            >
                              Confirm
                            </button>
                          )}
                          {(booking.status === 'pending' ||
                            booking.status === 'confirmed') && (
                            <button
                              onClick={() => updateStatus(booking.id, 'cancelled')}
                              disabled={actionLoading === booking.id}
                              className="px-2.5 py-1 text-xs font-medium rounded bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
