---
description: "Implementation task list for App Header"
---

# Tasks: App Header

**Input**: Design documents from `/specs/003-app-header/`

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md), [data-model.md](data-model.md), [UI contract](contracts/app-header-ui-contract.md), [quickstart.md](quickstart.md)

**Validation**: Interaction, callbacks, accessibility, Safe Area, and visual behavior are checked manually using the quickstart. The existing `npm run typecheck` is mandatory automated validation. Do not add a component-test framework or testing dependency for this feature.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Parallelizable work in separate files with no incomplete dependency.
- **[Story]**: Maps a task to a user story in `spec.md`.
- Each task names the source file(s) it changes.

## Path Conventions

- Mobile app source: `app/src/`
- Feature screens: `app/src/features/<feature>/screens/`
- Shared presentation components: `app/src/shared/ui/`

## Phase 1: Setup

**Purpose**: Project initialization and basic structure.

No project or dependency initialization is required. The Expo app already exists; the shared UI location is established in US1.

## Phase 2: Foundational

**Purpose**: Blocking infrastructure required before user stories.

No separate foundational work is needed. This feature adds no dependencies, persistence, navigation framework, or global provider.

## Phase 3: User Story 1 - See a consistent screen heading (Priority: P1) 🎯 MVP

**Goal**: Provide an optional shared compact title header and use it in representative Monthly Spending and Expenses screens.

**Independent Manual Validation**: Render opted-in and non-opted-in screens; confirm consistent compact title presentation, no empty controls, exactly one top safe-area inset, and one-line ellipsis for long titles.

### Implementation for User Story 1

- [X] T001 [US1] Create `AppHeader` and its small public configuration types in `app/src/shared/ui/AppHeader.tsx`; support an optional title, compact single-line layout, ellipsis truncation, existing app color/spacing conventions, and layout inside the caller-owned safe area.
- [X] T002 [P] [US1] Replace the repeated “Gastos do mês” heading with `AppHeader` in every render state of `app/src/features/monthly-spending/screens/MonthlySpendingScreen.tsx`; retain one top safe-area inset and remove the duplicate local title style.
- [X] T003 [P] [US1] Replace the page heading with `AppHeader` in `app/src/features/expenses/screens/CreateExpenseScreen.tsx`; retain the screen's existing safe-area ownership and avoid reserving the old heading space twice.
- [X] T004 [P] [US1] Replace the page heading with `AppHeader` in `app/src/features/expenses/screens/EditExpenseScreen.tsx`; retain the screen's existing safe-area ownership and avoid reserving the old heading space twice.

**Checkpoint**: Dashboard and expense form screens can use the same title header without feature-specific implementations.

## Phase 4: User Story 2 - Navigate back when the screen provides that action (Priority: P1)

**Goal**: Show a back control only when a caller supplies a callback and align the title immediately after its control area.

**Independent Manual Validation**: Activate the detail screen's back control and confirm its existing callback returns to the transaction list; confirm a screen without a callback has no back control.

### Implementation for User Story 2

- [X] T005 [US2] Add the optional left-side back callback/control to `app/src/shared/ui/AppHeader.tsx` and replace the separate “← Voltar” link and local title in `app/src/features/expenses/screens/ExpenseDetailScreen.tsx` with `AppHeader`; preserve the existing `onBack` callback and place the title immediately after the back control area.

**Checkpoint**: Detail screens can provide back navigation while screens without a callback have no back affordance.

## Phase 5: User Story 3 - Use optional screen-level actions (Priority: P2)

**Goal**: Present a configurable collection of right-side actions with supplied icon and/or label, accessible name, and caller-owned callback; show no more than two actions directly and delegate overflow menu ownership to the consuming screen.

**Independent Manual Validation**: Confirm the transaction list displays “Nova” through the shared header and activation invokes the existing create callback. With three or more configured actions, confirm that only the first two and one “...” trigger are displayed and that the trigger calls the consumer-owned overflow callback; confirm screens without actions show no right-side controls.

### Implementation for User Story 3

- [X] T006 [US3] Extend `app/src/shared/ui/AppHeader.tsx` with an optional ordered action collection and consumer-supplied overflow callback; display at most the first two actions plus one “...” trigger when additional actions exist, invoke only supplied callbacks, and leave the overflow menu and its items to the consumer.
- [X] T007 [US3] Replace the title/action row with `AppHeader` in `app/src/features/expenses/screens/ExpenseListScreen.tsx`; configure “Nova” as a right-side action using the existing `onCreate` callback and remove duplicate local title/action presentation styles.

**Checkpoint**: The transaction list action is presented by the shared component and remains owned by its screen callback.

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Confirm the integrated header remains compact, accessible, safe-area correct, and visually consistent.

- [ ] T008 Manually review integrations in `app/src/shared/ui/AppHeader.tsx`, `app/src/features/monthly-spending/screens/MonthlySpendingScreen.tsx`, `app/src/features/expenses/screens/CreateExpenseScreen.tsx`, `app/src/features/expenses/screens/EditExpenseScreen.tsx`, `app/src/features/expenses/screens/ExpenseDetailScreen.tsx`, and `app/src/features/expenses/screens/ExpenseListScreen.tsx` using `specs/003-app-header/quickstart.md`; resolve duplicated top insets, clipped titles/actions, overflow behavior, inaccessible action names, or inconsistent shared styling.
- [X] T009 Run the mandatory existing `npm run typecheck` script from `app/package.json` in `app/` after header integrations and resolve resulting type errors.

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No separate tasks; app setup already exists.
- **Foundational (Phase 2)**: No separate tasks; the shared component foundation is delivered in US1.
- **US1 (Phase 3)**: Starts immediately. T002–T004 depend on T001 and can run in parallel with one another.
- **US2 (Phase 4)**: Depends on T001; add back support before migrating the detail screen.
- **US3 (Phase 5)**: Depends on T001; extend the component, then migrate the transaction list action.
- **Polish (Phase 6)**: Depends on all screen integrations T002–T007.

### User Story Dependencies

- **US1 (P1)**: No story dependency; creates the shared title header and adopts it in title-only screens.
- **US2 (P1)**: Requires the US1 component and focuses on the detail-screen back flow.
- **US3 (P2)**: Requires the US1 component. Its API change shares `AppHeader.tsx` with US2, so execute after T005 to avoid conflicting edits; the behaviors are otherwise independent.

### Parallel Opportunities

- After T001, T002, T003, and T004 can run in parallel because they modify separate screen files.
- T005 and T006 both modify `AppHeader.tsx`; run them sequentially.
- T007 follows T006 because the transaction list needs the action collection API.
- T008 and T009 follow all screen integration tasks.

## Parallel Example: User Story 1

```text
After T001 completes:
Task: T002 — integrate AppHeader in MonthlySpendingScreen.tsx
Task: T003 — integrate AppHeader in CreateExpenseScreen.tsx
Task: T004 — integrate AppHeader in EditExpenseScreen.tsx
```

## Implementation Strategy

### MVP First (User Story 1)

1. Complete T001 to establish the shared title header.
2. Complete T002–T004 to use it in title-only screens across both feature areas.
3. Review the US1 independent test criteria and quickstart scenarios.
4. Add optional back support (US2), then action collection and transaction-list integration (US3).

### Incremental Delivery

1. Deliver the reusable title-only header in Monthly Spending and expense form screens.
2. Add explicit back flow to the expense detail screen.
3. Add configurable right-side actions and migrate “Nova” in the expense list.
4. Complete cross-screen review and typecheck.

## Notes

- `[P]` tasks use different files and may run concurrently only after their dependencies are complete.
- No service, financial model, navigation framework, or dependency changes are in scope.
- No dedicated tests were requested in the approved spec; validation scenarios are in `specs/003-app-header/quickstart.md`.
- T008 remains open for an unobstructed device interaction review: the iOS build succeeded and the initial screen was visible, but a first-launch confirmation dialog blocked the remaining scenarios and macOS denied UI scripting access.
