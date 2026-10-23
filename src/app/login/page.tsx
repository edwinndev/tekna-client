import { Metadata } from "next";
import { LoginView } from "@/features/auth";

export const metadata: Metadata = {
  title: "Iniciar sesión | Tekna Gamer",
  description: "Acceso al sistema de inventario y gestión de periféricos de Tekna Gamer",
};

export default function LoginPage() {
  return <LoginView />;
}
