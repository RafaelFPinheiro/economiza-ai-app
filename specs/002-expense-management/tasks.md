# Tasks: Expense Management

**Input**: Design documents from `/specs/002-expense-management/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establish the feature module structure and shared expense-service boundaries without introducing unnecessary abstractions.

- [X] T001 Create the expense feature module structure under `app/src/features/expenses/` with `screens`, `components`, `hooks`, `forms`, and `types` directories aligned to the current monthly-spending architecture.
- [X] T002 [P] Create the shared expense type definitions in `app/src/features/expenses/types.ts` for `Expense`, `ExpenseCategory`, `ExpenseForm`, `ExpenseListEntry`, and the local empty/error/loading state model used by the UI.
- [X] T003 [P] Create the expense service contract in `app/src/services/contracts/expenseContract.ts` to define the mocked operations for list, get, create, update, delete, and category lookup.
- [X] T004 [P] Create the mock expense service in `app/src/services/mocked/expenseService.ts` with predefined category data and mocked CRUD operations using the current service-boundary pattern.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish the foundational expense data model and validation contract that all user stories depend on.

**Checkpoint**: Foundation ready - user story implementation can begin in parallel.

- [X] T005 Define the default category list and `categoryId` mapping in `app/src/features/expenses/constants.ts` and ensure it matches the PT-BR categories required by the spec without introducing category CRUD capabilities.
- [X] T006 Define the expense validation rules in `app/src/features/expenses/forms/expenseValidation.ts` for required description, valid numeric amount, supported currencies (BRL, USD, EUR), valid date, and valid `categoryId`, reflecting the requirement that the frontend validates input but does not own financial business logic. Traceability: FR-004, FR-022.
- [X] T007 [P] Create the BRL/PT-BR formatting helpers in `app/src/features/expenses/utils/formatters.ts` so amounts render as `R$ 284,90`, foreign currencies remain explicitly labeled, and no silent conversion is performed. Traceability: FR-004, FR-022.
- [X] T008 [P] Create the empty, loading, and service-error state model in `app/src/features/expenses/state.ts` so an empty expense list is a valid state distinct from a service failure.
- [X] T009 Confirm the expense feature remains isolated from dashboard aggregation logic in `app/src/features/expenses/` and `app/src/services/` and does not duplicate monthly financial-business rules or category totals outside the dashboard.

---

## Phase 3: User Story 1 - View and review expenses (Priority: P1) 🎯 MVP

**Goal**: Deliver a functional expense list and detail experience so users can view existing expenses and access the core record review flow.

**Independent Test**: A user can open the expense area, see the list or empty state, select an expense, and view the record details without needing any other feature to work.

### Tests for User Story 1

- [X] T010 [P] [US1] Add a list-view validation test in `app/tests/expense-list.test.ts` covering the empty state, PT-BR display, and list rendering from the mocked service contract.
- [X] T011 [P] [US1] Add a detail-view validation test in `app/tests/expense-detail.test.ts` covering selection from the list, detail rendering, and consistent category/date/amount display.

### Implementation for User Story 1

- [X] T012 [P] [US1] Create the expense list screen shell in `app/src/features/expenses/screens/ExpenseListScreen.tsx` to host the list view and empty/error state handling.
- [X] T013 [P] [US1] Create the expense list row component in `app/src/features/expenses/components/ExpenseListItem.tsx` to render description, date, category, and amount in the required PT-BR format.
- [X] T014 [US1] Implement the expense list data flow in `app/src/features/expenses/hooks/useExpenses.ts` to load the mocked list response and separate empty, loading, and error states.
- [X] T015 [US1] Create the expense detail screen in `app/src/features/expenses/screens/ExpenseDetailScreen.tsx` to show a single expense’s description, amount, currency, date, and category without altering dashboard business rules.
- [X] T016 [US1] Wire the expense list to the detail screen in `app/src/features/expenses/screens/ExpenseListScreen.tsx` so users can open an expense for viewing or editing.
- [X] T017 [US1] Validate the expense list and detail experience in `app/src/features/expenses/` to confirm the empty state, BRL formatting, and currency labeling match the spec and do not mix service errors with a valid empty list.

**Checkpoint**: At this point, User Story 1 should be fully functional and independently testable.

---

## Phase 4: User Story 2 - Create and edit expenses (Priority: P1)

**Goal**: Enable users to create a valid expense and edit existing ones, including category-only corrections.

**Independent Test**: A user can add a new expense and then edit an existing one without recreating the record, and invalid form values are rejected with clear PT-BR validation feedback.

### Tests for User Story 2

- [X] T018 [P] [US2] Add a create-expense validation test in `app/tests/expense-create.test.ts` covering valid save, invalid description/amount/date/category cases, and default BRL behavior.
- [X] T019 [P] [US2] Add an edit-expense validation test in `app/tests/expense-edit.test.ts` covering field updates, category-only correction, and save validation.

### Implementation for User Story 2

- [X] T020 [P] [US2] Create the expense form component in `app/src/features/expenses/forms/ExpenseForm.tsx` to support the required fields: description, amount, date, category, and currency.
- [X] T021 [US2] Create the add-expense screen in `app/src/features/expenses/screens/CreateExpenseScreen.tsx` so the user can submit a valid manual expense through the mocked service contract.
- [X] T022 [US2] Create the edit-expense screen in `app/src/features/expenses/screens/EditExpenseScreen.tsx` so the user can modify existing expenses without recreating them.
- [X] T023 [US2] Implement the create/update save flow in `app/src/features/expenses/hooks/useExpenseForm.ts` so the screen sends the validated payload to the mock service and handles contract-level success/error states.
- [X] T024 [US2] Connect the form to category selection in `app/src/features/expenses/forms/ExpenseForm.tsx` using `categoryId` and the service-provided category list so category correction remains a valid edit action without category CRUD.
- [X] T025 [US2] Validate PT-BR validation messaging and currency handling in `app/src/features/expenses/` to confirm BRL is the default, USD or EUR can be selected, and non-BRL entries remain explicitly labeled with the original currency. Traceability: FR-004, FR-022.

**Checkpoint**: At this point, User Story 2 should allow full create/edit flows and category correction without expanding beyond the approved scope.

---

## Phase 5: User Story 3 - Delete expenses safely (Priority: P1)

**Goal**: Ensure destructive expense removal is deliberate, safe, and visible to the user.

**Independent Test**: A user can start delete flow, confirm deletion, and see the item disappear from the list; canceling the flow leaves the item intact.

### Tests for User Story 3

- [X] T026 [P] [US3] Add a delete confirmation test in `app/tests/expense-delete.test.ts` covering confirm, cancel, and final list removal behavior.

### Implementation for User Story 3

- [X] T027 [P] [US3] Add a confirmation interaction in `app/src/features/expenses/components/DeleteExpenseDialog.tsx` or the equivalent screen-level confirmation flow before any delete action is executed.
- [X] T028 [US3] Wire the delete action to the mocked service in `app/src/features/expenses/hooks/useExpenseActions.ts` so a confirmed delete removes the expense from the list and updates the list UI without exposing mock-data access to the screen.
- [X] T029 [US3] Validate the deletion flow in `app/src/features/expenses/screens/ExpenseDetailScreen.tsx` and the list screen to confirm the record disappears only after confirmation and that canceling the action preserves the item.

**Checkpoint**: At this point, the user can safely create, edit, and delete expenses within the approved scope.

---

## Phase 6: User Story 4 - Correct category assignment quickly (Priority: P2)

**Goal**: Make category correction a low-friction, explicit edit workflow that does not require recreating the expense record.

**Independent Test**: A user can open a miscategorized expense, change only the `categoryId`, save, and see the updated category in the list and detail views.

### Tests for User Story 4

- [X] T030 [P] [US4] Add a category-correction validation test in `app/tests/expense-category-correction.test.ts` covering category-only update, list reflect, and no category CRUD behavior.

### Implementation for User Story 4

- [X] T031 [P] [US4] Ensure the edit form in `app/src/features/expenses/forms/ExpenseForm.tsx` supports category-only updates without forcing the user to re-enter all fields.
- [X] T032 [US4] Confirm the category selection data flow in `app/src/features/expenses/hooks/useExpenseForm.ts` writes the selected `categoryId` back to the expense record through the mock service and not by embedding raw category names in the expense payload.
- [X] T033 [US4] Validate the correction workflow in `app/src/features/expenses/screens/EditExpenseScreen.tsx` to confirm the list and detail view reflect the corrected category while keeping the category-management feature out of scope.

**Checkpoint**: The category correction workflow is complete and remains within the boundaries of manual expense management.

---

## Phase 7: Navigation and Cross-Cutting Integration

**Purpose**: Connect the expense flow into the app’s current navigation model while preserving the existing Dashboard responsibilities.

- [ ] T034 [P] Review and update the tab/navigation entry points in `app/src/navigation/` so the dashboard and expense list are reachable without over-specifying the exact tab architecture beyond the product direction.
- [ ] T035 [P] Add the new expense entry action in the relevant navigation or screen-level entry point under `app/src/navigation/` or `app/src/features/expenses/` to support quick creation while keeping the flow consistent with the product direction.
- [ ] T036 [P] Validate the expense navigation flow across `app/src/features/monthly-spending/` and `app/src/features/expenses/` to ensure the existing Monthly Spending Dashboard remains functional and unaffected.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and consistency pass before implementation is considered ready.

- [ ] T037 [P] Run the validation scenarios from `specs/002-expense-management/quickstart.md` to confirm list, create, edit, category correction, delete confirmation, empty state, and currency handling all behave consistently. Traceability: FR-004, FR-022.
- [ ] T038 Review the expense service boundary in `app/src/services/` and `app/src/features/expenses/` to confirm the UI reads mock data through the service contract and does not directly access mock datasets.
- [ ] T039 Review the form and amount display logic in `app/src/features/expenses/` to confirm PT-BR labels, BRL defaults, supported foreign-currency display (BRL, USD, EUR), and validation errors remain aligned across create/edit use cases. Traceability: FR-004, FR-022.
- [ ] T040 Finalize the feature documentation and notes in `specs/002-expense-management/` to keep the scope bounded and the architecture aligned with the current mocked-data pattern without introducing unsupported product areas.
- [X] T041 [P] Documentation consistency: confirm the transaction list is documented as a compact statement-style `Transaction` ledger, not card-based expense items, and that it never implies category grouping or category-count metadata. Traceability: FR-027.
- [ ] T042 [P] [US1] Refine the transaction list UI to match a bank-statement style: remove individual cards, use continuous rows with subtle horizontal dividers, maintain comfortable lateral spacing, keep a dense but readable layout, and show date, description, category, and value in a consistent ledger layout while visually differentiating income and expense without grouping by category or showing category-admin metadata. Traceability: FR-027.
- [X] T043 [P] [US1] Improve the Transaction detail/edit screen navigation and action layout: remove the bottom "Voltar" action, add a top-left back navigation action with the existing back behavior, keep only "Editar" and "Excluir" in the lower action area, preserve the confirmation flow for delete, respect Safe Area, maintain the screen title, and keep the existing app visual style without changing business rules, contracts, or feature scope. Traceability: FR-005, FR-015, FR-027.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion - blocks all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational completion.
- **User Story 2 (Phase 4)**: Depends on Foundational completion and can proceed independently from US1 if needed.
- **User Story 3 (Phase 5)**: Depends on Foundational completion and the expense list/detail flow from US1.
- **User Story 4 (Phase 6)**: Depends on the edit form and category selection work from US2.
- **Navigation & Cross-Cutting (Phase 7)**: Depends on story-level flows being complete.
- **Polish (Phase 8)**: Depends on all desired stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Requires foundational types and service contract; no dependency on other stories.
- **User Story 2 (P1)**: Requires foundational validation layer and the expense service contract; can be built after US1 or in parallel with a focused dependency on shared data model files.
- **User Story 3 (P1)**: Depends on the list/detail flow and validation model introduced in US1 and US2.
- **User Story 4 (P2)**: Depends on the edit form from US2 and should be treated as an extension of the same flow.

### Parallel Opportunities

- Setup tasks T002, T003, and T004 can run in parallel.
- Foundational tasks T006, T007, and T008 can run in parallel.
- User Story 1 tasks T010, T011, T012, and T013 can run in parallel once the foundational phase is complete.
- User Story 2 tasks T018 and T019 can run in parallel, while T020, T021, and T022 also proceed in parallel with shared form coordination.
- User Story 3 tasks T026 and T027 can run in parallel.
- User Story 4 tasks T030 and T031 can run in parallel.
- Final validation tasks T037 and T039 can run in parallel.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational.
3. Complete Phase 3: User Story 1.
4. Stop and validate the core expense list and detail experience.

### Incremental Delivery

1. Setup + foundation ready.
2. Add User Story 1 -> validate list and detail display.
3. Add User Story 2 -> validate create and edit flows including category correction.
4. Add User Story 3 -> validate safe deletion.
5. Add User Story 4 -> validate category-only correction and list integrity.
6. Integration + polish.

---

## Notes

- [P] tasks = different files, no dependencies.
- [Story] labels map tasks to specific user stories for traceability.
- Each user story remains independently testable and can be validated without opening the full product scope.
- Tests are included because feature validation is explicitly requested for create, edit, delete, and category correction flows.
- Expense data remains mocked only, with the UI responsible for presentation, input validation, formatting, and interaction while the mock service remains the source of truth for CRUD behavior.
- Category CRUD remains explicitly outside scope and must not be introduced during implementation.
