# Feature Specification: User Authentication & Identity

**Feature Branch**: `[004-user-authentication-identity]`

**Created**: 2026-09-29

**Status**: Draft

**Scope note**: This specification defines the frontend experience, frontend state management, routing rules, and required backend contracts for the authentication foundation. It does not define the backend’s internal implementation details, Firebase internals, persistence model, or user-creation rules. The backend will have its own specification and implementation details outside this document.

**Input**: User description: "Quero criar uma nova feature de fundação para o EconomizAI chamada 'User Authentication & Identity'. Objetivo: Implementar o fluxo de identificação e autenticação dos usuários do aplicativo. O aplicativo deverá possuir uma tela de Login como porta de entrada para as funcionalidades autenticadas. Todas as telas/features existentes atualmente devem ficar protegidas por autenticação e só poderão ser acessadas depois que o usuário estiver autenticado. ..."

## Project Context and Current Architecture

- The current app is a React Native + TypeScript mobile application organized by feature under `app/src/features/`. The root `App.tsx` owns the current screen selection and bottom-tab navigation, while each feature screen renders its own content and delegates navigation through callbacks supplied from the app shell.
- The app currently includes feature areas such as the Monthly Spending Dashboard, transaction list/detail flows, and expense management screens. These screens are currently accessible without a user session and therefore need an authentication gate before they become available to authenticated users.
- The current frontend architecture is already organized around a clear boundary between feature screens and service access: screens consume services through mock/service-contract patterns rather than direct dataset access. The authentication layer should preserve that boundary and avoid spreading identity logic across feature screens.
- The app already relies on screen-level navigation callbacks and shared containers, which means the authentication flow should be centralized at the app shell or a dedicated auth boundary layer rather than embedded in individual feature screens.
- Monthly Spending, Transactions, and Expense Management currently obtain data from local mock services. They make no real HTTP requests today. Those mocks stay local and do not simulate HTTP authentication; when each mock is replaced, its HTTP implementation must use the shared authenticated API client described in this feature.
- Existing app patterns emphasize Brazilian Portuguese labels, shared design consistency, and safe-area handling. The authentication experience should fit those patterns while remaining a clearly separate authenticated flow.

### Frontend responsibilities
- login and signup UI
- auth state and session lifecycle management
- session restoration on app startup
- secure token storage on the device
- centralized API client for authenticated requests
- JWT attachment for protected requests
- protected navigation and route gating
- logout and local session clearing
- JWT validation at runtime using the token `exp` claim to reject missing, malformed, or expired sessions

### Backend responsibilities
- identity provider integration
- Firebase integration
- user creation and account lifecycle
- authentication and authorization
- JWT issuance and validation
- backend persistence and storage

This feature specification covers only the frontend responsibilities and the required shared backend contract. It does not define the backend’s internal implementation, provider-specific details, or persistence design. The auth API contract is a shared frontend/backend artifact: the backend owns the implementation and payload semantics, while the frontend consumes the contract and must not redefine it.

## Clarifications

### Session 2026-09-29

- Q1: What credential format is required for the initial authentication flow? **Answer**: The initial version will use email + password credentials for login and sign-up. A username field is not required for the MVP.
- Q2: What JWT strategy should be used in the initial version? **Answer**: The backend issues a JWT for authenticated sessions; the initial version uses a single access token with a defined expiry and a simple invalidation flow on expiry. Refresh-token support is explicitly deferred until the product requirements are clarified beyond MVP.
- Q3: How should the app store session data on mobile? **Answer**: The frontend should use a secure mobile storage abstraction (for example, platform secure storage or keychain-backed storage) when available. Plain text storage in local app state or insecure persistent storage is not acceptable for the final design.
- Q4: What does logout do in the first version? **Answer**: Logout clears the local session and invalidates the client’s stored token. A backend-side logout operation is optional for the initial version and should not be treated as a required dependency for the MVP unless the backend architecture explicitly requires it.
- Q5: What is the minimum user model for the initial backend contract? **Answer**: The minimum user model includes a stable user ID, email address, display name or full name when available, and the account status required for authentication. User profile management beyond the minimum is excluded from the initial feature scope.
- Q6: What should happen when a token expires? **Answer**: The app must detect invalid or expired sessions centrally, remove the local session, and route the user back to the login experience without leaving the user on a protected screen.
- Q7: What is the relationship between Firebase Identity and the backend-issued JWT? **Answer**: Firebase is an identity-provider integration inside the backend. The backend authenticates the user, validates their identity, and then issues the app’s JWT. The frontend never depends on Firebase credentials, Firebase SDK details, or Firebase-specific auth flows.
- Q8: Who owns the auth API contract and how should the frontend treat it? **Answer**: The auth API contract is a shared frontend/backend contract. The backend owns the implementation and the payload semantics, while the frontend consumes the contract as an external dependency and does not redefine or duplicate it. Firebase/provider implementation details remain outside the frontend contract.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Access the app only after authentication (Priority: P1)
A user opens the app for the first time or after a session has ended and expects to be guided to a login flow before accessing protected screens.

**Why this priority**: Authentication is the foundation of the app’s protected-user experience. Without a reliable gate, all existing product areas are exposed without a user identity context.

**Independent Test**: Launch the app with no valid session and confirm the experience redirects to the login screen before any protected feature can be shown; launch again with a valid session and confirm the protected app is shown without login friction.

**Acceptance Scenarios**:

1. **Given** the user opens the app without a valid session, **When** the app initializes, **Then** the system enters a temporary checking/restoring session state and does not display either the login screen or a protected screen while validation is in progress.
2. **Given** the user opens the app with a valid stored session, **When** the app initializes, **Then** the app restores the authenticated state and opens the protected experience without forcing repeated login.
3. **Given** the user opens the app without a valid stored session, **When** the session check completes, **Then** the app transitions to the login screen and keeps the protected screens inaccessible until authentication succeeds.
4. **Given** the app detects an expired or invalid session, **When** a protected request fails or the session check fails, **Then** the local session is cleared and the user is returned to login.
5. **Given** a user attempts to access a protected screen directly, **When** the app checks session validity, **Then** the flow stops the navigation and routes the user to the login flow.

---

### User Story 2 - Sign in with backend-issued credentials and session (Priority: P1)
A returning user wants to authenticate with credentials, log in securely, and then access the protected app with a valid session.

**Why this priority**: This is the main user path for the product. It delivers the protected experience and creates the trust boundary required for all other app features.

**Independent Test**: Submit valid credentials, confirm the backend responds with a session/token, confirm the app stores it securely, and confirm the user reaches the protected app area.

**Acceptance Scenarios**:

1. **Given** the user opens the login screen, **When** they enter valid email and password credentials, **Then** the app sends the request to the backend and the backend authenticates the user using its identity layer.
2. **Given** the backend authenticates successfully, **When** it returns a JWT, **Then** the frontend stores the token in secure local storage or secure mobile storage and proceeds to the authenticated experience.
3. **Given** the user enters invalid credentials, **When** the login request fails, **Then** the app shows a clear error message and prevents multiple submissions while the request is pending.
4. **Given** a login request is in progress, **When** the user attempts to submit again, **Then** the app blocks duplicate requests until the first operation completes.

---

### User Story 3 - Register a new account through the backend (Priority: P1)
A new user wants to create an account without exposing identity-provider details to the frontend or bypassing the backend’s user creation rules.

**Why this priority**: User registration is part of the required product entry path and must be treated as a backend-owned identity action, not a frontend-only form with direct provider logic.

**Independent Test**: Complete the registration flow through the frontend, verify the backend receives the payload, and confirm the user can then sign in with the created credentials.

**Acceptance Scenarios**:

1. **Given** the user opens the registration screen, **When** they provide valid registration details, **Then** the frontend sends the request to the backend and the backend creates the user account according to its rules.
2. **Given** the user enters invalid registration data, **When** the form is submitted, **Then** the frontend blocks the save and shows understandable validation errors while preserving a clean user experience.
3. **Given** user creation succeeds in the backend, **When** the user is redirected to login or the app continues, **Then** the user can authenticate with the newly created account.
4. **Given** the backend rejects registration, **When** the form is processed, **Then** the user sees the backend-provided error message without leaking provider-specific implementation details.

---

### User Story 4 - Access protected features only after valid session establishment (Priority: P1)
Once the user is authenticated, they should be able to access existing application features, but only using the centralized session layer and the backend-issued token.

**Why this priority**: Protected features are the main product value of the app. They must remain inaccessible without a valid identity and must share one consistent security model.

**Independent Test**: Confirm each existing feature area is hidden behind the authenticated state and that all authenticated requests include the JWT via the centralized client layer.

**Acceptance Scenarios**:

1. **Given** the user has a valid authenticated session, **When** they access the Monthly Spending Dashboard, Transactions, or Expense Management areas, **Then** they are allowed to proceed into the protected features.
2. **Given** the user is not authenticated, **When** they attempt to open a protected screen or route, **Then** the app redirects them to login and blocks access to the protected content.
3. **Given** the app includes protected features, **When** the underlying backend returns HTTP `401` or the session is expired, **Then** the request fails through the centralized auth client and the app clears the session and redirects to login.
4. **Given** a screen from the authenticated feature set is rendered, **When** it triggers an authenticated API call, **Then** the frontend includes the JWT through a centralized HTTP layer rather than feature-local storage or request code.
5. **Given** a future HTTP implementation replaces a Monthly Spending, Transactions, or Expense Management mock, **When** it sends an authenticated request, **Then** it uses the centralized authenticated API client, which obtains the active token from the session store and sends `Authorization: Bearer <accessToken>`.
6. **Given** the centralized authenticated API client finds no valid session, or an authenticated API response has HTTP status `401`, **When** the request is evaluated, **Then** it does not send a request without a token or retains access after rejection; it invalidates the session centrally and returns the app to login. HTTP `401` is the only supported HTTP invalid-session signal.

---

### User Story 5 - Sign out safely and keep the authenticated flow consistent (Priority: P2)
A user should be able to end the session intentionally and be returned to an unauthenticated state without leaving protected screens accessible.

**Why this priority**: Secure logout is a core expectation of any authentication flow, but it is not the primary product path. It is essential for trust and safe session management.

**Independent Test**: Sign in, trigger logout, verify the token is removed and protected screens are no longer reachable until a new login occurs.

**Acceptance Scenarios**:

1. **Given** the user is authenticated, **When** they initiate logout, **Then** the local session is removed securely and the app returns to the login state.
2. **Given** the user logs out, **When** they attempt to navigate back into protected areas, **Then** the app redirects them to login.
3. **Given** the app is reopened after logout, **When** it checks the session, **Then** no valid session is restored and login remains the default entry screen.

---

### Edge Cases

- A missing, malformed, or expired stored session is a local session-validation case: the central session boundary clears it, prevents a protected request, and returns the app to login.
- A server-side invalid or unauthorized authenticated response is HTTP `401`. HTTP `401` is the only supported server signal for an invalid or expired authenticated session; the centralized client clears the session and returns the app to login.
- If network connectivity is unavailable during login, registration, or startup session validation, the app MUST keep the user in the unauthenticated flow, show a clear offline/error state, and prevent protected access until connectivity is restored or the user retries intentionally.
- If a user triggers multiple login or registration submissions at the same time, the app MUST reject duplicate requests while the first request is pending and show the same single loading/error state for each action.
- If the backend rejects a password or email in a way that should be surfaced to the user without leaking internal details, the frontend MUST show a concise user-facing validation or auth error and MUST NOT display provider-specific implementation details.
- If the app is reopened and a secure token exists but is not valid for the current backend state, the app MUST treat the session as invalid, clear it locally, and return the user to the login experience.
- If secure storage is unreadable or unavailable at startup, the app MUST clear any partial local session state, keep the user in the unauthenticated flow, and require a fresh login rather than rendering protected screens.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST require a valid authenticated session before users can access protected app areas such as the dashboard, transactions, expense management, and other product screens that are currently available without authentication. This protection MUST be enforced through a single app-level auth gate or equivalent centralized auth state, and feature screens or shared UI components outside that boundary MUST NOT own individual auth decisions.
- **FR-002**: The system MUST present a dedicated login screen as the default entry point when no valid session exists.
- **FR-003**: During app startup, while a stored session is being validated or restored, the system MUST show a temporary checking/restoring session state and MUST NOT display either the login screen or a protected screen before validation completes.
- **FR-004**: The system MUST allow a user to create an account through the backend-owned registration flow and must not treat account creation as a frontend-only or provider-local process.
- **FR-005**: The frontend MUST own the login/signup UI, auth state, session restoration, secure token storage, centralized API client, JWT attachment, protected navigation, and logout behavior.
- **FR-006**: The backend MUST own identity provider integration, Firebase integration, user creation, authentication, JWT issuance and validation, authorization, and backend persistence, while the frontend consumes only the documented backend contract.
- **FR-007**: The backend MUST return a JWT or equivalent session token after successful authentication and the frontend MUST store it in secure local storage or equivalent mobile-secure storage.
- **FR-008**: The frontend MUST use a centralized HTTP or API client layer to add the JWT to authenticated requests, ensuring that feature screens do not separately manage token storage or request headers. This is the canonical bearer-token rule for the feature, and it governs FR-008A through FR-008D and the related validation criteria.
- **FR-008A**: The centralized authenticated API client MUST retrieve the active access token from the secure session store and attach exactly `Authorization: Bearer <accessToken>` to every authenticated HTTP request.
- **FR-008B**: Feature modules, including Monthly Spending, Transactions, and Expense Management, MUST NOT read JWTs or access SecureStore directly for authentication, and MUST NOT construct `Authorization` headers manually.
- **FR-008C**: When no valid session exists, the centralized authenticated API client MUST prevent the authenticated HTTP request from being sent, invalidate the session through the shared auth boundary, and transition the app to the existing unauthenticated/login flow.
- **FR-008D**: HTTP `401` is the only supported HTTP signal for an expired or invalid authenticated session. When the centralized authenticated API client receives HTTP `401`, it MUST centrally clear the session and transition the app to the login flow.
- **FR-009**: The app MUST centralize invalid-session handling so that expired sessions or HTTP `401` responses remove the local session and redirect the user to the login flow.
- **FR-010**: The app MUST allow the user to log out and clear all relevant local session data, returning the user to the unauthenticated flow.
- **FR-011**: The app MUST restore a valid session automatically on app startup when the secure local session remains valid, without requiring repeated user login after a restart.
- **FR-011A**: For the current Expo/React Native app, the frontend MUST store the access token using Expo SecureStore (or the equivalent secure mobile storage abstraction available in the project stack) and MUST validate JWT expiry by reading the token `exp` claim. If the token is missing, malformed, or expired, the app MUST clear the local session and transition to the unauthenticated/login state.
- **FR-012**: The app MUST separate authentication/session concerns from feature business logic so screens such as Monthly Spending, Transactions, Expense Management, and other protected areas do not own their own auth rules.
- **FR-013**: This requirement is satisfied by the centralized app-level auth gate defined in FR-001 and MUST NOT be implemented separately inside feature screens or route components.
- **FR-014**: The app MUST not store credentials in plain text or expose tokens or credentials in logs, crash reports, or user-visible debug output.
- **FR-015**: The app MUST maintain a clear separation between identity/authentication concerns and user business data concerns, ensuring that business flows do not absorb auth-specific responsibilities.
- **FR-016**: The app MUST expose a clear, minimal user identity model to the frontend while keeping the full identity-provider and backend-user rules behind the backend boundary.
- **FR-017**: The system MUST support a login and signup experience that matches the app’s existing mobile design language while remaining minimal and consistent with the current EconomizAI UI.
- **FR-018**: The app MUST show loading states during authentication and registration, provide understandable user-facing errors, and prevent duplicate submission while requests are in progress.
- **FR-019**: The system MUST provide a clear unauthenticated state and an authenticated state with separate navigation flows, so the login and protected experiences are visually and behaviorally distinct.
- **FR-020**: The frontend MUST document the login, registration, session lifecycle, JWT handling, secure storage, protected-route behavior, and auth client integration in the feature specification and implementation plan.
- **FR-021**: The backend MUST document the authentication endpoints, user registration model, JWT issuance and validation flow, Firebase/identity integration, authorization approach, and error handling in the backend specification, while this frontend spec only references the contract needed for frontend integration.
- **FR-022**: The system MUST support the initial product requirement of backend-owned identity integration without forcing the frontend to know Firebase internals, provider-specific SDK details, or provider-specific user entity logic.
- **FR-023**: The system MUST allow future changes to the identity provider or session strategy without requiring a major frontend rewrite, provided the backend contract and session model remain compatible.
- **FR-024**: The system MUST keep the authentication feature scoped to identity, session, and protected access without expanding into unrelated business or product features.
- **FR-025**: The system MUST distinguish between session validity checks, backend authentication failures, and local session clearing so users understand whether they need to log in again or whether the app is restoring a valid session.
- **FR-026**: The backend MUST define the contractual response model for login, registration, token issuance, and unauthorized/expired-session responses, and that contract MUST be documented for frontend consumption.
- **FR-027**: The frontend MUST not assume that the backend will keep Firebase details, token structure, or provider specifics visible to the mobile app; those details remain internal to the backend contract and implementation.
- **FR-028**: The system MUST provide a user logout path that removes the local authentication state, disables access to protected screens, and restores a login-first experience on the next open or route attempt.
- **FR-029**: The app MUST support the app shell and protected features under the shared authorization model defined in FR-001, without embedding auth logic inside the App Header, feature modules, or reused UI components.
- **FR-030**: The frontend MUST use email + password as the initial credential model, with JWT access tokens that expire and no refresh-token flow in the MVP.
- **FR-031**: The frontend MUST treat logout as a local session-clearing action in the MVP, with the backend only responsible for its own server-side authorization rules and persistence design.
- **FR-032**: Monthly Spending, Transactions, and Expense Management MUST retain their current local mock services until real backend endpoints are introduced. The mocks MUST NOT perform fake HTTP calls or fake JWT handling; their service interfaces MUST remain replaceable by future HTTP implementations that use the centralized authenticated API client.

### Key Entities *(include if feature involves data)*

- **UserAccount**: The backend-owned user record used for authentication and access control, containing the minimum identity information required for login, registration, and authorization.
- **AuthenticationRequest**: The login or registration payload submitted by the frontend to the backend for identity operations; includes credentials, user profile information when required, and request context without exposing provider-specific internals.
- **AuthSession**: The client-side session state representing the current authenticated user and the JWT or token used to authorize subsequent API requests.
- **JWT**: The application-issued session token that identifies the authenticated user and is sent by the frontend through the centralized API layer.
- **ProtectedRoute or ProtectedScreenGate**: The app-level gate that determines whether a user can access authenticated content and redirects unauthenticated users to login.
- **IdentityProviderAdapter**: The backend-owned integration layer that connects the app’s auth system to Firebase or a future provider without exposing its implementation to the frontend.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users without a valid session are routed to login before they can access protected product areas.
- **SC-002**: Users with a valid stored session are restored to the authenticated experience automatically when the app launches again.
- **SC-003**: Valid login attempts successfully transition the user to the authenticated application flow, while invalid credentials are rejected with clear user feedback.
- **SC-004**: The app supports secure session storage and removes invalid or expired session state without leaving protected screens accessible.
- **SC-005**: Authenticated API requests include the JWT through a centralized layer and do not depend on feature-level token management.
- **SC-005A**: Verification proves that an authenticated request issued by the centralized client contains `Authorization: Bearer <accessToken>`, and that no request is issued when the session is missing, malformed, or expired.
- **SC-005B**: Verification proves that HTTP `401` clears the secure session and returns the app to login, and that future HTTP services for Monthly Spending, Transactions, and Expense Management have no direct SecureStore, JWT, or manual-header access.
- **SC-006**: Protected features remain inaccessible after logout and require a fresh login before access is restored.
- **SC-011**: The app validates JWT expiry using the token `exp` claim and clears the stored session when the token is missing, malformed, or expired; the user is redirected to the login flow without exposing protected financial screens.
- **SC-007**: The frontend and backend responsibilities are clearly separated so the app does not know Firebase internals and the backend remains the sole owner of identity integration.
- **SC-008**: No credentials or tokens are stored in plain text or exposed in logs, debug output, or user-visible trace data.
- **SC-009**: Users can complete login and registration flows with clear status feedback, duplicate-submit prevention, and understandable error handling.
- **SC-010**: The app’s authenticated and unauthenticated flows are clearly separated without embedding auth behavior into feature screens or shared UI not intended to own identity logic.

## Assumptions

- The initial version uses email + password as the primary credential pair, with no social sign-in requirements in the MVP.
- The app will continue to be a mobile-first React Native application and will rely on a centralized auth boundary rather than per-feature auth logic.
- The backend owns the Firebase integration, identity validation, user creation rules, and JWT issuance; the frontend is not responsible for implementing those details.
- The initial version supports at least one short-lived JWT access token; long-lived refresh tokens and multi-session handling are deferred until the plan clarifies the requirements beyond the first release.
- The app’s protected areas include the currently available features that must become authenticated-only, while the login and registration flows are not protected and remain public.
- Secure storage is available in the mobile environment and preferred over plain persistent storage, even though the exact platform implementation may vary between operating systems.
- Secure app restarts, token restoration, and invalid-session cleanup are treated as app-state concerns managed by a centralized session layer.
- The backend will document its endpoints, request/response contracts, and auth/error handling before implementation begins; the frontend will rely on those contract definitions rather than provider-specific assumptions.
- The current financial-data services are local mocks only. This feature defines the required frontend integration contract for their future HTTP replacements; it does not replace mocks, add backend endpoints, or add Firebase to the frontend.
