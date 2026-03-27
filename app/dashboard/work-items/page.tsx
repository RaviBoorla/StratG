'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import WorkItemForm from '@/components/WorkItemForm';
import SidePanel from '@/components/SidePanel';
import { Plus, Edit } from 'lucide-react';

export default function WorkItemsPage() {
  const { workItems, getByType } = useStore();
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const types = ['All', 'Vision', 'Mission', 'Goals', 'OKRs', 'Initiative', 'Program', 'Project', 'Task', 'Sub-Task'];

  const displayedItems = selectedType === 'All' 
    ? workItems 
    : getByType(selectedType as any);

  return (
    <div>
      <div className="flex justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold">Work Items</h1>
          <p className="text-gray-600">All transformation initiatives in one place</p>
        </div>
        <button
          onClick={() => { setEditingItem(null); setShowForm(true); }}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl"
        >
          <Plus size={20} /> New Work Item
        </button>
      </div>

      {/* Type Filter */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {types.map(t => (
          <button
            key={t}
            onClick={() => setSelectedType(t)}
            className={`px-5 py-2 rounded-full text-sm ${selectedType === t ? 'bg-indigo-600 text-white' : 'bg-white border hover:bg-gray-50'}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="text-left p-6">Title</th>
              <th className="text-left p-6">Type</th>
              <th className="text-left p-6">Status</th>
              <th className="text-left p-6">Health</th>
              <th className="text-left p-6">Progress</th>
              <th className="w-24"></th>
            </tr>
          </thead>
          <tbody>
            {displayedItems.map(item => (
              <tr key={item.id} className="border-t hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedItem(item)}>
                <td className="p-6 font-medium">{item.title}</td>
                <td className="p-6">{item.type}</td>
                <td className="p-6">{item.status}</td>
                <td className="p-6">{item.health}</td>
                <td className="p-6">{item.progress}%</td>
                <td className="p-6">
                  <button 
                    onClick={e => { e.stopPropagation(); setEditingItem(item); setShowForm(true); }}
                    className="text-indigo-600 hover:text-indigo-700"
                  >
                    <Edit size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-auto">
          <WorkItemForm 
            initialData={editingItem} 
            onClose={() => { setShowForm(false); setEditingItem(null); }} 
          />
        </div>
      )}

      <SidePanel item={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  );
}