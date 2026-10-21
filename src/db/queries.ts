import { db } from "@/db";
import { skills, prompts, categories, settings, users, auditLog, type Skill, type Prompt, type Category, type User, type AuditLogEntry } from "@/db/schema";
import { eq, and, sql, desc, asc, ne } from "drizzle-orm";

export async function getFeaturedSkills(limit = 6): Promise<Array<{ skill: Skill; category: Category | null }>> {
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
}

export async function getLatestPrompts(limit = 4): Promise<Array<{ prompt: Prompt; category: Category | null }>> {
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
}

export async function getPublishedSkills(params: {
  q?: string;
  categorySlug?: string;
  sort?: string;
}): Promise<Array<{ skill: Skill; category: Category | null }>> {
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
}

export async function getPublishedSkillBySlug(slug: string): Promise<{ skill: Skill; category: Category | null } | null> {
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
}

export async function getRelatedSkills(
  categoryId: string,
  excludeSkillId: string,
  limit = 3
): Promise<Array<{ skill: Skill; category: Category | null }>> {
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
}

export async function getPublishedPrompts(params: {
  q?: string;
  categorySlug?: string;
  sort?: string;
}): Promise<Array<{ prompt: Prompt; category: Category | null }>> {
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
}

export async function getPublishedPromptBySlug(slug: string): Promise<{
  prompt: Prompt;
  category: Category | null;
  skill: Skill | null;
} | null> {
  const result = await db
    .select({
      prompt: prompts,
      category: categories,
      skill: skills,
    })
    .from(prompts)
    .leftJoin(categories, eq(prompts.categoryId, categories.id))
    .leftJoin(skills, eq(prompts.relatedSkillId, skills.id))
    .where(and(eq(prompts.slug, slug), eq(prompts.status, "published")))
    .limit(1);

  return result[0] || null;
}

export async function getAllCategories(type?: string): Promise<Category[]> {
  if (type && type !== "all") {
    return await db
      .select()
      .from(categories)
      .where(sql`${categories.type} = ${type} OR ${categories.type} = 'all'`)
      .orderBy(asc(categories.nameEn));
  }
  return await db.select().from(categories).orderBy(asc(categories.nameEn));
}

export async function getFeatureFlags(): Promise<Record<string, boolean>> {
  const found = await db
    .select()
    .from(settings)
    .where(eq(settings.key, "feature_flags"))
    .limit(1);

  return (found[0]?.value as Record<string, boolean>) || {};
}

export async function getAdminStats() {
  const [skillCounts, promptCounts, categoryCount, userCount] = await Promise.all([
    db.select({ status: skills.status, count: sql<number>`count(*)` }).from(skills).groupBy(skills.status),
    db.select({ status: prompts.status, count: sql<number>`count(*)` }).from(prompts).groupBy(prompts.status),
    db.select({ count: sql<number>`count(*)` }).from(categories),
    db.select({ count: sql<number>`count(*)` }).from(users),
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

  return {
    skills: skillsByStatus,
    prompts: promptsByStatus,
    totalCategories: Number(categoryCount[0]?.count ?? 0),
    totalUsers: Number(userCount[0]?.count ?? 0),
  };
}

export async function getAdminSkills(params?: {
  q?: string;
  status?: string;
  sort?: string;
}): Promise<Skill[]> {
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

  return await db.select().from(skills).where(whereClause).orderBy(orderByClause);
}

export async function getAdminSkillById(id: string): Promise<Skill | null> {
  const result = await db.select().from(skills).where(eq(skills.id, id)).limit(1);
  return result[0] || null;
}

export async function getAdminPrompts(params?: {
  q?: string;
  status?: string;
  sort?: string;
}): Promise<Prompt[]> {
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

  return await db.select().from(prompts).where(whereClause).orderBy(orderByClause);
}

export async function getAdminPromptById(id: string): Promise<Prompt | null> {
  const result = await db.select().from(prompts).where(eq(prompts.id, id)).limit(1);
  return result[0] || null;
}

export async function getAdminUsers(): Promise<User[]> {
  return await db.select().from(users).orderBy(desc(users.createdAt));
}

export async function getAdminActivityLogs(limit = 50): Promise<AuditLogEntry[]> {
  return await db.select().from(auditLog).orderBy(desc(auditLog.createdAt)).limit(limit);
}

export async function getSitemapData() {
  const [publishedSkills, publishedPrompts] = await Promise.all([
    db.select({ slug: skills.slug, updatedAt: skills.updatedAt }).from(skills).where(eq(skills.status, "published")),
    db.select({ slug: prompts.slug, updatedAt: prompts.updatedAt }).from(prompts).where(eq(prompts.status, "published")),
  ]);
  return { publishedSkills, publishedPrompts };
}

export async function incrementSkillCopy(id: string): Promise<void> {
  await db
    .update(skills)
    .set({ copyCount: sql`${skills.copyCount} + 1` })
    .where(eq(skills.id, id));
}

export async function incrementSkillDownload(id: string): Promise<void> {
  await db
    .update(skills)
    .set({ downloadCount: sql`${skills.downloadCount} + 1` })
    .where(eq(skills.id, id));
}

export async function incrementPromptCopy(id: string): Promise<void> {
  await db
    .update(prompts)
    .set({ copyCount: sql`${prompts.copyCount} + 1` })
    .where(eq(prompts.id, id));
}
