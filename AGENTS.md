<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Doctor Tracker Web: rules for AI agents and contributors

This file is the source of truth for how code is written in this repo. Read it fully before
changing anything. If a rule blocks you, stop and ask; do not work around it.

## Project

Admin dashboard for managing doctors and their patients, with analytics charts.

- **Runtime:** Node 26 LTS (`.nvmrc`), pnpm 12.
- **Stack:**
  - Next.js 16 (App Router, React Compiler, Cache Components, typed routes), React 19,
    TypeScript 6 (strict)
  - Tailwind CSS v4, Base UI (`@base-ui/react`), tailwind-variants
  - TanStack Query 5 + Table 9, nuqs, React Hook Form + Zod 4, Recharts 3, date-fns, sonner,
    lucide-react
- **Backend:** a separate repo (`doctor-tracker-api`, Express). The browser never calls it
  directly: `next.config.ts` rewrites `/api/*` to `API_URL`, so auth cookies stay first-party.

## Commands

| Task                  | Command                                                                     |
| --------------------- | --------------------------------------------------------------------------- |
| Dev server            | `pnpm dev` (the API must run on `API_URL`, default `http://localhost:4000`) |
| Lint / types / format | `pnpm lint` · `pnpm typecheck` · `pnpm format`                              |
| Production build      | `pnpm build` (catches prerender and Suspense errors that typecheck misses)  |

Run `pnpm lint && pnpm typecheck && pnpm build` before you say something is done.

## Next.js 16 rules (read the bundled docs first)

- Docs for the installed version live in `node_modules/next/dist/docs/`. Check them before using
  any Next API; do not rely on memory from older versions.
- **Route protection:**
  - It lives in `src/proxy.ts` (Next 16 renamed `middleware.ts` to `proxy.ts`).
  - It only checks that the `dt_refresh` cookie exists, as an optimistic redirect. Real
    authorization is the API's job; never trust the proxy for security.
- **Cache Components is on:**
  - Request-time APIs (`cookies()`, `headers()`, `searchParams`) in a Server Component must sit
    inside a `<Suspense>` boundary, or the build fails.
  - Don't add `export const dynamic`/`runtime`/`revalidate` segment configs; use `'use cache'`
    only when deliberately caching.
- **Server Components by default.**
  - Add `'use client'` only to the smallest leaf that needs state, effects, browser APIs or
    event handlers.
  - Pages and layouts stay Server Components where possible.
- **Typed routes are on:**
  - `href` must be a real route (`Route` type). Never cast a string to silence it.
  - Page and layout props use the global helpers `PageProps<'/route'>` / `LayoutProps<'/route'>`.
- **React Compiler is on:** don't hand-write `useMemo`, `useCallback` or `React.memo` unless a
  measured problem justifies it (leave a comment saying so).
- Use `next/link` for internal navigation, `next/image` for images, `next/font` for fonts and
  `next/dynamic` to lazy-load heavy client-only code (charts).
- Every route segment with data has a `loading.tsx` or Suspense fallback and an `error.tsx`.
  Set page titles via `metadata`.

## Folder structure

```
src/
  app/                    routes only: pages, layouts, loading/error/not-found. Thin. No logic.
    (auth)/login/         public routes
    (dashboard)/          authenticated shell (sidebar + header) and its pages
  features/<feature>/     everything for one feature (doctors, patients, dashboard, auth)
    api.ts                typed calls via lib/api-client (no React)
    queries.ts            TanStack Query hooks + query-key factory
    types.ts              response types mirroring the API presenters
    schemas.ts            Zod form schemas mirroring the API validation
    components/           feature-specific components
    hooks/                feature-specific hooks (use-doctor-filters.ts)
  components/
    ui/                   design-system primitives (Button, Input, Dialog, Select, Badge...)
    layout/               app shell pieces (sidebar, header, mobile nav)
    data-table/           generic TanStack Table wrapper, pagination, toolbar
    filters/              search, date range and facet filters bound to URL state
    charts/               chart wrappers and stat cards
    feedback/             EmptyState, ErrorState, ConfirmDialog, skeletons, PageHeader
  hooks/                  generic hooks used by 2+ features (useDebounce, useMediaQuery)
  lib/                    framework-agnostic helpers: api-client, query-client, cn, constants
```

- Code used by one feature lives in that feature. It moves to `components/` or `hooks/` only
  when a **second** feature needs it.
- `app/` files import from `features/` and `components/`; features never import from `app/`.
  Features don't import each other's internals; share through `components/` or `lib/`.
- **Names:**
  - files kebab-case (`doctor-form.tsx`); components PascalCase
  - hooks `useX`
  - **named exports** everywhere, except Next route files (`page`, `layout`, `error`, ...),
    which must default-export
- No barrel `index.ts` files. Import from the file that defines the thing.

## Component design: size limits, splitting and reuse

### Hard limits (ESLint enforces these; the pre-commit hook blocks violations)

| Limit                                     | Value                                    | Rule                     |
| ----------------------------------------- | ---------------------------------------- | ------------------------ |
| Lines per file                            | **150** (250 in `components/ui/`)        | `max-lines`              |
| Lines per function (components and hooks) | **80**                                   | `max-lines-per-function` |
| JSX nesting depth                         | **5 levels**                             | `react/jsx-max-depth`    |
| Positional parameters                     | **3** (components take one props object) | `max-params`             |

Blank lines and comments don't count. **Hitting a limit means "split it", never "raise the
limit" or add `eslint-disable`.**

### When to split (any one of these is enough, even under the limits)

1. **A section has its own state, effect or handlers.** It becomes its own component, and the
   state lives in it.
2. **A JSX block needs a label comment** (`{/* Filters */}`, `{/* Header */}`). That label is
   the component name: `<DoctorFilters />`, `<PageHeader />`.
3. **A `.map()` renders more than ~5 lines.** Extract the item component (`<DoctorCard />`).
4. **A branch renders a whole alternate UI** (loading, empty, error). Use the shared
   `feedback/` components instead of inline markup.
5. **Logic before the `return` passes ~15 lines** (derived data, handlers, query wiring). Move
   it to a custom hook in the feature's `hooks/` folder (`use-doctor-filters.ts`), so the
   component only renders.
6. **One component both fetches and renders a lot of UI.** Split them:
   - a **connected** component calls the query hooks and handles loading, empty and error;
   - a **presentational** component receives data and callbacks as props and renders
     (`doctors-section.tsx` → `doctors-table.tsx`).
7. **A props list passes 7 props or 2 layout booleans** (`showX`, `hideY`). Switch to
   composition (`children`, slot props like `actions`) or split into separate components.

### How to split

- Extract into a **sibling file in the same folder** first:
  `doctor-form.tsx` → `doctor-form.tsx` + `doctor-contact-fields.tsx`.
- When one component grows to 3+ files, give it a folder:
  `features/doctors/components/doctor-form/{doctor-form,contact-fields,schedule-fields}.tsx`.
  There's no `index.ts`; import the main file by name.
- A small private helper component may stay in the same file only if it is under ~30 lines,
  not exported, and used only there. Anything bigger gets its own file.
- **Pass the minimum.**
  - Props are the values the child renders (`doctor`, `isPending`, `onDelete`), not whole query
    results or `form` objects.
  - Prefer an entity or primitives over spreading unrelated parent props.
- **Splitting never changes behaviour.** Don't redesign while extracting; do that in a
  separate commit.

### Reusability tiers: where each component belongs

Dependencies only point **down** this list. A lower tier never imports a higher one.

| Tier                 | Folder                                                   | Contains                                                                                                             | Knows the domain?                               | Fetches data?                           |
| -------------------- | -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- | --------------------------------------- |
| 4. Routes            | `app/**`                                                 | `page`/`layout` files: read params, set metadata, compose features. Max ~40 lines.                                   | via features                                    | no                                      |
| 3. Feature           | `features/<f>/components`                                | Domain UI: `DoctorForm`, `DoctorsTable`, `PatientConditionBadge`                                                     | **yes**                                         | yes, via its own `queries.ts` hooks     |
| 2. Shared composites | `components/{data-table,filters,charts,layout,feedback}` | Generic building blocks: `DataTable<T>`, `SearchInput`, `DateRangeFilter`, `StatCard`, `EmptyState`, `ConfirmDialog` | **no** (no "doctor"/"patient" in code or props) | no: data and callbacks come in as props |
| 1. Primitives        | `components/ui`                                          | Design system: `Button`, `Input`, `Select`, `Dialog`, `Badge`, `Skeleton`                                            | no                                              | no                                      |

Then `lib/` (pure helpers) sits under all of them.

- **Tier 1 rules:**
  - one job each, styled with `tv()` variants
  - accept `className` plus the native element props (`ComponentProps<'input'>`) and spread
    them; React 19 passes `ref` as a normal prop
  - wrap a Base UI part instead of rebuilding it
  - no app-specific text
- **Tier 2 rules:**
  - generic over data via TypeScript generics (`DataTable<TData>`, `FacetFilter<TValue>`),
    never `any`
  - labels and text come in as props
  - may bind to URL state through a param-name prop, but never hard-codes a feature's params
- **Tier 3 rules:**
  - compose tiers 1–2
  - all domain wording, formatting and mapping happens here (e.g. condition → badge variant)

### When something becomes reusable

- **Default: build it inside the feature (tier 3).** Promote it to tier 2 only when a **second**
  feature needs it.
  - When you promote it, remove all domain words and make the varying parts props, generics or
    `children`.
  - Never add `if (type === 'doctor')` branches or mode flags.
- **Known-generic from day one**, so build these in tier 2 directly:
  - `DataTable`, `Pagination`, `SearchInput`, `DateRangeFilter`, `FacetFilter`
  - `PageHeader`, `EmptyState`, `ErrorState`, `ConfirmDialog`, table and card skeletons
  - `StatCard`, chart wrappers
- **Similar is not the same.** `DoctorForm` and `PatientForm` stay separate even if they look
  alike. Merge code only when it changes for the same reason; share the primitives (fields,
  buttons) instead.
- **Reusable component API conventions:**
  - composition over configuration (`children`, slot props)
  - variants via `tv()` (`variant`, `size`), not one component per colour
  - event props are `onX`, booleans `isX`/`hasX`
  - a one-line JSDoc with a usage example on every tier 1–2 export
- Hooks follow the same path: `features/<f>/hooks/` first, promoted to `src/hooks/` on the
  second use, with no domain knowledge left inside.

## Data fetching & server state

- **All HTTP goes through `api` in `src/lib/api-client.ts`.**
  - It sends cookies, parses the error envelope into `ApiError`, and refreshes the session
    once on a 401 (shared across concurrent requests).
  - Never call `fetch` in a component, and never call the Express URL directly.
- **TanStack Query owns server state.**
  - Components use the hooks in `features/<feature>/queries.ts`; no `useEffect` + `useState`
    data fetching.
  - Query keys come from a per-feature key factory (`doctorKeys.list(filters)`); never write
    inline key arrays.
  - Paginated lists use `placeholderData: keepPreviousData` (no flash between pages).
- **Mutations:**
  - invalidate every affected key (a patient change also invalidates doctor detail and
    dashboard keys)
  - show a success toast in the mutation's own `onSuccess`; error toasts come from the global
    handler (see "Error handling")
  - make deletes optimistic, with rollback
  - follow the retry and idempotency rules in "Error handling" and "Idempotency"
- Types for API responses live in `features/<feature>/types.ts` and match the API presenter
  exactly (`{ data }`, `{ data, meta }`, ISO date strings). Never use `any` or guessed shapes.
- API base path `/api/v1` is the constant `API_BASE_PATH`; never hard-code it again.

## Client state

- **No Redux, Zustand or global stores.** This app's state is server state (TanStack Query) plus
  URL state.
- **Search, filters, sort and pagination live in the URL** via `nuqs` (shareable, back button
  works).
  - Changing a filter resets `page` to 1.
  - Debounce search input by 300 ms before it hits the URL.
- Everything else is local `useState`. Use React Context only for truly app-wide UI concerns,
  never for server data.

## Styling & design system

- **Tailwind only.**
  - No CSS modules, no styled-components or other CSS-in-JS, no inline `style` (except values
    computed at runtime, such as chart colours).
  - Don't add shadcn/ui or another component kit.
- **Use semantic design tokens from `src/app/globals.css`:**
  - `bg-surface`, `bg-muted`, `text-muted-foreground`, `border-border`, `bg-primary`,
    `text-danger`, `chart-1..5`, `rounded-lg`
  - Never raw palette colours (`bg-blue-500`), hex values or arbitrary colours. Need a new
    colour? Add a token for both light and dark first.
- **Variants:**
  - Component variants use `tv()` from `tailwind-variants` (see `components/ui/button.tsx`).
  - Merge classes with `cn()` from `lib/cn.ts`; no string concatenation for conditional classes.
  - Primitives accept and merge a `className` prop.
- **Interactive primitives** (dialog, select, menu, popover, tooltip, drawer, tabs, checkbox) are
  built on `@base-ui/react` and wrapped once in `components/ui/`. Never hand-roll focus traps,
  portals or keyboard handling.
- **Layout:**
  - mobile-first: design for 375px, enhance with `sm:`/`md:`/`lg:`
  - no horizontal page scroll at any width
  - data tables become stacked cards below `md`
- Dark mode works through the `.dark` class (next-themes). Every new UI must look right in both
  themes.
- Icons come from `lucide-react`; decorative icons get `aria-hidden`.

## Forms

- React Hook Form + `zodResolver`. Schemas live in `features/<feature>/schemas.ts` and mirror
  the API's Zod rules (same limits, same enums).
- **Show field errors under each field.** When the API returns a `422`, map `details[].path`
  back onto the form fields. When it returns a `409`, show the error on the conflicting field.
- Disable submit and show progress while pending. Never allow double-submits.

## Error handling

Errors are handled in layers. Each layer handles what it can and passes the rest on. Nothing
swallows an error.

```
api-client  →  ApiError  →  TanStack Query (retry policy, global handlers)
            →  component (inline state, form fields)  →  error.tsx  →  global-error.tsx
```

### Layer 1: `lib/api-client.ts` turns every failure into `ApiError`

- **Non-2xx responses** become `ApiError { status, code, message, details, requestId }`, parsed
  from the API envelope.
- **Network failures** (`fetch` rejects: offline, DNS, CORS) also become
  `ApiError` with `status: 0`, `code: 'NETWORK_ERROR'`.
  - An abort (`AbortError`) caused by query cancellation is rethrown untouched, never toasted.
- **`401`:**
  - refresh once (single-flight), retry the request once
  - if that fails, hard-redirect to `/login?next=...`
  - never show a toast for it
- Code outside the client only ever sees `ApiError`. Branch on `error.code` (stable) or
  `error.status`, **never on `error.message`** (wording can change).

### Layer 2: TanStack Query defaults (`lib/query-client.ts`)

|           | Retry                                                         | Global handler                                                                                                                                                   |
| --------- | ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Queries   | Up to 2 times, only for `5xx` / `NETWORK_ERROR`; never a 4xx. | `QueryCache.onError`: toast **only if the query already had data** (a background refetch failed). First-load failures are shown inline by the component instead. |
| Mutations | **Never** (`retry: 0`): a retried POST can duplicate data     | `MutationCache.onError`: toast `getErrorMessage(error)`, unless `meta: { errorHandledLocally: true }`                                                            |

- Both handlers live in `makeQueryClient()`; `errorHandledLocally` is typed through TanStack's
  `Register` interface.
- Forms set `meta: { errorHandledLocally: true }` because they show 422/409 errors on the
  fields; toasting as well would duplicate the message.

### Layer 3: the component decides what the user sees

| Situation                         | UI                                                                                                                                                                                       |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A query failed on first load      | `<ErrorState>` from `components/feedback/` in place of the content, with a **Retry** button (`refetch`) and the `requestId` as "Reference: ...". Never a blank area, never only a toast. |
| A detail query returned `404`     | Call `notFound()` (in a server component) or render the not-found state. It's not an error toast.                                                                                        |
| A form got `422 VALIDATION_ERROR` | `setError(path, { message })` for each `details[]` entry; focus the first invalid field                                                                                                  |
| A form got `409 CONFLICT`         | `setError` on each `details.fields[]` entry (e.g. "Email already in use")                                                                                                                |
| A form got any other error        | `setError('root', ...)`, shown above the submit button; the dialog stays open and the input is kept                                                                                      |
| An optimistic mutation failed     | Roll back in `onError` (restore the snapshot from `onMutate`); `onSettled` invalidates                                                                                                   |
| `DELETE` returned `404`           | It's already gone. Treat it as success: remove it from the cache and close the dialog (see Idempotency).                                                                                 |

### Layer 4: route error boundaries

- **Next 16 boundary props are `{ error: unknown; retry: () => void }`.**
  - Narrow `error` before reading it; `getErrorMessage()` and `getErrorReference()` already do.
  - Use `retry()` (re-fetches and re-renders), not the older `reset()`.
- `app/(dashboard)/error.tsx`: catches render errors in dashboard pages; the sidebar stays
  usable. It renders `<ErrorState>` with a **Try again** button and logs with `console.error`.
- `app/global-error.tsx`: the last resort when the root layout itself fails. It renders its own
  `<html>`/`<body>`, imports `globals.css`, and stays minimal: no providers or shared
  components, which might be what broke.
- `app/not-found.tsx` (exists): unknown routes and `notFound()` calls.
- Error boundaries never show `error.message` from unknown errors to users in production. Show
  copy from `getErrorMessage()`, plus `error.digest` as a reference.

### User-facing messages: one map, `lib/errors.ts`

- `getErrorMessage(error: unknown): string` turns anything thrown into safe copy:
  - codes whose API message isn't meant for users, plus the client-only `NETWORK_ERROR` and
    `UNEXPECTED_RESPONSE` (a non-JSON reply, e.g. a proxy page during a Render cold start),
    come from the `MESSAGES` map
  - otherwise the API's `message`, which is written for users
  - anything that isn't an `ApiError` → `FALLBACK_ERROR_MESSAGE`
- `getErrorReference(error)` gives the `requestId` (API) or `digest` (server render) to show as
  "Reference: ...".
- `isSilentError(error)` is true for errors that must never toast (401s).
- Components never invent their own error strings for API failures, and never render
  `String(error)`, stack traces or JSON.
- When the API adds an error code, add its message here in the same change.

### Never

- empty `catch {}`, `.catch(() => {})`, or `try/catch` around a query/mutation hook call
- `console.log` for errors (only `console.error` in error boundaries)
- toasts for 401s, aborted requests, or errors already shown inline
- a 4xx retry loop, or retrying a mutation automatically

## Idempotency (client side)

The API makes repeats safe (see its AGENTS.md); the client must not create needless repeats,
and must behave correctly when one happens.

- **One logical action = one request:**
  - disable submit while `isPending`
  - ignore Enter-key resubmits while pending
  - debounce search at 300 ms
  - `mutationKey` + `useIsMutating` prevent the same delete firing twice from two buttons
- **Creates send an `Idempotency-Key` header** via the client's `idempotencyKey` option
  (`api.post(path, body, { idempotencyKey })`):
  - Generate `crypto.randomUUID()` **once per form session**, when the dialog opens or the form
    resets after success.
  - Reuse the same key if the user presses submit again after a network error or timeout.
  - Generate a new key only after a successful create or when the form is reopened.
- **On `Idempotent-Replayed: true`**, show the normal success UI (the first attempt worked).
- **On `409 IDEMPOTENCY_IN_PROGRESS`**, keep the pending state and retry once after ~1 s; don't
  show an error.
- **PATCH sends only the changed fields as final values** (from React Hook Form `dirtyFields`),
  never increments or toggles computed on the client.
- **`DELETE` 404 = success** (already deleted), as in Layer 3.
- Never auto-retry mutations (`retry: 0`). Only the user, or the one-shot refresh-and-retry on
  `401`, triggers a repeat.

## UX rules (this is graded: UI/UX quality)

- **Every data view handles four states:**
  - loading: a skeleton that matches the final layout, not a spinner over a blank page
  - empty: an illustration or icon, a sentence, and a call to action
  - error: a message plus a retry
  - success
- Destructive actions (delete) need a confirm dialog that names the item. Success and failure
  get a toast.
- **Accessibility:**
  - every input has a `<label>`
  - icon-only buttons have `aria-label`
  - keyboard navigation works everywhere and focus is visible
  - colour is never the only signal (status badges also carry text)
- Spacing follows the Tailwind scale. Page structure is a heading, a description, a toolbar
  and then content, consistently on every page.

## Auth rules

- Tokens are `httpOnly` cookies set by the API. JavaScript never reads, stores or sends tokens
  manually. No `localStorage`/`sessionStorage` for anything sensitive.
- The current user comes from a `useMe()` query. Logout calls the API, clears the query cache
  and redirects to `/login`.
- After login, redirect to the `?next=` param only if it is a relative path (prevents open
  redirects).

## TypeScript & code style

- **Strict TS** with `noUncheckedIndexedAccess`.
  - No `any`, no non-null `!`, no `@ts-ignore`.
  - `as` casts only at real boundaries, with a comment explaining why.
- `import type` for types (enforced). Use the `@/` alias for imports across folders.
- `eslint-disable` only for a single line, with a comment giving the reason. Never weaken
  `eslint.config.mjs`, `tsconfig.json` or the Prettier config to make an error go away.
- No `console.*` in committed code (except `console.error` in error boundaries).
- Comments explain **why**, not what.

## Git workflow

- One branch per slice: `feat/<slice>`, `fix/<thing>`, `chore/<thing>`. Never commit to `main`
  directly; merge via PR with CI green.
- Conventional Commits (commitlint enforces): `feat(doctors): add doctor detail page`.
- **Hooks:** pre-commit runs lint-staged + typecheck, and pre-push runs `pnpm build`. Never
  bypass them (`--no-verify`, `HUSKY=0`); fix the cause.
- Never commit `.env*` (except `.env.example`). Never hand-edit `pnpm-lock.yaml`.

## Boundaries: ask before you

- add, remove or upgrade a dependency (especially UI kits, state libraries or CSS-in-JS)
- change the design tokens, folder structure, lint/TS config or `next.config.ts`
- change how auth, the API client or the `/api` rewrite work
- do anything not asked for (no drive-by refactors, no speculative abstractions, no new
  features "while you're there")

## Definition of done

- [ ] It follows the folder and naming rules; feature code stays inside its feature.
- [ ] Components respect the size limits and split triggers, and each one sits in the right
      reuse tier (no domain words in `components/`).
- [ ] Data goes through `api` → `queries.ts` hooks; filters and pagination live in the URL.
- [ ] Loading, empty, error and success states are designed, in light and dark themes.
- [ ] Failures follow the error layers: inline state or field errors, a global toast only when
      nothing else shows the error, no swallowed errors.
- [ ] Submits can't double-fire; creates send an `Idempotency-Key`; a DELETE 404 counts as
      success.
- [ ] It works at 375px and at desktop width; it is keyboard accessible.
- [ ] `pnpm lint && pnpm typecheck && pnpm build` all pass.
- [ ] You checked it in a real browser against the running API and reported exactly what was
      verified.
- [ ] No TODOs, dead code, commented-out code or stray `console` calls.
