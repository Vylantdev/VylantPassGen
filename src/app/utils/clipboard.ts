import { writeText } from '@tauri-apps/plugin-clipboard-manager';

/**
 * Uses Tauri's OS-level clipboard plugin rather than navigator.clipboard,
 * since the browser API silently fails when the webview lacks focus - which
 * is exactly the case when copying is triggered via the global shortcut.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await writeText(text);
    return true;
  } catch {
    return false;
  }
}
