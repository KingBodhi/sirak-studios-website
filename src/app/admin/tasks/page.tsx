'use client';

import { useState, useEffect, useCallback } from 'react';

interface Task {
  id: number;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  category: string;
  assigned_to: string | null;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

const STATUSES = [
  { id: 'todo', label: 'To Do', dot: 'bg-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/30', text: 'text-slate-400' },
  { id: 'in_progress', label: 'In Progress', dot: 'bg-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400' },
  { id: 'review', label: 'Review', dot: 'bg-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400' },
  { id: 'completed', label: 'Completed', dot: 'bg-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400' },
];

const PRIORITIES = [
  { id: 'urgent', label: 'Urgent', color: 'text-red-400 bg-red-500/10 border-red-500/20' },
  { id: 'high', label: 'High', color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
  { id: 'medium', label: 'Medium', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' },
  { id: 'low', label: 'Low', color: 'text-slate-400 bg-slate-500/10 border-slate-500/20' },
];

const CATEGORIES = ['general', 'design', 'development', 'content', 'marketing', 'seo', 'client', 'admin'];

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

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [board, setBoard] = useState<Record<string, Task[]>>({});
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showNewTask, setShowNewTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [newTaskForm, setNewTaskForm] = useState({
    title: '', description: '', priority: 'medium', category: 'general', assigned_to: '', due_date: '',
  });

  const fetchTasks = useCallback(async () => {
    try {
      const url = filterCategory !== 'all' ? `/api/tasks?category=${filterCategory}` : '/api/tasks';
      const res = await fetch(url);
      const data = await res.json();
      setTasks(data.tasks || []);
      setBoard(data.board || {});
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    } finally {
      setLoading(false);
    }
  }, [filterCategory]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const createTask = async () => {
    if (!newTaskForm.title.trim()) return;
    setActionLoading(true);
    try {
      await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newTaskForm,
          assigned_to: newTaskForm.assigned_to || null,
          due_date: newTaskForm.due_date || null,
        }),
      });
      setShowNewTask(false);
      setNewTaskForm({ title: '', description: '', priority: 'medium', category: 'general', assigned_to: '', due_date: '' });
      await fetchTasks();
    } catch (err) {
      console.error('Failed to create task:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const updateTask = async (id: number, updates: Record<string, string | null>) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (selectedTask?.id === id) {
        setSelectedTask(data.task);
      }
      await fetchTasks();
    } catch (err) {
      console.error('Failed to update task:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const deleteTask = async (id: number) => {
    if (!confirm('Delete this task?')) return;
    setActionLoading(true);
    try {
      await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      setSelectedTask(null);
      await fetchTasks();
    } catch (err) {
      console.error('Failed to delete task:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const getPriorityStyle = (priority: string) =>
    PRIORITIES.find(p => p.id === priority)?.color || '';

  const totalTasks = tasks.length;
  const todoCount = tasks.filter(t => t.status === 'todo').length;
  const inProgressCount = tasks.filter(t => t.status === 'in_progress').length;
  const completedCount = tasks.filter(t => t.status === 'completed').length;

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="font-[family-name:var(--font-teko)] text-3xl font-bold text-sirak-text uppercase tracking-wider">
          Tasks
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
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-[family-name:var(--font-teko)] text-3xl font-bold text-sirak-text uppercase tracking-wider">
          Tasks
        </h1>
        <div className="flex items-center gap-3">
          {/* Category filter */}
          <select
            value={filterCategory}
            onChange={(e) => { setFilterCategory(e.target.value); setLoading(true); }}
            className="bg-sirak-surface border border-sirak-border rounded-lg px-3 py-2 text-sm text-sirak-text focus:outline-none focus:border-sirak-red"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
            ))}
          </select>

          {/* View toggle */}
          <div className="flex bg-sirak-surface border border-sirak-border rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('board')}
              className={`px-3 py-2 text-xs font-medium transition-colors ${
                viewMode === 'board' ? 'bg-sirak-red/10 text-sirak-red' : 'text-sirak-text-tertiary hover:text-sirak-text'
              }`}
            >
              Board
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 text-xs font-medium transition-colors ${
                viewMode === 'list' ? 'bg-sirak-red/10 text-sirak-red' : 'text-sirak-text-tertiary hover:text-sirak-text'
              }`}
            >
              List
            </button>
          </div>

          <button
            onClick={() => setShowNewTask(true)}
            className="px-4 py-2 bg-sirak-red text-white text-sm font-semibold rounded-lg hover:brightness-110 transition-all"
          >
            + New Task
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-sirak-card border border-sirak-border rounded-xl p-5">
          <p className="text-sirak-text-tertiary text-xs uppercase tracking-wider mb-1">Total Tasks</p>
          <p className="text-2xl font-bold text-sirak-text">{totalTasks}</p>
        </div>
        <div className="bg-sirak-card border border-sirak-border rounded-xl p-5">
          <p className="text-sirak-text-tertiary text-xs uppercase tracking-wider mb-1">To Do</p>
          <p className="text-2xl font-bold text-slate-400">{todoCount}</p>
        </div>
        <div className="bg-sirak-card border border-sirak-border rounded-xl p-5">
          <p className="text-sirak-text-tertiary text-xs uppercase tracking-wider mb-1">In Progress</p>
          <p className="text-2xl font-bold text-blue-400">{inProgressCount}</p>
        </div>
        <div className="bg-sirak-card border border-sirak-border rounded-xl p-5">
          <p className="text-sirak-text-tertiary text-xs uppercase tracking-wider mb-1">Completed</p>
          <p className="text-2xl font-bold text-green-400">{completedCount}</p>
        </div>
      </div>

      {/* Board View */}
      {viewMode === 'board' && (
        <div className="flex gap-3 overflow-x-auto pb-4">
          {STATUSES.map((status) => {
            const statusTasks = board[status.id] || [];
            return (
              <div
                key={status.id}
                className="flex-shrink-0 w-72 bg-sirak-surface border border-sirak-border rounded-xl flex flex-col max-h-[calc(100vh-360px)]"
              >
                {/* Column Header */}
                <div className="p-3 border-b border-sirak-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${status.dot}`} />
                      <span className="text-xs font-semibold text-sirak-text uppercase tracking-wider">
                        {status.label}
                      </span>
                    </div>
                    <span className={`text-xs font-bold ${status.text}`}>{statusTasks.length}</span>
                  </div>
                </div>

                {/* Cards */}
                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                  {statusTasks.map((task) => (
                    <button
                      key={task.id}
                      onClick={() => setSelectedTask(task)}
                      className={`w-full text-left p-3 rounded-lg border ${status.border} ${status.bg} hover:brightness-110 transition-all`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="text-sm font-medium text-sirak-text leading-tight">{task.title}</p>
                        <span className={`shrink-0 inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold border ${getPriorityStyle(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                      {task.description && (
                        <p className="text-xs text-sirak-text-tertiary line-clamp-2 mb-2">{task.description}</p>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-sirak-text-tertiary capitalize">{task.category}</span>
                        {task.due_date && (
                          <span className={`text-[10px] ${
                            new Date(task.due_date) < new Date() && task.status !== 'completed'
                              ? 'text-red-400' : 'text-sirak-text-tertiary'
                          }`}>
                            {task.due_date}
                          </span>
                        )}
                      </div>
                      {task.assigned_to && (
                        <p className="text-[10px] text-sirak-text-tertiary mt-1">{task.assigned_to}</p>
                      )}
                    </button>
                  ))}
                  {statusTasks.length === 0 && (
                    <p className="text-xs text-sirak-text-tertiary text-center py-6">No tasks</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="bg-sirak-card border border-sirak-border rounded-xl overflow-hidden">
          {tasks.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-sirak-text-secondary">No tasks yet. Create one to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-sirak-border">
                    {['Title', 'Status', 'Priority', 'Category', 'Assigned', 'Due Date', 'Updated'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs uppercase tracking-wider text-sirak-text-tertiary font-medium">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => {
                    const statusInfo = STATUSES.find(s => s.id === task.status);
                    return (
                      <tr
                        key={task.id}
                        onClick={() => setSelectedTask(task)}
                        className="border-b border-sirak-border/50 last:border-0 hover:bg-sirak-surface/50 transition-colors cursor-pointer"
                      >
                        <td className="px-4 py-3 text-sm text-sirak-text font-medium">{task.title}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium border ${statusInfo?.bg} ${statusInfo?.text} ${statusInfo?.border}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${statusInfo?.dot}`} />
                            {statusInfo?.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium border ${getPriorityStyle(task.priority)}`}>
                            {task.priority}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-sirak-text-secondary capitalize">{task.category}</td>
                        <td className="px-4 py-3 text-xs text-sirak-text-secondary">{task.assigned_to || '-'}</td>
                        <td className="px-4 py-3 text-xs text-sirak-text-secondary">{task.due_date || '-'}</td>
                        <td className="px-4 py-3 text-[10px] text-sirak-text-tertiary">{timeAgo(task.updated_at)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Task Detail Panel */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setSelectedTask(null)}>
          <div className="absolute inset-0 bg-black/60" />
          <div
            className="relative w-full max-w-lg bg-sirak-card border-l border-sirak-border h-full overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <h2 className="font-[family-name:var(--font-teko)] text-2xl font-bold text-sirak-text uppercase tracking-wider pr-4">
                  {selectedTask.title}
                </h2>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => deleteTask(selectedTask.id)}
                    className="text-sirak-text-tertiary hover:text-red-400 p-1 text-xs"
                    title="Delete task"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                  <button onClick={() => setSelectedTask(null)} className="text-sirak-text-tertiary hover:text-sirak-text p-1">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Status selector */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-sirak-text-tertiary mb-2">Status</label>
                <div className="flex flex-wrap gap-1.5">
                  {STATUSES.map((status) => (
                    <button
                      key={status.id}
                      onClick={() => updateTask(selectedTask.id, { status: status.id })}
                      disabled={actionLoading}
                      className={`px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
                        selectedTask.status === status.id
                          ? `${status.bg} ${status.text} ${status.border}`
                          : 'border-sirak-border text-sirak-text-tertiary hover:text-sirak-text'
                      }`}
                    >
                      {status.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Priority selector */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-sirak-text-tertiary mb-2">Priority</label>
                <div className="flex flex-wrap gap-1.5">
                  {PRIORITIES.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => updateTask(selectedTask.id, { priority: p.id })}
                      disabled={actionLoading}
                      className={`px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
                        selectedTask.priority === p.id
                          ? p.color
                          : 'border-sirak-border text-sirak-text-tertiary hover:text-sirak-text'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-sirak-text-tertiary mb-1">Category</label>
                  <select
                    value={selectedTask.category}
                    onChange={(e) => updateTask(selectedTask.id, { category: e.target.value })}
                    className="w-full bg-sirak-surface border border-sirak-border rounded px-3 py-1.5 text-sm text-sirak-text focus:outline-none focus:border-sirak-red"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-sirak-text-tertiary mb-1">Assigned To</label>
                  <input
                    type="text"
                    defaultValue={selectedTask.assigned_to || ''}
                    onBlur={(e) => updateTask(selectedTask.id, { assigned_to: e.target.value || null })}
                    placeholder="Name"
                    className="w-full bg-sirak-surface border border-sirak-border rounded px-3 py-1.5 text-sm text-sirak-text focus:outline-none focus:border-sirak-red"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs uppercase tracking-wider text-sirak-text-tertiary mb-1">Due Date</label>
                  <input
                    type="date"
                    defaultValue={selectedTask.due_date || ''}
                    onChange={(e) => updateTask(selectedTask.id, { due_date: e.target.value || null })}
                    className="w-full bg-sirak-surface border border-sirak-border rounded px-3 py-1.5 text-sm text-sirak-text focus:outline-none focus:border-sirak-red"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-sirak-text-tertiary mb-1">Description</label>
                <textarea
                  defaultValue={selectedTask.description || ''}
                  onBlur={(e) => updateTask(selectedTask.id, { description: e.target.value || null })}
                  rows={4}
                  placeholder="Add task details..."
                  className="w-full bg-sirak-surface border border-sirak-border rounded-lg px-3 py-2 text-sm text-sirak-text placeholder-sirak-text-tertiary focus:outline-none focus:border-sirak-red resize-none"
                />
              </div>

              <div className="text-xs text-sirak-text-tertiary flex items-center gap-3">
                <span>Created: {selectedTask.created_at.slice(0, 10)}</span>
                <span>Updated: {timeAgo(selectedTask.updated_at)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Task Modal */}
      {showNewTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setShowNewTask(false)}>
          <div className="absolute inset-0 bg-black/60" />
          <div
            className="relative bg-sirak-card border border-sirak-border rounded-xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-[family-name:var(--font-teko)] text-xl font-bold text-sirak-text uppercase tracking-wider mb-4">
              New Task
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs uppercase tracking-wider text-sirak-text-tertiary mb-1">Title *</label>
                <input
                  type="text"
                  value={newTaskForm.title}
                  onChange={(e) => setNewTaskForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="What needs to be done?"
                  className="w-full bg-sirak-surface border border-sirak-border rounded-lg px-3 py-2 text-sm text-sirak-text placeholder-sirak-text-tertiary focus:outline-none focus:border-sirak-red"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-sirak-text-tertiary mb-1">Description</label>
                <textarea
                  value={newTaskForm.description}
                  onChange={(e) => setNewTaskForm(f => ({ ...f, description: e.target.value }))}
                  rows={3}
                  placeholder="Details, context, requirements..."
                  className="w-full bg-sirak-surface border border-sirak-border rounded-lg px-3 py-2 text-sm text-sirak-text placeholder-sirak-text-tertiary focus:outline-none focus:border-sirak-red resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-sirak-text-tertiary mb-1">Priority</label>
                  <select
                    value={newTaskForm.priority}
                    onChange={(e) => setNewTaskForm(f => ({ ...f, priority: e.target.value }))}
                    className="w-full bg-sirak-surface border border-sirak-border rounded-lg px-3 py-2 text-sm text-sirak-text focus:outline-none focus:border-sirak-red"
                  >
                    {PRIORITIES.map(p => (
                      <option key={p.id} value={p.id}>{p.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-sirak-text-tertiary mb-1">Category</label>
                  <select
                    value={newTaskForm.category}
                    onChange={(e) => setNewTaskForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full bg-sirak-surface border border-sirak-border rounded-lg px-3 py-2 text-sm text-sirak-text focus:outline-none focus:border-sirak-red"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-sirak-text-tertiary mb-1">Assigned To</label>
                  <input
                    type="text"
                    value={newTaskForm.assigned_to}
                    onChange={(e) => setNewTaskForm(f => ({ ...f, assigned_to: e.target.value }))}
                    placeholder="Name"
                    className="w-full bg-sirak-surface border border-sirak-border rounded-lg px-3 py-2 text-sm text-sirak-text placeholder-sirak-text-tertiary focus:outline-none focus:border-sirak-red"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-sirak-text-tertiary mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newTaskForm.due_date}
                    onChange={(e) => setNewTaskForm(f => ({ ...f, due_date: e.target.value }))}
                    className="w-full bg-sirak-surface border border-sirak-border rounded-lg px-3 py-2 text-sm text-sirak-text focus:outline-none focus:border-sirak-red"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-5">
              <button onClick={() => setShowNewTask(false)} className="px-4 py-2 text-sm text-sirak-text-secondary hover:text-sirak-text">
                Cancel
              </button>
              <button
                onClick={createTask}
                disabled={!newTaskForm.title.trim() || actionLoading}
                className="px-4 py-2 bg-sirak-red text-white text-sm font-semibold rounded-lg hover:brightness-110 disabled:opacity-50"
              >
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
