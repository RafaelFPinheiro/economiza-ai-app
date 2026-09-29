# Quickstart: App Header Validation

This guide defines how to validate the implementation after it is built. No implementation is included in this planning artifact.

## Prerequisites

- Node.js and npm versions supported by the current Expo app.
- Dependencies installed in `app/`.
- A simulator or device with at least one narrow mobile viewport and safe-area insets.

## Validation scenarios

1. **Title-only header**: Render a header with a title and no actions. Confirm compact height, existing visual identity, and no empty control areas.
2. **Back plus title**: Supply a back callback and title. Confirm the back control appears, title starts immediately after its area, and activation invokes the supplied callback once.
3. **Trailing action collection**: Supply one or two actions with combinations of icon and label. Confirm configured order, comfortable targets, accessible names, and callback-only behavior.
4. **Overflow actions**: Supply at least three actions and the consumer's overflow callback. Confirm the header shows only the first two actions plus one “...” trigger. Activate it and confirm the consuming screen opens its own menu containing the remaining actions and controls their behavior.
5. **Optional header**: Render a screen without the header. Confirm there is no reserved header space.
6. **Safe area**: Review a device with a notch/status inset. Confirm content is below the top inset with no doubled padding.
7. **Narrow width and long text**: Use a long title with two visible actions and an overflow trigger on a narrow viewport. Confirm the title stays on one line with ellipsis, controls remain in bounds, and actions remain operable.
8. **Text scaling and accessibility**: Increase system text size and manually inspect accessible names and touch interactions for displayed controls and the overflow trigger.

## Commands

From `app/`, run the existing automated typecheck (mandatory):

```sh
npm run typecheck
```

Run the app with the repository's Expo workflow and manually perform the scenarios above on iOS and Android targets available to the team. Do not add a component-test framework or testing dependency solely for this feature.

## Expected result

Every scenario matches the feature acceptance criteria in [spec.md](spec.md), while business data, services, and feature behavior remain unaffected.
