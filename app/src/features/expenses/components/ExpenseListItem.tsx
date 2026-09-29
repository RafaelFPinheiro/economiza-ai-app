import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { formatDatePtBr } from '../utils/formatters';
import type { ExpenseListEntry } from '../types';

type ExpenseListItemProps = {
  item: ExpenseListEntry;
  onPress: () => void;
};

export function ExpenseListItem({ item, onPress }: ExpenseListItemProps) {
  const isIncome = item.type === 'income';

  return (
    <Pressable style={styles.row} onPress={onPress}>
      <View style={styles.leftBlock}>
        <Text style={styles.date}>{formatDatePtBr(item.date)}</Text>
        <Text style={styles.title}>{item.description}</Text>
        <Text style={styles.category}>{item.categoryName}</Text>
      </View>

      <Text style={[styles.amount, isIncome ? styles.incomeAmount : styles.expenseAmount]}>{item.amountLabel}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E7EDF4'
  },
  leftBlock: {
    flex: 1,
    minWidth: 0,
    paddingRight: 8
  },
  date: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '600',
    color: '#667085',
    textTransform: 'uppercase',
    letterSpacing: 0.4
  },
  title: {
    marginTop: 2,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700',
    color: '#101828'
  },
  category: {
    marginTop: 2,
    fontSize: 12,
    lineHeight: 16,
    color: '#475467'
  },
  amount: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700',
    textAlign: 'right'
  },
  incomeAmount: {
    color: '#067647'
  },
  expenseAmount: {
    color: '#B42318'
  }
});
