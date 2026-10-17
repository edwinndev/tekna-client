import { Metadata } from "next";
import { ProductsView } from "@/features/products";

export const metadata: Metadata = {
  title: "Productos | Tekna Gamer",
  description: "Catálogo y control de inventario de periféricos tecnológicos",
};

export default function ProductsPage() {
  return <ProductsView />;
}
