# Quickstart: Monthly Spending Dashboard Validation

## Objective

Validate that the dashboard presents the selected month clearly, compares it with the previous month, and preserves a clear boundary between presentation and service data.

## Prerequisites

- An Expo-based mobile application shell is available for the feature.
- Mocked service responses are configured for the dashboard dataset.
- No real backend or Open Finance integration is enabled.

## Validation scenarios

### 1. Default month view

- Navigate to the dashboard for a month with available mocked data.
- Confirm the total spending value is visible.
- Confirm the previous-month comparison is visible and directional.
- Confirm the category breakdown is displayed.
- Confirm the transaction list is displayed and prioritized according to the defined business rule.

Expected result: all required summary sections are present and consistent for the selected month.

### 2. Month navigation

- Move to the previous and next month in the dataset.
- Confirm the dashboard updates to the newly selected month.
- Confirm the comparison values and category totals now correspond to the newly selected month.

Expected result: the selection and comparison remain consistent across month changes.

### 3. Empty or low-data month

- Select a month with limited data or zero transactions.
- Confirm the dashboard remains understandable and does not show misleading totals or comparison states.

Expected result: empty-state or low-data handling remains clear and informative.

### 4. Service replacement readiness

- Replace the mocked service implementation with a future API-backed service that returns the same contract shape.
- Confirm the presentation layer still renders the same user-facing behavior without changes to screen logic.

Expected result: UI remains stable because the service boundary is isolated from the presentation layer.
