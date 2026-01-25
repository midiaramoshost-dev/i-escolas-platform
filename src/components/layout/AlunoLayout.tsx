import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AlunoSidebar } from "./AlunoSidebar";
import { AppHeader } from "./AppHeader";

export function AlunoLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AlunoSidebar />
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
