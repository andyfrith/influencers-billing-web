import nodemailer from "nodemailer";

/**
 * Base URL for links inside outbound email bodies.
 */
function getAppBaseUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

/**
 * Returns true when SMTP settings are present (e.g. Mailpit in local Docker).
 */
export function isSmtpConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST?.trim());
}

/**
 * Builds a nodemailer transport when `SMTP_HOST` is set. Mailpit accepts
 * unauthenticated SMTP on port 1025 by default.
 */
export function createMailTransport(): nodemailer.Transporter | null {
  const host = process.env.SMTP_HOST?.trim();
  if (!host) {
    return null;
  }

  const port = Number(process.env.SMTP_PORT ?? "1025");
  const secure = process.env.SMTP_SECURE === "true";
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth:
      user && pass
        ? {
            user,
            pass,
          }
        : undefined,
  });
}

function getFromAddress(): string {
  return (
    process.env.EMAIL_FROM?.trim() ??
    "Influencers Billing <billing@localhost>"
  );
}

/**
 * Sends the email verification link. If SMTP is not configured, logs the link in non-production.
 */
export async function sendVerificationEmail(input: {
  to: string;
  token: string;
}): Promise<void> {
  const url = `${getAppBaseUrl()}/verify-email?token=${encodeURIComponent(input.token)}`;
  const transport = createMailTransport();

  if (!transport) {
    if (process.env.NODE_ENV !== "production") {
      console.info(`[email] Verification link for ${input.to}: ${url}`);
    }
    return;
  }

  await transport.sendMail({
    from: getFromAddress(),
    to: input.to,
    subject: "Verify your email",
    text: `Verify your account by opening this link:\n\n${url}\n`,
    html: `<p>Verify your account:</p><p><a href="${url}">${url}</a></p>`,
  });
}

/**
 * Sends the password reset link. If SMTP is not configured, logs the link in non-production.
 */
export async function sendPasswordResetEmail(input: {
  to: string;
  token: string;
}): Promise<void> {
  const url = `${getAppBaseUrl()}/reset-password?token=${encodeURIComponent(input.token)}`;
  const transport = createMailTransport();

  if (!transport) {
    if (process.env.NODE_ENV !== "production") {
      console.info(`[email] Password reset link for ${input.to}: ${url}`);
    }
    return;
  }

  await transport.sendMail({
    from: getFromAddress(),
    to: input.to,
    subject: "Reset your password",
    text: `Reset your password by opening this link (valid for a limited time):\n\n${url}\n`,
    html: `<p>Reset your password:</p><p><a href="${url}">${url}</a></p>`,
  });
}
