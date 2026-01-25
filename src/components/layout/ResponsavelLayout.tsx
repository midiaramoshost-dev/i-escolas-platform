import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { ResponsavelSidebar } from "./ResponsavelSidebar";
import { AppHeader } from "./AppHeader";

export function ResponsavelLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <ResponsavelSidebar />
        <SidebarInset className="flex flex-col flex-1">
          <AppHeader />
          <main className="flex-1 overflow-auto p-6 animate-fade-in">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
