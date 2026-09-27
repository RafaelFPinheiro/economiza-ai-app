import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { CategorySummary } from '../types';

type Props = {
  categories: CategorySummary[];
};

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
});

export function CategoryBreakdown({ categories }: Props) {
  if (categories.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Categorias</Text>
        <Text style={styles.emptyText}>Sem categorias para este mês.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Categorias</Text>
      {categories.map((item) => (
        <View key={item.category} style={styles.row}>
          <View style={styles.headerRow}>
            <Text style={styles.category}>{item.category}</Text>
            <Text style={styles.amount}>{currencyFormatter.format(item.amount)}</Text>
          </View>

          <View style={styles.barTrack}>
            <View style={[styles.barFill, { width: `${Math.min(item.shareOfTotal, 100)}%` }]} />
          </View>

          <Text style={styles.share}>{item.shareOfTotal.toFixed(1).replace('.', ',')}%</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#E6ECF2'
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#101828',
    marginBottom: 10
  },
  row: {
    paddingVertical: 8
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12
  },
  category: {
    fontSize: 14,
    color: '#101828',
    fontWeight: '600',
    flexShrink: 1
  },
  amount: {
    fontSize: 13,
    color: '#344054',
    fontWeight: '600'
  },
  barTrack: {
    marginTop: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: '#E6ECF2',
    overflow: 'hidden'
  },
  barFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#2B6CF6'
  },
  share: {
    marginTop: 6,
    fontSize: 11,
    color: '#667085',
    textAlign: 'right'
  },
  emptyText: {
    fontSize: 13,
    color: '#667085'
  }
});
