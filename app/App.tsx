import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { MonthlySpendingScreen } from './src/features/monthly-spending/screens/MonthlySpendingScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <MonthlySpendingScreen />
    </SafeAreaProvider>
  );
}
