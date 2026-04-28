# Roadmap

## Phase 0: Planning and Setup
- Confirm architecture and MVP scope.
- Finalize dependency list aligned to constitution.
- Configure Dockerized local PostgreSQL and environment variables.

## Phase 1: Auth Foundation
- Add next-auth and bcrypt integration.
- Implement sign-up, sign-in, and sign-out flows.
- Implement email verification flow.
- Implement password reset request + completion flow.
- Implement local SMTP delivery through Mailpit for verification/reset links.

## Phase 2: Data Layer
- Add Drizzle ORM + drizzle-kit.
- Define and migrate tables: users, verification tokens, reset tokens, billing customers.
- Add repository/service layer for auth and billing mappings.

## Phase 3: Billing Integration
- Add Stripe SDKs and server utilities.
- Implement create/retrieve Stripe customer per user.
- Persist `user_id` to `stripe_customer_id` mapping.
- Implement Stripe Elements payment method add/update/remove flows.

## Phase 4: Customer Billing UI
- Build responsive billing screens with Shadcn + Tailwind.
- Use React Hook Form + Zod for all forms.
- Use TanStack Query for async data and mutations.
- Use Zustand only for advanced local UI state where needed.

## Phase 5: Hardening and Launch Readiness
- Improve loading, empty, and error states.
- Validate responsive behavior across breakpoints.
- Run manual end-to-end verification of auth and billing flows.
- Finalize docs and deployment checklist.

## Phase 6: Clubs and Memberships
- Add clubs, plans, memberships, and cancellation request schema/migrations.
- Add admin-only club creation and plan creation flows.
- Add member club directory and club detail views with member lists.
- Add member subscription flow using Stripe subscriptions.
- Add member cancellation request workflow and admin resolution queue.
- Validate manual end-to-end memberships flow.

## Phase 7: Admin Invite Workflow (Later Phase)
- Define invite-only onboarding requirements and admin permissions.
- Add `admin_invites` schema/table and token lifecycle rules.
- Add admin endpoint(s) to create/revoke invites.
- Send invite links via email provider abstraction.
- Add invite acceptance flow (prefill email, set password, verify token, activate account).
- Add admin UI for invite status (pending, expired, accepted).

## Phase 8: Shadcn UI Standardization
- Standardize all shared UI primitives in `components/ui` on canonical Shadcn patterns.
- Replace native form controls in feature components with Shadcn primitives.
- Prefer composition of Shadcn components (`Button`, `Card`, `Input`, `Label`, `Select`) for all net-new UI.
- Keep Radix dependencies aligned with Shadcn component usage.

## Phase 9: Security Hardening and Governance
- Maintain `SECURITY.md` as a living audit log with findings, determinations, and remediation status.
- Lock bootstrap admin elevation behind explicit non-production and local-only guards.
- Add route-level rate limiting for auth, admin, and other sensitive mutation endpoints.
- Add centralized CSRF/origin validation policy for custom authenticated mutations.
- Add structured security audit logging for privileged actions and repeated failures.
- Add release-time security review checklist and dependency vulnerability review.
