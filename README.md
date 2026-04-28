This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

Customer billing UI with Postgres, Drizzle, next-auth, and Stripe.

## Local services (Postgres + Mailpit)

1. Copy `.env.example` to `.env.local` and set variables (including `DATABASE_URL` and Stripe keys).
2. Start databases and Mailpit:

```bash
docker compose up -d db mailpit
```

3. Open **Mailpit** at [http://localhost:8025](http://localhost:8025) to read outbound mail (verification and password reset).
4. Point the app at Mailpit’s SMTP by setting in `.env.local`:

- `SMTP_HOST=localhost`
- `SMTP_PORT=1025`
- Optional: `EMAIL_FROM=Influencers Billing <billing@localhost>`

If `SMTP_HOST` is unset, the app still works in development by logging email links to the server console.

## Current implemented flows

- Auth:
  - Sign up (`/sign-up`)
  - Verify email (`/verify-email?token=...`)
  - Sign in (`/sign-in`)
  - Forgot/reset password (`/forgot-password`, `/reset-password?token=...`)
- Billing:
  - Authenticated billing screen (`/account/billing`)
  - Stripe Elements card add/update/remove
  - Live payment method reads from Stripe
- Clubs and memberships:
  - Club directory and detail pages (`/clubs`, `/clubs/[slug]`)
  - Club subscription via Stripe subscriptions
  - Membership list and cancellation requests (`/account/memberships`)
- Admin:
  - Admin dashboard (`/admin`)
  - Club creation/archival (`/admin/clubs`)
  - Plan creation/enable/disable (`/admin/clubs/[clubId]/plans`)
  - Cancellation queue processing (`/admin/cancellation-requests`)
  - Admin bootstrap promotion endpoint (`/api/admin/bootstrap/promote`)
- Local email testing:
  - Verification/reset messages are sent to Mailpit (when SMTP vars are configured)
  - Mailpit inbox UI: [http://localhost:8025](http://localhost:8025)

## Admin bootstrap (local)

1. Ensure a user exists (sign up normally).
2. Set `ADMIN_BOOTSTRAP_KEY` in `.env.local`.
3. Set `ENABLE_ADMIN_BOOTSTRAP=true` (bootstrap is disabled unless explicitly enabled).
3. Use Admin Bootstrap card at `/admin` (or call `/api/admin/bootstrap/promote`) with:
   - user email
   - bootstrap key
4. Bootstrap is restricted to non-production and local requests only.
5. Re-sign in if needed to refresh session role claims.

## Manual MVP local test checklist

1. `docker compose up -d db mailpit`
2. `bun run db:migrate`
3. `bun dev`
4. Sign up with a new email.
5. Open Mailpit and click verification link.
6. Confirm sign-in succeeds only after verification.
7. Trigger forgot-password and complete reset from Mailpit link.
8. Sign in and test billing card add/update/remove.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
