import { useCallback, useState } from 'react';

import { login, signup } from '../../../services/auth/authClient';
import { clearSession, saveSession } from '../../../shared/auth/sessionStore';

export function useAuth() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loginUser = useCallback(async (email: string, password: string) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await login({ email, password });

      if (response.status === 'error') {
        setErrorMessage(response.message);
        return;
      }

      await saveSession({
        user: response.user,
        accessToken: response.token,
        expiresAt: response.expiresAt,
        tokenType: response.tokenType
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Não foi possível concluir o login.';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const signupUser = useCallback(async (email: string, password: string, displayName?: string) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await signup({ email, password, displayName });

      if (response.status === 'error') {
        setErrorMessage(response.message);
        return;
      }

      await saveSession({
        user: response.user,
        accessToken: response.token,
        expiresAt: response.expiresAt,
        tokenType: response.tokenType
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Não foi possível criar a conta.';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await clearSession();
    setErrorMessage(null);
  }, []);

  return {
    isSubmitting,
    errorMessage,
    loginUser,
    signupUser,
    logout
  };
}
