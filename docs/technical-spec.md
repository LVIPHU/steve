# Technical Specification — Website Generator

**Phiên bản:** 3.0  
**Ngày:** 13/03/2026  
**Stack:** Next.js 16 App Router + Drizzle ORM v1.x + Better-auth + Supabase Postgres  
**Team:** 1 người (solo dev)

---

## Stack xác nhận

| Thành phần | Công nghệ | Ghi chú |
|---|---|---|
| Framework | Next.js 16 App Router | Turbopack default, proxy.ts thay middleware.ts |
| Auth | Better-auth | Drizzle adapter, lưu vào Supabase Postgres |
| ORM | Drizzle ORM | Kết nối Supabase Postgres qua connection string |
| Database | Supabase Postgres | Chỉ dùng như 1 Postgres host thuần |
| Storage | Supabase Storage | Upload ảnh |
| Backend logic | Next.js Server Actions + API Routes | Thay thế Supabase Edge Functions |
| Hosting | Vercel (free tier) | Native support Next.js |
| AI API | OpenAI / Anthropic Claude | Key của owner, trả phí theo usage |
| Analytics | Umami (self-hosted Railway) | Nhúng script vào website được gen |

### Supabase Free Tier — Giới hạn cần lưu ý

> Supabase trong stack này chỉ đóng vai trò **Postgres host + Storage**. Không dùng Supabase Auth, không dùng Edge Functions, không dùng RLS.

| Resource | Giới hạn |
|---|---|
| Database (Postgres) | 500 MB |
| Storage | 1 GB |
| Bandwidth | 5 GB/tháng |

### Vercel Free Tier — Giới hạn cần lưu ý

| Resource | Giới hạn |
|---|---|
| Serverless Function executions | 100 GB-hours/tháng |
| Bandwidth | 100 GB/tháng |
| Build minutes | 6.000 phút/tháng |
| Domains | Unlimited subdomains trên `.vercel.app` |

---

## Cấu trúc thư mục dự án (Next.js App Router)

```
app-website-generator/
├── app/
│   ├── (auth)/               # Route group: login, register
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/          # Route group: đã đăng nhập
│   │   ├── dashboard/
│   │   │   ├── websites/page.tsx     # Danh sách website
│   │   │   └── websites/new/page.tsx # Tạo mới
│   │   └── editor/[websiteId]/page.tsx
│   ├── [username]/           # Public website
│   │   └── [slug]/page.tsx   # SSR: appnote.com/username/slug
│   ├── api/
│   │   ├── auth/[...all]/route.ts    # Better-auth handler
│   │   ├── ai/generate/route.ts      # AI gen proxy
│   │   └── stripe/webhook/route.ts   # Stripe webhook
│   └── layout.tsx
├── src/
│   ├── db/
│   │   ├── index.ts          # Drizzle client
│   │   └── schema.ts         # Drizzle schema definitions
│   ├── lib/
│   │   ├── auth.ts           # Better-auth config
│   │   ├── auth-client.ts    # Better-auth client
│   │   └── stripe.ts         # Stripe config
│   ├── actions/              # Server Actions
│   │   ├── websites.ts
│   │   └── editor.ts
│   └── templates/            # Template definitions (hardcoded)
│       ├── index.ts
│       └── types.ts
├── drizzle.config.ts
└── proxy.ts                  # Auth route protection (Next.js 16)
```

---

## Level 1 — Nền tảng (không cần AI)

---

### 1.1 Auth & User Management

**Độ phức tạp:** `Low-Medium`

**Yêu cầu:** Đăng ký, đăng nhập, quản lý phiên, lưu username cho URL công khai.

#### Lý do chọn Better-auth thay vì Supabase Auth

| Tiêu chí | Supabase Auth | Better-auth |
|---|---|---|
| Kiểm soát schema | Ít — dùng bảng `auth.users` riêng | Hoàn toàn — schema trong Drizzle |
| Tích hợp với Drizzle | Không native | Có sẵn Drizzle adapter |
| Next.js middleware | Cần setup thêm | Built-in `getSession()` |
| OAuth providers | Google, GitHub, nhiều hơn | Google, GitHub, và nhiều hơn |
| Vendor lock-in | Cao (gắn với Supabase) | Thấp (chạy được trên mọi Postgres) |

#### Setup Better-auth với Drizzle

**`src/lib/auth.ts`:**
```typescript
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/db";
import * as schema from "@/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema, // truyền schema để Better-auth tự map bảng
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
      maxAge: 5 * 60, // cache session 5 phút — giảm DB query
    },
  },
  experimental: {
    joins: true, // 2-3x hiệu năng get-session (cần Drizzle relations)
  },
  plugins: [nextCookies()], // PHẢI là plugin cuối — cho phép set cookie trong Server Actions
});

// Type helper cho session
export type Session = typeof auth.$Infer.Session;
```

**`src/lib/auth-client.ts`:**
```typescript
import { createAuthClient } from "better-auth/react"; // import từ better-auth/react, không phải better-auth/client

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
});

export const { signIn, signUp, signOut, useSession } = authClient;
```

**`app/api/auth/[...all]/route.ts`:**
```typescript
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
export const { GET, POST } = toNextJsHandler(auth);
```

**`proxy.ts` — bảo vệ route dashboard (Next.js 16):**

Better-auth khuyến nghị pattern 2 lớp:
- **Lớp 1 — proxy.ts:** Cookie check nhanh (không hit DB) để redirect sớm
- **Lớp 2 — từng page/layout:** Validate session thật với DB

```typescript
// proxy.ts (thay thế middleware.ts trong Next.js 16)
import { getSessionCookie } from "better-auth/cookies";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  // Lớp 1: chỉ check cookie tồn tại — redirect nhanh, không tốn DB query
  // KHÔNG dùng làm kiểm tra bảo mật duy nhất
  if (!sessionCookie && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/editor/:path*"],
};
// Không cần export const runtime = 'edge' — Next.js 16 mặc định Node.js
```

```typescript
// app/(dashboard)/dashboard/page.tsx — Lớp 2: validate thật
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login"); // fallback an toàn
  return <h1>Welcome {session.user.name}</h1>;
}
```

#### Schema Better-auth (gen qua `npx auth@latest generate`)

Better-auth tự generate migration cho các bảng: `user`, `session`, `account`, `verification`. Chạy lệnh CLI để có Drizzle schema tương thích:

```bash
npx auth@latest generate
```

Ta chỉ cần thêm bảng `profiles` extend thêm thông tin app:

```typescript
// src/db/schema.ts — phần profiles (bảng của app, không phải Better-auth)
export const profiles = pgTable("profiles", (t) => ({
  id: t.text("id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  username: t.text("username").unique().notNull(),
  plan: t.text("plan").default("free").notNull(), // 'free' | 'premium'
  createdAt: t.timestamp("created_at").defaultNow().notNull(),
}));
```

#### Khuyến nghị

Dùng **Better-auth** với Drizzle adapter trên Supabase Postgres. Username được tạo bắt buộc khi đăng ký, validate không trùng với các reserved words (`dashboard`, `editor`, `api`, `login`...).

---

### 1.2 Database Schema (Drizzle)

**Độ phức tạp:** `Low`

**Yêu cầu:** Định nghĩa toàn bộ schema, type-safe, migrate dễ dàng.

#### Setup Drizzle

**`src/db/index.ts`:**
```typescript
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// prepare: false bắt buộc khi dùng Supabase Transaction Pool Mode
const client = postgres(process.env.DATABASE_URL!, { prepare: false });
export const db = drizzle({ client, schema });
export type DB = typeof db;
```

**`drizzle.config.ts`:**
```typescript
import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

#### Schema đầy đủ (Drizzle v1.x)

> **Lưu ý Drizzle v1.x:** Dùng callback syntax `(t) => ({})` thay vì import từng column riêng lẻ. Constraints dùng array `[]`. Type export qua `$inferSelect`/`$inferInsert`.

```typescript
// src/db/schema.ts
import { pgTable, relations } from "drizzle-orm/pg-core";

// --- Timestamps helper — tái sử dụng trên nhiều bảng ---
const timestamps = (t: any) => ({
  createdAt: t.timestamp("created_at").defaultNow().notNull(),
  updatedAt: t.timestamp("updated_at").defaultNow().notNull(),
});

// --- Better-auth tables (auto-generated bởi `npx auth@latest generate`) ---
// Sau khi chạy CLI, copy schema được gen vào đây
export const users = pgTable("user", (t) => ({
  id: t.text("id").primaryKey(),
  name: t.text("name").notNull(),
  email: t.text("email").notNull().unique(),
  emailVerified: t.boolean("email_verified").notNull(),
  image: t.text("image"),
  createdAt: t.timestamp("created_at").notNull(),
  updatedAt: t.timestamp("updated_at").notNull(),
}));

// Better-auth relations (cần cho experimental.joins)
export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  accounts: many(accounts),
  profiles: many(profiles),
  websites: many(websites),
}));

// --- App tables ---
export const profiles = pgTable("profiles", (t) => ({
  id: t.text("id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  username: t.text("username").unique().notNull(),
  plan: t.text("plan").default("free").notNull(), // 'free' | 'premium'
  ...timestamps(t),
}));

export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(users, { fields: [profiles.id], references: [users.id] }),
}));

export const websites = pgTable("websites", (t) => ({
  id: t.uuid("id").defaultRandom().primaryKey(),
  userId: t.text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: t.text("name").notNull(),
  slug: t.text("slug").notNull(),
  status: t.text("status").default("draft").notNull(), // 'draft' | 'published' | 'archived'
  sourceNoteId: t.text("source_note_id"),              // ID note nguồn trong app-note
  templateId: t.text("template_id"),
  content: t.jsonb("content"),                          // Website AST (JSON)
  seoMeta: t.jsonb("seo_meta"),                         // { title, description, ogImage, slug }
  ...timestamps(t),
}), (table) => [
  // Drizzle v1.x: constraints dùng array [], không phải object {}
]);

export const websitesRelations = relations(websites, ({ one }) => ({
  user: one(users, { fields: [websites.userId], references: [users.id] }),
}));

// --- Type exports ---
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Profile = typeof profiles.$inferSelect;
export type Website = typeof websites.$inferSelect;
export type NewWebsite = typeof websites.$inferInsert;
```

**Lệnh migration:**
```bash
# Bước 1: Gen Better-auth schema (chạy 1 lần đầu hoặc khi thêm plugin)
npx auth@latest generate

# Bước 2: Gen Drizzle migration file
npx drizzle-kit generate

# Bước 3: Apply migration lên Supabase Postgres
npx drizzle-kit migrate

# Dev nhanh (local) — push schema trực tiếp không tạo file migration
npx drizzle-kit push
```

---

### 1.3 Quản lý Website CRUD

**Độ phức tạp:** `Low`

**Yêu cầu:** Tạo, đọc, đổi tên, xóa website. Danh sách website của user.

#### Implement với Server Actions

```typescript
// src/actions/websites.ts
"use server";
import { db } from "@/db";
import { websites, profiles } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";

async function getCurrentUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");
  return session.user;
}

export async function getWebsites() {
  const user = await getCurrentUser();
  return db.select().from(websites).where(eq(websites.userId, user.id));
}

export async function deleteWebsite(id: string) {
  const user = await getCurrentUser();
  await db.delete(websites).where(
    and(eq(websites.id, id), eq(websites.userId, user.id))
  );
}

export async function updateWebsiteName(id: string, name: string) {
  const user = await getCurrentUser();
  await db.update(websites)
    .set({ name, updatedAt: new Date() })
    .where(and(eq(websites.id, id), eq(websites.userId, user.id)));
}
```

---

### 1.4 Template System

**Độ phức tạp:** `Low`

**Yêu cầu:** Bộ template cố định, phân loại theo chủ đề.

#### Implement — Hardcode trong codebase

```typescript
// src/templates/index.ts
export const TEMPLATES = [
  {
    id: "blog-minimal",
    name: "Blog Tối giản",
    category: "blog",
    thumbnail: "/templates/blog-minimal.png",
    description: "Layout đơn giản cho bài viết và chia sẻ kiến thức",
    sections: ["hero", "content", "about", "contact"],
  },
  {
    id: "portfolio-personal",
    name: "Portfolio Cá nhân",
    category: "portfolio",
    thumbnail: "/templates/portfolio-personal.png",
    description: "Giới thiệu bản thân, kỹ năng và dự án",
    sections: ["hero", "skills", "projects", "contact"],
  },
  {
    id: "fitness-tracker",
    name: "Fitness Journey",
    category: "fitness",
    thumbnail: "/templates/fitness-tracker.png",
    description: "Chia sẻ hành trình tập luyện và sức khỏe",
    sections: ["hero", "stats", "routine", "progress", "tips"],
  },
  {
    id: "cooking-blog",
    name: "Food Blog",
    category: "cooking",
    thumbnail: "/templates/cooking-blog.png",
    description: "Chia sẻ công thức nấu ăn và trải nghiệm ẩm thực",
    sections: ["hero", "featured-recipe", "recipe-list", "about"],
  },
  {
    id: "learning-journal",
    name: "Learning Journal",
    category: "education",
    thumbnail: "/templates/learning-journal.png",
    description: "Ghi lại hành trình học tập ngôn ngữ hoặc kỹ năng mới",
    sections: ["hero", "progress", "lessons", "resources"],
  },
] as const;
```

---

### 1.5 Trạng thái Draft / Published / Archived

**Độ phức tạp:** `Low`

| Trạng thái | URL công khai | Hành động cho phép |
|---|---|---|
| `draft` | 404 | Sửa, Publish, Xóa |
| `published` | Truy cập được | Sửa, về Draft, Archive, Xóa |
| `archived` | Hiện trang "không còn hoạt động" | Restore về Draft, Xóa |

```typescript
export async function updateWebsiteStatus(
  id: string,
  status: "draft" | "published" | "archived"
) {
  const user = await getCurrentUser();
  await db.update(websites)
    .set({ status, updatedAt: new Date() })
    .where(and(eq(websites.id, id), eq(websites.userId, user.id)));
}
```

---

## Level 2 — Publish & Hosting

---

### 2.1 Hosting & Serving Website Công khai

**Độ phức tạp:** `Low` (với Next.js — đây là điểm mạnh nhất khi chuyển sang Next.js)

**Yêu cầu:** Website published truy cập qua URL công khai, SEO tốt.

#### Implement — Next.js Dynamic Route với SSR

```typescript
// app/[username]/[slug]/page.tsx
import { db } from "@/db";
import { websites, profiles } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { notFound } from "next/navigation";
import { WebsiteRenderer } from "@/components/website-renderer";
import type { Metadata } from "next";

// Next.js 16: params là Promise — dùng PageProps helper từ `npx next typegen`
interface Props {
  params: Promise<{ username: string; slug: string }>;
}

// Lấy data phía server (SSR)
async function getWebsite(username: string, slug: string) {
  const result = await db
    .select({ website: websites })
    .from(websites)
    .innerJoin(profiles, eq(profiles.id, websites.userId))
    .where(
      and(
        eq(profiles.username, username),
        eq(websites.slug, slug),
        eq(websites.status, "published")
      )
    )
    .limit(1);

  return result[0]?.website ?? null;
}

// SEO metadata — params phải await trong Next.js 16
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username, slug } = await params; // bắt buộc await
  const website = await getWebsite(username, slug);
  if (!website) return {};
  const seo = website.seoMeta as any;
  return {
    title: seo?.title,
    description: seo?.description,
    openGraph: { images: [seo?.ogImage] },
  };
}

export default async function PublicWebsitePage({ params }: Props) {
  const { username, slug } = await params; // bắt buộc await trong Next.js 16
  const website = await getWebsite(username, slug);
  if (!website) notFound();
  return <WebsiteRenderer content={website.content} />;
}
```

**Lợi ích so với React + Vite:** HTML được render phía server → Google indexing đầy đủ, không cần workaround.

---

### 2.2 URL Routing & Slug Validation

**Độ phức tạp:** `Low`

**Yêu cầu:** URL `appnote.com/username/slug`, không conflict với route app.

#### Reserved usernames (validate khi đăng ký)

```typescript
const RESERVED_USERNAMES = [
  "dashboard", "editor", "api", "login", "register",
  "settings", "pricing", "about", "blog", "admin"
];
```

#### Slug validation

```typescript
// Chỉ cho phép: chữ thường, số, dấu gạch ngang
const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const isValidSlug = (slug: string) => slugRegex.test(slug) && slug.length <= 60;
```

---

## Level 3 — AI Core

---

### 3.1 AI Gen Website

**Độ phức tạp:** `High`

**Yêu cầu:** Từ note content + template + prompt → sinh Website AST (JSON).

#### Kiến trúc: Next.js API Route làm AI proxy

```
Client → POST /api/ai/generate → OpenAI API
```

API Route giữ API key bí mật, validate auth trước khi gọi AI.

```typescript
// app/api/ai/generate/route.ts
import { auth } from "@/lib/auth";
import OpenAI from "openai";
import { headers } from "next/headers";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { noteContent, templateId, userPrompt } = await req.json();

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `Bạn là AI tạo cấu trúc website từ nội dung note.
Output PHẢI là JSON hợp lệ theo schema: { theme, sections[], seo }.
Mỗi section có: id, type, content (object).`,
      },
      {
        role: "user",
        content: `Note: ${noteContent}\nTemplate: ${templateId}\nYêu cầu: ${userPrompt}`,
      },
    ],
  });

  const websiteAST = JSON.parse(completion.choices[0].message.content!);
  return Response.json({ website: websiteAST });
}
```

#### Website AST — định dạng JSON trung gian

AI không sinh HTML trực tiếp. Thay vào đó sinh JSON (Website AST) để Editor có thể đọc/ghi từng field:

```json
{
  "theme": {
    "primaryColor": "#2563eb",
    "backgroundColor": "#ffffff",
    "font": "Inter"
  },
  "sections": [
    {
      "id": "hero-1",
      "type": "hero",
      "content": {
        "headline": "Hành Trình Học Tiếng Nhật 90 Ngày",
        "subtext": "Từ con số 0 đến N3...",
        "ctaText": "Đọc câu chuyện"
      },
      "ai_content": { "headline": "Hành Trình Học Tiếng Nhật 90 Ngày" },
      "manual_overrides": {}
    }
  ],
  "seo": {
    "title": "Hành Trình N3 | Nguyễn Văn A",
    "description": "Chia sẻ kinh nghiệm học tiếng Nhật...",
    "slug": "hanh-trinh-n3"
  }
}
```

> **Quy tắc render:** Dùng `manual_overrides[field]` nếu tồn tại, ngược lại dùng `ai_content[field]`.  
> **Quy tắc sync:** Khi auto-sync từ note, chỉ update `ai_content`, không bao giờ ghi đè `manual_overrides`.

#### Chi phí ước tính AI

| Trường hợp | Token/lần | Chi phí (GPT-4o) |
|---|---|---|
| Note ngắn (~500 chữ) | ~2.000 tokens | ~$0.003 |
| Note dài (~2.000 chữ) | ~5.000 tokens | ~$0.008 |
| Gen lại 1 section | ~1.000 tokens | ~$0.002 |

---

### 3.2 AI Gợi ý Template

**Độ phức tạp:** `Low`

**Khuyến nghị:** Giai đoạn 1 dùng **rule-based keyword matching** — miễn phí, đủ dùng:

```typescript
// src/lib/template-suggester.ts
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  fitness: ["tập", "gym", "workout", "calo", "chạy", "thể dục"],
  cooking: ["nấu", "món", "công thức", "nguyên liệu", "recipe"],
  language: ["tiếng", "từ vựng", "ngữ pháp", "học", "vocabulary"],
  programming: ["code", "lập trình", "function", "API", "bug"],
  portfolio: ["dự án", "kỹ năng", "kinh nghiệm", "project"],
};

export function suggestTemplates(noteContent: string): string[] {
  const lower = noteContent.toLowerCase();
  const scores = Object.entries(CATEGORY_KEYWORDS).map(([cat, keywords]) => ({
    cat,
    score: keywords.filter(k => lower.includes(k)).length,
  }));
  return scores.sort((a, b) => b.score - a.score).slice(0, 3).map(s => s.cat);
}
```

Upgrade lên AI classification khi keyword matching không đủ chính xác.

---

### 3.3 SEO Auto-gen

**Độ phức tạp:** `Low` (gộp trong AI gen call)

SEO được gen trong cùng JSON output với website (xem `seo` object trong Website AST ở 3.1). Không cần API call riêng.

**OG Image:** Dùng Next.js `ImageResponse` (built-in) để gen ảnh OG động:

```typescript
// app/[username]/[slug]/opengraph-image.tsx
import { ImageResponse } from "next/og";
import { db } from "@/db";
import { websites, profiles } from "@/db/schema";
import { eq, and } from "drizzle-orm";

// Next.js 16: params phải là Promise và được await
export default async function OGImage({
  params,
}: {
  params: Promise<{ username: string; slug: string }>;
}) {
  const { username, slug } = await params; // bắt buộc await trong Next.js 16

  const result = await db
    .select({ seoMeta: websites.seoMeta })
    .from(websites)
    .innerJoin(profiles, eq(profiles.id, websites.userId))
    .where(and(eq(profiles.username, username), eq(websites.slug, slug)))
    .limit(1);

  const seo = result[0]?.seoMeta as any;
  const title = seo?.title ?? "Website";

  return new ImageResponse(
    <div style={{ display: "flex", fontSize: 48, background: "#2563eb", color: "white", width: "100%", height: "100%", alignItems: "center", justifyContent: "center", padding: "40px" }}>
      {title}
    </div>,
    { width: 1200, height: 630 }
  );
}
```

---

### 3.4 Gen lại / Tinh chỉnh bằng Prompt

**Độ phức tạp:** `Low` (tái dùng API route từ 3.1)

| Hành động | Payload gửi `/api/ai/generate` |
|---|---|
| Gen lại toàn bộ | `{ noteContent, templateId, userPrompt }` |
| Gen lại 1 section | `{ sectionType, currentContent, userPrompt, mode: "section" }` |
| Tinh chỉnh | `{ currentAST, refinementPrompt, mode: "refine" }` |

---

## Level 4 — Editor

---

### 4.1 Preview Responsive

**Độ phức tạp:** `Low`

3 button chuyển đổi, dùng `<iframe>` với CSS transform scale:

```tsx
const SIZES = {
  desktop: "100%",
  tablet: "768px",
  mobile: "375px",
};

// iframe src trỏ vào route /preview/[websiteId] — Server Component render website
<div style={{ width: SIZES[mode], margin: "0 auto", transition: "width 0.3s" }}>
  <iframe src={`/preview/${websiteId}`} style={{ width: "100%", height: "100vh", border: "none" }} />
</div>
```

---

### 4.2 Sửa Text và Ảnh

**Độ phức tạp:** `Medium`

**Khuyến nghị v1 — Sidebar form** (đơn giản, ít bug hơn inline editing):

- Click vào section trong preview → sidebar mở ra với các field tương ứng
- User sửa → update `manual_overrides` trong local state
- Nhấn "Lưu" → Server Action ghi vào DB

**Upload ảnh → Supabase Storage:**

```typescript
// src/actions/editor.ts
export async function uploadImage(formData: FormData) {
  const user = await getCurrentUser();
  const file = formData.get("file") as File;
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );

  const path = `${user.id}/${Date.now()}-${file.name}`;
  await supabase.storage.from("website-images").upload(path, buffer);
  const { data } = supabase.storage.from("website-images").getPublicUrl(path);
  return data.publicUrl;
}
```

---

### 4.3 Kéo Thả Section

**Độ phức tạp:** `Medium`

Dùng **`@dnd-kit/core`** — nhẹ (~10KB), không có vấn đề với React 18/19 Strict Mode:

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

Logic: sections lưu trong mảng JSON. Kéo thả chỉ là reorder mảng → ghi vào `manual_overrides.sectionOrder`.

---

### 4.4 Tùy Chỉnh Màu Sắc và Font

**Độ phức tạp:** `Low`

Dùng CSS Variables inject vào `<WebsiteRenderer>`:

```tsx
<div style={{
  "--color-primary": theme.primaryColor,
  "--font-family": `'${theme.font}', sans-serif`,
} as React.CSSProperties}>
  {/* sections */}
</div>
```

**Color picker:** Native `<input type="color">` — không cần thư viện.  
**Font:** Load từ Google Fonts, cho chọn 5–8 font phổ biến (Inter, Roboto, Playfair Display, Montserrat, Lora).

---

## Level 5 — Tính năng phức tạp nhất

---

### 5.1 Auto-sync Note ↔ Website

**Độ phức tạp:** `High`

**Yêu cầu:** Khi note thay đổi trong app-note, website tự động cập nhật nội dung.

#### Luồng kỹ thuật

```
User sửa note trong app-note
  → app-note gọi API: POST /api/sync/trigger { noteId, noteContent }
  → Next.js API Route xác thực request
  → Query tất cả websites có sourceNoteId = noteId
  → Với mỗi website: gọi OpenAI gen lại ai_content
  → Merge: giữ manual_overrides, update ai_content
  → UPDATE websites SET content = merged WHERE id = ?
```

#### Debounce để tiết kiệm AI call

Không sync ngay mỗi keystroke. Dùng debounce 5 phút tại app-note trước khi gọi `/api/sync/trigger`.

#### Bảo toàn tùy chỉnh thủ công

```typescript
function mergeContent(currentAST: WebsiteAST, newAIContent: Partial<WebsiteAST>): WebsiteAST {
  return {
    ...currentAST,
    sections: currentAST.sections.map(section => ({
      ...section,
      ai_content: newAIContent.sections?.find(s => s.id === section.id)?.ai_content ?? section.ai_content,
      // manual_overrides KHÔNG bao giờ bị thay đổi ở đây
    })),
  };
}
```

---

### 5.2 Analytics

**Độ phức tạp:** `Low` (nếu dùng Umami)

**Khuyến nghị: Umami self-hosted trên Railway**

- Deploy Umami lên Railway free tier (PostgreSQL + Node.js)
- Nhúng script vào `<WebsiteRenderer>` khi website published:

```tsx
// Trong layout của public website
{process.env.NEXT_PUBLIC_UMAMI_ID && (
  <script
    defer
    src="https://umami.yourdomain.com/script.js"
    data-website-id={process.env.NEXT_PUBLIC_UMAMI_ID}
    data-domains="appnote.com"
  />
)}
```

Dashboard Umami cung cấp: lượt xem, nguồn traffic, thiết bị, vị trí — không cần tự build.

---

## Tổng hợp — Kiến trúc hệ thống

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js 16 App Router                     │
│                        (Vercel)                             │
│                                                             │
│  Server Components    Server Actions    API Routes          │
│  (data fetching)      (mutations)       /api/ai/generate    │
│        │              updateTag()       /api/auth/[...all]  │
│        │              refresh()         /api/sync/trigger   │
│    "use cache"                                              │
│                                                             │
│  proxy.ts (Node.js runtime — thay middleware.ts)            │
└──────────────┬──────────────────────────────────────────────┘
               │
       Drizzle ORM v1.x (type-safe queries)
               │
┌──────────────▼──────────────────────────────────────────────┐
│                       Supabase                               │
│            (Postgres host + Storage only)                   │
│                                                             │
│   Tables: user, session, account, verification              │
│            profiles, websites                               │
│   Storage: website-images bucket                            │
└─────────────────────────────────────────────────────────────┘
               │
    ┌──────────┼───────────┐
    ▼          ▼           ▼
 Better-auth  OpenAI    Umami
 (sessions)  (gen AI)  (analytics)
```

---

## Environment Variables

```bash
# Database
DATABASE_URL=postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres

# Supabase Storage
NEXT_PUBLIC_SUPABASE_URL=https://[project].supabase.co
SUPABASE_SERVICE_KEY=...

# Better-auth
BETTER_AUTH_SECRET=...
BETTER_AUTH_URL=https://yourdomain.com

# OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# AI
OPENAI_API_KEY=...

# App
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

---

## Roadmap kỹ thuật đề xuất

| Phase | Tính năng | Thời gian ước tính |
|---|---|---|
| **Phase 1** | Setup Next.js + Drizzle + Better-auth + Schema DB | 3–5 ngày |
| **Phase 2** | CRUD website + Template system | 3–5 ngày |
| **Phase 3** | AI gen website + Publish route SSR + SEO | 5–7 ngày |
| **Phase 4** | Editor (sidebar + ảnh + màu/font + kéo thả) | 7–10 ngày |
| **Phase 5** | Auto-sync note ↔ website + Umami | 5–7 ngày |

**Tổng ước tính:** 23–34 ngày làm việc cho 1 người full-time.

---

## Next.js 16 — Tính năng mới quan trọng

---

### Cache Components (`"use cache"`)

Next.js 16 thay thế mô hình cache cũ bằng **Cache Components** — opt-in hoàn toàn, mọi thứ dynamic by default.

Bật trong `next.config.ts`:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true, // thay experimental.dynamicIO
  reactCompiler: true,   // React Compiler stable — tự động memoize
};

export default nextConfig;
```

Dùng `"use cache"` directive để cache component hoặc function:

```typescript
// Cache một Server Component
async function WebsiteList({ userId }: { userId: string }) {
  "use cache";
  cacheTag(`user-websites-${userId}`);
  cacheLife("hours"); // cache trong vài giờ

  const data = await db.select().from(websites).where(eq(websites.userId, userId));
  return <ul>{data.map(w => <li key={w.id}>{w.name}</li>)}</ul>;
}
```

---

### Cache APIs mới trong Server Actions

**`updateTag()`** — invalidate cache và refresh ngay lập tức (read-your-writes):

```typescript
// src/actions/websites.ts
"use server";
import { updateTag } from "next/cache";

export async function updateWebsiteName(id: string, name: string) {
  const user = await getCurrentUser();
  await db.update(websites).set({ name, updatedAt: new Date() })
    .where(and(eq(websites.id, id), eq(websites.userId, user.id)));

  // User thấy thay đổi ngay lập tức
  updateTag(`user-websites-${user.id}`);
}
```

**`revalidateTag()` (cập nhật)** — invalidate và revalidate nền (stale-while-revalidate):

```typescript
import { revalidateTag } from "next/cache";

// Next.js 16: bắt buộc có argument thứ 2 là cacheLife profile
revalidateTag(`user-websites-${userId}`, "hours");
```

**`refresh()`** — refresh router sau khi mutation không có cache:

```typescript
import { refresh } from "next/cache";

export async function markNotificationAsRead(id: string) {
  await db.update(notifications).set({ read: true }).where(eq(notifications.id, id));
  refresh(); // refresh UI mà không đụng cache
}
```

---

### Turbopack (default)

Next.js 16 dùng Turbopack làm bundler mặc định — không cần config thêm:

- Dev Fast Refresh nhanh hơn 5-10x
- Build nhanh hơn 2-5x
- Opt-out: `next build --webpack` (nếu cần webpack config cũ)

---

### React 19.2 + React Compiler

React 19.2 đi kèm Next.js 16 với các tính năng mới:

| Tính năng | Mô tả |
|---|---|
| `<ViewTransition>` | Animate khi navigate giữa các trang |
| `<Activity>` | Render "background" với `display: none`, giữ state |
| `useEffectEvent()` | Extract non-reactive logic từ Effect |

React Compiler tự động memoize components (bật qua `reactCompiler: true`).

---

## Quyết định kỹ thuật quan trọng — Tóm tắt

| Vấn đề | Quyết định | Lý do |
|---|---|---|
| Auth library | Better-auth | Schema kiểm soát qua Drizzle, không vendor lock-in |
| Auth route protection | proxy.ts 2 lớp | Cookie check nhanh + DB validate tại page |
| ORM | Drizzle v1.x | Type-safe, migration rõ ràng, nhẹ hơn Prisma |
| DB connection | `prepare: false` | Bắt buộc với Supabase Transaction Pool |
| AI output format | JSON AST (không phải HTML) | Editor có thể đọc/ghi từng field |
| Public website serving | Next.js SSR dynamic route | SEO out-of-the-box, không cần workaround |
| Backend | Server Actions + API Routes | Không cần Supabase Edge Functions |
| Cache invalidation | `updateTag()` trong Server Actions | Read-your-writes, user thấy thay đổi ngay |
| Analytics | Umami self-hosted | $0, đầy đủ tính năng, không tự build |
| Image storage | Supabase Storage | $0 trong giới hạn free |
| AI sync debounce | 5 phút | Tránh quá nhiều AI call tốn tiền |
| Session performance | Cookie Cache 5 phút | Giảm DB query cho `getSession` |
| Session accuracy | `experimental.joins` Drizzle | 2-3x hiệu năng `get-session` |
