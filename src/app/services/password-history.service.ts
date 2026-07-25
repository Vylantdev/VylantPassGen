import { Injectable, signal } from '@angular/core';

export interface HistoryEntry {
  password: string;
  generatedAt: Date;
}

/**
 * Deliberately in-memory only: the history exists purely for the lifetime of
 * the running app and must not survive a restart, so nothing here touches
 * localStorage/sessionStorage or disk.
 */
@Injectable({ providedIn: 'root' })
export class PasswordHistoryService {
  private readonly entries = signal<HistoryEntry[]>([]);
  readonly history = this.entries.asReadonly();

  add(password: string): void {
    this.entries.update((current) => [{ password, generatedAt: new Date() }, ...current]);
  }

  clear(): void {
    this.entries.set([]);
  }
}
