import { PrismaAdapter } from "@next-auth/prisma-adapter";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import GitHubProvider from "next-auth/providers/github";

import { env } from "~/env";
import { db } from "~/server/db";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

export const authOptions: NextAuthOptions = {
  callbacks: {
    signIn: async ({ user, account, profile }) => {

      const dbAccount = await db.account.findFirst({
        where: {
          providerAccountId: account?.providerAccountId,
          provider: account?.provider,
          userId: user?.id,
        },
      });

      await db.account.update({
        where: {
          id: dbAccount?.id,
          providerAccountId: account?.providerAccountId,
          provider: account?.provider,
          userId: user?.id,
        },
        data: {
          access_token: account?.access_token,
        }
      })
      return Promise.resolve(true);
    },
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
  adapter: PrismaAdapter(db),
  providers: [
    GitHubProvider({
      authorization: {
        params: { scope: "read:user user:email repo" },
      },
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),
  ],
};

export const getServerAuthSession = () => getServerSession(authOptions);