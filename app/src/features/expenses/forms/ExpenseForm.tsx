import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { DEFAULT_CURRENCY, SUPPORTED_CURRENCIES } from '../constants';
import { validateExpenseInput } from './expenseValidation';
import type { ExpenseCategory, ExpenseForm as ExpenseFormModel, ExpenseCurrency } from '../types';

export type ExpenseFormProps = {
  categories: ExpenseCategory[];
  initialValues?: Partial<ExpenseFormModel>;
  submitLabel?: string;
  onSubmit: (payload: { description: string; amount: number; currency: ExpenseCurrency; date: string; categoryId: string }) => void | Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
};

export function ExpenseForm({ categories, initialValues, submitLabel = 'Salvar', onSubmit, onCancel, isSubmitting = false }: ExpenseFormProps) {
  const initialForm: ExpenseFormModel = useMemo(() => ({
    description: initialValues?.description ?? '',
    amount: initialValues?.amount ?? '',
    currency: (initialValues?.currency ?? DEFAULT_CURRENCY) as ExpenseCurrency,
    date: initialValues?.date ?? '',
    categoryId: initialValues?.categoryId ?? categories[0]?.id ?? ''
  }), [categories, initialValues]);

  const [values, setValues] = useState<ExpenseFormModel>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setValues(initialForm);
    setErrors({});
  }, [initialForm]);

  const updateField = <K extends keyof ExpenseFormModel>(field: K, value: ExpenseFormModel[K]) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: '' }));
  };

  const handleSubmit = async () => {
    const nextErrors = validateExpenseInput(values);
    setErrors(nextErrors as Record<string, string>);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    await onSubmit({
      description: values.description.trim(),
      amount: Number(values.amount),
      currency: values.currency,
      date: values.date,
      categoryId: values.categoryId
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.label}>Descrição</Text>
      <TextInput
        style={[styles.input, errors.description ? styles.inputError : null]}
        value={values.description}
        onChangeText={(text) => updateField('description', text)}
        placeholder="Ex.: Mercado"
        placeholderTextColor="#98A2B3"
      />
      {errors.description ? <Text style={styles.errorText}>{errors.description}</Text> : null}

      <Text style={styles.label}>Valor</Text>
      <TextInput
        style={[styles.input, errors.amount ? styles.inputError : null]}
        value={values.amount}
        keyboardType="decimal-pad"
        onChangeText={(text) => updateField('amount', text)}
        placeholder="284,90"
        placeholderTextColor="#98A2B3"
      />
      {errors.amount ? <Text style={styles.errorText}>{errors.amount}</Text> : null}

      <Text style={styles.label}>Moeda</Text>
      <View style={styles.currencyRow}>
        {SUPPORTED_CURRENCIES.map((currency) => {
          const isSelected = values.currency === currency;

          return (
            <Pressable
              key={currency}
              style={[styles.currencyChip, isSelected ? styles.currencyChipSelected : null]}
              onPress={() => updateField('currency', currency as ExpenseCurrency)}
            >
              <Text style={[styles.currencyChipText, isSelected ? styles.currencyChipTextSelected : null]}>{currency}</Text>
            </Pressable>
          );
        })}
      </View>
      {errors.currency ? <Text style={styles.errorText}>{errors.currency}</Text> : null}

      <Text style={styles.label}>Data</Text>
      <TextInput
        style={[styles.input, errors.date ? styles.inputError : null]}
        value={values.date}
        onChangeText={(text) => updateField('date', text)}
        placeholder="2026-09-27"
        placeholderTextColor="#98A2B3"
      />
      {errors.date ? <Text style={styles.errorText}>{errors.date}</Text> : null}

      <Text style={styles.label}>Categoria</Text>
      <View style={styles.categoryList}>
        {categories.map((category) => {
          const selected = values.categoryId === category.id;

          return (
            <Pressable
              key={category.id}
              style={[styles.categoryButton, selected ? styles.categoryButtonSelected : null]}
              onPress={() => updateField('categoryId', category.id)}
            >
              <Text style={[styles.categoryButtonText, selected ? styles.categoryButtonTextSelected : null]}>{category.name}</Text>
            </Pressable>
          );
        })}
      </View>
      {errors.categoryId ? <Text style={styles.errorText}>{errors.categoryId}</Text> : null}

      <View style={styles.actions}>
        {onCancel ? (
          <Pressable style={[styles.button, styles.secondaryButton]} onPress={onCancel}>
            <Text style={styles.secondaryButtonText}>Cancelar</Text>
          </Pressable>
        ) : null}

        <Pressable style={[styles.button, styles.primaryButton, isSubmitting ? styles.buttonDisabled : null]} onPress={handleSubmit} disabled={isSubmitting}>
          <Text style={styles.primaryButtonText}>{isSubmitting ? 'Salvando...' : submitLabel}</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F7FB' },
  content: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 32 },
  label: { fontSize: 12, fontWeight: '700', color: '#475467', marginBottom: 8, marginTop: 12 },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D0D5DD',
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#101828'
  },
  inputError: { borderColor: '#D92D20' },
  errorText: { marginTop: 6, color: '#D92D20', fontSize: 12 },
  currencyRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  currencyChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#F2F4F7',
    borderWidth: 1,
    borderColor: '#D0D5DD'
  },
  currencyChipSelected: { backgroundColor: '#E0F2FE', borderColor: '#38BDF8' },
  currencyChipText: { fontSize: 13, color: '#344054', fontWeight: '600' },
  currencyChipTextSelected: { color: '#0F172A' },
  categoryList: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#F2F4F7',
    borderWidth: 1,
    borderColor: '#D0D5DD'
  },
  categoryButtonSelected: { backgroundColor: '#ECFDF5', borderColor: '#16A34A' },
  categoryButtonText: { fontSize: 13, color: '#344054', fontWeight: '600' },
  categoryButtonTextSelected: { color: '#14532D' },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16, gap: 12 },
  button: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10, minWidth: 120, alignItems: 'center' },
  secondaryButton: { backgroundColor: '#F2F4F7' },
  secondaryButtonText: { color: '#101828', fontWeight: '600' },
  primaryButton: { backgroundColor: '#0F172A' },
  primaryButtonText: { color: '#FFFFFF', fontWeight: '700' },
  buttonDisabled: { opacity: 0.6 }
});
