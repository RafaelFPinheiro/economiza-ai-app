import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { TransactionSummary } from '../types';

type Props = {
  transactions: TransactionSummary[];
};

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
});

function formatDate(value: string) {
  const date = new Date(`${value}T00:00:00`);

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short'
  }).format(date);
}

export function TransactionList({ transactions }: Props) {
  if (transactions.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Principais gastos</Text>
        <Text style={styles.emptyText}>Sem transações relevantes para este mês.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Principais gastos</Text>
      {transactions.map((item) => (
        <View key={item.id} style={styles.row}>
          <View style={styles.info}>
            <Text style={styles.description}>{item.description}</Text>
            <Text style={styles.meta}>{formatDate(item.date)} • {item.category}</Text>
          </View>
          <Text style={styles.amount}>{currencyFormatter.format(item.amount)}</Text>
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
    borderWidth: 1,
    borderColor: '#E6ECF2'
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#101828',
    marginBottom: 8
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F4F7'
  },
  info: {
    flex: 1,
    paddingRight: 12
  },
  description: {
    fontSize: 14,
    color: '#101828',
    fontWeight: '600'
  },
  meta: {
    marginTop: 3,
    fontSize: 11,
    color: '#667085'
  },
  amount: {
    fontSize: 13,
    fontWeight: '700',
    color: '#B42318'
  },
  emptyText: {
    fontSize: 13,
    color: '#667085'
  }
});
