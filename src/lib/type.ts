export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export interface AuthCredentials {
  user: User;
  accessToken: string;
  accessTokenExp?: number;
}

export interface AuthState {
  // State
  user: User | null;
  accessToken: string | null;
  accessTokenExp: number | null;

  // Actions
  setAuth: (credentials: AuthCredentials) => void;
  clear: () => void;
  isTokenValid: () => boolean;
}
