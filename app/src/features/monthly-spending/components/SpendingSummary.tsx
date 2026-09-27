import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { MonthlySpendingResponse } from '../types';

type Props = {
  data: MonthlySpendingResponse;
};

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
});

function formatMonth(value: string) {
  const [year, month] = value.split('-').map(Number);
  const date = new Date(year, month - 1, 1);

  return new Intl.DateTimeFormat('pt-BR', {
    month: 'long',
    year: 'numeric'
  }).format(date);
}

function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

export function SpendingSummary({ data }: Props) {
  const isIncrease = data.comparisonDifference > 0;
  const isDecrease = data.comparisonDifference < 0;
  const comparisonAbs = Math.abs(data.comparisonDifference);

  return (
    <View style={styles.card}>
      <Text style={styles.period}>{formatMonth(data.month)}</Text>
      <Text style={styles.total}>{formatCurrency(data.totalSpending)}</Text>

      <View style={styles.compareRow}>
        <Text style={styles.arrow}>{isIncrease ? '↑' : isDecrease ? '↓' : '→'}</Text>
        <Text style={styles.comparison}>{formatCurrency(comparisonAbs)}</Text>
      </View>
      <Text style={styles.caption}>comparado ao mês anterior</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#E6ECF2',
    shadowColor: '#0F172A',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1
  },
  period: {
    fontSize: 13,
    color: '#475467',
    marginBottom: 6
  },
  total: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '700',
    letterSpacing: -0.8,
    color: '#101828'
  },
  compareRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center'
  },
  arrow: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0A7F54',
    marginRight: 6
  },
  comparison: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0A7F54'
  },
  caption: {
    marginTop: 4,
    fontSize: 12,
    color: '#667085'
  }
});
