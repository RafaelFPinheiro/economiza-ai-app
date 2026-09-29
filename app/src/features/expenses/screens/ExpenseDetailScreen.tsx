import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppHeader } from '../../../shared/ui/AppHeader';
import { deleteExpense, getExpenseById } from '../../../services/mocked/expenseService';
import { getCategoryName } from '../utils/formatters';
import { DEFAULT_CURRENCY } from '../constants';
import { DeleteExpenseDialog } from '../components/DeleteExpenseDialog';

type ExpenseDetailScreenProps = {
  expenseId: string;
  categories: Array<{ id: string; name: string }>;
  onEdit?: (expenseId: string) => void;
  onBack?: () => void;
};

export function ExpenseDetailScreen({ expenseId, categories, onEdit, onBack }: ExpenseDetailScreenProps) {
  const insets = useSafeAreaInsets();
  const [expense, setExpense] = React.useState<Awaited<ReturnType<typeof getExpenseById>>['expense'] | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;

    async function load() {
      const response = await getExpenseById(expenseId);
      if (!isMounted) {
        return;
      }

      if (response.status === 'ok' && response.expense) {
        setExpense(response.expense);
        setErrorMessage(null);
        return;
      }

      setExpense(null);
      setErrorMessage(response.message ?? 'Não foi possível carregar a despesa.');
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [expenseId]);

  if (errorMessage || !expense) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <AppHeader title="Despesa" onBack={onBack} />
        <View style={[styles.centered, { paddingBottom: insets.bottom + 16 }]}>
          <Text style={styles.errorText}>{errorMessage ?? 'Despesa não encontrada.'}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleDelete = async () => {
    await deleteExpense(expense.id);
    setConfirmDelete(false);
    onBack?.();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <AppHeader title={expense.description} onBack={onBack} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.container, { paddingBottom: insets.bottom + 20 }]}
      >
        <View style={styles.card}>
          <Text style={styles.label}>Valor</Text>
          <Text style={styles.value}>{`${expense.currency === 'BRL' ? 'R$' : expense.currency === 'USD' ? 'US$' : '€'} ${Number(expense.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</Text>

          <Text style={styles.label}>Moeda</Text>
          <Text style={styles.value}>{expense.currency ?? DEFAULT_CURRENCY}</Text>

          <Text style={styles.label}>Data</Text>
          <Text style={styles.value}>{expense.date}</Text>

          <Text style={styles.label}>Categoria</Text>
          <Text style={styles.value}>{getCategoryName(expense.categoryId, categories)}</Text>
        </View>

        <View style={styles.actions}>
          <Pressable style={[styles.button, styles.primaryButton]} onPress={() => onEdit?.(expense.id)}>
            <Text style={styles.primaryButtonText}>Editar</Text>
          </Pressable>
          <Pressable style={[styles.button, styles.deleteButton]} onPress={() => setConfirmDelete(true)}>
            <Text style={styles.deleteButtonText}>Excluir</Text>
          </Pressable>
        </View>
      </ScrollView>

      <DeleteExpenseDialog
        visible={confirmDelete}
        description={expense.description}
        onCancel={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
      />
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
    paddingTop: 12
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2
  },
  actions: {
    marginTop: 20,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'stretch'
  },
  button: {
    flex: 1,
    minWidth: 90,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center'
  },
  primaryButton: {
    backgroundColor: '#0F172A'
  },
  deleteButton: {
    backgroundColor: '#B42318'
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700'
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontWeight: '700'
  },
  label: {
    marginTop: 12,
    fontSize: 12,
    color: '#475467',
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  value: {
    marginTop: 4,
    fontSize: 17,
    color: '#101828',
    fontWeight: '600'
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F7FB',
    paddingHorizontal: 18
  },
  errorText: {
    fontSize: 16,
    color: '#B42318',
    textAlign: 'center'
  }
});
