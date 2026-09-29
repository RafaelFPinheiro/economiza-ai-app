# Tasks: Monthly Spending Dashboard

**Input**: Design documents from `/specs/001-monthly-spending-dashboard/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

**US1 refinement constraint**: The current refinement is limited to the existing User Story 1 implementation. Month navigation, US2, US3, backend integration, and new architecture layers remain out of scope unless the active phase explicitly includes US2 month navigation.

**Domain model note**: Transaction is the canonical concept for account movement. Income and Expense are both transaction types, and category aggregations may be used for either direction when the backend has categorized the transaction. User Story 1 covers only the current display of the selected/current mock month. It does not add month navigation or local month-selection state. User Story 2 introduces local month-selection state, bounded month navigation, and the logic that changes which month the dashboard displays. US2 navigation is constrained to the service-provided available month range and must keep empty months distinct from unavailable periods. Across all stories, the transaction section represents all account activity for the selected month, including both income and expense entries, while the category breakdown remains a backend-provided aggregation of categorized transactions.

**US2 planning note**: The US2 implementation must preserve the current US1 flow and add a month navigator that remains visible in empty and populated months. The service layer owns the list of available months; the screen owns selected-month state; the UI must disable navigation at the valid boundaries and not treat out-of-range navigation as a service error.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establish the mobile app structure for the dashboard and shared service boundary.

- [X] T001 Create the Expo-based mobile app structure in `app/src` with feature folders for `monthly-spending`, shared service contracts, and navigation placeholders.
- [X] T002 Create the base TypeScript app configuration and project entry files required for the feature under `app/`.
- [X] T003 [P] Confirm the shared directory layout for service contracts, mocked service data, and UI feature modules under `app/src/services`, `app/src/features/monthly-spending`, and `app/src/navigation`.
- [X] T004 [P] Confirm the initial dashboard screen and mock service boundaries under `app/src/features/monthly-spending/` and `app/src/services/` without creating redundant abstractions.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish the boundaries that all user stories depend on without introducing backend or Open Finance work.

**Checkpoint**: Foundation ready - user story implementation can begin in parallel.

- [X] T005 Define the service contract for `MonthlySpendingResponse` in `app/src/services/contracts/monthlySpendingContract.ts` so the mock response matches the backend-facing data model and keeps the frontend presentation layer decoupled from mock internals.
- [X] T006 Implement the mocked monthly spending dataset and mock service adapter in `app/src/services/mocked/monthlySpendingService.ts` to return month totals, category totals, comparison values, and transaction lists for the selected month.
- [X] T007 [P] Define the dashboard data types in `app/src/features/monthly-spending/types.ts` to represent month summary, category totals, transaction list, and empty/error states, while keeping financial calculations outside the UI layer.
- [X] T008 [P] Create the dashboard error and empty-state contract handling in `app/src/features/monthly-spending/state.ts` so a month without financial data and a transport/service failure are represented as distinct states.
- [X] T009 Confirm the feature boundary in `app/src/features/monthly-spending/` so the screen consumes backend-prepared values and business rules remain outside the React Native presentation layer.

---

## Phase 3: User Story 1 - View monthly spending at a glance (Priority: P1) 🎯 MVP

**Goal**: Deliver the core monthly dashboard view showing total spend, comparison, category breakdown, and key transactions for the selected month.

**Independent Test**: A user can open the dashboard for a valid month and confirm that a total spending value, previous-month comparison, category list, and relevant transaction summary are all displayed and internally consistent.

### Implementation for User Story 1

- [X] T010 [P] [US1] Create the monthly dashboard screen shell in `app/src/features/monthly-spending/screens/MonthlySpendingScreen.tsx` to host the summary, comparison, category, and transaction views.
- [X] T011 [P] [US1] Create the summary and comparison presentation block in `app/src/features/monthly-spending/components/SpendingSummary.tsx` to render the selected month total and the previous-month delta as a directional change and numeric difference.
- [X] T012 [P] [US1] Create the category breakdown presentation in `app/src/features/monthly-spending/components/CategoryBreakdown.tsx` to render category totals and their relative contribution to the selected month.
- [X] T013 [P] [US1] Create the transaction list presentation in `app/src/features/monthly-spending/components/TransactionList.tsx` to render the complete account-activity list for the selected month, including both income and expense entries, with the service-defined ordering and pagination rules applied to that full list rather than to a filtered spend-only subset.
- [X] T014 [US1] Implement the service-to-screen data flow in `app/src/features/monthly-spending/hooks/useMonthlySpending.ts` so the screen reads the backend-prepared `MonthlySpendingResponse` and presents it without duplicating business logic in the UI layer.
- [X] T015 [US1] Add the empty-state and failure-state handling in `app/src/features/monthly-spending/screens/MonthlySpendingScreen.tsx` so a month with no financial data and a failed service request are represented as distinct and user-safe states.
- [X] T016 [US1] Validate contract-consistency and presentation behavior in `app/src/features/monthly-spending/screens/MonthlySpendingScreen.tsx` and related UI components by confirming that values from the mocked backend contract are rendered correctly, empty and error states are distinct, and no frontend recalculation is performed.
- [X] T017 [US1] Confirm the dashboard renders the required month view and summary information from the mocked dataset in the screen entrypoint without expanding scope beyond the dashboard.
- [X] T017A [US1] Verify all user-facing labels and mocked financial descriptions in `app/src/features/monthly-spending/` and `app/src/services/mocked/` are written in Brazilian Portuguese and that no English user-facing labels remain in the current US1 dashboard view.
- [X] T017B [US1] Validate BRL presentation and foreign-currency handling in `app/src/features/monthly-spending/components/` and `app/src/services/mocked/` so amounts use Brazilian formatting such as `R$ 2.860,50`, and any mocked transaction using a non-BRL currency explicitly displays its original currency instead of silently converting it to BRL. This must remain true for both expense and income entries when the service includes mixed-direction account activity.
- [ ] T017C [US1] Confirm iOS safe-area compliance in `app/src/features/monthly-spending/screens/MonthlySpendingScreen.tsx` and related layout components so content does not overlap the status bar and bottom content respects the safe area insets.

### US1 refinement checklist

- [ ] PT-BR presentation: `T017A`
- [ ] BRL currency formatting: `T017B`
- [ ] Explicit foreign-currency display: `T017B`
- [ ] iOS safe-area handling: `T017C`
- [ ] No month navigation in US1: enforced by the US1 scope note above and kept out of `T018-T022`

**Checkpoint**: At this point, User Story 1 should be fully functional, independently testable, and limited to the current selected/current mock month without month navigation.

---

## Phase 4: User Story 2 - Navigate among months (Priority: P1)

**Goal**: Enable users to move between months while preserving a coherent selected-month context and comparison state.

**Independent Test**: A user can navigate to another month and verify that summary, category totals, comparison, and transaction list all update to the newly selected month.

### Implementation for User Story 2

**US2 responsibility**: This phase builds on the existing `MonthlySpendingScreen` and `useMonthlySpending` implementation from US1. It introduces local month-selection state, month navigation, and the behavior that changes the month displayed by the dashboard. These responsibilities remain exclusively in US2 and are not part of US1.

**Mocked available-month dataset for US2**: The mock service must support a valid empty-month scenario in the available range: `2026-07` has data, `2026-08` is included in `availableMonths` but returns an empty financial response, and `2026-09` has data. The user should be able to navigate `July -> August -> September`, with August showing the empty state while keeping the month navigator visible and allowing navigation back to July or forward to September.

- [X] T018 [P] [US2] Keep the month navigation state in `app/src/features/monthly-spending/screens/MonthlySpendingScreen.tsx` or a minimal local hook limited to selected month, loading, empty, and error UI states, and constrain the UI to the service-provided available month range; no global state management is introduced.
- [X] T019 [P] [US2] Add month navigation controls to the screen in `app/src/features/monthly-spending/components/MonthNavigator.tsx` to move between adjacent months while keeping the dashboard aligned with the selected month and preventing navigation beyond the available dataset.
- [X] T020 [US2] Update the screen data flow in `app/src/features/monthly-spending/screens/MonthlySpendingScreen.tsx` so month selection triggers the correct mocked service response and refreshes the dashboard summary and transaction list for the newly selected month.
- [X] T021 [US2] Validate presentation and contract behavior in `app/src/features/monthly-spending/screens/MonthlySpendingScreen.tsx` by confirming that the selected month updates the rendered values from the backend contract, the comparison value is displayed as provided, and empty/error states remain distinct without frontend recalculation. The transaction list must still represent the full account activity for the month, including both income and expense entries.
- [X] T022 [US2] Handle empty and unavailable months separately in `app/src/features/monthly-spending/components/MonthNavigator.tsx` or the screen so a valid empty month keeps navigation available and a month outside the available dataset shows a clear boundary message without being treated as a service failure.

**Checkpoint**: At this point, User Story 1 must be complete and User Story 2 should build on that existing screen and hook flow in sequence, not as an independent implementation.

**US2 validation requirements**:

A. September with data is visible and valid.
B. The user can navigate backward from September to August.
C. August is a valid month in `availableMonths` but returns an empty financial response.
D. The empty state remains visible while the month navigator stays enabled.
E. The user can navigate from August back to July.
F. July is the first available month and the previous navigation control is disabled.
G. The user can navigate forward from July to September.
H. September is the last available month and the next navigation control is disabled.
I. No arbitrary navigation outside `availableMonths` is allowed.
J. An empty month is not treated as a service failure.

---

## Phase 5: User Story 3 - Understand monthly patterns from aggregated data (Priority: P2)

**Goal**: Make it easy for users to understand the main pattern of the selected month from the data prepared by the service, without creating new frontend ranking or transaction-selection logic.

**Independent Test**: A user can interpret the month’s category composition and account movement from the service-provided aggregates and the complete transaction list without needing to inspect raw data manually.

### Implementation for User Story 3

**Clarified US3 requirement**: The implementation must improve interpretability at a glance using backend-provided category totals, shares, and the full month account activity. The UI may emphasize the presentation of aggregated data, but it must not create ranking, re-aggregation, or transaction subset logic in the frontend.

- [ ] T023 [P] [US3] Present the category breakdown in `app/src/features/monthly-spending/components/CategoryBreakdown.tsx` using service-provided totals and shares so the user can understand the composition of the month without frontend-derived ranking or category selection.
- [ ] T024 [P] [US3] Present the full account-activity list in `app/src/features/monthly-spending/components/TransactionList.tsx` using the service-defined order, without building a ranked or selected subset in the frontend.
- [ ] T025 [US3] Validate the contract and presentation flow in `app/src/features/monthly-spending/screens/MonthlySpendingScreen.tsx` and related components to confirm that category values, list order, and comparison values still come from the service response and no financial recalculation has been introduced.
- [ ] T026 [US3] Ensure the dashboard remains understandable for low-data, uneven-distribution, and empty-month scenarios in `app/src/features/monthly-spending/screens/MonthlySpendingScreen.tsx` by preserving the existing empty-state and navigation behavior and keeping the category/transaction presentation readable without new rule logic.
- [ ] T027 [US3] Review the feature flow and scope compliance in `app/src/features/monthly-spending/` so the dashboard remains limited to monthly account-activity review, no new product areas are introduced, and the service contract remains the single source of truth for interpretation metadata.

**Checkpoint**: US3 is not accepted until the category composition and monthly account activity are validated on-device and the service contract remains the source of truth.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Finalize behavior, consistency, and validation without broadening the feature scope.

- [ ] T028 [P] Run the quickstart validation scenarios from `specs/001-monthly-spending-dashboard/quickstart.md` to confirm the selected month, previous-month comparison, category totals, and transaction subset/order are coherently presented for a normal month and for edge-case months.
- [ ] T029 Review the service and presentation boundary in `app/src/services/` and `app/src/features/monthly-spending/` to confirm the UI consumes backend-prepared values, does not include duplicate financial logic, and remains understandable and trustworthy in the mocked-data version without external integrations.
- [ ] T030 [P] Review the dashboard for empty-state, failure-state, low-spending, uneven-category, and navigation edge cases in `app/src/features/monthly-spending/screens/MonthlySpendingScreen.tsx` and the related components so SC-004 is satisfied and the feature remains clear and trustworthy.
- [ ] T031 Finalize the feature documentation and notes in `app/src/features/monthly-spending/` to keep the architecture defined as mock-data-first with a clear migration path to backend service contracts and to confirm the dashboard remains understandable and trustworthy for the initial mocked-data version as required by SC-005.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion - blocks all user stories.
- **User Stories (Phase 3+)**: Depend on Foundational completion.
- **Polish (Final Phase)**: Depends on all desired user stories being complete.

### User Story Dependencies

- **Foundational**: Must complete before any user story begins.
- **User Story 1 (P1)**: Starts after Foundational and establishes the base dashboard screen and `useMonthlySpending` flow.
- **User Story 2 (P1)**: Starts only after US1 is complete and builds on the existing `MonthlySpendingScreen` and `useMonthlySpending` implementation; it does not proceed independently from the already implemented US1 screen.
- **User Story 3 (P2)**: Can start after Foundational and may depend on the shared dashboard layout but must remain independently verifiable.

### Parallel Opportunities

- Setup tasks T003 and T004 can run in parallel.
- Foundational tasks T007 and T008 can run in parallel.
- Story 1 tasks T010 through T013 can be implemented in parallel if the screen assembly is coordinated.
- Story 2 tasks T018 and T019 can be developed in parallel.
- Story 3 tasks T023 and T024 can proceed in parallel.
- Final validation tasks T028 and T030 can run in parallel.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational.
3. Complete Phase 3: User Story 1.
4. Stop and validate the dashboard's core monthly summary and transaction content.

### Incremental Delivery

1. Setup + Foundation ready.
2. Add User Story 1 -> validate dashboard summary and key transactions.
3. Add User Story 2 -> validate month navigation and comparison updates.
4. Add User Story 3 -> validate category and transaction prioritization.
5. Final polish and validation.

---

## Notes

- [P] tasks = different files, no dependencies.
- [Story] label maps task to a specific user story for traceability.
- Tasks remain limited to the Monthly Spending Dashboard feature and do not add account management, Open Finance connectivity, or other product areas.
- The architecture keeps backend-prepared financial values separate from frontend presentation concerns.
- Validation should confirm the mocked dataset supports the monthly view without introducing real service integrations.
