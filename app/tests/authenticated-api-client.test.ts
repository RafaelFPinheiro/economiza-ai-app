import assert from 'node:assert/strict';
import test from 'node:test';

import { requestAuthenticated } from '../src/services/auth/authClient';
import type { AuthSession } from '../src/services/contracts/authContract';

function makeToken(expOffsetSeconds = 3600): string {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    sub: 'user-123',
    email: 'user@example.com',
    exp: now + expOffsetSeconds,
    iat: now
  };

  const headerB64 = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url');
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');

  return `${headerB64}.${payloadB64}.signature`;
}

test('requestAuthenticated sends the bearer token from a valid session to the transport', async () => {
  const session: AuthSession = {
    user: {
      id: 'user-123',
      email: 'user@example.com',
      displayName: 'Example User'
    },
    accessToken: makeToken(),
    expiresAt: new Date(Date.now() + 60_000).toISOString(),
    tokenType: 'Bearer'
  };

  const observed: Array<{ input: string; init?: RequestInit }> = [];

  const response = await requestAuthenticated('/api/protected', { method: 'GET' }, {
    readSession: async () => session,
    clearSession: async () => undefined,
    transport: async (input, init) => {
      observed.push({ input: String(input), init });
      return {
        ok: true,
        status: 200,
        headers: new Headers(),
        json: async () => ({ ok: true })
      } as Response;
    }
  });

  assert.deepEqual(response, { ok: true });
  assert.equal(observed.length, 1);
  assert.equal(observed[0].init?.headers instanceof Headers ? observed[0].init.headers.get('Authorization') : undefined, `Bearer ${session.accessToken}`);
});

test('requestAuthenticated skips the transport when a stored session is missing or invalid', async () => {
  let hit = false;

  await assert.rejects(
    () =>
      requestAuthenticated('/api/protected', { method: 'GET' }, {
        readSession: async () => null,
        clearSession: async () => undefined,
        transport: async () => {
          hit = true;
          return new Response(JSON.stringify({ ok: true }), { status: 200 });
        }
      }),
    /session|unauthenticated/i
  );

  assert.equal(hit, false);
});

test('requestAuthenticated clears the session and stops on HTTP 401', async () => {
  const session: AuthSession = {
    user: {
      id: 'user-456',
      email: 'other@example.com'
    },
    accessToken: makeToken(),
    expiresAt: new Date(Date.now() + 60_000).toISOString(),
    tokenType: 'Bearer'
  };

  let cleared = false;

  await assert.rejects(
    () =>
      requestAuthenticated('/api/protected', { method: 'GET' }, {
        readSession: async () => session,
        clearSession: async () => {
          cleared = true;
        },
        transport: async () => new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401 })
      }),
    /401|unauthorized|expired|invalid/i
  );

  assert.equal(cleared, true);
});
