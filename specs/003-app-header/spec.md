# Feature Specification: App Header

**Feature Branch**: `[003-app-header]`

**Created**: 2026-09-28

**Status**: Draft

**Input**: User description: "Create a reusable, optional, mobile-first App Header for EconomizAI, with an optional title, optional back action on the left, and optional right-side UI/navigation actions. Keep it independent of product features and consistent with existing app patterns. Specification only; do not implement yet."

## Project Context and Existing Patterns

- The app is a mobile application currently organized by feature under `app/src/features/`; the root `App.tsx` owns screen selection and bottom-tab navigation.
- There is no established shared UI component or token directory in the current source tree. Screens define their own `StyleSheet` values, with recurring colors such as `#F4F7FB`, `#101828`, `#344054`, and `#475467`, and horizontal spacing commonly set to 16.
- Screens currently use `SafeAreaView` from the safe-area package and generally handle the top edge at screen level. The header must integrate with that existing responsibility without adding the top inset twice.
- Existing screen titles are usually 28px bold and sit in scrollable content. The expense detail screen has a text “← Voltar” link before its title, while the transaction list places a “Nova” action alongside its title. The dashboard has a title without a back action.
- Navigation callbacks are passed from `App.tsx` into screens. Shared header actions therefore need to invoke callbacks supplied by the screen/navigation owner and must not implement navigation or feature rules themselves.
- The new component belongs to shared UI, outside `features/`. No implementation files, financial contracts, or models are in scope for this specification.

## Clarifications

### Session 2026-09-28

- Q1: When both a back action and a title are shown, should the title begin after the back control (left aligned) or remain centered in the available header width? **Answer**: The title is left aligned immediately after the back control's area.
- Q2: How should a screen provide right-side actions: a small collection of labeled/icon actions with callbacks, or a single flexible action-content area supplied by the screen? **Answer**: A screen supplies a collection of actions, each with an icon and/or label and a callback. The header presents the actions and handles their interaction without implementing feature rules.
- Q3: What should happen to a long title on narrow screens or when right-side actions occupy space: truncate to one line or wrap to a second line? **Answer**: Keep the title on one line and truncate it with an ellipsis, preserving the header's compact, consistent height.
- Q4: How should the header handle more than two right-side actions on a narrow screen? **Answer**: Show at most the first two actions directly and a single “...” overflow action. The consuming screen supplies the callback and owns the overflow menu, its contents, and the behavior of its items; the header only presents the trigger and invokes that callback.
- Q5: How should interaction, accessibility, Safe Area, and visual behavior be validated? **Answer**: Validate these manually against `quickstart.md`, without adding a component-test framework or dependency for this feature. The existing `npm run typecheck` remains mandatory automated validation.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - See a consistent screen heading (Priority: P1)

As a user moving between app areas, I want screens that opt in to share a compact, familiar heading, so I can identify the current screen without each area presenting a different navigation bar.

**Why this priority**: A consistent heading is the core value of this shared UI feature.

**Independent Test**: Open opted-in screens with different titles and confirm each heading follows the same visual hierarchy, spacing, and safe-area placement.

**Acceptance Scenarios**:

1. **Given** a screen opts into the shared header and supplies a title, **When** the screen appears, **Then** the title is displayed with consistent alignment, readable contrast, and compact vertical use; when a back control is present, the title begins immediately after its area.
2. **Given** a screen does not opt into the shared header, **When** it appears, **Then** no header space or header controls are shown.
3. **Given** the device has a display cutout or system status area, **When** a screen with the header appears, **Then** the header content is not obscured and the top safe-area inset is applied exactly once.

### User Story 2 - Navigate back when the screen provides that action (Priority: P1)

As a user on a screen with a parent destination, I want an optional back control to be available when that screen supplies a back action.

**Why this priority**: Back navigation is common but does not apply to top-level destinations, so its presence must be explicit per screen.

**Independent Test**: Display one header with a supplied back callback and another without; confirm the first invokes its callback and the second does not reserve or show an active back control.

**Acceptance Scenarios**:

1. **Given** a screen supplies a back action, **When** the user activates the left-side control, **Then** the supplied callback is invoked once.
2. **Given** a screen does not supply a back action, **When** its header is rendered, **Then** no back control is displayed and the header does not imply that back navigation is available.

### User Story 3 - Use optional screen-level actions (Priority: P2)

As a user, I want relevant interface actions to appear on the right side of some headers, so common screen controls are easy to find without embedding feature behavior in shared UI.

**Why this priority**: Right-side actions support existing patterns such as the transaction list’s “Nova” action and allow future screens to reuse the header.

**Independent Test**: Supply a right-side action to a screen, activate it, and confirm only its screen-provided callback runs; render another screen without actions and confirm the action area is absent.

**Acceptance Scenarios**:

1. **Given** a screen supplies a collection of header actions, **When** the header appears, **Then** the actions are shown on the right with their supplied icons and/or labels, comfortable touch targets, and clear accessible names.
2. **Given** an action is activated, **When** its callback runs, **Then** the shared header does not perform feature-specific or financial operations.
3. **Given** a screen supplies no right-side actions, **When** its header appears, **Then** no decorative or disabled action controls are displayed.
4. **Given** a screen supplies more than two actions and an overflow callback, **When** the header appears, **Then** only the first two actions and one “...” control are shown directly; activating “...” invokes the consumer callback, which opens and controls its own menu for the remaining actions.

### Edge Cases

- On narrow displays, no more than two supplied actions appear directly; any additional actions are reached through the single consumer-owned overflow menu.
- When system text scaling increases title or action labels, the title remains one line and displayed controls remain operable.
- The containing screen owns safe-area inset handling, so the header must not add a duplicate top inset.
- Icon-only action and overflow controls have clear accessible names.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide one shared app header that can be used by screens in different product areas.
- **FR-002**: Each screen MUST be able to choose whether the shared header is displayed; screens that do not use it MUST NOT reserve header space.
- **FR-003**: A screen MUST be able to provide a title or omit it.
- **FR-003a**: When both a title and back action are present, the title MUST be left aligned immediately after the back control's area.
- **FR-003b**: A title MUST remain on one line and be truncated with an ellipsis when it exceeds the available width.
- **FR-004**: A screen MUST be able to provide a left-side back action or omit it; the header MUST NOT infer that every screen has a parent destination.
- **FR-005**: A screen MUST be able to provide an optional ordered collection of right-side interface actions or omit them; each action MUST support a supplied icon and/or label and an activation callback.
- **FR-005a**: The header MUST display at most the first two supplied right-side actions directly. When more than two actions are supplied, it MUST display exactly one “...” overflow action in addition to those first two.
- **FR-005b**: When overflow is present, the consuming screen MUST provide the overflow callback and MUST own the overflow menu, its contents, and the behavior of its items. The header MUST invoke the supplied callback and MUST NOT render or define feature-specific overflow menu content.
- **FR-006**: Header actions MUST invoke behavior supplied by the screen or its navigation owner and MUST NOT contain product-feature or financial business rules.
- **FR-007**: The shared header MUST remain independent of Expenses, Monthly Spending, and other feature-specific data, contracts, or models.
- **FR-008**: The header MUST respect device safe areas without causing the top inset to be applied more than once.
- **FR-009**: The header MUST use a compact layout, clear title/action hierarchy, consistent alignment and spacing, and touch targets suitable for mobile use.
- **FR-010**: The header MUST preserve the existing visual identity by reusing project styling conventions and shared values where available; it MUST NOT introduce arbitrary decorative treatments or card-like framing.
- **FR-011**: The header MUST remain readable and operable across supported screen widths and accommodate accessibility text scaling.
- **FR-011a**: On narrow screens, title truncation MUST preserve a single-line title and the compact, consistent header height while keeping supplied actions operable.
- **FR-012**: The right-side action area MUST support future interface actions through the same collection and overflow callback without duplicating the header or coupling it to feature-specific rules.
- **FR-013**: This feature MUST NOT alter business rules, service contracts, or financial data models.

### Key Entities

- **Header Configuration**: Per-screen presentation choices consisting of an optional title, optional back action, and optional right-side actions.
- **Header Action**: A screen-provided user-interface or navigation affordance with an accessible name and an activation callback; it contains no domain behavior.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All screens in the app can opt into or omit the shared header without maintaining a separate header implementation for each screen.
- **SC-002**: In review of every supported device size, the title and actions remain within the screen bounds and are not obscured by system safe areas.
- **SC-003**: Every displayed action can be activated using its visible touch target and has an accessible name.
- **SC-003a**: With more than two configured right-side actions, only the first two and one overflow control appear in the header; activating overflow invokes the screen-provided callback, and the screen controls the menu content and item behavior.
- **SC-004**: A screen with no supplied back action or right-side actions displays no corresponding controls.
- **SC-005**: Header action activation invokes the screen-provided callback and does not change feature data or perform domain operations within the shared header.
- **SC-006**: Existing shared visual values and conventions are reused where available, with no duplicated shared token set introduced solely for the header.

## Assumptions

- The app remains mobile-first, with React Native screens and screen-level navigation ownership as currently structured.
- The header is a shared presentation component, while each screen decides whether to render it and supplies its content and callbacks.
- Safe-area ownership will be coordinated between the screen and the header during planning so the top inset is handled once.
- Current source files do not show an established shared design-token system; if one is introduced before implementation, the header will consume it rather than duplicating values.
- UX decisions about title alignment, right-side actions, long titles, overflow, and validation approach are resolved above. Exact dimensions and typography values will be adjusted during implementation against existing app patterns and the compact-height requirement.
