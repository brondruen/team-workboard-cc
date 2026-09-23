import { Component } from '@angular/core';

interface ProjectStatus {
  label: string;
  count: number;
  percentage: number;
  color: string;
}

@Component({
  selector: 'app-projects-overview',
  imports: [],
  templateUrl: './projects-overview.html',
  styleUrl: './projects-overview.scss',
})
export class ProjectsOverview {
  totalProjects = 24;
  statuses: ProjectStatus[] = [
    { label: 'Active', count: 8, percentage: 35, color: '#4f46e5' },
    { label: 'In Progress', count: 6, percentage: 25, color: '#3b82f6' },
    { label: 'Planning', count: 5, percentage: 20, color: '#8b5cf6' },
    { label: 'On Hold', count: 4, percentage: 15, color: '#f59e0b' },
    { label: 'Completed', count: 1, percentage: 5, color: '#ef4444' },
  ];

  get conicGradient(): string {
    let accumulated = 0;
    const stops = this.statuses.map(s => {
      const start = accumulated;
      accumulated += s.percentage;
      return `${s.color} ${start}% ${accumulated}%`;
    });
    return `conic-gradient(${stops.join(', ')})`;
  }
}
