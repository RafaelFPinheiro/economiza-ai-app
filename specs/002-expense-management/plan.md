# Implementation Plan: Expense Management

**Branch**: `002-expense-management` | **Date**: 2026-09-27 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/002-expense-management/spec.md`

## Summary

This feature adds a frontend-only expense management flow for EconomizAI. It extends the existing React Native + TypeScript + Expo app with a dedicated expense experience that preserves the current Monthly Spending Dashboard while adding manual expense review, creation, editing, category correction, and safe deletion. The architecture follows the established pattern used by Feature 001: a mock service provides the data contract, the UI consumes that contract, and the frontend is responsible only for presentation, validation, and formatting.

The feature is intentionally limited to expense CRUD and category selection. It does not introduce Open Finance, backend storage, authentication, budget logic, recurring expense handling, or advanced filtering/search. The result is a focused manual-expense module that remains portable to future real integrations without forcing the current UI layer to own financial domain logic.

## Technical Context

**Language/Version**: TypeScript with a React Native mobile app using Expo SDK 57.

**Primary Dependencies**: Expo, React Native, TypeScript, existing safe-area support, and the current service-boundary conventions established by the dashboard module.

**Storage**: N/A for this feature; expenses are mocked and provided through a service contract so the frontend remains decoupled from data access details.

**Testing**: Project-appropriate frontend validation for empty/error states, input validation, service contract expectations, and basic screen flow checks. The feature does not introduce a backend or external service integration.

**Target Platform**: Mobile application for iOS and Android through Expo, respecting current app conventions and the safe-area patterns already used by the dashboard.

**Project Type**: Mobile app.

**Performance Goals**: Expense list and form interactions should feel immediate on-device, with low-latency list rendering and clear validation feedback without introducing unnecessary abstraction or state complexity.

**Constraints**: Frontend-only scope; mock responses only; no real Open Finance; no database or backend; no category CRUD; no business-logic duplication for dashboard aggregation; PT-BR labels required; BRL default currency; explicit identification of foreign currencies without silent conversion; confirmation before deletion; list empty state must be distinct from service failure.

**Scale/Scope**: Single feature focused on expense management, built on top of the existing dashboard module and within the current mocked-data architecture.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- PASS: User value is preserved by making manual expense tracking clear, safe, and corrective without adding complexity beyond the stated product need.
- PASS: Privacy and sensitivity are respected by keeping the feature frontend-only and not introducing real banking or external account integration.
- PASS: The architecture remains portable because expense data flows through a mocked service contract and presentation logic remains separate from mock data and future service replacement.
- PASS: Simplicity and maintainability are preserved by keeping the feature scoped to CRUD flows, category selection, validation, and safe deletion.
- PASS: The design avoids adding backend infrastructure, database storage, or real integrations in conflict with the constitution and existing project constraints.
- PASS: The feature stays aligned with the existing PT-BR and BRL conventions already established in the app.

## Project Structure

### Documentation (this feature)

```text
specs/002-expense-management/
├── plan.md              # This file
├── research.md          # Research findings and decisions
├── data-model.md        # Domain/entity structure for expense management
├── quickstart.md        # Validation scenarios for the feature
├── contracts/           # Service contract documentation for mocked expense operations
├── spec.md              # Feature specification
└── tasks.md             # Implementation task breakdown for the approved Expense Management scope
```

### Source Code (repository root)

```text
app/
├── src/
│   ├── features/
│   │   ├── monthly-spending/
│   │   └── expenses/
│   │       ├── screens/
│   │       ├── components/
│   │       ├── hooks/
│   │       ├── forms/
│   │       └── types/
│   ├── services/
│   │   ├── mocked/
│   │   │   └── expenseService.ts
│   │   └── contracts/
│   │       └── expenseContract.ts
│   ├── navigation/
│   ├── state/
│   └── utils/
└── tests/
    ├── unit/
    └── integration/
```

**Structure Decision**: The expense flow should live beside the existing monthly-spending feature area under a dedicated `expenses` feature module. This keeps the app organized by user-facing capability while preserving the current service-contract pattern and preventing a scrambled architecture that mixes feature logic with mock data details. The screen, hook, and form logic remain in the feature directory, while the mocked data source and contract live under `app/src/services`.

## Complexity Tracking

> **No constitution violations require special justification for this feature.**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |

## Phase 0: Research and Design Decisions

### Decision 1: Expense module boundary
The feature will be implemented as an expense module separated from the monthly dashboard module. The dashboard remains responsible for summary and monthly aggregation, while the new expense feature handles expense CRUD and category assignment.

**Rationale**: This preserves the current screen responsibility split and keeps financial aggregation outside the frontend layer.

**Alternatives considered**: Merging expense CRUD into the monthly dashboard screen or moving aggregation logic into the expense screens; both were rejected because they blur the current architectural boundary and duplicate dashboard responsibilities.

### Decision 2: Mock service as the data source of truth
Expense data, categories, and CRUD operations will be exposed through a mock service and a service contract. The UI will not reach into mock datasets directly.

**Rationale**: This matches the established pattern used by Feature 001 and supports a future swap to a real service without UI rewrites.

**Alternatives considered**: Direct dataset imports into screens or hooks; rejected because it breaks the current architecture and creates a hidden dependency on mock internals.

### Decision 3: Currency handling rules
A new expense defaults to BRL, but the user may choose another supported currency. Any non-BRL value must remain explicitly identified with its original currency label; the frontend must not silently convert amounts.

**Rationale**: This meets the product requirement for explicit foreign-currency visibility while preserving a simple default for the majority of entries.

**Alternatives considered**: Hidden conversion or always forcing BRL; rejected because it would hide currency context and conflict with the explicit requirement to preserve original currency information.

### Decision 4: Empty-state semantics
The expense list empty state is a valid, intentional state. It must be visually distinct from a service error state and must not be treated as a data error.

**Rationale**: This matches the requirement that an empty list is normal and that the UI should not misclassify empty data as a technical failure.

**Alternatives considered**: Treating an empty list as an error condition; rejected because it creates false alarms and weakens user trust in the app.

### Decision 5: Transaction list presentation as an account statement
The transaction list MUST be a compact, statement-like list of `Transaction` records rather than a card-based list of expense entries. It should use subtle dividers, show the transaction description, category, date, and value, and visually distinguish income from expense without any category grouping or administrative category-summary metadata.

**Rationale**: This preserves the product decision that the list represents actual account movement and improves scanability without turning the UI into a category dashboard.

**Alternatives considered**: Individual cards, grouped-by-category views, or row summaries that show category totals; rejected because these forms imply a category-centric presentation rather than a real transaction ledger.

### Decision 6: Bottom navigation architecture
The app should support navigation between the dashboard and expense area using the existing product direction toward a bottom-tab structure, without over-specifying exact tab content beyond the functional requirement to reach the dashboard, expense list, and new expense entry.

**Rationale**: This matches the product direction while leaving the precise tab layout as a planning decision rather than a hardcoded specification requirement.

**Alternatives considered**: Tall custom nav patterns or one-off screens; rejected because the app already points toward a simple, consistent tab structure and the feature should fit that direction.

## Phase 1: Design Artifacts

### Data model
The data model for this feature is defined in [data-model.md](data-model.md) and includes the `Expense` entity, category reference model, form model, and list-view representation. It also clarifies validation rules and the treatment of empty states and service errors.

### Service contract
The service contract is captured in [contracts/expense-service-contract.md](contracts/expense-service-contract.md). It defines the operations that the mock service must support: list expenses, get expense by id, create expense, update expense, delete expense, and provide available categories.

### Validation guide
The end-to-end feature validation guide is in [quickstart.md](quickstart.md). It covers the primary user journeys for list view, create, edit, category correction, delete confirmation, empty state, and currency behavior.

## Architectural Notes Before Tasks

- The exact set of supported foreign currencies should be confirmed before implementation, even though the requirement only requires explicit identification and no silent conversion.
- The final tab/navigation layout should be reviewed during planning to ensure it does not over-specify design while still supporting dashboard and expenses access.
- The app should continue to use the existing service-boundary pattern rather than introducing a second parallel architecture for expense data.
- Category correction must remain a form of expense editing and not expand into category CRUD in this feature.
- The final list-view and form UX should preserve PT-BR copy and BRL formatting without adding unnecessary complexity or product scope.
