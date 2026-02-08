// frontend/app/page.tsx
import AuthForm from '@/components/AuthForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Welcome | Prism',
  description: 'Break Down Your Tasks, Organize Your Ideas',
};

export default function Home() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-950 dark:to-purple-950" />

      {/* Animated orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-400/20 dark:bg-cyan-400/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400/20 dark:bg-purple-400/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />

      <div className="w-full max-w-md space-y-8 relative z-10 animate-fadeIn">
        <div className="space-y-4 text-center">
          {/* Logo with gradient */}
          <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 mb-4 shadow-2xl shadow-cyan-500/25 transform hover:scale-105 transition-transform duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-10 h-10"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>

          {/* Brand name with gradient */}
          <h1 className="text-5xl font-black tracking-tight">
            <span className="gradient-text">Prism AI</span>
          </h1>

          <p className="text-muted-foreground text-lg font-medium max-w-sm mx-auto">
            Break Down Your Tasks, Organize Your Ideas
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300">
              Smart Priorities
            </span>
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
              Categories
            </span>
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
              Due Dates
            </span>
          </div>
        </div>

        <AuthForm />

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            By continuing, you agree to our{' '}
            <a href="#" className="underline underline-offset-4 hover:text-primary transition-colors">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="underline underline-offset-4 hover:text-primary transition-colors">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
