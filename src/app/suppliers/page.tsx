import { Metadata } from "next";
import { SuppliersView } from "@/features/suppliers";

export const metadata: Metadata = {
  title: "Proveedores | Tekna Gamer",
  description: "Directorio y gestión de proveedores de Tekna Gamer",
};

export default function SuppliersPage() {
  return <SuppliersView />;
}
