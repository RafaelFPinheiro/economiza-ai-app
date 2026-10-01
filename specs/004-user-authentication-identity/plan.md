# Implementation Plan: User Authentication & Identity

**Branch**: `[004-user-authentication-identity]` | **Date**: 2026-09-29 | **Spec**: [spec.md](spec.md)

**Input**: Approved frontend specification from `specs/004-user-authentication-identity/spec.md`

## Summary

Add a centralized authentication boundary for the EconomizAI mobile app. The frontend will own the login/signup experience, secure session storage, startup session restoration, protected route gating, JWT attachment through a centralized API client, and local logout behavior. The backend will remain outside this implementation scope and only contributes the contract for identity, JWT issuance, and authorization.

## Technical Context

**Language/Version**: TypeScript 6.0.3; React 19.2.3; React Native 0.86.3

**Primary Dependencies**: Expo 57, React Native Safe Area Context, secure mobile storage abstraction (for example, keychain/Keystore-backed storage), and the current app shell navigation model.

**Storage**: Expo SecureStore (or the equivalent secure mobile storage abstraction available in the project stack) for the access token and a small auth session state; no plaintext token storage. Backend persistence and Firebase internals remain outside the frontend contract and are described only as external requirements.

**Testing**: TypeScript verification via `npm run typecheck` from `app/`; existing Node built-in `node:test` and `node:assert/strict` tests executed by the existing `tsx` development dependency for authenticated-client request construction; plus manual quickstart validation for login/signup, protected navigation, session restoration, logout, HTTP 401 handling, and future-service boundary compliance. No test framework is added.

**Target Platform**: iOS and Android mobile app built with Expo and React Native.

**Project Type**: Mobile application

**Performance Goals**: Minimal startup overhead; auth validation must occur before rendering protected screens, but no strict latency requirement is specified beyond preserving smooth app startup.

**Constraints**: Email + password only for MVP; one access JWT with expiry; no refresh-token flow in this release; secure storage required; protected screens cannot render before auth state resolves; fully frontend-owned auth state should not be embedded in feature screens; JWT expiry MUST be validated using the token `exp` claim, and missing/malformed/expired tokens must clear the local session and transition the app to unauthenticated/login. The sole authenticated HTTP boundary retrieves the active token from the session store and adds `Authorization: Bearer <accessToken>`; feature modules must not access SecureStore, read JWTs, or create authorization headers. HTTP `401` is the only supported HTTP invalid-session signal and triggers central session clearing and login routing.

**Scale/Scope**: One app-level auth gate, one login/signup flow, one centralized authenticated API client, one secure session store, and protected navigation around the current feature screens. Monthly Spending, Transactions, and Expense Management remain backed by local mocks in this feature; their future HTTP adapters are constrained to use the shared client.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. User-Value First**: PASS — this creates a secure, clear entry experience and prevents access to protected financial features before identity is established.
- **II. Privacy, Security & Responsible Data Handling**: PASS — the feature requires secure storage, no plaintext credentials, and centralized invalid-session handling; it minimizes exposure of personal data and keeps backend responsibilities outside the frontend domain.
- **III. Test-First Delivery**: PASS — the spec includes explicit acceptance scenarios for startup, login, registration, logout, and protected navigation; these will be used as validation gates before feature completion.
- **IV. Architecture for Change and Portability**: PASS — the app keeps auth logic in a single boundary and preserves future backend replacement or provider changes without coupling features to Firebase or provider-specific behavior.
- **V. Simplicity & Maintainability**: PASS — one auth boundary, one secure session store, one centralized client, and no unnecessary abstractions beyond the provided contract model.
- **Platform constraints**: PASS — the design uses the current Expo/React Native architecture and respects secure-device storage and app-shell ownership.

## Project Structure

### Documentation (this feature)

```text
specs/004-user-authentication-identity/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   └── auth-api-contract.md
├── spec.md              # Feature specification
└── checklists/
    └── requirements.md
```

### Source Code (repository root)

```text
app/
├── App.tsx
├── src/
│   ├── features/
│   │   └── auth/
│   │       ├── components/
│   │       ├── hooks/
│   │       ├── screens/
│   │       └── utils/
│   ├── shared/
│   │   └── auth/
│   │       ├── AuthGate.tsx
│   │       ├── AuthState.ts
│   │       └── sessionStore.ts
│   └── services/
│       ├── auth/
│       │   ├── authClient.ts
│       │   └── mockAuthService.ts     # authClient.ts is the sole protected HTTP boundary
│       └── contracts/
│           └── authContract.ts
└── tests/
    └── authenticated-api-client.test.ts
```

**Structure Decision**: The feature will be implemented as a dedicated `auth` feature area plus a small shared auth boundary under `app/src/shared/auth/`. The app shell remains responsible for app-level route gating, while feature screens themselves remain unaware of authentication logic. `app/src/services/auth/authClient.ts` is the sole authenticated HTTP boundary: it reads the active token through the session-store boundary, injects the Bearer header, and handles missing-session/401 invalidation. Future Monthly Spending and Expenses/Transactions HTTP adapters may depend on that client, but may not read storage or headers directly.

**Contract Ownership Decision**: `specs/004-user-authentication-identity/contracts/auth-api-contract.md` is a shared frontend/backend contract. The backend owns the implementation and the semantics of the auth payloads, while the frontend consumes this contract and must not redefine or duplicate it. Firebase/provider implementation details remain outside the frontend contract and are never surfaced in the app layer.

**Temporary Mock Note**: `app/src/services/auth/mockAuthService.ts` is only a temporary development and frontend-testing implementation used while the real backend is not available. It must conform exactly to `auth-api-contract.md`, must be easy to replace with the real HTTP client without changing the screens, hooks, or `AuthGate`, and must not introduce Firebase, backend persistence logic, or backend-specific implementation details into the frontend layer.

## Design Decisions

- Keep an app-level auth gate in the shell and never scatter auth checks through individual feature screens.
- Introduce a temporary `checking/restoring session` startup state so no protected view appears before validation completes.
- Store the access token in Expo SecureStore (or equivalent secure mobile storage) using a platform-backed abstraction, not in plaintext or in a feature-local store.
- Validate JWT expiry using the token `exp` claim; missing, malformed, or expired tokens trigger local session clearing and a redirect to the login flow.
- Keep the auth session model small: user identity, access token, and expiry timestamp; no refresh-token flow in the MVP.
- Send the JWT through one centralized client and attach it only at the API boundary rather than in each feature service.
- Keep current Monthly Spending and Expense Management mocks as local data providers. They neither make fake HTTP calls nor simulate header attachment; replacement adapters must preserve the service interface and delegate protected HTTP work to the centralized authenticated API client.
- Reject protected requests before transport when no valid session is available. On HTTP `401`, clear the secure session through the central session boundary and let the app-level gate return to login; no alternate HTTP invalid-session payload or identifier is supported.
- Verify request construction with the existing Node `node:test`/`node:assert/strict` harness run through `tsx`: an injected test transport must observe exactly `Authorization: Bearer <accessToken>` for a valid session and no transport invocation for an invalid session. Also verify feature services contain no direct JWT, SecureStore, or manual authorization-header access when their HTTP adapters are introduced.
- Treat logout as a local session-clearing action in MVP, while the backend remains responsible for its own user lifecycle and authorization rules.
- Keep Firebase and other provider-specific behavior outside the frontend contract; the app only depends on backend responses and a documented auth contract.

## Constitution Check (Post-Design)

- **User value, privacy, security, and architectural separation**: PASS — the design keeps the app secure, clear, and portable while clearly separating backend internals from frontend requirements.
- **Test-first and maintainability**: PASS — the quickstart validation scenarios cover the exact startup, session, login, signup, and logout behaviors required by the specification.
- **No unjustified complexity**: PASS — no provider-specific SDKs, no refresh-token design, and no backend persistence logic are embedded into the frontend implementation plan.

## Complexity Tracking

No constitution violations or additional complexity require justification.
