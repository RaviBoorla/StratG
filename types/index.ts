export type WorkItemType = 
  | "Vision" | "Mission" | "Goals" | "OKRs" 
  | "Initiative" | "Program" | "Project" | "Task" | "Sub-Task";

export type Status = "Draft" | "In-Progress" | "On-Hold" | "Cancelled" | "Closed";
export type Priority = "Critical" | "High" | "Medium" | "Low";
export type Health = "Red" | "Amber" | "Green";
export type Risk = "High" | "Medium" | "Low";
export type ImpactType = "Revenue" | "Cost" | "Risk Mitigation";

export interface WorkItem {
  id: string;
  type: WorkItemType;
  title: string;
  description: string;
  scope: string;
  assumptions: string;
  currentStatus: string;
  status: Status;
  impact: ImpactType[];
  impactDescription: string;
  priority: Priority;
  health: Health;
  risk: Risk;
  riskDescription: string;
  owner: string;
  assignedTo: string;
  businessUnit: string;
  approvedBudget: number;
  actualCost: number;
  startDate: string;
  endDate: string;
  progress: number;
  tags: string[];
  lastUpdated: string;
  created: string;
  createdBy: string;
  keyResults?: string;
  parentId?: string;
  dependencies?: string[];
}