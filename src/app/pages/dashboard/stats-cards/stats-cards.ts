import { Component } from '@angular/core';

interface StatCard {
  icon: string;
  iconBg: string;
  label: string;
  value: number;
  change: number;
  trend: 'up' | 'down';
}

@Component({
  selector: 'app-stats-cards',
  imports: [],
  templateUrl: './stats-cards.html',
  styleUrl: './stats-cards.scss',
})
export class StatsCards {
  cards: StatCard[] = [
    { icon: 'folder_copy', iconBg: '#dbeafe', label: 'Projects', value: 24, change: 12, trend: 'up' },
    { icon: 'task_alt', iconBg: '#dcfce7', label: 'Tasks', value: 342, change: 8, trend: 'up' },
    { icon: 'groups', iconBg: '#fef3c7', label: 'Members', value: 58, change: 5, trend: 'up' },
    { icon: 'flag', iconBg: '#fee2e2', label: 'Overdue Tasks', value: 18, change: 10, trend: 'down' },
  ];
}
