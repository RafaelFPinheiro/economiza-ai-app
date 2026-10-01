# Tasks: User Authentication & Identity

**Input**: Design documents from `/specs/004-user-authentication-identity/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establish the shared frontend auth boundary and contract-aware structure.

- [X] T001 Create the required feature folders for auth state, screens, hooks, and services under `app/src/features/auth/`, `app/src/shared/auth/`, and `app/src/services/auth/`
- [X] T002 [P] Configure the initial auth module contracts and types in `app/src/services/contracts/authContract.ts` and `app/src/shared/auth/AuthState.ts`
- [X] T003 [P] Add the temporary mock contract implementation in `app/src/services/auth/mockAuthService.ts` as a frontend-only development stub that matches `specs/004-user-authentication-identity/contracts/auth-api-contract.md` without introducing backend or Firebase details
- [X] T003A [P] [US1][US4] Audit the auth contract and integration boundary in `specs/004-user-authentication-identity/contracts/auth-api-contract.md`, `app/src/services/auth/authClient.ts`, and `app/src/services/auth/mockAuthService.ts` to confirm that the auth contract remains backend-owned, the frontend remains contract-only, and future adapters continue to use the centralized authenticated client without direct JWT or SecureStore access

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core auth infrastructure that MUST be complete before user-story work can begin.

- [X] T004 Establish the secure session storage abstraction in `app/src/shared/auth/sessionStore.ts` for access token persistence, expiry checks, and local session clearing
- [X] T005 Implement `app/src/services/auth/authClient.ts` as the centralized authenticated API client/boundary after T004 establishes `app/src/shared/auth/sessionStore.ts`. It must retrieve the active access token through that store, add exactly `Authorization: Bearer <accessToken>` to protected HTTP requests, and expose no token access to feature modules.
- [X] T006 [P] Implement the app-level auth gate in `app/src/shared/auth/AuthGate.tsx` to decide between `checking`, `authenticated`, and `unauthenticated` states without embedding auth checks in feature screens
- [X] T007 Define the minimal auth state model in `app/src/shared/auth/AuthState.ts` to represent startup restoration, authenticated state, and logout/invalid-session transitions

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel.

---

## Phase 3: User Story 1 - Access the app only after authentication (Priority: P1) 🎯 MVP

**Goal**: Prevent protected screens from rendering before the app verifies the stored session and route users to login when no valid session exists.

**Independent Test**: Launch the app with no stored session and confirm the app enters a checking/restoring session state before any protected screen or login screen is displayed; launch again with a valid stored session and confirm the protected experience opens without repeated login.

### Implementation for User Story 1

- [X] T008 [P] [US1] Update the root app shell in `app/App.tsx` to initialize the auth state, trigger startup session restoration, and render a transient checking/restoring state instead of immediately showing the login or protected view
- [X] T009 [US1] Implement startup session validation in `app/src/shared/auth/sessionStore.ts` and the auth gate so invalid, expired, or missing sessions clear local state and route users to login. Validate JWT expiry using the token `exp` claim and treat malformed or expired tokens as unauthenticated.
- [X] T010 [US1] Add the route guard behavior in `app/src/shared/auth/AuthGate.tsx` so protected screens are not rendered while `status === 'checking'` and are redirected to login when `status === 'unauthenticated'`
- [X] T011 [US1] Verify that the existing protected financial screens for Monthly Spending/Dashboard, Transactions, and Expense Management cannot be accessed without a valid authenticated session and remain accessible after successful authentication. This verification must run against the centralized app-level auth gate and must not be implemented inside feature screens.

**Checkpoint**: At this point, User Story 1 should be fully functional and independently testable.

---

## Phase 4: User Story 2 - Sign in with backend-issued credentials and session (Priority: P1)

**Goal**: Allow login with email + password, validate credentials through the backend contract, securely persist the session, and transition to the authenticated app flow.

**Independent Test**: Submit valid credentials, confirm the app stores the token securely, and confirm the protected app opens; submit invalid credentials and confirm the login screen shows a clear error while blocking duplicate requests.

### Implementation for User Story 2

- [X] T012 [P] [US2] Create the login screen and form state in `app/src/features/auth/screens/LoginScreen.tsx` to collect `email` and `password`, handle loading, and expose validation feedback
- [X] T013 [US2] Implement the frontend auth hook in `app/src/features/auth/hooks/useAuth.ts` to call the centralized auth client, store the JWT in secure storage, and update the app auth state after successful login
- [X] T014 [US2] Connect the login flow to `app/src/services/auth/authClient.ts` and `app/src/services/auth/mockAuthService.ts` so the request and response payloads follow `specs/004-user-authentication-identity/contracts/auth-api-contract.md`
- [X] T015 [US2] Add duplicate-submit protection and user-facing error handling for invalid credentials in `app/src/features/auth/screens/LoginScreen.tsx` and the auth hook
- [X] T016 [US2] Persist the access token and session metadata securely in `app/src/shared/auth/sessionStore.ts` with no plaintext storage and no backend-specific persistence logic in the frontend

**Checkpoint**: At this point, User Stories 1 and 2 should both work independently.

---

## Phase 5: User Story 3 - Register a new account through the backend (Priority: P1)

**Goal**: Provide a frontend signup flow that sends a registration request through the backend contract without embedding Firebase or provider-specific logic in the app.

**Independent Test**: Complete the signup form with valid data, confirm the backend contract accepts it, and then sign in with the created credentials; submit invalid data and confirm clear validation feedback.

### Implementation for User Story 3

- [X] T017 [P] [US3] Create the signup screen and validation state in `app/src/features/auth/screens/SignupScreen.tsx` for email, password, and optional display name handling
- [X] T018 [US3] Implement the signup submission flow in `app/src/features/auth/hooks/useAuth.ts` to call the backend contract and transition to login or authenticated state after a successful registration
- [X] T019 [US3] Add validation and error messaging for invalid signup payloads in `app/src/features/auth/screens/SignupScreen.tsx` without exposing backend internals or Firebase details
- [X] T020 [US3] Ensure the signup flow is routed through the centralized auth client in `app/src/services/auth/authClient.ts` rather than feature-local logic

**Checkpoint**: At this point, User Story 3 should be independently functional.

---

## Phase 6: User Story 4 - Access protected features only after valid session establishment (Priority: P1)

**Goal**: Guarantee that all existing protected financial screens are available only after a valid authenticated session exists and that each protected request includes a JWT via the centralized client layer.

**Independent Test**: Attempt to access protected screens without a valid session and confirm the app redirects to login; sign in and confirm the app opens the protected flow with the JWT attached centrally for each authenticated request.

### Implementation for User Story 4

- [X] T021 [P] [US4] Update the app shell route selection in `app/App.tsx` so the authenticated and unauthenticated flows are distinct and protected screens cannot render without a valid session
- [X] T022 [US4] Implement JWT Bearer propagation in `app/src/services/auth/authClient.ts`: every authenticated HTTP request must carry exactly `Authorization: Bearer <accessToken>` after the client retrieves the current token from `app/src/shared/auth/sessionStore.ts`.
- [X] T023 [US4] Implement missing/expired-session behavior across `app/src/services/auth/authClient.ts`, `app/src/shared/auth/sessionStore.ts`, and `app/src/shared/auth/AuthGate.tsx`: do not send protected requests without a valid session; on missing, malformed, expired sessions or HTTP `401`, centrally clear the session and return to login. HTTP `401` is the only supported HTTP invalid-session signal.
- [X] T024 [US4] Define and preserve the Monthly Spending future HTTP integration boundary in `app/src/features/monthly-spending/` and `app/src/services/mocked/monthlySpendingService.ts`: keep the current mock local, do not add fake HTTP/authentication, and require a future replacement adapter to use `app/src/services/auth/authClient.ts` without direct JWT, SecureStore, or header access.
- [X] T032 [US4] Define and preserve the Transactions and Expense Management future HTTP integration boundary in `app/src/features/expenses/` and `app/src/services/mocked/expenseService.ts`: keep current mocks local, do not add fake HTTP/authentication, and require future list/detail/create/update/delete adapters to use `app/src/services/auth/authClient.ts` without direct JWT, SecureStore, or header access.

**Checkpoint**: At this point, User Story 4 should be independently functional.

---

## Phase 7: User Story 5 - Sign out safely and keep the authenticated flow consistent (Priority: P2)

**Goal**: Clear the current session and restore the login-first experience without leaving protected views reachable.

**Independent Test**: Sign in, trigger logout, confirm the token is removed and protected navigation is blocked, then relaunch the app and confirm login remains the default entry point.

### Implementation for User Story 5

- [X] T025 [US5] Add the logout action to the authenticated app state in `app/App.tsx` or the shared auth boundary so it clears the secure session and resets the app to the unauthenticated flow
- [X] T026 [US5] Ensure the logout path also clears the in-memory auth state and invalidates the local session so protected screens cannot be reopened without a new login
- [X] T027 [US5] Validate the app restart behavior after logout so a clean login screen is shown again and no expired session is silently restored

**Checkpoint**: User Story 5 should now be independently functional and consistent with the rest of the auth boundary.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, documentation alignment, and hardening of the app’s auth boundary.

- [X] T028 [P] Review and align `app/src/services/auth/authClient.ts`, `app/src/services/auth/mockAuthService.ts`, and `specs/004-user-authentication-identity/contracts/auth-api-contract.md` so the mock remains a temporary frontend-only stub that can be replaced without changing the auth screens, hooks, or `AuthGate`
- [X] T029 [P] Verify all auth screens, hooks, and shared auth modules remain frontend-only and avoid Firebase, provider SDK details, and backend persistence logic in the app layer
- [X] T030 Run the quickstart validation from `specs/004-user-authentication-identity/quickstart.md` and confirm the startup, login, signup, protected navigation, and logout scenarios all behave as required
- [X] T031 Validate the TypeScript project using `cd app && npm run typecheck` to confirm the auth feature remains compatible with the current Expo/React Native app setup
- [X] T033 [P] Add `app/tests/authenticated-api-client.test.ts` using the existing Node `node:test` and `node:assert/strict` harness, executed with `cd app && npx tsx --test tests/authenticated-api-client.test.ts`; inject a transport spy into `app/src/services/auth/authClient.ts` and assert that a valid session creates a request containing exactly `Authorization: Bearer <accessToken>`. Do not add a test framework.
- [X] T034 Extend `app/tests/authenticated-api-client.test.ts` after T033 using the same existing harness to assert that the injected transport is not invoked for missing, malformed, or expired sessions, and that an HTTP `401` centrally clears the session and returns the app to login.
- [X] T035 [P] Audit the current mock/service boundaries in `app/src/features/monthly-spending/`, `app/src/features/expenses/`, `app/src/services/mocked/monthlySpendingService.ts`, and `app/src/services/mocked/expenseService.ts`: confirm mocks remain local, do not read JWTs or SecureStore, and do not simulate HTTP or Authorization headers. Establish this audit as a mandatory review gate whenever a real HTTP adapter is introduced; that adapter must use `app/src/services/auth/authClient.ts` for Bearer propagation and must not bypass the centralized authenticated API client.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion and blocks all user stories. T005 depends on T004 because the authenticated client consumes the session-store interface; T006 and T007 may proceed after the shared auth types are available.
- **User Stories (Phase 3+)**: All depend on Foundational completion.
- **Polish (Final Phase)**: Depends on all desired user stories being complete.

### User Story Dependencies

- **User Story 1 (US1)**: Can start after Phase 2 and is the MVP entry point.
- **User Story 2 (US2)**: Can start after Phase 2 and relies on the centralized auth store and client.
- **User Story 3 (US3)**: Can start after Phase 2 and depends on the same auth boundary contract.
- **User Story 4 (US4)**: Can start after Phase 2 and depends on the route guard and centralized JWT handling.
- **User Story 5 (US5)**: Can start after US1 and US4 are in place for reliable session clearing and route re-entry.

### Parallel Opportunities

- Setup tasks T001, T002, and T003 can run in parallel.
- After T002, T004, T006, and T007 can progress in parallel where their shared auth-state interface is coordinated; T005 starts after T004.
- US1 tasks T008, T009, and T010 can be implemented in parallel if the route guard and startup-store logic are coordinated under the same auth state contract.
- US2 and US3 can be developed in parallel after the auth client and secure store are ready.
- After T033 creates the authenticated-client test file, T034 extends it sequentially. T028–T033 and T035 can otherwise run in parallel when their file dependencies are satisfied.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Stop and validate the startup/login-protection flow independently
5. Expand to sign-in, sign-up, and protected route enforcement after the startup guard is stable

### Incremental Delivery

1. Setup + Foundational → auth boundary ready
2. US1 → startup state and protected gating
3. US2 → login and secure session persistence
4. US3 → signup flow through the backend contract
5. US4 → protected feature access and centralized JWT enforcement
6. US5 → logout and consistent app re-entry
7. Polish → verify Bearer propagation, invalid-session behavior, and future financial-service integration boundaries

## Notes

- [P] tasks = different files, no dependencies.
- [Story] labels map tasks to user stories for traceability.
- This feature remains frontend-owned; backend internals, Firebase implementation, and persistence design remain explicitly outside the frontend implementation scope.
- The temporary mock in `app/src/services/auth/mockAuthService.ts` is not a permanent backend replacement and should be isolated behind the auth client so it can be switched to the HTTP implementation without altering screens, hooks, or `AuthGate`.
- Monthly Spending, Transactions, and Expense Management remain local mock data sources in this feature. Their future HTTP implementations must use `app/src/services/auth/authClient.ts`; this task list does not authorize replacing the mocks or adding backend endpoints.
