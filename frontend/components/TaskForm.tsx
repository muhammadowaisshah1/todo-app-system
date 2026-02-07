'use client';

import { useState, FormEvent } from 'react';
import { toast } from 'react-hot-toast';
import CategorySelector from './CategorySelector';
import PrioritySelector from './PrioritySelector';
import DatePicker from './DatePicker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface TaskFormProps {
  onSubmit: (title: string, description: string, category?: string | null, priority?: string, dueDate?: Date | null) => Promise<void>;
  initialTitle?: string;
  initialDescription?: string;
  initialCategory?: string | null;
  initialPriority?: string | null;
  initialDueDate?: string | null;
  submitLabel?: string;
  onCancel?: () => void;
}

interface FormData {
  title: string;
  description: string;
}

interface ValidationErrors {
  title?: string;
  description?: string;
}

export default function TaskForm({
  onSubmit,
  initialTitle = '',
  initialDescription = '',
  initialCategory = null,
  initialPriority = null,
  initialDueDate = null,
  submitLabel = 'Create Task',
  onCancel,
}: TaskFormProps) {
  const [formData, setFormData] = useState<FormData>({
    title: initialTitle,
    description: initialDescription,
  });

  const [category, setCategory] = useState<string | null>(initialCategory);
  const [priority, setPriority] = useState<string>(initialPriority || 'medium');
  const [dueDate, setDueDate] = useState<Date | null>(
    initialDueDate ? new Date(initialDueDate) : null
  );

  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [error, setError] = useState<string>('');

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    if (!formData.title.trim()) {
      errors.title = 'Task title is required';
    } else if (formData.title.length > 200) {
      errors.title = 'Title must be under 200 characters';
    }
    if (formData.description.length > 1000) {
      errors.description = 'Description must be under 1000 characters';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);
    try {
      await onSubmit(formData.title.trim(), formData.description.trim(), category, priority, dueDate);
      if (!initialTitle && !initialDescription) {
        setFormData({ title: '', description: '' });
        setCategory(null);
        setPriority('medium');
        setDueDate(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save task');
      toast.error('Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Section 1: Basic Info */}
      <div className="space-y-4 animate-slideDown">
        {/* Title with Modern Design */}
        <div className="relative group">
          <Label
            htmlFor="title"
            className="flex items-center gap-2 mb-3 text-sm font-semibold text-foreground/90"
          >
            <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <span>Task Title</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-bold">Required</span>
          </Label>
          <div className="relative">
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter your task title..."
              disabled={loading}
              className={cn(
                "h-12 pl-5 pr-12 text-base font-medium rounded-2xl border-2 transition-all duration-300",
                "focus:scale-[1.01] focus:shadow-lg",
                "bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm",
                validationErrors.title
                  ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/20"
                  : "border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
              )}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400">
              {formData.title.length}/200
            </div>
          </div>
          {validationErrors.title && (
            <div className="flex items-center gap-2 mt-2 text-sm text-red-600 dark:text-red-400 font-medium animate-slideDown">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {validationErrors.title}
            </div>
          )}
        </div>

        {/* Description with Modern Card */}
        <div className="relative">
          <Label
            htmlFor="description"
            className="flex items-center gap-2 mb-3 text-sm font-semibold text-foreground/90"
          >
            <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </div>
            <span>Description</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">Optional</span>
          </Label>
          <div className="relative">
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add more details about your task..."
              rows={4}
              disabled={loading}
              className={cn(
                "pl-5 pr-5 pt-4 text-base rounded-2xl border-2 transition-all duration-300 resize-none",
                "focus:scale-[1.01] focus:shadow-lg",
                "bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm",
                validationErrors.description
                  ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/20"
                  : "border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20"
              )}
            />
            <div className="absolute bottom-3 right-3 px-2 py-1 rounded-lg bg-background/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-500">
              {formData.description.length}/1000
            </div>
          </div>
          {validationErrors.description && (
            <div className="flex items-center gap-2 mt-2 text-sm text-red-600 dark:text-red-400 font-medium animate-slideDown">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {validationErrors.description}
            </div>
          )}
        </div>
      </div>

      {/* Divider with Text */}
      <div className="relative flex items-center gap-4 py-2">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent"></div>
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 border border-blue-200/50 dark:border-blue-800/50">
          <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
          <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Task Settings</span>
        </div>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent"></div>
      </div>

      {/* Section 2: Settings Grid */}
      <div className="grid grid-cols-1 gap-5 animate-slideDown" style={{ animationDelay: '0.1s' }}>
        {/* Priority Card */}
        <Card className="p-5 border-2 border-gray-200/60 dark:border-gray-800/60 bg-gradient-to-br from-orange-50/50 to-red-50/50 dark:from-orange-950/20 dark:to-red-950/20 hover:shadow-lg transition-all duration-300">
          <PrioritySelector value={priority} onChange={setPriority} />
        </Card>

        {/* Category Card */}
        <Card className="p-5 border-2 border-gray-200/60 dark:border-gray-800/60 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 dark:from-blue-950/20 dark:to-cyan-950/20 hover:shadow-lg transition-all duration-300">
          <CategorySelector value={category} onChange={setCategory} />
        </Card>

        {/* Date Card */}
        <Card className="p-5 border-2 border-gray-200/60 dark:border-gray-800/60 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20 hover:shadow-lg transition-all duration-300">
          <DatePicker value={dueDate} onChange={setDueDate} />
        </Card>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 border-2 border-red-200 dark:border-red-800 animate-slideDown">
          <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-red-500 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-800 dark:text-red-300">{error}</p>
          </div>
        </div>
      )}

      {/* Action Buttons with Modern Design */}
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t-2 border-gray-200 dark:border-gray-800">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
            className="group relative h-12 px-8 rounded-2xl border-2 font-semibold text-base overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <span className="relative z-10 flex items-center gap-2">
              <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel
            </span>
          </Button>
        )}
        <Button
          type="submit"
          disabled={loading}
          className="group relative h-12 px-10 rounded-2xl font-bold text-base overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl bg-gradient-to-r from-blue-600 via-cyan-600 to-purple-600 hover:from-blue-700 hover:via-cyan-700 hover:to-purple-700"
        >
          {loading ? (
            <span className="flex items-center gap-3">
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Saving...</span>
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5 transition-transform group-hover:rotate-12 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              <span>{submitLabel}</span>
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          )}
        </Button>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-center gap-2 pt-2">
        <div className={cn(
          "w-2 h-2 rounded-full transition-all duration-300",
          formData.title ? "bg-green-500 scale-110" : "bg-gray-300 dark:bg-gray-700"
        )}></div>
        <div className={cn(
          "w-2 h-2 rounded-full transition-all duration-300",
          priority ? "bg-green-500 scale-110" : "bg-gray-300 dark:bg-gray-700"
        )}></div>
        <div className={cn(
          "w-2 h-2 rounded-full transition-all duration-300",
          category ? "bg-green-500 scale-110" : "bg-gray-300 dark:bg-gray-700"
        )}></div>
        <div className={cn(
          "w-2 h-2 rounded-full transition-all duration-300",
          dueDate ? "bg-green-500 scale-110" : "bg-gray-300 dark:bg-gray-700"
        )}></div>
      </div>
    </form>
  );
}
