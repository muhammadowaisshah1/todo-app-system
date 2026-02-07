/**
 * DueDateBadge Component
 *
 * Displays a due date badge with contextual status indicators.
 * Features:
 * - Color-coded by urgency (overdue=red, today=orange, soon=yellow, later=blue)
 * - Pulsing animation for overdue tasks
 * - Relative time display (e.g., "Due in 3 days")
 * - Dark mode support
 * - Accessible with title attribute
 */

import { format, isPast, isToday, isTomorrow, differenceInDays } from 'date-fns';
import { ClockIcon } from '@heroicons/react/24/outline';

interface DueDateBadgeProps {
  dueDate: string | null;
  completed: boolean;
}

export default function DueDateBadge({ dueDate, completed }: DueDateBadgeProps) {
  if (!dueDate) return null;

  const date = new Date(dueDate);
  const now = new Date();
  const daysUntil = differenceInDays(date, now);

  // Determine status and styling
  let statusText = '';
  let statusColor = '';

  if (completed) {
    statusText = format(date, 'MMM dd, yyyy');
    statusColor = 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-600 dark:from-gray-800 dark:to-slate-800 dark:text-gray-400 border-gray-300 dark:border-gray-600 shadow-sm';
  } else if (isPast(date) && !isToday(date)) {
    statusText = `Overdue by ${Math.abs(daysUntil)} day${Math.abs(daysUntil) !== 1 ? 's' : ''}`;
    statusColor = 'bg-gradient-to-r from-red-100 to-rose-100 text-red-700 dark:from-red-950/50 dark:to-rose-950/50 dark:text-red-300 border-red-400 dark:border-red-700 shadow-lg shadow-red-200/50 animate-pulse font-bold';
  } else if (isToday(date)) {
    statusText = 'Due today';
    statusColor = 'bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 dark:from-orange-950/50 dark:to-amber-950/50 dark:text-orange-300 border-orange-400 dark:border-orange-700 shadow-sm shadow-orange-200/50 font-bold';
  } else if (isTomorrow(date)) {
    statusText = 'Due tomorrow';
    statusColor = 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-700 dark:from-yellow-950/50 dark:to-amber-950/50 dark:text-yellow-300 border-yellow-400 dark:border-yellow-700 shadow-sm shadow-yellow-200/50 font-semibold';
  } else if (daysUntil <= 7) {
    statusText = `Due in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}`;
    statusColor = 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 dark:from-blue-950/50 dark:to-cyan-950/50 dark:text-blue-300 border-blue-400 dark:border-blue-700 shadow-sm shadow-blue-200/50 font-semibold';
  } else {
    statusText = format(date, 'MMM dd, yyyy');
    statusColor = 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-600 dark:from-gray-800 dark:to-slate-800 dark:text-gray-300 border-gray-300 dark:border-gray-600 shadow-sm';
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border-2 transition-all duration-300 hover:scale-105 ${statusColor}`}
      title={`Due: ${format(date, 'MMMM dd, yyyy')}`}
    >
      <ClockIcon className="h-4 w-4" />
      <span>{statusText}</span>
    </span>
  );
}
