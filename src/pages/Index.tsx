import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { useState, useMemo, useEffect } from "react";
import {
  BookOpen,
  BarChart3,
  Shield,
  ArrowRight,
  School,
  MessageSquare,
  CreditCard,
  Moon,
  Sun,
  Star,
  ChevronRight,
  Clock,
  Check,
  X,
  Users,
  GraduationCap,
  FileText,
  Megaphone,
} from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { usePlanos } from "@/contexts/PlanosContext";
import { SchoolOnboardingDialog } from "@/components/onboarding/SchoolOnboardingDialog";
import { usePlatformSettings } from "@/hooks/usePlatformSettings";
import { PlatformLogo } from "@/components/PlatformLogo";
import { WhatsAppButton } from "@/components/landing/WhatsAppButton";
import { SEOHead } from "@/components/SEOHead";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const faqData = [
  {
    question: "Como funciona o período de teste gratuito?",
    answer: "Oferecemos um plano Free permanente com até 50 alunos. Não é necessário cartão de crédito.",
  },
  {
    question: "Posso migrar meus dados de outro sistema?",
    answer: "Sim! Importamos alunos, professores, turmas, notas e históricos de planilhas ou outros sistemas.",
  },
  {
    question: "O sistema funciona em dispositivos móveis?",
    answer: "Sim! O i ESCOLAS é totalmente responsivo e funciona em smartphones, tablets e computadores.",
  },
  {
    question: "Meus dados estão seguros?",
    answer: "Utilizamos criptografia, servidores no Brasil (LGPD), backups diários e autenticação em dois fatores.",
  },
  {
    question: "Posso cancelar a qualquer momento?",
    answer: "Sim, sem fidelidade ou multa. Faça downgrade para o plano Free ou cancele quando quiser.",
  },
];

const features = [
  {
    icon: BookOpen,
    title: "Acadêmico Completo",
    description: "Diário de classe digital, boletins automáticos, controle de frequência e relatórios pedagógicos detalhados.",
  },
  {
    icon: CreditCard,
    title: "Gestão Financeira",
    description: "Mensalidades, cobranças automáticas, boletos, PIX e controle completo de inadimplência.",
  },
  {
    icon: MessageSquare,
    title: "Comunicação Integrada",
    description: "Comunicados direcionados, notificações push e portais dedicados para alunos e responsáveis.",
  },
  {
    icon: BarChart3,
    title: "Dados em Tempo Real",
    description: "Dashboard inteligente com indicadores de desempenho, alertas automáticos e relatórios analíticos.",
  },
];

const metrics = [
  { value: "500+", label: "Escolas ativas", icon: School },
  { value: "150k+", label: "Alunos gerenciados", icon: GraduationCap },
  { value: "70%", label: "Menos burocracia", icon: FileText },
  { value: "99.9%", label: "Uptime garantido", icon: Shield },
];

const testimonials = [
  {
    quote: "Reduzimos 70% do tempo gasto com processos administrativos. A equipe finalmente pode focar no que importa.",
    author: "Maria Silva",
    role: "Diretora",
    school: "Colégio São Paulo",
    avatar: "MS",
  },
  {
    quote: "A comunicação com os pais melhorou drasticamente. Antes era um caos, hoje é tudo organizado.",
    author: "Carlos Santos",
    role: "Coordenador",
    school: "Escola Nova Era",
    avatar: "CS",
  },
  {
    quote: "Lanço notas e frequência de qualquer lugar. O portal do professor é intuitivo e rápido.",
    author: "Ana Oliveira",
    role: "Professora",
    school: "Instituto ABC",
    avatar: "AO",
  },
];

const Index = () => {
  const { theme, toggleTheme } = useTheme();
  const { planos } = usePlanos();
  const { openWhatsApp } = usePlatformSettings();
  const [isAnnual, setIsAnnual] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{ id: string; name: string; price: number } | null>(null);

  useEffect(() => {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqData.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    };
    const script = document.createElement("script");
    script.id = "faq-schema";
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(faqSchema);
    document.head.appendChild(script);
    return () => { document.getElementById("faq-schema")?.remove(); };
  }, []);

  const plans = useMemo(() => {
    const ctaMap: Record<string, string> = {
      free: "Começar Grátis",
      start: "Iniciar Trial",
      pro: "Escolher Pro",
      premium: "Falar com Vendas",
    };
    return planos.map((plano) => ({
      id: plano.id,
      name: plano.nome,
      monthlyPrice: plano.preco,
      annualPrice: plano.preco > 0 ? Math.round((plano.preco * 12 * 0.8) / 12) : 0,
      period: plano.preco === 0 ? "para sempre" : isAnnual ? "/mês (anual)" : "/mês",
      description: plano.descricao,
      features: [
        { text: plano.recursos.alunos, included: true },
        { text: plano.recursos.professores, included: true },
        { text: plano.recursos.suporte, included: true },
        { text: "Relatórios Avançados", included: plano.recursos.relatorios },
        { text: "Módulo Financeiro", included: plano.recursos.financeiro },
        { text: "API de Integração", included: plano.recursos.api },
      ],
      highlighted: plano.popular || false,
      cta: ctaMap[plano.id] || "Escolher Plano",
    }));
  }, [planos, isAnnual]);

  const getPrice = (plan: (typeof plans)[0]) =>
    plan.monthlyPrice === 0 ? "0" : isAnnual ? plan.annualPrice.toString() : plan.monthlyPrice.toString();

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="i ESCOLAS — Plataforma de Gestão Escolar #1 em Sorocaba"
        description="Sistema completo de gestão escolar para educação infantil, fundamental e médio. Diário digital, portal do aluno, gestão financeira e mais."
        canonical="https://iescolas.com.br"
      />

      {/* ─── Header ─── */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/20 bg-background/70 backdrop-blur-2xl">
        <nav className="container flex h-16 items-center justify-between">
          <PlatformLogo size="md" />
          <div className="hidden md:flex items-center gap-10">
            {[
              { href: "#recursos", label: "Recursos" },
              { href: "#planos", label: "Planos" },
              { href: "#depoimentos", label: "Depoimentos" },
              { href: "#faq", label: "FAQ" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full h-9 w-9">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Link to="/login">
              <Button variant="ghost" size="sm" className="hidden sm:flex text-muted-foreground hover:text-foreground text-[13px]">
                Entrar
              </Button>
            </Link>
            <Link to="/login">
              <Button size="sm" className="gap-1.5 bg-foreground text-background hover:bg-foreground/90 font-medium text-[13px] rounded-full px-5">
                Começar Agora <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden pt-32 pb-24 md:pt-44 md:pb-36">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-5%,hsl(var(--muted)/0.6),transparent)]" />
        <div className="container relative text-center max-w-3xl mx-auto">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.h1
              variants={fadeUp}
              className="text-[2.75rem] font-semibold tracking-tight sm:text-5xl md:text-6xl leading-[1.08] mb-6"
            >
              A escola ensina.
              <br />
              <span className="text-muted-foreground">Nós cuidamos do resto.</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              Automatize processos administrativos, melhore a comunicação com famílias e foque no que importa: a educação.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/login">
                <Button size="lg" className="w-full sm:w-auto gap-2 bg-foreground px-10 text-sm font-medium text-background hover:bg-foreground/90 rounded-full h-12">
                  Começar Gratuitamente <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto gap-2 border-border/50 px-10 text-sm font-medium hover:bg-muted rounded-full h-12"
                onClick={() => openWhatsApp("Olá! Gostaria de agendar uma demonstração.")}
              >
                Agendar Demonstração
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── Metrics Strip ─── */}
      <section className="border-y border-border/30 bg-muted/30">
        <div className="container py-10">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            {metrics.map((m, i) => (
              <motion.div key={i} variants={fadeUp} className="text-center">
                <div className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-muted mb-3">
                  <m.icon className="h-5 w-5 text-foreground/60" />
                </div>
                <p className="text-2xl md:text-3xl font-semibold tracking-tight">{m.value}</p>
                <p className="text-xs text-muted-foreground mt-1 tracking-wide">{m.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section id="recursos" className="py-24 md:py-32">
        <div className="container">
          <div className="text-center mb-16">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">
              Recursos
            </p>
            <h2 className="text-2xl font-semibold sm:text-3xl md:text-4xl tracking-tight mb-4">
              Tudo que sua escola precisa
            </h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto leading-relaxed">
              Uma plataforma completa para gerenciar todos os aspectos da sua instituição de ensino.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
              >
                <Card className="h-full border-border/30 bg-card hover:bg-muted/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-sm group">
                  <CardHeader className="pb-2">
                    <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-muted text-foreground/70 group-hover:text-foreground transition-colors">
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-[15px] font-semibold">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-[13px] leading-relaxed">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Plans ─── */}
      <section id="planos" className="py-24 md:py-32 bg-muted/20 border-y border-border/20">
        <div className="container">
          <div className="text-center mb-16">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">
              Preços
            </p>
            <h2 className="text-2xl font-semibold sm:text-3xl md:text-4xl tracking-tight mb-4">
              Planos flexíveis para cada escola
            </h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto mb-10 leading-relaxed">
              Comece grátis, evolua conforme sua necessidade.
            </p>
            <div className="inline-flex items-center gap-3 rounded-full border border-border/40 bg-card px-5 py-2.5 shadow-sm">
              <span className={`text-[13px] font-medium transition-colors ${!isAnnual ? "text-foreground" : "text-muted-foreground"}`}>
                Mensal
              </span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className={`relative h-6 w-11 rounded-full transition-colors ${isAnnual ? "bg-foreground" : "bg-muted-foreground/25"}`}
              >
                <div className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-background shadow-sm transition-transform ${isAnnual ? "translate-x-5" : ""}`} />
              </button>
              <span className={`text-[13px] font-medium transition-colors ${isAnnual ? "text-foreground" : "text-muted-foreground"}`}>
                Anual
              </span>
              {isAnnual && (
                <Badge variant="outline" className="text-[10px] px-2 py-0.5 border-border/40 font-semibold">
                  -20%
                </Badge>
              )}
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {plans.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="h-full"
              >
                <Card
                  className={`relative h-full flex flex-col transition-all duration-300 ${
                    plan.highlighted
                      ? "border-foreground/10 bg-card shadow-lg ring-1 ring-foreground/5 scale-[1.02]"
                      : "border-border/30 bg-card hover:shadow-sm"
                  }`}
                >
                  {plan.highlighted && (
                    <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-foreground px-3 py-0.5 text-[10px] text-background font-semibold tracking-wide">
                      Popular
                    </Badge>
                  )}
                  <CardHeader className="text-center pt-8 pb-4">
                    <CardTitle className="text-sm font-semibold tracking-wide">{plan.name}</CardTitle>
                    <div className="mt-3">
                      <span className="text-xs text-muted-foreground align-top">R$</span>
                      <span className="text-4xl font-semibold tracking-tight">{getPrice(plan)}</span>
                      <span className="text-muted-foreground text-xs ml-1">{plan.period}</span>
                    </div>
                    <CardDescription className="mt-2 text-[12px]">{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 px-6">
                    <div className="h-px bg-border/30 mb-5" />
                    <ul className="space-y-3">
                      {plan.features.map((f, fi) => (
                        <li key={fi} className="flex items-start gap-2.5 text-[13px]">
                          {f.included ? (
                            <Check className="h-4 w-4 shrink-0 text-foreground/50 mt-0.5" />
                          ) : (
                            <X className="h-4 w-4 text-muted-foreground/25 shrink-0 mt-0.5" />
                          )}
                          <span className={f.included ? "text-foreground/80" : "text-muted-foreground/40"}>
                            {f.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <div className="p-6 pt-2">
                    <Button
                      className={`w-full rounded-full h-10 text-[13px] font-medium ${
                        plan.highlighted
                          ? "bg-foreground text-background hover:bg-foreground/90"
                          : ""
                      }`}
                      variant={plan.highlighted ? "default" : "outline"}
                      onClick={() => {
                        setSelectedPlan({
                          id: plan.id,
                          name: plan.name,
                          price: isAnnual ? plan.annualPrice : plan.monthlyPrice,
                        });
                        setOnboardingOpen(true);
                      }}
                    >
                      {plan.cta} <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials + FAQ ─── */}
      <section id="depoimentos" className="py-24 md:py-32">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Testimonials */}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-3">
                Depoimentos
              </p>
              <h2 className="text-xl font-semibold sm:text-2xl tracking-tight mb-8">
                O que dizem nossos clientes
              </h2>
              <div className="space-y-4">
                {testimonials.map((t, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                  >
                    <Card className="border-border/30 hover:shadow-sm transition-shadow">
                      <CardContent className="p-5">
                        <div className="flex gap-0.5 mb-3">
                          {Array.from({ length: 5 }).map((_, si) => (
                            <Star key={si} className="h-3.5 w-3.5 fill-warning text-warning" />
                          ))}
                        </div>
                        <blockquote className="text-[13px] leading-relaxed mb-4 text-foreground/80">
                          "{t.quote}"
                        </blockquote>
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-[11px] font-semibold text-foreground/60">
                            {t.avatar}
                          </div>
                          <div>
                            <p className="font-medium text-[13px]">{t.author}</p>
                            <p className="text-[11px] text-muted-foreground">
                              {t.role} • {t.school}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div id="faq">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-3">
                FAQ
              </p>
              <h2 className="text-xl font-semibold sm:text-2xl tracking-tight mb-8">
                Perguntas Frequentes
              </h2>
              <Accordion type="single" collapsible className="space-y-2">
                {faqData.map((faq, i) => (
                  <AccordionItem key={i} value={`faq-${i}`} className="rounded-xl border border-border/30 px-5 data-[state=open]:bg-muted/20">
                    <AccordionTrigger className="text-left text-[13px] font-medium hover:no-underline py-4">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-4 text-[13px] leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              <div className="mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 rounded-full text-[13px] px-5 h-10"
                  onClick={() => openWhatsApp("Olá! Tenho uma dúvida.")}
                >
                  <MessageSquare className="h-4 w-4" /> Falar com Especialista
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="border-t border-border/20 bg-muted/20 py-24 md:py-32">
        <div className="container text-center max-w-2xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.h2 variants={fadeUp} className="text-2xl font-semibold sm:text-3xl md:text-4xl tracking-tight mb-4">
              Pronto para modernizar sua escola?
            </motion.h2>
            <motion.p variants={fadeUp} className="mb-10 text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
              Comece gratuitamente. Sem cartão de crédito. Sem compromisso. Configure em menos de 5 minutos.
            </motion.p>
            <motion.div variants={fadeUp}>
              <Link to="/login">
                <Button size="lg" className="gap-2 bg-foreground px-12 text-sm font-medium text-background hover:bg-foreground/90 rounded-full h-12">
                  Criar Conta Grátis <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-border/20 py-14 bg-background">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <PlatformLogo size="sm" />
              <p className="text-[13px] text-muted-foreground mt-3 max-w-xs leading-relaxed">
                Plataforma completa de gestão escolar para Sorocaba e região. Tecnologia a serviço da educação.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-[11px] mb-4 uppercase tracking-[0.15em] text-muted-foreground">
                Funcionalidades
              </h3>
              <ul className="space-y-2.5 text-[13px] text-muted-foreground">
                <li><Link to="/funcionalidades/diario-classe" className="hover:text-foreground transition-colors">Diário de Classe</Link></li>
                <li><Link to="/funcionalidades/gestao-financeira" className="hover:text-foreground transition-colors">Gestão Financeira</Link></li>
                <li><Link to="/funcionalidades/portal-aluno" className="hover:text-foreground transition-colors">Portal do Aluno</Link></li>
                <li><Link to="/funcionalidades/boletins-notas" className="hover:text-foreground transition-colors">Boletins e Notas</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-[11px] mb-4 uppercase tracking-[0.15em] text-muted-foreground">
                Cidades Atendidas
              </h3>
              <ul className="space-y-2.5 text-[13px] text-muted-foreground">
                <li><Link to="/gestao-escolar/sorocaba" className="hover:text-foreground transition-colors">Sorocaba</Link></li>
                <li><Link to="/gestao-escolar/votorantim" className="hover:text-foreground transition-colors">Votorantim</Link></li>
                <li><Link to="/gestao-escolar/itu" className="hover:text-foreground transition-colors">Itu</Link></li>
                <li><Link to="/gestao-escolar/indaiatuba" className="hover:text-foreground transition-colors">Indaiatuba</Link></li>
                <li><Link to="/gestao-escolar/tatui" className="hover:text-foreground transition-colors">Tatuí</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/20 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[12px] text-muted-foreground">
              © {new Date().getFullYear()} i ESCOLAS. Todos os direitos reservados. | Feito por Midia Ramos
            </p>
            <div className="flex gap-6 text-[12px] text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Termos de Uso</a>
              <a href="#" className="hover:text-foreground transition-colors">Política de Privacidade</a>
            </div>
          </div>
        </div>
      </footer>

      <WhatsAppButton />

      {selectedPlan && (
        <SchoolOnboardingDialog
          open={onboardingOpen}
          onOpenChange={setOnboardingOpen}
          planId={selectedPlan.id}
          planName={selectedPlan.name}
          planPrice={selectedPlan.price}
        />
      )}
    </div>
  );
};

export default Index;
