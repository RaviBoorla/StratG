'use client';

import { useStore } from '@/lib/store';
import Link from 'next/link';

export default function DashboardOverview() {
  const { workItems } = useStore();

  const stats = {
    total: workItems.length,
    inProgress: workItems.filter(i => i.status === 'In-Progress').length,
    redHealth: workItems.filter(i => i.health === 'Red').length,
    avgProgress: workItems.length ? Math.round(workItems.reduce((a, b) => a + b.progress, 0) / workItems.length) : 0,
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-10">Transformation Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {[
          { label: 'Total Work Items', value: stats.total },
          { label: 'In Progress', value: stats.inProgress },
          { label: 'Red Health Items', value: stats.redHealth },
          { label: 'Avg Progress', value: `${stats.avgProgress}%` },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-3xl shadow">
            <div className="text-5xl font-bold text-indigo-600">{stat.value}</div>
            <div className="mt-3 text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/dashboard/board" className="bg-white p-8 rounded-3xl shadow hover:shadow-xl transition-all group">
          <div className="text-2xl font-semibold mb-2 group-hover:text-indigo-600">Kanban Board</div>
          <p className="text-gray-600">Visual execution tracking with drag & drop</p>
        </Link>
        <Link href="/dashboard/work-items" className="bg-white p-8 rounded-3xl shadow hover:shadow-xl transition-all group">
          <div className="text-2xl font-semibold mb-2 group-hover:text-indigo-600">All Work Items</div>
          <p className="text-gray-600">Full list with hierarchy & details</p>
        </Link>
        <Link href="/dashboard/reports" className="bg-white p-8 rounded-3xl shadow hover:shadow-xl transition-all group">
          <div className="text-2xl font-semibold mb-2 group-hover:text-indigo-600">Reports & Insights</div>
          <p className="text-gray-600">Charts, counts and export</p>
        </Link>
      </div>
    </div>
  );
}