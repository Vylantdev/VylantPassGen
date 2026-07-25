import { Component, computed, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MAX_LENGTH,
  MIN_LENGTH,
  PasswordOptions,
  RANDOM_LENGTH_MAX,
  RANDOM_LENGTH_MIN,
} from '../../models/password-options.model';

type CharsetKey = 'includeCapitals' | 'includeLowercase' | 'includeDigits' | 'includeSpecial';

@Component({
  selector: 'app-options-panel',
  imports: [FormsModule],
  templateUrl: './options-panel.html',
  styleUrl: './options-panel.css',
})
export class OptionsPanel {
  readonly options = model.required<PasswordOptions>();

  readonly minLength = MIN_LENGTH;
  readonly maxLength = MAX_LENGTH;
  readonly randomLengthMin = RANDOM_LENGTH_MIN;
  readonly randomLengthMax = RANDOM_LENGTH_MAX;

  readonly hasEnabledCategory = computed(() => {
    const o = this.options();
    return o.includeCapitals || o.includeLowercase || o.includeDigits || o.includeSpecial;
  });

  toggle(key: CharsetKey): void {
    this.options.update((o) => ({ ...o, [key]: !o[key] }));
  }

  setLength(value: string): void {
    const parsed = Number(value);
    if (Number.isNaN(parsed)) return;
    const clamped = Math.min(this.maxLength, Math.max(this.minLength, Math.round(parsed)));
    this.options.update((o) => ({ ...o, length: clamped }));
  }

  setRandomLength(enabled: boolean): void {
    this.options.update((o) => ({ ...o, randomLength: enabled }));
  }
}
