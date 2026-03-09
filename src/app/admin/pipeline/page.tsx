'use client';

import { useState, useEffect, useCallback } from 'react';

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  source: string;
  stage: string;
  service_interest: string | null;
  estimated_value: number | null;
  consultation_date: string | null;
  consultation_time: string | null;
  notes: string | null;
  booking_id: number | null;
  contact_id: number | null;
  created_at: string;
  updated_at: string;
}

interface LeadActivity {
  id: number;
  lead_id: number;
  type: string;
  description: string;
  created_at: string;
}

const STAGES = [
  { id: 'new', label: 'New Lead', color: 'blue', bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', dot: 'bg-blue-400' },
  { id: 'contacted', label: 'Contacted', color: 'yellow', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400', dot: 'bg-yellow-400' },
  { id: 'consultation_scheduled', label: 'Consultation', color: 'purple', bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400', dot: 'bg-purple-400' },
  { id: 'proposal_sent', label: 'Proposal Sent', color: 'cyan', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400', dot: 'bg-cyan-400' },
  { id: 'negotiation', label: 'Negotiation', color: 'orange', bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400', dot: 'bg-orange-400' },
  { id: 'closed_won', label: 'Won', color: 'green', bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400', dot: 'bg-green-400' },
  { id: 'closed_lost', label: 'Lost', color: 'red', bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', dot: 'bg-red-400' },
];

const SOURCE_LABELS: Record<string, string> = {
  booking: 'Booking',
  contact_form: 'Contact Form',
  manual: 'Manual Entry',
  referral: 'Referral',
  website: 'Website',
};

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr.replace(' ', 'T') + 'Z').getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function PipelinePage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [pipeline, setPipeline] = useState<Record<string, Lead[]>>({});
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [activities, setActivities] = useState<LeadActivity[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [showNewLead, setShowNewLead] = useState(false);
  const [newLeadForm, setNewLeadForm] = useState({ name: '', email: '', phone: '', company: '', service_interest: '', estimated_value: '', notes: '' });

  const fetchLeads = useCallback(async () => {
    try {
      const res = await fetch('/api/leads');
      const data = await res.json();
      setLeads(data.leads || []);
      setPipeline(data.pipeline || {});
    } catch (err) {
      console.error('Failed to fetch leads:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const openLeadDetail = async (lead: Lead) => {
    setSelectedLead(lead);
    setDetailLoading(true);
    setNewNote('');
    try {
      const res = await fetch(`/api/leads/${lead.id}`);
      const data = await res.json();
      setActivities(data.activities || []);
    } catch {
      setActivities([]);
    } finally {
      setDetailLoading(false);
    }
  };

  const updateLeadStage = async (leadId: number, newStage: string) => {
    setActionLoading(true);
    try {
      await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: newStage }),
      });
      await fetchLeads();
      if (selectedLead?.id === leadId) {
        const res = await fetch(`/api/leads/${leadId}`);
        const data = await res.json();
        setSelectedLead(data.lead);
        setActivities(data.activities || []);
      }
    } catch (err) {
      console.error('Failed to update stage:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const updateLeadField = async (leadId: number, field: string, value: string) => {
    try {
      await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value }),
      });
      await fetchLeads();
      if (selectedLead?.id === leadId) {
        const res = await fetch(`/api/leads/${leadId}`);
        const data = await res.json();
        setSelectedLead(data.lead);
      }
    } catch (err) {
      console.error('Failed to update field:', err);
    }
  };

  const addNote = async () => {
    if (!selectedLead || !newNote.trim()) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/leads/${selectedLead.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activity_note: newNote.trim() }),
      });
      const data = await res.json();
      setActivities(data.activities || []);
      setNewNote('');
    } catch (err) {
      console.error('Failed to add note:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const createLead = async () => {
    setActionLoading(true);
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newLeadForm,
          source: 'manual',
          estimated_value: newLeadForm.estimated_value ? parseFloat(newLeadForm.estimated_value) : null,
        }),
      });
      setShowNewLead(false);
      setNewLeadForm({ name: '', email: '', phone: '', company: '', service_interest: '', estimated_value: '', notes: '' });
      await fetchLeads();
    } catch (err) {
      console.error('Failed to create lead:', err);
    } finally {
      setActionLoading(false);
    }
  };

  // Pipeline stats
  const totalValue = leads.filter(l => l.stage !== 'closed_lost').reduce((sum, l) => sum + (l.estimated_value || 0), 0);
  const wonValue = leads.filter(l => l.stage === 'closed_won').reduce((sum, l) => sum + (l.estimated_value || 0), 0);
  const activeLeads = leads.filter(l => !['closed_won', 'closed_lost'].includes(l.stage)).length;
  const consultationsToday = leads.filter(l => {
    const today = new Date().toISOString().slice(0, 10);
    return l.stage === 'consultation_scheduled' && l.consultation_date === today;
  }).length;

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="font-[family-name:var(--font-teko)] text-3xl font-bold text-sirak-text uppercase tracking-wider">
          Deal Pipeline
        </h1>
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-teko)] text-3xl font-bold text-sirak-text uppercase tracking-wider">
          Deal Pipeline
        </h1>
        <button
          onClick={() => setShowNewLead(true)}
          className="px-4 py-2 bg-sirak-red text-white text-sm font-semibold rounded-lg hover:brightness-110 transition-all"
        >
          + New Lead
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-sirak-card border border-sirak-border rounded-xl p-5">
          <p className="text-sirak-text-tertiary text-xs uppercase tracking-wider mb-1">Active Leads</p>
          <p className="text-2xl font-bold text-sirak-text">{activeLeads}</p>
        </div>
        <div className="bg-sirak-card border border-sirak-border rounded-xl p-5">
          <p className="text-sirak-text-tertiary text-xs uppercase tracking-wider mb-1">Pipeline Value</p>
          <p className="text-2xl font-bold text-sirak-cyan">${totalValue.toLocaleString()}</p>
        </div>
        <div className="bg-sirak-card border border-sirak-border rounded-xl p-5">
          <p className="text-sirak-text-tertiary text-xs uppercase tracking-wider mb-1">Won Revenue</p>
          <p className="text-2xl font-bold text-green-400">${wonValue.toLocaleString()}</p>
        </div>
        <div className="bg-sirak-card border border-sirak-border rounded-xl p-5">
          <p className="text-sirak-text-tertiary text-xs uppercase tracking-wider mb-1">Consultations Today</p>
          <p className="text-2xl font-bold text-purple-400">{consultationsToday}</p>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-3 overflow-x-auto pb-4">
        {STAGES.map((stage) => {
          const stageLeads = pipeline[stage.id] || [];
          const stageValue = stageLeads.reduce((sum, l) => sum + (l.estimated_value || 0), 0);

          return (
            <div
              key={stage.id}
              className="flex-shrink-0 w-64 bg-sirak-surface border border-sirak-border rounded-xl flex flex-col max-h-[calc(100vh-320px)]"
            >
              {/* Column Header */}
              <div className="p-3 border-b border-sirak-border">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${stage.dot}`} />
                    <span className="text-xs font-semibold text-sirak-text uppercase tracking-wider">
                      {stage.label}
                    </span>
                  </div>
                  <span className={`text-xs font-bold ${stage.text}`}>{stageLeads.length}</span>
                </div>
                {stageValue > 0 && (
                  <p className="text-xs text-sirak-text-tertiary">${stageValue.toLocaleString()}</p>
                )}
              </div>

              {/* Cards */}
              <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {stageLeads.map((lead) => (
                  <button
                    key={lead.id}
                    onClick={() => openLeadDetail(lead)}
                    className={`w-full text-left p-3 rounded-lg border ${stage.border} ${stage.bg} hover:brightness-110 transition-all`}
                  >
                    <p className="text-sm font-medium text-sirak-text truncate">{lead.name}</p>
                    {lead.company && (
                      <p className="text-xs text-sirak-text-tertiary truncate">{lead.company}</p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-sirak-text-tertiary">
                        {lead.service_interest || SOURCE_LABELS[lead.source] || lead.source}
                      </span>
                      {lead.estimated_value && (
                        <span className={`text-xs font-semibold ${stage.text}`}>
                          ${lead.estimated_value.toLocaleString()}
                        </span>
                      )}
                    </div>
                    {lead.consultation_date && lead.stage === 'consultation_scheduled' && (
                      <p className="text-xs text-purple-400 mt-1">
                        {lead.consultation_date} {lead.consultation_time || ''}
                      </p>
                    )}
                    <p className="text-[10px] text-sirak-text-tertiary mt-1">{timeAgo(lead.updated_at)}</p>
                  </button>
                ))}
                {stageLeads.length === 0 && (
                  <p className="text-xs text-sirak-text-tertiary text-center py-4">No leads</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ══════ LEAD DETAIL PANEL ══════ */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setSelectedLead(null)}>
          <div className="absolute inset-0 bg-black/60" />
          <div
            className="relative w-full max-w-lg bg-sirak-card border-l border-sirak-border h-full overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-[family-name:var(--font-teko)] text-2xl font-bold text-sirak-text uppercase tracking-wider">
                    {selectedLead.name}
                  </h2>
                  {selectedLead.company && (
                    <p className="text-sirak-text-secondary text-sm">{selectedLead.company}</p>
                  )}
                </div>
                <button onClick={() => setSelectedLead(null)} className="text-sirak-text-tertiary hover:text-sirak-text p-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Contact Info */}
              <div className="space-y-2">
                <a href={`mailto:${selectedLead.email}`} className="flex items-center gap-2 text-sm text-sirak-cyan hover:underline">
                  {selectedLead.email}
                </a>
                {selectedLead.phone && (
                  <a href={`tel:${selectedLead.phone}`} className="flex items-center gap-2 text-sm text-sirak-text-secondary hover:text-sirak-cyan">
                    {selectedLead.phone}
                  </a>
                )}
              </div>

              {/* Stage Selector */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-sirak-text-tertiary mb-2">Pipeline Stage</label>
                <div className="flex flex-wrap gap-1.5">
                  {STAGES.map((stage) => (
                    <button
                      key={stage.id}
                      onClick={() => updateLeadStage(selectedLead.id, stage.id)}
                      disabled={actionLoading}
                      className={`px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
                        selectedLead.stage === stage.id
                          ? `${stage.bg} ${stage.text} ${stage.border}`
                          : 'border-sirak-border text-sirak-text-tertiary hover:text-sirak-text'
                      }`}
                    >
                      {stage.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-sirak-text-tertiary mb-1">Service Interest</label>
                  <p className="text-sm text-sirak-text">{selectedLead.service_interest || '-'}</p>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-sirak-text-tertiary mb-1">Estimated Value</label>
                  <input
                    type="number"
                    defaultValue={selectedLead.estimated_value || ''}
                    onBlur={(e) => updateLeadField(selectedLead.id, 'estimated_value', e.target.value)}
                    placeholder="$0"
                    className="w-full bg-sirak-surface border border-sirak-border rounded px-3 py-1.5 text-sm text-sirak-text focus:outline-none focus:border-sirak-red"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-sirak-text-tertiary mb-1">Consultation Date</label>
                  <input
                    type="date"
                    defaultValue={selectedLead.consultation_date || ''}
                    onChange={(e) => updateLeadField(selectedLead.id, 'consultation_date', e.target.value)}
                    className="w-full bg-sirak-surface border border-sirak-border rounded px-3 py-1.5 text-sm text-sirak-text focus:outline-none focus:border-sirak-red"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-sirak-text-tertiary mb-1">Consultation Time</label>
                  <input
                    type="time"
                    defaultValue={selectedLead.consultation_time || ''}
                    onChange={(e) => updateLeadField(selectedLead.id, 'consultation_time', e.target.value)}
                    className="w-full bg-sirak-surface border border-sirak-border rounded px-3 py-1.5 text-sm text-sirak-text focus:outline-none focus:border-sirak-red"
                  />
                </div>
              </div>

              <div className="text-xs text-sirak-text-tertiary flex items-center gap-3">
                <span>Source: {SOURCE_LABELS[selectedLead.source] || selectedLead.source}</span>
                <span>Created: {selectedLead.created_at.slice(0, 10)}</span>
              </div>

              {/* Notes */}
              {selectedLead.notes && (
                <div>
                  <label className="block text-xs uppercase tracking-wider text-sirak-text-tertiary mb-1">Original Message</label>
                  <p className="text-sm text-sirak-text-secondary bg-sirak-surface rounded-lg p-3 max-h-24 overflow-y-auto">
                    {selectedLead.notes}
                  </p>
                </div>
              )}

              {/* Add Note */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-sirak-text-tertiary mb-1">Add Activity Note</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addNote()}
                    placeholder="Called, emailed, sent proposal..."
                    className="flex-1 bg-sirak-surface border border-sirak-border rounded px-3 py-2 text-sm text-sirak-text placeholder-sirak-text-tertiary focus:outline-none focus:border-sirak-red"
                  />
                  <button
                    onClick={addNote}
                    disabled={!newNote.trim() || actionLoading}
                    className="px-3 py-2 bg-sirak-red text-white text-xs font-semibold rounded hover:brightness-110 disabled:opacity-50"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Activity Timeline */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-sirak-text-tertiary mb-3">Activity</label>
                {detailLoading ? (
                  <p className="text-sm text-sirak-text-tertiary">Loading...</p>
                ) : activities.length === 0 ? (
                  <p className="text-sm text-sirak-text-tertiary">No activity yet.</p>
                ) : (
                  <div className="space-y-3">
                    {activities.map((activity) => (
                      <div key={activity.id} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className={`w-2 h-2 rounded-full mt-1.5 ${
                            activity.type === 'stage_change' ? 'bg-sirak-red' :
                            activity.type === 'created' ? 'bg-blue-400' : 'bg-sirak-text-tertiary'
                          }`} />
                          <div className="w-px flex-1 bg-sirak-border" />
                        </div>
                        <div className="pb-3">
                          <p className="text-sm text-sirak-text-secondary">{activity.description}</p>
                          <p className="text-[10px] text-sirak-text-tertiary mt-0.5">{timeAgo(activity.created_at)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════ NEW LEAD MODAL ══════ */}
      {showNewLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setShowNewLead(false)}>
          <div className="absolute inset-0 bg-black/60" />
          <div
            className="relative bg-sirak-card border border-sirak-border rounded-xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-[family-name:var(--font-teko)] text-xl font-bold text-sirak-text uppercase tracking-wider mb-4">
              New Lead
            </h3>
            <div className="space-y-3">
              {[
                { key: 'name', label: 'Name *', type: 'text', placeholder: 'Full name' },
                { key: 'email', label: 'Email *', type: 'email', placeholder: 'email@example.com' },
                { key: 'phone', label: 'Phone', type: 'tel', placeholder: '(305) 555-0000' },
                { key: 'company', label: 'Company', type: 'text', placeholder: 'Company name' },
                { key: 'service_interest', label: 'Service Interest', type: 'text', placeholder: 'Brand Identity, Social Media, etc.' },
                { key: 'estimated_value', label: 'Estimated Value ($)', type: 'number', placeholder: '0' },
              ].map(({ key, label, type, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs uppercase tracking-wider text-sirak-text-tertiary mb-1">{label}</label>
                  <input
                    type={type}
                    value={newLeadForm[key as keyof typeof newLeadForm]}
                    onChange={(e) => setNewLeadForm(f => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full bg-sirak-surface border border-sirak-border rounded-lg px-3 py-2 text-sm text-sirak-text placeholder-sirak-text-tertiary focus:outline-none focus:border-sirak-red"
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs uppercase tracking-wider text-sirak-text-tertiary mb-1">Notes</label>
                <textarea
                  value={newLeadForm.notes}
                  onChange={(e) => setNewLeadForm(f => ({ ...f, notes: e.target.value }))}
                  rows={3}
                  placeholder="Additional context..."
                  className="w-full bg-sirak-surface border border-sirak-border rounded-lg px-3 py-2 text-sm text-sirak-text placeholder-sirak-text-tertiary focus:outline-none focus:border-sirak-red resize-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-5">
              <button onClick={() => setShowNewLead(false)} className="px-4 py-2 text-sm text-sirak-text-secondary hover:text-sirak-text">
                Cancel
              </button>
              <button
                onClick={createLead}
                disabled={!newLeadForm.name.trim() || !newLeadForm.email.trim() || actionLoading}
                className="px-4 py-2 bg-sirak-red text-white text-sm font-semibold rounded-lg hover:brightness-110 disabled:opacity-50"
              >
                Create Lead
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
