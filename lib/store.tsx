import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { WorkItem, WorkItemType } from '@/types';

interface User {
  email: string;
  name: string;
  password: string;
}

interface Store {
  // Auth
  isLoggedIn: boolean;
  user: User | null;
  users: User[];
  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, password: string) => boolean;
  logout: () => void;

  // Work Items
  workItems: WorkItem[];
  addWorkItem: (data: Omit<WorkItem, 'id' | 'created' | 'lastUpdated'>) => void;
  updateWorkItem: (id: string, updates: Partial<WorkItem>) => void;
  deleteWorkItem: (id: string) => void;
  getByType: (type?: WorkItemType) => WorkItem[];
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      user: null,
      users: [{ email: "demo@strat101.com", name: "Demo User", password: "demo123" }],

      login: (email, password) => {
        const found = get().users.find(u => u.email === email && u.password === password);
        if (found) {
          set({ isLoggedIn: true, user: found });
          return true;
        }
        return false;
      },

      signup: (name, email, password) => {
        if (get().users.some(u => u.email === email)) return false;
        const newUser = { email, name, password };
        set(state => ({
          users: [...state.users, newUser],
          isLoggedIn: true,
          user: newUser
        }));
        return true;
      },

      logout: () => set({ isLoggedIn: false, user: null }),

      workItems: [],
      addWorkItem: (data) => {
        const newItem: WorkItem = {
          ...data,
          id: uuidv4(),
          created: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
        };
        set(state => ({ workItems: [...state.workItems, newItem] }));
      },
      updateWorkItem: (id, updates) => {
        set(state => ({
          workItems: state.workItems.map(item =>
            item.id === id ? { ...item, ...updates, lastUpdated: new Date().toISOString() } : item
          )
        }));
      },
      deleteWorkItem: (id) => set(state => ({
        workItems: state.workItems.filter(item => item.id !== id)
      })),
      getByType: (type) => {
        const items = get().workItems;
        return type ? items.filter(i => i.type === type) : items;
      },
    }),
    { name: 'strat101-storage' }
  )
);

export const initDemoData = () => {
  const { workItems, isLoggedIn } = useStore.getState();
  if (!isLoggedIn || workItems.length > 0) return;

  const demo = [
    {
      type: "Vision" as const,
      title: "Become the leading transformation platform",
      description: "Enable organizations to execute strategy flawlessly",
      scope: "Global enterprises",
      assumptions: "Market demand exists",
      currentStatus: "Active",
      status: "In-Progress" as const,
      impact: ["Revenue"] as const,
      impactDescription: "Drive revenue growth",
      priority: "Critical" as const,
      health: "Green" as const,
      risk: "Medium" as const,
      riskDescription: "Competition from Jira",
      owner: "CEO",
      assignedTo: "Strategy Team",
      businessUnit: "Corporate",
      approvedBudget: 500000,
      actualCost: 150000,
      startDate: "2025-01-01",
      endDate: "2027-12-31",
      progress: 35,
      tags: ["strategic"],
      createdBy: "System",
      parentId: undefined,
      dependencies: [],
    }
  ];
  demo.forEach(item => useStore.getState().addWorkItem(item));
};
