import { Component } from '@angular/core';

interface Activity {
  user: string;
  initials: string;
  avatarBg: string;
  action: string;
  target: string;
  targetLink: boolean;
  time: string;
  icon?: string;
}

@Component({
  selector: 'app-recent-activity',
  imports: [],
  templateUrl: './recent-activity.html',
  styleUrl: './recent-activity.scss',
})
export class RecentActivity {
  activities: Activity[] = [
    {
      user: 'Sarah Johnson',
      initials: 'SJ',
      avatarBg: '#e0e7ff',
      action: 'created project',
      target: 'Website Redesign',
      targetLink: true,
      time: '2m ago',
    },
    {
      user: 'Mike Chen',
      initials: 'MC',
      avatarBg: '#dcfce7',
      action: 'moved task to',
      target: 'In Progress',
      targetLink: true,
      time: '15m ago',
    },
    {
      user: 'Emily Davis',
      initials: 'ED',
      avatarBg: '#fef3c7',
      action: 'commented on',
      target: 'API Integration',
      targetLink: true,
      time: '1h ago',
    },
    {
      user: 'System',
      initials: '',
      avatarBg: '#f1f5f9',
      action: 'updated 12 tasks',
      target: '',
      targetLink: false,
      time: '2h ago',
      icon: 'check_box',
    },
    {
      user: 'Alex Brown',
      initials: 'AB',
      avatarBg: '#fee2e2',
      action: 'completed task',
      target: 'Design System Setup',
      targetLink: true,
      time: '3h ago',
    },
  ];
}
