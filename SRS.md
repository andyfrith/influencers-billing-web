# SRS

## 1. Scope
Build a Next.js application for customer authentication, secure card management, and club memberships using PostgreSQL, Drizzle ORM, and Stripe.

## 2. System Stack
- Framework: Next.js
- UI: React + Shadcn + TailwindCSS
- Forms/validation: React Hook Form + Zod
- Async server queries: TanStack Query
- Advanced local state: Zustand
- Database: PostgreSQL (local Docker)
- ORM/migrations: Drizzle ORM + drizzle-kit
- Auth: next-auth
- Password hashing: bcrypt
- Payments: Stripe Elements
- Local dev email: Mailpit (SMTP capture)

## 3. Functional Requirements
- FR-1: User can sign up with email/password.
- FR-2: User can sign in/sign out securely.
- FR-3: User must verify email before full account activation.
- FR-4: User can request and complete password reset.
- FR-5: System creates/retrieves Stripe Customer for authenticated user.
- FR-6: System stores unique Stripe customer mapping by internal user.
- FR-7: User can add/update/remove payment method via Stripe Elements.
- FR-8: Billing page reads payment method details live from Stripe APIs.
- FR-9: In local development, verification and password-reset emails are delivered to Mailpit for manual testing.
- FR-10: User can browse active clubs and view club members.
- FR-11: User can subscribe to a selected club plan via Stripe subscription.
- FR-12: User can view their memberships and current status.
- FR-13: User can submit a membership cancellation request.
- FR-14: Admin can create clubs and create club subscription plans.
- FR-15: Admin can review and resolve membership cancellation requests.
- FR-16 (later phase): Admin can create invite links/tokens for invite-only user onboarding.

## 4. Non-Functional Requirements
- NFR-1: Responsive UI from mobile to desktop.
- NFR-2: No storage of raw card numbers or CVC in local database.
- NFR-3: Environment-based secret management.
- NFR-4: Clear and concise error handling.
- NFR-5: No automated tests added (manual verification only).

## 5. Data Requirements
- `users`: id, email (unique), password_hash, email_verified_at, created_at, updated_at.
- `password_reset_tokens`: id, user_id, token_hash, expires_at, created_at.
- `email_verification_tokens`: id, user_id, token_hash, expires_at, created_at.
- `billing_customers`: id, user_id (unique FK), stripe_customer_id (unique), created_at, updated_at.
- `clubs`: id, name, slug (unique), description, status, created_at, updated_at.
- `club_subscription_plans`: id, club_id, name, interval, amount_cents, currency, stripe_price_id (unique), is_active, created_at, updated_at.
- `club_memberships`: id, club_id, user_id, plan_id, stripe_subscription_id (unique), status, current_period_end, created_at, updated_at.
- `membership_cancellation_requests`: id, membership_id, requested_by_user_id, reason, status, resolved_by_admin_user_id, created_at, updated_at.

## 6. Constraints
- Local development database must run with Docker.
- Billing details must be read live from Stripe (no local cache required in MVP).
- Stripe webhooks are not required in MVP.
- Local development email testing must work with Mailpit via SMTP.

## 7. Current Implementation Snapshot
- Implemented:
  - Credential auth, email verification, password reset.
  - Stripe customer mapping + SetupIntent/payment method routes.
  - Billing UI with Stripe Elements and live Stripe reads.
  - Clubs/plans/memberships/cancellation request schema + migration.
  - Stripe subscription creation and cancellation service operations.
  - Member club browse/detail/subscribe/memberships/cancel-request pages and APIs.
  - Admin club/plan/cancellation processing pages and APIs.
  - Mailpit-backed local SMTP flow with console fallback when SMTP is unset.
- Deferred:
  - Admin invite workflow (planned post-MVP).
