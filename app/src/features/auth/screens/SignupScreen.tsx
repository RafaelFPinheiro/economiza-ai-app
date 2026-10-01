import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface SignupScreenProps {
  onSignup: (email: string, password: string, displayName?: string) => Promise<void>;
  onGoToLogin: () => void;
  isSubmitting?: boolean;
  errorMessage?: string | null;
}

export function SignupScreen({ onSignup, onGoToLogin, isSubmitting = false, errorMessage }: SignupScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  const formIsValid = useMemo(() => {
    return email.trim().includes('@') && password.trim().length >= 6;
  }, [email, password]);

  const handleSubmit = async () => {
    if (!formIsValid || isSubmitting) {
      return;
    }

    await onSignup(email.trim(), password.trim(), displayName.trim() || undefined);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <Text style={styles.title}>Criar conta</Text>
        <Text style={styles.subTitle}>Cadastre-se para começar.</Text>

        <TextInput
          autoCapitalize="words"
          placeholder="Nome (opcional)"
          value={displayName}
          onChangeText={setDisplayName}
          style={styles.input}
        />

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
          {isSubmitting ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.primaryButtonText}>Criar conta</Text>}
        </Pressable>

        <Pressable accessibilityRole="button" onPress={onGoToLogin} style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Voltar para login</Text>
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
