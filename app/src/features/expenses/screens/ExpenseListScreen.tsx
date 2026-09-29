import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppHeader } from '../../../shared/ui/AppHeader';
import { useExpenses } from '../hooks/useExpenses';
import { ExpenseListItem } from '../components/ExpenseListItem';

export function ExpenseListScreen({ onOpenDetail, onCreate } : { onOpenDetail?: (id: string) => void; onCreate?: () => void }) {
  const { state, categories } = useExpenses();
  const insets = useSafeAreaInsets();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const items = useMemo(() => state.items, [state.items]);

  const handlePress = (id: string) => {
    setSelectedId(id);
    onOpenDetail?.(id);
  };

  if (state.status === 'loading') {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <AppHeader title="Transações" />
        <View style={[styles.centered, { paddingBottom: insets.bottom + 16 }]}>
          <Text style={styles.loadingText}>Carregando transações...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (state.status === 'error') {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <AppHeader title="Transações" />
        <View style={[styles.centered, { paddingBottom: insets.bottom + 16 }]}>
          <Text style={styles.errorText}>{state.message ?? 'Não foi possível carregar as transações.'}</Text>
        </View>
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
        <AppHeader
          title="Transações"
          actions={onCreate ? [{
            label: 'Nova',
            accessibilityLabel: 'Nova transação',
            onPress: onCreate
          }] : []}
        />

        {state.status === 'empty' || items.length === 0 ? (
          <View style={[styles.emptyStateContainer, { paddingBottom: insets.bottom + 16 }]}>
            <Text style={styles.emptyTitle}>Nenhuma transação cadastrada</Text>
            <Text style={styles.emptyBody}>Adicione sua primeira movimentação para começar a organizar a conta.</Text>
          </View>
        ) : (
          <View style={styles.statementList}>
            {items.map((item) => (
              <ExpenseListItem
                key={item.id}
                item={item}
                onPress={() => handlePress(item.id)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FA'
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#F5F7FA'
  },
  container: {
    paddingHorizontal: 0,
    paddingTop: 12,
    minHeight: '100%'
  },
  statementList: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E7EDF4',
    overflow: 'hidden'
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
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E7EDF4',
    paddingHorizontal: 20,
    paddingVertical: 20
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
  },
  selectionText: {
    marginTop: 12,
    color: '#475467'
  },
  metaText: {
    marginTop: 12,
    color: '#475467',
    fontSize: 12
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    paddingHorizontal: 18
  }
});
