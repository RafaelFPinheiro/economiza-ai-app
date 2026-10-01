import type {
  AuthApiResponse,
  LoginRequest,
  SignupRequest
} from '../contracts/authContract';
import { clearSession, isTokenExpired, readSession } from '../../shared/auth/sessionStore';
import { loginWithMockCredentials, signupWithMockCredentials } from './mockAuthService';

export interface AuthClientOptions {
  transport?: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
  readSession?: typeof readSession;
  clearSession?: typeof clearSession;
}

export async function login(request: LoginRequest): Promise<AuthApiResponse> {
  return loginWithMockCredentials(request);
}

export async function signup(request: SignupRequest): Promise<AuthApiResponse> {
  return signupWithMockCredentials(request);
}

export function buildAuthorizationHeader(token?: string): Record<string, string> {
  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`
  };
}

export async function requestAuthenticated<T = unknown>(
  input: RequestInfo | URL,
  init: RequestInit = {},
  options: AuthClientOptions = {}
): Promise<T> {
  const transport = options.transport ?? (globalThis.fetch ? globalThis.fetch.bind(globalThis) : undefined);
  const sessionReader = options.readSession ?? readSession;
  const sessionClearer = options.clearSession ?? clearSession;

  if (!transport) {
    throw new Error('No HTTP transport is available for authenticated requests.');
  }

  const session = await sessionReader();

  if (!session || !session.accessToken || isTokenExpired(session.accessToken)) {
    await sessionClearer();
    throw new Error('No valid session available for authenticated request.');
  }

  const headers = new Headers(init.headers ?? {});
  headers.set('Authorization', `Bearer ${session.accessToken}`);

  const response = await transport(input, {
    ...init,
    headers
  });

  if (response.status === 401) {
    await sessionClearer();
    throw new Error('Session expired or invalid.');
  }

  return response.json() as Promise<T>;
}
