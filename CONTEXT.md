# ARCHITECTURE & CONTRACT SPECIFICATION: THEMES, ANIMATIONS & DEV LOGIN
**Version:** 1.0.0
**Target Worker:** AGY04 (Frontend & UI/UX Owner)
**Target Project:** ProSkillAI (`/opt/data/home/proskillai-agy04`)

---

## 1. Objective Overview
Implement four key frontend requirements requested by user:
1. **10 Aesthetic Color Themes**:
   Create a multi-theme system featuring 10 distinctive, accessible, aesthetic themes (Dark + Light variants or deep atmospheric palettes). Supported with an interactive Theme Switcher UI in the public header and sidebar.
2. **Background Straight Lines / Grid with Shadow**:
   Add subtle, aesthetic vertical and horizontal straight lines pattern (grid / linear stripes) with depth shadow across all page backgrounds (`src/app/[locale]/layout.tsx` / `globals.css`).
3. **Smooth Card Animations (using `motion`)**:
   Enrich `SkillCard`, `PromptCard`, `SkillStatsCard`, and related card components with silky-smooth interactive animations using `motion` (motion.dev / framer-motion):
   - Entrance fade-in / slide-up.
   - Smooth hover elevation and ambient color border glow.
   - Micro-interaction scale on tap for mobile responsiveness.
4. **Development Mode Quick Login Buttons**:
   On the login page (`/login`), add a Development Mode card featuring one-click quick login buttons:
   - "Masuk Cepat sebagai Admin (admin@proskillai.dev)"
   - "Masuk Cepat sebagai User (user@proskillai.dev)"
   Auto-filling inputs or triggering direct one-click login.

---

## 2. File Ownership & Boundaries (AGY04 Exclusive)
AGY04 is strictly responsible for frontend UI/UX and styling files:
- `src/app/globals.css`: Define CSS variables for the 10 themes and the background grid lines with drop shadows.
- `src/components/theme-provider.tsx`: Extend theme provider to manage both standard mode (light/dark) and 10 color palette themes (e.g. `data-theme` attribute on document root).
- `src/components/theme-toggle.tsx`: Add theme selector dropdown/menu supporting the 10 themes with preview swatches.
- `src/components/theme-sidebar-toggle.tsx`: Ensure sidebar theme toggle also supports the themes.
- `src/components/skill-card.tsx`: Convert/wrap with `motion` for smooth hover elevation, ambient glow, and mobile touch micro-scale.
- `src/components/prompt-card.tsx`: Convert/wrap with `motion` for smooth animations.
- `src/components/skill-stats-card.tsx`: Add smooth motion effects.
- `src/app/login/login-form.tsx`: Add Quick Login buttons for dev mode.
- `src/app/[locale]/layout.tsx`: Add background grid lines container.

---

## 3. Specifications Details

### A. The 10 Aesthetic Color Themes (`data-theme`)
1. `noir` (Default Monolit Obsidian / Monochromatic)
2. `cyber` (Cyber Obsidian with Cyan accent `#06b6d4`)
3. `emerald` (Deep Forest Jade with Mint accent `#10b981`)
4. `indigo` (Midnight Navy with Electric Violet/Indigo `#6366f1`)
5. `amber` (Dark Bronze with Solar Amber `#f59e0b`)
6. `rose` (Dark Plum with Velvet Rose `#f43f5e`)
7. `slate` (Steel Slate with Polar Sky Blue `#38bdf8`)
8. `aurora` (Nordic Twilight with Arctic Teal `#14b8a6`)
9. `neon` (Synthwave Midnight with Tokyo Fuchsia `#d946ef`)
10. `espresso` (Warm Espresso Earth with Caramel Gold `#d97706`)

Each theme must define:
`--background`, `--foreground`, `--surface`, `--surface-hover`, `--muted`, `--muted-foreground`, `--border`, `--ring`, `--accent`, `--accent-glow`, `--line-color`.

### B. Background Straight Lines Pattern
Use straight linear lines (vertical and horizontal grid) with subtle shadows/vignette:
```css
.bg-grid-lines {
  background-image: 
    linear-gradient(to right, var(--line-color) 1px, transparent 1px),
    linear-gradient(to bottom, var(--line-color) 1px, transparent 1px);
  background-size: 48px 48px;
}
```
Layered with a radial shadow / gradient mask so it doesn't overpower text readability.

### C. Motion Animations
Use `"motion"` (`import { motion } from "motion/react"` or `motion`):
- `whileHover={{ y: -4, transition: { duration: 0.2, ease: "easeOut" } }}`
- `whileTap={{ scale: 0.98 }}`
- Smooth transition for borders and shadows.
- Ensure all cards are fully responsive on mobile (`p-4 sm:p-5`, flexible typography, touch targets min 44px).

### D. Dev Mode Quick Login
On `LoginForm`:
- Provide a clear visually distinct section:
  - "Mode Development - Akses Cepat"
  - Button "Masuk sebagai Admin" -> fills `admin@proskillai.dev` & `ProSkill2026!Admin` and submits.
  - Button "Masuk sebagai User" -> fills `user@proskillai.dev` & `ProSkill2026!Admin` and submits.

---

## 4. Verification Requirements
- `pnpm typecheck` (`tsc --noEmit`) must exit with 0 errors.
- `pnpm test` must continue to pass 24/24 tests.
