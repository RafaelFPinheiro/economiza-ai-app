# Data Model: Monthly Spending Dashboard

## Entities

### MonthSummary

- `month`: the selected month being displayed
- `monthlyResult`: result/balance for the selected month, already calculated and provided by the backend service contract
- `previousMonthResult`: comparison result for the immediately preceding month, also provided by the backend service contract
- `comparisonDifference`: numeric delta between the selected month and previous month, already calculated by the backend service
- `comparisonDirection`: indicator of increase, decrease, or no change, derived by the service contract
- `categories`: list of category aggregations for the month, as provided by the backend service
- `transactions`: list of all account activity for the month, including both income and expense entries, as provided by the backend service

Financial calculations and business rules remain outside the React Native presentation layer. The frontend is responsible for reading and presenting the values supplied by the service contract.

For the US1 refinement, user-facing values default to BRL and Portuguese labels. If a transaction uses a non-BRL currency, the original currency designation must be displayed explicitly without conversion in the presentation layer.

### CategoryBreakdown

- `category`: category name used for the aggregation
- `amount`: total amount aggregated by the backend for that category in the selected month
- `shareOfTotal`: percentage of the monthly result or category share as defined by the backend contract
- `rank` or `isTopCategory`: optional service-provided metadata that explicitly identifies the dominant category when the UX requires a stronger visual emphasis without frontend re-ranking

Category totals are a backend-prepared aggregation of categorized transactions. The frontend must not calculate category totals, share, or ranking from raw transactions.

### TransactionSummary

- `id`: stable transaction identifier
- `date`: transaction date within the selected month
- `description`: user-facing description or merchant label
- `amount`: transaction value
- `categoryId` or `category`: category reference or label associated with the transaction when applicable
- `type`: transaction direction, using the canonical domain as `"income" | "expense"`

Transaction is the core concept for account movement. Expense and Income are transaction subtypes, and categories may be used for either direction when the backend has categorized the transaction.

### MonthSelection

- `selectedMonth`: the current month under review in frontend interaction state
- `availableMonths`: the ordered list of months available in the mocked dataset and exposed by the service contract for navigation
- `boundaryMessage`: a user-facing Brazilian Portuguese message shown when navigation attempts to move beyond the available range
- `emptyMonth`: a valid navigable month with no spending data
- `unavailablePeriod`: a month outside the mocked data range, distinct from both an empty month and a service/transport failure

## Relationships

- A `MonthSummary` contains many `CategoryBreakdown` entries.
- A `MonthSummary` contains many `TransactionSummary` entries.
- Frontend `MonthSelection` state determines which `MonthSummary` is displayed.
- `MonthSelection.availableMonths` bounds the navigation controls and prevents arbitrary historical or future browsing beyond the service-provided dataset.

`MonthSelection` is frontend interaction state, not backend financial domain data.

## Validation rules

- `monthlyResult` must be the backend-provided result/balance for the selected month and must not be recalculated in the frontend.
- `comparisonDifference` must equal `selectedMonthResult - previousMonthResult` as defined by the backend contract.
- `comparisonDirection` must be derived from the difference: increase, decrease, or no change.
- The transaction list must represent the month’s account activity, including both income and expense entries, and any service-defined filtering or pagination must be applied only to the list as a whole rather than to a spend-only subset.
- Category totals and transaction rows must remain consistent with the same selected month context, with all category aggregation supplied by the backend service rather than by the frontend.
- `availableMonths` must be service-provided and the UI must never infer the navigation boundaries by inspecting transaction values.
- An empty month is a valid state and must remain navigable; an unavailable period is not a service error and must not be confused with an empty month.

## State transitions

- A user selects a month: the dashboard loads the matching summary and updates visible comparison data.
- A user navigates to another month: the summary, category breakdown, and transaction list refresh for the new month.
- A month without data: the dashboard remains informative and uses an explicit empty-state representation while retaining navigation controls to a populated month.
- A month outside the available data range: the dashboard prevents arbitrary navigation and shows a boundary message instead of showing misleading or fabricated data.
- A transport or service failure is distinct from an empty month and must be handled as an error state, not as normal financial response data.
