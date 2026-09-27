# Contract: Monthly Spending Dashboard Service Boundary

## Purpose

Define the business-facing contract between the dashboard presentation layer and the service layer without prescribing implementation details.

## Service responsibility

The service layer is responsible for providing month-level spending data, category totals, comparator values, and transaction lists using the project’s mocked responses. It must emulate the future backend contract closely enough that presentation components are not coupled to mock-specific structure or transport details.

## Request model

- `selectedMonth`: the month currently under review

## Available months contract

The service layer is responsible for exposing the range of months for which mocked data exists. Navigation in the frontend must be bounded to this set instead of inferring a range from financial values or allowing arbitrary historical or future browsing.

```text
AvailableMonthsResponse {
  months: string[]
}
```

Example:

```text
{
  months: ["2026-07", "2026-08", "2026-09"]
}
```

The frontend may call a service operation conceptually equivalent to `getAvailableMonths()` and use that list to drive the month navigator. This keeps the architecture simple and avoids coupling the UI to mock internals.

## Response model

```text
MonthlySpendingResponse {
  month: string
  totalSpending: number
  previousMonthTotal: number
  comparisonDifference: number
  comparisonDirection: "increase" | "decrease" | "no-change"
  categories: CategorySummary[]
  transactions: TransactionSummary[]
  status: "ok" | "empty" | "error"
}
```

`MonthlySpendingResponse` contains values that are already calculated or prepared by the backend service contract. The frontend is responsible for presenting these values; it does not perform the financial calculations itself.

### CategorySummary

```text
CategorySummary {
  category: string
  amount: number
  shareOfTotal: number
}
```

### TransactionSummary

```text
TransactionSummary {
  id: string
  date: string
  description: string
  amount: number
  category: string
}
```

If a transaction represents a foreign-currency expense, the service should expose the original currency detail alongside the amount so the presentation layer can display it explicitly without applying a silent conversion.

## Error and empty-state handling

- If no data is available for the selected month, the service must return a valid empty-state response rather than a failed transport response.
- If the selected month is outside the available dataset, the service must report that the month is unavailable or unsupported without exposing a misleading value.
- A valid empty month remains navigable and must not be treated as a corrupted or failed dataset response.
- An unavailable period is distinct from an empty month and must not be confused with a transport or service failure.
- A transport or service failure is a distinct error state and must not be treated as normal financial data for the selected month unless there is a clear, documented business reason to do so.
- If a service failure occurs, the presentation layer must surface a clear user-facing fallback state without leaking service internals.

## Replacement requirement

The mocked service contract must be structurally replaceable by a real API client without requiring presentation-layer changes. The frontend should consume the response contract and render it, not depend on the source of the data.
