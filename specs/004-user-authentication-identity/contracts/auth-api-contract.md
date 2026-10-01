# Auth API Contract

## Scope

This document defines the shared contract expected between the frontend and the backend for authentication. It is not a frontend-owned API design or a backend implementation document. The backend owns the implementation and payload semantics; the frontend consumes this contract and must not redefine or duplicate it. Provider implementation details, Firebase internals, and backend persistence design remain outside the frontend contract.

## Authentication endpoints

### POST /auth/login

Request body:
- `email`: string
- `password`: string

Success response:
- `status`: `"ok"`
- `token`: string
- `expiresAt`: ISO 8601 timestamp
- `tokenType`: `"Bearer"`
- `user`: object
  - `id`: string
  - `email`: string
  - `displayName?: string`

Error response:
- `status`: `"error"`
- `message`: string

### POST /auth/signup

Request body:
- `email`: string
- `password`: string
- `displayName?: string`

Success response:
- `status`: `"ok"`
- `user`: object
  - `id`: string
  - `email`: string
  - `displayName?: string`

Error response:
- `status`: `"error"`
- `message`: string

### GET /auth/session

Headers:
- `Authorization: Bearer <accessToken>`

Success response:
- `status`: `"ok"`
- `user`: object
  - `id`: string
  - `email`: string
  - `displayName?: string`
- `expiresAt`: ISO 8601 timestamp

Error response:
- `status`: `"error"`
- `message`: string

## Frontend contracts and responsibilities

- The frontend must store the token using secure device storage; for the current Expo/React Native app, this means Expo SecureStore or the equivalent secure storage abstraction available in the project.
- The frontend must expose one centralized authenticated API client as the only boundary for authenticated HTTP requests. It must retrieve the active access token from the session store and attach exactly `Authorization: Bearer <accessToken>` to every protected request.
- Feature modules must not read a JWT, access SecureStore for authentication, or manually construct an `Authorization` header. This includes future HTTP adapters for Monthly Spending, Transactions, and Expense Management.
- If no valid session is available, the authenticated client must not send the protected request. It must invalidate the shared session through the auth/session boundary and allow the app-level auth gate to return the user to login.
- The frontend must validate JWT expiry using the token `exp` claim. When the token is missing, malformed, or expired, the app must clear the stored auth state and redirect to login; HTTP `401` is handled as specified below.
- HTTP `401` is the only supported HTTP signal for an expired or invalid authenticated session. On HTTP `401`, the centralized authenticated API client must centrally clear the stored auth state and redirect to login. Other HTTP error responses do not imply session invalidation unless this contract is revised.
- The frontend must redirect to login when token validation fails or when a protected request is unauthorized.
- The frontend must not assume provider-specific details, Firebase internals, or backend persistence structure beyond the documented response contract.

## Existing financial-service boundary

- Monthly Spending, Transactions, and Expense Management currently use local mock services; they make no HTTP requests today.
- Those mocks remain local and must not add fake HTTP requests or fake JWT/header behavior.
- When real endpoint adapters replace these mocks, they must retain their feature service interface and use the centralized authenticated API client for every authenticated request.

## Required verification

- Add `app/tests/authenticated-api-client.test.ts` using the existing Node `node:test` and `node:assert/strict` harness, executed with `npx tsx --test tests/authenticated-api-client.test.ts` from `app/`; no new test framework is permitted.
- Inject a test transport into the centralized client and assert its outgoing protected request contains exactly `Authorization: Bearer <accessToken>` for a valid stored session.
- Assert the injected transport is not invoked for a missing, malformed, or expired session, and that the app transitions to login through the centralized auth/session boundary.
- Assert HTTP `401` clears the secure session and returns the app to login.
- Verify future HTTP implementations of Monthly Spending, Transactions, and Expense Management do not bypass the centralized authenticated API client.

## Non-goals

- Firebase implementation details are not part of the frontend contract.
- Backend persistence design is out of scope for this frontend specification.
- User profile management beyond the required user identity contract is not part of the MVP.
- Replacing current mock financial data with real endpoints, adding fake HTTP behavior to mocks, and adding Firebase to the frontend are out of scope.
