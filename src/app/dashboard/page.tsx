import { Metadata } from "next";
import { DashboardView } from "@/features/dashboard";

export const metadata: Metadata = {
  title: "Panel de control | Tekna Gamer",
  description: "Sistema centralizado de control de inventario y alertas de stock",
};

export default function DashboardPage() {
  return <DashboardView />;
}
