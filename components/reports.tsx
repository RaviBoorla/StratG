'use client';

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { useStore } from '@/lib/store';
import { Download } from 'lucide-react';

export default function Reports() {
  const { workItems } = useStore();
  const [view, setView] = useState<'list' | 'count' | 'graph'>('graph');

  const statusCounts = workItems.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const healthData = [
    { name: 'Green', value: workItems.filter(i => i.health === 'Green').length, fill: '#22c55e' },
    { name: 'Amber', value: workItems.filter(i => i.health === 'Amber').length, fill: '#f59e0b' },
    { name: 'Red', value: workItems.filter(i => i.health === 'Red').length, fill: '#ef4444' },
  ];

  const exportCSV = () => {
    const headers = ['Type','Title','Status','Priority','Health','Progress','Start Date','End Date'];
    const rows = workItems.map(item => [
      item.type, item.title, item.status, item.priority, item.health, item.progress,
      item.startDate, item.endDate
    ]);
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'strat101-report.csv';
    a.click();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Reports</h1>
        <div className="flex gap-3">
          <button onClick={() => setView('list')} className={`px-6 py-2 rounded-xl ${view === 'list' ? 'bg-indigo-600 text-white' : 'bg-white border'}`}>List</button>
          <button onClick={() => setView('count')} className={`px-6 py-2 rounded-xl ${view === 'count' ? 'bg-indigo-600 text-white' : 'bg-white border'}`}>Count</button>
          <button onClick={() => setView('graph')} className={`px-6 py-2 rounded-xl ${view === 'graph' ? 'bg-indigo-600 text-white' : 'bg-white border'}`}>Graphs</button>
          <button onClick={exportCSV} className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-xl">
            <Download size={18} /> Export CSV
          </button>
        </div>
      </div>

      {view === 'graph' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow">
            <h3 className="font-semibold mb-6">Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={Object.entries(statusCounts).map(([name, value]) => ({ name, value }))}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow">
            <h3 className="font-semibold mb-6">Health Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={healthData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
                  {healthData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {view === 'count' && (
        <div className="bg-white rounded-2xl p-8">
          <h3 className="font-semibold text-xl mb-6">Work Item Counts by Status</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {Object.entries(statusCounts).map(([status, count]) => (
              <div key={status} className="bg-gray-50 p-6 rounded-xl text-center">
                <div className="text-5xl font-bold text-indigo-600">{count}</div>
                <div className="mt-2 text-gray-600">{status}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === 'list' && (
        <div className="bg-white rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-6">Title</th>
                <th className="text-left p-6">Type</th>
                <th className="text-left p-6">Status</th>
                <th className="text-left p-6">Health</th>
                <th className="text-left p-6">Progress</th>
              </tr>
            </thead>
            <tbody>
              {workItems.map(item => (
                <tr key={item.id} className="border-t hover:bg-gray-50">
                  <td className="p-6 font-medium">{item.title}</td>
                  <td className="p-6">{item.type}</td>
                  <td className="p-6">{item.status}</td>
                  <td className="p-6">{item.health}</td>
                  <td className="p-6">{item.progress}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}