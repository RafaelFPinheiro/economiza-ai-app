import type {
  AuthApiResponse,
  AuthErrorResponse,
  AuthSuccessResponse,
  AuthUser,
  LoginRequest,
  SignupRequest
} from '../contracts/authContract';

function base64UrlEncode(value: string): string {
  return btoa(value)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function createMockJwt(user: AuthUser): string {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    sub: user.id,
    email: user.email,
    exp: now + 60 * 60,
    iat: now
  };

  const header = { alg: 'none', typ: 'JWT' };
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  return `${encodedHeader}.${encodedPayload}.mock-signature`;
}

export async function loginWithMockCredentials(input: LoginRequest): Promise<AuthApiResponse> {
  const email = input.email.trim().toLowerCase();
  const password = input.password.trim();

  if (!email || !password) {
    const error: AuthErrorResponse = {
      status: 'error',
      message: 'Informe um e-mail e uma senha válidos.'
    };
    return error;
  }

  if (!email.includes('@') || password.length < 6) {
    const error: AuthErrorResponse = {
      status: 'error',
      message: 'Credenciais inválidas. Verifique o e-mail e a senha.'
    };
    return error;
  }

  const user: AuthUser = {
    id: `user-${email.replace(/[^a-z0-9]/gi, '').slice(0, 12) || 'anon'}`,
    email,
    displayName: email.split('@')[0]
  };

  const success: AuthSuccessResponse = {
    status: 'ok',
    token: createMockJwt(user),
    expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    tokenType: 'Bearer',
    user
  };

  return success;
}

export async function signupWithMockCredentials(input: SignupRequest): Promise<AuthApiResponse> {
  const email = input.email.trim().toLowerCase();
  const password = input.password.trim();

  if (!email || !password) {
    return {
      status: 'error',
      message: 'Preencha e-mail e senha para criar sua conta.'
    };
  }

  if (!email.includes('@') || password.length < 6) {
    return {
      status: 'error',
      message: 'Dados inválidos. Use um e-mail válido e uma senha com pelo menos 6 caracteres.'
    };
  }

  const user: AuthUser = {
    id: `new-${Date.now()}`,
    email,
    displayName: input.displayName?.trim() || email.split('@')[0]
  };

  return {
    status: 'ok',
    token: createMockJwt(user),
    expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    tokenType: 'Bearer',
    user
  };
}
