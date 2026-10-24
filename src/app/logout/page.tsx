"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/features/auth";

export default function LogoutPage() {
  const router = useRouter();
  const { logout } = useAuth();

  useEffect(() => {
    const performLogout = async () => {
      await logout();
      router.replace("/login");
    };

    performLogout();
  }, [logout, router]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#0d0a18] text-[#ebe8f7] gap-3">
      <Loader2 className="size-8 animate-spin text-[#2ee6d6]" />
      <p className="text-sm text-[#a8a3c4]">Cerrando sesión...</p>
    </div>
  );
}
