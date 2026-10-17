import { Metadata } from "next";
import { CategoriesView } from "@/features/categories";

export const metadata: Metadata = {
  title: "Categorías | Tekna Gamer",
  description: "Gestión y clasificación de productos para Tekna Gamer",
};

export default function CategoriesPage() {
  return <CategoriesView />;
}
