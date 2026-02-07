/**
 * CategorySelector Component
 *
 * Provides a button-based selector for task categories.
 * Features:
 * - Visual category selection with icons
 * - Toggle selection (click again to deselect)
 * - Color-coded buttons
 * - Dark mode support
 * - Accessible with ARIA labels
 */

'use client';

import { CATEGORIES, CATEGORY_COLORS } from '@/lib/constants';

interface CategorySelectorProps {
  value: string | null;
  onChange: (value: string | null) => void;
  label?: string;
}

export default function CategorySelector({ value, onChange, label = 'Category' }: CategorySelectorProps) {
  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
        <span className="text-lg">🏷️</span>
        {label}
        <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">(Optional)</span>
      </label>
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map(cat => {
          const isSelected = value === cat.value;
          return (
            <button
              key={cat.value}
              type="button"
              onClick={() => onChange(isSelected ? null : cat.value)}
              className={`
                px-3 py-2 rounded-xl font-bold transition-all duration-300
                flex items-center gap-2 text-sm
                ${isSelected
                  ? `${CATEGORY_COLORS[cat.color]} ring-2 ring-offset-2 ring-purple-500 dark:ring-offset-slate-900 shadow-lg scale-105`
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 hover:scale-105 border border-gray-300 dark:border-gray-600'
                }
              `}
              aria-pressed={isSelected}
              aria-label={`Select ${cat.label} category`}
            >
              <span className="text-base">{cat.icon}</span>
              <span className="hidden sm:inline">{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
