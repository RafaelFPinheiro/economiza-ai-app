# Feature Specification: Expense Management

**Feature Branch**: `[002-expense-management]`

**Created**: 2026-09-27

**Status**: Draft

**Input**: User description: "Create a new feature specification for EconomizAI: Feature 002: Expense Management. The goal is to allow users to manually manage their expenses in the application. This is the next product feature after the existing Monthly Spending Dashboard (Feature 001). IMPORTANT: This is specification only. Do NOT create implementation code. Do NOT create the plan yet. Do NOT create tasks yet. ..."

## Clarifications

### Session 2026-09-27

- Q: Which success criteria must remain objectively testable without a user study? → A: SC-005 was removed because it required a user-study style metric and is not testable within the project without external research.
- Q: What currencies are supported in the initial version? → A: The initial version supports BRL, USD, and EUR. BRL remains the default currency for new expenses, the user may select USD or EUR when creating or editing an expense, and the original currency must always be preserved and explicitly displayed without any silent conversion.
- Q: How should empty lists and service errors be distinguished? → A: An empty expense list is a valid empty state and must not be confused with a service or API error.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View and review expenses (Priority: P1)
A user wants to review all registered expense transactions for a period and understand what they spent, when they spent it, and how each outgoing transaction is categorized.

**Why this priority**: This is the foundational workflow for expense management. Without a clear, reliable view of existing expenses, the user cannot safely add, edit, or correct financial entries.

**Independent Test**: This can be tested by opening the transaction list and confirming that it behaves like a compact account statement, shows the required data points in Brazilian Portuguese, and allows users to open a specific transaction for further review or editing without category-grouping or card-based presentation.

**Acceptance Scenarios**:

1. **Given** the user opens the transaction area, **When** the list is displayed, **Then** it shows a compact statement-like list of account `Transaction` entries, with each row including description, date, category, and amount in PT-BR formatting and without using card-based individual containers.
2. **Given** the user has existing transactions, **When** they review the list, **Then** income and expense entries are visually distinct and the list does not group transactions by category or display administrative category counts.
3. **Given** the user has existing transactions, **When** they select a transaction from the list, **Then** the detail view is shown and they can continue to view or edit the entry.
4. **Given** the user has no transactions yet, **When** the transaction list loads, **Then** the UI clearly communicates the empty state without showing misleading data.
5. **Given** the user reviews a non-BRL transaction, **When** the amount is displayed, **Then** the original currency is explicitly identified and no silent conversion is performed in the frontend.

---

### User Story 2 - Create and edit expenses (Priority: P1)
A user needs to register new expenses and fix mistakes when an expense is entered with the wrong information or wrong category.

**Why this priority**: Manual expense management is the core value of the feature. Most of the user benefit comes from creating accurate records and correcting them quickly when needed.

**Independent Test**: This can be tested by creating a new expense and then editing an existing one to verify the form validates required fields and updates the expense record without requiring recreation of the expense.

**Acceptance Scenarios**:

1. **Given** the user selects the option to add an expense, **When** they submit a valid form with description, amount, date, category, and currency, **Then** the expense is added to the list and stored through the mock service contract, with BRL as the default value and USD/EUR available as valid alternatives.
2. **Given** the user fills out the form with missing or invalid data, **When** they try to submit it, **Then** the system blocks the save and shows clear PT-BR validation feedback.
3. **Given** the user opens an existing expense, **When** they change only the category, **Then** the expense is updated without requiring them to recreate it or re-enter all fields.
4. **Given** the user edits an existing expense, **When** they change description, amount, date, category, or currency, **Then** the updated values are reflected in the list and detail view while preserving the original currency value for that expense.
5. **Given** the user tries to save an invalid amount, **When** the form is validated, **Then** the system rejects the entry and explains what is invalid in Brazilian Portuguese.

---

### User Story 3 - Delete expenses safely (Priority: P1)
A user wants to remove an expense only after confirming the action, because deleting a financial record is a potentially destructive operation.

**Why this priority**: Data deletion must be deliberate and explicit. Safe deletion is required to protect against accidental loss and to build trust in the feature.

**Independent Test**: This can be tested by selecting a listed expense, choosing delete, confirming the action, and verifying that the expense is removed from the list and no longer appears in the user interface.

**Acceptance Scenarios**:

1. **Given** the user selects an expense to delete, **When** they start the delete action, **Then** the system asks for explicit confirmation before removing the record.
2. **Given** the user confirms the deletion, **When** the action completes, **Then** the expense no longer appears in the expense list.
3. **Given** the user cancels the deletion flow, **When** they confirm cancellation, **Then** the expense remains in the list and no data is lost.

---

### User Story 4 - Correct category assignment quickly (Priority: P2)
A user may have an expense assigned to the wrong category and needs a low-friction way to correct it without re-entering the whole expense.

**Why this priority**: This is a common real-world correction scenario and a primary user need in personal finance apps, but it is a specialized form of editing rather than the core entry flow.

**Independent Test**: This can be tested by selecting an incorrectly categorized expense and updating only the category to a valid one from the predefined set.

**Acceptance Scenarios**:

1. **Given** the user reviews an imported or existing expense with an incorrect category, **When** they edit the category field, **Then** they can replace it with a valid category from the available set without changing the other fields unless they choose to do so.
2. **Given** the user updates an expense category, **When** the save completes, **Then** the list and detail view reflect the corrected category assignment.
3. **Given** the user has access to the category selector, **When** they choose a category, **Then** the selected category is passed by categoryId, not by embedding a category name in the expense record.

---

### Edge Cases

- What happens when the user submits an empty description, amount, date, or category?
- How does the system handle a malformed amount such as letters, negative values, or an empty numeric field?
- What happens when the user tries to edit a category-only expense without changing other fields?
- How does the system behave when the expense list is empty?
- What happens when the user deletes an expense and then cancels or confirms the confirmation step?
- How should the app handle a foreign-currency expense without silent conversion?
- Which currencies are supported in the initial version and how must the original currency be preserved and displayed?
- What should happen when the user reaches the expense list while the mock service is temporarily unavailable or returns an error?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST allow users to view a dedicated list of their registered expense transactions.
- **FR-002**: The system MUST display each expense transaction in the list with at least the description, date, category, and amount.
- **FR-003**: The system MUST use Brazilian Portuguese for all user-facing text in the expense management flow.
- **FR-004**: The system MUST default new expenses to BRL when the user creates an expense, while also allowing the user to select USD or EUR for that expense in the initial version.
- **FR-005**: The system MUST allow users to open a stored expense to view its details.
- **FR-006**: The system MUST allow users to create a new manual expense with required information: description, amount, date, category, and currency.
- **FR-007**: The system MUST validate required fields before saving a new expense and MUST reject invalid financial input with clear PT-BR feedback.
- **FR-008**: The system MUST define a valid amount requirement for manual expense creation and editing, including rejecting empty and malformed values.
- **FR-009**: The system MUST allow users to edit an existing expense and change one or more of the following: description, amount, date, category, and currency.
- **FR-010**: The system MUST support category-only updates so the user can correct a miscategorized expense without recreating the full record.
- **FR-011**: The system MUST store expenses using an `Expense` model containing at minimum: `id`, `description`, `amount`, `currency`, `date`, and `categoryId`.
- **FR-012**: The system MUST use `categoryId` rather than embedding the category name directly in the expense record.
- **FR-013**: The system MUST provide a predefined set of categories for expense selection, including Brazilian categories such as Alimentação, Moradia, Transporte, Contas, Lazer, Saúde, and Outros.
- **FR-014**: The system MUST NOT include category management capabilities in this feature, including create, edit, delete, or reordering categories.
- **FR-015**: The system MUST require explicit confirmation before deleting an expense.
- **FR-016**: The system MUST remove an expense from the expense list after successful deletion and no longer display it to the user.
- **FR-017**: The system MUST provide an expense creation and editing flow that keeps the current Monthly Spending Dashboard behavior unaffected.
- **FR-018**: The system MUST keep the expense feature frontend-only and MUST use mocked service responses for list, get, create, update, and delete operations.
- **FR-019**: The system MUST preserve a future replacement path by separating the mocked expense service, the service contract, and the presentation layer.
- **FR-020**: The UI MUST NOT directly access mock datasets; it MUST consume the mocked service through the established service boundary.
- **FR-021**: The frontend MAY perform input validation and formatting for display, but MUST NOT become the source of truth for business rules related to monthly aggregation, category totals, or dashboard calculations.
- **FR-022**: The system MUST display monetary values in Brazilian format, such as `R$ 284,90`, and MUST explicitly identify the original currency for any expense in the initially supported set of BRL, USD, or EUR without silent frontend conversion. The original currency value must always be preserved and displayed as part of the record and UI.
- **FR-023**: The system MUST allow navigation to the dashboard and the expense area, and the new expense flow MUST be reachable without over-specifying the final navigation architecture.
- **FR-024**: The system MUST exclude the following from this feature: Open Finance integration, real banking data, backend implementation, database infrastructure, authentication, automatic transaction categorization, recurring expense management, budget management, notifications, analytics, and advanced filtering or search.
- **FR-025**: The system MUST treat category correction as part of Expense Management and MUST allow the user to update the category without re-creating the expense.
- **FR-026**: An empty expense list is a valid empty state and MUST NOT be confused with a service or API error; the feature does not define a separate "expense with no data" state.
- **FR-027**: The transaction list MUST represent the account's real `Transaction` records and MUST be presented as a compact bank-statement style list, not as individual cards. It MUST show description, category, date, and value in a compact layout with subtle separators, with income and expense visually distinguished while preserving the underlying `type` semantics. The list MUST NOT show category counts, category administrative metadata, or any grouped-by-category presentation.

### Key Entities *(include if feature involves data)*

- **Expense**: A `Transaction` of type `expense` with required fields: `id`, `description`, `amount`, `currency`, `date`, and `categoryId`. This feature manages only the outgoing side of account movement within the broader Transaction domain.
- **CategoryReference**: A predefined category identifier used by an expense transaction. The category value is selected from a known category set and is not created or edited in this feature.
- **ExpenseForm**: The user input model used to create or update an expense, containing the fields needed for validation and submission.
- **ExpenseListEntry**: A presentation view of an expense used in the list, showing enough information for users to identify and select the expense quickly.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can create a valid manual expense and see it appear in the expense list without refreshing the app.
- **SC-002**: A user can open an existing expense, change its category or other fields, and save the update without re-creating the record.
- **SC-003**: A user cannot save a new or edited expense when required fields are missing or the amount is invalid; the app provides clear PT-BR validation feedback.
- **SC-004**: A user must confirm deletion before an expense is removed, and a deleted expense no longer appears in the expense list.
- **SC-005**: The expense list, detail view, and forms consistently display values in Brazilian Portuguese and BRL formatting, and foreign-currency expenses explicitly identify their currency.
- **SC-006**: The Monthly Spending Dashboard remains functional and unchanged in behavior when users interact with the expense management feature.
- **SC-007**: The UI consumes mock service responses through the service boundary instead of directly reading mock data, preserving the architecture for future replacement by a real source.
- **SC-008**: Users can correct an incorrectly assigned category without re-entering the rest of the record, reducing the effort required to maintain accurate expense data.
- **SC-009**: The Expense Management feature remains explicitly scoped to `Transaction` records of type `expense`; it does not redefine the broader account-movement model or create a second competing domain concept.

## Assumptions

- Users are reviewing and managing personal financial entries in a mobile app and expect a simple, predictable record lifecycle.
- The initial version uses a curated mocked dataset and predefined categories, with no real banking or Open Finance integration.
- The expense feature is considered part of the same app experience as the Monthly Spending Dashboard and should not disrupt dashboard flows.
- The app is mobile-first and uses Brazilian Portuguese labels and BRL formatting as the default presentation standard.
- User input is intended to be manual and explicit, with validation handled at the frontend form layer but not as a source of financial truth for aggregated analytics.
- Category assignment is limited to selecting from a predefined set and does not include category creation or management in this release.
