import { Injectable } from '@angular/core';
import {
  PasswordOptions,
  RANDOM_LENGTH_MAX,
  RANDOM_LENGTH_MIN,
} from '../models/password-options.model';

const CAPITALS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const DIGITS = '0123456789';
const SPECIAL = '!@#$%&*-_=+;.<>?';

/**
 * The generator always forces the first two characters to be capitals,
 * independent of the `includeCapitals` toggle, so a Vylant password is
 * always recognizable at a glance - the toggle only affects the pool used
 * for the remaining, randomly-assigned-per-position characters.
 */
@Injectable({ providedIn: 'root' })
export class PasswordGeneratorService {
  generate(options: PasswordOptions): string {
    const pools = this.buildPools(options);
    const length = options.randomLength
      ? this.secureRandomInt(RANDOM_LENGTH_MAX - RANDOM_LENGTH_MIN + 1) + RANDOM_LENGTH_MIN
      : options.length;

    const chars: string[] = [
      this.randomChar(CAPITALS),
      this.randomChar(CAPITALS),
    ];

    for (let i = chars.length; i < length; i++) {
      const pool = pools[this.secureRandomInt(pools.length)];
      chars.push(this.randomChar(pool));
    }

    return chars.join('');
  }

  hasEnabledCategory(options: PasswordOptions): boolean {
    return (
      options.includeCapitals ||
      options.includeLowercase ||
      options.includeDigits ||
      options.includeSpecial
    );
  }

  private buildPools(options: PasswordOptions): string[] {
    const pools: string[] = [];
    if (options.includeCapitals) pools.push(CAPITALS);
    if (options.includeLowercase) pools.push(LOWERCASE);
    if (options.includeDigits) pools.push(DIGITS);
    if (options.includeSpecial) pools.push(SPECIAL);
    return pools.length > 0 ? pools : [CAPITALS];
  }

  private randomChar(pool: string): string {
    return pool.charAt(this.secureRandomInt(pool.length));
  }

  /** Uniform random integer in [0, max) using a CSPRNG, with rejection sampling to avoid modulo bias. */
  private secureRandomInt(max: number): number {
    const range = 0x100000000; // 2^32
    const limit = range - (range % max);
    const buffer = new Uint32Array(1);
    let value: number;
    do {
      crypto.getRandomValues(buffer);
      value = buffer[0];
    } while (value >= limit);
    return value % max;
  }
}
