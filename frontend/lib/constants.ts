/**
 * Constants for task management features
 *
 * Defines categories, priorities, and their associated colors/icons
 * for the Phase 2 task management system.
 */

export const CATEGORIES = [
  { value: 'work', label: 'Work', color: 'blue', icon: '💼' },
  { value: 'personal', label: 'Personal', color: 'purple', icon: '👤' },
  { value: 'shopping', label: 'Shopping', color: 'green', icon: '🛒' },
  { value: 'health', label: 'Health', color: 'red', icon: '❤️' },
  { value: 'other', label: 'Other', color: 'gray', icon: '📌' },
] as const;

export const CATEGORY_COLORS = {
  blue: 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 dark:from-blue-950/50 dark:to-cyan-950/50 dark:text-blue-300 border-blue-300 dark:border-blue-700 shadow-sm shadow-blue-200/50 dark:shadow-blue-900/20',
  purple: 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 dark:from-purple-950/50 dark:to-pink-950/50 dark:text-purple-300 border-purple-300 dark:border-purple-700 shadow-sm shadow-purple-200/50 dark:shadow-purple-900/20',
  green: 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 dark:from-green-950/50 dark:to-emerald-950/50 dark:text-green-300 border-green-300 dark:border-green-700 shadow-sm shadow-green-200/50 dark:shadow-green-900/20',
  red: 'bg-gradient-to-r from-red-100 to-orange-100 text-red-700 dark:from-red-950/50 dark:to-orange-950/50 dark:text-red-300 border-red-300 dark:border-red-700 shadow-sm shadow-red-200/50 dark:shadow-red-900/20',
  gray: 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 dark:from-gray-800 dark:to-slate-800 dark:text-gray-300 border-gray-300 dark:border-gray-600 shadow-sm shadow-gray-200/50 dark:shadow-gray-900/20',
} as const;

export const PRIORITIES = [
  { value: 'high', label: 'High', color: 'red', icon: '🔴', order: 0 },
  { value: 'medium', label: 'Medium', color: 'yellow', icon: '🟡', order: 1 },
  { value: 'low', label: 'Low', color: 'green', icon: '🟢', order: 2 },
] as const;

export const PRIORITY_COLORS = {
  red: 'bg-gradient-to-r from-red-100 to-rose-100 text-red-700 dark:from-red-950/50 dark:to-rose-950/50 dark:text-red-300 border-red-300 dark:border-red-700 shadow-sm shadow-red-200/50 dark:shadow-red-900/20 font-bold',
  yellow: 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-700 dark:from-yellow-950/50 dark:to-amber-950/50 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700 shadow-sm shadow-yellow-200/50 dark:shadow-yellow-900/20 font-bold',
  green: 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 dark:from-green-950/50 dark:to-emerald-950/50 dark:text-green-300 border-green-300 dark:border-green-700 shadow-sm shadow-green-200/50 dark:shadow-green-900/20 font-bold',
} as const;

export type CategoryValue = typeof CATEGORIES[number]['value'];
export type CategoryColor = keyof typeof CATEGORY_COLORS;
export type PriorityValue = typeof PRIORITIES[number]['value'];
export type PriorityColor = keyof typeof PRIORITY_COLORS;
