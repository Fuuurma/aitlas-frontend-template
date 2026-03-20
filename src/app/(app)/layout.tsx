// src/app/(app)/layout.tsx
/**
 * Dashboard layout with shared Aitlas sidebar.
 * All authenticated pages use this layout.
 *
 * Usage:
 * - Place pages in src/app/(app)/ to use this layout
 * - Set currentProduct in the sidebar config
 */

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AitlasSidebar } from "@/components/layout/sidebar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Change this based on which product this is
  // "nova" | "agents-store" | "actions"
  const currentProduct = "nova";

  return (
    <SidebarProvider>
      <AitlasSidebar currentProduct={currentProduct} />
      <SidebarInset>
        <main className="flex-1 p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}