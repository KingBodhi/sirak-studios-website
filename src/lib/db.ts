import Database from 'better-sqlite3';
import path from 'path';

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(path.join(process.cwd(), 'db', 'sirak.db'));
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
  }
  return db;
}

export interface Booking {
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

export interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: string;
  created_at: string;
}

export interface BlockedDate {
  id: number;
  date: string;
  studio_type: string | null;
  reason: string | null;
  created_at: string;
}

export type LeadStage = 'new' | 'contacted' | 'consultation_scheduled' | 'proposal_sent' | 'negotiation' | 'closed_won' | 'closed_lost';

export const LEAD_STAGES: { id: LeadStage; label: string; color: string }[] = [
  { id: 'new', label: 'New Lead', color: 'blue' },
  { id: 'contacted', label: 'Contacted', color: 'yellow' },
  { id: 'consultation_scheduled', label: 'Consultation Scheduled', color: 'purple' },
  { id: 'proposal_sent', label: 'Proposal Sent', color: 'cyan' },
  { id: 'negotiation', label: 'Negotiation', color: 'orange' },
  { id: 'closed_won', label: 'Closed Won', color: 'green' },
  { id: 'closed_lost', label: 'Closed Lost', color: 'red' },
];

export interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  source: string;
  stage: LeadStage;
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

export interface LeadActivity {
  id: number;
  lead_id: number;
  type: string;
  description: string;
  created_at: string;
}

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export const TASK_STATUSES: { id: TaskStatus; label: string }[] = [
  { id: 'todo', label: 'To Do' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'review', label: 'Review' },
  { id: 'completed', label: 'Completed' },
];

export const TASK_PRIORITIES: { id: TaskPriority; label: string }[] = [
  { id: 'urgent', label: 'Urgent' },
  { id: 'high', label: 'High' },
  { id: 'medium', label: 'Medium' },
  { id: 'low', label: 'Low' },
];

export const TASK_CATEGORIES = [
  'general', 'design', 'development', 'content', 'marketing', 'seo', 'client', 'admin'
] as const;

export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  category: string;
  assigned_to: string | null;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface WebhookConfig {
  id: number;
  url: string;
  events: string;
  active: number;
  created_at: string;
}
