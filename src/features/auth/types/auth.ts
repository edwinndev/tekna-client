export type Role = "ADMIN" | "SELLER" | "USER";

export interface UserOutput {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginInput {
  username: string;
  password: string;
}

export interface RefreshTokenInput {
  refreshToken: string;
}

export interface AuthOutput {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: UserOutput;
}

export interface LoginFormValues {
  username: string;
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
