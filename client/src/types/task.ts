export interface TimeEntry {
  id: string;
  startTime: string;
  endTime: string;
}

export interface Task {
  id: string;
  project: string;
  title: string;
  description: string;  
  tools: string[];
  timeEntries: TimeEntry[];
  isComplete: boolean;
  completionPercent: number;

  // Backend optional
  saved?: boolean;
  worklogId?: number;
}
