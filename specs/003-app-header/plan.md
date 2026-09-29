# Implementation Plan: App Header

**Branch**: `[003-app-header]` | **Date**: 2026-09-28 | **Spec**: [spec.md](spec.md)

**Input**: Approved feature specification from `specs/003-app-header/spec.md`

## Summary

Add one optional, shared presentation component for screen titles, an explicitly supplied back action, and a collection of right-side actions. Place it outside feature modules and keep navigation callbacks owned by the screen or `App.tsx`. Reuse the app's existing React Native primitives and visual conventions; do not add a UI framework, icon dependency, design-token layer, or feature-specific behavior for this component.

## Technical Context

**Language/Version**: TypeScript 6.0.3; React 19.2.3; React Native 0.86.3 (from `app/package.json`)

**Primary Dependencies**: React Native primitives; `react-native-safe-area-context` 5.7.0 already used by screens

**Storage**: N/A

**Validation**: Manually validate rendering, interactions, callbacks, accessibility, Safe Area, and visual behavior using `quickstart.md`. Run the existing `npm run typecheck` from `app/` as the mandatory automated check. Do not add a component-test framework or testing dependency for this feature.

**Target Platform**: iOS and Android mobile app; Expo project

**Project Type**: Mobile application

**Performance Goals**: Lightweight presentation component; no measurable performance budget specified by the feature

**Constraints**: Mobile-first compact single-line title with ellipsis; shared header must not own navigation or financial rules; safe-area inset must be applied once; right-side actions need an accessible name and operable touch target; preserve existing visual conventions and avoid duplicate token definitions.

**Scale/Scope**: One shared header component, adopted selectively by screens; no change to services, financial data models, or business rules.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. User-Value First**: PASS — provides consistent, compact screen context and optional navigation/interface actions.
- **II. Privacy, Security & Responsible Data Handling**: PASS — no data collection, persistence, telemetry, or financial data access.
- **III. Test-First Delivery**: PASS — specification acceptance scenarios are explicit and the implementation phase should verify each component behavior before considering it complete.
- **IV. Architecture for Change and Portability**: PASS — shared presentation stays independent of feature modules and receives callbacks from its caller.
- **V. Simplicity & Maintainability**: PASS — one shared component and a small configuration contract; no added library or generalized design system.
- **Platform constraints**: PASS — stays within the current React Native/TypeScript application and uses existing safe-area ownership.

## Project Structure

### Documentation (this feature)

```text
specs/003-app-header/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── app-header-ui-contract.md
└── tasks.md                 # Created by $speckit-tasks, not this plan
```

### Source Code (repository root)

```text
app/src/
├── shared/
│   └── ui/
│       └── AppHeader.tsx    # Shared presentation component and its small public types
└── features/
    ├── expenses/            # Existing feature screens; callers remain owners of actions
    └── monthly-spending/    # Existing feature screens; callers remain owners of actions
```

**Structure Decision**: The source tree has feature-specific `components/` directories but no shared UI directory. Add the minimal `app/src/shared/ui/` boundary for cross-feature presentation. Keep the component and small API types together initially; a separate type or style-token package would add indirection without an existing shared system to integrate with. The implementation may adopt the header in selected screens as a later task, with callbacks wired by existing screen owners; this plan does not require changing every screen.

## Design Decisions

- Keep opt-in at the screen composition boundary: a screen renders the component when needed and omits it otherwise.
- Keep navigation ownership with existing callers. A missing back callback means no back control; callbacks are forwarded without inspecting route or domain state.
- Represent trailing actions as a collection of presentation data and callbacks. Each action can show an icon, a label, or both; icon-only actions require an accessible name. Show at most the first two directly. With more than two, show one “...” control that invokes a callback supplied by the consuming screen; that screen owns the overflow menu, its contents, and item behavior.
- Place the title immediately after the back control area when a back control exists. Constrain it to one line and use native text ellipsizing so the header remains compact.
- Let the screen's existing safe-area container own the top inset. The shared header is laid out within that safe area and does not add another top inset. Any opting-in screen that currently uses a different safe-area arrangement must preserve one top inset during integration.
- Use existing colors, spacing, and typography conventions as a starting point. Since no shared token module exists, do not introduce one only for the header; agree any exact dimensions during implementation review against neighboring screens.
- Use the app's existing UI primitives for back/action affordances unless later implementation evidence shows an existing shared icon system. Do not add an icon dependency for this feature.

## Constitution Check (Post-Design)

- **User value, privacy, platform fit, and separation of concerns**: PASS — this is presentation-only and has no storage or service boundary.
- **Test-first and maintainability**: PASS — behavior maps to explicit acceptance criteria, which will be manually checked using the quickstart; the existing typecheck is mandatory automated validation. No test framework or dependency will be added.
- **Unjustified complexity**: NONE — no new library, global provider, theme/token system, or navigation abstraction is introduced.

## Complexity Tracking

No constitution violations or added complexity require justification.
