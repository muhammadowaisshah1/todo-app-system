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
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  ArrowPathIcon,
  PencilIcon,
  DocumentTextIcon,
  ExclamationCircleIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

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
      errors.title = 'Title is required';
    } else if (formData.title.length > 200) {
      errors.title = 'Title must not exceed 200 characters';
    }
    if (formData.description.length > 1000) {
      errors.description = 'Description must not exceed 1000 characters';
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
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Title Input */}
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-bold flex items-center gap-2">
          <PencilIcon className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          Task Title <span className="text-red-500">*</span>
        </Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="What needs to be done?"
          disabled={loading}
          className={cn(
            "w-full py-3 text-base font-medium rounded-xl border-2 transition-all duration-200",
            "focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20",
            "placeholder:text-gray-400 dark:placeholder:text-gray-500",
            validationErrors.title && "border-red-400 dark:border-red-500 focus:border-red-500 focus:ring-red-500/20"
          )}
        />
        {validationErrors.title && (
          <div className="flex items-center gap-2 text-xs text-red-600 dark:text-red-400 font-semibold animate-slideDown">
            <ExclamationCircleIcon className="w-4 h-4 flex-shrink-0" />
            {validationErrors.title}
          </div>
        )}
      </div>

      {/* Description Textarea */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-bold flex items-center gap-2">
          <DocumentTextIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          Description
          <span className="text-xs font-normal text-gray-500 dark:text-gray-400">(Optional)</span>
        </Label>
        <div className="relative">
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Add more details about this task..."
            rows={4}
            disabled={loading}
            className={cn(
              "w-full text-base rounded-xl border-2 transition-all duration-200 resize-none",
              "focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20",
              "placeholder:text-gray-400 dark:placeholder:text-gray-500",
              validationErrors.description && "border-red-400 dark:border-red-500 focus:border-red-500 focus:ring-red-500/20"
            )}
          />
          <div className="absolute bottom-2 right-2 text-xs font-medium text-gray-400 dark:text-gray-500 bg-background/80 px-2 py-1 rounded-md">
            {formData.description.length}/1000
          </div>
        </div>
        {validationErrors.description && (
          <div className="flex items-center gap-2 text-xs text-red-600 dark:text-red-400 font-semibold animate-slideDown">
            <ExclamationCircleIcon className="w-4 h-4 flex-shrink-0" />
            {validationErrors.description}
          </div>
        )}
      </div>

      {/* Selectors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <PrioritySelector value={priority} onChange={setPriority} />
        </div>
        <div>
          <CategorySelector value={category} onChange={setCategory} />
        </div>
      </div>

      {/* Date Picker Full Width */}
      <div>
        <DatePicker value={dueDate} onChange={setDueDate} />
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-xl text-sm text-red-700 dark:text-red-300 font-semibold animate-slideDown">
          <ExclamationCircleIcon className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2 border-t border-border/50 mt-6">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
            className="w-full sm:w-auto min-w-[120px] py-3 text-base font-semibold rounded-xl border-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto min-w-[160px] py-3 text-base font-semibold rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-600 hover:via-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          {loading ? (
            <>
              <ArrowPathIcon className="mr-2 h-5 w-5 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <SparklesIcon className="mr-2 h-5 w-5" />
              {submitLabel}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
