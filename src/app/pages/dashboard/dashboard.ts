import { Component } from '@angular/core';
import { StatsCards } from './stats-cards/stats-cards';
import { ProjectsOverview } from './projects-overview/projects-overview';
import { TasksOverview } from './tasks-overview/tasks-overview';
import { RecentProjects } from './recent-projects/recent-projects';
import { RecentActivity } from './recent-activity/recent-activity';
import { UpcomingDeadlines } from './upcoming-deadlines/upcoming-deadlines';

@Component({
  selector: 'app-dashboard',
  imports: [
    StatsCards,
    ProjectsOverview,
    TasksOverview,
    RecentProjects,
    RecentActivity,
    UpcomingDeadlines,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {}
