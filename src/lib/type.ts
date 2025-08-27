export type User = {
  id: string;
  name: string;
  email: string;
};

export interface AuthCredentials {
  user: User;
  accessToken: string;
  refreshToken?: string;
  accessTokenExp?: number;
}

export interface AuthState {
  // State
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  accessTokenExp: number | null;
  _refreshing: Promise<boolean> | null;

  // Actions
  setAuth: (credentials: AuthCredentials) => void;
  clear: () => void;
  refresh: () => Promise<boolean>;
  isTokenValid?: () => boolean;
}
