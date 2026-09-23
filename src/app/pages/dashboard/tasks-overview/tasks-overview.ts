import { Component } from '@angular/core';

interface TaskStatus {
  label: string;
  count: number;
  percentage: number;
  color: string;
}

@Component({
  selector: 'app-tasks-overview',
  imports: [],
  templateUrl: './tasks-overview.html',
  styleUrl: './tasks-overview.scss',
})
export class TasksOverview {
  totalTasks = 342;
  statuses: TaskStatus[] = [
    { label: 'To Do', count: 120, percentage: 35, color: '#3b82f6' },
    { label: 'In Progress', count: 92, percentage: 27, color: '#6366f1' },
    { label: 'Review', count: 48, percentage: 14, color: '#f59e0b' },
    { label: 'Done', count: 82, percentage: 24, color: '#22c55e' },
  ];
}
