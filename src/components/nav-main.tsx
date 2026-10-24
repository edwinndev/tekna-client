"use client";

import Link from "next/link";
import { ChevronRightIcon } from "lucide-react";
import { cn } from "cn";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

export interface NavMainItem {
  title: string;
  url: string;
  icon?: React.ReactNode;
  isActive?: boolean;
  badge?: React.ReactNode;
  items?: {
    title: string;
    url: string;
  }[];
}

interface NavMainProps {
  items: NavMainItem[];
  label?: string;
}

export function NavMain({ items, label = "Módulos principales" }: NavMainProps) {
  return (
    <SidebarGroup className="px-3 py-2">
      <SidebarGroupLabel className="text-xs uppercase tracking-wider font-semibold text-muted-foreground/70 px-2 mb-2">
        {label}
      </SidebarGroupLabel>
      <SidebarMenu className="gap-1.5">
        {items.map((item: NavMainItem) => {
          const hasChildren: boolean = Boolean(item.items && item.items.length > 0);

          if (!hasChildren) {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  render={<Link href={item.url} />}
                  isActive={item.isActive}
                  tooltip={item.title}
                  className={cn(
                    "relative h-9.5 px-3 rounded-lg text-sm transition-all duration-150 group-data-[collapsible=icon]:size-9! group-data-[collapsible=icon]:p-2!",
                    item.isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold shadow-xs border border-sidebar-border/80 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:rounded-r before:bg-primary"
                      : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50 font-medium"
                  )}
                >
                  <span
                    className={cn(
                      "transition-colors",
                      item.isActive
                        ? "text-sidebar-accent-foreground"
                        : "text-muted-foreground group-hover/menu-button:text-sidebar-foreground"
                    )}
                  >
                    {item.icon}
                  </span>
                  <span className="truncate">{item.title}</span>
                  {item.badge && <span className="ml-auto">{item.badge}</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }

          return (
            <Collapsible
              key={item.title}
              defaultOpen={item.isActive}
              className="group/collapsible"
              render={<SidebarMenuItem />}
            >
              <CollapsibleTrigger
                render={
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={item.isActive}
                    className={cn(
                      "relative h-9.5 px-3 rounded-lg text-sm transition-all duration-150 group-data-[collapsible=icon]:size-9! group-data-[collapsible=icon]:p-2!",
                      item.isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold shadow-xs border border-sidebar-border/80 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:rounded-r before:bg-primary"
                        : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50 font-medium"
                    )}
                  />
                }
              >
                <span
                  className={cn(
                    "transition-colors",
                    item.isActive
                      ? "text-sidebar-accent-foreground"
                      : "text-muted-foreground group-hover/menu-button:text-sidebar-foreground"
                  )}
                >
                  {item.icon}
                </span>
                <span className="truncate">{item.title}</span>
                {item.badge && <span className="ml-auto mr-1">{item.badge}</span>}
                <ChevronRightIcon className="ml-auto size-4 transition-transform duration-200 group-data-open/collapsible:rotate-90 text-muted-foreground" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub className="my-1.5 ml-4 space-y-1 border-l border-sidebar-border/60 pl-2">
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton render={<Link href={subItem.url} />}>
                        <span>{subItem.title}</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
