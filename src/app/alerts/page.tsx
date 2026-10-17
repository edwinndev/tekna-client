import { Metadata } from "next";
import { AlertsView } from "@/features/alerts";

export const metadata: Metadata = {
  title: "Alertas de stock | Tekna Gamer",
  description: "Monitoreo de umbrales mínimos y alertas de reabastecimiento",
};

export default function AlertsPage() {
  return <AlertsView />;
}
