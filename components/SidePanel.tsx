'use client';

import { WorkItem } from '@/types';
import { X, Link as LinkIcon, GitBranch } from 'lucide-react';

interface SidePanelProps {
  item: WorkItem | null;
  onClose: () => void;
}

export default function SidePanel({ item, onClose }: SidePanelProps) {
  if (!item) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl border-l z-50 overflow-auto">
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="text-sm text-indigo-600 font-medium">{item.type}</div>
            <h2 className="text-2xl font-bold mt-1">{item.title}</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={28} />
          </button>
        </div>

        <div className="space-y-8">
          <div>
            <div className="uppercase text-xs tracking-widest text-gray-500 mb-2">DETAILS</div>
            <div className="grid grid-cols-2 gap-y-6 text-sm">
              <div className="font-medium">Status</div><div>{item.status}</div>
              <div className="font-medium">Priority</div><div>{item.priority}</div>
              <div className="font-medium">Health</div><div className={item.health === 'Red' ? 'text-red-600' : item.health === 'Amber' ? 'text-amber-600' : 'text-green-600'}>{item.health}</div>
              <div className="font-medium">Risk</div><div>{item.risk}</div>
              <div className="font-medium">Progress</div><div>{item.progress}%</div>
              <div className="font-medium">Owner</div><div>{item.owner}</div>
            </div>
          </div>

          <div>
            <div className="uppercase text-xs tracking-widest text-gray-500 mb-2">DESCRIPTION</div>
            <p className="text-gray-700 leading-relaxed">{item.description || 'No description provided.'}</p>
          </div>

          {item.keyResults && (
            <div>
              <div className="uppercase text-xs tracking-widest text-gray-500 mb-2">KEY RESULTS</div>
              <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-xl">{item.keyResults}</pre>
            </div>
          )}

          <div>
            <div className="uppercase text-xs tracking-widest text-gray-500 mb-3 flex items-center gap-2">
              <GitBranch size={16} /> HIERARCHY & DEPENDENCIES
            </div>
            <div className="text-sm text-gray-600">
              Parent ID: {item.parentId || 'None'}<br />
              Dependencies: {item.dependencies?.length ? item.dependencies.join(', ') : 'None'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}