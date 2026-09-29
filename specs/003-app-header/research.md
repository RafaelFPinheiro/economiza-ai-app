# Research: App Header

**Date**: 2026-09-28
**Scope**: Resolve implementation choices using the approved spec and current repository architecture only.

## Decision: Place the component in a shared UI layer

**Decision**: Add `app/src/shared/ui/AppHeader.tsx`.

**Rationale**: Existing reusable components are nested under `app/src/features/<feature>/components/`. The app has no shared UI directory, and the header must be reusable across feature boundaries. A small shared UI folder provides the required boundary with minimal structural change.

**Alternatives considered**:
- Put the header under `features/expenses/components/`: rejected because it would make a generic component depend conceptually on one feature.
- Add a UI package or a large component library: rejected because the app has no existing shared library and the feature needs one compact component.

## Decision: Keep navigation behavior with the caller

**Decision**: The component receives an optional back callback and action callbacks. Screens or `App.tsx` continue to decide the destination and operation.

**Rationale**: `app/App.tsx` currently owns screen selection and passes callbacks into feature screens. `ExpenseDetailScreen` already exposes `onBack`, and `ExpenseListScreen` exposes `onCreate`; this is an established low-coupling pattern.

**Alternatives considered**:
- Read current screen or feature state inside the header: rejected because this violates feature independence and duplicates navigation ownership.
- Add a new navigation provider: rejected because the existing app routes screens directly in `App.tsx` and the header only needs callbacks.

## Decision: Let the screen own safe-area insets

**Decision**: Render the header inside the screen's current safe-area content and do not calculate or add a second top inset in the component.

**Rationale**: Existing feature screens wrap their content in `SafeAreaView` from `react-native-safe-area-context` with top and bottom edges. Keeping this ownership avoids duplicate inset handling and avoids introducing safe-area logic into a presentation component that does not own the screen shell.

**Alternatives considered**:
- Have the header consume top insets itself: rejected because current screens already apply the top edge; this would require splitting screen safe-area handling and increases integration surface.
- Move all app screens to a global safe-area shell: rejected as out of scope and broader than the approved feature.

## Decision: Keep action configuration small and extensible

**Decision**: Accept an optional ordered array of action descriptors, each containing icon and/or label presentation, an accessible name where needed, and an activation callback. Display at most the first two directly. If more are supplied, display one overflow trigger whose callback is supplied by the consumer; the consumer defines and renders the overflow menu using the remaining actions. Do not add feature identifiers or domain payloads.

**Rationale**: The approved spec requires an action collection and compact behavior on narrow screens. Limiting direct controls to two preserves room for the title; a consumer-owned overflow callback keeps menu contents and behavior out of the shared component.

**Alternatives considered**:
- Support only a single right-side callback: rejected because it prevents the collection requested in the approved clarification.
- Have the shared header render and define the overflow menu: rejected because the consumer must own menu content and behavior.
- Accept arbitrary screen-owned right-side layout content: rejected because it weakens the shared component's responsibility to present consistent actions.
- Add a command/event registry: rejected as unnecessary abstraction for the current screens.

## Decision: Reuse existing styles and platform primitives

**Decision**: Use current React Native primitives and recurring app values as implementation references; do not introduce a design-token framework or icon dependency in this feature.

**Rationale**: Existing screens repeat `#101828`, `#475467`, background colors, and 16-point horizontal spacing in local styles. `App.tsx` and `MonthNavigator.tsx` use `Pressable` controls, 42-point minimum dimensions, and/or hit slop as touch-target references. Screen titles commonly use 28/700, but that value may be too tall for this compact header; preserve the palette and spacing conventions while selecting a compact title size during implementation review. No shared token module or icon package appears in the source tree or `app/package.json`.

**Alternatives considered**:
- Create shared tokens while adding the header: rejected because it expands the scope from one shared component to a design-system migration.
- Add an icon package: rejected because the approved scope does not require a new dependency and existing UI uses React Native text and controls.

## Decision: Validate manually and run the existing typecheck

**Decision**: Manually review callback behavior, accessibility, safe-area handling, and visual behavior using the quickstart scenarios. Run the existing app typecheck as the required automated check. Do not add a component-test framework or test dependency for this feature.

**Rationale**: The user explicitly chose manual behavior/layout validation and the existing typecheck as the automated gate. The repository has no component-test framework, and adding one solely for this UI component would expand scope unnecessarily.

**Alternatives considered**:
- Add a component-test framework and automated rendering harness: rejected because it was explicitly excluded for this feature.

## Resolved Unknowns

- No unresolved technical choices block implementation planning. Title alignment, two directly visible actions, consumer-owned overflow, manual UI validation, and single-line ellipsis behavior are specified in the approved feature spec.
- Exact dimensions and typography values remain visual tuning against existing screens, not architectural unknowns; follow established app values and preserve the compact-height acceptance criterion.
