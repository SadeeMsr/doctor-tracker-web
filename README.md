# Doctor Tracker · Web

Doctor Tracker is a secure admin portal for clinics and hospital groups. An administrator signs in, keeps the roster of doctors up to date, records each doctor's patients, and sees at a glance how the caseload is moving: how many doctors and patients there are, who is critical right now, how admissions are trending, and which doctors and specialties carry the most patients. This repository is the **Next.js frontend**. The REST API lives in a separate repository, [doctor-tracker-api](https://github.com/SadeeMsr/doctor-tracker-api).

> **Live demo:** <https://doctortracker-portal.vercel.app>
> Sign in as `admin@doctortracker.dev`; the password is in the submission email.
> The API runs on Render's free plan and sleeps when idle, so the first request after a quiet
> spell can take up to a minute.

| Evaluation                                                                        | Result                                                                                     |
| --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Requirements (sections 2–5 of the brief)                                          | **All met**, each item checked by hand and by test ([checklist](#1-requirement-checklist)) |
| End-to-end walkthrough, every screen and modal, light and dark, desktop and phone | **122 / 122** checks passed                                                                |
| Live production site, signed out                                                  | **9 / 9** checks passed                                                                    |
| Unit and component tests                                                          | **70** web tests (17 files) · **70** API tests (12 files), all passing                     |

This README is part user manual, part build log: it walks through every screen with its user story, then explains how the app is built, how it handles failure, how it was tested, and what comes next.

## Contents

1. [Requirement checklist](#1-requirement-checklist)
2. [How this was evaluated](#2-how-this-was-evaluated)
3. [User guide: every screen and modal](#3-user-guide-every-screen-and-modal)
4. [User flows](#4-user-flows)
5. [State machines](#5-state-machines)
6. [System architecture](#6-system-architecture)
7. [Technical decisions](#7-technical-decisions)
8. [Error handling](#8-error-handling)
9. [Performance](#9-performance)
10. [Tests](#10-tests)
11. [Project structure](#11-project-structure)
12. [Findings and what's next](#12-findings-and-whats-next)
13. [Build log](#13-build-log)
14. [Tech stack and setup](#14-tech-stack-and-setup)

## 1. Requirement checklist

Every item in sections 2–5 of the brief, with where it can be seen and how it was verified. Scene numbers refer to the [user guide](#3-user-guide-every-screen-and-modal). "E2E" is the scripted walkthrough of the running app; "unit" is a test file in this repo or the API's.

### 2.1 Authentication

|     | Requirement                                           | Where      | Verified by                                                                                                                                                                                                                                                                                         |
| --- | ----------------------------------------------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ✅  | Only authenticated users can access the portal        | Scene 1    | E2E: a signed-out visit to `/doctors` lands on `/login?next=%2Fdoctors`. Production: `/patients` returns 307 to login; `/api/v1/doctors` returns 401                                                                                                                                                |
| ✅  | Secure login                                          | Scene 1    | httpOnly, `SameSite=Lax`, `Secure` cookies; argon2id hashes; rotating refresh tokens with theft detection; 10 failed attempts per 15 min per IP. Unit: `login-form.test.tsx`, API `auth.http.test.ts` (12) and `auth.service.test.ts`. Production: wrong credentials give one generic 401           |
| ✅  | Protect all routes (authentication and authorization) | All scenes | `src/proxy.ts` redirects pages without a session; the API checks a signed JWT on every request (`requireAuth`) and only `/health` and `/auth/*` are public. There's one role (admin), and every protected route requires it. Unit: API `auth.http.test.ts` (forged and `alg: none` tokens rejected) |

### 2.2 Doctor management

|     | Requirement                                                   | Where                     | Verified by                                                                                                                                                                                                   |
| --- | ------------------------------------------------------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ✅  | Create a doctor: name, specialization, hospital, phone, email | Scenes 8, 9               | E2E opens the form and checks validation. Unit: `doctor-form.test.tsx` (request body, `Idempotency-Key`, 409 on the email field), `schemas.test.ts`. API: `doctors.http.test.ts` (201 + `Location`, 422, 409) |
| ✅  | View a list of all doctors                                    | Scene 4                   | E2E: list with a result count                                                                                                                                                                                 |
| ✅  | Search doctors                                                | Scenes 5, 6               | Name or email prefix, debounced; E2E covers the empty result. API: `doctors.http.test.ts`                                                                                                                     |
| ✅  | Filter doctors (date-wise and other relevant filters)         | Scene 5                   | Date added, several specializations, several hospitals, sort. E2E: every Cardiology-or-Oncology result checked. Unit: `doctors-toolbar.test.tsx`; API multi-value tests                                       |
| ✅  | Paginate doctor records                                       | Scene 7                   | E2E: page 2 from the URL; 10 per page                                                                                                                                                                         |
| ✅  | View the patients of each doctor                              | Scene 14                  | E2E: profile plus that doctor's patients                                                                                                                                                                      |
| ✅  | Add new patients under a specific doctor                      | Scenes 13, 15             | From the list (in place) and from the doctor's page. Unit: `patient-form.test.tsx`. API: `patients.http.test.ts`                                                                                              |
| ✅  | Delete patients from the doctor's patient list                | Scene 14 (row action), 21 | Scoped delete `DELETE /doctors/:id/patients/:patientId`. API test: another doctor's patient can't be removed (404)                                                                                            |

### 2.3 Patient management

|     | Requirement                                                 | Where    | Verified by                                                                                                                            |
| --- | ----------------------------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| ✅  | Dedicated page listing all patients                         | Scene 16 | E2E                                                                                                                                    |
| ✅  | Edit patient information                                    | Scene 20 | E2E opens prefilled. Unit: PATCH sends only changed fields (`schemas.test.ts`); server 422 mapped to fields (`patient-form.test.tsx`)  |
| ✅  | Delete patients                                             | Scene 21 | E2E confirm dialog names the patient; optimistic removal with rollback                                                                 |
| ✅  | Pagination                                                  | Scene 16 | E2E: "Page 1 of …"                                                                                                                     |
| ✅  | Search                                                      | Scene 18 | E2E: every result's name starts with the search term                                                                                   |
| ✅  | Filtering: date-wise, condition, and other relevant filters | Scene 17 | Admission date range, several conditions, gender, sort. E2E: every critical-or-recovering result checked. API: `patients.http.test.ts` |

### 3. Dashboard and data visualization

|     | Requirement                                | Where       | Verified by                                                                                                                                      |
| --- | ------------------------------------------ | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| ✅  | Visual representation of data, with charts | Scenes 2, 3 | E2E: four Recharts SVG charts render                                                                                                             |
| ✅  | Total doctors and total patients           | Scene 2     | E2E                                                                                                                                              |
| ✅  | Patients per doctor                        | Scene 2     | Ranked column chart of the top 10 caseloads, plus "N per doctor"                                                                                 |
| ✅  | Date-based statistics                      | Scenes 2, 3 | Admissions over time (daily, weekly, monthly) and change vs the previous period. API: `analytics.service.test.ts` (zero-filled series, % change) |
| ✅  | Clean data aggregation                     | Scene 2     | One endpoint; seven aggregate queries in parallel; the service fills empty buckets and keeps every condition in the legend                       |
| ✅  | Optimized query performance                | (API)       | Totals from collection metadata (`estimatedDocumentCount`); date ranges on an index; `$limit` before `$lookup`; 30 s cache                       |
| ✅  | Meaningful visual insights                 | Scenes 2, 3 | "Critical now", the admissions trend, condition split, busiest doctors, departments by patient share                                             |

### 4. UI/UX

|     | Requirement                                              | Where                  | Verified by                                                                                                                                                                                              |
| --- | -------------------------------------------------------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ✅  | Modern, visually appealing UI                            | Every scene            | Custom design system (Base UI + Tailwind tokens), light and dark themes                                                                                                                                  |
| ✅  | Clean layout, proper spacing and hierarchy               | Every scene            | Every page: eyebrow, title, description, toolbar, content                                                                                                                                                |
| ✅  | Responsive design                                        | Every phone screenshot | E2E ran every scene at 390 px: tables become cards, dialogs become bottom sheets, the sidebar becomes a dock                                                                                             |
| ✅  | Smooth navigation                                        | Scenes 7, 14           | Client-side navigation, previous page kept while the next loads, one skeleton per page with the final layout                                                                                             |
| ✅  | Good UX (best practices)                                 | Throughout             | Loading, empty, error and success states; confirm dialogs that name the item; field-level errors; toasts; in-place add; "Save & add another"; keyboard shortcuts; accessible names (tests query by role) |
| ✅  | Clear navigation between Dashboard, Doctors and Patients | Every scene            | Sidebar on desktop, dock on phones, `G` then `D`/`O`/`P`                                                                                                                                                 |

### 5. Performance and optimization

|     | Requirement                                               | Where                                      | Verified by                                                                                                                                                        |
| --- | --------------------------------------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| ✅  | Optimized queries for searching, filtering and pagination | [Performance](#9-performance), API README  | Frontend: debounced search, URL-keyed query cache, previous page kept. API: every filter and sort has an index; anchored prefix search; page and count in parallel |
| ✅  | Proper MongoDB indexing                                   | API README                                 | One index per filter and sort, each justified in the model file                                                                                                    |
| ✅  | Efficient query patterns                                  | API README                                 | No per-row queries (patient counts in one grouped query); `$lookup` after `$skip`/`$limit`                                                                         |
| ✅  | Avoid unnecessary re-renders                              | [Performance](#9-performance)              | React Compiler (automatic memoisation), Server Components by default, narrow query subscriptions, URL state instead of a global store                              |
| ✅  | Clean folder structure                                    | [Project structure](#11-project-structure) | Feature folders; ESLint enforces the dependency direction between tiers                                                                                            |
| ✅  | Reusable components                                       | [Project structure](#11-project-structure) | Four reuse tiers; generic `DataTable`, filters, skeletons, dialogs, charts                                                                                         |
| ✅  | API validation and error handling                         | [Error handling](#8-error-handling)        | Zod on both sides (forms mirror the API); one error envelope; layered handling in the client. Unit: `api-client.test.ts`, `errors.test.ts`                         |

## 2. How this was evaluated

Three layers, run on the final code:

1. **End-to-end walkthrough of every screen and modal.** A script drives headless Chrome through all 24 scenes, the way a user would, in light and dark mode at 1440 × 900 (desktop) and 390 × 844 (phone). On each screen it asserts what the user should see: the right dialog, results that really match the filters, counts, pagination and redirects. It took every screenshot in this README. Result: **122 / 122 checks passed.** It ran on a local production build (`next build && next start`) of `main` against the API, using the same database as the live site. It only opens dialogs and never confirms anything, so it changes no data.
2. **The live production site, signed out.** The checks below ran against `doctortracker-portal.vercel.app` and the Render API. Signing in on production was deliberately not automated; the signed-in screens were covered by layer 1.
3. **Unit and component tests**: 70 in this repo and 70 in the API (see [Tests](#10-tests)).

**Production checks**

|     | Check                                                               | Detail                        |
| --- | ------------------------------------------------------------------- | ----------------------------- |
| ✅  | API health: 200 with the database up                                | 261 ms                        |
| ✅  | Vercel proxies /api/* to the API (same-origin, first-party cookies) |                               |
| ✅  | Protected API routes need a session: 401 with the error envelope    |                               |
| ✅  | Protected pages redirect signed-out visitors to /login?next=…       | 307 → /login?next=%2Fpatients |
| ✅  | Wrong credentials: one generic 401 message                          | Invalid email or password     |
| ✅  | Web security headers: nosniff, frame DENY, referrer policy          |                               |
| ✅  | No framework fingerprint header (x-powered-by)                      |                               |
| ✅  | API security headers: HSTS and a content security policy            |                               |
| ✅  | Production login page renders in light and dark, desktop and mobile |                               |

**Production login page load** (cold browser cache, measured in headless Chrome)

| Theme | Device  | Time to first byte | First contentful paint | DOM complete | Transferred |
| ----- | ------- | ------------------ | ---------------------- | ------------ | ----------- |
| light | desktop | 343 ms             | 548 ms                 | 658 ms       | 337 KB      |
| light | mobile  | 140 ms             | 312 ms                 | 330 ms       | 337 KB      |
| dark  | desktop | 45 ms              | 192 ms                 | 304 ms       | 337 KB      |
| dark  | mobile  | 137 ms             | 768 ms                 | 1029 ms      | 337 KB      |

<table>
<tr><th>Production · light</th><th>Production · dark</th></tr>
<tr><td><img src="docs/screens/production/production-login-light-desktop.webp" alt="Production login, light, desktop"></td><td><img src="docs/screens/production/production-login-dark-desktop.webp" alt="Production login, dark, desktop"></td></tr>
<tr><td align="center"><img src="docs/screens/production/production-login-light-mobile.webp" alt="Production login, light, phone" width="230"></td><td align="center"><img src="docs/screens/production/production-login-dark-mobile.webp" alt="Production login, dark, phone" width="230"></td></tr>
</table>

## 3. User guide: every screen and modal

Each scene has a user story, the steps to get there, the details that make it pleasant to use, what the walkthrough verified, and screenshots in both themes on desktop and phone. The real email address of one doctor in the shared database is masked in the screenshots.

### Signing in

#### 1. Sign in

> **User story:** As an admin, I want to sign in securely, and land back where I was heading.

**Flow**

1. Open any page while signed out: you're redirected to `/login?next=…`.
2. Enter email and password (or use the demo account button on demo builds).
3. On success you return to the page in `?next=`; on failure you see one generic message.

**UX highlights**

- Split-screen layout; on phones the hero shrinks to a band so the form stays above the fold.
- `?next=` is honoured only for same-site paths, so login can't become an open redirect.
- The password field clears after a failed attempt, and the form shakes once.

**Verified in the walkthrough**

- ✅ A signed-out visit is redirected to /login with ?next
- ✅ Shows the sign-in form

<table>
<tr><th>Light</th><th>Dark</th></tr>
<tr><td><img src="docs/screens/light/desktop/01-login.webp" alt="Sign in, light, desktop"></td><td><img src="docs/screens/dark/desktop/01-login.webp" alt="Sign in, dark, desktop"></td></tr>
<tr><td align="center"><img src="docs/screens/light/mobile/01-login.webp" alt="Sign in, light, phone" width="230"></td><td align="center"><img src="docs/screens/dark/mobile/01-login.webp" alt="Sign in, dark, phone" width="230"></td></tr>
</table>

### Dashboard

#### 2. Overview

> **User story:** As an admin, I want to see the size and health of the caseload at a glance.

**Flow**

1. Sign in: the dashboard is the home page.
2. Read the admissions headline (last 12 months, change vs the period before), then totals.
3. Scroll for conditions, patients per doctor and patients by specialization.

**UX highlights**

- One request (`/analytics/summary`) feeds every widget; charts are lazy-loaded.
- Every condition always appears in the legend, so colours never shift between visits.
- First visit shows a small "Press ? for keyboard shortcuts" tip in the corner.

**Verified in the walkthrough**

- ✅ Login succeeds through the /api proxy
- ✅ Shows totals: doctors, patients, critical
- ✅ Shows admissions over time, conditions, patients per doctor, by specialization
- ✅ Charts render as SVG

<table>
<tr><th>Light</th><th>Dark</th></tr>
<tr><td><img src="docs/screens/light/desktop/02-dashboard.webp" alt="Overview, light, desktop"></td><td><img src="docs/screens/dark/desktop/02-dashboard.webp" alt="Overview, dark, desktop"></td></tr>
<tr><td align="center"><img src="docs/screens/light/mobile/02-dashboard.webp" alt="Overview, light, phone" width="230"></td><td align="center"><img src="docs/screens/dark/mobile/02-dashboard.webp" alt="Overview, dark, phone" width="230"></td></tr>
</table>

#### 3. Daily, weekly or monthly

> **User story:** As an admin, I want to change the time grouping to spot short- or long-term trends.

**Flow**

1. Pick Daily, Weekly or Monthly above the admissions chart.

**UX highlights**

- Empty periods are explicit zeros, so the line never skips a gap.
- Weeks start on Monday (UTC), matching the API's `$dateTrunc` buckets.

**Verified in the walkthrough**

- ✅ Switching to weekly regroups the series

<table>
<tr><th>Light</th><th>Dark</th></tr>
<tr><td><img src="docs/screens/light/desktop/03-dashboard-weekly.webp" alt="Daily, weekly or monthly, light, desktop"></td><td><img src="docs/screens/dark/desktop/03-dashboard-weekly.webp" alt="Daily, weekly or monthly, dark, desktop"></td></tr>
<tr><td align="center"><img src="docs/screens/light/mobile/03-dashboard-weekly.webp" alt="Daily, weekly or monthly, light, phone" width="230"></td><td align="center"><img src="docs/screens/dark/mobile/03-dashboard-weekly.webp" alt="Daily, weekly or monthly, dark, phone" width="230"></td></tr>
</table>

### Doctors

#### 4. Doctor directory

> **User story:** As an admin, I want to browse every doctor and see how many patients each one has.

**Flow**

1. Open Doctors from the sidebar (or the phone dock, or press `G` then `O`).
2. Each row shows specialization, hospital and a patients pill.

**UX highlights**

- Result count above the table; 10 per page with Previous/Next.
- Row actions are visible icons (add patient, edit, delete), not hidden in a menu.
- Below 768 px the table becomes stacked cards.

**Verified in the walkthrough**

- ✅ Lists doctors with a result count
- ✅ Paginates (10 per page)

<table>
<tr><th>Light</th><th>Dark</th></tr>
<tr><td><img src="docs/screens/light/desktop/04-doctors.webp" alt="Doctor directory, light, desktop"></td><td><img src="docs/screens/dark/desktop/04-doctors.webp" alt="Doctor directory, dark, desktop"></td></tr>
<tr><td align="center"><img src="docs/screens/light/mobile/04-doctors.webp" alt="Doctor directory, light, phone" width="230"></td><td align="center"><img src="docs/screens/dark/mobile/04-doctors.webp" alt="Doctor directory, dark, phone" width="230"></td></tr>
</table>

#### 5. Search and multi-select filters

> **User story:** As an admin, I want to narrow the list by several specializations and hospitals at once.

**Flow**

1. Type in the search box (name or email prefix, debounced 300 ms).
2. Tick any number of specializations and hospitals; pick a date-added range; sort.
3. Use "Clear all" (or Shift+X) to reset.

**UX highlights**

- Any-of within a filter, all-of across filters: (Cardiology or Oncology) and (Square or United).
- Every filter lives in the URL: shareable, bookmarkable, and the back button undoes it.
- Pills show a count ("Specialization · 2"); changing a filter returns to page 1.

**Verified in the walkthrough**

- ✅ Multi-select specialization: every result is Cardiology or Oncology
- ✅ Menu shows both options ticked
- ✅ The result count says "… match your filters"

<table>
<tr><th>Light</th><th>Dark</th></tr>
<tr><td><img src="docs/screens/light/desktop/05-doctors-filtered.webp" alt="Search and multi-select filters, light, desktop"></td><td><img src="docs/screens/dark/desktop/05-doctors-filtered.webp" alt="Search and multi-select filters, dark, desktop"></td></tr>
<tr><td align="center"><img src="docs/screens/light/mobile/05-doctors-filtered.webp" alt="Search and multi-select filters, light, phone" width="230"></td><td align="center"><img src="docs/screens/dark/mobile/05-doctors-filtered.webp" alt="Search and multi-select filters, dark, phone" width="230"></td></tr>
</table>

#### 6. No results

> **User story:** As an admin, I want to know when my filters exclude everything, and get out quickly.

**Flow**

1. Search for something that doesn't exist.

**UX highlights**

- A designed empty state with a one-click "Clear filters", never a blank table.

**Verified in the walkthrough**

- ✅ An empty search shows a designed empty state with Clear filters

<table>
<tr><th>Light</th><th>Dark</th></tr>
<tr><td><img src="docs/screens/light/desktop/06-doctors-no-results.webp" alt="No results, light, desktop"></td><td><img src="docs/screens/dark/desktop/06-doctors-no-results.webp" alt="No results, dark, desktop"></td></tr>
<tr><td align="center"><img src="docs/screens/light/mobile/06-doctors-no-results.webp" alt="No results, light, phone" width="230"></td><td align="center"><img src="docs/screens/dark/mobile/06-doctors-no-results.webp" alt="No results, dark, phone" width="230"></td></tr>
</table>

#### 7. Pagination

> **User story:** As an admin, I want to move through long lists without losing my place.

**Flow**

1. Use Previous/Next (or `[` and `]`).

**UX highlights**

- The previous page stays on screen while the next loads (`keepPreviousData`): no flash.
- The page is in the URL, so a refresh or a shared link opens the same page.

**Verified in the walkthrough**

- ✅ Page 2 loads from the URL

<table>
<tr><th>Light</th><th>Dark</th></tr>
<tr><td><img src="docs/screens/light/desktop/07-doctors-page-2.webp" alt="Pagination, light, desktop"></td><td><img src="docs/screens/dark/desktop/07-doctors-page-2.webp" alt="Pagination, dark, desktop"></td></tr>
<tr><td align="center"><img src="docs/screens/light/mobile/07-doctors-page-2.webp" alt="Pagination, light, phone" width="230"></td><td align="center"><img src="docs/screens/dark/mobile/07-doctors-page-2.webp" alt="Pagination, dark, phone" width="230"></td></tr>
</table>

#### 8. Add a doctor

> **User story:** As an admin, I want to add a doctor with their name, specialization, hospital, phone and email.

**Flow**

1. Click "Add doctor" (or press `N`).
2. Fill the form; the hospital field suggests hospitals already on file.
3. "Add doctor" saves and closes; "Save & add another" saves and starts a fresh form.

**UX highlights**

- "Save & add another" keeps the hospital and shows "N added so far".
- Ctrl/⌘+Enter saves from any field; Esc closes.
- On phones the dialog is a bottom sheet with full-width buttons.

**Verified in the walkthrough**

- ✅ Add doctor opens from ?new=true

<table>
<tr><th>Light</th><th>Dark</th></tr>
<tr><td><img src="docs/screens/light/desktop/08-add-doctor.webp" alt="Add a doctor, light, desktop"></td><td><img src="docs/screens/dark/desktop/08-add-doctor.webp" alt="Add a doctor, dark, desktop"></td></tr>
<tr><td align="center"><img src="docs/screens/light/mobile/08-add-doctor.webp" alt="Add a doctor, light, phone" width="230"></td><td align="center"><img src="docs/screens/dark/mobile/08-add-doctor.webp" alt="Add a doctor, dark, phone" width="230"></td></tr>
</table>

#### 9. Validation

> **User story:** As an admin, I want clear, specific errors before anything is sent.

**Flow**

1. Submit with missing or invalid fields.

**UX highlights**

- Errors sit under each field and the field turns red; nothing is sent.
- A duplicate email (409 from the API) lands on the email field, not in a toast.

**Verified in the walkthrough**

- ✅ Submitting empty shows field errors

<table>
<tr><th>Light</th><th>Dark</th></tr>
<tr><td><img src="docs/screens/light/desktop/09-add-doctor-errors.webp" alt="Validation, light, desktop"></td><td><img src="docs/screens/dark/desktop/09-add-doctor-errors.webp" alt="Validation, dark, desktop"></td></tr>
<tr><td align="center"><img src="docs/screens/light/mobile/09-add-doctor-errors.webp" alt="Validation, light, phone" width="230"></td><td align="center"><img src="docs/screens/dark/mobile/09-add-doctor-errors.webp" alt="Validation, dark, phone" width="230"></td></tr>
</table>

#### 10. Edit a doctor

> **User story:** As an admin, I want to correct a doctor's details.

**Flow**

1. Click the pencil on a row (or "Edit details" on their page).

**UX highlights**

- The PATCH sends only the fields you changed, as final values (idempotent).

**Verified in the walkthrough**

- ✅ Edit doctor opens prefilled

<table>
<tr><th>Light</th><th>Dark</th></tr>
<tr><td><img src="docs/screens/light/desktop/10-edit-doctor.webp" alt="Edit a doctor, light, desktop"></td><td><img src="docs/screens/dark/desktop/10-edit-doctor.webp" alt="Edit a doctor, dark, desktop"></td></tr>
<tr><td align="center"><img src="docs/screens/light/mobile/10-edit-doctor.webp" alt="Edit a doctor, light, phone" width="230"></td><td align="center"><img src="docs/screens/dark/mobile/10-edit-doctor.webp" alt="Edit a doctor, dark, phone" width="230"></td></tr>
</table>

#### 11. Delete: blocked while they have patients

> **User story:** As an admin, I want to be protected from deleting medical records by accident.

**Flow**

1. Click the bin on a doctor who still has patients.

**UX highlights**

- The dialog explains why ("still has 22 patient(s)") and links to their patients; there's no Delete button.

**Verified in the walkthrough**

- ✅ Deleting a doctor with patients is blocked with an explanation

<table>
<tr><th>Light</th><th>Dark</th></tr>
<tr><td><img src="docs/screens/light/desktop/11-delete-doctor-blocked.webp" alt="Delete: blocked while they have patients, light, desktop"></td><td><img src="docs/screens/dark/desktop/11-delete-doctor-blocked.webp" alt="Delete: blocked while they have patients, dark, desktop"></td></tr>
<tr><td align="center"><img src="docs/screens/light/mobile/11-delete-doctor-blocked.webp" alt="Delete: blocked while they have patients, light, phone" width="230"></td><td align="center"><img src="docs/screens/dark/mobile/11-delete-doctor-blocked.webp" alt="Delete: blocked while they have patients, dark, phone" width="230"></td></tr>
</table>

#### 12. Delete: confirm

> **User story:** As an admin, I want a clear confirmation, naming the doctor, before a deletion.

**Flow**

1. Click the bin on a doctor with no patients, then confirm.

**UX highlights**

- The row disappears at once (optimistic) and comes back if the server refuses.

**Verified in the walkthrough**

- ✅ Deleting a doctor without patients asks to confirm, naming them

<table>
<tr><th>Light</th><th>Dark</th></tr>
<tr><td><img src="docs/screens/light/desktop/12-delete-doctor-confirm.webp" alt="Delete: confirm, light, desktop"></td><td><img src="docs/screens/dark/desktop/12-delete-doctor-confirm.webp" alt="Delete: confirm, dark, desktop"></td></tr>
<tr><td align="center"><img src="docs/screens/light/mobile/12-delete-doctor-confirm.webp" alt="Delete: confirm, light, phone" width="230"></td><td align="center"><img src="docs/screens/dark/mobile/12-delete-doctor-confirm.webp" alt="Delete: confirm, dark, phone" width="230"></td></tr>
</table>

#### 13. Add a patient without leaving the list

> **User story:** As an admin, I want to add a patient for a doctor straight from the directory.

**Flow**

1. Click the add-patient icon on a row (or the "Add patient" pill on a doctor with none).

**UX highlights**

- Opens in place with the doctor preset and named; driven by `?addPatient=<id>`, so Back closes it.
- The row's patient count updates as soon as you save.

**Verified in the walkthrough**

- ✅ Add patient opens on the doctors list with the doctor preset

<table>
<tr><th>Light</th><th>Dark</th></tr>
<tr><td><img src="docs/screens/light/desktop/13-add-patient-from-list.webp" alt="Add a patient without leaving the list, light, desktop"></td><td><img src="docs/screens/dark/desktop/13-add-patient-from-list.webp" alt="Add a patient without leaving the list, dark, desktop"></td></tr>
<tr><td align="center"><img src="docs/screens/light/mobile/13-add-patient-from-list.webp" alt="Add a patient without leaving the list, light, phone" width="230"></td><td align="center"><img src="docs/screens/dark/mobile/13-add-patient-from-list.webp" alt="Add a patient without leaving the list, dark, phone" width="230"></td></tr>
</table>

#### 14. A doctor and their patients

> **User story:** As an admin, I want to see one doctor's profile and manage their patients.

**Flow**

1. Click "N patients →" on a row, or the doctor's name.

**UX highlights**

- One loading skeleton with the final layout, then content fills in place (no jump).
- The patient list below has the same search, filters and pagination as the Patients page.

**Verified in the walkthrough**

- ✅ Shows the doctor's profile and their patients

<table>
<tr><th>Light</th><th>Dark</th></tr>
<tr><td><img src="docs/screens/light/desktop/14-doctor-detail.webp" alt="A doctor and their patients, light, desktop"></td><td><img src="docs/screens/dark/desktop/14-doctor-detail.webp" alt="A doctor and their patients, dark, desktop"></td></tr>
<tr><td align="center"><img src="docs/screens/light/mobile/14-doctor-detail.webp" alt="A doctor and their patients, light, phone" width="230"></td><td align="center"><img src="docs/screens/dark/mobile/14-doctor-detail.webp" alt="A doctor and their patients, dark, phone" width="230"></td></tr>
</table>

#### 15. Add a patient under this doctor

> **User story:** As an admin, I want to add a patient to this doctor's list.

**Flow**

1. Click "Add patient" on the doctor's page.

**UX highlights**

- The doctor picker is hidden: the patient joins this doctor.
- "Save & add another" keeps the doctor and admission date.

**Verified in the walkthrough**

- ✅ Add patient on a doctor's page hides the doctor picker

<table>
<tr><th>Light</th><th>Dark</th></tr>
<tr><td><img src="docs/screens/light/desktop/15-add-patient-doctor-page.webp" alt="Add a patient under this doctor, light, desktop"></td><td><img src="docs/screens/dark/desktop/15-add-patient-doctor-page.webp" alt="Add a patient under this doctor, dark, desktop"></td></tr>
<tr><td align="center"><img src="docs/screens/light/mobile/15-add-patient-doctor-page.webp" alt="Add a patient under this doctor, light, phone" width="230"></td><td align="center"><img src="docs/screens/dark/mobile/15-add-patient-doctor-page.webp" alt="Add a patient under this doctor, dark, phone" width="230"></td></tr>
</table>

### Patients

#### 16. Patient records

> **User story:** As an admin, I want to see every patient across all doctors.

**Flow**

1. Open Patients from the sidebar (or press `G` then `P`).

**UX highlights**

- Each row shows age, gender, a condition badge (colour plus text), doctor and admission date.

**Verified in the walkthrough**

- ✅ Lists every patient with count and pagination

<table>
<tr><th>Light</th><th>Dark</th></tr>
<tr><td><img src="docs/screens/light/desktop/16-patients.webp" alt="Patient records, light, desktop"></td><td><img src="docs/screens/dark/desktop/16-patients.webp" alt="Patient records, dark, desktop"></td></tr>
<tr><td align="center"><img src="docs/screens/light/mobile/16-patients.webp" alt="Patient records, light, phone" width="230"></td><td align="center"><img src="docs/screens/dark/mobile/16-patients.webp" alt="Patient records, dark, phone" width="230"></td></tr>
</table>

#### 17. Filter by condition, gender and admission date

> **User story:** As an admin, I want to focus on, say, critical and recovering patients admitted this month.

**Flow**

1. Tick conditions, pick a gender and an admission-date range (presets or custom), sort.

**UX highlights**

- Several conditions at once; the result count says "match your filters".

**Verified in the walkthrough**

- ✅ Condition filter: every result is critical or recovering

<table>
<tr><th>Light</th><th>Dark</th></tr>
<tr><td><img src="docs/screens/light/desktop/17-patients-filtered.webp" alt="Filter by condition, gender and admission date, light, desktop"></td><td><img src="docs/screens/dark/desktop/17-patients-filtered.webp" alt="Filter by condition, gender and admission date, dark, desktop"></td></tr>
<tr><td align="center"><img src="docs/screens/light/mobile/17-patients-filtered.webp" alt="Filter by condition, gender and admission date, light, phone" width="230"></td><td align="center"><img src="docs/screens/dark/mobile/17-patients-filtered.webp" alt="Filter by condition, gender and admission date, dark, phone" width="230"></td></tr>
</table>

#### 18. Search

> **User story:** As an admin, I want to find a patient by name quickly.

**Flow**

1. Type part of the name (prefix match), or press `/` to jump to the search box.

**UX highlights**

- Debounced at 300 ms; the search term is in the URL.

**Verified in the walkthrough**

- ✅ Search is a name prefix match

<table>
<tr><th>Light</th><th>Dark</th></tr>
<tr><td><img src="docs/screens/light/desktop/18-patients-search.webp" alt="Search, light, desktop"></td><td><img src="docs/screens/dark/desktop/18-patients-search.webp" alt="Search, dark, desktop"></td></tr>
<tr><td align="center"><img src="docs/screens/light/mobile/18-patients-search.webp" alt="Search, light, phone" width="230"></td><td align="center"><img src="docs/screens/dark/mobile/18-patients-search.webp" alt="Search, dark, phone" width="230"></td></tr>
</table>

#### 19. Add a patient (choose the doctor)

> **User story:** As an admin, I want to record a new patient and assign their doctor.

**Flow**

1. Click "Add patient" on the Patients page (or press `N`).

**UX highlights**

- Dates can't be in the future; email is optional; the request carries an `Idempotency-Key`, so a retry never duplicates the patient.

**Verified in the walkthrough**

- ✅ Add patient from the patients page asks for the doctor

<table>
<tr><th>Light</th><th>Dark</th></tr>
<tr><td><img src="docs/screens/light/desktop/19-add-patient.webp" alt="Add a patient (choose the doctor), light, desktop"></td><td><img src="docs/screens/dark/desktop/19-add-patient.webp" alt="Add a patient (choose the doctor), dark, desktop"></td></tr>
<tr><td align="center"><img src="docs/screens/light/mobile/19-add-patient.webp" alt="Add a patient (choose the doctor), light, phone" width="230"></td><td align="center"><img src="docs/screens/dark/mobile/19-add-patient.webp" alt="Add a patient (choose the doctor), dark, phone" width="230"></td></tr>
</table>

#### 20. Edit a patient

> **User story:** As an admin, I want to update a patient, including moving them to another doctor.

**Flow**

1. Click the pencil on a row.

**UX highlights**

- Server validation errors (422) are mapped back onto the matching fields.

**Verified in the walkthrough**

- ✅ Edit patient opens prefilled

<table>
<tr><th>Light</th><th>Dark</th></tr>
<tr><td><img src="docs/screens/light/desktop/20-edit-patient.webp" alt="Edit a patient, light, desktop"></td><td><img src="docs/screens/dark/desktop/20-edit-patient.webp" alt="Edit a patient, dark, desktop"></td></tr>
<tr><td align="center"><img src="docs/screens/light/mobile/20-edit-patient.webp" alt="Edit a patient, light, phone" width="230"></td><td align="center"><img src="docs/screens/dark/mobile/20-edit-patient.webp" alt="Edit a patient, dark, phone" width="230"></td></tr>
</table>

#### 21. Delete a patient

> **User story:** As an admin, I want to remove a patient record, with a confirmation that names them.

**Flow**

1. Click the bin on a row (same flow on a doctor's page), then confirm.

**UX highlights**

- Optimistic removal with rollback; a repeated delete (404) counts as success.

**Verified in the walkthrough**

- ✅ Delete patient asks to confirm, naming them

<table>
<tr><th>Light</th><th>Dark</th></tr>
<tr><td><img src="docs/screens/light/desktop/21-delete-patient.webp" alt="Delete a patient, light, desktop"></td><td><img src="docs/screens/dark/desktop/21-delete-patient.webp" alt="Delete a patient, dark, desktop"></td></tr>
<tr><td align="center"><img src="docs/screens/light/mobile/21-delete-patient.webp" alt="Delete a patient, light, phone" width="230"></td><td align="center"><img src="docs/screens/dark/mobile/21-delete-patient.webp" alt="Delete a patient, dark, phone" width="230"></td></tr>
</table>

### Everywhere

#### 22. Account menu

> **User story:** As an admin, I want to see who's signed in and sign out.

**Flow**

1. Click your name (bottom of the sidebar) or the avatar (top right on phones).

**UX highlights**

- Signing out clears the session cookies and every cached query.

**Verified in the walkthrough**

- ✅ Account menu offers sign out

<table>
<tr><th>Light</th><th>Dark</th></tr>
<tr><td><img src="docs/screens/light/desktop/22-account-menu.webp" alt="Account menu, light, desktop"></td><td><img src="docs/screens/dark/desktop/22-account-menu.webp" alt="Account menu, dark, desktop"></td></tr>
<tr><td align="center"><img src="docs/screens/light/mobile/22-account-menu.webp" alt="Account menu, light, phone" width="230"></td><td align="center"><img src="docs/screens/dark/mobile/22-account-menu.webp" alt="Account menu, dark, phone" width="230"></td></tr>
</table>

#### 23. Keyboard shortcuts (desktop)

> **User story:** As a power user, I want to work without the mouse.

**Flow**

1. Press `?`, or click the keyboard button in the top-right corner.

**UX highlights**

- 13 shortcuts from one registry; single-key shortcuts can be switched off (WCAG 2.1.4).

**Verified in the walkthrough**

- ✅ The keyboard button opens the shortcuts panel

<table>
<tr><th>Light</th><th>Dark</th></tr>
<tr><td><img src="docs/screens/light/desktop/23-shortcuts.webp" alt="Keyboard shortcuts (desktop), light, desktop"></td><td><img src="docs/screens/dark/desktop/23-shortcuts.webp" alt="Keyboard shortcuts (desktop), dark, desktop"></td></tr>
<tr><td colspan="2" align="center"><em>Desktop only: phones have no keyboard.</em></td></tr>
</table>

#### 24. Not found

> **User story:** As an admin who followed a stale link, I want a way back.

**Flow**

1. Open a URL that doesn't exist.

**UX highlights**

- A friendly 404 with a link home, in both themes.

**Verified in the walkthrough**

- ✅ Unknown routes show the not-found page

<table>
<tr><th>Light</th><th>Dark</th></tr>
<tr><td><img src="docs/screens/light/desktop/24-not-found.webp" alt="Not found, light, desktop"></td><td><img src="docs/screens/dark/desktop/24-not-found.webp" alt="Not found, dark, desktop"></td></tr>
<tr><td align="center"><img src="docs/screens/light/mobile/24-not-found.webp" alt="Not found, light, phone" width="230"></td><td align="center"><img src="docs/screens/dark/mobile/24-not-found.webp" alt="Not found, dark, phone" width="230"></td></tr>
</table>

## 4. User flows

**Adding patients quickly** (the fastest path from the directory)

```mermaid
flowchart LR
    A[Doctors list] -->|add-patient icon on a row| B["Add patient dialog<br/>(doctor preset)"]
    A -->|"N patients →"| D[Doctor page]
    D -->|Add patient| B
    B -->|Add patient| C[Saved: toast, dialog closes,<br/>row count updates]
    B -->|Save & add another| E["Saved: fresh form<br/>(doctor + admission date kept,<br/>'N added so far')"]
    E -->|next patient| B
    E -->|Done| A
```

**Deleting a doctor** (medical records are never deleted as a side effect)

```mermaid
flowchart TD
    A[Bin icon on a doctor] --> B{Doctor has patients?}
    B -->|yes| C["Explain: 'still has N patient(s)'<br/>link to their patients, no Delete button"]
    C --> D[Move or delete the patients first]
    B -->|no| E[Confirm, naming the doctor]
    E -->|Delete| F[Row removed at once]
    F -->|server agrees| G[Toast: removed]
    F -->|server refuses| H[Row restored, error toast]
```

**Finding records**

```mermaid
flowchart LR
    S[Type in search] -->|300 ms debounce| U[URL updated, page reset to 1]
    F[Tick filters / pick dates / sort] --> U
    U --> Q[Query keyed by the URL]
    Q -->|cached| R[Results at once]
    Q -->|not cached| P[Previous results stay visible, then swap]
    R --> C["Count: 'N match your filters'"]
    C -->|nothing matches| E[Empty state with Clear filters]
```

## 5. State machines

**Session.** Tokens live in httpOnly cookies. The client never reads them; it reacts to 401s.

```mermaid
stateDiagram-v2
    [*] --> SignedOut
    SignedOut --> SignedIn: login 200 (cookies set)
    SignedOut --> SignedOut: login 401 (generic message)
    SignedIn --> Refreshing: any request returns 401 (access token expired)
    Refreshing --> SignedIn: refresh 200, retry the request once
    Refreshing --> SignedOut: refresh fails, go to /login?next=…
    SignedIn --> SignedOut: sign out (cookies cleared, cache dropped)
    note right of Refreshing
        Single-flight: concurrent 401s
        share one refresh call
    end note
```

**Create and edit dialogs** (doctor and patient)

```mermaid
stateDiagram-v2
    [*] --> Editing: open (new Idempotency-Key)
    Editing --> Editing: client validation errors shown under fields
    Editing --> Saving: submit or Ctrl/⌘+Enter (valid)
    Saving --> FieldErrors: 422 / 409 from the API
    FieldErrors --> Editing: fix and resubmit (same key, safe)
    Saving --> Closed: saved via "Add" (toast)
    Saving --> Editing: saved via "Save & add another" (form remounts, new key, fields carried over)
    Editing --> Closed: Cancel / Done / Esc
    Closed --> [*]
```

**A list** (doctors, patients, a doctor's patients)

```mermaid
stateDiagram-v2
    [*] --> Loading: first visit (skeleton with the final layout)
    Loading --> Ready: data
    Loading --> Empty: no records
    Loading --> Failed: error (message, Retry, reference id)
    Ready --> Stale: filter or page changes (old rows stay, dimmed)
    Stale --> Ready: new data
    Stale --> NoMatch: nothing matches
    NoMatch --> Ready: Clear filters
    Failed --> Loading: Retry
```

**Optimistic delete**

```mermaid
stateDiagram-v2
    [*] --> Confirming: bin icon
    Confirming --> [*]: Cancel
    Confirming --> Removed: Delete (row removed from cache at once)
    Removed --> Done: 204, or 404 (already gone)
    Removed --> RolledBack: other error (snapshot restored, toast)
    Done --> [*]: lists, doctor and dashboard refetch
    RolledBack --> [*]
```

## 6. System architecture

```mermaid
flowchart LR
    subgraph Browser
        UI["React UI<br/>(Server + Client Components)"]
        RQ["TanStack Query cache"]
        URL["URL state (nuqs)<br/>search · filters · page · open dialogs"]
    end

    subgraph Next["Next.js server (Vercel)"]
        PX["proxy.ts<br/>optimistic auth redirect"]
        RW["Rewrite /api/* → API_URL"]
        RSC["Prerendered shells (PPR)"]
    end

    subgraph API["Express API (Render)"]
        MW["helmet · rate limit · requireAuth · Zod"]
        SVC["Application services"]
        REPO["Mongo repositories"]
    end

    DB[("MongoDB Atlas")]

    UI <--> RQ
    UI <--> URL
    UI -- "page navigation" --> PX --> RSC
    RQ -- "fetch /api/v1/... (same origin, cookies)" --> RW --> MW --> SVC --> REPO --> DB
```

**How a request flows**

1. **Navigation.** `src/proxy.ts` runs before every page. If there's no `dt_refresh` cookie, it redirects to `/login?next=…`. This is a UX shortcut only: the API checks the access token on every call.
2. **Rendering.** Pages are Server Components with prerendered shells (Cache Components / partial prerendering). The interactive parts (lists, forms, charts) are client components inside Suspense boundaries. Each boundary's fallback has the same layout as the component's own loading state, so a page shows one skeleton, never two.
3. **Data.** Components never call `fetch`. They use hooks from `features/<feature>/queries.ts`, which call typed functions in `features/<feature>/api.ts`, which go through one client, `lib/api-client.ts`. The client sends requests to the same-origin path `/api/v1/...`, so cookies stay first-party.
4. **State.** TanStack Query owns server data. Search, filters, sort, page and even "which dialog is open" (`?new=true`, `?addPatient=<id>`) live in the URL via nuqs. Everything else is local component state. There's no global store.
5. **Mutations** invalidate every query they affect (adding a patient refreshes the lists, that doctor and the dashboard). Creates send an `Idempotency-Key`.

## 7. Technical decisions

### 1. Same-origin `/api` proxy with httpOnly cookies, instead of tokens in JavaScript

**Problem.** The frontend (Vercel) and API (Render) run on different domains. The usual shortcut is to return a JWT in the login response and keep it in `localStorage`. Then any XSS bug can steal the session, and every request needs an `Authorization` header.

**Decision.** The browser only ever talks to the Next.js origin. `next.config.ts` rewrites `/api/:path*` to the Express API, so the API's `Set-Cookie` headers land on the app's own domain: `dt_access` (a 15-minute JWT) and `dt_refresh` (an opaque, rotating token; the server stores only its hash), both `httpOnly`, `SameSite=Lax`, and `Secure` in production.

**Consequences.** No CORS preflights and no third-party-cookie blocking. `SameSite=Lax` plus JSON-only endpoints is the CSRF defence, and an XSS bug can't read the session. `proxy.ts` decides on the server before any HTML is sent. The trade-off is one extra hop through Vercel per API call, which is negligible for an admin tool.

### 2. TanStack Query + URL state (nuqs) instead of Redux or Zustand

**Problem.** Almost all state here is a copy of server data. The rest is "which page, which filters". A global store would mean hand-writing loading flags, invalidation and refetching, and a filtered view still couldn't be shared or survive a reload.

**Decision.** Server data in TanStack Query; search, filters, sort and page in the URL; dialog inputs in local state.

**Consequences.** The URL _is_ the cache key (`doctorKeys.list(filters)`), so changing a filter fetches or reuses the right page automatically. `keepPreviousData` means no flash between pages; deletes are optimistic with rollback; mutations never auto-retry (creates carry an `Idempotency-Key` instead). Components subscribe only to the data they read.

### 3. Dialogs opened from the URL, so features stay decoupled

"Add doctor" is `?new=true`; "add a patient for this doctor" from the directory is `?addPatient=<id>`. The doctors feature sets the parameter and the patients feature, mounted next to it by the route, reads it. Neither imports the other. The page headers stay Server Components, and Back closes a dialog as users expect.

### 4. "Save & add another" remounts the form instead of resetting it

Resetting a React Hook Form in place left stale values and errors, because the React Compiler memoises the inputs and they never re-register. After each save the dialog now remounts the form with a new key. That guarantees clean values, errors and focus, gives every record its own `Idempotency-Key`, and carries over only what should carry over (doctor and admission date for patients, hospital for doctors).

### 5. One loading skeleton per page

A Suspense fallback that differs from the component's own loading state makes the page jump from one skeleton to another. Route fallbacks are built from the same pieces (`ListSkeleton`, `DoctorProfileSkeleton`, `PatientsSectionSkeleton`). The walkthrough measured identical block positions in the server fallback and the client's first paint.

### 6. A design system, not a component kit

Base UI provides unstyled, accessible behaviour (focus traps, keyboard navigation, ARIA). The look is entirely the app's own semantic tokens in `globals.css`, with a full dark palette (charcoal, forest green, lime). A dedicated `brand-ink` token keeps brand-coloured icons and focus rings visible in both themes. Variants are typed with `tailwind-variants`.

### 7. Keyboard shortcuts from one registry

`lib/shortcuts.ts` defines all 13 shortcuts once; the key handling and the help panel both read it, so they can't drift apart. Shortcuts ignore typing (except Ctrl/⌘+Enter), pause while a dialog is open, and single-key ones can be switched off (WCAG 2.1.4).

## 8. Error handling

Errors are handled in layers; each layer handles what it can and passes the rest on. Nothing swallows an error.

```
api-client → ApiError → TanStack Query (retry policy, global handlers)
           → component (inline state, form fields) → error.tsx → global-error.tsx
```

| Situation                                                     | What the user sees                                                         | Where                              |
| ------------------------------------------------------------- | -------------------------------------------------------------------------- | ---------------------------------- |
| Any failed request                                            | A typed `ApiError` with a stable `code` and the API's `requestId`          | `lib/api-client.ts`                |
| No response (offline, DNS)                                    | "You're offline or the server is unreachable…"                             | `NETWORK_ERROR` in `lib/errors.ts` |
| Non-JSON reply (e.g. a proxy page during a Render cold start) | "The server sent an unexpected response…"                                  | `UNEXPECTED_RESPONSE`              |
| Access token expired                                          | Nothing: one shared refresh, then the request is retried once              | api-client                         |
| Session gone                                                  | Redirect to `/login?next=…`, no toast                                      | api-client                         |
| First load of a list fails                                    | Inline error state with Retry and "Reference: <requestId>"                 | `ErrorState`                       |
| A background refetch fails                                    | A toast (the stale data stays on screen)                                   | `QueryCache.onError`               |
| Form gets 422 / 409                                           | Messages on the matching fields; the dialog stays open with the input kept | `applyApiErrors`                   |
| Optimistic delete fails                                       | Row restored, toast                                                        | mutation `onError`                 |
| Delete returns 404                                            | Treated as success (already gone)                                          | `ignoreNotFound`                   |
| Create returns `409 IDEMPOTENCY_IN_PROGRESS`                  | Keeps waiting and retries once                                             | `retryWhileInProgress`             |
| A render error in a page                                      | The page's error boundary with Try again; the sidebar keeps working        | `app/(dashboard)/error.tsx`        |
| The root layout itself fails                                  | A minimal last-resort page                                                 | `app/global-error.tsx`             |

Queries retry twice, and only for 5xx and network errors, never a 4xx. Mutations never retry automatically, because a repeated POST could duplicate data; that's what the `Idempotency-Key` is for. User-facing copy comes from one map, so no screen ever shows a stack trace or raw JSON.

## 9. Performance

**What's in place**

| Area                     | Technique                                                                                                                                                                                                           |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Rendering                | Server Components by default; prerendered shells (partial prerendering) so HTML arrives before data; `'use client'` only on interactive leaves                                                                      |
| Re-renders               | React Compiler memoises automatically; components subscribe to the narrowest query or URL key; no global store to fan out updates                                                                                   |
| Network                  | One dashboard request for every widget; search debounced 300 ms; query results cached by URL; previous page kept while the next loads; the API caches analytics 30 s and sends `Cache-Control: private, max-age=30` |
| Bundle                   | Charts lazy-loaded with `next/dynamic`; fonts via `next/font` (self-hosted, no layout shift); icons tree-shaken from `lucide-react`                                                                                 |
| Perceived speed          | Skeletons with the final layout; optimistic deletes; in-place dialogs instead of page loads                                                                                                                         |
| Backend (see API README) | An index behind every filter and sort; anchored prefix search; page and count in parallel; grouped counts instead of per-row queries                                                                                |

**Measured.** The production login page reaches first contentful paint in 0.2–0.8 s on a cold cache, transferring 337 KB (table in [section 2](#2-how-this-was-evaluated)). The slowest real-world factor is the free Render plan's cold start (up to a minute after idling), not the frontend.

**Next steps, in order of value**

1. **Remove the cold start:** a paid Render instance, or a scheduled health ping during review hours; and put the API in the same region as Vercel's functions to cut the proxy hop.
2. **Prefetch on intent:** prefetch a doctor's profile and first patient page when the pointer rests on "N patients →", so the detail page opens with data.
3. **Server-side first page:** fetch the first page on the server and hydrate the query cache (`HydrationBoundary`), so lists render with data instead of a skeleton.
4. **Chart weight:** Recharts is the largest client dependency; the sparkline is already plain SVG, and the remaining charts could follow if the bundle grows.
5. **Virtualise** only if page sizes grow beyond ~100 rows; at 10 rows per page it isn't needed.

## 10. Tests

```bash
pnpm test
```

70 tests with Vitest and Testing Library (jsdom), all passing. Each test sits **next to the file it covers**, inside its feature. Shared helpers live in `src/test/`: `renderWithProviders` (a fresh query client and in-memory URL state) and `mockApi` (a fake `fetch` keyed by `METHOD /path` that fails on any unexpected request). Components are queried by role and accessible name, the way assistive technology finds them. Writing these tests caught two real screen-reader labelling bugs ("Clear all3filters", "Add patientfor …"), both fixed.

| Test file                                                        | Tests |
| ---------------------------------------------------------------- | ----- |
| `src/components/data-table/result-count.test.tsx`                | 1     |
| `src/components/feedback/form-actions.test.tsx`                  | 3     |
| `src/components/filters/clear-filters-button.test.tsx`           | 1     |
| `src/features/auth/components/login-form.test.tsx`               | 4     |
| `src/features/auth/redirect.test.ts`                             | 6     |
| `src/features/dashboard/components/specialization-tiles.test.ts` | 2     |
| `src/features/dashboard/intervals.test.ts`                       | 1     |
| `src/features/doctors/components/doctor-form.test.tsx`           | 5     |
| `src/features/doctors/components/doctor-profile.test.tsx`        | 2     |
| `src/features/doctors/components/doctors-toolbar.test.tsx`       | 4     |
| `src/features/doctors/schemas.test.ts`                           | 4     |
| `src/features/patients/components/patient-form.test.tsx`         | 5     |
| `src/features/patients/schemas.test.ts`                          | 5     |
| `src/hooks/use-shortcut.test.tsx`                                | 7     |
| `src/lib/api-client.test.ts`                                     | 7     |
| `src/lib/errors.test.ts`                                         | 4     |
| `src/lib/shortcuts.test.ts`                                      | 9     |

**What the suites prove**

- **Forms:** client validation; the request sent (body, `Idempotency-Key`, PATCH with only changed fields); server 409/422 on the right field; "Save & add another".
- **URL-driven UI:** filters written to the query string (multi-select, names with commas intact), reset to page 1, Clear all.
- **Auth:** safe `?next=` redirect, no open redirect, one generic error with the password cleared; the API client's refresh-and-retry and redirect to login.
- **Loading states:** the doctor page keeps its back link in place while loading (no layout shift).
- **Shortcuts:** key matching on Mac and other platforms, sequences, no firing while typing or with a dialog open, the WCAG switch.

The API has 70 more tests that run the real Express app on in-memory adapters (see its README). Husky runs the related tests on every commit and the full suite before every push; CI runs it too.

## 11. Project structure

```
src/
  app/                          routes only: thin pages, layouts, loading and error boundaries
    (auth)/login/               public sign-in page
    (dashboard)/                signed-in shell: dashboard, doctors, doctors/[id], patients
  features/<feature>/           auth · dashboard · doctors · patients
    api.ts                      typed calls through lib/api-client
    queries.ts                  TanStack Query hooks + query-key factory
    schemas.ts / types.ts       Zod form schemas and response types mirroring the API
    components/ hooks/          feature UI and hooks, with their *.test.tsx beside them
  components/
    ui/                         primitives on Base UI: Button, Dialog, Select, Menu, Kbd…
    data-table/ filters/        generic table, pagination, list and toolbar skeletons, filters
    charts/ feedback/           chart wrappers, stat cards, empty/error states, form actions
    layout/                     sidebar, mobile dock, theme toggle, shortcuts panel and provider
  hooks/                        shared hooks: useShortcut, useAddAnother, useStoredFlag…
  lib/                          api-client, errors, shortcuts registry, formatting, constants
  test/                         test helpers only: renderWithProviders, mockApi
  proxy.ts                      optimistic auth redirect (Next 16's middleware)
docs/screens/                   the screenshots in this README
```

Components live in four tiers (primitives → shared composites → feature components → routes), and dependencies only point down. ESLint enforces the direction, caps files at 150 lines and functions at 80, and generic components never mention "doctor" or "patient". `AGENTS.md` holds the full conventions.

## 12. Findings and what's next

### The data model: many-to-many

In reality a doctor can work at several hospitals and in several specialties, and a patient can be seen by several doctors. The brief asks for a doctor with one specialization and one hospital, and patients "under a specific doctor", so the app implements exactly that: one doctor to many patients. The evolution to a real hospital-group model would be:

```mermaid
erDiagram
    DOCTOR ||--o{ AFFILIATION : holds
    HOSPITAL ||--o{ AFFILIATION : employs
    AFFILIATION }o--|| SPECIALTY : "practises as"
    PATIENT ||--o{ ADMISSION : has
    HOSPITAL ||--o{ ADMISSION : hosts
    ADMISSION ||--o{ CARE_TEAM_MEMBER : "cared for by"
    AFFILIATION ||--o{ CARE_TEAM_MEMBER : "serves as"
```

- **Affiliation** (like a FHIR PractitionerRole): one doctor × hospital × specialty or department.
- **Admission** (like a FHIR Encounter): a patient's stay, with its own condition and dates, and an embedded care team. Recording the department on the admission keeps per-department statistics from double-counting a patient seen by several doctors.
- **Frontend impact:** filters become many-to-many (already multi-select), the doctor page lists affiliations, and the patient page shows an admission timeline. The feature folders and query-key factories let this land one feature at a time.

### Edge cases found during testing

- **Refresh interrupted by navigation:** if a page change aborts a token refresh mid-flight, the browser keeps the old refresh token; reusing it after 10 s is treated as theft and signs the user out. It's rare with 15-minute tokens. Fix: retry the refresh once with the rotated token before treating reuse as theft, or let the client finish the refresh before navigating.
- **Doctor picker** in the patient form loads at most 100 doctors (the API's page cap). Fix: a searchable, server-backed combobox.
- **Copy:** "still has 22 patient(s)" should pluralise properly; an empty list shows "Page 1 of 0".
- **Free-tier cold start** (see [Performance](#9-performance)).

### Improvements discussed and not yet built

- A human-readable patient number (MRN, e.g. `P-000482`) and a soft duplicate-patient warning (same name and date of birth, "add anyway").
- A guided first-run tour; today the first-visit tip and the shortcuts panel introduce the power features.
- Row-by-row keyboard navigation in tables (`j`/`k`).
- A seed script, so a fresh database has demo data in one command.

## 13. Build log

The app was built in small, reviewed slices, one pull request each, across both repositories.

| Merged (UTC) | Repo | PR                                                                                                                                   | What landed                                                                                                                       |
| ------------ | ---- | ------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| 10 Nov 19:03 | API  | [#1](https://github.com/SadeeMsr/doctor-tracker-api/pull/1)                                                                          | Cookie-based JWT auth with rotating refresh tokens                                                                                |
| 10 Nov 19:55 | API  | [#4](https://github.com/SadeeMsr/doctor-tracker-api/pull/4)                                                                          | Patients API and doctor-scoped patient routes                                                                                     |
| 10 Nov 20:02 | API  | [#5](https://github.com/SadeeMsr/doctor-tracker-api/pull/5)                                                                          | Dashboard summary endpoint                                                                                                        |
| 11 Nov 01:13 | Web  | [#2](https://github.com/SadeeMsr/doctor-tracker-web/pull/2)                                                                          | Login page and design tokens                                                                                                      |
| 11 Nov 01:14 | Web  | [#3](https://github.com/SadeeMsr/doctor-tracker-web/pull/3)                                                                          | Dashboard, doctors and patients screens                                                                                           |
| 11 Nov 02:36 | Web  | [#4](https://github.com/SadeeMsr/doctor-tracker-web/pull/4)                                                                          | Dialog redesign, visible patients link, add patient from the patients page                                                        |
| 11 Nov 11:25 | Both | [API #6](https://github.com/SadeeMsr/doctor-tracker-api/pull/6), [Web #5](https://github.com/SadeeMsr/doctor-tracker-web/pull/5)     | First READMEs                                                                                                                     |
| 11 Nov 11:25 | Both | [API #7](https://github.com/SadeeMsr/doctor-tracker-api/pull/7), [Web #7](https://github.com/SadeeMsr/doctor-tracker-web/pull/7)     | Dead-code cleanup before deployment                                                                                               |
| 11 Nov 11:26 | Web  | [#6](https://github.com/SadeeMsr/doctor-tracker-web/pull/6)                                                                          | Session refresh fix for `/auth/me`                                                                                                |
| 11 Nov 11:25 | API  | [#8](https://github.com/SadeeMsr/doctor-tracker-api/pull/8)                                                                          | Multi-value specialization and hospital filters                                                                                   |
| 11 Nov 11:26 | Web  | [#8](https://github.com/SadeeMsr/doctor-tracker-web/pull/8)                                                                          | Dark mode and theme toggle; faster doctors flow (in-place add, icon actions, multi-select, Clear all, counts, Save & add another) |
| 11 Nov 16:02 | Both | [API #9](https://github.com/SadeeMsr/doctor-tracker-api/pull/9), [Web #9](https://github.com/SadeeMsr/doctor-tracker-web/pull/9)     | Keyboard shortcuts; test suites wired into Husky and CI                                                                           |
| 11 Nov 16:31 | Both | [API #10](https://github.com/SadeeMsr/doctor-tracker-api/pull/10), [Web #10](https://github.com/SadeeMsr/doctor-tracker-web/pull/10) | Deployed (Render + Vercel); live URLs                                                                                             |
| 11 Nov 16:45 | Web  | [#11](https://github.com/SadeeMsr/doctor-tracker-web/pull/11)                                                                        | One loading skeleton per page                                                                                                     |
| 11 Nov       | Web  | this change                                                                                                                          | Footer hint removed; this README, walkthrough and screenshots                                                                     |

## 14. Tech stack and setup

| Concern                  | Choice                                                                                        |
| ------------------------ | --------------------------------------------------------------------------------------------- |
| Framework                | Next.js 16 (App Router, React Compiler, Cache Components, typed routes), React 19             |
| Language                 | TypeScript 6, strict, with `noUncheckedIndexedAccess`                                         |
| Styling                  | Tailwind CSS v4 with semantic design tokens, `tailwind-variants`                              |
| UI primitives            | Base UI (`@base-ui/react`)                                                                    |
| Server state / URL state | TanStack Query 5 / nuqs                                                                       |
| Tables / forms / charts  | TanStack Table 9 / React Hook Form + Zod 4 / Recharts 3                                       |
| Tests                    | Vitest + Testing Library (jsdom)                                                              |
| Tooling                  | ESLint 9 (with size limits and tier rules), Prettier, Husky, lint-staged, commitlint, pnpm 12 |

### Setup

1. Prerequisites: Node.js **26** (see `.nvmrc`) and pnpm **12** (`corepack enable`), and the [API](https://github.com/SadeeMsr/doctor-tracker-api) running locally.
2. Install and configure:

   ```bash
   git clone https://github.com/SadeeMsr/doctor-tracker-web.git
   ```

   ```bash
   cd doctor-tracker-web && pnpm install && cp .env.example .env.local
   ```

   | Variable                    | Required | Description                                                                                  |
   | --------------------------- | -------- | -------------------------------------------------------------------------------------------- |
   | `API_URL`                   | yes      | Base URL of the Express API. Next.js proxies `/api/*` to it. Default `http://localhost:4000` |
   | `NEXT_PUBLIC_DEMO_EMAIL`    | no       | With the password, shows a one-click "Use the demo account" button on the login page         |
   | `NEXT_PUBLIC_DEMO_PASSWORD` | no       | The demo account's password. Leave both unset in a real deployment                           |

3. Run it (start the API first with `pnpm dev` in its repo):

   ```bash
   pnpm dev
   ```

   Open <http://localhost:3000> and sign in with the admin account created by the API's `pnpm db:create-admin`.

| Command                                      | What it does                           |
| -------------------------------------------- | -------------------------------------- |
| `pnpm dev`                                   | Dev server on port 3000                |
| `pnpm build` / `pnpm start`                  | Production build and server            |
| `pnpm lint` · `pnpm typecheck` · `pnpm test` | ESLint, `tsc` with route types, Vitest |
| `pnpm format`                                | Prettier                               |

**Deployment.** Vercel builds `main` automatically. Set `API_URL` to the Render URL; `NEXT_PUBLIC_DEMO_*` are optional.
