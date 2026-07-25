import { Component, input, output } from '@angular/core';
import { HistoryEntry } from '../../services/password-history.service';

@Component({
  selector: 'app-history-panel',
  imports: [],
  templateUrl: './history-panel.html',
  styleUrl: './history-panel.css',
})
export class HistoryPanel {
  readonly entries = input.required<readonly HistoryEntry[]>();
  readonly open = input(false);

  readonly closePanel = output<void>();
  readonly copyEntry = output<string>();
  readonly clearHistory = output<void>();

  formatTime(date: Date): string {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }
}
