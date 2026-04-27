# Design Doc: Credit Card Management MVP

## TL;DR
Implement a simple customer billing app with Next.js, local PostgreSQL, Drizzle ORM, next-auth, and Stripe Elements. Users can authenticate, verify email, reset password, and manage payment methods while storing only Stripe customer mapping in local DB.

## Authors
- Andy Frith

## Status
In Progress

## Date
2026-04-27

## Context
The product needs secure card collection and minimal operational complexity for MVP. Stripe handles sensitive card data; the app handles auth, identity mapping, and account UX.

## Goals / Non-Goals
### Goals
- Deliver secure auth (sign-up/sign-in/sign-out, email verification, reset password).
- Integrate Stripe Elements for card setup/updates.
- Persist one-to-one internal user to Stripe customer mapping.
- Keep architecture simple and aligned with constitution constraints.

### Non-Goals
- Subscription/invoice automation.
- Webhook-driven billing reconciliation in MVP.
- Storing local payment method cache.
- Admin invite management in MVP.

## Requirements
- Next.js application with responsive Shadcn/Tailwind UI.
- PostgreSQL in Docker, accessed via Drizzle ORM.
- next-auth for authentication and sessions.
- bcrypt for password hashing.
- React Hook Form + Zod for forms and validation.
- TanStack Query for async server interactions.
- Zustand only for advanced local UI state.

## Proposed Solution
### Architecture
- **Frontend**: Next.js app router pages for auth and billing.
- **Backend**: Next.js server handlers for auth, Stripe customer creation, and payment method operations.
- **Database**: PostgreSQL tables for users, verification/reset tokens, and billing customer mapping.
- **Payments**: Stripe Elements + Stripe API for customer/payment method lifecycle.
- **Local email testing**: Mailpit SMTP capture for verification/reset links.

### Primary Flows
1. **Sign-up**
   - Validate input.
   - Hash password with bcrypt.
   - Create user and verification token.
2. **Email verification**
   - Validate token.
   - Mark user as verified.
3. **Sign-in**
   - Validate credentials and session via next-auth.
4. **Password reset**
   - Issue token, verify token, set new bcrypt hash.
5. **Billing setup/update**
   - Ensure Stripe Customer exists for authenticated user.
   - Save/lookup `stripe_customer_id` in `billing_customers`.
   - Use Stripe Elements to add/update payment method.
   - Render payment method state live from Stripe.
6. **Local email delivery (dev)**
   - Send verification/reset emails through SMTP when configured.
   - Route local SMTP to Mailpit and validate links in Mailpit UI.

### Data Model
- `users`
- `email_verification_tokens`
- `password_reset_tokens`
- `billing_customers`

### Later-Phase Data Extension (Admin Invite)
- `admin_invites` (proposed): `id`, `email`, `token_hash`, `invited_by_user_id`, `expires_at`, `accepted_at`, `created_at`.

### Security
- No raw card data in local DB.
- Stripe secret key only on server.
- Token hashing and expiration for verification/reset.
- Auth checks on all billing operations.

## Alternatives Considered
- **Webhook-first design**: deferred to keep MVP smaller.
- **Local payment method cache**: rejected for MVP to reduce drift and complexity.

## Risks and Mitigations
- **Risk**: Email flows add setup overhead.  
  **Mitigation**: Keep provider abstraction minimal for local/dev + production readiness.
- **Risk**: Stripe API errors reduce UX quality.  
  **Mitigation**: explicit error states and retries where safe.

## Rollout Plan
1. Foundation: schema, auth, token flows.
2. Stripe customer mapping.
3. Elements billing UI + live reads.
4. Local Mailpit email delivery and manual QA.
5. Post-MVP admin invite workflow.

## Open Questions
- Production transactional email provider choice (Mailpit is local-only).
- Final admin permissions model for invite creation.
