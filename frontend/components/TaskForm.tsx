'use client';

import { useState, FormEvent, useMemo } from 'react';
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

  // Calculate completion percentage
  const completionPercentage = useMemo(() => {
    let completed = 0;
    const total = 4;
    if (formData.title.trim()) completed++;
    if (priority) completed++;
    if (category) completed++;
    if (dueDate) completed++;
    return Math.round((completed / total) * 100);
  }, [formData.title, priority, category, dueDate]);

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
      {/* Completion Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-[2px] animate-fadeIn">
        <div className="relative bg-white dark:bg-gray-900 rounded-2xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-14 h-14 flex items-center justify-center">
                <svg className="w-14 h-14 transform -rotate-90">
                  <circle cx="28" cy="28" r="24" fill="none" stroke="currentColor" strokeWidth="3" className="text-gray-200 dark:text-gray-800" />
                  <circle
                    cx="28"
                    cy="28"
                    r="24"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 24}`}
                    strokeDashoffset={`${2 * Math.PI * 24 * (1 - completionPercentage / 100)}`}
                    className="transition-all duration-500"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="50%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-sm font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {completionPercentage}%
                </span>
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">Form Progress</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">Complete all fields for best results</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {[formData.title.trim(), priority, category, dueDate].map((field, idx) => (
                <div key={idx} className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  field ? "bg-green-500 scale-125 shadow-lg shadow-green-500/50" : "bg-gray-300 dark:bg-gray-700"
                )}></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Step 1: Basic Information */}
      <div className="space-y-4 animate-slideDown">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white font-black text-sm shadow-lg">
            1
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Basic Information</h3>
          {formData.title.trim() && (
            <div className="flex items-center gap-1 text-xs font-semibold text-green-600 dark:text-green-400 animate-fadeIn">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Complete
            </div>
          )}
        </div>

        {/* Title Field */}
        <div className="relative group">
          <Label htmlFor="title" className="flex items-center gap-2 mb-3 text-sm font-semibold text-foreground/90">
            <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <span>Task Title</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-bold animate-pulse">Required</span>
          </Label>
          <div className="relative">
            <div className={cn(
              "absolute inset-0 rounded-2xl transition-all duration-300",
              formData.title.trim()
                ? "bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 opacity-20 blur-xl"
                : "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-10 blur-xl"
            )}></div>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter your task title..."
              disabled={loading}
              className={cn(
                "relative h-14 pl-5 pr-24 text-base font-medium rounded-2xl border-2 transition-all duration-300",
                "focus:scale-[1.02] focus:shadow-2xl",
                "bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm",
                validationErrors.title
                  ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/20"
                  : formData.title.trim()
                  ? "border-green-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/20"
                  : "border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
              )}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {formData.title.trim() && !validationErrors.title && (
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500 animate-scaleIn">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
              <span className="text-xs font-semibold text-gray-400">{formData.title.length}/200</span>
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

        {/* Description Field */}
        <div className="relative group">
          <Label htmlFor="description" className="flex items-center gap-2 mb-3 text-sm font-semibold text-foreground/90">
            <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </div>
            <span>Description</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">Optional</span>
          </Label>
          <div className="relative">
            <div className={cn(
              "absolute inset-0 rounded-2xl transition-all duration-300",
              formData.description.trim()
                ? "bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 opacity-10 blur-xl"
                : "bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-10 blur-xl"
            )}></div>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add more details about your task..."
              rows={4}
              disabled={loading}
              className={cn(
                "relative pl-5 pr-5 pt-4 pb-10 text-base rounded-2xl border-2 transition-all duration-300 resize-none",
                "focus:scale-[1.02] focus:shadow-2xl",
                "bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm",
                validationErrors.description
                  ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/20"
                  : "border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20"
              )}
            />
            <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-gradient-to-r from-white/90 to-gray-50/90 dark:from-gray-800/90 dark:to-gray-900/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-600 dark:text-gray-400 shadow-lg">
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

      {/* Step 2: Task Settings */}
      <div className="space-y-4 animate-slideDown" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 text-white font-black text-sm shadow-lg">
            2
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Task Settings</h3>
          {priority && category && dueDate && (
            <div className="flex items-center gap-1 text-xs font-semibold text-green-600 dark:text-green-400 animate-fadeIn">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Complete
            </div>
          )}
        </div>

        {/* Priority Card */}
        <div className="relative group">
          <div className={cn(
            "absolute inset-0 rounded-2xl transition-all duration-300 blur-xl",
            priority ? "bg-gradient-to-r from-orange-500 to-red-500 opacity-20" : "bg-gradient-to-r from-orange-500 to-red-500 opacity-0 group-hover:opacity-10"
          )}></div>
          <Card className="relative p-5 border-2 bg-gradient-to-br from-orange-50/80 to-red-50/80 dark:from-orange-950/30 dark:to-red-950/30 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]" style={{ borderColor: priority ? 'rgb(251 146 60)' : undefined }}>
            <PrioritySelector value={priority} onChange={setPriority} />
            {priority && (
              <div className="absolute top-3 right-3 flex items-center justify-center w-6 h-6 rounded-full bg-green-500 animate-scaleIn shadow-lg">
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </Card>
        </div>

        {/* Category Card */}
        <div className="relative group">
          <div className={cn(
            "absolute inset-0 rounded-2xl transition-all duration-300 blur-xl",
            category ? "bg-gradient-to-r from-blue-500 to-cyan-500 opacity-20" : "bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-10"
          )}></div>
          <Card className="relative p-5 border-2 bg-gradient-to-br from-blue-50/80 to-cyan-50/80 dark:from-blue-950/30 dark:to-cyan-950/30 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]" style={{ borderColor: category ? 'rgb(59 130 246)' : undefined }}>
            <CategorySelector value={category} onChange={setCategory} />
            {category && (
              <div className="absolute top-3 right-3 flex items-center justify-center w-6 h-6 rounded-full bg-green-500 animate-scaleIn shadow-lg">
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </Card>
        </div>

        {/* Date Card */}
        <div className="relative group">
          <div className={cn(
            "absolute inset-0 rounded-2xl transition-all duration-300 blur-xl",
            dueDate ? "bg-gradient-to-r from-purple-500 to-pink-500 opacity-20" : "bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-10"
          )}></div>
          <Card className="relative p-5 border-2 bg-gradient-to-br from-purple-50/80 to-pink-50/80 dark:from-purple-950/30 dark:to-pink-950/30 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]" style={{ borderColor: dueDate ? 'rgb(168 85 247)' : undefined }}>
            <DatePicker value={dueDate} onChange={setDueDate} />
            {dueDate && (
              <div className="absolute top-3 right-3 flex items-center justify-center w-6 h-6 rounded-full bg-green-500 animate-scaleIn shadow-lg">
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-500 to-orange-500 p-[2px] animate-slideDown">
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-white dark:bg-gray-900">
            <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-sm text-gray-900 dark:text-white mb-1">Error</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-8 border-t-2 border-gray-200 dark:border-gray-800">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
            className="group relative h-14 px-10 rounded-2xl border-2 font-bold text-base overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            <span className="relative z-10 flex items-center gap-2">
              <svg className="w-5 h-5 transition-transform group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel
            </span>
          </Button>
        )}
        <Button
          type="submit"
          disabled={loading || !formData.title.trim()}
          className="group relative h-14 px-12 rounded-2xl font-black text-base overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          {loading ? (
            <span className="relative z-10 flex items-center gap-3">
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Saving...</span>
            </span>
          ) : (
            <span className="relative z-10 flex items-center gap-3">
              <svg className="w-6 h-6 transition-transform group-hover:rotate-12 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              <span>{submitLabel}</span>
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          )}
        </Button>
      </div>
    </form>
  );
}
