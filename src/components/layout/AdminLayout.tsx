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
          <main className="flex-1 overflow-auto p-3 sm:p-4 md:p-6">
            <div className="mb-4 rounded-lg border border-border bg-card p-3 text-xs sm:text-sm text-muted-foreground">
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
                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
                  <div className="rounded-md border border-border p-2 sm:p-3">
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

            {isDashboard && (
              <section id="analytics" className="mb-6 rounded-lg border border-border bg-card p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Analytics (SaaS)</h2>
                    <p className="text-sm text-muted-foreground">
                      Indicadores de performance e adoção da plataforma por escola e módulo.
                    </p>
                  </div>
                  <span className="text-xs rounded-full bg-sky-500/10 text-sky-600 px-2.5 py-1">Insights</span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
                  <div className="rounded-md border border-border p-2 sm:p-3">
                    <p className="text-xs text-muted-foreground">Usuários Ativos (MAU)</p>
                    <p className="text-lg font-semibold text-foreground">18.240</p>
                    <p className="text-xs text-emerald-500">+6.4% últimos 30 dias</p>
                  </div>
                  <div className="rounded-md border border-border p-3">
                    <p className="text-xs text-muted-foreground">Adoção de Módulos</p>
                    <p className="text-lg font-semibold text-foreground">74%</p>
                    <p className="text-xs text-muted-foreground">Top 3: Diário, Financeiro, Comunicação</p>
                  </div>
                  <div className="rounded-md border border-border p-3">
                    <p className="text-xs text-muted-foreground">Tempo Médio no App</p>
                    <p className="text-lg font-semibold text-foreground">26 min/dia</p>
                    <p className="text-xs text-emerald-500">+3 min vs. semana anterior</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-3">
                  <div className="rounded-md border border-border p-4 lg:col-span-2">
                    <p className="text-sm font-medium text-foreground">Cohorts de retenção</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Retenção semanal estável em 68%, com melhora nas escolas com onboarding completo.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-600">Onboarding +12%</span>
                      <span className="rounded-full bg-purple-500/10 px-2.5 py-1 text-xs text-purple-600">Engajamento RH +9%</span>
                      <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-xs text-amber-600">Help Desk -15% chamados</span>
                    </div>
                  </div>
                  <div className="rounded-md border border-border p-4">
                    <p className="text-sm font-medium text-foreground">Ações recomendadas</p>
                    <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
                      <li>• Disparar campanha de ativação para 42 escolas inativas</li>
                      <li>• Treinamento extra para módulos com baixa adoção</li>
                      <li>• Revisar jornadas de cadastro com queda &gt; 10%</li>
                    </ul>
                  </div>
                </div>
              </section>
            )}

            {isDashboard && (
              <section id="financeiro" className="mb-6 rounded-lg border border-border bg-card p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Financeiro</h2>
                    <p className="text-sm text-muted-foreground">
                      Receita, inadimplência e métricas financeiras da plataforma.
                    </p>
                  </div>
                  <span className="text-xs rounded-full bg-emerald-500/10 text-emerald-600 px-2.5 py-1">Finanças</span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
                  <div className="rounded-md border border-border p-2 sm:p-3">
                    <p className="text-xs text-muted-foreground">Receita Mensal (MRR)</p>
                    <p className="text-lg font-semibold text-foreground">R$ 182.450</p>
                    <p className="text-xs text-emerald-500">+8.2% vs. mês anterior</p>
                  </div>
                  <div className="rounded-md border border-border p-3">
                    <p className="text-xs text-muted-foreground">Inadimplência</p>
                    <p className="text-lg font-semibold text-foreground">R$ 12.380</p>
                    <p className="text-xs text-red-500">6 escolas em atraso</p>
                  </div>
                  <div className="rounded-md border border-border p-3">
                    <p className="text-xs text-muted-foreground">Ticket Médio</p>
                    <p className="text-lg font-semibold text-foreground">R$ 356</p>
                    <p className="text-xs text-emerald-500">+3% vs. trimestre</p>
                  </div>
                  <div className="rounded-md border border-border p-3">
                    <p className="text-xs text-muted-foreground">Receita Anual (ARR)</p>
                    <p className="text-lg font-semibold text-foreground">R$ 2.189.400</p>
                    <p className="text-xs text-emerald-500">Projeção com base atual</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-3">
                  <div className="rounded-md border border-border p-4 lg:col-span-2">
                    <p className="text-sm font-medium text-foreground">Receita por plano</p>
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Premium (25 escolas)</span>
                        <span className="font-medium text-foreground">R$ 74.750 (41%)</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden"><div className="h-full rounded-full bg-rose-500" style={{width: "41%"}} /></div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Pro (42 escolas)</span>
                        <span className="font-medium text-foreground">R$ 67.200 (37%)</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden"><div className="h-full rounded-full bg-purple-500" style={{width: "37%"}} /></div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Start (35 escolas)</span>
                        <span className="font-medium text-foreground">R$ 34.650 (19%)</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden"><div className="h-full rounded-full bg-blue-500" style={{width: "19%"}} /></div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Free (25 escolas)</span>
                        <span className="font-medium text-foreground">R$ 0 (0%)</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden"><div className="h-full rounded-full bg-gray-400" style={{width: "3%"}} /></div>
                    </div>
                  </div>
                  <div className="rounded-md border border-border p-4">
                    <p className="text-sm font-medium text-foreground">Cobranças pendentes</p>
                    <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-red-500" />
                        Escola São Paulo — R$ 2.990 (32 dias)
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-red-500" />
                        Instituto ABC — R$ 990 (28 dias)
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-amber-500" />
                        Colégio Horizonte — R$ 1.590 (15 dias)
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-amber-500" />
                        Escola Central — R$ 1.990 (12 dias)
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-yellow-500" />
                        Colégio Estrela — R$ 2.490 (7 dias)
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-yellow-500" />
                        Escola Futuro — R$ 2.330 (5 dias)
                      </li>
                    </ul>
                  </div>
                </div>
              </section>
            )}

            {isDashboard && (
              <section id="suporte" className="mb-6 rounded-lg border border-border bg-card p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Suporte (Help Desk)</h2>
                    <p className="text-sm text-muted-foreground">
                      Central de atendimento e acompanhamento de tickets das escolas.
                    </p>
                  </div>
                  <span className="text-xs rounded-full bg-orange-500/10 text-orange-600 px-2.5 py-1">Help Desk</span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
                  <div className="rounded-md border border-border p-2 sm:p-3">
                    <p className="text-xs text-muted-foreground">Tickets Abertos</p>
                    <p className="text-lg font-semibold text-foreground">38</p>
                    <p className="text-xs text-red-500">12 críticos</p>
                  </div>
                  <div className="rounded-md border border-border p-3">
                    <p className="text-xs text-muted-foreground">Tempo Médio de Resposta</p>
                    <p className="text-lg font-semibold text-foreground">2h 14min</p>
                    <p className="text-xs text-emerald-500">-18min vs. semana anterior</p>
                  </div>
                  <div className="rounded-md border border-border p-3">
                    <p className="text-xs text-muted-foreground">Resolvidos (mês)</p>
                    <p className="text-lg font-semibold text-foreground">142</p>
                    <p className="text-xs text-emerald-500">Taxa resolução: 89%</p>
                  </div>
                  <div className="rounded-md border border-border p-3">
                    <p className="text-xs text-muted-foreground">NPS Atendimento</p>
                    <p className="text-lg font-semibold text-foreground">8.4</p>
                    <p className="text-xs text-emerald-500">+0.3 vs. mês anterior</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-3">
                  <div className="rounded-md border border-border p-4 lg:col-span-2">
                    <p className="text-sm font-medium text-foreground">Tickets recentes</p>
                    <div className="mt-3 overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-border text-left text-muted-foreground">
                            <th className="pb-2 pr-4 font-medium">#</th>
                            <th className="pb-2 pr-4 font-medium">Escola</th>
                            <th className="pb-2 pr-4 font-medium">Assunto</th>
                            <th className="pb-2 pr-4 font-medium">Prioridade</th>
                            <th className="pb-2 font-medium">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          <tr>
                            <td className="py-2 pr-4 text-muted-foreground">#1024</td>
                            <td className="py-2 pr-4">Colégio São Paulo</td>
                            <td className="py-2 pr-4">Erro ao gerar boletos</td>
                            <td className="py-2 pr-4"><span className="rounded-full bg-red-500/10 text-red-500 px-2 py-0.5">Crítico</span></td>
                            <td className="py-2"><span className="rounded-full bg-amber-500/10 text-amber-600 px-2 py-0.5">Em andamento</span></td>
                          </tr>
                          <tr>
                            <td className="py-2 pr-4 text-muted-foreground">#1023</td>
                            <td className="py-2 pr-4">Instituto ABC</td>
                            <td className="py-2 pr-4">Importação de alunos travada</td>
                            <td className="py-2 pr-4"><span className="rounded-full bg-amber-500/10 text-amber-600 px-2 py-0.5">Alta</span></td>
                            <td className="py-2"><span className="rounded-full bg-amber-500/10 text-amber-600 px-2 py-0.5">Em andamento</span></td>
                          </tr>
                          <tr>
                            <td className="py-2 pr-4 text-muted-foreground">#1022</td>
                            <td className="py-2 pr-4">Escola Central</td>
                            <td className="py-2 pr-4">Dúvida sobre relatório financeiro</td>
                            <td className="py-2 pr-4"><span className="rounded-full bg-blue-500/10 text-blue-500 px-2 py-0.5">Normal</span></td>
                            <td className="py-2"><span className="rounded-full bg-sky-500/10 text-sky-600 px-2 py-0.5">Aguardando</span></td>
                          </tr>
                          <tr>
                            <td className="py-2 pr-4 text-muted-foreground">#1021</td>
                            <td className="py-2 pr-4">Colégio Estrela</td>
                            <td className="py-2 pr-4">Solicitar módulo de frequência</td>
                            <td className="py-2 pr-4"><span className="rounded-full bg-gray-500/10 text-gray-500 px-2 py-0.5">Baixa</span></td>
                            <td className="py-2"><span className="rounded-full bg-emerald-500/10 text-emerald-600 px-2 py-0.5">Resolvido</span></td>
                          </tr>
                          <tr>
                            <td className="py-2 pr-4 text-muted-foreground">#1020</td>
                            <td className="py-2 pr-4">Escola Futuro</td>
                            <td className="py-2 pr-4">Problema com login de professor</td>
                            <td className="py-2 pr-4"><span className="rounded-full bg-amber-500/10 text-amber-600 px-2 py-0.5">Alta</span></td>
                            <td className="py-2"><span className="rounded-full bg-emerald-500/10 text-emerald-600 px-2 py-0.5">Resolvido</span></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="rounded-md border border-border p-4">
                    <p className="text-sm font-medium text-foreground">Por categoria</p>
                    <div className="mt-3 space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Financeiro</span>
                          <span className="font-medium">32%</span>
                        </div>
                        <div className="h-2 rounded-full bg-muted overflow-hidden"><div className="h-full rounded-full bg-emerald-500" style={{width: "32%"}} /></div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Cadastro / Importação</span>
                          <span className="font-medium">25%</span>
                        </div>
                        <div className="h-2 rounded-full bg-muted overflow-hidden"><div className="h-full rounded-full bg-blue-500" style={{width: "25%"}} /></div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Login / Acesso</span>
                          <span className="font-medium">20%</span>
                        </div>
                        <div className="h-2 rounded-full bg-muted overflow-hidden"><div className="h-full rounded-full bg-purple-500" style={{width: "20%"}} /></div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Módulos / Funcionalidades</span>
                          <span className="font-medium">15%</span>
                        </div>
                        <div className="h-2 rounded-full bg-muted overflow-hidden"><div className="h-full rounded-full bg-amber-500" style={{width: "15%"}} /></div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Outros</span>
                          <span className="font-medium">8%</span>
                        </div>
                        <div className="h-2 rounded-full bg-muted overflow-hidden"><div className="h-full rounded-full bg-gray-400" style={{width: "8%"}} /></div>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-border">
                      <p className="text-sm font-medium text-foreground">SLA</p>
                      <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                        <li className="flex justify-between"><span>Dentro do SLA</span><span className="text-emerald-500 font-medium">82%</span></li>
                        <li className="flex justify-between"><span>Fora do SLA</span><span className="text-red-500 font-medium">18%</span></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {isDashboard && (
              <section id="retencao" className="mb-6 rounded-lg border border-border bg-card p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Retenção (Anti-churn)</h2>
                    <p className="text-sm text-muted-foreground">
                      Monitoramento de saúde das escolas e ações preventivas contra cancelamentos.
                    </p>
                  </div>
                  <span className="text-xs rounded-full bg-pink-500/10 text-pink-600 px-2.5 py-1">Retenção</span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
                  <div className="rounded-md border border-border p-2 sm:p-3">
                    <p className="text-xs text-muted-foreground">Churn Mensal</p>
                    <p className="text-lg font-semibold text-foreground">2.1%</p>
                    <p className="text-xs text-emerald-500">-0.4 p.p. vs. mês anterior</p>
                  </div>
                  <div className="rounded-md border border-border p-3">
                    <p className="text-xs text-muted-foreground">Escolas em Risco</p>
                    <p className="text-lg font-semibold text-foreground">14</p>
                    <p className="text-xs text-amber-500">Score saúde &lt; 40</p>
                  </div>
                  <div className="rounded-md border border-border p-3">
                    <p className="text-xs text-muted-foreground">Retenção 12 meses</p>
                    <p className="text-lg font-semibold text-foreground">91.2%</p>
                    <p className="text-xs text-emerald-500">+2.1% YoY</p>
                  </div>
                  <div className="rounded-md border border-border p-3">
                    <p className="text-xs text-muted-foreground">Ações Ativas</p>
                    <p className="text-lg font-semibold text-foreground">8</p>
                    <p className="text-xs text-sky-500">3 automáticas, 5 manuais</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-3">
                  <div className="rounded-md border border-border p-4 lg:col-span-2">
                    <p className="text-sm font-medium text-foreground">Escolas em risco</p>
                    <div className="mt-3 overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-border text-left text-muted-foreground">
                            <th className="pb-2 pr-4 font-medium">Escola</th>
                            <th className="pb-2 pr-4 font-medium">Plano</th>
                            <th className="pb-2 pr-4 font-medium">Score Saúde</th>
                            <th className="pb-2 pr-4 font-medium">Motivo</th>
                            <th className="pb-2 font-medium">Ação</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          <tr>
                            <td className="py-2 pr-4">Escola Municipal Alfa</td>
                            <td className="py-2 pr-4"><span className="rounded-full bg-blue-500/10 text-blue-500 px-2 py-0.5">Start</span></td>
                            <td className="py-2 pr-4"><span className="text-red-500 font-medium">18</span></td>
                            <td className="py-2 pr-4">Sem login há 45 dias</td>
                            <td className="py-2"><span className="rounded-full bg-amber-500/10 text-amber-600 px-2 py-0.5">Ligação agendada</span></td>
                          </tr>
                          <tr>
                            <td className="py-2 pr-4">Colégio Beta</td>
                            <td className="py-2 pr-4"><span className="rounded-full bg-purple-500/10 text-purple-500 px-2 py-0.5">Pro</span></td>
                            <td className="py-2 pr-4"><span className="text-red-500 font-medium">25</span></td>
                            <td className="py-2 pr-4">Inadimplente + baixa adoção</td>
                            <td className="py-2"><span className="rounded-full bg-sky-500/10 text-sky-600 px-2 py-0.5">E-mail enviado</span></td>
                          </tr>
                          <tr>
                            <td className="py-2 pr-4">Instituto Gama</td>
                            <td className="py-2 pr-4"><span className="rounded-full bg-rose-500/10 text-rose-500 px-2 py-0.5">Premium</span></td>
                            <td className="py-2 pr-4"><span className="text-amber-500 font-medium">35</span></td>
                            <td className="py-2 pr-4">Reclamação aberta</td>
                            <td className="py-2"><span className="rounded-full bg-emerald-500/10 text-emerald-600 px-2 py-0.5">Reunião marcada</span></td>
                          </tr>
                          <tr>
                            <td className="py-2 pr-4">Escola Delta</td>
                            <td className="py-2 pr-4"><span className="rounded-full bg-gray-500/10 text-gray-500 px-2 py-0.5">Free</span></td>
                            <td className="py-2 pr-4"><span className="text-amber-500 font-medium">38</span></td>
                            <td className="py-2 pr-4">Não ativou módulos extras</td>
                            <td className="py-2"><span className="rounded-full bg-purple-500/10 text-purple-600 px-2 py-0.5">Oferta upgrade</span></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="rounded-md border border-border p-4">
                    <p className="text-sm font-medium text-foreground">Motivos de churn</p>
                    <div className="mt-3 space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Preço</span>
                          <span className="font-medium">35%</span>
                        </div>
                        <div className="h-2 rounded-full bg-muted overflow-hidden"><div className="h-full rounded-full bg-red-500" style={{width: "35%"}} /></div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Baixa adoção</span>
                          <span className="font-medium">28%</span>
                        </div>
                        <div className="h-2 rounded-full bg-muted overflow-hidden"><div className="h-full rounded-full bg-amber-500" style={{width: "28%"}} /></div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Suporte insatisfatório</span>
                          <span className="font-medium">18%</span>
                        </div>
                        <div className="h-2 rounded-full bg-muted overflow-hidden"><div className="h-full rounded-full bg-purple-500" style={{width: "18%"}} /></div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Mudou de sistema</span>
                          <span className="font-medium">12%</span>
                        </div>
                        <div className="h-2 rounded-full bg-muted overflow-hidden"><div className="h-full rounded-full bg-blue-500" style={{width: "12%"}} /></div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Outros</span>
                          <span className="font-medium">7%</span>
                        </div>
                        <div className="h-2 rounded-full bg-muted overflow-hidden"><div className="h-full rounded-full bg-gray-400" style={{width: "7%"}} /></div>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-border">
                      <p className="text-sm font-medium text-foreground">Estratégias ativas</p>
                      <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                        <li>• Desconto 20% para escolas em risco</li>
                        <li>• Onboarding personalizado</li>
                        <li>• Reunião trimestral de sucesso</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {isDashboard && (
              <section id="governanca" className="mb-6 rounded-lg border border-border bg-card p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Governança / LGPD</h2>
                    <p className="text-sm text-muted-foreground">
                      Conformidade com a Lei Geral de Proteção de Dados e políticas de privacidade.
                    </p>
                  </div>
                  <span className="text-xs rounded-full bg-violet-500/10 text-violet-600 px-2.5 py-1">Compliance</span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
                  <div className="rounded-md border border-border p-2 sm:p-3">
                    <p className="text-xs text-muted-foreground">Termos Aceitos</p>
                    <p className="text-lg font-semibold text-foreground">98.4%</p>
                    <p className="text-xs text-emerald-500">508 de 516 escolas</p>
                  </div>
                  <div className="rounded-md border border-border p-3">
                    <p className="text-xs text-muted-foreground">Solicitações LGPD</p>
                    <p className="text-lg font-semibold text-foreground">3</p>
                    <p className="text-xs text-amber-500">1 pendente de exclusão</p>
                  </div>
                  <div className="rounded-md border border-border p-3">
                    <p className="text-xs text-muted-foreground">Última Auditoria</p>
                    <p className="text-lg font-semibold text-foreground">12/01/2026</p>
                    <p className="text-xs text-emerald-500">Aprovada sem ressalvas</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
                  <div className="rounded-md border border-border p-4">
                    <p className="text-sm font-medium text-foreground">Políticas de dados</p>
                    <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
                      <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-500" />Criptografia em trânsito e repouso (AES-256)</li>
                      <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-500" />Backups automatizados a cada 6h</li>
                      <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-500" />Log de acesso a dados sensíveis</li>
                      <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-amber-500" />Política de retenção: em revisão</li>
                    </ul>
                  </div>
                  <div className="rounded-md border border-border p-4">
                    <p className="text-sm font-medium text-foreground">Responsáveis DPO</p>
                    <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
                      <li>• DPO: Maria Silva (dpo@iescolas.com.br)</li>
                      <li>• Último treinamento equipe: 15/12/2025</li>
                      <li>• Canal de denúncia: ativo e monitorado</li>
                      <li>• Próxima revisão de políticas: 03/2026</li>
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
