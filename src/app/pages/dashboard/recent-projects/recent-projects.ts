import { Component } from '@angular/core';

interface Project {
  name: string;
  icon: string;
  iconBg: string;
  workspace: string;
  status: string;
  statusClass: string;
  progress: number;
  dueDate: string;
  memberCount: number;
}

@Component({
  selector: 'app-recent-projects',
  imports: [],
  templateUrl: './recent-projects.html',
  styleUrl: './recent-projects.scss',
})
export class RecentProjects {
  projects: Project[] = [
    {
      name: 'Website Redesign',
      icon: 'language',
      iconBg: '#dbeafe',
      workspace: 'Marketing Team',
      status: 'In Progress',
      statusClass: 'badge-in-progress',
      progress: 65,
      dueDate: 'May 20, 2024',
      memberCount: 4,
    },
    {
      name: 'Mobile App Development',
      icon: 'phone_iphone',
      iconBg: '#fee2e2',
      workspace: 'Product Team',
      status: 'Active',
      statusClass: 'badge-active',
      progress: 80,
      dueDate: 'May 15, 2024',
      memberCount: 5,
    },
    {
      name: 'Customer Portal',
      icon: 'web',
      iconBg: '#dbeafe',
      workspace: 'Engineering Team',
      status: 'Planning',
      statusClass: 'badge-planning',
      progress: 25,
      dueDate: 'Jun 10, 2024',
      memberCount: 3,
    },
    {
      name: 'API Integration',
      icon: 'api',
      iconBg: '#dcfce7',
      workspace: 'Engineering Team',
      status: 'In Progress',
      statusClass: 'badge-in-progress',
      progress: 45,
      dueDate: 'May 25, 2024',
      memberCount: 4,
    },
    {
      name: 'Brand Guidelines',
      icon: 'palette',
      iconBg: '#fee2e2',
      workspace: 'Marketing Team',
      status: 'On Hold',
      statusClass: 'badge-on-hold',
      progress: 15,
      dueDate: 'Jun 5, 2024',
      memberCount: 3,
    },
  ];
}
