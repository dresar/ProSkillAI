import { db } from "@/db";
import { categories } from "@/db/schema";
import { desc } from "drizzle-orm";
import { CategoriesClient } from "./categories-client";

export default async function AdminCategoriesPage() {
  const allCategories = await db.select().from(categories).orderBy(desc(categories.createdAt));

  return <CategoriesClient categoriesList={allCategories} />;
}
