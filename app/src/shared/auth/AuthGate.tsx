import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import type { AuthState } from './AuthState';
import { initialAuthState } from './AuthState';
import { clearSession, readSession, isTokenExpired } from './sessionStore';

interface AuthGateProps {
  children: React.ReactNode;
  loginScreen: React.ReactNode;
  refreshKey?: number | string;
}

export function AuthGate({ children, loginScreen, refreshKey = 0 }: AuthGateProps) {
  const [authState, setAuthState] = useState<AuthState>(initialAuthState);

  useEffect(() => {
    let cancelled = false;

    async function loadSession() {
      try {
        const storedSession = await readSession();

        if (cancelled) {
          return;
        }

        if (!storedSession) {
          setAuthState({ status: 'unauthenticated', session: null, user: null });
          return;
        }

        if (isTokenExpired(storedSession.accessToken)) {
          await clearSession();
          setAuthState({ status: 'unauthenticated', session: null, user: null });
          return;
        }

        setAuthState({
          status: 'authenticated',
          session: storedSession,
          user: storedSession.user
        });
      } catch {
        if (!cancelled) {
          await clearSession();
          setAuthState({ status: 'unauthenticated', session: null, user: null });
        }
      }
    }

    setAuthState(initialAuthState);
    loadSession();
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const isChecking = authState.status === 'checking';
  const isAuthenticated = authState.status === 'authenticated';

  const renderedContent = useMemo(() => {
    if (isChecking) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#1D4ED8" />
          <Text style={styles.loadingText}>Validando sessão...</Text>
        </View>
      );
    }

    if (!isAuthenticated) {
      return <>{loginScreen}</>;
    }

    return <>{children}</>;
  }, [children, isAuthenticated, isChecking, loginScreen]);

  return renderedContent;
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F7FB'
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    fontWeight: '600',
    color: '#344054'
  }
});
