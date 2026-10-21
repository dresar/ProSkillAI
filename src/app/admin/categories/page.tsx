import { getAllCategories } from "@/db/queries";
import { CategoriesClient } from "./categories-client";

export default async function AdminCategoriesPage() {
  const allCategories = await getAllCategories("all");

  return <CategoriesClient categoriesList={allCategories} />;
}
