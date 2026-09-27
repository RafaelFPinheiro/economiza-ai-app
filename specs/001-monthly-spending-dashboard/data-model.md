# Data Model: Monthly Spending Dashboard

## Entities

### MonthSummary

- `month`: the selected month being displayed
- `totalSpending`: total spending value already calculated and provided by the backend service contract
- `previousMonthTotal`: comparison total for the immediately preceding month, also provided by the backend service contract
- `comparisonDifference`: numeric delta between the selected month and previous month, already calculated by the backend service
- `comparisonDirection`: indicator of increase, decrease, or no change, derived by the service contract
- `categories`: list of category totals for the month, as provided by the backend service
- `transactions`: list of key transactions for the month, as provided by the backend service

Financial calculations and business rules remain outside the React Native presentation layer. The frontend is responsible for reading and presenting the values supplied by the service contract.

For the US1 refinement, user-facing values default to BRL and Portuguese labels. If a transaction uses a non-BRL currency, the original currency designation must be displayed explicitly without conversion in the presentation layer.

### CategoryBreakdown

- `category`: spending category name
- `amount`: total spend for that category in the selected month
- `shareOfTotal`: percentage of total spend contributed by the category
- `rank` or `isTopCategory`: optional service-provided metadata that explicitly identifies the dominant category when the UX requires a stronger visual emphasis without frontend re-ranking

If the current mocked service contract does not already expose a dominant-category signal, the contract must be extended before UI implementation proceeds; the frontend must not infer the leading category by sorting or comparing amounts in React Native.

### TransactionSummary

- `id`: stable transaction identifier
- `date`: transaction date within the selected month
- `description`: user-facing description or merchant label
- `amount`: transaction value
- `category`: associated spending category

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

- `totalSpending` must equal the sum of all category totals for the selected month.
- `comparisonDifference` must equal `selectedMonthTotal - previousMonthTotal`.
- `comparisonDirection` must be derived from the difference: increase, decrease, or no change.
- The transaction list must be a subset of the month’s transactions, prioritized according to the business rule defined in the spec.
- Category totals and transaction rows must remain consistent with the same selected month context.
- `availableMonths` must be service-provided and the UI must never infer the navigation boundaries by inspecting transaction values.
- An empty month is a valid state and must remain navigable; an unavailable period is not a service error and must not be confused with an empty month.

## State transitions

- A user selects a month: the dashboard loads the matching summary and updates visible comparison data.
- A user navigates to another month: the summary, category breakdown, and transaction list refresh for the new month.
- A month without data: the dashboard remains informative and uses an explicit empty-state representation while retaining navigation controls to a populated month.
- A month outside the available data range: the dashboard prevents arbitrary navigation and shows a boundary message instead of showing misleading or fabricated data.
- A transport or service failure is distinct from an empty month and must be handled as an error state, not as normal financial response data.
