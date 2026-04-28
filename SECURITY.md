# Security Audit and Hardening Log

This document is a living security record for the application. Update it on every meaningful auth, billing, admin, or infrastructure change.

## Audit Cadence

- Run a focused security review for each release candidate and for any change touching `app/api`, `lib/auth`, `lib/session`, `lib/stripe`, or admin routes.
- Record findings by severity, then track remediation status (`open`, `in progress`, `resolved`, `accepted risk`).
- Re-run this checklist after major dependency upgrades.

## Current Audit Snapshot (2026-04-28)

### Scope Reviewed

- API routes under `app/api/**`
- Session/authz helpers in `lib/session.ts`, `lib/auth.ts`, and `lib/authorization.ts`
- Token/password flows in `lib/users.ts` and `lib/crypto.ts`
- Admin surfaces in `app/admin/**` and `components/admin/**`
- Stripe integration in `lib/stripe.ts`

### Checks Performed

- Verified admin-only routes enforce `requireAdminSession()`.
- Verified authenticated billing/membership routes enforce `getAppSession()` checks.
- Verified verification/password reset tokens are random and only stored hashed.
- Verified password hashing uses bcrypt with non-trivial work factor.
- Reviewed admin bootstrap flow exposure and deployment posture.
- Reviewed user-enumeration behavior in reset flow.
- Reviewed cancellation flow ownership checks for member actions.

## Findings and Determinations

### High Severity

- **Public admin bootstrap capability**
  - **Observation:** `POST /api/admin/bootstrap/promote` allowed admin elevation with only knowledge of `ADMIN_BOOTSTRAP_KEY`; `/admin/bootstrap` page was publicly reachable.
  - **Risk:** Any leaked key could grant admin rights remotely.
  - **Determination:** Unacceptable for production exposure.
  - **Status:** Resolved.
  - **Measures taken:**
    - Added `isAdminBootstrapEnabled()` guard (requires `ENABLE_ADMIN_BOOTSTRAP=true` and non-production environment).
    - Added local-origin restriction (`localhost`/`127.0.0.1`/`::1`) for bootstrap API calls.
    - Redirected `/admin/bootstrap` away when bootstrap is disabled.
    - Hid bootstrap card from `/admin` when disabled.

### Medium Severity

- **No explicit route-level rate limiting on auth/admin-sensitive endpoints**
  - **Observation:** Sign-in, sign-up, password reset, and bootstrap endpoints do not have request throttling.
  - **Risk:** Brute force, credential stuffing, or noisy abuse.
  - **Determination:** Needs remediation before production hardening is considered complete.
  - **Status:** Open.

- **No explicit CSRF/origin validation framework on custom authenticated mutation routes**
  - **Observation:** Custom POST/PATCH/DELETE routes rely on session cookies and framework defaults, without centralized origin checks beyond bootstrap.
  - **Risk:** Defense-in-depth gap for cookie-authenticated mutations.
  - **Determination:** Should be implemented as a consistent middleware/utility policy.
  - **Status:** Open.

### Low Severity

- **Operational security logging is minimal**
  - **Observation:** Errors are logged, but security-relevant events (admin actions, failed elevation attempts, repeated auth failures) are not consistently structured.
  - **Risk:** Delayed incident detection and weaker forensic traceability.
  - **Determination:** Add structured audit events for sensitive actions.
  - **Status:** Open.

## Existing Controls Confirmed

- Role checks enforced via `requireAdminSession()` for admin management and cancellation resolution APIs.
- Passwords hashed with bcrypt (`SALT_ROUNDS=12`).
- Verification and reset tokens generated with cryptographically secure randomness and stored as SHA-256 hashes.
- Password reset request response avoids user enumeration by returning a neutral success message.
- Membership cancellation request route validates membership ownership before creating request records.

## Ongoing Security Checklist

- [ ] Add route-level rate limiting for auth, bootstrap, and admin mutation endpoints.
- [ ] Add centralized CSRF/origin validation for custom mutation routes.
- [ ] Add structured security audit logs (admin role changes, cancellation resolution actions, repeated failures).
- [ ] Add production runtime guardrails (safe defaults for bootstrap, strict env validation at startup).
- [ ] Add dependency vulnerability review step to release checklist.
- [ ] Add periodic manual pentest checklist (auth, authz, billing abuse cases, privilege escalation).

## Update Protocol

For each update to this file:

1. Record the date and changed scope.
2. List new findings with severity and exploit path.
3. Record determinations (fix now, defer, accept risk).
4. Link concrete code or config measures taken.
5. Reflect major remediation items in `ROADMAP.md`.
