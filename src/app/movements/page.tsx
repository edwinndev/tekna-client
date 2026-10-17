import { Metadata } from "next";
import { MovementsView } from "@/features/movements";

export const metadata: Metadata = {
  title: "Movimientos | Tekna Gamer",
  description: "Registro y auditoría de entradas y salidas de inventario",
};

export default function MovementsPage() {
  return <MovementsView />;
}
