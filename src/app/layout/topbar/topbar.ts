import { Component, output, signal, HostListener } from '@angular/core';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-topbar',
  imports: [],
  templateUrl: './topbar.html',
  styleUrl: './topbar.scss',
})
export class Topbar {
  onToggleSidebar = output();

  notificationCount = 8;
  showUserMenu = signal(false);

  constructor(private auth: AuthService) {}

  get user() {
    return this.auth.user();
  }

  toggleSidebar(): void {
    this.onToggleSidebar.emit();
  }

  toggleUserMenu(): void {
    this.showUserMenu.update(v => !v);
  }

  logout(): void {
    this.showUserMenu.set(false);
    this.auth.logout();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.topbar__user-wrapper')) {
      this.showUserMenu.set(false);
    }
  }
}
