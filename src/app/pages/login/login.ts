import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  email = '';
  password = '';
  error = signal('');
  isLoading = signal(false);
  showPassword = signal(false);

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  onSubmit(): void {
    this.error.set('');

    if (!this.email || !this.password) {
      this.error.set('Please enter both email and password');
      return;
    }

    this.isLoading.set(true);

    // Simulate network delay
    setTimeout(() => {
      const result = this.auth.login(this.email, this.password);
      this.isLoading.set(false);

      if (result.success) {
        this.router.navigate(['/dashboard']);
      } else {
        this.error.set(result.error!);
      }
    }, 600);
  }
}
