/**
 * API client for task CRUD operations.
 *
 * This module provides functions to interact with the backend API
 * for managing tasks. All functions include JWT authentication and
 * proper error handling.
 */

import { Task } from '@/lib/types';

/**
 * API base URL from environment variables.
 * Falls back to localhost if not set.
 */
const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '');

/**
 * Custom error class for API errors.
 */
class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Get authentication headers with JWT token.
 *
 * Retrieves the JWT token from localStorage and returns
 * headers object for authenticated API requests.
 *
 * @returns Headers object with Authorization and Content-Type
 * @throws Error if token is not found in localStorage
 */
function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('auth_token');

  console.log('🔐 Getting auth headers...');
  console.log('🔑 Token exists:', !!token);

  if (token) {
    console.log('🔑 Token preview:', token.substring(0, 20) + '...');
  }

  if (!token) {
    console.error('❌ No auth token found in localStorage');
    throw new Error('No authentication token found. Please log in.');
  }

  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

/**
 * Handle API response and errors.
 *
 * @param response - Fetch API response object
 * @returns Parsed JSON data or void for 204 responses
 * @throws ApiError with appropriate status and message
 */
async function handleResponse<T>(response: Response): Promise<T> {
  // Handle 204 No Content (successful deletion)
  if (response.status === 204) {
    return undefined as T;
  }

  // Parse response body
  let data: unknown;
  try {
    data = await response.json();
  } catch {
    // If JSON parsing fails, use status text
    data = { detail: response.statusText };
  }

  // Handle successful responses
  if (response.ok) {
    return data as T;
  }

  // Handle error responses
  const errorMessage = (data as { detail?: string })?.detail || 'An error occurred';

  // Handle 401 Unauthorized - redirect to login
  if (response.status === 401) {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    window.location.href = '/';
    throw new ApiError('Unauthorized. Please log in again.', 401, data);
  }

  // Handle other error statuses
  throw new ApiError(errorMessage, response.status, data);
}

/**
 * Create a new task.
 *
 * @param title - Task title (1-200 characters)
 * @param description - Optional task description (max 1000 characters)
 * @param category - Optional task category (e.g., work, personal, shopping)
 * @param priority - Task priority level (low, medium, high) - defaults to medium
 * @param due_date - Optional task deadline
 * @returns Promise resolving to the created task
 * @throws ApiError if creation fails
 *
 * @example
 * ```ts
 * const task = await createTask('Buy groceries', 'Milk, eggs, bread', 'shopping', 'high', new Date('2024-12-31'));
 * console.log(task.id); // 1
 * ```
 */
export async function createTask(
  title: string,
  description?: string,
  category?: string | null,
  priority?: string,
  due_date?: Date | null
): Promise<Task> {
  try {
    const response = await fetch(`${API_URL}/api/tasks`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        title,
        description: description || null,
        category: category || null,
        priority: priority || 'medium',
        due_date: due_date ? due_date.toISOString() : null,
      }),
    });

    return handleResponse<Task>(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new Error(`Failed to create task: ${(error as Error).message}`);
  }
}

/**
 * Get all tasks for the authenticated user.
 *
 * @param completed - Optional filter by completion status
 * @returns Promise resolving to array of tasks
 * @throws ApiError if fetch fails
 *
 * @example
 * ```ts
 * // Get all tasks
 * const allTasks = await getTasks();
 *
 * // Get only completed tasks
 * const completedTasks = await getTasks(true);
 *
 * // Get only incomplete tasks
 * const incompleteTasks = await getTasks(false);
 * ```
 */
export async function getTasks(completed?: boolean): Promise<Task[]> {
  try {
    const url = new URL(`${API_URL}/api/tasks`);
    if (completed !== undefined) {
      url.searchParams.set('completed', String(completed));
    }

    console.log('🔍 API_URL:', API_URL);
    console.log('🔍 Full URL:', url.toString());
    console.log('🔑 Auth token exists:', !!localStorage.getItem('auth_token'));

    const headers = getAuthHeaders();
    console.log('📤 Request headers:', headers);

    console.log('🚀 Making fetch request...');

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: headers,
      mode: 'cors',
      credentials: 'omit',
    });

    console.log('📥 Response received! Status:', response.status);

    // Backend returns {tasks: [...], total: number}
    const data = await handleResponse<{ tasks: Task[]; total: number }>(response);
    console.log('✅ Tasks fetched successfully:', data.tasks.length);
    return data.tasks; // Extract just the tasks array
  } catch (error) {
    console.error('❌ Error details:', {
      error,
      message: (error as Error).message,
      stack: (error as Error).stack,
      name: (error as Error).name
    });

    if (error instanceof ApiError) {
      throw error;
    }

    // Better error message for network errors
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error(
        'Cannot connect to backend server at ' + API_URL +
        '. Please ensure the backend is running on port 8000.'
      );
    }

    throw new Error(`Failed to fetch tasks: ${(error as Error).message}`);
  }
}

/**
 * Get a single task by ID.
 *
 * @param id - Task ID
 * @returns Promise resolving to the task
 * @throws ApiError if task not found or fetch fails
 *
 * @example
 * ```ts
 * const task = await getTask(1);
 * console.log(task.title);
 * ```
 */
export async function getTask(id: number): Promise<Task> {
  try {
    const response = await fetch(`${API_URL}/api/tasks/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    return handleResponse<Task>(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new Error(`Failed to fetch task: ${(error as Error).message}`);
  }
}

/**
 * Update a task.
 *
 * @param id - Task ID
 * @param data - Partial task data to update (title, description, completed, category, priority, due_date, or order)
 * @returns Promise resolving to the updated task
 * @throws ApiError if update fails
 *
 * @example
 * ```ts
 * // Update title
 * const task = await updateTask(1, { title: 'New title' });
 *
 * // Update with Phase 2 fields
 * const task = await updateTask(1, {
 *   category: 'work',
 *   priority: 'high',
 *   due_date: new Date('2024-12-31')
 * });
 *
 * // Mark as completed
 * const task = await updateTask(1, { completed: true });
 * ```
 */
export async function updateTask(
  id: number,
  data: {
    title?: string;
    description?: string;
    completed?: boolean;
    category?: string | null;
    priority?: string;
    due_date?: Date | null;
    order?: number;
  }
): Promise<Task> {
  try {
    // Convert Date to ISO string if present
    const payload = {
      ...data,
      due_date: data.due_date ? data.due_date.toISOString() : data.due_date === null ? null : undefined,
    };

    const response = await fetch(`${API_URL}/api/tasks/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    return handleResponse<Task>(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new Error(`Failed to update task: ${(error as Error).message}`);
  }
}

/**
 * Toggle task completion status.
 *
 * @param id - Task ID
 * @returns Promise resolving to the updated task
 * @throws ApiError if toggle fails
 *
 * @example
 * ```ts
 * const task = await toggleComplete(1);
 * console.log(task.completed); // true or false
 * ```
 */
export async function toggleComplete(id: number): Promise<Task> {
  try {
    const response = await fetch(`${API_URL}/api/tasks/${id}/complete`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });

    return handleResponse<Task>(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new Error(`Failed to toggle task completion: ${(error as Error).message}`);
  }
}

/**
 * Delete a task.
 *
 * @param id - Task ID
 * @returns Promise resolving to void
 * @throws ApiError if deletion fails
 *
 * @example
 * ```ts
 * await deleteTask(1);
 * console.log('Task deleted successfully');
 * ```
 */
export async function deleteTask(id: number): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/api/tasks/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    return handleResponse<void>(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new Error(`Failed to delete task: ${(error as Error).message}`);
  }
}
