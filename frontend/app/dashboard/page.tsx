// frontend/app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { User, Task } from '@/lib/types';
import { getTasks, createTask, updateTask, deleteTask } from '@/lib/api';
import TaskList from '@/components/TaskList';
import TaskForm from '@/components/TaskForm';
import SearchBar from '@/components/SearchBar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  const router = useRouter();

  // User state
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Task state
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isTasksLoading, setIsTasksLoading] = useState(false);
  const [tasksError, setTasksError] = useState<string | null>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Check auth
  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          router.push('/');
          return;
        }
        const userDataString = localStorage.getItem('user');
        if (!userDataString) {
          localStorage.removeItem('auth_token');
          router.push('/');
          return;
        }
        setUser(JSON.parse(userDataString));
      } catch (error) {
        console.error('Error checking authentication:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        router.push('/');
      } finally {
        setIsAuthLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  // Fetch tasks
  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    setIsTasksLoading(true);
    setTasksError(null);
    try {
      const fetchedTasks = await getTasks();
      setTasks(fetchedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setTasksError(error instanceof Error ? error.message : 'Failed to load tasks');
    } finally {
      setIsTasksLoading(false);
    }
  };

  const handleCreateTask = async (
    title: string,
    description: string,
    category?: string | null,
    priority?: string,
    dueDate?: Date | null
  ) => {
    try {
      const newTask = await createTask(title, description, category, priority, dueDate);
      setTasks(prevTasks => [newTask, ...prevTasks]);
      setShowCreateModal(false);
      toast.success('Task created successfully!');
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  };

  const handleUpdateTask = async (
    title: string,
    description: string,
    category?: string | null,
    priority?: string,
    dueDate?: Date | null
  ) => {
    if (!editingTask) return;
    try {
      const updatedTask = await updateTask(editingTask.id, {
        title,
        description,
        category,
        priority,
        due_date: dueDate,
      });
      setTasks(prevTasks =>
        prevTasks.map(task => (task.id === updatedTask.id ? updatedTask : task))
      );
      setEditingTask(null);
      toast.success('Task updated successfully!');
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  };

  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks(prevTasks =>
      prevTasks.map(task => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  const handleTaskDelete = async (taskId: number) => {
    try {
      await deleteTask(taskId);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      toast.success('Task deleted successfully!');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete task');
    }
  };

  if (isAuthLoading) return null; // Let layout handle loading state if necessary or add simple spinner

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Header Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 p-8 shadow-2xl">
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tight text-white">
              Welcome back, {user?.name || 'User'}!
            </h1>
            <p className="text-white/90 text-lg font-medium">
              Let&apos;s make today productive and organized.
            </p>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            size="lg"
            className="bg-white !text-blue-600 hover:bg-white/90 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 font-semibold"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5 mr-2"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
            <span className="font-semibold text-blue-600">New Task</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards with Glass-morphism */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:to-cyan-500/20 border-blue-200/50 dark:border-blue-800/50 hover:shadow-xl hover:scale-105 transition-all duration-300 animate-slideUp">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold">Total Tasks</CardTitle>
            <div className="p-2 rounded-lg bg-blue-500/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-5 w-5 text-blue-600 dark:text-blue-400"
              >
                <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-blue-600 dark:text-blue-400">{tasks.length}</div>
            <p className="text-xs text-muted-foreground font-medium mt-1">
              Total in your workspace
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-orange-500/10 to-amber-500/10 dark:from-orange-500/20 dark:to-amber-500/20 border-orange-200/50 dark:border-orange-800/50 hover:shadow-xl hover:scale-105 transition-all duration-300 animate-slideUp" style={{ animationDelay: '0.1s' }}>
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold">Active</CardTitle>
            <div className="p-2 rounded-lg bg-orange-500/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-5 w-5 text-orange-600 dark:text-orange-400"
              >
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-orange-600 dark:text-orange-400">{tasks.filter(t => !t.completed).length}</div>
            <p className="text-xs text-muted-foreground font-medium mt-1">
              Tasks in progress
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-green-500/10 to-emerald-500/10 dark:from-green-500/20 dark:to-emerald-500/20 border-green-200/50 dark:border-green-800/50 hover:shadow-xl hover:scale-105 transition-all duration-300 animate-slideUp" style={{ animationDelay: '0.2s' }}>
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-full blur-2xl" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold">Completed</CardTitle>
            <div className="p-2 rounded-lg bg-green-500/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-5 w-5 text-green-600 dark:text-green-400"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-green-600 dark:text-green-400">{tasks.filter(t => t.completed).length}</div>
            <p className="text-xs text-muted-foreground font-medium mt-1">
              Successfully done
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Task List Area */}
      <Card className="border-border/50 shadow-xl bg-card/50 backdrop-blur-sm">
        <CardHeader className="border-b border-border/50 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">Your Tasks</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Organize and track your work efficiently</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-6">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search tasks by title, description, or category..."
            />
          </div>

          <TaskList
            tasks={tasks}
            searchQuery={searchQuery}
            onTaskUpdate={handleTaskUpdate}
            onTaskDelete={handleTaskDelete}
            onTaskEdit={setEditingTask}
            isLoading={isTasksLoading}
            error={tasksError}
          />
        </CardContent>
      </Card>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-2xl bg-card rounded-3xl shadow-2xl overflow-hidden animate-scaleIn">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-border/50 flex items-center justify-between bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-slate-800 dark:to-slate-900">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                </div>
                <h2 className="text-xl font-bold">Create New Task</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowCreateModal(false)} className="hover:bg-destructive/10 hover:text-destructive transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
              </Button>
            </div>
            {/* Modal Body */}
            <div className="px-6 py-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              <TaskForm
                onSubmit={handleCreateTask}
                submitLabel="Create Task"
                onCancel={() => setShowCreateModal(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingTask && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-2xl bg-card rounded-3xl shadow-2xl overflow-hidden animate-scaleIn">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-border/50 flex items-center justify-between bg-gradient-to-r from-purple-50 to-pink-50 dark:from-slate-800 dark:to-slate-900">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                </div>
                <h2 className="text-xl font-bold">Edit Task</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setEditingTask(null)} className="hover:bg-destructive/10 hover:text-destructive transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
              </Button>
            </div>
            {/* Modal Body */}
            <div className="px-6 py-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              <TaskForm
                onSubmit={handleUpdateTask}
                initialTitle={editingTask.title}
                initialDescription={editingTask.description || ''}
                initialCategory={editingTask.category}
                initialPriority={editingTask.priority}
                initialDueDate={editingTask.due_date}
                submitLabel="Update Task"
                onCancel={() => setEditingTask(null)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
