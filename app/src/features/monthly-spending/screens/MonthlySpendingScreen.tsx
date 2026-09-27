import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { availableMonths } from '../../../services/mocked/monthlySpendingService';
import { CategoryBreakdown } from '../components/CategoryBreakdown';
import { MonthNavigator } from '../components/MonthNavigator';
import { SpendingSummary } from '../components/SpendingSummary';
import { TransactionList } from '../components/TransactionList';
import { useMonthlySpending } from '../hooks/useMonthlySpending';

export function MonthlySpendingScreen() {
  const [selectedMonth, setSelectedMonth] = useState('2026-09');
  const state = useMonthlySpending(selectedMonth);
  const insets = useSafeAreaInsets();

  const monthIndex = useMemo(
    () => availableMonths.indexOf(selectedMonth),
    [selectedMonth]
  );

  const isMonthAvailable = monthIndex !== -1;

  const handlePreviousMonth = () => {
    if (monthIndex <= 0 || !isMonthAvailable) {
      return;
    }

    setSelectedMonth(availableMonths[monthIndex - 1]);
  };

  const handleNextMonth = () => {
    if (monthIndex === -1 || monthIndex >= availableMonths.length - 1) {
      return;
    }

    setSelectedMonth(availableMonths[monthIndex + 1]);
  };

  const renderNavigator = () => (
    <MonthNavigator
      selectedMonth={selectedMonth}
      isPreviousDisabled={monthIndex <= 0 || !isMonthAvailable}
      isNextDisabled={monthIndex === -1 || monthIndex >= availableMonths.length - 1}
      onPrevious={handlePreviousMonth}
      onNext={handleNextMonth}
    />
  );

  if (state.status === 'loading') {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={[styles.centered, { paddingBottom: insets.bottom + 16 }]}> 
          <Text style={styles.loadingText}>Carregando gastos do mês...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (state.status === 'error') {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={[styles.centered, { paddingBottom: insets.bottom + 16 }]}> 
          <Text style={styles.errorText}>{state.errorMessage ?? 'Não foi possível carregar os gastos do mês.'}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!isMonthAvailable) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.container, { paddingBottom: insets.bottom + 20 }]}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.header}>Gastos do mês</Text>
          {renderNavigator()}
          <View style={[styles.emptyStateContainer, { paddingBottom: insets.bottom + 16 }]}> 
            <Text style={styles.emptyTitle}>Período indisponível</Text>
            <Text style={styles.emptyBody}>Não existem dados disponíveis para este período.</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (state.status === 'empty' || !state.data) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.container, { paddingBottom: insets.bottom + 20 }]}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.header}>Gastos do mês</Text>
          {renderNavigator()}
          <View style={[styles.emptyStateContainer, { paddingBottom: insets.bottom + 16 }]}> 
            <Text style={styles.emptyTitle}>Nenhum gasto para este mês</Text>
            <Text style={styles.emptyBody}>Tente outro mês para revisar os gastos disponíveis.</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.container, { paddingBottom: insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.header}>Gastos do mês</Text>
        {renderNavigator()}
        <SpendingSummary data={state.data} />
        <CategoryBreakdown categories={state.data.categories} />
        <TransactionList transactions={state.data.transactions} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F7FB'
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#F4F7FB'
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: '#F4F7FB',
    minHeight: '100%'
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F7FB',
    paddingHorizontal: 18
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#101828',
    marginBottom: 12
  },
  loadingText: {
    fontSize: 16,
    color: '#344054',
    textAlign: 'center'
  },
  errorText: {
    fontSize: 16,
    color: '#B42318',
    textAlign: 'center'
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#101828',
    textAlign: 'center'
  },
  emptyBody: {
    marginTop: 8,
    fontSize: 15,
    color: '#475467',
    textAlign: 'center'
  }
});
