# Feature Specification: Monthly Spending Dashboard

**Feature Branch**: `[001-monthly-spending-dashboard]`

**Created**: 2026-09-26

**Status**: Draft

**Input**: User description: "Create the initial monthly spending dashboard for EconomizAI. The goal is to allow users to understand the account movement for a selected month at a glance. The dashboard should display: the monthly result/balance provided by the backend; comparison with the previous month; category aggregations for the selected month; the selected month and the ability to navigate between months; and the complete account-activity transaction list defined by the backend contract for the selected month. For this initial version, all financial data must come from mocked data. No real Open Finance integration should be implemented. The feature should focus on the user's experience and expected behavior, without prescribing specific React Native components, libraries, state management solutions, or implementation details."

## Clarifications

### Session 2026-09-27

- Q: What is the canonical domain concept for the dashboard? → A: Transaction is the canonical concept for account movement. Income and Expense are transaction types, and a transaction may carry a categoryId when categorized.
- Q: Should the transaction area show all account activity or only a ranked subset of spending? → A: The transaction section must represent all transactions for the selected month, including both money entering the account and money leaving the account; it is not a ranked or limited subset of spending.
- Q: How should US3 create a clearly noticeable improvement in a real device review? → A: The dashboard must make the dominant spending category visually obvious at a glance, show its relative share, and surface the highest-value expenses without requiring the user to inspect every row.
- Q: Can the frontend infer the dominant category or transaction importance from raw values? → A: No. The service contract must remain the source of truth for category ordering, top-category emphasis, or equivalent metadata; the frontend may only present the supplied hierarchy.
- Q: How should incomplete or low-data US3 states be treated before acceptance? → A: US3 is accepted only when the dashboard remains understandable for low-data, uneven distributions, and empty months without new business logic or altered navigation behavior.
- Q: Should T023-T027 be considered complete before validation? → A: No. Their completion status is provisional until the observable user outcomes above are confirmed on-device; the tasks must remain review-ready until acceptance.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View monthly spending at a glance (Priority: P1)
A user opens the monthly spending dashboard for a selected month and immediately understands how much they spent, how that compares to the previous month, and which spending categories contribute most to the total.

**Why this priority**: This is the core value of the feature. If the user cannot quickly understand their monthly spending, the dashboard does not deliver the intended purpose.

**Independent Test**: This can be fully tested by selecting a month with mocked spending data and checking whether the summary, comparison, category view, and transaction list are all present and consistent.

**Acceptance Scenarios**:

1. **Given** the user has selected a month with available mocked data, **When** the dashboard loads, **Then** the total spending for that month is shown clearly and the user can quickly understand the overall spending level.
2. **Given** the user is viewing a month with a previous month available in the dataset, **When** the dashboard renders the summary, **Then** the comparison with the previous month is visible and the system clearly indicates whether the selected month is higher or lower than the previous month, with the magnitude expressed as a value difference and a directional change.
3. **Given** the user has category-level spending data, **When** the dashboard displays the breakdown, **Then** spending is grouped by category and the relative contribution of each category is understandable.
4. **Given** the user is viewing a month with transactions, **When** the dashboard renders the transaction section, **Then** the list includes all account entries and exits for that month, subject to the service-defined list/pagination constraints, and the display remains easy to interpret for the selected month.

---

### User Story 2 - Navigate among months (Priority: P1)
A user needs to review different months without losing context and should be able to move backward or forward through the available mocked period while keeping the dashboard aligned to the selected month.

**Why this priority**: Planning and budgeting rely on comparing time periods, so month navigation is essential to the feature’s usefulness. This includes the ability to move from a month with no spending data back to a month with available data without losing context.

**Independent Test**: This can be tested by selecting a month, navigating to another valid month, and confirming the dashboard updates to the new month while preserving a coherent comparison. It also includes verifying that empty months remain navigable and that navigation is bounded by the available mocked range.

**Acceptance Scenarios**:

1. **Given** the user is viewing a valid month with available mocked data, **When** they navigate to the next or previous month within the available dataset, **Then** the dashboard updates to the newly selected month and reflects that month’s spending summary and transaction list.
2. **Given** the user is viewing a month that has no spending data, **When** they use the month navigation controls, **Then** the empty state remains visible and the navigation controls remain available so they can move to another month with data instead of being trapped in the empty month.
3. **Given** the user moves between months, **When** the comparison is recalculated, **Then** the previous month comparison is updated for the newly selected month and remains service-provided rather than reconstructed in the frontend.
4. **Given** the user attempts to navigate beyond the available mocked range, **When** the earliest or latest available month is reached, **Then** the system clearly communicates that no earlier or later data is available and prevents arbitrary navigation beyond the range.
5. **Given** the selected month is not available in the mocked dataset, **When** the user attempts to navigate to it, **Then** the system presents a clear, non-confusing state instead of misleading data.

---

### User Story 3 - Understand monthly patterns from aggregated data (Priority: P2)
A user wants to understand the main drivers of the month from the data prepared by the service so they can interpret the selected period quickly without inspecting every transaction manually.

**Why this priority**: This supports the user’s financial awareness and is a primary benefit of the dashboard, even though the summary view remains the primary objective. A successful US3 experience must make the overall monthly pattern obvious from the service-provided aggregates and full account activity rather than by creating new ranking logic in the frontend.

**Independent Test**: This can be tested by reviewing a month with multiple categories and confirming that the category breakdown and the complete account-activity list remain clear, consistent, and readable without any frontend ranking or transaction subset selection.

**Acceptance Scenarios**:

1. **Given** the user is viewing a month with multiple categories, **When** the dashboard presents the category breakdown, **Then** the category totals and shares are clear and understandable using the service-provided aggregation rather than any frontend-derived ranking.
2. **Given** the user wants to understand the month’s overall movement, **When** the transaction list is displayed, **Then** the full account-activity list remains the authoritative view and is shown in the service-defined order without any frontend subset selection, sorting, or re-ranking.
3. **Given** the user reviews a low-data or uneven-distribution month, **When** the dashboard renders the category and transaction views, **Then** the UI remains compact and readable without introducing new financial rules or breaking the existing US1/US2 navigation semantics.
4. **Given** the backend contract exposes category or transaction metadata intended to support interpretation, **When** the dashboard presents that information, **Then** it is shown as service-provided context and not transformed into new frontend business logic or a ranked subset.

---

### Edge Cases

- What happens when a selected month contains no spending transactions?
- How does the system handle a month for which there is no previous month comparison available?
- What happens when the mocked dataset includes categories with very low or zero totals?
- How does the system behave when users navigate repeatedly across months with different spending patterns?
- How should the UI behave when the user reaches the earliest or latest available month in the mocked dataset?
- What is the difference between an empty month and an unavailable month outside the service-provided range?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST allow users to select a month and view the account movement for that month.
- **FR-002**: The system MUST display the monthly result/balance for the selected month in a clear summary view, as provided by the backend/service contract.
- **FR-003**: The system MUST show how the selected month compares to the previous month, including whether the monthly result increased or decreased.
- **FR-004**: The system MUST show category aggregations derived from categorized transactions so users can understand the composition of account movements by category.
- **FR-005**: The system MUST present the monthly account activity for the selected month, including both income and expense entries, subject to the service-defined ordering and pagination constraints. This transaction list is not a ranked subset of spending; it is the complete set of account entries for the month, while the category breakdown remains a backend-provided aggregation of categorized transactions.
- **FR-006**: The system MUST display the selected month and enable navigation between the months that are available in the service-provided mocked dataset, with navigation bounded to that available range.
- **FR-007**: The system MUST use mocked financial data for the initial version and MUST NOT require a real Open Finance integration to fulfill the dashboard experience.
- **FR-008**: The dashboard MUST remain understandable and reliable even when the selected month has limited, zero, or uneven spending data.
- **FR-009**: The system MUST make it easy for users to interpret overall spending, changes over time, and major spending categories without requiring technical knowledge.
- **FR-010**: The system MUST show the previous-month comparison as a directional change and a numeric difference, where a higher total is treated as an increase and a lower total is treated as a decrease.
- **FR-011**: For the initial User Story 1 refinement, the dashboard MUST present all user-facing labels in Brazilian Portuguese and use BRL as the default currency format for amounts and related comparison text.
- **FR-012**: If a financial entry is represented in a non-BRL currency, the service-provided original currency information MUST be shown explicitly to the user without silent conversion in the frontend.
- **FR-013**: The current refinement scope remains limited to the User Story 1 dashboard experience unless this phase explicitly covers US2 month navigation; the dashboard MUST NOT implement additional user stories beyond the active scope.
- **FR-014**: If the selected month has no financial data, the dashboard MUST display an explicit empty-state message while preserving month navigation so the user can move to a month with available data.
- **FR-015**: If the user attempts to navigate beyond the available mocked data range, the dashboard MUST prevent arbitrary navigation and show a clear Brazilian Portuguese message indicating that the date range is unavailable.
- **FR-016**: User Story 3 MUST make the category breakdown easy to interpret at a glance by presenting the service-provided totals and shares without frontend-derived ranking, re-aggregation, or category selection logic.
- **FR-017**: User Story 3 MUST present the selected month’s account activity in a clear, scannable panel using the service-defined order, while the full list remains the complete monthly movement and must not be reduced to a ranked or selected subset by the frontend.
- **FR-018**: If the current mocked contract does not expose enough metadata to support the category interpretation UX without frontend business logic, the service contract MUST be updated before UI implementation proceeds.

### Key Entities *(include if feature involves data)*

- **Monthly Result Summary**: The result/balance for a selected month and the comparison against the previous month, as supplied by the backend/service layer.
- **Category Breakdown**: An aggregation of categorized transactions by category, provided by the backend/service layer rather than calculated in the frontend.
- **Transaction**: The canonical account movement entry associated with a date, amount, category reference, and type (`income` or `expense`). Expense and Income are both types of Transaction; the dashboard shows the account movement of the selected month, not only expense activity.
- **Month Period**: A specific month being reviewed, including the ability to navigate to adjacent periods.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: For any selected month with available mocked spending data, the dashboard renders a total spending value, a previous-month comparison, a category breakdown, and a transaction list without requiring the user to refresh or navigate away.
- **SC-002**: For any selected month with at least one category and at least one transaction, the user can understand the month’s category composition and overall movement from the service-provided aggregates and the complete account-activity list without reading every row or doing mental calculation.
- **SC-003**: For any valid month navigation action, the dashboard updates to the newly selected month and presents the correct comparison to the immediately preceding month in the dataset.
- **SC-004**: The dashboard remains usable and informative for months with low spending, no spending, or uneven category distribution.
- **SC-005**: The core monthly overview remains understandable and trustworthy in the initial mocked-data version without reliance on external financial integrations.
- **SC-006**: The dashboard must clearly communicate the selected month’s account activity in a compact, scannable panel using the service-defined ordering and pagination rules, with no frontend business logic used to select or prioritize the list beyond the service contract’s valid constraints.

## Assumptions

- Users are reviewing personal spending data for a specific month and expect a clear summary rather than raw transaction dumps.
- The initial version uses a representative mocked dataset that covers realistic spending patterns and common categories.
- A previous month comparison is available for most months in the seeded dataset, but not necessarily for every possible scenario.
- The dashboard is intended to support understanding, monitoring, and quick decision-making rather than detailed reconciliation or external data synchronization.
- The feature is scoped to user experience and expected behavior in the first release and does not include external financial connectivity.
