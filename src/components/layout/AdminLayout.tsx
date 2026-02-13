import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { AppHeader } from "./AppHeader";

export function AdminLayout() {
  const location = useLocation();
  const isDashboard = location.pathname === "/admin/dashboard";

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

            {isDashboard && (
              <section id="ceo" className="mb-6 rounded-lg border border-border bg-card p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Dashboard CEO</h2>
                    <p className="text-sm text-muted-foreground">
                      Visão executiva com KPIs estratégicos para tomada de decisão.
                    </p>
                  </div>
                  <span className="text-xs rounded-full bg-primary/10 text-primary px-2.5 py-1">Executivo</span>
                </div>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="rounded-md border border-border p-3">
                    <p className="text-xs text-muted-foreground">MRR (Mensal)</p>
                    <p className="text-lg font-semibold text-foreground">R$ 182.450</p>
                    <p className="text-xs text-emerald-500">+8.2% vs. mês anterior</p>
                  </div>
                  <div className="rounded-md border border-border p-3">
                    <p className="text-xs text-muted-foreground">Churn</p>
                    <p className="text-lg font-semibold text-foreground">2.1%</p>
                    <p className="text-xs text-emerald-500">-0.4 p.p.</p>
                  </div>
                  <div className="rounded-md border border-border p-3">
                    <p className="text-xs text-muted-foreground">LTV Médio</p>
                    <p className="text-lg font-semibold text-foreground">R$ 4.980</p>
                    <p className="text-xs text-muted-foreground">Base ativa: 512 escolas</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-3">
                  <div className="rounded-md border border-border p-4 lg:col-span-2">
                    <p className="text-sm font-medium text-foreground">Resumo do trimestre</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Crescimento consistente nas regiões Sul/Sudeste e aumento de adesão em planos anuais.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-600">+42 novas escolas</span>
                      <span className="rounded-full bg-sky-500/10 px-2.5 py-1 text-xs text-sky-600">ARPA +5%</span>
                      <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-xs text-amber-600">NPS 71</span>
                    </div>
                  </div>
                  <div className="rounded-md border border-border p-4">
                    <p className="text-sm font-medium text-foreground">Alertas & Riscos</p>
                    <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
                      <li>• 6 escolas com inadimplência &gt; 30 dias</li>
                      <li>• 12 tickets críticos sem SLA finalizado</li>
                      <li>• 4 contratos em renovação no próximo mês</li>
                    </ul>
                  </div>
                </div>
              </section>
            )}

            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
