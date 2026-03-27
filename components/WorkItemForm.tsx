'use client';

import { useState, useEffect } from 'react';
import { WorkItem, WorkItemType, Status, Priority, Health, Risk, ImpactType } from '@/types';
import { useStore } from '@/lib/store';
import { Save, X } from 'lucide-react';

interface WorkItemFormProps {
  initialData?: Partial<WorkItem>;
  onClose?: () => void;
  onSuccess?: (item: WorkItem) => void;
}

const WORK_ITEM_TYPES: WorkItemType[] = [
  "Vision", "Mission", "Goals", "OKRs", "Initiative", "Program", 
  "Project", "Task", "Sub-Task"
];

const STATUS_OPTIONS: Status[] = ["Draft", "In-Progress", "On-Hold", "Cancelled", "Closed"];
const PRIORITY_OPTIONS: Priority[] = ["Critical", "High", "Medium", "Low"];
const HEALTH_OPTIONS: Health[] = ["Red", "Amber", "Green"];
const RISK_OPTIONS: Risk[] = ["High", "Medium", "Low"];
const IMPACT_OPTIONS: ImpactType[] = ["Revenue", "Cost", "Risk Mitigation"];

export default function WorkItemForm({ initialData, onClose, onSuccess }: WorkItemFormProps) {
  const { addWorkItem, updateWorkItem } = useStore();

  const [formData, setFormData] = useState<Partial<WorkItem>>({
    type: "Project",
    title: "",
    description: "",
    scope: "",
    assumptions: "",
    currentStatus: "",
    status: "Draft",
    impact: [],
    impactDescription: "",
    priority: "Medium",
    health: "Green",
    risk: "Medium",
    riskDescription: "",
    owner: "",
    assignedTo: "",
    businessUnit: "",
    approvedBudget: 0,
    actualCost: 0,
    startDate: "",
    endDate: "",
    progress: 0,
    tags: [],
    createdBy: "Demo User",
    keyResults: "",
    parentId: initialData?.parentId,
    dependencies: [],
    ...initialData,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [autoSaved, setAutoSaved] = useState(false);

  // Auto-save after Title field is entered (as requested)
  useEffect(() => {
    if (formData.title && formData.title.length > 3) {
      const timeout = setTimeout(() => {
        handleAutoSave();
      }, 800);
      return () => clearTimeout(timeout);
    }
  }, [formData.title]);

  const handleAutoSave = async () => {
    if (!formData.title) return;
    
    setAutoSaved(true);
    setTimeout(() => setAutoSaved(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.type) return;

    setIsSaving(true);

    const payload = {
      ...formData,
      type: formData.type as WorkItemType,
      status: formData.status as Status,
      priority: formData.priority as Priority,
      health: formData.health as Health,
      risk: formData.risk as Risk,
      impact: formData.impact as ImpactType[],
      tags: formData.tags || [],
      dependencies: formData.dependencies || [],
    } as Omit<WorkItem, 'id' | 'created' | 'lastUpdated'>;

    if (initialData?.id) {
      updateWorkItem(initialData.id, payload);
    } else {
      addWorkItem(payload);
    }

    setTimeout(() => {
      setIsSaving(false);
      onSuccess?.(payload as WorkItem);
      onClose?.();
    }, 600);
  };

  const updateField = (field: keyof WorkItem, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleImpact = (impact: ImpactType) => {
    const current = formData.impact || [];
    const newImpact = current.includes(impact)
      ? current.filter(i => i !== impact)
      : [...current, impact];
    updateField('impact', newImpact);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-900">
          {initialData?.id ? 'Edit Work Item' : 'Create New Work Item'}
        </h2>
        {onClose && (
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={28} />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Type & Title Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Work Item Type</label>
            <select
              value={formData.type}
              onChange={(e) => updateField('type', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
              required
            >
              {WORK_ITEM_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => updateField('title', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter title..."
              required
            />
            {autoSaved && (
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <Save size={14} /> Auto-saved
              </p>
            )}
          </div>
        </div>

        {/* Description & Scope */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
              placeholder="Detailed description..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Scope</label>
            <textarea
              value={formData.scope}
              onChange={(e) => updateField('scope', e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
              placeholder="What is in scope..."
            />
          </div>
        </div>

        {/* Assumptions & Current Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Assumptions</label>
            <textarea
              value={formData.assumptions}
              onChange={(e) => updateField('assumptions', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Status (Free text)</label>
            <textarea
              value={formData.currentStatus}
              onChange={(e) => updateField('currentStatus', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl"
            />
          </div>
        </div>

        {/* Status, Priority, Health, Risk */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => updateField('status', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl"
            >
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => updateField('priority', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl"
            >
              {PRIORITY_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Health</label>
            <select
              value={formData.health}
              onChange={(e) => updateField('health', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl"
            >
              {HEALTH_OPTIONS.map(h => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Risk</label>
            <select
              value={formData.risk}
              onChange={(e) => updateField('risk', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl"
            >
              {RISK_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>

        {/* Impact */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Impact Areas</label>
          <div className="flex flex-wrap gap-3">
            {IMPACT_OPTIONS.map(impact => (
              <button
                key={impact}
                type="button"
                onClick={() => toggleImpact(impact)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  (formData.impact || []).includes(impact)
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {impact}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Impact Description</label>
          <textarea
            value={formData.impactDescription}
            onChange={(e) => updateField('impactDescription', e.target.value)}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl"
          />
        </div>

        {/* Risk Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Risk Description</label>
          <textarea
            value={formData.riskDescription}
            onChange={(e) => updateField('riskDescription', e.target.value)}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl"
          />
        </div>

        {/* Owner, Assigned To, Business Unit */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Owner</label>
            <input
              type="text"
              value={formData.owner}
              onChange={(e) => updateField('owner', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl"
              placeholder="Owner name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Assigned To</label>
            <input
              type="text"
              value={formData.assignedTo}
              onChange={(e) => updateField('assignedTo', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl"
              placeholder="Assigned person/team"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Business Unit</label>
            <input
              type="text"
              value={formData.businessUnit}
              onChange={(e) => updateField('businessUnit', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl"
              placeholder="Business Unit"
            />
          </div>
        </div>

        {/* Budget & Cost */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Approved Budget ($)</label>
            <input
              type="number"
              value={formData.approvedBudget}
              onChange={(e) => updateField('approvedBudget', parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Actual Cost ($)</label>
            <input
              type="number"
              value={formData.actualCost}
              onChange={(e) => updateField('actualCost', parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Progress (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={formData.progress}
              onChange={(e) => updateField('progress', parseInt(e.target.value) || 0)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl"
            />
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => updateField('startDate', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => updateField('endDate', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl"
            />
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma separated)</label>
          <input
            type="text"
            value={formData.tags?.join(', ') || ''}
            onChange={(e) => updateField('tags', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl"
            placeholder="strategic, q2, transformation"
          />
        </div>

        {/* Key Results - Only for OKRs */}
        {formData.type === "OKRs" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Key Results (Multi-line)</label>
            <textarea
              value={formData.keyResults}
              onChange={(e) => updateField('keyResults', e.target.value)}
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl"
              placeholder="KR1: ...\nKR2: ..."
            />
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-end gap-4 pt-6 border-t">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-3 border border-gray-300 rounded-xl hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSaving || !formData.title}
            className="px-10 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
          >
            {isSaving ? 'Saving...' : initialData?.id ? 'Update Work Item' : 'Create Work Item'}
          </button>
        </div>
      </form>
    </div>
  );
}
