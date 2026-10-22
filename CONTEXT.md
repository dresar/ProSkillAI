# Context & Task Specification: Fix React Hydration Mismatch in ThemeToggle

## 1. Problem Diagnosis
User encountered a Next.js / React 19 Hydration Mismatch error:
```
Hydration failed because the server rendered HTML didn't match the client.
...
- className="lucide lucide-sun w-3.5 h-3.5 text-foreground shrink-0"
+ className="lucide lucide-moon w-3.5 h-3.5 text-foreground shrink-0"
  at ThemeToggle (src/components/theme-toggle.tsx:103:11)
  at LoginPage (src/app/login/page.tsx:36:9)
```

### Root Cause:
In SSR, the server defaults to "light" theme (or "system"), rendering `<Sun className="lucide-sun ..." />` and `aria-label="... Terang"`.
On client hydration in the browser, if the user's OS has dark mode enabled or localStorage contains a dark theme, React evaluates `resolvedTheme === "dark"` during the initial client pass, attempting to render `<Moon className="lucide-moon ..." />` and `aria-label="... Gelap"`.
Because the server-rendered HTML contains `<circle>` (Sun) while the initial client virtual DOM expects `<path>` (Moon), React throws a hydration mismatch exception. In Next.js development mode, Turbopack triggers an error overlay covering the screen.

---

## 2. Requirements & Exact Fixes
Worker **AGY04 (Frontend & UI/UX Owner)** must modify:

1. `src/components/theme-toggle.tsx`:
   - Introduce client `mounted` state (`const [mounted, setMounted] = React.useState(false); React.useEffect(() => setMounted(true), []);`).
   - Prior to `mounted`:
     - Render consistent static server labels (`aria-label={label}`, `title={label}`).
     - For the icon slot, render a consistent neutral placeholder `<span className="w-3.5 h-3.5 shrink-0 inline-block" aria-hidden="true" />` or server-matching icon with `suppressHydrationWarning`.
     - When `mounted` is true, render the active `<Moon>` or `<Sun>` based on `isDark`.
     - Add `suppressHydrationWarning` on the button and swatch element.
   - Maintain all dropdown functionality, theme switching, and smooth view transitions.

2. `src/components/theme-sidebar-toggle.tsx`:
   - Add `mounted` state (`const [mounted, setMounted] = React.useState(false); React.useEffect(() => setMounted(true), []);`).
   - For the button text `{activeDef.name} · {isDark ? ... : ...}`:
     - Render `{activeDef.name}` before mount, and `{activeDef.name} · ${isDark ? ... : ...}` once mounted.
     - Add `suppressHydrationWarning` to the button and label span.

3. `src/app/login/page.tsx`:
   - Add `suppressHydrationWarning` to the footer year span: `<span suppressHydrationWarning>&copy; {new Date().getFullYear()} ProSkillAI. Akses terproteksi.</span>`.

4. Standards:
   - Adhere strictly to `/nokomen` (zero comments inside code files).
   - Ensure `pnpm typecheck` and `pnpm test` pass with 0 errors.
   - Commit cleanly to branch `work/agy04-fix-theme-hydration`.
