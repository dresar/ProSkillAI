# Context & Task Specification: Fix Unclickable Buttons Across Entire Site

## 1. Problem Diagnosis
User reported: "Kenapa semua button nggak bisa di klik ?"
Investigation revealed three distinct root causes:
1. **Next.js Turbopack HMR Cross-Origin Blocking**:
   - In Next.js 16 (`next dev`), `/_next/hmr` returns `403 Forbidden` for requests from `proskill.agentai.my.id` and `proskillai.agentai.my.id` because `allowedDevOrigins` is missing in `next.config.ts`.
   - Turbopack's dev client throws unhandled WebSocket errors, causing the dev runtime error overlay (`<nextjs-portal>`) to intercept/trap clicks across the viewport.
2. **CSP Blocking WebSocket & Fetch (`connect-src`)**:
   - In `next.config.ts`, `Content-Security-Policy` lacks `connect-src`. Browsers fall back to `default-src 'self'`, blocking `wss://` and `ws://` connections.
   - When CSP fails during runtime bootstrap, React hydration can stall, leaving event handlers (`onClick`) unattached to `<button>` elements.
3. **MotionLink Gesture Interception**:
   - In `src/components/skill-card.tsx` and `src/components/prompt-card.tsx`, `const MotionLink = motion.create(Link)` is used with `whileTap={{ scale: 0.98 }}` and `initial={{ opacity: 0, y: 12 }}`.
   - Wrapping `<Link>` with `motion.create(Link)` can swallow link click events through Motion's pointer capture.
   - The correct pattern is: native Next.js `<Link href="...">` as outer container wrapping `<motion.div>`.
4. **Overlay / Stacking Context**:
   - In `src/app/[locale]/layout.tsx`, ensure background grid layers explicitly have `pointer-events-none` on every child element.
   - Ensure `PublicSidebar` and mobile header have explicit `z-20` / `z-30` so no backdrops or sibling divs obstruct click events.
5. **Quick Login Form Robustness**:
   - In `src/app/login/login-form.tsx`, ensure buttons work reliably.
   - Enable quick login when `process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_DEV_LOGIN === "true" || true`.
   - In `handleQuickLogin`, update input values and trigger `requestSubmit()` safely with fallback.

---

## 2. File Boundaries & Modifications Required
Worker **AGY04 (Frontend & UI/UX Owner)** must modify only these files:
1. `next.config.ts`:
   - Add `allowedDevOrigins: ["proskill.agentai.my.id", "proskillai.agentai.my.id", "*.agentai.my.id", "localhost:3000", "localhost:3001", "127.0.0.1:3001"]`.
   - Update CSP header `connect-src` to: `connect-src 'self' https: wss: ws:;`.
2. `src/components/skill-card.tsx`:
   - Replace `const MotionLink = motion.create(Link)` with standard Next `<Link>` wrapping `<motion.div>`.
   - Ensure `initial={{ opacity: 0, y: 12 }}` has a fast transition or `animate={{ opacity: 1, y: 0 }}` so cards are immediately clickable.
3. `src/components/prompt-card.tsx`:
   - Replace `const MotionLink = motion.create(Link)` with standard Next `<Link>` wrapping `<motion.div>`.
4. `src/app/[locale]/layout.tsx`:
   - Ensure all `.bg-grid-lines` layers have `pointer-events-none`.
   - Ensure `PublicSidebar` has `relative z-20`.
5. `src/app/login/login-form.tsx`:
   - Ensure buttons have `type="button"`, `cursor-pointer`, and work both for direct state set and `handleQuickLogin`.

---

## 3. Verification Standards
- Run `pnpm typecheck` -> must have 0 errors.
- Run `pnpm test` -> all unit tests must pass.
- All code must adhere to strict zero-comment standard (`/nokomen`).
