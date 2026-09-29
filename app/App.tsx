import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

import { MonthlySpendingScreen } from './src/features/monthly-spending/screens/MonthlySpendingScreen';
import { CreateExpenseScreen } from './src/features/expenses/screens/CreateExpenseScreen';
import { EditExpenseScreen } from './src/features/expenses/screens/EditExpenseScreen';
import { ExpenseDetailScreen } from './src/features/expenses/screens/ExpenseDetailScreen';
import { ExpenseListScreen } from './src/features/expenses/screens/ExpenseListScreen';
import { getExpenseCategories } from './src/services/mocked/expenseService';
import type { ExpenseCategory } from './src/features/expenses/types';

type TabKey = 'home' | 'transactions' | 'create' | 'analyses' | 'more';
type ViewKey = TabKey | 'detail' | 'edit';

function PlaceholderScreen({ title, description }: { title: string; description: string }) {
  return (
    <View style={styles.placeholderContainer}>
      <Text style={styles.placeholderTitle}>{title}</Text>
      <Text style={styles.placeholderDescription}>{description}</Text>
    </View>
  );
}

function BottomTabBar({
  activeTab,
  onSelect,
  onAdd
}: {
  activeTab: TabKey;
  onSelect: (tab: TabKey) => void;
  onAdd: () => void;
}) {
  const insets = useSafeAreaInsets();

  const tabs: Array<{ key: TabKey; label: string; icon: string }> = [
    { key: 'home', label: 'Início', icon: '⌂' },
    { key: 'transactions', label: 'Transações', icon: '▣' },
    { key: 'create', label: 'Adicionar', icon: '+' },
    { key: 'analyses', label: 'Análises', icon: '◔' },
    { key: 'more', label: 'Mais', icon: '⋯' }
  ];

  return (
    <View style={[styles.tabBarShell, { paddingBottom: insets.bottom + 6 }]}> 
      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          const isAdd = tab.key === 'create';

          return (
            <Pressable
              key={tab.key}
              accessibilityRole="button"
              hitSlop={8}
              onPress={() => (isAdd ? onAdd() : onSelect(tab.key))}
              style={[
                styles.tabButton,
                isAdd ? styles.addTabButton : null,
                isActive && !isAdd ? styles.tabButtonActive : null,
                isAdd && isActive ? styles.addTabButtonActive : null
              ]}
            >
              <Text style={[styles.tabIcon, isAdd && !isActive ? styles.addTabIcon : null, isActive && !isAdd ? styles.tabIconActive : null]}>{tab.icon}</Text>
              <Text style={[styles.tabLabel, isActive && !isAdd ? styles.tabLabelActive : null, isAdd ? styles.addTabLabel : null]}>{tab.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function App() {
  const [screen, setScreen] = useState<ViewKey>('home');
  const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(null);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);

  useEffect(() => {
    getExpenseCategories().then(setCategories);
  }, []);

  const activeTab = useMemo<TabKey>(() => {
    if (screen === 'home') return 'home';
    if (screen === 'transactions' || screen === 'detail' || screen === 'edit') return 'transactions';
    if (screen === 'create') return 'create';
    if (screen === 'analyses') return 'analyses';
    return 'more';
  }, [screen]);

  const handleSelectTab = (tab: TabKey) => {
    if (tab === 'create') {
      setSelectedExpenseId(null);
      setScreen('create');
      return;
    }

    setSelectedExpenseId(null);
    setScreen(tab);
  };

  const renderScreen = () => {
    if (screen === 'home') {
      return <MonthlySpendingScreen />;
    }

    if (screen === 'create') {
      return <CreateExpenseScreen onCancel={() => setScreen('transactions')} onSaved={() => setScreen('transactions')} />;
    }

    if (screen === 'edit' && selectedExpenseId) {
      return <EditExpenseScreen expenseId={selectedExpenseId} onCancel={() => setScreen('detail')} onSaved={() => setScreen('transactions')} />;
    }

    if (screen === 'detail' && selectedExpenseId) {
      return (
        <ExpenseDetailScreen
          expenseId={selectedExpenseId}
          categories={categories}
          onEdit={(expenseId) => {
            setSelectedExpenseId(expenseId);
            setScreen('edit');
          }}
          onBack={() => setScreen('transactions')}
        />
      );
    }

    if (screen === 'analyses') {
      return <PlaceholderScreen title="Análises" description="Esta área ainda será preenchida conforme o produto for definido." />;
    }

    if (screen === 'more') {
      return <PlaceholderScreen title="Mais" description="Configurações e funcionalidades futuras ficarão aqui." />;
    }

    return (
      <ExpenseListScreen
        onOpenDetail={(id) => {
          setSelectedExpenseId(id);
          setScreen('detail');
        }}
        onCreate={() => setScreen('create')}
      />
    );
  };

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <View style={styles.shell}>
        <View style={styles.content}>{renderScreen()}</View>
        <BottomTabBar
          activeTab={activeTab}
          onSelect={handleSelectTab}
          onAdd={() => {
            setSelectedExpenseId(null);
            setScreen('create');
          }}
        />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    backgroundColor: '#F4F7FB'
  },
  content: {
    flex: 1,
    backgroundColor: '#F4F7FB'
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F7FB',
    paddingHorizontal: 24
  },
  placeholderTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#101828'
  },
  placeholderDescription: {
    marginTop: 8,
    color: '#475467',
    textAlign: 'center',
    fontSize: 15
  },
  tabBarShell: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E4E7EC',
    shadowColor: '#101828',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 6
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingTop: 8,
    minHeight: 72
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    minHeight: 58,
    borderRadius: 12
  },
  addTabButton: {
    flex: 1.1,
    marginHorizontal: 4,
    backgroundColor: '#E7F0FF',
    borderWidth: 1,
    borderColor: '#D7E6FF'
  },
  addTabButtonActive: {
    backgroundColor: '#D8E7FF',
    borderColor: '#C9DBFF'
  },
  tabButtonActive: {
    backgroundColor: '#EEF5FF'
  },
  tabIcon: {
    fontSize: 18,
    lineHeight: 20,
    color: '#475467'
  },
  tabIconActive: {
    color: '#0F172A'
  },
  addTabIcon: {
    color: '#0F172A'
  },
  tabLabel: {
    marginTop: 4,
    fontSize: 10,
    fontWeight: '600',
    color: '#475467',
    textAlign: 'center'
  },
  tabLabelActive: {
    color: '#0F172A'
  },
  addTabLabel: {
    color: '#0F172A'
  }
});
