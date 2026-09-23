import { Component } from '@angular/core';

interface Deadline {
  month: string;
  day: number;
  project: string;
  task: string;
  priority: string;
  priorityClass: string;
}

@Component({
  selector: 'app-upcoming-deadlines',
  imports: [],
  templateUrl: './upcoming-deadlines.html',
  styleUrl: './upcoming-deadlines.scss',
})
export class UpcomingDeadlines {
  deadlines: Deadline[] = [
    {
      month: 'MAY',
      day: 15,
      project: 'Mobile App Development',
      task: 'Phase 1 Release',
      priority: 'High Priority',
      priorityClass: 'badge-high',
    },
    {
      month: 'MAY',
      day: 20,
      project: 'Website Redesign',
      task: 'Design System',
      priority: 'Medium Priority',
      priorityClass: 'badge-medium',
    },
    {
      month: 'MAY',
      day: 25,
      project: 'API Integration',
      task: 'User Authentication',
      priority: 'Medium Priority',
      priorityClass: 'badge-medium',
    },
    {
      month: 'JUN',
      day: 10,
      project: 'Customer Portal',
      task: 'Beta Testing',
      priority: 'Low Priority',
      priorityClass: 'badge-low',
    },
  ];
}
