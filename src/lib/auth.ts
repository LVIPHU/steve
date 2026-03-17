import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { bearer } from "better-auth/plugins/bearer";
import { db } from "@/db";
import {
  users,
  sessions,
  accounts,
  verification,
  profiles,
  websites,
} from "@/db/schema";

const RESERVED_USERNAMES = [
  "dashboard",
  "editor",
  "api",
  "login",
  "register",
  "settings",
  "pricing",
  "about",
  "admin",
];

const USERNAME_REGEX = /^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$/;

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: users,
      session: sessions,
      account: accounts,
      verification,
      profiles,
      websites,
    },
  }),
  emailAndPassword: { enabled: true },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  experimental: {
    joins: true,
  },
  user: {
    additionalFields: {
      username: {
        type: "string",
        required: false,
        input: true,
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          const username = (user as Record<string, unknown>).username as
            | string
            | undefined;
          if (username) {
            if (!USERNAME_REGEX.test(username)) {
              throw new Error("Invalid username format");
            }
            if (RESERVED_USERNAMES.includes(username)) {
              throw new Error("Username is reserved");
            }

            await db.insert(profiles).values({
              id: user.id,
              username: username.toLowerCase(),
              plan: "free",
              createdAt: new Date(),
              updatedAt: new Date(),
            });
          }
        },
      },
    },
  },
  plugins: [bearer(), nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
