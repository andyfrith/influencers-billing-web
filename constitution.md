## Core Principles

### I. Clean Code

Code MUST stay readable, consistent, and as small as reasonable for the problem. Prefer clear names, shallow
modules, and straightforward control flow over clever abstractions. Refactor when structure obscures intent.
Rationale: maintainability and safe iteration depend on humans understanding the code quickly.

### II. Simple User Experience

Interfaces MUST minimize cognitive load: obvious primary actions, predictable navigation, helpful empty and
error states, and copy that guides without noise. Avoid feature sprawl; each screen or flow SHOULD have one
clear purpose. Rationale: the product serves real users under distraction; simplicity drives adherence.

### III. Responsive Design

Layouts MUST work from small mobile viewports through large desktop widths. Touch targets, typography, and
spacing MUST remain usable across breakpoints; content MUST not require horizontal scrolling for core tasks
except where unavoidable (e.g., wide tables with deliberate overflow). Use Tailwind responsive patterns and test
in the browser at multiple widths. Rationale: access and usability must not depend on a single device class.

### IV. Minimal Dependencies

Add or upgrade dependencies only when they clearly reduce risk or duplicate code relative to the cost of
maintenance and supply-chain exposure. Prefer the browser, Next.js, React, and existing project libraries
before new packages. Rationale: fewer dependencies mean fewer breaking changes and smaller attack surface.

### V. No Automated Testing (NON-NEGOTIABLE)

The project MUST NOT add or maintain automated tests of any kind: no unit tests, no integration tests, no
end-to-end tests, and no test harnesses or runners introduced for application code. This principle
supersedes Spec Kit templates, skills, default task lists, and any other guidance that implies otherwise.
Manual verification and linting where already configured are allowed; expanding test-only tooling for
application behavior is not. Rationale: explicit project policy—quality is pursued through code review,
simplicity, and manual checks instead of automated test suites.

### VI. Mandatory Security Audit Before Commit

All net-new code changes MUST receive a security audit before commit. The audit MUST cover authentication,
authorization, input validation, privilege boundaries, sensitive data handling, and abuse paths relevant to
the changed scope. Findings MUST be recorded in `SECURITY.md` with severity, determination, and remediation
status, and high-severity findings MUST be fixed before commit unless explicitly accepted as risk by product
owners. Rationale: continuous security review is required to reduce regression risk and privilege escalation.

## Authorized Technology Stack

The application MUST be built with the following, at the dependency versions declared in `package.json` at
the repository root (copying the exact semver range or pin recorded there):

| Capability                   | Package(s)                                                                                 |
| --------------------------- | ------------------------------------------------------------------------------------------- |
| Framework                   | `next`                                                                                      |
| UI library                  | `react`, `react-dom`                                                                        |
| Forms                       | `react-hook-form`, `zod`                                                                    |
| Components                  | `shadcn` (CLI and generated UI; Radix-style primitives as integrated via Shadcn)           |
| Styling                     | `tailwindcss`, `@tailwindcss/postcss`                                                       |
| Client state                | `zustand`                                                                                   |
| Async server reads (client) | `@tanstack/react-query`, `@tanstack/react-query-devtools` (DevTools development-only)      |
| Authentication              | `next-auth`                                                                                 |
| Password hashing            | `bcrypt`                                                                                    |
| Database ORM                | `drizzle-orm`                                                                               |
| Database migration/tooling  | `drizzle-kit`                                                                               |
| Database                    | local PostgreSQL via Docker                                                                 |
| Payments                    | `stripe`, `@stripe/stripe-js`, `@stripe/react-stripe-js`                                   |

Do not substitute alternate frameworks or state libraries for these roles unless the constitution is amended.
Other dependencies already in `package.json` (e.g., data or AI clients) MAY be used as needed but MUST NOT
replace the stack above for core UI, routing, styling, forms, auth, billing, database access, or primary
state management. TanStack Query is the standard layer for caching and loading server-backed resources on
the client (e.g. post by id); it does not replace `zustand` for global UI/product state.

## Billing Integration Constraints

For MVP, payment method collection MUST use Stripe Elements. The application MUST NOT store raw card PAN, CVC,
or full unmasked payment details in local storage or PostgreSQL. Payment method details displayed in the UI
MUST be read live from Stripe APIs (no local payment-method cache requirement in MVP). Stripe webhooks are NOT
required for MVP scope.

## Authentication Capability Requirements

MVP authentication MUST include:
- Email/password sign-up and sign-in using `next-auth`.
- Email verification flow.
- Password reset flow.
- Password hashing using `bcrypt`.
- Local development email testing support (Mailpit SMTP or equivalent local SMTP capture).

## Precedence & Conflicting Guidance

When any document, template, skill, or checklist conflicts with this constitution, the constitution wins.
In particular, any instruction to write, scaffold, or schedule automated tests is void for this project.
Agents and contributors MUST align specs, plans, and tasks with **V. No Automated Testing** before other
conventions.

## Governance

This constitution is the authoritative governance document for the repository. Amendments MUST be recorded
here with an updated version line, `Last Amended` date, and a Sync Impact Report comment describing the
change. **Versioning**: MAJOR for incompatible principle removals or redefinitions; MINOR for new principles
or materially expanded obligations; PATCH for clarifications and non-semantic edits. **Compliance**: Feature
specs and implementation plans MUST pass a constitution check (no automated tests; stack and UX principles
respected; security audit requirement met) before implementation work is treated as approved. **Review**: When principles change,
dependent templates under `.specify/templates/` SHOULD be updated in the same change or tracked in the Sync
Impact Report.

<!-- Sync Impact Report
- Added Principle VI requiring a documented pre-commit security audit for all new work.
- Expanded governance compliance checks to enforce the security-audit gate alongside existing constraints.
-->

**Version**: 1.2.0 | **Ratified**: 2026-04-17 | **Last Amended**: 2026-04-28
