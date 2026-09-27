<!--
Sync Impact Report
Version change: 1.0.0 -> 1.1.0
Modified principles: I. User-Value First (retained), II. Data Integrity & Privacy ->
Privacy, Security & Responsible Data Handling, III. Test-First Delivery (retained),
IV. Observable, Incremental Delivery -> Architecture for Change and Portability,
V. Simplicity & Maintainability (retained)
Added sections: Platform & Technical Constraints, Data Access Architecture
Removed sections: none
Deferred items: none
-->

# EconomizAI Constitution

## Core Principles

### I. User-Value First
EconomizAI exists to help people understand, control, and improve financial decisions with less friction and less waste. Every product decision MUST create clear user value, improve trust in personal finance management, and avoid features that add complexity without measurable benefit.

### II. Privacy, Security & Responsible Data Handling
Financial data is sensitive by nature and MUST be treated as such. We MUST minimize collection, protect secrets, avoid exposing personal or account details in logs, telemetry, or debugging artifacts, and ensure users can understand how their information is processed and protected. Security and privacy are non-negotiable constraints in all product decisions.

### III. Test-First Delivery
Any user-facing change, financial calculation change, or business-critical rule change MUST begin with a failing test or explicit acceptance criterion. We MUST verify the relevant contract, regression scenario, or integration path before considering work complete. Trust in budget, spending, and recommendation behavior depends on disciplined verification.

### IV. Architecture for Change and Portability
The application architecture MUST separate the domain model from the source of data and the details of any external integration. EconomizAI is a React Native application with TypeScript, and the initial version MUST use exclusively mocked data because real Open Finance integration is explicitly out of scope for the initial version. This is an intentional technical constraint, not a justification for coupling the domain to mock implementations. The architecture MUST allow replacing mock data with a real Open Finance API in the future without major changes to the application domain, business rules, or user-facing workflows.

### V. Simplicity & Maintainability
We MUST favor the simplest solution that satisfies a real requirement. Unnecessary abstractions, duplicated logic, hidden coupling, and provider-specific assumptions are forbidden unless the added complexity is explicitly justified. The codebase MUST remain understandable to contributors, especially when the project evolves from mocked data to real financial integrations.

## Platform & Technical Constraints

EconomizAI is built as a mobile application using React Native and TypeScript. This platform choice imposes a need for clear boundaries between UI, business logic, and data access layers. Technical decisions MUST preserve portability, predictability, and maintainability across the application lifecycle and future integrations.

The project MUST treat mocked data as a transitional implementation strategy, not as a permanent architecture. The mocked data source MUST be replaceable by a future Open Finance integration without major changes to the domain model or business rules.

## Governance

This constitution supersedes ad hoc practices that conflict with it. Any amendment MUST include a documented rationale, a clear explanation of the impact on existing decisions, and review before it is accepted. Changes MUST preserve continuity for existing users and contributors while improving security, clarity, or maintainability.

Versioning MUST follow semantic versioning: MAJOR for backward-incompatible governance or principle changes, MINOR for new or materially expanded principles or sections, and PATCH for clarifications or non-semantic edits. Constitutional compliance MUST be reviewed when platform decisions, data integration strategy, or data-handling policies materially affect the product.

**Version**: 1.1.0 | **Ratified**: TODO(RATIFICATION_DATE): set the original project adoption date before final approval. | **Last Amended**: 2026-09-26
