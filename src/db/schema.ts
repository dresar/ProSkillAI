import { pgTable, text, timestamp, integer, jsonb, index } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("editor"),
  aiCredits: integer("ai_credits").notNull().default(5),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("users_email_idx").on(table.email),
  index("users_role_idx").on(table.role),
]);

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("sessions_token_idx").on(table.token),
  index("sessions_user_id_idx").on(table.userId),
]);

export const categories = pgTable("categories", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  nameId: text("name_id").notNull(),
  nameEn: text("name_en").notNull(),
  descriptionId: text("description_id"),
  descriptionEn: text("description_en"),
  type: text("type").notNull().default("all"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("categories_slug_idx").on(table.slug),
  index("categories_type_idx").on(table.type),
]);

export interface SkillFileItem {
  id: string;
  name: string;
  content: string;
  language?: string;
  size?: number;
}

export const skills = pgTable("skills", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  titleId: text("title_id").notNull(),
  titleEn: text("title_en").notNull(),
  summaryId: text("summary_id").notNull(),
  summaryEn: text("summary_en").notNull(),
  contentId: text("content_id").notNull(),
  contentEn: text("content_en").notNull(),
  files: jsonb("files").$type<SkillFileItem[]>().default([]),
  frontmatter: jsonb("frontmatter"),
  sourceType: text("source_type").notNull().default("original"),
  repoUrl: text("repo_url"),
  filePath: text("file_path"),
  branch: text("branch"),
  commitHash: text("commit_hash"),
  license: text("license"),
  authorName: text("author_name"),
  authorUrl: text("author_url"),
  attribution: text("attribution"),
  categoryId: text("category_id").references(() => categories.id, { onDelete: "set null" }),
  tags: jsonb("tags").default([]),
  previewType: text("preview_type").notNull().default("none"),
  previewHtml: text("preview_html"),
  previewImageUrl: text("preview_image_url"),
  previewVideoUrl: text("preview_video_url"),
  images: jsonb("images").$type<string[]>().default([]),
  designTokens: jsonb("design_tokens"),
  status: text("status").notNull().default("draft"),
  copyCount: integer("copy_count").notNull().default(0),
  downloadCount: integer("download_count").notNull().default(0),
  createdBy: text("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("skills_slug_idx").on(table.slug),
  index("skills_status_idx").on(table.status),
  index("skills_category_idx").on(table.categoryId),
  index("skills_source_type_idx").on(table.sourceType),
]);

export const prompts = pgTable("prompts", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  titleId: text("title_id").notNull(),
  titleEn: text("title_en").notNull(),
  descriptionId: text("description_id").notNull(),
  descriptionEn: text("description_en").notNull(),
  contentId: text("content_id").notNull(),
  contentEn: text("content_en").notNull(),
  variables: jsonb("variables").default([]),
  images: jsonb("images").$type<string[]>().default([]),
  categoryId: text("category_id").references(() => categories.id, { onDelete: "set null" }),
  tags: jsonb("tags").default([]),
  relatedSkillId: text("related_skill_id").references(() => skills.id, { onDelete: "set null" }),
  status: text("status").notNull().default("draft"),
  copyCount: integer("copy_count").notNull().default(0),
  createdBy: text("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("prompts_slug_idx").on(table.slug),
  index("prompts_status_idx").on(table.status),
  index("prompts_category_idx").on(table.categoryId),
]);

export const importJobs = pgTable("import_jobs", {
  id: text("id").primaryKey(),
  repoUrl: text("repo_url").notNull(),
  branch: text("branch"),
  status: text("status").notNull().default("pending"),
  candidateCount: integer("candidate_count").notNull().default(0),
  importedCount: integer("imported_count").notNull().default(0),
  errorMessage: text("error_message"),
  etag: text("etag"),
  lastSyncedAt: timestamp("last_synced_at", { withTimezone: true }),
  createdBy: text("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("import_jobs_status_idx").on(table.status),
]);

export const settings = pgTable("settings", {
  id: text("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("settings_key_idx").on(table.key),
]);

export const auditLog = pgTable("audit_log", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
  userEmail: text("user_email"),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id"),
  details: jsonb("details"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("audit_log_created_at_idx").on(table.createdAt),
  index("audit_log_entity_idx").on(table.entityType, table.entityId),
]);

export const loginAttempts = pgTable("login_attempts", {
  id: text("id").primaryKey(),
  ip: text("ip").notNull(),
  email: text("email").notNull(),
  attemptedAt: timestamp("attempted_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("login_attempts_ip_email_idx").on(table.ip, table.email),
  index("login_attempts_time_idx").on(table.attemptedAt),
]);

export const feedbacks = pgTable("feedbacks", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
  userEmail: text("user_email"),
  userName: text("user_name"),
  category: text("category").notNull().default("general"),
  message: text("message").notNull(),
  url: text("url"),
  status: text("status").notNull().default("unread"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("feedbacks_status_idx").on(table.status),
  index("feedbacks_created_at_idx").on(table.createdAt),
]);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type Skill = typeof skills.$inferSelect;
export type NewSkill = typeof skills.$inferInsert;
export type Prompt = typeof prompts.$inferSelect;
export type NewPrompt = typeof prompts.$inferInsert;
export type ImportJob = typeof importJobs.$inferSelect;
export type Setting = typeof settings.$inferSelect;
export type AuditLogEntry = typeof auditLog.$inferSelect;
export type Feedback = typeof feedbacks.$inferSelect;
export type NewFeedback = typeof feedbacks.$inferInsert;
