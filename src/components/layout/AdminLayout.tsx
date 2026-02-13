import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { AppHeader } from "./AppHeader";

export function AdminLayout() {
  const location = useLocation();

  useEffect(() => {
    const hashId = location.hash ? decodeURIComponent(location.hash.replace("#", "")) : "";
    const params = new URLSearchParams(location.search);
    const tabId = params.get("tab") ? decodeURIComponent(params.get("tab") || "") : "";
    const targetId = hashId || tabId;

    if (targetId) {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }

    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [location.pathname, location.hash, location.search]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />
        <SidebarInset className="flex flex-col flex-1">
          <AppHeader />
          <main className="flex-1 overflow-auto p-6">
            <div className="mb-4 rounded-lg border border-border bg-card p-3 text-sm text-muted-foreground">
              Fluxo de importação: acesse <span className="font-medium text-foreground">/escola/importar-dados</span>,
              baixe o modelo, preencha com dados de teste e faça upload para validar ponta a ponta.
            </div>
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
