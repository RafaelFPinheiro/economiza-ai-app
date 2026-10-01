export type AuthStatus = 'checking' | 'authenticated' | 'unauthenticated';

export interface AuthUser {
  id: string;
  email: string;
  displayName?: string;
}

export interface AuthSession {
  user: AuthUser;
  accessToken: string;
  expiresAt: string;
  tokenType: 'Bearer';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  displayName?: string;
}

export interface AuthSuccessResponse {
  status: 'ok';
  token: string;
  expiresAt: string;
  tokenType: 'Bearer';
  user: AuthUser;
}

export interface AuthErrorResponse {
  status: 'error';
  message: string;
}

export type AuthApiResponse = AuthSuccessResponse | AuthErrorResponse;
