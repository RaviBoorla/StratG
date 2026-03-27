'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import Link from 'next/link';
import { LayoutDashboard, Kanban, List, BarChart3, Bot, Plus, LogOut, Menu } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/board', label: 'Kanban Board', icon: Kanban },
  { href: '/dashboard/work-items', label: 'Work Items', icon: List },
  { href: '/dashboard/create', label: 'Create New', icon: Plus },
  { href: '/dashboard/reports', label: 'Reports', icon: BarChart3 },
  { href: '/dashboard/ai', label: 'AI Assist', icon: Bot },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isLoggedIn, user, logout } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) return null;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r transition-all duration-300 flex flex-col`}>
        <div className="p-6 border-b flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-600 rounded-2xl flex items-center justify-center">
            <span className="text-white font-bold text-2xl">S</span>
          </div>
          {sidebarOpen && <div className="font-bold text-2xl">Strat101</div>}
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-5 py-3.5 rounded-2xl hover:bg-gray-100 transition-colors text-gray-700 hover:text-gray-900"
              >
                <Icon size={22} />
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t mt-auto">
          <div className="px-4 py-3 text-sm text-gray-500">
            {sidebarOpen && user?.email}
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-5 py-3.5 text-red-600 hover:bg-red-50 rounded-2xl transition-colors"
          >
            <LogOut size={22} />
            {sidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b flex items-center px-8 justify-between">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-500 hover:text-gray-700">
            <Menu size={24} />
          </button>
          <div className="font-semibold text-xl">Program Management Platform</div>
          <div />
        </header>

        <main className="flex-1 overflow-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}