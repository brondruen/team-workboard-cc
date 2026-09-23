import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  Subject,
  BehaviorSubject,
  Subscription,
  switchMap,
  mergeMap,
  concatMap,
  exhaustMap,
  debounceTime,
  distinctUntilChanged,
  from,
  tap,
  finalize,
} from 'rxjs';
import { UserService, MockUser } from './user.service';

/** Represents a log entry for the operator activity feed */
interface OperatorLog {
  time: string;
  message: string;
  type: 'info' | 'success' | 'cancel' | 'warn';
}

@Component({
  selector: 'app-users',
  imports: [CommonModule, FormsModule],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class Users implements OnInit, OnDestroy {
  // ─── State ───────────────────────────────────────────────────────────────

  users: MockUser[] = [];
  filteredUsers: MockUser[] = [];
  isLoading = true;

  /** Currently active tab in the operator showcase */
  activeTab: 'switchMap' | 'mergeMap' | 'concatMap' | 'exhaustMap' = 'switchMap';

  // ─── switchMap: Search ───────────────────────────────────────────────────
  //
  // switchMap cancels the previous inner Observable when a new value arrives.
  // Perfect for typeahead search — if the user types a new character before
  // the previous search API call returns, the old request is cancelled and
  // only the latest search runs. This prevents stale results from overwriting
  // newer ones.

  searchTerm = '';
  private searchSubject$ = new Subject<string>();
  switchMapLogs: OperatorLog[] = [];
  switchMapSearching = false;
  private switchMapRequestCount = 0;

  // ─── mergeMap: Parallel Detail Loading ───────────────────────────────────
  //
  // mergeMap subscribes to all inner Observables concurrently — it does NOT
  // wait for one to complete before starting the next. Ideal for firing off
  // multiple independent requests in parallel (e.g., loading details for
  // several users at once). The results arrive in whatever order they finish,
  // not necessarily the order they were requested.

  mergeMapLogs: OperatorLog[] = [];
  mergeMapLoading = false;
  loadedDetails: Array<MockUser & { bio: string }> = [];

  // ─── concatMap: Sequential Saves ─────────────────────────────────────────
  //
  // concatMap queues each inner Observable and waits for it to complete before
  // subscribing to the next one. This guarantees ordering — each operation
  // finishes before the next begins. Perfect for sequential writes where order
  // matters (e.g., saving user status changes one-by-one so the server
  // processes them in the correct sequence).

  concatMapLogs: OperatorLog[] = [];
  concatMapSaving = false;
  concatMapQueue: number[] = [];
  concatMapProgress = 0;
  concatMapTotal = 0;

  // ─── exhaustMap: Refresh (Ignore While Busy) ─────────────────────────────
  //
  // exhaustMap ignores new emissions from the source while the current inner
  // Observable is still running. If a user clicks "Refresh" while a refresh
  // is already in flight, the duplicate click is silently dropped. This
  // prevents redundant API calls and is the go-to operator for preventing
  // double-submit / double-click issues.

  private refreshSubject$ = new Subject<void>();
  exhaustMapLogs: OperatorLog[] = [];
  exhaustMapRefreshing = false;
  exhaustMapClickCount = 0;
  exhaustMapProcessedCount = 0;

  // ─── Subscriptions ──────────────────────────────────────────────────────

  private subscriptions = new Subscription();

  @ViewChild('switchMapLogContainer') switchMapLogContainer!: ElementRef;
  @ViewChild('mergeMapLogContainer') mergeMapLogContainer!: ElementRef;
  @ViewChild('concatMapLogContainer') concatMapLogContainer!: ElementRef;
  @ViewChild('exhaustMapLogContainer') exhaustMapLogContainer!: ElementRef;

  constructor(private userService: UserService) {}

  // ─── Lifecycle ──────────────────────────────────────────────────────────

  ngOnInit(): void {
    this.setupSwitchMap();
    this.setupExhaustMap();
    this.loadInitialUsers();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  // ─── Initial Load ──────────────────────────────────────────────────────

  private loadInitialUsers(): void {
    this.subscriptions.add(
      this.userService.fetchAllUsers().subscribe((users) => {
        this.users = users;
        this.filteredUsers = users;
        this.isLoading = false;
      }),
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // switchMap DEMO — Typeahead Search
  // ═══════════════════════════════════════════════════════════════════════════
  //
  // How it works:
  //   source$:  ──a──ab──abc──────────────>
  //                  │    │
  //   switchMap:  (cancels previous, subscribes to new)
  //                  │    └─ searchUsers("abc") ──results──>
  //                  └─ searchUsers("ab") ✗ CANCELLED
  //
  // Each keystroke emits into searchSubject$. debounceTime waits 300ms of
  // silence, then switchMap fires the search. If a new term arrives before the
  // previous search completes, switchMap UNSUBSCRIBES from the old Observable
  // (cancelling the HTTP request) and subscribes to the new one.

  private setupSwitchMap(): void {
    this.subscriptions.add(
      this.searchSubject$
        .pipe(
          debounceTime(300),
          distinctUntilChanged(),
          tap((term) => {
            this.switchMapRequestCount++;
            const reqNum = this.switchMapRequestCount;
            this.switchMapSearching = true;
            this.addLog(this.switchMapLogs, `#${reqNum} Searching for "${term || '(all)'}"...`, 'info');
          }),
          // switchMap: cancels previous search when new term arrives
          switchMap((term) => {
            const reqNum = this.switchMapRequestCount;
            return this.userService.searchUsers(term).pipe(
              tap(() => {
                this.addLog(this.switchMapLogs, `#${reqNum} ✓ Results for "${term || '(all)'}": found matches`, 'success');
              }),
            );
          }),
        )
        .subscribe((results) => {
          this.filteredUsers = results;
          this.switchMapSearching = false;
        }),
    );
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.searchSubject$.next(term);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // mergeMap DEMO — Parallel Detail Loading
  // ═══════════════════════════════════════════════════════════════════════════
  //
  // How it works:
  //   source$:  ──[id:1, id:2, id:3]──────────────────────>
  //                  │     │     │
  //   mergeMap:   fetch(1) fetch(2) fetch(3)   ← all run in PARALLEL
  //                  │        │  │
  //              result(1) result(3) result(2)  ← arrive in completion order
  //
  // mergeMap subscribes to ALL inner Observables simultaneously. Unlike
  // concatMap (which waits) or switchMap (which cancels), mergeMap lets
  // every request fly in parallel. Results arrive in whichever order the
  // server responds — NOT necessarily the order they were requested.

  runMergeMapDemo(): void {
    this.mergeMapLogs = [];
    this.loadedDetails = [];
    this.mergeMapLoading = true;

    // Pick 5 random users to load details for
    const userIds = this.getRandomUserIds(5);
    this.addLog(this.mergeMapLogs, `Firing ${userIds.length} parallel requests...`, 'info');

    this.subscriptions.add(
      from(userIds)
        .pipe(
          // mergeMap: all requests execute concurrently
          mergeMap((id) => {
            this.addLog(this.mergeMapLogs, `→ Request fired for User #${id}`, 'info');
            return this.userService.fetchUserDetail(id).pipe(
              tap((detail) => {
                this.addLog(this.mergeMapLogs, `✓ User #${id} (${detail.name}) loaded — arrived out of order!`, 'success');
                this.loadedDetails = [...this.loadedDetails, detail];
              }),
            );
          }),
          finalize(() => {
            this.mergeMapLoading = false;
            this.addLog(this.mergeMapLogs, `All ${userIds.length} requests complete (parallel execution)`, 'success');
          }),
        )
        .subscribe(),
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // concatMap DEMO — Sequential Status Updates
  // ═══════════════════════════════════════════════════════════════════════════
  //
  // How it works:
  //   source$:  ──id:1──id:2──id:3──────────────────────────>
  //                │
  //   concatMap:   save(1)─────done → save(2)─────done → save(3)─────done
  //                         waits        waits        waits
  //
  // concatMap processes inner Observables ONE AT A TIME, in strict order.
  // It queues emissions and only subscribes to the next inner Observable
  // after the current one completes. This guarantees that user #1 is saved
  // before user #2, which is saved before user #3, etc.

  runConcatMapDemo(): void {
    this.concatMapLogs = [];
    this.concatMapSaving = true;

    const userIds = this.getRandomUserIds(5);
    this.concatMapQueue = [...userIds];
    this.concatMapProgress = 0;
    this.concatMapTotal = userIds.length;

    this.addLog(this.concatMapLogs, `Queuing ${userIds.length} sequential save operations...`, 'info');

    this.subscriptions.add(
      from(userIds)
        .pipe(
          // concatMap: waits for each save to complete before starting next
          concatMap((id, index) => {
            this.addLog(this.concatMapLogs, `⏳ Saving User #${id} (${index + 1}/${userIds.length})...`, 'info');
            return this.userService.updateUserStatus(id, 'Active').pipe(
              tap((result) => {
                this.concatMapProgress = index + 1;
                this.concatMapQueue = this.concatMapQueue.filter((qId) => qId !== id);
                this.addLog(this.concatMapLogs, `✓ User #${result.userId} saved at ${result.savedAt}`, 'success');
              }),
            );
          }),
          finalize(() => {
            this.concatMapSaving = false;
            this.addLog(this.concatMapLogs, `All saves completed in guaranteed order`, 'success');
          }),
        )
        .subscribe(),
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // exhaustMap DEMO — Refresh (Ignore Duplicate Clicks)
  // ═══════════════════════════════════════════════════════════════════════════
  //
  // How it works:
  //   source$:  ──click──click──click───────────click──────>
  //                │       ✗       ✗               │
  //   exhaustMap:  fetch()──────────────done     fetch()──done
  //                        (clicks ignored)
  //
  // exhaustMap IGNORES new source emissions while the current inner Observable
  // is still active. The second and third clicks above are silently dropped
  // because the first fetch hasn't completed yet. Once it finishes, the next
  // click will be processed. This is the perfect operator for preventing
  // double-click / double-submit bugs.

  private setupExhaustMap(): void {
    this.subscriptions.add(
      this.refreshSubject$
        .pipe(
          tap(() => {
            this.exhaustMapClickCount++;
            if (this.exhaustMapRefreshing) {
              this.addLog(this.exhaustMapLogs, `✗ Click #${this.exhaustMapClickCount} IGNORED (refresh in progress)`, 'warn');
            } else {
              this.addLog(this.exhaustMapLogs, `Click #${this.exhaustMapClickCount} accepted → starting refresh...`, 'info');
            }
          }),
          // exhaustMap: ignores clicks while a refresh is already running
          exhaustMap(() => {
            this.exhaustMapRefreshing = true;
            return this.userService.fetchAllUsers().pipe(
              tap((users) => {
                this.exhaustMapProcessedCount++;
                this.users = users;
                this.filteredUsers = users;
                this.addLog(
                  this.exhaustMapLogs,
                  `✓ Refresh #${this.exhaustMapProcessedCount} complete (${users.length} users loaded)`,
                  'success',
                );
              }),
              finalize(() => {
                this.exhaustMapRefreshing = false;
              }),
            );
          }),
        )
        .subscribe(),
    );
  }

  onRefreshClick(): void {
    this.refreshSubject$.next();
  }

  // ─── Helpers ────────────────────────────────────────────────────────────

  private addLog(logs: OperatorLog[], message: string, type: OperatorLog['type']): void {
    logs.push({
      time: new Date().toLocaleTimeString(),
      message,
      type,
    });
  }

  private getRandomUserIds(count: number): number[] {
    const shuffled = [...this.users].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count).map((u) => u.id);
  }

  getStatusClass(status: string): string {
    return `status-${status.toLowerCase()}`;
  }

  getRoleClass(role: string): string {
    return `role-${role.toLowerCase()}`;
  }

  get activeCount(): number {
    return this.users.filter((u) => u.status === 'Active').length;
  }

  get inactiveCount(): number {
    return this.users.filter((u) => u.status === 'Inactive').length;
  }

  get pendingCount(): number {
    return this.users.filter((u) => u.status === 'Pending').length;
  }
}
