/**
 * PrioritySelector Component
 *
 * Provides a button-based selector for task priority levels.
 * Features:
 * - Visual priority selection with icons
 * - Color-coded buttons (high=red, medium=yellow, low=green)
 * - Always has a selection (defaults to medium)
 * - Dark mode support
 * - Accessible with ARIA labels
 */

'use client';

import { PRIORITIES, PRIORITY_COLORS } from '@/lib/constants';

interface PrioritySelectorProps {
  value: string | null;
  onChange: (value: string) => void;
  label?: string;
}

export default function PrioritySelector({ value, onChange, label = 'Priority' }: PrioritySelectorProps) {
  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
        <span className="text-lg">⭐</span>
        {label}
      </label>
      <div className="flex gap-2 flex-wrap">
        {PRIORITIES.map(pri => {
          const isSelected = value === pri.value;
          return (
            <button
              key={pri.value}
              type="button"
              onClick={() => onChange(pri.value)}
              className={`
                px-3 py-2 rounded-xl font-bold transition-all duration-300
                flex items-center gap-2 text-sm
                ${isSelected
                  ? `${PRIORITY_COLORS[pri.color]} ring-2 ring-offset-2 ring-cyan-500 dark:ring-offset-slate-900 shadow-lg scale-105`
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 hover:scale-105 border border-gray-300 dark:border-gray-600'
                }
              `}
              aria-pressed={isSelected}
              aria-label={`Set priority to ${pri.label}`}
            >
              <span className="text-base">{pri.icon}</span>
              <span className="hidden sm:inline">{pri.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
