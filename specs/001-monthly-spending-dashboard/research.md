# Research: Monthly Spending Dashboard

## Decision

The feature will be implemented as a frontend-only mobile dashboard that consumes mocked service responses for a single month view, with a clear separation between presentation behavior and service contract boundaries.

## Rationale

This matches the constitution by keeping the initial version strictly mocked, preserving a portable architecture, and minimizing complexity. The dashboard is a user-facing experience that requires clear summaries, comparisons, and category breakdowns, but the financial logic and rule interpretation remain responsibilities of backend services rather than the mobile client.

## Alternatives considered

- Embed business and financial calculation logic in the mobile app: rejected because it weakens portability and conflicts with the constitution’s requirement to keep domain logic outside the UI boundary.
- Implement a real Open Finance integration in the initial milestone: rejected because the constitution explicitly excludes real Open Finance from the initial version.
- Build the dashboard directly from mock data structures inside presentation components: rejected because it couples UI to data source details and makes future replacement harder.

## Key findings

- No existing application structure or mobile project scaffold was found in the repository, so there is no reusable app foundation to preserve.
- The plan therefore assumes a minimal Expo-based mobile application structure created specifically for this feature, while keeping the architecture simple and aligned with the constitution.
- The mocked service layer is intentional and temporary; it must emulate the future backend contract closely enough that switching to real API clients does not require presentation-layer changes.
- Privacy and security requirements apply to the data model and handling of financial information even in the mocked version, especially for how sensitive values are surfaced and managed in the client.
