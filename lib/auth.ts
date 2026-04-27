import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { getUserByEmail } from "@/lib/users";
import { verifyPassword } from "@/lib/password";
import { signInSchema } from "@/lib/validators/auth";

/**
 * next-auth runtime configuration.
 */
export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign-in",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(rawCredentials) {
        const parsed = signInSchema.safeParse(rawCredentials);
        if (!parsed.success) {
          return null;
        }

        const user = await getUserByEmail(parsed.data.email);
        if (!user) {
          return null;
        }

        const isValidPassword = await verifyPassword(
          parsed.data.password,
          user.passwordHash,
        );

        if (!isValidPassword || !user.emailVerifiedAt) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) {
        token.sub = user.id;
      }
      if (user && "role" in user) {
        token.role = user.role as string;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      if (session.user) {
        session.user.role = typeof token.role === "string" ? token.role : "member";
      }

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
