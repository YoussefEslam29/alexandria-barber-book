# DEVELOPER_LOG.md — Kral Salon

> **Last Updated:** 2026-04-20  
> **Project ID (Supabase):** `cfqfzoxauciipokdrjrs`  
> **Stack:** Vite + React 18 + TypeScript + Tailwind CSS + Supabase (Postgres + Auth + RLS)  
> **Design System:** "Sovereign Industrial" — Matte Black / Dual-Accent (Electric Cyan & Sovereign Gold) / Serif Typography  

---

## 1. Visual Brand Evolution & Architecture

### 1.1 Overview

Kral Salon has evolved from a static landing page into a **multi-tiered Service Management System**. The frontend is a single-page React application served by Vite, with Supabase providing the backend (Postgres database, Auth, Row-Level Security). All business logic executes client-side through the Supabase JS SDK. 

This document serves as the technical **"Source of Truth"** for any future AI agents or developers.

### 1.2 Design Philosophy — "Sovereign Industrial" (Integrated via Stitch MCP)

The visual identity is built around three core pillars, shifted to a more premium and dynamic aesthetic:

| Pillar | Implementation |
|--------|---------------|
| **Matte Black Surfaces** | Background `#111416`, surface layers `#191c1e` → `#1d2022` → `#272a2c` → `#323537` |
| **Dual-Accent Palette** | **Electric Cyan** (`#00d4ff` / `#00dbe7`) for standard in-shop services. <br> **Sovereign Gold** (`#D4AF37`) specifically for the Premium Home services vertical. |
| **Serif Typography** | Headings: `Noto Serif` (serif), Body/Labels: `Manrope` (sans-serif) |

**Custom UI utility classes:**
- `bg-primary-gradient` — 135° gradient from Electric Cyan to deep teal.
- `ghost-border` — 1px solid rgba(68, 71, 78, 0.2).
- `ambient-shadow` — diffused cyan box-shadow for standard cards, and `shadow-[0_0_20px_rgba(212,175,55,0.4)]` for Sovereign Gold hover effects.

### 1.3 Frontend Architecture

```text
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
│   ├── PremiumServiceSection.tsx # Grooming at Home vertical (Flexbox, Gold hover)
│   ├── ServicesSection.tsx    # Services grid (from Supabase)
│   ├── BookingModal.tsx       # Public booking form with Age-Based Guardrails
│   ├── BookingTracker.tsx     # Public status lookup by phone number
... (other standard components)
```

---

## 2. Database Schema (Supabase)

### 2.1 `bookings` (Appointments) — Managed Lifecycle

The appointments table has evolved into a frictionless, guest-first model with strict lifecycle management.

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | uuid | NO | `gen_random_uuid()` | Primary key |
| `user_id` | uuid | **YES** | `null` | Guest bookings set this to `null` to prevent Ghost Errors. |
| `service_id` | uuid | NO | — | FK → `services.id` |
| `booking_date` | date | NO | — | |
| `booking_time` | time | NO | — | |
| `status` | text | NO | `'pending'` | Restricted to: `pending`, `accepted`, `confirmed`, `completed`, `cancelled`, `rejected` |
| `customer_name` | text | NO | `''` | Guest booking identity |
| `customer_phone` | text | NO | `''` | Guest booking identity |
| `customer_age` | integer | YES | — | BI analytics & Age Validation Guardrails |
| `rejection_reason` | text | YES | — | Admin reason when `status = 'rejected'` |
| `is_walkin` | boolean | NO | `false` | True for manual admin entries |
| `is_home_service` | boolean | NO | `false` | Flag for Premium "Grooming at Home" vertical |

### 2.2 `profiles` — Authenticated Users & BI Data

Linked to Supabase Auth. Used for Admin verification and Demographic Analytics.

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | uuid | NO | `gen_random_uuid()` | Primary key |
| `user_id` | uuid | NO | — | FK → `auth.users.id` |
| `full_name` | text | YES | — | |
| `phone_number` | text | YES | — | Contact number (supercedes legacy `phone`) |
| `age` | integer | YES | — | Used for BI demographic tagging |
| `is_barber` | boolean | NO | `false` | Admin access gate |

*(Note: Other tables like `customers` for loyalty and `services` remain standard).*

---

## 3. Business Logic & Guardrails

### 3.1 Appointment Lifecycle & Ghost Booking Prevention

The system utilizes a strictly managed admin-driven state transition:
**Pending -> Accepted -> Completed (or Rejected/Cancelled)**

*   **Ghost Booking Prevention:** The legacy "Ghost Error" was caused by a `NOT NULL` constraint on `user_id` clashing with the frictionless booking flow. This is completely resolved by explicitly passing `user_id: null` for guest bookings and dropping the NOT NULL constraint, ensuring the database correctly processes public appointments without throwing silent failures.

### 3.2 Age Validation (Kids Service)

*   **Guardrail:** In the `BookingModal`, if the user's age (entered in the form or calculated) is strictly greater than `12`, the "Kids Service" option is structurally invalidated.
*   **User Feedback:** If an invalid selection is attempted, the dropdown clears and a subtle toast message appears: *"The Kids Service is strictly for those aged 12 and under. Please select a standard or premium cut."*

### 3.3 Premium Vertical: "Grooming at Home"

*   **Implementation:** A dedicated `PremiumServiceSection` component positioned under the main Services grid.
*   **Layout:** Responsive flexbox container (`flex-col` on mobile, `flex-row` on desktop).
*   **Aesthetic Triggers:** Utilizes the Sovereign Gold (`#D4AF37`) for active hover states (`hover:border-[#D4AF37] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]`).
*   **Integration:** The "Request Home Service" button triggers the `BookingModal` with `is_home_service` automatically checked, tracking the vertical through to the `bookings` table.

---

## 4. Admin Capabilities

### 4.1 Manual Walk-in Entry System

*   Admins can record offline customers directly to ensure complete revenue accuracy and loyalty tracking.
*   Flow: Admin clicks **"+ Add Walk-in"** -> Fills form (Name, Phone, Service, Barber, Time) -> Selects `is_home_service` toggle if applicable -> Submits.
*   Walk-ins default to `accepted` or `completed` states instantly, bypassing `pending`.

### 4.2 Business Intelligence: "King" Persona Tagging

Users in the system are algorithmically tagged in the Admin Dashboard based on demographics to inform the business of client personas:
*   **New Recruit:** Account created within the last 7 days (Green badge).
*   **Young Elite:** Age strictly under 25 (Electric Cyan badge).
*   **The Sovereign:** Age 40 and above (Sovereign Gold badge).

### 4.3 Rejection Management
*   Admins can click "Reject" on Pending appointments, which forces a modal requiring a typed `rejection_reason`. This reason is displayed to the user via the Public Tracking feature.

---

## 5. Instructions for Future Agents

To maintain the structural integrity and aesthetic fidelity of Kral Salon, any future AI agents or developers **MUST** adhere to the following rules:

### 5.1 Maintain CSS Constants for the "Sovereign" Look
Do not invent random colors. Stick strictly to the dual-accent palette:
```css
BACKGROUND:         #111416  (Matte Black)
SURFACE:            #191c1e → #1d2022 → #272a2c → #323537  (layered depth)
CYAN ACCENT:        #00d4ff / #00dbe7 (Standard services/CTAs)
GOLD ACCENT:        #D4AF37 (Premium Home services ONLY)
GOLD GLOW:          shadow-[0_0_20px_rgba(212,175,55,0.4)]
CYAN GLOW:          shadow-[0_0_15px_rgba(0,219,231,0.15)]
DESTRUCTIVE:        hsl(0, 72%, 51%)  (Red — errors/rejects)
```

### 5.2 Strict Mobile-First Responsive Grids
*   All new components **MUST** be built with a mobile-first approach.
*   Use tailwind grid or flexbox (e.g., `flex-col md:flex-row`, `grid-cols-1 md:grid-cols-2`).
*   Ensure adequate touch targets (`min-h-[44px]`) and padding (`px-4`) for smaller viewports.

### 5.3 Database Interfacing
*   All Supabase CRUD functions live in `src/lib/supabase-helpers.ts`. Do not write raw Supabase calls inside UI components.
*   `user_id` is nullable. Guest bookings always have `user_id: null`.
*   Always cast with `as any` when querying the `customers` table as it is not currently in the generated types.

### 5.4 Internationalization (i18n)
*   All user-facing text **MUST** go through `src/i18n/translations.ts`.
*   Utilize the `useLanguage` hook. Ensure new layout blocks respect RTL (Right-to-Left) constraints when `lang === 'ar'`.

*End of Developer Log.*
