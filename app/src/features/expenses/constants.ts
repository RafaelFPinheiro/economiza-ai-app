export const EXPENSE_CATEGORIES = [
  { id: 'alimentacao', name: 'Alimentação' },
  { id: 'moradia', name: 'Moradia' },
  { id: 'transporte', name: 'Transporte' },
  { id: 'contas', name: 'Contas' },
  { id: 'lazer', name: 'Lazer' },
  { id: 'saude', name: 'Saúde' },
  { id: 'outros', name: 'Outros' }
] as const;

export const DEFAULT_CURRENCY = 'BRL';
export const SUPPORTED_CURRENCIES = ['BRL', 'USD', 'EUR'] as const;
