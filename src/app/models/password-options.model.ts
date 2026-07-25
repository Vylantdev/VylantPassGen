export interface PasswordOptions {
  includeCapitals: boolean;
  includeLowercase: boolean;
  includeDigits: boolean;
  includeSpecial: boolean;
  length: number;
  randomLength: boolean;
}

export const DEFAULT_PASSWORD_OPTIONS: PasswordOptions = {
  includeCapitals: true,
  includeLowercase: true,
  includeDigits: true,
  includeSpecial: true,
  length: 20,
  randomLength: true,
};

export const MIN_LENGTH = 8;
export const MAX_LENGTH = 64;
export const RANDOM_LENGTH_MIN = 18;
export const RANDOM_LENGTH_MAX = 26;
