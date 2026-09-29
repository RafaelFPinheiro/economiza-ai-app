# Implementation Plan: Monthly Spending Dashboard

**Branch**: `001-monthly-spending-dashboard` | **Date**: 2026-09-26 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-monthly-spending-dashboard/spec.md`

## Summary

The feature delivers a frontend-only monthly account-movement dashboard for EconomizAI. It shows the selected month’s result/balance provided by the backend, the previous-month comparison, category aggregations for categorized transactions, and the full account-activity transaction list for the selected month, including both income and expense entries, while using mocked service responses only. Transaction is the canonical domain concept; Expense and Income are both subtypes. The category breakdown remains a backend-derived aggregation of categorized transactions, while the transaction list covers the user’s month-long account activity rather than a limited subset of the largest expenses. The core architectural decision is to keep presentation behavior separate from the service contract boundary so the mocked implementation can later be replaced by a real API-backed service without requiring presentation-layer changes.

The current approved refinement for User Story 1 narrows the scope to a polished Brazilian personal-finance dashboard experience: Brazilian Portuguese labels, BRL formatting, explicit foreign-currency presentation when relevant, compact information hierarchy, and safe-area-aware mobile layout. The US2 clarification adds an explicit month-navigation layer for the same dashboard while keeping financial calculations and service responsibilities outside the frontend. The selected month remains a local UI interaction state, and navigation is bounded by the service-provided available range instead of arbitrary historical or future months.

## Technical Context

**Language/Version**: TypeScript with a React Native mobile app using Expo SDK 57.

**Primary Dependencies**: Expo, React Native, TypeScript, `react-native-safe-area-context`, and a minimal frontend validation setup for screen and service-contract checks.

**Storage**: N/A for this feature; data is mocked and delivered through service responses.

**Testing**: Frontend behavior and service-contract validation using a lightweight, project-appropriate TypeScript check; no backend or Open Finance integration is included in this feature.

**Target Platform**: Mobile application for iOS and Android through Expo, with proper safe-area behavior for iPhone status bar and bottom inset handling.

**Project Type**: Mobile app.

**Performance Goals**: Dashboard content should render promptly for a selected month and remain readable and lightweight on mobile devices while maintaining a compact financial-app layout.

**Constraints**: Frontend-only scope; mock service responses only; no real Open Finance integration; no authentication or database infrastructure; no duplication of backend financial business logic inside the mobile app; all user-facing text remains in PT-BR by default; BRL is the default presentation currency; safe-area handling is required for iOS; month navigation is bounded to the service-provided availability range; empty months remain distinct from unavailable periods; the dashboard shows monthly account movement and backend-provided result/balance, the transaction list includes both income and expense entries for the selected month, and category aggregations remain backend-derived rather than frontend-calculated; US3 remains explicitly out of scope.

**Scale/Scope**: Single feature focused on the monthly spending dashboard; no account management, budgeting, notifications, Open Finance connectivity, or arbitrary date browsing beyond the available mocked months.

**US2 local state note**: The month-selection state for US2 remains local to the dashboard screen and is passed to `useMonthlySpending(selectedMonth)`. The service layer remains responsible for exposing the set of available months and the frontend is responsible only for using that range to bound navigation and render the empty/unavailable states correctly.

## US2 Design Requirements

### Service contract: available months

US2 introduces a minimal service contract for month availability. The service layer is the source of truth for the available historical range and must expose a simple operation equivalent to `getAvailableMonths()` that returns an ordered list of months, for example `["2026-07", "2026-08", "2026-09"]`. The mock dataset must explicitly support this real-world case: `2026-07` is available with data, `2026-08` is included in `availableMonths` but returns an empty financial response, and `2026-09` is available with data. The frontend must not infer boundaries by looking at the values in `MonthlySpendingResponse` or by inspecting transaction totals.

## US3 Design Requirements

### Interpretation via backend-provided aggregates

US3 remains a presentation-focused interpretation layer for the selected month, but its scope is limited to making the service-provided category totals and full account-activity list easier to understand. The frontend may emphasize the presentation of aggregated values and the service-defined list order, but it must not create ranking logic, select a transaction subset, or derive new financial meaning from raw rows.

The dashboard should help the user interpret the month’s composition and movement using the backend-prepared category shares and the complete account-activity list for the selected month. This preserves the product objective of quick understanding without introducing a ranked or filtered transaction panel in the frontend.

### Local month-selection state

The selected month is local interaction state owned by the dashboard screen, not part of the financial domain model. This state is used only to decide which month summary the UI should load and to determine whether the previous or next navigation control is enabled.

### Month navigator UI

The navigator must remain visible even when the selected month is empty. It should sit near the top of the dashboard and present the current month in a compact, mobile-friendly layout, for example `<< Setembro 2026 >>` or an equivalent PT-BR title treatment. The UI must remain consistent with the current US1 design and allow users to move among the available months without redesigning the overall dashboard. For the real-device problem we discovered, the flow must allow `July -> August -> September` where August is valid and empty, not a service failure.

### Empty month versus out-of-range period

US2 must model two distinct cases:

- Valid empty month: the month exists in the available list but the service returns an empty financial result. The dashboard shows the empty state while keeping the month navigator active so the user can move to another month with data.
- Out-of-range period: the requested month is not included in the available list. The app must prevent arbitrary navigation and show a clear PT-BR boundary message such as `Não existem dados disponíveis para períodos anteriores a julho de 2026.` as defensive handling, but this should not be the normal navigation flow when the user stays within the available dataset.

### Boundary behavior

The first available month disables the previous control and the last available month disables the next control. Navigation beyond the available range must not be allowed during normal use. The user should normally never navigate into June if July is the first available month, and should not navigate into October if September is the last available month. The UI should remain stable and explicit at both ends of the dataset, while empty months remain valid navigation stops instead of dead ends.

### Validation focus for US2

The validation plan for US2 focuses on whether navigation remains available for empty months, whether boundaries are enforced correctly, and whether the service contract remains the single source of truth for the months that can be navigated. The validation should include the current US1 states (loading, empty, error) without introducing new financial rules into the frontend. It must explicitly cover: September with data; navigating backward to August; August as a valid but empty month with month navigation still visible; navigating from August back to July; July as the first available month with the previous control disabled; navigating forward to September; September as the last available month with the next control disabled; no arbitrary navigation outside `availableMonths`; and the fact that an empty month is not a service failure. The monthly transaction list remains the full account activity for the selected month, not a spend-only filtered list.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- PASS: User value and privacy are preserved by keeping the dashboard focused on clear understanding of spending and by treating financial data as sensitive.
- PASS: The feature remains consistent with the mocked-data-first constitutional constraint and does not implement a real Open Finance connection.
- PASS: Architecture supports change and portability by separating business-facing data contracts from presentation behavior.
- PASS: Simplicity and maintainability are preserved by limiting scope to the monthly dashboard and avoiding unnecessary infrastructure or abstraction.
- PASS: Frontend behavior and service-contract validation are acceptable without creating backend or database infrastructure for this phase.
- PASS: The current US1 refinement remains within the defined product scope: PT-BR content, BRL presentation defaults, explicit foreign-currency display, safe-area-aware mobile layout, and no US2/US3 implementation.

## Project Structure

### Documentation (this feature)

```text
specs/001-monthly-spending-dashboard/
├── plan.md              # This file
├── research.md          # Research findings and decisions
├── data-model.md        # Domain/entity structure for dashboard data
├── quickstart.md        # Validation scenarios for this feature
├── contracts/           # Service contract documentation
├── spec.md              # Feature specification
└── tasks.md             # Future planning output for implementation tasks
```

### Source Code (repository root)

```text
app/
├── src/
│   ├── features/
│   │   └── monthly-spending/
│   │       ├── screens/
│   │       ├── components/
│   │       ├── hooks/
│   │       └── types/
│   ├── services/
│   │   ├── mocked/
│   │   └── contracts/
│   ├── navigation/
│   ├── state/
│   └── utils/
└── tests/
    ├── unit/
    └── integration/
```

**Structure Decision**: A single mobile application structure is the correct fit for this feature. The UI and interaction flow are concentrated in the monthly spending feature area, while the service contract and mocked data are isolated under the service layer so they can be replaced by real API-backed implementations later without affecting the presentation layer. The current US1 refinement does not alter this separation; it only improves the presentation, localization, and safe-area behavior for the existing dashboard flow.

## Complexity Tracking

> **No constitution violations require special justification for this feature.**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |

## Current Scope Guardrails

- The current approved work remains focused on the dashboard experience, with US2 clarified as the bounded month-navigation phase and US3 explicitly deferred.
- The frontend may manage local selected-month state for US2, but it must not infer the available date range from financial values or create global state.
- The service layer is the source of truth for monthly totals, category values, comparison values, transaction order, the list of available months, and the full account-activity list for the selected month.
- The frontend remains presentation-only, formatting values for PT-BR and BRL while preserving the service-provided business semantics.
- The category breakdown remains a spend-focused view; the transaction list is broader and includes both income and expense entries for the month.
- The screen must respect iOS safe areas without using device-specific or hardcoded status-bar workarounds.
- Empty months and unavailable periods are separate states and must be handled distinctly in the UI.
- No Open Finance, backend implementation, or unnecessary abstraction is introduced in this plan.
