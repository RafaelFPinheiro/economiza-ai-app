# Data Model: App Header

This feature introduces no persisted data or domain entities. Its configuration is transient presentation input supplied by the screen rendering the header.

## Header Configuration

Represents the optional presentation choices for one screen.

| Field | Shape | Required | Rules |
|---|---|---:|---|
| `title` | Text | No | If present, display as one line; truncate overflow with an ellipsis. |
| `onBack` | Callback | No | If absent, do not display a back control. If present, invoke it when the back control is activated. |
| `actions` | Ordered collection of Header Action | No | If absent or empty, do not display a right-side action area. Display at most the first two directly. |
| `onOverflowPress` | Callback | Conditional | Required when more than two actions are supplied. Opens overflow UI owned and defined by the consuming screen. |

## Header Action

Represents one interface or navigation affordance supplied by the screen.

| Field | Shape | Required | Rules |
|---|---|---:|---|
| `icon` | Presentational icon content | No | May be provided with or without a label. |
| `label` | Text | No | May be provided with or without an icon. |
| `accessibilityLabel` | Text | Conditional | Required when the visible label does not provide a clear accessible name, especially for icon-only actions. |
| `onPress` | Callback | Yes | Invoked on activation; domain and navigation behavior remain caller-owned. |

### Relationships and lifecycle

- One screen may provide zero or one Header Configuration by choosing whether to render the component.
- One Header Configuration may contain zero or more Header Actions.
- At most the first two actions are displayed directly; remaining actions are available to the consuming screen for its overflow menu. When overflow exists, the header displays one trigger and invokes `onOverflowPress`.
- Configuration and actions exist only for the rendered UI and are not persisted.
- No relationship exists to expense, transaction, or monthly-spending domain entities.
