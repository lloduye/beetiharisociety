# Developer conventions

Short notes so dashboard and auth stay stable for all users.

## Auth and display names

- **Never assume `userName` is non-null** when the user is authenticated. Use **`displayName`** from `useAuth()` for UI (welcome text, profile pill, nav subtitle). When authenticated, the context guarantees a string via `displayName` (or `userName`/`userEmail` fallbacks).
- In **AuthContext**, when `isAuthenticated` is true we never expose null for the display name; login and session restore use `safeDisplayName(name, email)` so every user always has a fallback (email or `"User"`).

## Dates and Firestore timestamps

- **Firestore Timestamps** are objects with `toDate()` or `toMillis()`, not plain numbers or ISO strings. Using `new Date(timestamp)` can yield Invalid Date.
- Use **`src/utils/dateUtils.js`** for any date formatting:
  - `toDate(value)` – safe conversion to `Date` or null
  - `formatTimeAgo(value)` – "X minutes ago" style
  - `formatDateTime(value)` – locale date/time string
- Use these (or the same Firestore handling) when rendering activity feeds, "last login", or any timestamp from Firestore so the app doesn’t crash for any user.

## Service calls with IDs

- **Guard null/undefined IDs** before calling services (e.g. `getStoryInteractions(storyId)`). Services should also defend against null/undefined and return safe defaults instead of throwing.

## Error boundary

- The **dashboard** is wrapped in `DashboardErrorBoundary`. If a child throws, users see a recovery message and "Refresh" / "Back to login" instead of a white screen. Fix the underlying error when you see that UI.
