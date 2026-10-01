# Data Model: User Authentication & Identity

## Entities

### AuthSession

- `userId`: stable identifier for the authenticated user
- `email`: user email used for login; required in the existing account model
- `displayName`: optional user-visible name when available
- `accessToken`: JWT or equivalent access token issued by the backend
- `expiresAt`: token expiry timestamp used by the frontend to determine session validity; for JWTs this is derived from the token `exp` claim
- `status`: current auth state such as `checking`, `authenticated`, or `unauthenticated`

Validation rules:
- `userId` must be present when the session is authenticated.
- `accessToken` must be non-empty and stored only in secure mobile storage.
- `expiresAt` must be checked before exposing protected screens or sending protected requests.
- `status` must be derived from the presence of a valid token and the current session-check result.
- A missing, malformed, or expired token must be treated as `unauthenticated`, which clears the local session and routes to login.
- JWT expiry validation must read the `exp` claim as a Unix timestamp and reject any session where `Date.now() >= exp * 1000`.

### AuthenticatedApiRequest

- `method`: HTTP method for a protected endpoint
- `path`: endpoint path owned by the service adapter
- `headers`: request headers constructed only by the centralized authenticated API client
- `body`: optional request payload owned by the calling service adapter

Validation rules:
- Before transport, the centralized client obtains `accessToken` through the session-store boundary; feature modules do not receive or read it.
- The client adds exactly `Authorization: Bearer <accessToken>` to every authenticated request.
- If no valid `AuthSession` exists, the client must not send the request. It clears/invalidates the shared session and returns control to the unauthenticated app flow.
- HTTP `401` is the only supported HTTP invalid-session signal. It invalidates the shared `AuthSession`; the app-level auth gate then renders login.
- The token must never be logged or copied into feature state, error messages, or debug output.

### FinancialServiceAdapter

- `feature`: one of Monthly Spending, Transactions, or Expense Management
- `source`: `mock` for the current implementation or `http` after backend integration
- `client`: required only for an `http` source and must be the centralized authenticated API client

Validation rules:
- Current mock adapters remain local and return local data; they do not make fake HTTP requests or pretend to attach authentication headers.
- Future HTTP adapters preserve the existing feature service interface and use the centralized client for every authenticated request.
- A feature adapter must not import SecureStore, read `AuthSession.accessToken`, or manually construct an `Authorization` header.

### AuthState

- `status`: one of `checking`, `authenticated`, or `unauthenticated`
- `session`: current session record or `null`
- `errorMessage`: optional user-facing error for failed restoration or login attempts

Validation rules:
- `checking` is the interim state during startup restoration while stored session data is still being validated.
- `authenticated` requires a valid stored or newly issued session.
- `unauthenticated` is the default state after logout or failed token validation.

### LoginRequest

- `email`: user email address
- `password`: password credential supplied by the user

Validation rules:
- `email` must be a valid email format.
- `password` must be non-empty.
- The frontend sends this payload only to the backend contract and never to provider-specific client logic.

### SignupRequest

- `email`: user email address
- `password`: password selected by the user
- `displayName`: optional name field if backend supports it; otherwise omitted or treated as optional metadata

Validation rules:
- A valid email and password are required.
- Display name is optional in the MVP unless the backend contract explicitly requires it.
- The frontend must not perform direct Firebase or provider-specific user creation.

### ProtectedRouteGuard

- `isAuthenticated`: boolean derived from the current auth state and secure session validation
- `redirectTarget`: route or screen used when no valid session exists

Validation rules:
- Protected screens must render only when `isAuthenticated` is true.
- On invalid or missing session, the app must redirect to login rather than exposing protected content.
- The guard is app-level and not implemented in individual feature screens.

## Relationships

- One `AuthSession` belongs to one authenticated user.
- The app selector logic resolves the current `AuthState` into either the login experience or the protected app experience.
- Every protected request passes through the centralized API client, which uses the `accessToken` from the current authenticated session.
- Monthly Spending, Transactions, and Expense Management currently relate to `FinancialServiceAdapter` instances with `source: mock`; their future `http` instances depend on the centralized API client rather than the session store.
- The startup validation flow resolves the session state before any protected feature is rendered.

## State transitions

- App launch: `checking` state while secure storage is read and validated.
- Valid stored token: transitions to `authenticated` and opens protected app.
- Missing/invalid token: transitions to `unauthenticated` and opens login.
- Login success: backend returns a session token; app saves it and transitions to `authenticated`.
- Login failure: app stays in `unauthenticated` and shows an inline error.
- Logout: clear secure session and transition to `unauthenticated`.
- Expired token: clear local session and redirect to login before protected content is shown again.
- Missing session during a protected request: prevent transport, clear any invalid local state, and transition to `unauthenticated`.
- HTTP `401` response: centrally invalidate the session and transition to `unauthenticated`.

## Notes

- This is a frontend-auth model only; the backend owns the real identity provider and persistence details.
- The data model intentionally avoids internal Firebase details and backend persistence fields.
- The session model remains minimal to preserve the MVP scope and product clarity.
