import type { AuthSession } from '../../services/contracts/authContract';

const SESSION_KEY = 'economizai.auth.session.v1';

type SecureStoreLike = {
  getItemAsync: (key: string) => Promise<string | null>;
  setItemAsync: (key: string, value: string) => Promise<void>;
  deleteItemAsync: (key: string) => Promise<void>;
};

function getSecureStore(): SecureStoreLike | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const secureStore = require('expo-secure-store') as SecureStoreLike;
    return secureStore;
  } catch {
    return null;
  }
}

export async function readSession(): Promise<AuthSession | null> {
  const secureStore = getSecureStore();

  if (!secureStore) {
    return null;
  }

  const stored = await secureStore.getItemAsync(SESSION_KEY);

  if (!stored) {
    return null;
  }

  try {
    const parsed = JSON.parse(stored) as Partial<AuthSession>;

    if (!parsed?.user || !parsed?.accessToken || !parsed?.expiresAt || !parsed?.tokenType) {
      await clearSession();
      return null;
    }

    return parsed as AuthSession;
  } catch {
    await clearSession();
    return null;
  }
}

export async function saveSession(session: AuthSession): Promise<void> {
  const secureStore = getSecureStore();

  if (!secureStore) {
    return;
  }

  await secureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));
}

export async function clearSession(): Promise<void> {
  const secureStore = getSecureStore();

  if (!secureStore) {
    return;
  }

  await secureStore.deleteItemAsync(SESSION_KEY);
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  const segments = token.split('.');

  if (segments.length < 2) {
    return null;
  }

  const base64Url = segments[1];
  const normalized = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');

  try {
    const json = atob(padded);
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const payload = decodeJwtPayload(token);

  if (!payload || typeof payload.exp !== 'number') {
    return true;
  }

  return payload.exp * 1000 <= Date.now();
}

export async function restoreAuthSession(): Promise<{ status: 'authenticated'; session: AuthSession } | { status: 'unauthenticated' }> {
  const currentSession = await readSession();

  if (!currentSession) {
    return { status: 'unauthenticated' };
  }

  const tokenExpired = isTokenExpired(currentSession.accessToken);

  if (tokenExpired) {
    await clearSession();
    return { status: 'unauthenticated' };
  }

  return { status: 'authenticated', session: currentSession };
}
