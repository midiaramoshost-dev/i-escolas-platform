import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";

const heroSlides = [
  {
    tag: "Painel Inteligente",
    title: "Decisões rápidas com dados em tempo real",
    description:
      "Acompanhe matrículas, frequência e desempenho em uma visão unificada e moderna.",
    gradient: "from-indigo-400/50 via-violet-400/50 to-sky-400/50",
    primaryAction: "Ver indicadores",
    secondaryAction: "Criar relatório",
  },
  {
    tag: "Gestão Escolar",
    title: "Tudo organizado, do financeiro ao pedagógico",
    description:
      "Centralize turmas, professores e processos em um só lugar, com alertas inteligentes.",
    gradient: "from-emerald-500/70 via-teal-500/60 to-cyan-500/70",
    primaryAction: "Explorar módulos",
    secondaryAction: "Adicionar turma",
  },
  {
    tag: "Comunicação",
    title: "Engaje famílias com mensagens automáticas",
    description:
      "Crie comunicados rápidos e mantenha responsáveis sempre atualizados.",
    gradient: "from-amber-500/70 via-orange-500/60 to-rose-500/70",
    primaryAction: "Enviar comunicado",
    secondaryAction: "Ver agenda",
  },
];

export function MainLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex flex-col flex-1">
          <AppHeader />
          <main className="flex-1 overflow-auto p-6 animate-fade-in">
            <section className="mb-8">
              <Carousel opts={{ loop: true }}>
                <CarouselContent>
                  {heroSlides.map((slide, index) => (
                    <CarouselItem key={index}>
                      <div
                        className={`relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br ${slide.gradient} p-[1px]`}
                      >
                        <div className="relative rounded-2xl bg-card/80 px-8 py-10 md:px-12 md:py-14 backdrop-blur">
                          <div className="absolute right-0 top-0 h-40 w-40 -translate-y-1/2 translate-x-1/3 rounded-full bg-white/20 blur-3xl" />
                          <div className="absolute bottom-0 left-0 h-32 w-32 -translate-x-1/3 translate-y-1/3 rounded-full bg-white/10 blur-3xl" />

                          <div className="relative z-10 max-w-2xl">
                            <span className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                              {slide.tag}
                            </span>
                            <h2 className="mt-4 text-2xl font-semibold text-white md:text-3xl">
                              {slide.title}
                            </h2>
                            <p className="mt-3 text-sm text-white/80 md:text-base">
                              {slide.description}
                            </p>
                            <div className="mt-6 flex flex-wrap gap-3">
                              <Button className="bg-white text-foreground hover:bg-white/90">
                                {slide.primaryAction}
                              </Button>
                              <Button variant="outline" className="border-white/40 text-white hover:bg-white/10">
                                {slide.secondaryAction}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2 border-white/30 bg-white/10 text-white hover:bg-white/20" />
                <CarouselNext className="right-2 border-white/30 bg-white/10 text-white hover:bg-white/20" />
              </Carousel>
            </section>
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
