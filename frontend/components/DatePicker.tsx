/**
 * DatePicker Component
 *
 * Provides a date picker for selecting task due dates.
 * Features:
 * - Calendar-based date selection
 * - Prevents selecting past dates
 * - Clearable selection
 * - Dark mode support
 * - Accessible with proper labels
 */

'use client';

import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CalendarIcon } from '@heroicons/react/24/outline';

interface DatePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  label?: string;
  minDate?: Date;
}

export default function DatePicker({ value, onChange, label = 'Due Date', minDate }: DatePickerProps) {
  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
        <span className="text-lg">📅</span>
        {label}
        <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">(Optional)</span>
      </label>
      <div className="relative group">
        <ReactDatePicker
          selected={value}
          onChange={onChange}
          minDate={minDate || new Date()}
          dateFormat="MMM dd, yyyy"
          placeholderText="Select due date"
          isClearable
          className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/30 dark:focus:ring-blue-400/30 transition-all duration-300 font-medium hover:border-blue-400 dark:hover:border-blue-500"
          wrapperClassName="w-full"
          calendarClassName="dark:bg-gray-800 dark:border-gray-700"
        />
        <CalendarIcon className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors pointer-events-none" />
      </div>
    </div>
  );
}
