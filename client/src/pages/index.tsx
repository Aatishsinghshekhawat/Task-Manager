import Head from 'next/head';
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If user is authenticated, redirect to dashboard
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
        <div className="text-xl text-zinc-500">Loading...</div>
      </div>
    );
  }

  // Only show home page if user is not authenticated
  if (user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-50 font-sans selection:bg-blue-500/30">
      <Head>
        <title>Task Manager</title>
        <meta name="description" content="Collaborative Task Manager" />
      </Head>

      <main className="flex min-h-screen flex-col items-center justify-center p-6 relative overflow-hidden">

        {/* Ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center space-y-8 max-w-3xl">
          <div className="space-y-4">
            <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight">
              Manage Tasks <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-violet-500">Effortlessly</span>
            </h1>
            <p className="text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Streamline your workflow with our intuitive, collaborative task management platform.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link href="/register" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold transition-all shadow-lg hover:shadow-blue-500/25">
              Get Started
            </Link>
            <Link href="/login" className="px-8 py-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 rounded-full font-semibold transition-all">
              Sign In
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
