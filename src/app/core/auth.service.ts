import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';

export interface User {
  email: string;
  name: string;
  role: string;
  initials: string;
}

const MOCK_USER: User = {
  email: 'admin@workboard.io',
  name: 'John Doe',
  role: 'Admin',
  initials: 'JD',
};

const MOCK_PASSWORD = 'admin123';

const STORAGE_KEY = 'workboard_auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly currentUser = signal<User | null>(this.loadFromStorage());

  readonly user = this.currentUser.asReadonly();
  readonly isAuthenticated = computed(() => this.currentUser() !== null);

  constructor(private router: Router) {}

  login(email: string, password: string): { success: boolean; error?: string } {
    if (email === MOCK_USER.email && password === MOCK_PASSWORD) {
      this.currentUser.set(MOCK_USER);
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_USER));
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password' };
  }

  logout(): void {
    this.currentUser.set(null);
    sessionStorage.removeItem(STORAGE_KEY);
    this.router.navigate(['/login']);
  }

  private loadFromStorage(): User | null {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored) as User;
    } catch {
      return null;
    }
  }
}
