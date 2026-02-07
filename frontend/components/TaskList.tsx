'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Task } from '@/lib/types';
import TaskItem from './TaskItem';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CATEGORIES, CATEGORY_COLORS, PRIORITIES, PRIORITY_COLORS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import {
  FunnelIcon,
  XMarkIcon,
  InboxIcon,
  ClipboardDocumentCheckIcon
} from '@heroicons/react/24/outline';

interface TaskListProps {
  tasks: Task[];
  searchQuery?: string;
  onTaskUpdate: (updatedTask: Task) => void;
  onTaskDelete: (taskId: number) => void;
  onTaskEdit: (task: Task) => void;
  isLoading?: boolean;
  error?: string | null;
}

type FilterType = 'all' | 'active' | 'completed';

export default function TaskList({
  tasks,
  searchQuery,
  onTaskUpdate,
  onTaskDelete,
  onTaskEdit,
  isLoading = false,
  error = null,
}: TaskListProps) {
  const [filter, setFilter] = useState<FilterType>('all');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);

  const filteredTasks = useMemo(() => {
    let result = tasks;

    // Search
    if (searchQuery?.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(t =>
        t.title.toLowerCase().includes(query) ||
        t.description?.toLowerCase().includes(query)
      );
    }

    // Category
    if (categoryFilter) {
      result = result.filter(t => t.category === categoryFilter);
    }

    // Priority
    if (priorityFilter) {
      result = result.filter(t => t.priority === priorityFilter);
    }

    // Status
    if (filter === 'active') result = result.filter(t => !t.completed);
    if (filter === 'completed') result = result.filter(t => t.completed);

    // Sort
    return result.sort((a, b) => {
      // Overdue first
      const now = new Date();
      const aOverdie = !a.completed && a.due_date && new Date(a.due_date) < now;
      const bOverdue = !b.completed && b.due_date && new Date(b.due_date) < now;
      if (aOverdie && !bOverdue) return -1;
      if (!aOverdie && bOverdue) return 1;

      // Priority
      const pOrder = { high: 0, medium: 1, low: 2 };
      const aP = pOrder[a.priority as keyof typeof pOrder] ?? 1;
      const bP = pOrder[b.priority as keyof typeof pOrder] ?? 1;
      if (aP !== bP) return aP - bP;

      // Due date
      if (a.due_date && b.due_date) {
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      }
      if (a.due_date) return -1;
      if (b.due_date) return 1;

      // Created At (newest first)
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [tasks, filter, searchQuery, categoryFilter, priorityFilter]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="h-28 relative overflow-hidden bg-gradient-to-r from-muted/30 to-muted/50">
            <div className="absolute inset-0 shimmer" />
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6 border-destructive/50 bg-destructive/5 text-center">
        <h3 className="text-lg font-semibold text-destructive">Failed to load tasks</h3>
        <p className="text-muted-foreground">{error}</p>
      </Card>
    );
  }

  const taskCounts = {
    all: tasks.length,
    active: tasks.filter(t => !t.completed).length,
    completed: tasks.filter(t => t.completed).length,
  };

  return (
    <div className="space-y-6">
      {/* Filters Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex p-1.5 bg-muted/30 rounded-xl w-full sm:w-auto border border-border/50 shadow-sm">
          {(['all', 'active', 'completed'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={cn(
                "flex-1 sm:flex-none px-5 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300",
                filter === type
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
              <span className={cn(
                "ml-2 text-xs px-1.5 py-0.5 rounded-full",
                filter === type
                  ? "bg-white/20"
                  : "bg-muted"
              )}>
                {taskCounts[type]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Filters */}
      {(tasks.some(t => t.category) || tasks.some(t => t.priority)) && (
        <div className="flex flex-wrap gap-3 items-center text-sm bg-muted/20 p-4 rounded-xl border border-border/50">
          <span className="text-muted-foreground font-semibold flex items-center gap-2">
            <FunnelIcon className="w-5 h-5" /> Filter by:
          </span>

          {tasks.some(t => t.priority) && (
            <div className="flex flex-wrap gap-2">
              {PRIORITIES.map(pri => {
                const isActive = priorityFilter === pri.value;
                return (
                  <button
                    key={pri.value}
                    onClick={() => setPriorityFilter(isActive ? null : pri.value)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg border-2 text-xs font-semibold flex items-center gap-1.5 transition-all duration-300",
                      isActive
                        ? "bg-gradient-to-r from-cyan-500 to-blue-600 border-cyan-400 text-white shadow-lg shadow-cyan-500/30 scale-105"
                        : "border-border bg-background hover:bg-muted hover:scale-105 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {pri.icon} {pri.label}
                  </button>
                )
              })}
            </div>
          )}

          <div className="w-px h-6 bg-border mx-1" />

          {tasks.some(t => t.category) && (
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => {
                const isActive = categoryFilter === cat.value;
                return (
                  <button
                    key={cat.value}
                    onClick={() => setCategoryFilter(isActive ? null : cat.value)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg border-2 text-xs font-semibold flex items-center gap-1.5 transition-all duration-300",
                      isActive
                        ? "bg-gradient-to-r from-purple-500 to-pink-600 border-purple-400 text-white shadow-lg shadow-purple-500/30 scale-105"
                        : "border-border bg-background hover:bg-muted hover:scale-105 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {cat.icon} {cat.label}
                  </button>
                )
              })}
            </div>
          )}

          {(categoryFilter || priorityFilter) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setCategoryFilter(null); setPriorityFilter(null); }}
              className="h-8 px-3 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-destructive/10 rounded-lg"
            >
              <XMarkIcon className="w-4 h-4 mr-1" /> Clear Filters
            </Button>
          )}
        </div>
      )}

      {/* List */}
      <div className="space-y-4 min-h-[300px]">
        <AnimatePresence mode="popLayout">
          {filteredTasks.length > 0 ? (
            filteredTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={onTaskUpdate}
                onDelete={onTaskDelete}
                onEdit={onTaskEdit}
              />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="p-6 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/30 mb-6 shadow-lg">
                {filter === 'completed' ? (
                  <ClipboardDocumentCheckIcon className="w-16 h-16 text-green-500/50" />
                ) : (
                  <InboxIcon className="w-16 h-16 text-cyan-500/50" />
                )}
              </div>
              <h3 className="text-xl font-bold text-muted-foreground mb-2">No tasks found</h3>
              <p className="text-base text-muted-foreground/70 max-w-sm">
                {searchQuery
                  ? `No matches for "${searchQuery}"`
                  : filter === 'completed'
                    ? "You haven't completed any tasks yet. Keep going!"
                    : "You have no tasks in this view. Create one to get started."}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
