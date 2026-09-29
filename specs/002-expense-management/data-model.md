# Data Model: Expense Management

## Entities

### Expense

- `id`: unique identifier for the expense record
- `description`: short text description of the expense
- `amount`: numeric value for the expense amount
- `currency`: ISO currency code for the entry; default is BRL
- `date`: date when the expense occurred
- `categoryId`: identifier for the selected category
- `type`: must be explicitly `"expense"` because Expense is a subtype of `Transaction` within the broader account-movement model

Validation rules:
- `id` must be unique within the expense collection.
- `description` must be present and non-empty after trimming whitespace.
- `amount` must be a valid numeric value greater than zero for normal expense entries.
- `currency` must be a valid supported code and must remain explicit for any foreign-currency entry.
- `date` must be a valid date and should represent the expense’s occurrence date.
- `categoryId` must match one of the predefined category values exposed by the mock service.

### ExpenseCategory

- `id`: unique category identifier
- `name`: user-visible category name in Brazilian Portuguese
- `description` (optional): short label or note if needed by the UI

Validation rules:
- A category must exist in the service-provided set before it can be used by an expense.
- The initial set includes the core categories for this feature, such as Alimentação, Moradia, Transporte, Contas, Lazer, Saúde, and Outros.
- Category creation, deletion, or reordering is out of scope for this feature.

### ExpenseForm

- `description`: user input for the expense description
- `amount`: user-entered numeric value
- `currency`: selected currency code for the new or edited expense
- `date`: selected date
- `categoryId`: selected category for the expense

Validation rules:
- Required fields must be completed before save.
- Amount validation must reject empty, malformed, or negative values.
- Currency defaults to BRL when the user first creates an expense.
- Category selection is controlled by the service-provided category list.

### ExpenseListEntry

- `id`: unique expense identifier
- `description`: expense label used in the list
- `date`: occurrence date formatted in the local PT-BR display style
- `categoryName`: resolved category label, derived from the category reference
- `amount`: formatted amount to be displayed in the list

Validation rules:
- The list must show enough context to identify the expense without requiring the user to inspect raw data.
- Each list item must remain consistent with the source `Expense` record and category metadata.

## Relationships

- One `Expense` belongs to one `ExpenseCategory` via `categoryId`.
- An `Expense` is a `Transaction` of type `expense` and therefore participates in the same account-movement model as income transactions.
- The expense list is a collection of `Expense` records that the service exposes to the UI.
- The category list is a predefined collection provided by the mock service and consumed by the form.
- The selected `ExpenseForm` values are validated and converted into a single `Expense` record when the user saves.

## State transitions

- User opens the expense list: the app reads the expense collection and displays either an empty state or the list entries.
- User creates a new expense: the form validates fields, creates an `Expense`, and saves it through the mock service.
- User edits an existing expense: the app loads the expense, allows updates, validates the edited values, and persists the updated record.
- User changes only the category: the expense persists with the new `categoryId` without requiring recreation of the expense.
- User deletes an expense: the app requires confirmation and then removes the record from the list through the mock service.
- Service error: the UI surfaces an error state distinct from an empty list, without confusing empty-state semantics with technical failure.

## Notes

- The data model intentionally excludes fields that are outside the requested feature scope, such as recurring flags, installment metadata, budget assignments, or account linkage.
- The model is designed to remain portable and future-proof without embedding category names directly in the expense record.
