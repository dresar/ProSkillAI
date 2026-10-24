import { db } from "@/db";
import { skills, prompts, categories, settings, users, auditLog, uiInspirations, type Skill, type Prompt, type Category, type User, type AuditLogEntry, type UiInspiration } from "@/db/schema";
import { FALLBACK_UI_INSPIRATIONS } from "@/db/ui-inspirations-data";
import { eq, and, sql, desc, asc, ne, inArray, ilike, or } from "drizzle-orm";

const FALLBACK_CATEGORIES: Category[] = [
  {
    id: "cat-ui-design",
    slug: "ui-design",
    nameId: "Desain & UI",
    nameEn: "Design & UI",
    descriptionId: "Skill dan panduan desain antarmuka modern yang tenang, presisi, dan anti-slop.",
    descriptionEn: "Skills and guidelines for calm, precise, and anti-slop modern interface design.",
    type: "all",
    createdAt: new Date("2026-10-21T12:22:05.449Z"),
  },
  {
    id: "cat-code-automation",
    slug: "code-automation",
    nameId: "Otomasi Koding",
    nameEn: "Coding Automation",
    descriptionId: "Protokol dan skill untuk agent koding otomatis, git, dan pengujian software.",
    descriptionEn: "Protocols and skills for automated coding agents, git workflows, and software testing.",
    type: "all",
    createdAt: new Date("2026-10-21T12:22:05.867Z"),
  },
  {
    id: "cat-architecture",
    slug: "architecture",
    nameId: "Arsitektur Sistem",
    nameEn: "System Architecture",
    descriptionId: "Pola arsitektur full-stack, database serverless, dan hardening keamanan API.",
    descriptionEn: "Full-stack architectural patterns, serverless databases, and API security hardening.",
    type: "all",
    createdAt: new Date("2026-10-21T12:22:06.001Z"),
  },
  {
    id: "cat-ux-design",
    slug: "ux-design",
    nameId: "Desain UX",
    nameEn: "UX Design",
    descriptionId: "Arsitektur informasi, alur kerja frontend, dan panduan pengalaman pengguna.",
    descriptionEn: "Information architecture, frontend workflows, and user experience guidance.",
    type: "all",
    createdAt: new Date("2026-10-21T15:01:54.415Z"),
  },
  {
    id: "cat-design-systems",
    slug: "design-systems",
    nameId: "Sistem Desain",
    nameEn: "Design Systems",
    descriptionId: "Fondasi token desain, tema variabel CSS, dan pustaka komponen scalable.",
    descriptionEn: "Design token foundations, CSS variable theming, and scalable component libraries.",
    type: "all",
    createdAt: new Date("2026-10-21T15:01:54.539Z"),
  },
  {
    id: "cat-visual-design",
    slug: "visual-design",
    nameId: "Desain Visual",
    nameEn: "Visual Design",
    descriptionId: "Hierarki tipografi, prinsip gerak animasi, dan arahan visual antarmuka.",
    descriptionEn: "Typography hierarchy, motion principles, and interface visual direction.",
    type: "all",
    createdAt: new Date("2026-10-21T15:01:54.675Z"),
  },
  {
    id: "cat-accessibility",
    slug: "accessibility",
    nameId: "Aksesibilitas",
    nameEn: "Accessibility",
    descriptionId: "Kepatuhan WCAG 2.2 AA, kontras warna, pembaca layar, dan navigasi keyboard.",
    descriptionEn: "WCAG 2.2 AA compliance, color contrast, screen readers, and keyboard navigation.",
    type: "all",
    createdAt: new Date("2026-10-21T15:01:54.815Z"),
  },
  {
    id: "cat-product",
    slug: "product",
    nameId: "Riset Produk",
    nameEn: "Product & Research",
    descriptionId: "Metodologi wawancara pengguna, validasi kebutuhan pasar, dan sintesis riset.",
    descriptionEn: "User interview methods, market need validation, and research synthesis.",
    type: "all",
    createdAt: new Date("2026-10-21T15:01:54.955Z"),
  },
  {
    id: "cat-content",
    slug: "content",
    nameId: "Konten & Tulisan",
    nameEn: "Content & Copy",
    descriptionId: "UX writing, komunikasi internal produk, dan penulisan antarmuka yang jernih.",
    descriptionEn: "UX writing, internal product comms, and crisp interface copy.",
    type: "all",
    createdAt: new Date("2026-10-21T15:01:55.095Z"),
  },
  {
    id: "cat-marketing",
    slug: "marketing",
    nameId: "Pemasaran & Pertumbuhan",
    nameEn: "Marketing & Growth",
    descriptionId: "Penyuntingan copy promosi, reposisi produk, dan strategi konversi.",
    descriptionEn: "Marketing copy editing, product repositioning, and conversion strategies.",
    type: "all",
    createdAt: new Date("2026-10-21T15:01:55.215Z"),
  },
];

export async function getFeaturedSkills(limit = 6): Promise<Array<{ skill: Skill; category: Category | null }>> {
  try {
    return await db
      .select({
        skill: skills,
        category: categories,
      })
      .from(skills)
      .leftJoin(categories, eq(skills.categoryId, categories.id))
      .where(eq(skills.status, "published"))
      .orderBy(desc(skills.createdAt))
      .limit(limit);
  } catch {
    return [];
  }
}

export async function getLatestPrompts(limit = 4): Promise<Array<{ prompt: Prompt; category: Category | null }>> {
  try {
    return await db
      .select({
        prompt: prompts,
        category: categories,
      })
      .from(prompts)
      .leftJoin(categories, eq(prompts.categoryId, categories.id))
      .where(eq(prompts.status, "published"))
      .orderBy(desc(prompts.createdAt))
      .limit(limit);
  } catch {
    return [];
  }
}

export async function getPublishedSkills(params: {
  q?: string;
  categorySlug?: string;
  sort?: string;
}): Promise<Array<{ skill: Skill; category: Category | null }>> {
  try {
    const conditions = [eq(skills.status, "published")];

    if (params.categorySlug) {
      const allCats = await getAllCategories("all");
      const found = allCats.find((c) => c.slug === params.categorySlug);
      if (found) {
        conditions.push(eq(skills.categoryId, found.id));
      }
    }

    if (params.q) {
      const term = `%${params.q}%`;
      conditions.push(
        sql`(${skills.titleId} ILIKE ${term} OR ${skills.titleEn} ILIKE ${term} OR ${skills.summaryId} ILIKE ${term} OR ${skills.summaryEn} ILIKE ${term})`
      );
    }

    let orderByClause = desc(skills.createdAt);
    if (params.sort === "oldest") {
      orderByClause = asc(skills.createdAt);
    } else if (params.sort === "popular") {
      orderByClause = desc(skills.copyCount);
    }

    return await db
      .select({
        skill: skills,
        category: categories,
      })
      .from(skills)
      .leftJoin(categories, eq(skills.categoryId, categories.id))
      .where(and(...conditions))
      .orderBy(orderByClause);
  } catch {
    return [];
  }
}

export async function getPublishedSkillBySlug(slug: string): Promise<{ skill: Skill; category: Category | null } | null> {
  try {
    const result = await db
      .select({
        skill: skills,
        category: categories,
      })
      .from(skills)
      .leftJoin(categories, eq(skills.categoryId, categories.id))
      .where(and(eq(skills.slug, slug), eq(skills.status, "published")))
      .limit(1);

    return result[0] || null;
  } catch {
    return null;
  }
}

export async function getRelatedSkills(
  categoryId: string,
  excludeSkillId: string,
  limit = 3
): Promise<Array<{ skill: Skill; category: Category | null }>> {
  try {
    return await db
      .select({
        skill: skills,
        category: categories,
      })
      .from(skills)
      .leftJoin(categories, eq(skills.categoryId, categories.id))
      .where(
        and(
          eq(skills.categoryId, categoryId),
          eq(skills.status, "published"),
          ne(skills.id, excludeSkillId)
        )
      )
      .limit(limit);
  } catch {
    return [];
  }
}

export async function getPublishedPrompts(params: {
  q?: string;
  categorySlug?: string;
  sort?: string;
}): Promise<Array<{ prompt: Prompt; category: Category | null }>> {
  try {
    const conditions = [eq(prompts.status, "published")];

    if (params.categorySlug) {
      const allCats = await getAllCategories("all");
      const found = allCats.find((c) => c.slug === params.categorySlug);
      if (found) {
        conditions.push(eq(prompts.categoryId, found.id));
      }
    }

    if (params.q) {
      const term = `%${params.q}%`;
      conditions.push(
        sql`(${prompts.titleId} ILIKE ${term} OR ${prompts.titleEn} ILIKE ${term} OR ${prompts.descriptionId} ILIKE ${term} OR ${prompts.descriptionEn} ILIKE ${term})`
      );
    }

    let orderByClause = desc(prompts.createdAt);
    if (params.sort === "oldest") {
      orderByClause = asc(prompts.createdAt);
    } else if (params.sort === "popular") {
      orderByClause = desc(prompts.copyCount);
    }

    return await db
      .select({
        prompt: prompts,
        category: categories,
      })
      .from(prompts)
      .leftJoin(categories, eq(prompts.categoryId, categories.id))
      .where(and(...conditions))
      .orderBy(orderByClause);
  } catch {
    return [];
  }
}

export async function getPublishedPromptBySlug(slug: string): Promise<{
  prompt: Prompt;
  category: Category | null;
  skill: Skill | null;
  author: { id: string; name: string; role: string; email: string } | null;
} | null> {
  try {
    const result = await db
      .select({
        prompt: prompts,
        category: categories,
        skill: skills,
        author: {
          id: users.id,
          name: users.name,
          role: users.role,
          email: users.email,
        },
      })
      .from(prompts)
      .leftJoin(categories, eq(prompts.categoryId, categories.id))
      .leftJoin(skills, eq(prompts.relatedSkillId, skills.id))
      .leftJoin(users, eq(prompts.createdBy, users.id))
      .where(and(eq(prompts.slug, slug), eq(prompts.status, "published")))
      .limit(1);

    const raw = result[0];
    if (!raw) return null;

    return {
      prompt: raw.prompt,
      category: raw.category,
      skill: raw.skill,
      author: raw.author?.id ? (raw.author as { id: string; name: string; role: string; email: string }) : null,
    };
  } catch {
    return null;
  }
}

export async function getAllCategories(type?: string): Promise<Category[]> {
  try {
    if (type && type !== "all") {
      return await db
        .select()
        .from(categories)
        .where(sql`${categories.type} = ${type} OR ${categories.type} = 'all'`)
        .orderBy(asc(categories.nameEn));
    }
    return await db.select().from(categories).orderBy(asc(categories.nameEn));
  } catch {
    if (type && type !== "all") {
      return FALLBACK_CATEGORIES.filter((c) => c.type === type || c.type === "all");
    }
    return FALLBACK_CATEGORIES;
  }
}

export async function getFeatureFlags(): Promise<Record<string, boolean>> {
  try {
    const found = await db
      .select()
      .from(settings)
      .where(eq(settings.key, "feature_flags"))
      .limit(1);

    return (found[0]?.value as Record<string, boolean>) || {};
  } catch {
    return {};
  }
}

export async function getSidebarSelectedPromptIds(): Promise<string[]> {
  try {
    const found = await db
      .select()
      .from(settings)
      .where(eq(settings.key, "sidebar_prompts"))
      .limit(1);

    if (found[0]?.value && Array.isArray(found[0].value)) {
      return found[0].value as string[];
    }
    return [];
  } catch {
    return [];
  }
}

export async function getSidebarPrompts(
  limit = 3
): Promise<Array<{ prompt: Prompt; category: Category | null }>> {
  try {
    const selectedIds = await getSidebarSelectedPromptIds();

    if (selectedIds.length > 0) {
      const list = await db
        .select({
          prompt: prompts,
          category: categories,
        })
        .from(prompts)
        .leftJoin(categories, eq(prompts.categoryId, categories.id))
        .where(and(inArray(prompts.id, selectedIds), eq(prompts.status, "published")));

      if (list.length > 0) {
        const orderMap = new Map(selectedIds.map((id, index) => [id, index]));
        list.sort((a, b) => (orderMap.get(a.prompt.id) ?? 99) - (orderMap.get(b.prompt.id) ?? 99));
        return list.slice(0, limit);
      }
    }

    return await db
      .select({
        prompt: prompts,
        category: categories,
      })
      .from(prompts)
      .leftJoin(categories, eq(prompts.categoryId, categories.id))
      .where(eq(prompts.status, "published"))
      .orderBy(desc(prompts.createdAt))
      .limit(limit);
  } catch {
    return [];
  }
}

export async function getAllPublishedPromptsList(): Promise<Array<{ id: string; slug: string; titleId: string; titleEn: string; categoryName?: string | null }>> {
  try {
    const rows = await db
      .select({
        id: prompts.id,
        slug: prompts.slug,
        titleId: prompts.titleId,
        titleEn: prompts.titleEn,
        categoryName: categories.nameId,
      })
      .from(prompts)
      .leftJoin(categories, eq(prompts.categoryId, categories.id))
      .where(eq(prompts.status, "published"))
      .orderBy(desc(prompts.createdAt));

    return rows;
  } catch {
    return [];
  }
}

export async function getAdminStats() {
  const [skillCounts, promptCounts, categoryCount, userCount, uiCounts] = await Promise.all([
    db.select({ status: skills.status, count: sql<number>`count(*)` }).from(skills).groupBy(skills.status).catch(() => []),
    db.select({ status: prompts.status, count: sql<number>`count(*)` }).from(prompts).groupBy(prompts.status).catch(() => []),
    db.select({ count: sql<number>`count(*)` }).from(categories).catch(() => []),
    db.select({ count: sql<number>`count(*)` }).from(users).catch(() => []),
    db.select({ status: uiInspirations.status, count: sql<number>`count(*)` }).from(uiInspirations).groupBy(uiInspirations.status).catch(() => []),
  ]);

  const skillsByStatus = { draft: 0, published: 0, archived: 0 };
  for (const row of skillCounts) {
    if (row.status in skillsByStatus) {
      skillsByStatus[row.status as keyof typeof skillsByStatus] = Number(row.count);
    }
  }

  const promptsByStatus = { draft: 0, published: 0, archived: 0 };
  for (const row of promptCounts) {
    if (row.status in promptsByStatus) {
      promptsByStatus[row.status as keyof typeof promptsByStatus] = Number(row.count);
    }
  }

  const uiByStatus = { draft: 0, published: 0, archived: 0 };
  let totalUi = 0;
  for (const row of uiCounts) {
    if (row.status in uiByStatus) {
      uiByStatus[row.status as keyof typeof uiByStatus] = Number(row.count);
    }
    totalUi += Number(row.count);
  }
  if (totalUi === 0) {
    totalUi = FALLBACK_UI_INSPIRATIONS.length;
    uiByStatus.published = FALLBACK_UI_INSPIRATIONS.length;
  }

  return {
    skills: skillsByStatus,
    prompts: promptsByStatus,
    uiInspirations: { ...uiByStatus, total: totalUi },
    totalCategories: Number(categoryCount[0]?.count ?? 0),
    totalUsers: Number(userCount[0]?.count ?? 0),
  };
}

export async function getAdminSkills(params?: {
  q?: string;
  status?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
}): Promise<{ rows: Skill[]; total: number }> {
  const conditions = [];

  if (params?.status && params.status !== "all") {
    conditions.push(eq(skills.status, params.status));
  }

  if (params?.q) {
    const term = `%${params.q}%`;
    conditions.push(
      sql`(${skills.titleId} ILIKE ${term} OR ${skills.titleEn} ILIKE ${term} OR ${skills.slug} ILIKE ${term})`
    );
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
  const orderByClause = params?.sort === "oldest" ? asc(skills.createdAt) : desc(skills.createdAt);
  const pageSize = [12, 24, 48].includes(Number(params?.pageSize)) ? Number(params?.pageSize) : 12;
  const page = Math.max(1, Number(params?.page) || 1);

  try {
    const [rows, countResult] = await Promise.all([
      db
        .select()
        .from(skills)
        .where(whereClause)
        .orderBy(orderByClause)
        .limit(pageSize)
        .offset((page - 1) * pageSize),
      db.select({ count: sql<number>`count(*)` }).from(skills).where(whereClause),
    ]);

    return { rows, total: Number(countResult[0]?.count ?? 0) };
  } catch {
    return { rows: [], total: 0 };
  }
}

export async function getAdminSkillById(id: string): Promise<Skill | null> {
  try {
    const result = await db.select().from(skills).where(eq(skills.id, id)).limit(1);
    return result[0] || null;
  } catch {
    return null;
  }
}

export async function getAdminPrompts(params?: {
  q?: string;
  status?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
}): Promise<{ rows: Prompt[]; total: number }> {
  const conditions = [];

  if (params?.status && params.status !== "all") {
    conditions.push(eq(prompts.status, params.status));
  }

  if (params?.q) {
    const term = `%${params.q}%`;
    conditions.push(
      sql`(${prompts.titleId} ILIKE ${term} OR ${prompts.titleEn} ILIKE ${term} OR ${prompts.slug} ILIKE ${term})`
    );
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
  const orderByClause = params?.sort === "oldest" ? asc(prompts.createdAt) : desc(prompts.createdAt);
  const pageSize = [12, 24, 48].includes(Number(params?.pageSize)) ? Number(params?.pageSize) : 12;
  const page = Math.max(1, Number(params?.page) || 1);

  try {
    const [rows, countResult] = await Promise.all([
      db
        .select()
        .from(prompts)
        .where(whereClause)
        .orderBy(orderByClause)
        .limit(pageSize)
        .offset((page - 1) * pageSize),
      db.select({ count: sql<number>`count(*)` }).from(prompts).where(whereClause),
    ]);

    return { rows, total: Number(countResult[0]?.count ?? 0) };
  } catch {
    return { rows: [], total: 0 };
  }
}

export async function getSkillOptions(): Promise<
  Array<{ id: string; titleId: string; titleEn: string; slug: string }>
> {
  try {
    return await db
      .select({ id: skills.id, titleId: skills.titleId, titleEn: skills.titleEn, slug: skills.slug })
      .from(skills)
      .orderBy(asc(skills.titleId));
  } catch {
    return [];
  }
}

export async function getAdminPromptById(id: string): Promise<Prompt | null> {
  try {
    const result = await db.select().from(prompts).where(eq(prompts.id, id)).limit(1);
    return result[0] || null;
  } catch {
    return null;
  }
}

export async function getAdminUsers(): Promise<User[]> {
  try {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  } catch {
    return [];
  }
}

export async function getAdminActivityLogs(limit = 50): Promise<AuditLogEntry[]> {
  try {
    return await db.select().from(auditLog).orderBy(desc(auditLog.createdAt)).limit(limit);
  } catch {
    return [];
  }
}

export async function getSitemapData() {
  try {
    const [publishedSkills, publishedPrompts] = await Promise.all([
      db.select({ slug: skills.slug, updatedAt: skills.updatedAt }).from(skills).where(eq(skills.status, "published")),
      db.select({ slug: prompts.slug, updatedAt: prompts.updatedAt }).from(prompts).where(eq(prompts.status, "published")),
    ]);
    return { publishedSkills, publishedPrompts };
  } catch {
    return { publishedSkills: [], publishedPrompts: [] };
  }
}

export async function incrementSkillCopy(id: string): Promise<void> {
  try {
    await db
      .update(skills)
      .set({ copyCount: sql`${skills.copyCount} + 1` })
      .where(eq(skills.id, id));
  } catch {}
}

export async function incrementSkillDownload(id: string): Promise<void> {
  try {
    await db
      .update(skills)
      .set({ downloadCount: sql`${skills.downloadCount} + 1` })
      .where(eq(skills.id, id));
  } catch {}
}

export async function incrementPromptCopy(id: string): Promise<void> {
  try {
    await db
      .update(prompts)
      .set({ copyCount: sql`${prompts.copyCount} + 1` })
      .where(eq(prompts.id, id));
  } catch {}
}

export async function getAllUiInspirations(params?: {
  category?: string;
  search?: string;
  sort?: "newest" | "popular" | "copied";
}): Promise<UiInspiration[]> {
  try {
    const conditions = [eq(uiInspirations.status, "published")];

    if (params?.category && params.category !== "all") {
      conditions.push(eq(uiInspirations.category, params.category));
    }

    if (params?.search && params.search.trim()) {
      const q = `%${params.search.trim()}%`;
      conditions.push(
        or(
          ilike(uiInspirations.titleEn, q),
          ilike(uiInspirations.titleId, q),
          ilike(uiInspirations.descriptionEn, q),
          ilike(uiInspirations.descriptionId, q)
        )!
      );
    }

    let orderByClause = desc(uiInspirations.createdAt);
    if (params?.sort === "popular") {
      orderByClause = desc(uiInspirations.likesCount);
    } else if (params?.sort === "copied") {
      orderByClause = desc(uiInspirations.copyCount);
    }

    const rows = await db
      .select()
      .from(uiInspirations)
      .where(and(...conditions))
      .orderBy(orderByClause);

    if (rows && rows.length > 0) {
      return rows;
    }
  } catch {}

  let filtered = [...FALLBACK_UI_INSPIRATIONS];
  if (params?.category && params.category !== "all") {
    filtered = filtered.filter((item) => item.category === params.category);
  }
  if (params?.search && params.search.trim()) {
    const q = params.search.trim().toLowerCase();
    filtered = filtered.filter(
      (item) =>
        item.titleEn.toLowerCase().includes(q) ||
        item.titleId.toLowerCase().includes(q) ||
        item.descriptionEn.toLowerCase().includes(q) ||
        item.descriptionId.toLowerCase().includes(q) ||
        (item.tags as string[] | null)?.some((t) => t.toLowerCase().includes(q))
    );
  }
  if (params?.sort === "popular") {
    filtered.sort((a, b) => b.likesCount - a.likesCount);
  } else if (params?.sort === "copied") {
    filtered.sort((a, b) => b.copyCount - a.copyCount);
  } else {
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  return filtered;
}

export async function getUiInspirationBySlug(slug: string): Promise<UiInspiration | null> {
  try {
    const rows = await db
      .select()
      .from(uiInspirations)
      .where(and(eq(uiInspirations.slug, slug), eq(uiInspirations.status, "published")))
      .limit(1);

    if (rows && rows.length > 0) {
      return rows[0];
    }
  } catch {}

  const fallback = FALLBACK_UI_INSPIRATIONS.find((item) => item.slug === slug);
  return fallback || null;
}

export async function incrementUiInspirationCopy(id: string): Promise<void> {
  try {
    await db
      .update(uiInspirations)
      .set({ copyCount: sql`${uiInspirations.copyCount} + 1` })
      .where(eq(uiInspirations.id, id));
  } catch {}
}

export async function incrementUiInspirationLike(id: string): Promise<void> {
  try {
    await db
      .update(uiInspirations)
      .set({ likesCount: sql`${uiInspirations.likesCount} + 1` })
      .where(eq(uiInspirations.id, id));
  } catch {}
}

export async function getAdminUiInspirations(params?: {
  search?: string;
  category?: string;
  status?: string;
}): Promise<UiInspiration[]> {
  try {
    const conditions = [];
    if (params?.status && params.status !== "all") {
      conditions.push(eq(uiInspirations.status, params.status));
    }
    if (params?.category && params.category !== "all") {
      conditions.push(eq(uiInspirations.category, params.category));
    }
    if (params?.search && params.search.trim()) {
      const q = `%${params.search.trim().toLowerCase()}%`;
      conditions.push(
        or(
          sql`lower(${uiInspirations.titleId}) like ${q}`,
          sql`lower(${uiInspirations.titleEn}) like ${q}`,
          sql`lower(${uiInspirations.slug}) like ${q}`
        )
      );
    }

    const rows = await db
      .select()
      .from(uiInspirations)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(uiInspirations.createdAt));

    if (rows && rows.length > 0) {
      return rows;
    }
  } catch {}

  let filtered = [...FALLBACK_UI_INSPIRATIONS];
  if (params?.status && params.status !== "all") {
    filtered = filtered.filter((i) => i.status === params.status);
  }
  if (params?.category && params.category !== "all") {
    filtered = filtered.filter((i) => i.category === params.category);
  }
  if (params?.search && params.search.trim()) {
    const q = params.search.trim().toLowerCase();
    filtered = filtered.filter(
      (i) =>
        i.titleEn.toLowerCase().includes(q) ||
        i.titleId.toLowerCase().includes(q) ||
        i.slug.toLowerCase().includes(q)
    );
  }
  return filtered;
}

export async function getAdminUiInspirationById(id: string): Promise<UiInspiration | null> {
  try {
    const rows = await db
      .select()
      .from(uiInspirations)
      .where(eq(uiInspirations.id, id))
      .limit(1);

    if (rows && rows.length > 0) {
      return rows[0];
    }
  } catch {}

  const fallback = FALLBACK_UI_INSPIRATIONS.find((item) => item.id === id);
  return fallback || null;
}
