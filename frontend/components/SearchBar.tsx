/**
 * SearchBar Component
 *
 * Provides a search input with clear functionality for filtering tasks.
 * Features:
 * - Real-time search as user types
 * - Clear button to reset search
 * - Accessible with proper ARIA labels
 * - Dark mode support
 */

'use client';

import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder }: SearchBarProps) {
  return (
    <div className="relative group">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Search tasks..."}
        className="w-full pl-14 pr-12 py-4 rounded-2xl border-2 border-border bg-background/50 backdrop-blur-sm text-foreground placeholder:text-muted-foreground focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/20 dark:focus:ring-cyan-400/20 transition-all duration-300 shadow-sm hover:shadow-md font-medium"
        aria-label="Search tasks"
      />
      <div className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-white pointer-events-none group-focus-within:scale-110 transition-transform">
        <MagnifyingGlassIcon className="h-4 w-4" />
      </div>
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground hover:bg-destructive/10 rounded-lg transition-all duration-300 hover:scale-110"
          aria-label="Clear search"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
