import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  boolean,
  timestamp,
  uuid,
  jsonb,
} from "drizzle-orm/pg-core";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const timestamps = (t: any) => ({
  createdAt: t.timestamp("created_at").defaultNow().notNull(),
  updatedAt: t.timestamp("updated_at").defaultNow().notNull(),
});

// --- Better-auth: user (table name "user") ---
export const users = pgTable("user", (t) => ({
  id: t.text("id").primaryKey(),
  name: t.text("name").notNull(),
  email: t.text("email").notNull().unique(),
  emailVerified: t.boolean("email_verified").notNull(),
  image: t.text("image"),
  createdAt: t.timestamp("created_at").notNull(),
  updatedAt: t.timestamp("updated_at").notNull(),
}));

// --- Better-auth: session ---
export const sessions = pgTable("session", (t) => ({
  id: t.text("id").primaryKey(),
  userId: t.text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  token: t.text("token").notNull(),
  expiresAt: t.timestamp("expires_at").notNull(),
  ipAddress: t.text("ip_address"),
  userAgent: t.text("user_agent"),
  createdAt: t.timestamp("created_at").notNull(),
  updatedAt: t.timestamp("updated_at").notNull(),
}));

// --- Better-auth: account ---
export const accounts = pgTable("account", (t) => ({
  id: t.text("id").primaryKey(),
  userId: t.text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  accountId: t.text("account_id").notNull(),
  providerId: t.text("provider_id").notNull(),
  accessToken: t.text("access_token"),
  refreshToken: t.text("refresh_token"),
  accessTokenExpiresAt: t.timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: t.timestamp("refresh_token_expires_at"),
  scope: t.text("scope"),
  idToken: t.text("id_token"),
  password: t.text("password"),
  createdAt: t.timestamp("created_at").notNull(),
  updatedAt: t.timestamp("updated_at").notNull(),
}));

// --- Better-auth: verification ---
export const verification = pgTable("verification", (t) => ({
  id: t.text("id").primaryKey(),
  identifier: t.text("identifier").notNull(),
  value: t.text("value").notNull(),
  expiresAt: t.timestamp("expires_at").notNull(),
  createdAt: t.timestamp("created_at").notNull(),
  updatedAt: t.timestamp("updated_at").notNull(),
}));

// --- App: profiles ---
export const profiles = pgTable("profiles", (t) => ({
  id: t.text("id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  username: t.text("username").unique().notNull(),
  plan: t.text("plan").default("free").notNull(),
  ...timestamps(t),
}));

// --- App: websites ---
export const websites = pgTable("websites", (t) => ({
  id: t.uuid("id").defaultRandom().primaryKey(),
  userId: t.text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: t.text("name").notNull(),
  slug: t.text("slug").notNull(),
  status: t.text("status").default("draft").notNull(),
  sourceNoteId: t.text("source_note_id"),
  templateId: t.text("template_id"),
  content: t.jsonb("content"),
  seoMeta: t.jsonb("seo_meta"),
  syncStatus: t.text("sync_status").default("idle"),
  lastSyncedAt: t.timestamp("last_synced_at"),
  ...timestamps(t),
}));

// --- Relations (for Better-auth experimental.joins) ---
export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  accounts: many(accounts),
  profiles: many(profiles),
  websites: many(websites),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(users, { fields: [profiles.id], references: [users.id] }),
}));

export const websitesRelations = relations(websites, ({ one }) => ({
  user: one(users, { fields: [websites.userId], references: [users.id] }),
}));

// --- Type exports ---
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
export type Website = typeof websites.$inferSelect;
export type NewWebsite = typeof websites.$inferInsert;
