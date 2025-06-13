import { compare } from "bcrypt-ts";
import NextAuth, { type User, type Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";

import { getUser } from "@/utils/db";

import { authConfig } from "./auth.config";

interface ExtendedSession extends Session {
  user: User;
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  trustHost: true,
  providers: [
    Credentials({
      credentials: {},
      async authorize(credentials: Record<string, string> | undefined) {
        if (!credentials) return null;
        const { email, password } = credentials;

        const user = await getUser(email);
        if (!user) return null;
        const passwordsMatch = await compare(password, user.password!);
        if (!passwordsMatch) return null;
        return {
          ...user,
          id: user.id.toString(),
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

      return token;
    },
    async session({
      session,
      token,
    }: {
      session: ExtendedSession;
      token: JWT;
    }) {
      if (session.user) {
        session.user.id = token.id as string;
      }

      return session;
    },
  },
});
