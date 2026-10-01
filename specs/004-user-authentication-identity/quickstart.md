# Quickstart: User Authentication & Identity

## Goal

Validate the frontend auth flow end to end without depending on backend internals or provider-specific implementation details.

## Prerequisites

- Existing EconomizAI mobile app structure available in `app/`
- App shell and protected feature screens already present in the current project
- A backend contract for login, signup, and session validation is available or can be mocked in the app’s auth client layer for implementation testing
- Monthly Spending and Expense Management still use local mock services; no real financial HTTP endpoint is required for this feature validation

## Validation scenarios

### 1. Initial startup state
- Launch the app with no stored session.
- Confirm the app enters a `checking/restoring session` state.
- Confirm the login screen is not shown before the startup validation completes.
- Confirm the protected app also remains hidden while the app checks the session.

### 2. Valid restored session
- Launch the app with a valid secure token already stored.
- Confirm the startup validation resolves successfully.
- Confirm the app opens the protected app flow without requiring login again.

### 3. Invalid or expired session
- Launch the app with a missing, malformed, or expired token.
- Confirm the app clears the invalid session and routes to the login screen.
- Confirm protected screens are never rendered in this state.

### 4. Login success
- Open the login screen.
- Enter a valid email and password.
- Confirm the app submits the request through the centralized auth client.
- Confirm the app stores the returned token securely and transitions to the protected app flow.

### 5. Login failure
- Enter invalid credentials.
- Confirm the form blocks duplicate submit while the request is pending.
- Confirm the user receives a clear error and remains on the login screen.

### 6. Signup flow
- Open the signup screen.
- Enter a valid email and password and submit.
- Confirm the frontend sends the payload to the backend contract and handles validation errors clearly.
- Confirm the user can continue to login after successful signup.

### 7. Protected navigation guard
- Attempt to open a protected screen without a valid session.
- Confirm the app redirects to login instead of letting the screen render.
- Confirm the same guard applies to any authenticated request path.

### 8. Logout flow
- Sign in successfully and then initiate logout.
- Confirm the stored token is cleared and the app returns to the unauthenticated state.
- Confirm protected screens cannot be accessed until a new valid login occurs.

### 9. Authenticated request header
- Arrange a valid secure session with a known access token and invoke one protected request through the centralized authenticated API client.
- Implement and run `npx tsx --test tests/authenticated-api-client.test.ts` from `app/`, using the existing Node `node:test` and `node:assert/strict` harness.
- Inject a transport spy at the centralized client boundary and assert its outgoing request contains exactly `Authorization: Bearer <accessToken>`.
- Confirm the calling screen, hook, and feature service neither read SecureStore nor receive the token.

### 10. Missing, expired, and HTTP 401 session
- Invoke a protected request with no stored session, then with a malformed or expired token.
- Assert the injected transport is not invoked in each case, the session is invalidated centrally, and the app returns to login.
- Simulate a protected response with HTTP `401`.
- Confirm the same central invalidation and login transition occur without feature-local cleanup.

### 11. Financial-service integration seam
- Confirm Monthly Spending, Transactions, and Expense Management continue to use local mock services during this feature.
- Confirm mocks do not issue fake HTTP calls or fake Authorization headers.
- For each future HTTP replacement, verify its service adapter delegates protected requests to the centralized authenticated API client and contains no direct SecureStore, JWT, or manual Authorization-header handling.

## Expected outcomes

- The app always resolves session state before showing login or protected content.
- The auth boundary remains centralized and screen-independent.
- The access token is stored securely and attached centrally to protected requests.
- The centralized client sends `Authorization: Bearer <accessToken>` only for a valid session; missing, expired, and `401` sessions are invalidated centrally and return to login.
- The current financial mocks stay local, while their future HTTP adapters have one enforced authenticated-client boundary.
- Invalid sessions are cleared and redirected to login without exposing protected screens.
- The app remains aligned with the approved MVP decisions: email + password, single access JWT with expiry, no refresh token in the MVP, secure storage, and local logout.
