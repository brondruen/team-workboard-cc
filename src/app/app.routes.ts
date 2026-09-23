import { Routes } from '@angular/router';
import { authGuard, loginGuard } from './core/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then(m => m.Login),
    canActivate: [loginGuard],
  },
  {
    path: '',
    loadComponent: () => import('./layout/main-layout/main-layout').then(m => m.MainLayout),
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.Dashboard),
      },
      {
        path: 'workspaces',
        loadComponent: () => import('./pages/workspaces/workspaces').then(m => m.Workspaces),
      },
      {
        path: 'projects',
        loadComponent: () => import('./pages/projects/projects').then(m => m.Projects),
      },
      {
        path: 'teams',
        loadComponent: () => import('./pages/teams/teams').then(m => m.Teams),
      },
      {
        path: 'members',
        loadComponent: () => import('./pages/members/members').then(m => m.Members),
      },
      {
        path: 'roles-permissions',
        loadComponent: () => import('./pages/roles-permissions/roles-permissions').then(m => m.RolesPermissions),
      },
      {
        path: 'users',
        loadComponent: () => import('./pages/users/users').then(m => m.Users),
      },
      {
        path: 'settings',
        loadComponent: () => import('./pages/settings/settings').then(m => m.Settings),
      },
      {
        path: 'integrations',
        loadComponent: () => import('./pages/integrations/integrations').then(m => m.Integrations),
      },
      {
        path: 'audit-logs',
        loadComponent: () => import('./pages/audit-logs/audit-logs').then(m => m.AuditLogs),
      },
      {
        path: 'reports',
        loadComponent: () => import('./pages/reports/reports').then(m => m.Reports),
      },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
