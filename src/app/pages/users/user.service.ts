import { Injectable } from '@angular/core';
import { Observable, of, delay, map } from 'rxjs';

// ─── Models ──────────────────────────────────────────────────────────────────

export interface MockUser {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'Editor' | 'Viewer' | 'Manager' | 'Developer';
  department: string;
  status: 'Active' | 'Inactive' | 'Pending';
  avatar: string;
  joinedDate: string;
}

// ─── 50 Mock Users ───────────────────────────────────────────────────────────

const DEPARTMENTS = ['Engineering', 'Design', 'Marketing', 'Sales', 'Product', 'HR', 'Finance', 'Operations'];
const ROLES: MockUser['role'][] = ['Admin', 'Editor', 'Viewer', 'Manager', 'Developer'];
const STATUSES: MockUser['status'][] = ['Active', 'Inactive', 'Pending'];

const FIRST_NAMES = [
  'Alice', 'Bob', 'Carlos', 'Diana', 'Ethan', 'Fiona', 'George', 'Hannah',
  'Ivan', 'Julia', 'Kevin', 'Luna', 'Mason', 'Nina', 'Oscar', 'Priya',
  'Quinn', 'Rachel', 'Sam', 'Tara', 'Umar', 'Vera', 'Will', 'Xena',
  'Yuki', 'Zara', 'Andre', 'Bella', 'Caleb', 'Dani', 'Eli', 'Freya',
  'Grant', 'Hana', 'Iris', 'Jake', 'Kira', 'Leo', 'Maya', 'Nate',
  'Olive', 'Paul', 'Rosa', 'Sean', 'Tina', 'Uma', 'Vince', 'Wendy',
  'Xavier', 'Yara',
];

const LAST_NAMES = [
  'Anderson', 'Brown', 'Chen', 'Davis', 'Evans', 'Foster', 'Garcia', 'Hill',
  'Ivanov', 'Johnson', 'Kim', 'Lopez', 'Martin', 'Nakamura', 'Ortiz', 'Patel',
  'Quinn', 'Reyes', 'Smith', 'Torres', 'Ueda', 'Vargas', 'Williams', 'Xu',
  'Yang', 'Zhang', 'Adams', 'Baker', 'Clark', 'Diaz', 'Ellis', 'Fernandez',
  'Gonzalez', 'Hawkins', 'Ibrahim', 'Jones', 'Knight', 'Lee', 'Moore', 'Nguyen',
  'Owens', 'Park', 'Rivera', 'Scott', 'Taylor', 'Underwood', 'Valdez', 'White',
  'Xiong', 'Young',
];

function generateMockUsers(): MockUser[] {
  return FIRST_NAMES.map((first, i) => {
    const last = LAST_NAMES[i];
    const initials = first[0] + last[0];
    return {
      id: i + 1,
      name: `${first} ${last}`,
      email: `${first.toLowerCase()}.${last.toLowerCase()}@workboard.io`,
      role: ROLES[i % ROLES.length],
      department: DEPARTMENTS[i % DEPARTMENTS.length],
      status: i < 40 ? 'Active' : i < 46 ? 'Inactive' : 'Pending',
      avatar: initials,
      joinedDate: new Date(2024, i % 12, (i % 28) + 1).toISOString().split('T')[0],
    };
  });
}

const MOCK_USERS: MockUser[] = generateMockUsers();

// ─── Service ─────────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class UserService {
  /**
   * Simulates a network request to fetch all users.
   * Used by exhaustMap demo — returns after a 1.5s delay.
   */
  fetchAllUsers(): Observable<MockUser[]> {
    return of(MOCK_USERS).pipe(delay(1500));
  }

  /**
   * Simulates a search API call — used by switchMap demo.
   * Filters users by name/email and returns after a 600ms delay
   * to simulate network latency.
   */
  searchUsers(query: string): Observable<MockUser[]> {
    const term = query.toLowerCase().trim();
    const results = term
      ? MOCK_USERS.filter(
          (u) =>
            u.name.toLowerCase().includes(term) ||
            u.email.toLowerCase().includes(term) ||
            u.department.toLowerCase().includes(term) ||
            u.role.toLowerCase().includes(term),
        )
      : MOCK_USERS;
    return of(results).pipe(delay(600));
  }

  /**
   * Simulates fetching a single user's full profile — used by mergeMap demo.
   * Each call has a random delay (200–800ms) to show parallel execution.
   */
  fetchUserDetail(userId: number): Observable<MockUser & { bio: string }> {
    const user = MOCK_USERS.find((u) => u.id === userId)!;
    const delayMs = 200 + Math.floor(Math.random() * 600);
    return of({
      ...user,
      bio: `${user.name} is a ${user.role} in the ${user.department} department.`,
    }).pipe(delay(delayMs));
  }

  /**
   * Simulates saving/updating a user — used by concatMap demo.
   * Each save takes 800ms to simulate sequential write operations.
   */
  updateUserStatus(userId: number, status: MockUser['status']): Observable<{ userId: number; status: string; savedAt: string }> {
    return of(null).pipe(
      delay(800),
      map(() => ({
        userId,
        status,
        savedAt: new Date().toLocaleTimeString(),
      })),
    );
  }
}
