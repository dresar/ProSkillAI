# Context & Task Specification: Admin Panel Mobile 2-Grid & Aesthetic Dropdown Filters

## 1. User Requirement
User requested:
"Coba kamu optimal kan lagi di mobile yang grid di admin panel itu buatkan 2 grid jika di mobile lalu coba kalau ada filter itu dropdown saja jangan badge banyak nantia kategori nya bisa di tambah jadi estetik di mobile semua filter harus ada dropdown nya yang cantik pokoknya perbaikin lagi ya suruh agy lain perbaikin"

Key deliverables:
1. **Admin Panel Grid 2 Columns on Mobile (`grid-cols-2`)**:
   - In Admin Dashboard overview (`src/app/admin/page.tsx`), the stat metric cards must be 2 columns on mobile (`grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4`).
   - In Skills table grid view (`src/app/admin/skills/skills-table.tsx`), cards must display in 2 columns on mobile (`grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3.5`), optimized with compact typography (`text-xs sm:text-sm`), badges (`text-[10px]`), and action buttons so they look balanced and do not overflow.
   - In Prompts table grid view (`src/app/admin/prompts/prompts-table.tsx`), cards must display in 2 columns on mobile (`grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3.5`).
   - In Feedback client (`src/app/admin/feedback/feedback-client.tsx`), summary metric cards must be 2 columns on mobile (`grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3`).

2. **Replace Filter Badges with Aesthetic Dropdowns (No Overflowing Badge Clouds)**:
   - **`src/components/admin/list-toolbar.tsx`**:
     - Remove the wrapping row of status badge buttons.
     - Replace with an aesthetic, styled dropdown selector with `ChevronDown` icon.
     - Support filtering by Status and optional Category via clean dropdown selects.
     - Layout on mobile: Search bar full width, dropdown filters neatly arranged side-by-side or stacked without horizontal scrolling.
   - **`src/app/admin/skills/page.tsx` & `src/app/admin/prompts/page.tsx`**:
     - Pass `categoriesList` into `AdminListToolbar` to allow filtering by Category dropdown in addition to Status.
   - **`src/app/admin/feedback/feedback-client.tsx`**:
     - Replace the horizontal scrolling badge tabs (`all`, `unread`, `bug`, `skill_request`, `resolved`) with an aesthetic dropdown filter with count details.
   - **`src/components/catalog-toolbar.tsx`**:
     - Replace the collapsible multi-badge category cloud with a sleek, clean Category dropdown selector styled with `ChevronDown` and active state indicators, handling any number of future categories cleanly.

---

## 2. File Ownership & Exact Boundaries for AGY04
Worker **AGY04 (Frontend & UI/UX Owner)** must modify only these files:
1. `src/app/admin/page.tsx`:
   - Change stat cards grid from `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` to `grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4`.
2. `src/app/admin/skills/skills-table.tsx`:
   - Change grid view from `grid-cols-1 sm:grid-cols-2 xl:grid-cols-3` to `grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3.5`.
   - Compact card padding and typography for mobile (`p-2.5 sm:p-3.5`, `text-xs sm:text-sm`, `text-[10px]` for badges/slug).
3. `src/app/admin/prompts/prompts-table.tsx`:
   - Change grid view to `grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3.5`.
   - Ensure mobile responsiveness for 2 columns.
4. `src/components/admin/list-toolbar.tsx`:
   - Replace status badge buttons with an aesthetic styled `<select>` dropdown (with `ChevronDown`, border, rounded-lg, focus-visible).
   - Support optional category filter dropdown.
5. `src/app/admin/skills/page.tsx` & `src/app/admin/prompts/page.tsx`:
   - Wire up `categoriesList` and `category` param to `AdminListToolbar`.
6. `src/app/admin/feedback/feedback-client.tsx`:
   - Replace horizontal badge filter buttons with an aesthetic dropdown selector with badge count.
7. `src/components/catalog-toolbar.tsx`:
   - Replace category button cloud with an aesthetic dropdown selector.

---

## 3. Strict Coding Standards
- Strictly adhere to `/nokomen` (zero comments inside code files).
- Mobile-first, responsive, zero horizontal overflow.
- Run `pnpm typecheck` -> 0 errors.
- Run `pnpm test` -> all 27 unit tests pass.
- Commit cleanly to branch `work/agy04-admin-mobile-grid-filters`.
