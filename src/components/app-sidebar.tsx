"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import {
  AlertTriangle,
  ArrowDownCircle,
  FolderTree,
  Gamepad2,
  LayoutDashboard,
  Package,
  Shield,
  Truck,
} from "lucide-react";
import { NavMain, NavMainItem } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

const teamsData = [
  {
    name: "Tekna Gamer",
    logo: <Gamepad2 className="size-4" />,
    plan: "Control de inventario",
  },
  {
    name: "Tekna Sucursal Central",
    logo: <Shield className="size-4" />,
    plan: "Almacén principal",
  },
];

const userData = {
  name: "Edwin - Administrador",
  email: "admin@teknagamer.pe",
  avatar: "/avatars/admin.jpg",
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  const navItems: NavMainItem[] = [
    {
      title: "Panel de control",
      url: "/",
      icon: <LayoutDashboard className="size-4" />,
      isActive: pathname === "/" || pathname === "/dashboard",
    },
    {
      title: "Catálogo de productos",
      url: "/products",
      icon: <Package className="size-4" />,
      isActive: pathname.startsWith("/products"),
    },
    {
      title: "Movimientos de almacén",
      url: "/movements",
      icon: <ArrowDownCircle className="size-4" />,
      isActive: pathname.startsWith("/movements"),
    },
    {
      title: "Alertas de stock",
      url: "/alerts",
      icon: <AlertTriangle className="size-4 text-amber-500" />,
      isActive: pathname.startsWith("/alerts"),
    },
    {
      title: "Categorías",
      url: "/categories",
      icon: <FolderTree className="size-4" />,
      isActive: pathname.startsWith("/categories"),
    },
    {
      title: "Proveedores",
      url: "/suppliers",
      icon: <Truck className="size-4" />,
      isActive: pathname.startsWith("/suppliers"),
    },
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={teamsData} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} label="Módulos del sistema" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
