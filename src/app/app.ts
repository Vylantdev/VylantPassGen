import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { OptionsPanel } from './components/options-panel/options-panel';
import { HistoryPanel } from './components/history-panel/history-panel';
import { PasswordGeneratorService } from './services/password-generator.service';
import { PasswordHistoryService } from './services/password-history.service';
import { DEFAULT_PASSWORD_OPTIONS } from './models/password-options.model';
import { copyToClipboard } from './utils/clipboard';
import { openUrl } from '@tauri-apps/plugin-opener';
import { register, unregister } from '@tauri-apps/plugin-global-shortcut';
import { check } from '@tauri-apps/plugin-updater';
import { relaunch } from '@tauri-apps/plugin-process';

const GLOBAL_SHORTCUT = 'CommandOrControl+Alt+P';

@Component({
  selector: 'app-root',
  imports: [OptionsPanel, HistoryPanel],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit, OnDestroy {
  private readonly passwordGenerator = inject(PasswordGeneratorService);
  private readonly historyService = inject(PasswordHistoryService);

  protected readonly githubUrl = 'https://github.com/vylantdev';
  protected readonly websiteUrl = 'https://vylant.dev';

  protected readonly options = signal(DEFAULT_PASSWORD_OPTIONS);
  protected readonly currentPassword = signal('');
  protected readonly historyOpen = signal(false);
  protected readonly toastVisible = signal(false);

  protected readonly canGenerate = computed(() =>
    this.passwordGenerator.hasEnabledCategory(this.options()),
  );

  protected readonly history = this.historyService.history;

  private toastTimeout?: ReturnType<typeof setTimeout>;

  async ngOnInit(): Promise<void> {
    await register(GLOBAL_SHORTCUT, (event) => {
      if (event.state !== 'Pressed') return;
      this.generate();
      void this.copyCurrent();
    });

    try {
      const update = await check();
      if (update) {
        await update.downloadAndInstall();
        await relaunch();
      }
    } catch {
      // No release channel published yet, or offline - updates are optional, fail silently.
    }
  }

  async ngOnDestroy(): Promise<void> {
    await unregister(GLOBAL_SHORTCUT);
  }

  generate(): void {
    if (!this.canGenerate()) return;
    const password = this.passwordGenerator.generate(this.options());
    this.currentPassword.set(password);
    this.historyService.add(password);
  }

  async copyCurrent(): Promise<void> {
    if (!this.currentPassword()) return;
    await this.copyAndNotify(this.currentPassword());
  }

  async copyFromHistory(password: string): Promise<void> {
    await this.copyAndNotify(password);
  }

  clearHistory(): void {
    this.historyService.clear();
  }

  async openGithub(): Promise<void> {
    await openUrl(this.githubUrl);
  }

  async openWebsite(): Promise<void> {
    await openUrl(this.websiteUrl);
  }

  private async copyAndNotify(password: string): Promise<void> {
    const success = await copyToClipboard(password);
    if (!success) return;
    this.toastVisible.set(true);
    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => this.toastVisible.set(false), 1600);
  }
}
