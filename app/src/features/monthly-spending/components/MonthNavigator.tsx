import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type MonthNavigatorProps = {
  selectedMonth: string;
  isPreviousDisabled?: boolean;
  isNextDisabled?: boolean;
  onPrevious: () => void;
  onNext: () => void;
};

function formatMonth(value: string) {
  const [year, month] = value.split('-').map(Number);
  const date = new Date(year, month - 1, 1);

  return new Intl.DateTimeFormat('pt-BR', {
    month: 'long',
    year: 'numeric'
  }).format(date);
}

export function MonthNavigator({
  selectedMonth,
  isPreviousDisabled = false,
  isNextDisabled = false,
  onPrevious,
  onNext
}: MonthNavigatorProps) {
  return (
    <View style={styles.container}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Mês anterior"
        onPress={onPrevious}
        disabled={isPreviousDisabled}
        style={[styles.navButton, isPreviousDisabled && styles.navButtonDisabled]}
      >
        <Text style={[styles.navButtonText, isPreviousDisabled && styles.navButtonTextDisabled]}>{'<'}</Text>
      </Pressable>

      <Text style={styles.label}>{formatMonth(selectedMonth)}</Text>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Próximo mês"
        onPress={onNext}
        disabled={isNextDisabled}
        style={[styles.navButton, isNextDisabled && styles.navButtonDisabled]}
      >
        <Text style={[styles.navButtonText, isNextDisabled && styles.navButtonTextDisabled]}>{'>'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingVertical: 6
  },
  navButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E6ECF2'
  },
  navButtonDisabled: {
    opacity: 0.45
  },
  navButtonText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#101828'
  },
  navButtonTextDisabled: {
    color: '#667085'
  },
  label: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: '#101828'
  }
});
