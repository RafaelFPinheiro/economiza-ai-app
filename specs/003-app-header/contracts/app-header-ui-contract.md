# App Header UI Contract

## Purpose

Define the shared presentation boundary between the app header and the screen that uses it. The header is optional and must not import feature data, services, or navigation state.

## Caller responsibilities

- Decide whether the header is shown on the current screen.
- Supply an optional title, optional back callback, an optional ordered collection of right-side actions, and an overflow callback when there are more than two actions.
- Provide the destination or interface behavior through callbacks.
- Ensure the screen's safe-area container applies the top inset exactly once.

## Header presentation responsibilities

- Display no back control when no back callback is supplied.
- Display the title, when supplied, immediately after the back control's area when that control is present.
- Keep the title on one line and truncate overflow with an ellipsis.
- Present at most the first two supplied right-side actions directly in their configured order, using the supplied icon and/or label.
- When more than two actions are supplied, display exactly one “...” overflow control in addition to the first two visible actions.
- Invoke the supplied overflow callback when the overflow control is activated. The consuming screen owns and presents the overflow menu, chooses its contents from the additional actions, and defines item behavior; the header does not render or define that menu.
- Use comfortable touch targets and expose clear accessible names; an icon-only action must have an accessible name.
- Invoke the callback for an activated control without adding navigation or feature-specific rules.
- Render within the safe area provided by its screen; it must not add a second top inset.
- Require the consuming screen to provide an overflow callback when more than two actions are supplied, so the overflow control remains actionable.

## Conceptual configuration

```text
AppHeader
  title?: text
  onBack?: callback
  actions?: [
    {
      icon?: presentational icon content
      label?: text
      accessibilityLabel?: text
      onPress: callback
    }
  ]
  onOverflowPress?: callback (required when actions.length > 2)
```

The conceptual shape describes the behavior boundary, not a finalized source-level type signature. Exact typing and icon representation are implementation details to settle while honoring this contract and the approved spec.
