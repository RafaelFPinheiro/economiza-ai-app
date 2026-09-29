# Research: Expense Management

## Decision: Expense management stays in a dedicated feature module

**Decision**: Create a dedicated `expenses` feature module beside the existing `monthly-spending` feature folder. Handle list, detail, creation, editing, and deletion within that module while keeping the dashboard feature independent.

**Rationale**: The application already uses a capability-first feature structure. A separate expense module keeps responsibilities clear and aligns with the current architecture used by Feature 001.

**Alternatives considered**: Integrating expense functions into the dashboard screen or creating a shared cross-feature store; both were rejected as unnecessary complexity and a risk to the existing architecture.

## Decision: Mocked service remains the single source of truth for expense data

**Decision**: The mock expense service will expose CRUD operations and category metadata through a service contract. The UI will not read the mock dataset directly.

**Rationale**: This is the canonical architecture already established by the dashboard feature and preserves a clean replacement path for future backend integration.

**Alternatives considered**: Direct local array access in the screen or hook layer; rejected because it couples UI directly to mock data and weakens future service portability.

## Decision: BRL remains the default but other currencies are supported explicitly

**Decision**: New expenses default to BRL, but the user can select another supported currency from a controlled list. Any non-BRL amount must retain the original currency explicitly in the UI and contract.

**Rationale**: The project’s existing product language and formatting conventions are PT-BR and BRL, while the data model still needs to allow explicit foreign-currency expenses without converting them silently.

**Alternatives considered**: Forcing all expense values to BRL or silently converting at presentation time; both were rejected because they hide important currency context and violate the product requirement.

## Decision: Empty list is a valid state, not an error

**Decision**: An empty expense list is treated as a legitimate state with an empty-state message. It must be clearly separated from an actual service or API error.

**Rationale**: A new user may legitimately have no expenses yet, and the app should not mislabel this as a technical issue.

**Alternatives considered**: Mapping the empty list to the same error handling as a failed service call; rejected because it leads to misleading user messaging and poor trust in the feature.

## Decision: Category assignment remains a field on the expense, not category management

**Decision**: Expense category is selected from a predefined category list using `categoryId`. This feature does not provide category CRUD, reordering, or editing.

**Rationale**: The requirement explicitly excludes category administration and keeps the perimeter of this release narrow and testable.

**Alternatives considered**: Including category CRUD in the same release; rejected because it changes scope and creates an extra product area outside the request.

## Decision: Bottom navigation remains a product-level arrangement, not a required implementation detail

**Decision**: The app should support navigation between the dashboard and expense area via the product’s intended bottom-tab pattern, but the exact tab layout and labels remain a planning decision instead of hardcoded product specification.

**Rationale**: The specification requires navigation access without over-specifying the exact architecture; this preserves product flexibility while matching the app’s existing direction.

**Alternatives considered**: Hardcoding a specific navigation configuration in the specification; rejected because it would overconstrain planning and implementation.

## Open decisions to review before tasks

- The final supported foreign currency list should be confirmed (for example, BRL + USD + EUR, or a broader set if product standards require it).
- The exact tab layout and route naming for the dashboard-to-expense flow can be finalized in planning without affecting the overall feature scope.
- The final list and form copy should be aligned with the established PT-BR styling conventions to keep the experience consistent with Feature 001.
