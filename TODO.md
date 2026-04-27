# TODO

## Phase 0 - Environment and Tooling

- [x] Add `.env.local` with required variables:
  - `DATABASE_URL`
  - `NEXTAUTH_SECRET`
  - `NEXT_PUBLIC_APP_URL`
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  - `STRIPE_SECRET_KEY`
- [x] Add local email env:
  - `SMTP_HOST=localhost`
  - `SMTP_PORT=1025`
  - `EMAIL_FROM=Influencers Billing <billing@localhost>`
- [x] Run local PostgreSQL + Mailpit: `docker compose up -d db mailpit`.
- [x] Generate initial Drizzle migration.
- [x] Apply migrations to local database.

## Phase 1 - Auth Foundation

- [x] Add `next-auth` credentials flow.
- [x] Implement sign-up API and page.
- [x] Implement sign-in API/page integration.
- [x] Implement email verification tokens and page.
- [x] Implement password reset request and reset page.
- [x] Local dev email via Mailpit (SMTP) for verification/reset links — see README and `.env.example`.
- [ ] Production transactional email (e.g. Resend/Postmark) when not using Mailpit.

## Phase 2 - Billing Foundation

- [x] Add Stripe SDK integration.
- [x] Implement Stripe customer mapping table and service.
- [x] Add setup-intent API endpoint.
- [x] Add payment method read/set/remove endpoints.
- [x] Build Stripe Elements card management UI.

## Phase 3 - Data and App Polish

- [x] Add Drizzle schema and config.
- [x] Create and run migration files in `drizzle/`.
- [x] Add TanStack Query provider and billing query usage.
- [x] Add Zustand store for advanced billing UI state.
- [ ] Add stronger server-side audit logging for billing actions.

## Phase 4 - Manual Verification

- [ ] Verify sign-up flow and email verification.
- [ ] Verify sign-in blocking before email verification.
- [ ] Verify forgot/reset password flow.
- [ ] Verify add/update/remove card via Stripe Elements.
- [ ] Verify responsive behavior on mobile and desktop.

## Phase 5 - Clubs and Memberships

- [x] Add clubs/plans/memberships/cancellation-request schema and migration.
- [x] Add admin-only club and plan API routes.
- [x] Add member club browse/detail/join APIs and pages.
- [x] Add membership list and cancellation request flow.
- [x] Add admin cancellation request queue and resolution endpoints/pages.
- [ ] Add membership lifecycle reconciliation for status drift without webhooks.

## Phase 6 - Admin Invite Workflow (Later Phase)

- [ ] Define admin role/permissions for invitation management.
- [ ] Add `admin_invites` table and token hashing/expiry rules.
- [ ] Add admin invite creation/revoke API routes.
- [ ] Add invite acceptance route/page and account activation logic.
- [ ] Integrate invite email template via email abstraction.
- [ ] Add admin invite status UI (pending/accepted/expired/revoked).
