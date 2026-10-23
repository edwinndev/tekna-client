export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
}

export type KeyboardFlashState = "idle" | "error" | "success" | "wave";

export interface KeyDefinition {
  id: string;
  char: string;
  displayLabel: string;
  row: number;
  col: number;
  index: number;
  colorMixPercentage: number;
  isSpace: boolean;
}

export interface KeyboardLayoutRow {
  keys: string[];
  offsetFactor: number;
}
