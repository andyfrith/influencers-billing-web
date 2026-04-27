# PRD

## Product
Simple credit card management web app for customers.

## Problem
Customers need a secure and straightforward way to create an account, sign in, and manage a saved payment method.

## Users
- Customers who need to add and manage card details.
- Internal admins for controlled customer invites (later phase).

## Goals
- Support sign-up, sign-in, and sign-out.
- Store users in local PostgreSQL (Docker).
- Collect card details securely with Stripe Elements.
- Persist Stripe customer ID mapped to internal user ID.
- Keep UX simple and responsive.

## Non-Goals (MVP)
- Subscription lifecycle management.
- Invoicing and reporting.
- Admin console and invite management UI.
- Webhook-driven billing workflows.

## MVP Features
- Auth: sign-up, sign-in, sign-out, email verification, password reset.
- Billing setup: create Stripe Customer and store `stripe_customer_id`.
- Card management: add/update/remove default payment method with Stripe Elements.
- Billing view: display live, masked payment method details from Stripe.
- Local testing email pipeline through Mailpit (verification and reset links).

## Current Delivery Status
- Implemented:
  - User sign-up/sign-in with email verification gating.
  - Forgot/reset password token flows.
  - Stripe customer mapping and card add/update/remove via Elements.
  - Local Docker Postgres + Mailpit setup for manual flow testing.
- Planned later phase:
  - Admin invite workflow (invite-only onboarding flow and management endpoints/UI).

## Success Criteria
- A user can complete auth and attach a payment method.
- `user_id` to `stripe_customer_id` mapping is consistent and unique.
- No raw card data is stored in application database.
- Core flows are usable on mobile and desktop.
- Local email verification/reset flow can be tested end-to-end via Mailpit.
