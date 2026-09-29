import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';

import { AppHeader } from '../../../shared/ui/AppHeader';
import { getExpenseCategories } from '../../../services/mocked/expenseService';
import { ExpenseForm } from '../forms/ExpenseForm';
import { useExpenseActions } from '../hooks/useExpenseActions';
import type { ExpenseCategory } from '../types';

type CreateExpenseScreenProps = {
  onCancel: () => void;
  onSaved: () => void;
};

export function CreateExpenseScreen({ onCancel, onSaved }: CreateExpenseScreenProps) {
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const { isSubmitting, handleCreate } = useExpenseActions();

  useEffect(() => {
    getExpenseCategories().then(setCategories);
  }, []);

  const handleSubmit = async (payload: { description: string; amount: number; currency: 'BRL' | 'USD' | 'EUR'; date: string; categoryId: string }) => {
    await handleCreate(payload);
    onSaved();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <AppHeader title="Nova despesa" />
      <ExpenseForm categories={categories} onSubmit={handleSubmit} onCancel={onCancel} isSubmitting={isSubmitting} submitLabel="Salvar despesa" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F4F7FB' },
});
