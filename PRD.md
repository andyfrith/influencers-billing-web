# PRD

## Product
Simple customer billing, clubs, and memberships web app.

## Problem
Customers need a secure and straightforward way to create an account, manage billing details, subscribe to clubs, and manage membership lifecycle requests.

## Users
- Customers who need to add and manage card details.
- Internal admins for controlled customer invites (later phase).

## Goals
- Support sign-up, sign-in, and sign-out.
- Store users in local PostgreSQL (Docker).
- Collect card details securely with Stripe Elements.
- Persist Stripe customer ID mapped to internal user ID.
- Support club subscriptions using Stripe subscriptions.
- Let users browse clubs, join clubs, and view members.
- Let users initiate cancellation requests handled by admins.
- Keep UX simple and responsive.

## Non-Goals (MVP)
- Invoicing and reporting.
- Admin invite management UI.
- Webhook-driven billing workflows.

## MVP Features
- Auth: sign-up, sign-in, sign-out, email verification, password reset.
- Billing setup: create Stripe Customer and store `stripe_customer_id`.
- Card management: add/update/remove default payment method with Stripe Elements.
- Billing view: display live, masked payment method details from Stripe.
- Clubs: list clubs, view club details, and view club members.
- Memberships: subscribe to club plans (multiple plans per club) via Stripe Subscriptions.
- Membership cancellations: member-initiated cancellation requests with admin resolution.
- Admin management: create clubs, create plans, process cancellation requests.
- Local testing email pipeline through Mailpit (verification and reset links).

## Current Delivery Status
- Implemented:
  - User sign-up/sign-in with email verification gating.
  - Forgot/reset password token flows.
  - Stripe customer mapping and card add/update/remove via Elements.
  - Club, plan, membership, and cancellation request data model and APIs.
  - Member and admin membership management pages.
  - Local Docker Postgres + Mailpit setup for manual flow testing.
- Planned later phase:
  - Admin invite workflow (invite-only onboarding flow and management endpoints/UI).

## Success Criteria
- A user can complete auth and attach a payment method.
- `user_id` to `stripe_customer_id` mapping is consistent and unique.
- No raw card data is stored in application database.
- User can subscribe to a club plan and see membership status.
- User can request membership cancellation; admin can resolve request.
- Core flows are usable on mobile and desktop.
- Local email verification/reset flow can be tested end-to-end via Mailpit.
