"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/features/auth";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

const routeTitleMap: Record<string, string> = {
  "/": "Panel de control",
  "/dashboard": "Panel de control",
  "/products": "Catálogo de productos",
  "/movements": "Movimientos de almacén",
  "/alerts": "Alertas de stock",
  "/categories": "Categorías",
  "/suppliers": "Proveedores",
};

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, initialized } = useAuth();
  const isAuthRoute =
    pathname === "/login" ||
    pathname.startsWith("/login") ||
    pathname === "/logout" ||
    pathname.startsWith("/logout");

  React.useEffect(() => {
    if (!initialized) {
      return;
    }
    if (!isAuthenticated && !isAuthRoute) {
      router.replace("/login");
    } else if (isAuthenticated && isAuthRoute && !pathname.startsWith("/logout")) {
      router.replace("/");
    }
  }, [initialized, isAuthenticated, isAuthRoute, pathname, router]);

  React.useEffect(() => {
    const handleUnauthorized = () => {
      if (!isAuthRoute) {
        router.replace("/login");
      }
    };
    window.addEventListener("tekna:auth:unauthorized", handleUnauthorized);
    return () => {
      window.removeEventListener("tekna:auth:unauthorized", handleUnauthorized);
    };
  }, [isAuthRoute, router]);

  if (isAuthRoute) {
    return <main className="min-h-screen w-full bg-[#0d0a18]">{children}</main>;
  }

  if (!isAuthenticated && initialized) {
    return null;
  }

  const currentTitle = routeTitleMap[pathname] || "Tekna Gamer";

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center gap-2 flex-1">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-vertical:h-4 data-vertical:self-auto"
              />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink render={<Link href="/" />}>
                      Inicio
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {pathname !== "/" && pathname !== "/dashboard" && (
                    <>
                      <BreadcrumbSeparator className="hidden md:block" />
                      <BreadcrumbItem>
                        <BreadcrumbPage>{currentTitle}</BreadcrumbPage>
                      </BreadcrumbItem>
                    </>
                  )}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
              <span className="hidden sm:inline">Tekna Gamer v1.0</span>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6 lg:p-8 bg-muted/10 min-w-0 w-full">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
