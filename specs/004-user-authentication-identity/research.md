# Research: User Authentication & Identity

## Decision: Frontend owns the session lifecycle and app gating

**Decision**: The React Native app owns the login/signup UI, auth state, session restoration, secure token storage, centralized API client, JWT attachment, protected route gating, and logout flow. The backend is responsible for identity-provider integration, Firebase usage, user creation, authentication, JWT issuance and validation, authorization, and persistence.

**Contract Ownership**: The auth API contract in `contracts/auth-api-contract.md` is a shared frontend/backend contract. The backend owns the implementation and the response semantics; the frontend consumes the contract, validates its assumptions, and must not redefine or duplicate it.

**Rationale**: The approved specification states that the frontend is responsible for the user-facing auth flow and secure local session handling, while the backend owns the identity and security infrastructure. This preserves a clean separation and avoids provider-specific implementation leaks into the mobile app.

**Alternatives considered**: Embedding Firebase logic directly in the app or placing auth checks inside feature screens; both were rejected because they create provider coupling and violate the frontend/backend boundary.

## Decision: App startup must include a temporary checking/restoring session state

## Decision: Secure storage uses Expo SecureStore and token expiry is validated from JWT `exp`

**Decision**: The current Expo/React Native app should use Expo SecureStore for the access token and session metadata; plain text persistence is not acceptable. JWT validation must use the token’s `exp` claim. If the token is missing, malformed, or expired, the app must clear the local session and move to the unauthenticated/login state before rendering protected screens.

**Rationale**: The approved specification requires secure mobile storage, a short-lived access token, and invalid-session handling. Validating `exp` centrally ensures the app does not expose protected content when the session is stale or broken.

**Alternatives considered**: storing tokens in plain AsyncStorage, validating only the presence of a token, or ignoring malformed tokens; all were rejected because they violate the app’s security requirement and do not protect protected routes correctly.

**Decision**: On app launch, the app must pass through a dedicated `checking/restoring session` state before it decides whether to show login or the authenticated experience. This transitional state prevents both the login screen and protected screens from being displayed prematurely.

**Rationale**: The specification explicitly requires that no login or protected screen be rendered while the stored session is being validated or restored. This is a critical product behavior for a secure app shell.

**Alternatives considered**: Rendering login immediately or rendering the protected app immediately while the session is unresolved; both were rejected because they create invalid or flashing state transitions and may expose protected content before validation completes.

## Decision: Session model stays minimal and MVP-scoped

**Decision**: The frontend session model includes at minimum the authenticated user identity, the access JWT, and the token expiry information needed to decide whether the session is still valid. Refresh tokens remain outside the MVP.

**Rationale**: The approved decisions specify email + password login, a single access JWT with expiry, secure mobile storage, and a local logout flow. Keeping the session model to the minimum required by those decisions prevents unnecessary complexity and keeps the feature aligned with MVP scope.

**Alternatives considered**: Multi-session, refresh-token support, or storing additional backend-specific user metadata in the frontend; all were rejected because they are out of scope for this release.

## Decision: Centralized API client is the enforcement point for JWT authentication

**Decision**: Protected requests must be sent through a single centralized authenticated API client that obtains the active `accessToken` from the secure session-store boundary and injects exactly `Authorization: Bearer <accessToken>`. Individual screens, hooks, and feature services must not read JWTs, access SecureStore for authentication, or attach headers directly. The client prevents transport when no valid session exists and centrally invalidates the session only on HTTP `401`, the sole supported HTTP invalid-session signal.

**Rationale**: The specification requires a centralized auth boundary and a clear separation between feature business logic and auth transport details. This also ensures invalid-session handling is centralized instead of duplicated in every feature service.

**Alternatives considered**: Token attachment inside feature-specific services or screen-level request code; both were rejected because they duplicate auth logic and make protected flows harder to secure.

## Decision: Financial-data mocks remain local; future HTTP adapters use the authenticated client

**Decision**: Monthly Spending, Transactions, and Expense Management currently remain backed by local mock services. Those mocks do not issue HTTP requests and must not simulate HTTP authentication. When a backend implementation replaces a mock, it preserves the existing service boundary and delegates every authenticated HTTP request to the centralized authenticated API client.

**Rationale**: The implementation audit found no live HTTP calls in the financial features. Adding fake request behavior to mocks would blur the current data-source boundary and make security claims unverifiable. A shared client provides the future integration seam without changing today’s mock behavior.

**Alternatives considered**: Reading SecureStore from each financial service, passing tokens from screens into services, or having mocks mimic request headers. All were rejected because they spread secret handling, create inconsistent 401 behavior, and couple mock data to transport details.

## Decision: Verify transport behavior and future-adapter compliance explicitly

**Decision**: Verification uses the existing Node `node:test` and `node:assert/strict` harness executed through the existing `tsx` development dependency. It must assert that an injected transport observes `Authorization: Bearer <accessToken>`, is not called without a valid session, and triggers central invalidation on HTTP `401`. The existing typecheck remains required; no test framework is added.

**Rationale**: A helper that can format a header is insufficient evidence that a request sends it. The architectural contract therefore verifies request construction, session failure behavior, and the absence of feature-local token handling.

## Decision: Local logout is the MVP behavior

**Decision**: In the MVP, logout clears the local stored token and auth state and returns the user to the login-first experience. No backend-side logout requirement is imposed unless the backend contract expressly adds it later.

**Rationale**: The clarified requirements and the approved product decision state that logout is local in the MVP and that the backend-side logout is optional rather than required.

**Alternatives considered**: Requiring a backend logout call for every session close; rejected as unnecessary complexity for this feature’s initial release.

## Decision: Firebase remains backend-owned and hidden behind the backend contract

**Decision**: Firebase or any other identity provider remains part of the backend implementation domain. The frontend must not know provider-specific SDKs, Firebase authentication details, or user-creation rules beyond the documented contract.

**Rationale**: The specification deliberately separates backend and frontend responsibilities and explicitly keeps Firebase internal to the backend.

**Alternatives considered**: Frontend SDK initialization, Firebase client code, or direct provider-specific screens; all were rejected because they mix infrastructure and product concerns.

## Open decisions to resolve in implementation planning

- The exact secure storage abstraction to use for the mobile platform should be selected during implementation based on the app’s Expo environment and secure-storage availability.
- The precise structure of the frontend auth state and route guard should be chosen to fit the current app shell, while preserving app-level ownership.
- The exact contract payloads for login, signup, and session validation should be finalized in the backend contract documentation created outside this frontend spec.
