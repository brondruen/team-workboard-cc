import { Component, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

interface NavItem {
  icon: string;
  label: string;
  route: string;
  group: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  isCollapsed = input(false);
  isCollapsedChange = output<boolean>();

  navItems: NavItem[] = [
    { icon: 'dashboard', label: 'Dashboard', route: '/dashboard', group: 'WORKSPACE' },
    { icon: 'folder', label: 'Workspaces', route: '/workspaces', group: 'WORKSPACE' },
    { icon: 'assignment', label: 'Projects', route: '/projects', group: 'WORKSPACE' },
    { icon: 'groups', label: 'Teams', route: '/teams', group: 'WORKSPACE' },
    { icon: 'people', label: 'Members', route: '/members', group: 'WORKSPACE' },
    { icon: 'admin_panel_settings', label: 'Roles & Permissions', route: '/roles-permissions', group: 'WORKSPACE' },

    { icon: 'person', label: 'Users', route: '/users', group: 'SYSTEM' },
    { icon: 'settings', label: 'Settings', route: '/settings', group: 'SYSTEM' },
    { icon: 'extension', label: 'Integrations', route: '/integrations', group: 'SYSTEM' },
    { icon: 'description', label: 'Audit Logs', route: '/audit-logs', group: 'SYSTEM' },
    { icon: 'assessment', label: 'Reports', route: '/reports', group: 'SYSTEM' },
  ];

  get groups(): string[] {
    return [...new Set(this.navItems.map(item => item.group))];
  }

  getItemsByGroup(group: string): NavItem[] {
    return this.navItems.filter(item => item.group === group);
  }

  toggleCollapse(): void {
    this.isCollapsedChange.emit(!this.isCollapsed());
  }
}
