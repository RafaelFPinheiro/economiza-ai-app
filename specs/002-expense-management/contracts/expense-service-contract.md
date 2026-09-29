# Expense Service Contract

## Overview

This contract describes the mocked expense service boundary for Feature 002. The frontend consumes these operations through a service layer and must never access the raw mock dataset directly.

## Contract goals

- Expose the data needed for the expense list, detail, create, edit, and delete flows.
- Provide the category list used by the expense form.
- Maintain a clean path for future replacement by a real backend without changing the presentation layer.
- Keep financial aggregation, monthly dashboard calculations, and category management outside the frontend responsibility.

## Core types

### Expense

```ts
type Expense = {
  id: string;
  description: string;
  amount: number;
  currency: 'BRL' | string;
  date: string; // ISO date format, e.g. 2026-09-27
  categoryId: string;
};
```

### ExpenseCategory

```ts
type ExpenseCategory = {
  id: string;
  name: string;
};
```

### ExpenseListResponse

```ts
type ExpenseListResponse = {
  expenses: Expense[];
  status: 'ok' | 'empty' | 'error';
};
```

### ExpenseDetailResponse

```ts
type ExpenseDetailResponse = {
  expense?: Expense;
  status: 'ok' | 'not-found' | 'error';
};
```

## Service operations

### listExpenses()
Returns the current list of expenses for the mocked dataset.

**Behavior**:
- Returns `status: 'ok'` when the list is available.
- Returns `status: 'empty'` when there are no expenses to show.
- Returns `status: 'error'` only for a real service failure, not for a normal empty list.

### getExpense(id: string)
Returns a single expense record by its identifier.

**Behavior**:
- Returns the matching expense when found.
- Returns `status: 'not-found'` when the expense does not exist.
- Returns `status: 'error'` only for a genuine service failure.

### createExpense(input: ExpenseInput)
Creates a new expense from a validated user form.

**Input**:

```ts
type ExpenseInput = {
  description: string;
  amount: number;
  currency: string;
  date: string;
  categoryId: string;
};
```

**Behavior**:
- Persists the expense in the mocked dataset.
- Returns the created record or a success status wrapper.
- Rejects invalid input before save.

### updateExpense(id: string, input: Partial<ExpenseInput>)
Updates an existing expense and supports category-only corrections.

**Behavior**:
- Allows changes to description, amount, date, category, and currency.
- Supports partial updates for category-only corrections.
- Returns the updated expense.

### deleteExpense(id: string)
Deletes an existing expense only after the user confirms the destructive action.

**Behavior**:
- Removes the expense from the mocked dataset.
- Returns a success confirmation or a not-found status when appropriate.

### getCategories()
Returns the available category list for expense selection.

**Behavior**:
- Returns a predefined set of category metadata.
- The response uses `categoryId` references rather than embedding the category name inside expense records.
- Category CRUD is outside this feature and is not exposed in the contract.

## Error handling expectations

- Empty list and service error are distinct states.
- The frontend must not treat an empty dataset as a broken contract or failed request.
- Foreign-currency expenses must preserve the original currency value explicitly and should not undergo silent conversion on the frontend.
- Validation errors should be surfaced in PT-BR to the user before save is attempted.

## Notes

- The contract intentionally excludes account management, recurring expenses, budgets, and other out-of-scope features.
- The service remains mocked for this feature and is expected to be replaced later by a real implementation without changing the consumer contract shape.
