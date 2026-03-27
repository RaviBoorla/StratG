'use client';

import { useState } from 'react';
import { WorkItem, Status, Priority, Health, Risk } from '@/types';
import { useStore } from '@/lib/store';
import { Plus, Filter } from 'lucide-react';

const COLUMNS: Status[] = ["Draft", "In-Progress", "On-Hold", "Cancelled", "Closed"];

export default function KanbanBoard() {
  const { workItems, updateWorkItem } = useStore();
  const [selectedFilters, setSelectedFilters] = useState({
    status: [] as Status[],
    priority: [] as Priority[],
    health: [] as Health[],
    risk: [] as Risk[],
  });
  const [showNewBoard, setShowNewBoard] = useState(false);

  const filteredItems = workItems.filter(item => {
    if (selectedFilters.status.length && !selectedFilters.status.includes(item.status)) return false;
    if (selectedFilters.priority.length && !selectedFilters.priority.includes(item.priority)) return false;
    if (selectedFilters.health.length && !selectedFilters.health.includes(item.health)) return false;
    if (selectedFilters.risk.length && !selectedFilters.risk.includes(item.risk)) return false;
    return true;
  });

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDrop = (e: React.DragEvent, newStatus: Status) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    updateWorkItem(id, { status: newStatus });
  };

  const toggleFilter = (category: keyof typeof selectedFilters, value: any) => {
    setSelectedFilters(prev => {
      const current = prev[category] as any[];
      const newList = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      return { ...prev, [category]: newList };
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">Kanban Board</h1>
          <p className="text-gray-600">Drag cards between columns • Click filters below</p>
        </div>
        <button
          onClick={() => setShowNewBoard(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700"
        >
          <Plus size={20} /> New Board
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-2xl shadow mb-8">
        <div className="flex items-center gap-2 mb-4 text-sm font-medium text-gray-500">
          <Filter size={18} /> FILTERS
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {(['status', 'priority', 'health', 'risk'] as const).map(cat => (
            <div key={cat}>
              <div className="capitalize font-medium mb-3">{cat}</div>
              <div className="flex flex-wrap gap-2">
                {(cat === 'status' ? ["Draft","In-Progress","On-Hold","Cancelled","Closed"] :
                  cat === 'priority' ? ["Critical","High","Medium","Low"] :
                  cat === 'health' ? ["Red","Amber","Green"] : ["High","Medium","Low"]).map((val: any) => (
                  <button
                    key={val}
                    onClick={() => toggleFilter(cat, val)}
                    className={`px-4 py-1 text-xs rounded-full border transition-all ${
                      selectedFilters[cat].includes(val)
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {COLUMNS.map(status => {
          const columnItems = filteredItems.filter(i => i.status === status);
          return (
            <div
              key={status}
              onDragOver={e => e.preventDefault()}
              onDrop={e => handleDrop(e, status)}
              className="bg-gray-50 rounded-2xl p-4 min-h-[600px] border border-dashed border-gray-200"
            >
              <div className="font-semibold text-lg mb-4 flex items-center justify-between sticky top-0 bg-gray-50 py-2">
                {status} <span className="text-sm text-gray-500">({columnItems.length})</span>
              </div>
              {columnItems.map(item => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={e => handleDragStart(e, item.id)}
                  className="bg-white rounded-xl shadow p-5 mb-4 cursor-move hover:shadow-lg transition-all border border-gray-100"
                >
                  <div className="font-medium">{item.title}</div>
                  <div className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</div>
                  <div className="flex gap-2 mt-4">
                    <span className={`text-xs px-3 py-1 rounded-full ${item.health === 'Green' ? 'bg-green-100 text-green-700' : item.health === 'Amber' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                      {item.health}
                    </span>
                    <span className="text-xs px-3 py-1 bg-gray-100 rounded-full">{item.priority}</span>
                  </div>
                </div>
              ))}
              {columnItems.length === 0 && (
                <div className="text-center text-gray-400 py-12">Drop items here</div>
              )}
            </div>
          );
        })}
      </div>

      {showNewBoard && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl max-w-md w-full">
            <h3 className="text-2xl font-bold mb-6">Create New Board</h3>
            <p className="text-gray-600 mb-8">Custom filtered boards coming soon. For now, use the filters above.</p>
            <button
              onClick={() => setShowNewBoard(false)}
              className="w-full py-4 bg-gray-900 text-white rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}