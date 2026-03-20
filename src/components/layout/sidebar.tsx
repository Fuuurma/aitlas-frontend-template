"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Badge,
} from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronsUpDown,
  GalleryVerticalEnd,
  Home,
  Bot,
  Store,
  Wrench,
  Settings,
  LogOut,
  User,
  CreditCard,
  Zap,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "@/lib/auth-client";

// ─── Product Configuration ─────────────────────────────────────────

export interface Product {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  url: string;
  devUrl: string;
  items?: NavigationItem[];
}

export interface NavigationItem {
  title: string;
  url: string;
  icon?: React.ElementType;
  badge?: string;
}

// ─── Aitlas Products ──────────────────────────────────────────────

const PRODUCTS: Product[] = [
  {
    id: "nova",
    name: "Nova",
    description: "AI Chat & Agent Dashboard",
    icon: Zap,
    url: "https://nova.aitlas.xyz",
    devUrl: "http://localhost:3000",
    items: [
      { title: "Dashboard", url: "/dashboard", icon: Home },
      { title: "Build", url: "/build", icon: Bot },
      { title: "Chat", url: "/chat", icon: Zap },
    ],
  },
  {
    id: "agents-store",
    name: "Agents Store",
    description: "Browse & Hire AI Agents",
    icon: Store,
    url: "https://store.aitlas.xyz",
    devUrl: "http://localhost:3001",
    items: [
      { title: "Store", url: "/store", icon: Store },
      { title: "My Agents", url: "/my-agents", icon: Bot },
      { title: "Creators", url: "/creators", icon: User },
    ],
  },
  {
    id: "actions",
    name: "Actions",
    description: "AI Tools & Workflows",
    icon: Wrench,
    url: "https://actions.aitlas.xyz",
    devUrl: "http://localhost:3002",
    items: [
      { title: "f.code", url: "http://localhost:3773", icon: Wrench },
      { title: "f.improve", url: "http://localhost:3200", icon: Zap },
      { title: "f.library", url: "http://localhost:3300", icon: Bot },
      { title: "f.research", url: "http://localhost:3400", icon: Bot },
    ],
  },
];

// ─── Sidebar Props ────────────────────────────────────────────────

interface AitlasSidebarProps {
  currentProduct: string;
  user?: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
  onLogout?: () => void;
}

// ─── Sidebar Component ─────────────────────────────────────────────

export function AitlasSidebar({
  currentProduct,
  user,
  onLogout,
}: AitlasSidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const currentUser = user || session?.user;
  const isDev = process.env.NODE_ENV === "development";

  // Get URL for product (dev or prod)
  const getProductUrl = (product: Product, path?: string) => {
    const baseUrl = isDev ? product.devUrl : product.url;
    return path ? `${baseUrl}${path}` : baseUrl;
  };

  return (
    <Sidebar collapsible="icon" className="border-r">
      {/* Header with Product Switcher */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <GalleryVerticalEnd className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Aitlas</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {PRODUCTS.find((p) => p.id === currentProduct)?.name}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                align="start"
                side="bottom"
                sideOffset={4}
              >
                {PRODUCTS.map((product) => (
                  <DropdownMenuItem
                    key={product.id}
                    asChild
                    className={cn(
                      "gap-2 p-2",
                      product.id === currentProduct && "bg-accent"
                    )}
                  >
                    <Link href={getProductUrl(product)}>
                      <div className="flex size-6 items-center justify-center rounded-sm border">
                        <product.icon className="size-4 shrink-0" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{product.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {product.description}
                        </div>
                      </div>
                      {isDev && (
                        <Badge variant="outline" className="ml-auto text-xs">
                          Dev
                        </Badge>
                      )}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Main Navigation */}
      <SidebarContent className="flex flex-col gap-2">
        {/* Current Product Navigation */}
        {PRODUCTS.filter((p) => p.id === currentProduct).map((product) => (
          <SidebarGroup key={product.id}>
            <SidebarGroupLabel>{product.name}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {product.items?.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.url}
                    >
                      <Link href={item.url}>
                        {item.icon && <item.icon className="size-4" />}
                        <span>{item.title}</span>
                        {item.badge && (
                          <Badge size="sm" className="ml-auto">
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        {/* Quick Links to Other Products */}
        <SidebarGroup>
          <SidebarGroupLabel>Quick Links</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {PRODUCTS.filter((p) => p.id !== currentProduct).map((product) => (
                <SidebarMenuItem key={product.id}>
                  <SidebarMenuButton asChild>
                    <Link href={getProductUrl(product)} target="_blank">
                      <product.icon className="size-4" />
                      <span>{product.name}</span>
                      <ExternalLink className="ml-auto size-3 opacity-50" />
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Actions Dropdown */}
        <SidebarGroup>
          <SidebarGroupLabel>Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible asChild>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <Wrench className="size-4" />
                      <span>Active Actions</span>
                      <ChevronsUpDown className="ml-auto size-4" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {PRODUCTS.find((p) => p.id === "actions")?.items?.map((action) => (
                        <SidebarMenuSubItem key={action.title}>
                          <SidebarMenuSubButton asChild>
                            <Link href={action.url} target="_blank">
                              {action.icon && <action.icon className="size-4" />}
                              <span>{action.title}</span>
                              <ExternalLink className="ml-auto size-3 opacity-50" />
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* User Footer */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      src={currentUser?.image}
                      alt={currentUser?.name}
                    />
                    <AvatarFallback className="rounded-lg">
                      {currentUser?.name?.slice(0, 2).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {currentUser?.name || "User"}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {currentUser?.email || ""}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <User className="mr-2 size-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/credits">
                    <CreditCard className="mr-2 size-4" />
                    Credits
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Settings className="mr-2 size-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout}>
                  <LogOut className="mr-2 size-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

// ─── Layout Wrapper ───────────────────────────────────────────────

interface AitlasLayoutProps {
  children: React.ReactNode;
  currentProduct: string;
}

export function AitlasLayout({ children, currentProduct }: AitlasLayoutProps) {
  return (
    <div className="flex h-screen w-full">
      <AitlasSidebar currentProduct={currentProduct} />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}