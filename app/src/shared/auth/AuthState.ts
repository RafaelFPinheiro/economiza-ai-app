import type { AuthSession, AuthStatus, AuthUser } from '../../services/contracts/authContract';

export type { AuthStatus, AuthUser, AuthSession };

export interface AuthState {
  status: AuthStatus;
  session: AuthSession | null;
  user: AuthUser | null;
}

export const initialAuthState: AuthState = {
  status: 'checking',
  session: null,
  user: null
};
