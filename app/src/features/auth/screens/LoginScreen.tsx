import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface LoginScreenProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onGoToSignup: () => void;
  isSubmitting?: boolean;
  errorMessage?: string | null;
}

export function LoginScreen({ onLogin, onGoToSignup, isSubmitting = false, errorMessage }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const formIsValid = useMemo(() => email.trim().length > 0 && password.trim().length > 0, [email, password]);

  const handleSubmit = async () => {
    if (!formIsValid || isSubmitting) {
      return;
    }

    await onLogin(email.trim(), password.trim());
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <Text style={styles.title}>Entrar</Text>
        <Text style={styles.subTitle}>Acesse sua conta para continuar.</Text>

        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />

        <TextInput
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        <Pressable
          accessibilityRole="button"
          disabled={!formIsValid || isSubmitting}
          onPress={handleSubmit}
          style={[styles.primaryButton, (!formIsValid || isSubmitting) && styles.primaryButtonDisabled]}
        >
          {isSubmitting ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.primaryButtonText}>Entrar</Text>}
        </Pressable>

        <Pressable accessibilityRole="button" onPress={onGoToSignup} style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Criar conta</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F7FB'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
    backgroundColor: '#F4F7FB'
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#101828',
    marginBottom: 8
  },
  subTitle: {
    fontSize: 16,
    color: '#475467',
    marginBottom: 24
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D0D5DD',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 14,
    color: '#101828'
  },
  errorText: {
    color: '#B42318',
    fontSize: 14,
    marginBottom: 12,
    fontWeight: '600'
  },
  primaryButton: {
    backgroundColor: '#1D4ED8',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8
  },
  primaryButtonDisabled: {
    opacity: 0.6
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700'
  },
  secondaryButton: {
    marginTop: 16,
    alignItems: 'center',
    paddingVertical: 12
  },
  secondaryButtonText: {
    color: '#1D4ED8',
    fontSize: 15,
    fontWeight: '600'
  }
});
