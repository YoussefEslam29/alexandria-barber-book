# DEVELOPER_LOG.md — Kral Salon

> **Last Updated:** 2026-04-17  
> **Project ID (Supabase):** `cfqfzoxauciipokdrjrs`  
> **Stack:** Vite + React 18 + TypeScript + Tailwind CSS + Supabase (Postgres + Auth + RLS)  
> **Design System:** "Sovereign Industrial" — Matte Black / Cyan Accent / Serif Typography  

---

## 1. Current Architectural State

### 1.1 Overview

Kral Salon has evolved from a static landing page into a **full SaaS-grade appointment management system**. The frontend is a single-page React application served by Vite, while Supabase provides the backend (Postgres database, Auth, Row-Level Security). There is **no custom backend server** — all business logic executes client-side through the Supabase JS SDK.

### 1.2 Design Philosophy — "Sovereign Industrial"

The visual identity is built around three pillars:

| Pillar | Implementation |
|--------|---------------|
| **Matte Black Surfaces** | Background `#111416`, surface layers `#191c1e` → `#1d2022` → `#272a2c` → `#323537` |
| **Cyan Accent Glow** | Primary `#00dbe7` (HSL 183 100% 45%), gradient `#00dbe7 → #00929a`, ambient glow `rgba(0, 219, 231, 0.08)` |
| **Serif Typography** | Headings: `Noto Serif` (serif), Body/Labels: `Manrope` (sans-serif) |

Custom utility classes in `index.css`:
- `bg-primary-gradient` — 135° gradient from primary to deep teal
- `ghost-border` — 1px solid rgba(68, 71, 78, 0.2)
- `ambient-shadow` — diffused cyan box-shadow

### 1.3 Frontend Architecture

```
src/
├── App.tsx                    # Root: QueryClient, LanguageProvider, BrowserRouter
├── main.tsx                   # ReactDOM entrypoint
├── index.css                  # CSS custom properties (design tokens)
├── pages/
│   ├── Index.tsx              # Public landing page (all sections + modals)
│   ├── AdminDashboard.tsx     # Protected admin panel (/admin)
│   └── NotFound.tsx           # 404 catch-all
├── components/
│   ├── Navbar.tsx             # Fixed nav with Book Now + Track My Booking
│   ├── HeroSection.tsx        # Hero banner with CTA
│   ├── ExperienceSection.tsx  # Three-column video gallery + feature cards
│   ├── ServicesSection.tsx    # Services grid (from Supabase)
│   ├── BarbersSection.tsx     # Team cards with "Book with me" CTA
│   ├── MasterpieceSection.tsx # Instagram-style gallery grid
│   ├── AboutSection.tsx       # Location, hours, contact info
│   ├── BookingModal.tsx       # Frictionless public booking form
│   ├── BookingTracker.tsx     # Public status lookup by phone number
│   ├── MyBookings.tsx         # Legacy auth-based booking view
│   ├── AuthModal.tsx          # Sign-in / Sign-up modal (admin use only)
│   ├── WhatsAppButton.tsx     # Floating WhatsApp CTA
│   ├── Footer.tsx             # Site footer
│   └── ui/                    # shadcn/ui primitives
├── i18n/
│   ├── LanguageContext.tsx     # React context for EN/AR toggle
│   └── translations.ts        # All UI string translations
├── lib/
│   ├── supabase-helpers.ts    # All Supabase CRUD operations
│   └── utils.ts               # Utility functions (formatTime12h, cn)
├── hooks/
│   └── useAuth.ts             # Supabase auth state hook
└── integrations/
    └── supabase/
        ├── client.ts          # Supabase client instance
        └── types.ts           # Generated TypeScript types
```

### 1.4 Routing

| Route | Component | Access |
|-------|-----------|--------|
| `/` | `Index.tsx` | Public |
| `/admin` | `AdminDashboard.tsx` | Auth-gated (barber role check) |
| `*` | `NotFound.tsx` | Public |

### 1.5 Internationalization (i18n)

The app supports **English** and **Arabic** via `LanguageContext`. All UI strings are centralized in `translations.ts` as `{ en: string, ar: string }` objects. The toggle is available in the Navbar. Arabic mode does **not** currently flip layout direction (no RTL transform).

---

## 2. Database Schema Evolution

**Supabase Project:** `cfqfzoxauciipokdrjrs`  
**Region:** (Check Supabase dashboard)

### 2.1 `bookings` — Appointment Records

The bookings table has evolved from a simple auth-linked insert to a **frictionless, guest-first** model with lifecycle management.

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | uuid | NO | `gen_random_uuid()` | Primary key |
| `user_id` | uuid | **YES** | `null` | Nullable — guest bookings set this to `null` |
| `service_id` | uuid | NO | — | FK → `services.id` |
| `booking_date` | date | NO | — | |
| `booking_time` | time | NO | — | |
| `status` | text | NO | `'pending'` | CHECK constraint: `pending`, `accepted`, `confirmed`, `completed`, `cancelled`, `rejected` |
| `notes` | text | YES | — | Customer notes |
| `customer_name` | text | NO | `''` | Guest booking identity |
| `customer_phone` | text | NO | `''` | Guest booking identity |
| `customer_email` | text | YES | `''` | |
| `customer_age` | integer | YES | — | For BI analytics |
| `barber` | text | YES | `''` | Barber name string (not FK) |
| `rejection_reason` | text | YES | — | Admin-supplied reason when `status = 'rejected'` |
| `is_walkin` | boolean | NO | `false` | `true` for admin-created walk-in entries |
| `created_at` | timestamptz | NO | `now()` | |
| `updated_at` | timestamptz | NO | `now()` | |

**Key Migration History:**
1. `user_id` changed from `NOT NULL` → `NULL` (fixed the Ghost Error bug)
2. `status` constraint expanded from `[pending, confirmed, completed, cancelled]` → added `accepted`, `rejected`
3. `rejection_reason` column added
4. `is_walkin` column added
5. `customer_name`, `customer_phone`, `customer_email`, `customer_age`, `barber` columns added for the frictionless flow

### 2.2 `customers` — Loyalty Tracking

A separate table for tracking repeat visitors by phone number (independent of Supabase Auth).

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | uuid | NO | `gen_random_uuid()` | Primary key |
| `full_name` | text | NO | — | |
| `phone` | text | NO | — | Unique identifier for repeat visits |
| `email` | text | YES | — | |
| `age` | integer | YES | — | |
| `visit_count` | integer | NO | `0` | Incremented on each booking |
| `created_at` | timestamptz | NO | `now()` | |
| `updated_at` | timestamptz | NO | `now()` | |

**Loyalty Rule:** When `visit_count >= 5`, the customer is flagged for a free 6th visit in the admin dashboard.

### 2.3 `profiles` — Authenticated User Profiles

Linked to Supabase Auth via `user_id`. Primarily used for **admin role verification**.

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | uuid | NO | `gen_random_uuid()` | Primary key |
| `user_id` | uuid | NO | — | FK → `auth.users.id` |
| `full_name` | text | YES | — | |
| `phone` | text | YES | — | Legacy field |
| `phone_number` | text | YES | — | Newer field (same purpose) |
| `age` | integer | YES | — | Used in BI avg-age calculation |
| `email` | text | YES | — | |
| `role` | text | YES | `'user'` | |
| `is_barber` | boolean | NO | `false` | **Admin access gate** — only `true` profiles can access `/admin` |
| `created_at` | timestamptz | NO | `now()` | |
| `updated_at` | timestamptz | NO | `now()` | |

### 2.4 `services` — Service Catalog

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | uuid | NO | `gen_random_uuid()` | Primary key |
| `name` | text | NO | — | English name |
| `name_ar` | text | YES | — | Arabic name |
| `description` | text | YES | — | |
| `price` | numeric | NO | — | In EGP |
| `duration_minutes` | integer | NO | `30` | |
| `created_at` | timestamptz | NO | `now()` | |

### 2.5 `gallery` — Masterpiece Section

Read-only table for the Instagram-style gallery. Managed directly in Supabase.

### 2.6 Row-Level Security (RLS) Policies

| Table | Policy | Command | Rule |
|-------|--------|---------|------|
| `bookings` | Anyone can create bookings | INSERT | `true` |
| `bookings` | Anyone can read bookings | SELECT | `true` |
| `bookings` | Barbers can view all bookings | SELECT | `profiles.is_barber = true` |
| `bookings` | Barbers can update any booking | UPDATE | `profiles.is_barber = true` |
| `customers` | Anyone can insert customers | INSERT | `true` |
| `customers` | Anyone can read customers | SELECT | `true` |
| `customers` | Anyone can update customers | UPDATE | `true` |
| `profiles` | Profiles viewable by everyone | SELECT | `true` |
| `profiles` | Users can insert own profile | INSERT | `auth.uid()` check |
| `profiles` | Users can update own profile | UPDATE | `auth.uid() = user_id` |
| `services` | Services are viewable by everyone | SELECT | `true` |
| `gallery` | Gallery viewable by everyone | SELECT | `true` |

---

## 3. Logic & Workflow

### 3.1 Appointment Lifecycle

The system implements a **managed appointment lifecycle** with admin-driven state transitions:

```
                                    ┌──────────────┐
                                    │   REJECTED   │
                                    │ (+ reason)   │
                                    └──────┬───────┘
                                           │ Reject
    ┌─────────┐     Accept     ┌───────────┴──┐     Complete     ┌───────────┐
    │ PENDING │ ─────────────→ │   ACCEPTED   │ ──────────────→  │ COMPLETED │
    └─────────┘                └──────────────┘                  └───────────┘
         │                           │
         │ Cancel                    │ Cancel
         ▼                           ▼
    ┌───────────┐             ┌───────────┐
    │ CANCELLED │             │ CANCELLED │
    └───────────┘             └───────────┘
```

**Status definitions:**
| Status | Meaning | Who triggers |
|--------|---------|-------------|
| `pending` | New booking awaiting review | System (default) |
| `accepted` | Admin approved — client should come | Admin |
| `completed` | Haircut done, service rendered | Admin |
| `rejected` | Admin declined with reason | Admin (via rejection modal) |
| `cancelled` | Client or admin cancelled | Either party |
| `confirmed` | Legacy status (kept for backward compat) | — |

### 3.2 Frictionless Booking Flow (Public)

1. User opens `BookingModal` (no authentication required)
2. Fills: Name, Phone, Email, Age, Service, Barber, Date, Time, Notes
3. On submit → `createPublicBooking()`:
   - Calls `findOrCreateCustomer()` — upserts into `customers` table by phone
   - Inserts into `bookings` with `user_id: null`, `status: 'pending'`
4. Success toast: "Your appointment request has been submitted."
5. User can track status via **"Track My Booking"** (phone lookup → `BookingTracker`)

### 3.3 Manual Walk-in Entry (Admin)

Admins can record walk-in clients directly from the dashboard:

1. Click **"+ Add Walk-in"** button → opens walk-in modal
2. Fill: Client Name, Phone, Age (optional), Barber, Service, Time, Status
3. Status can be set to `accepted` (in-progress) or `completed` (already done)
4. On submit → `createWalkinBooking()`:
   - Sets `is_walkin: true`, `booking_date: today`
   - Also calls `findOrCreateCustomer()` for loyalty tracking
5. Walk-in bookings display a green "Walk-in" badge in the admin list

### 3.4 Rejection Flow

1. Admin clicks **"Reject"** on a pending booking
2. A modal opens requiring a **rejection reason** (mandatory textarea)
3. On confirm → `updateBookingStatus(id, 'rejected', reason)`
4. The rejection reason is stored in `rejection_reason` column
5. Users see the reason in `BookingTracker` as a red alert box

### 3.5 Admin Authentication

- Admin login is done via Supabase email/password auth at `/admin`
- On successful auth, the system queries `profiles` for `is_barber = true`
- If not a barber → access denied, session terminated
- The admin dashboard has its own embedded login form (`AdminLoginForm`)

---

## 4. Resolved Blockers

### 4.1 The "Ghost Error" Bug ✅

**Symptom:** Users would book an appointment, receive an error toast ("Booking failed"), but the booking was actually committed to the database.

**Root Cause:** The `bookings.user_id` column was `NOT NULL`, but the frictionless booking flow (introduced to remove auth barriers) never supplies a `user_id`. The insert would fail at the Postgres constraint level, but due to a race condition in the promise chain, the UI would sometimes show a false error even on partial success.

**Fix:**
1. Migration: `ALTER TABLE bookings ALTER COLUMN user_id DROP NOT NULL`
2. Code: Explicitly sets `user_id: null` in `createPublicBooking()`
3. Added deterministic error check: `if (!data) throw new Error("Booking was not created")`
4. Ensured the toast only fires on confirmed success/error

### 4.2 Auth Rate Limit Bypass ✅

**Symptom:** New user signups would fail with "Too many attempts" after just a few tries during testing.

**Root Cause:** Supabase enforces rate limits on email confirmation sends.

**Fix:** Email confirmation was disabled in the Supabase dashboard (Authentication → Providers → Email → `Confirm Email` = OFF). This allows immediate login post-signup. A `rateLimitTitle` / `rateLimitDesc` i18n pair was added for graceful UI handling if rate limits are ever re-encountered.

### 4.3 Admin Route Mismatch ✅

**Symptom:** Admin dashboard was inaccessible.

**Fix:** Route corrected to `/admin` in both `App.tsx` and `Navbar.tsx` navigation.

---

## 5. Business Intelligence — Admin Analytics

The admin dashboard (`/admin`) includes two tiers of analytics:

### 5.1 Operational Stats (Top Row)

| Stat | Calculation |
|------|------------|
| Total Bookings | `bookings.length` |
| Today | `bookings.filter(b => b.booking_date === today)` |
| Pending | Count where `status = 'pending'` |
| Completed | Count where `status = 'completed'` |
| Revenue | Sum of `services.price` for all completed bookings (EGP) |
| Loyalty (5+ visits) | Count of customers with `visit_count >= 5` |

### 5.2 Business Intelligence Cards (Second Row)

| Metric | Source | Icon Color |
|--------|--------|-----------|
| **Total Kings** | `profiles.length` | Cyan `#00dbe7` |
| **Revenue Forecast** | `totalBookings × 150 EGP` | Emerald |
| **Top Barber** | Most bookings via `getBookingsPerBarber()` | Gold |
| **Avg Client Age** | Weighted avg from both `profiles.age` and `customers.age` | Violet |

### 5.3 Client Persona Tagging ("King" Profiles)

Each registered profile in the Client Insights table receives a persona badge based on heuristic rules:

| Persona | Rule | Badge Style |
|---------|------|------------|
| **New Recruit** | `created_at` within last 7 days | Green |
| **Young Elite** | `age < 25` | Cyan |
| **The Sovereign** | `age >= 40` | Gold |

### 5.4 Barber Performance Chart

A Recharts `BarChart` visualizes bookings per barber with cyan-teal gradient bars. Data refreshes every 30 seconds via `refetchInterval`.

---

## 6. Instructions for Future AI Agents

### 6.1 Styling Constants — MUST FOLLOW

```
BACKGROUND:         #111416  (Matte Black)
SURFACE:            #191c1e → #1d2022 → #272a2c → #323537  (layered depth)
PRIMARY:            #00dbe7  (Cyan — use for accents, glows, CTAs)
PRIMARY GRADIENT:   linear-gradient(135deg, #00dbe7, #00929a)
FOREGROUND:         #e1e2e5  (Light grey text)
MUTED FOREGROUND:   #c4c6cf  (Secondary text)
DESTRUCTIVE:        hsl(0, 72%, 51%)  (Red — errors/cancel)

FONT HEADING:       "Noto Serif", serif
FONT BODY/LABEL:    "Manrope", sans-serif

LABEL STYLE:        text-xs uppercase tracking-widest font-label text-muted-foreground
INPUT STYLE:        bg-surface ghost-border focus:border-primary focus:ring-1 focus:ring-primary
BUTTON PRIMARY:     bg-primary-gradient text-primary-foreground font-label tracking-widest uppercase
GLOW EFFECT:        shadow-[0_0_15px_rgba(0,219,231,0.15)]
AMBIENT SHADOW:     box-shadow: 0px 20px 40px rgba(0, 219, 231, 0.08)
```

### 6.2 Coding Conventions

- **No new dependencies** without explicit user approval
- All Supabase CRUD functions live in `src/lib/supabase-helpers.ts`
- All UI strings must go through `translations.ts` — never hardcode user-facing text
- Use `as any` casts for Supabase tables not in the generated types (e.g., `customers`)
- Status badges use the `statusColors` map in both `AdminDashboard.tsx` and `BookingTracker.tsx`
- Queries use `@tanstack/react-query` with descriptive `queryKey` arrays

### 6.3 Common Pitfalls

1. **`user_id` is nullable** — never assume it's present. Guest bookings always have `user_id: null`.
2. **`customers` table is not in generated types** — always cast with `as any` when querying.
3. **Barber names are stored as text strings**, not foreign keys. Current barbers: `Ahmed Kral`, `Omar Khalil`, `Youssef Adel`.
4. **RLS is permissive on reads** — `bookings`, `customers`, `services`, `gallery`, and `profiles` are all publicly readable. Only `bookings` UPDATE is restricted to barbers.
5. **The `confirmed` status is legacy** — the active lifecycle uses `pending → accepted → completed/rejected`. Keep `confirmed` in the CHECK constraint for backward compatibility but do not generate new bookings with this status.
6. **The `phone` and `phone_number` columns both exist on `profiles`** — this is a legacy duplication. Use `phone_number` for new code.

### 6.4 Environment

- **Dev Server:** `npm run dev` (Vite, port 8080)
- **Supabase Project ID:** `cfqfzoxauciipokdrjrs`
- **Supabase URL:** `https://cfqfzoxauciipokdrjrs.supabase.co`
- **Auth:** Email/password only, email confirmation disabled
- **i18n:** English (`en`) and Arabic (`ar`), toggle via Navbar globe icon

---

*End of Developer Log.*
