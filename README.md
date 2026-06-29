# BIO CWT — Frontend

Next.js 16 frontend for the BIO CWT wood products platform. Consumes the NestJS REST API for all content and authentication.

---

## 1. Setup Instructions

**Prerequisites:** Node.js 18+, npm, and the BIO CWT backend API running locally.

```bash


# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev
```

The frontend runs at **http://localhost:3001** (Next.js will auto-increment the port if 3000 is taken by the API).

The backend API must be running at **http://localhost:3000** before starting the frontend.

---

## 2. Environment Variables

The API base URL is currently configured directly in the source:

| File | Variable | Value |
|------|----------|-------|
| `lib/api.js` | `API_BASE` | `http://localhost:3000` |
| `lib/data.js` | `API_BASE` | `http://127.0.0.1:3000` |

To make the API URL configurable, create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Then replace the hardcoded strings with `process.env.NEXT_PUBLIC_API_URL`.

---

## 3. Database Setup

This is a **frontend-only** project — it has no direct database connection.

All data is fetched from the NestJS backend REST API (`http://localhost:3000`), which manages the database. To set up the database, refer to the backend repository's README.

The frontend interacts with the following API resources:

- `GET /homepage` — homepage sections (hero, our-work, advantages, about-us, any-questions)
- `GET /wood` — product listings
- `GET /price` — price list items
- `POST /auth/login` — JWT login
- `POST /auth/refresh` — token refresh

---

## 4. Architecture Overview

```
biocwt-frontend/
├── app/                    # Next.js App Router
│   ├── page.js             # Home page
│   ├── about/              # About page
│   ├── contact/            # Contact page
│   ├── prices/             # Public price list
│   ├── gallery/            # Gallery page
│   ├── login/              # Auth — login
│   ├── register/           # Auth — register
│   ├── not-found.js        # Custom 404
│   └── admin/              # Admin panel (auth-guarded)
│       ├── layout.js       # Sidebar + admin auth guard
│       ├── page.js         # Dashboard
│       ├── hero/           # Edit Hero section
│       ├── our-work/       # Edit Our Work section
│       ├── advantages/     # Edit Advantages section
│       ├── about-us/       # Edit About Us section
│       ├── any-questions/  # Edit Any Questions section
│       └── prices/         # Price CRUD
├── components/             # Shared UI components
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── HeroSection.jsx
│   ├── WorkSection.jsx
│   ├── AdvantagesSection.jsx
│   ├── AboutSection.jsx
│   ├── QuestionsSection.jsx
│   └── ProductsSection.jsx
├── lib/
│   ├── api.js              # Auth utils, fetchWithAuth, token refresh
│   └── data.js             # Server-side fetch helpers
└── app/globals.css         # Global styles + CSS variables (--btn-bg, --btn-color)
```

**Key architectural decisions:**

- **App Router** — server components fetch data at request time; client components (`'use client'`) handle interactivity and auth.
- **JWT auth** — access token + refresh token stored in `localStorage`. `fetchWithAuth()` auto-refreshes on 401 and retries the request.
- **CSS Modules** — scoped per component, no utility framework. Global design tokens (button color, fonts) live in `globals.css` as CSS custom properties.
- **Admin guard** — `app/admin/layout.js` checks `isAdmin()` on every admin route client-side and redirects to `/login` if the user is not authenticated.

---

## 5. AI Tools Used

- **Claude (Anthropic) — Claude Code**: Used throughout development for generating and iterating on components, CSS modules, API integration, auth flows, and admin pages.

---

## 6. Time Spent

| Task | Time |
|------|------|
| Project setup & routing | ~1 h |
| Public pages (Home, About, Prices, Contact) | ~3 h |
| Component styling & mobile responsiveness | ~2 h |
| Auth (login, register, JWT refresh) | ~1 h |
| Admin panel & section editors | ~4 h |
| Price management (CRUD) | ~1 h |
| Bug fixes & polish | ~2 h |
| **Total** | **~14 h** |
