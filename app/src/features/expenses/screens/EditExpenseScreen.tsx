import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, Text, View } from 'react-native';

import { AppHeader } from '../../../shared/ui/AppHeader';
import { getExpenseById, getExpenseCategories } from '../../../services/mocked/expenseService';
import { ExpenseForm } from '../forms/ExpenseForm';
import { useExpenseActions } from '../hooks/useExpenseActions';
import type { ExpenseCategory } from '../types';

type EditExpenseScreenProps = {
  expenseId: string;
  onCancel: () => void;
  onSaved: () => void;
};

export function EditExpenseScreen({ expenseId, onCancel, onSaved }: EditExpenseScreenProps) {
  const insets = useSafeAreaInsets();
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [expense, setExpense] = useState<Awaited<ReturnType<typeof getExpenseById>>['expense'] | null>(null);
  const { isSubmitting, handleUpdate } = useExpenseActions();

  useEffect(() => {
    Promise.all([getExpenseById(expenseId), getExpenseCategories()]).then(([detail, categoryList]) => {
      setExpense(detail.expense ?? null);
      setCategories(categoryList);
    });
  }, [expenseId]);

  const initialValues = useMemo(() => ({
    description: expense?.description ?? '',
    amount: expense ? String(expense.amount) : '',
    currency: expense?.currency ?? 'BRL',
    date: expense?.date ?? '',
    categoryId: expense?.categoryId ?? categories[0]?.id ?? ''
  }), [categories, expense]);

  const handleSubmit = async (payload: { description: string; amount: number; currency: 'BRL' | 'USD' | 'EUR'; date: string; categoryId: string }) => {
    await handleUpdate(expenseId, payload);
    onSaved();
  };

  if (!expense) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={[styles.centered, { paddingBottom: insets.bottom + 16 }]}> 
          <Text style={styles.emptyText}>Carregando despesa…</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <AppHeader title="Editar despesa" />
      <ExpenseForm categories={categories} initialValues={initialValues} onSubmit={handleSubmit} onCancel={onCancel} isSubmitting={isSubmitting} submitLabel="Salvar alterações" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F4F7FB' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 18 },
  emptyText: { fontSize: 16, color: '#475467' }
});
