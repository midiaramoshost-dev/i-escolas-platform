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
  Sparkles,
  Clock,
  Check,
  X,
} from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { usePlanos } from "@/contexts/PlanosContext";
import { SchoolOnboardingDialog } from "@/components/onboarding/SchoolOnboardingDialog";
import { usePlatformSettings } from "@/hooks/usePlatformSettings";
import { PlatformLogo } from "@/components/PlatformLogo";
import { WhatsAppButton } from "@/components/landing/WhatsAppButton";
import { SEOHead } from "@/components/SEOHead";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
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
    description: "Diário de classe, boletins automáticos, frequência e relatórios pedagógicos.",
  },
  {
    icon: CreditCard,
    title: "Gestão Financeira",
    description: "Mensalidades, cobranças automáticas, boletos e controle de inadimplência.",
  },
  {
    icon: MessageSquare,
    title: "Comunicação Integrada",
    description: "Comunicados, notificações e portais para alunos e responsáveis.",
  },
  {
    icon: BarChart3,
    title: "Dados em Tempo Real",
    description: "Dashboard inteligente com indicadores de desempenho e alertas.",
  },
];

const testimonials = [
  {
    quote: "Reduzimos 70% do tempo gasto com processos administrativos.",
    author: "Maria Silva",
    role: "Diretora",
    school: "Colégio São Paulo",
    avatar: "MS",
  },
  {
    quote: "A comunicação com os pais melhorou drasticamente.",
    author: "Carlos Santos",
    role: "Coordenador",
    school: "Escola Nova Era",
    avatar: "CS",
  },
  {
    quote: "Lanço notas e frequência de qualquer lugar.",
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

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/30 bg-background/80 backdrop-blur-2xl">
        <nav className="container flex h-14 items-center justify-between">
          <PlatformLogo size="md" />
          <div className="hidden md:flex items-center gap-8">
            {[
              { href: "#recursos", label: "Recursos" },
              { href: "#planos", label: "Planos" },
              { href: "#depoimentos", label: "Depoimentos" },
              { href: "#faq", label: "FAQ" },
            ].map((item) => (
              <a key={item.href} href={item.href} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                {item.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Link to="/login">
              <Button variant="ghost" size="sm" className="hidden sm:flex text-muted-foreground hover:text-foreground">Entrar</Button>
            </Link>
            <Link to="/login">
              <Button size="sm" className="gap-1.5 bg-foreground text-background hover:bg-foreground/90 font-medium">Começar Agora <ArrowRight className="h-3.5 w-3.5" /></Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,hsl(var(--muted)),transparent)]" />
        <div className="container relative text-center max-w-4xl mx-auto">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp}>
              <Badge variant="outline" className="mb-8 border-border/50 bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground tracking-wide uppercase">
                <Sparkles className="mr-1.5 h-3 w-3" />
                Plataforma de Gestão Escolar
              </Badge>
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-4xl font-semibold tracking-tight sm:text-5xl md:text-[3.5rem] leading-[1.1] mb-5">
              A escola ensina.
              <br />
              <span className="text-muted-foreground">Nós cuidamos do resto.</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-base text-muted-foreground md:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              Automatize processos administrativos, melhore a comunicação com famílias e foque no que importa: a educação.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/login">
                <Button size="lg" className="w-full sm:w-auto gap-2 bg-foreground px-8 text-sm font-medium text-background hover:bg-foreground/90 rounded-full">
                  Começar Gratuitamente <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 border-border/50 px-8 text-sm font-medium hover:bg-muted rounded-full" onClick={() => openWhatsApp("Olá! Gostaria de agendar uma demonstração.")}>
                Agendar Demonstração
              </Button>
            </motion.div>
            <motion.div variants={fadeUp} className="mt-12 flex flex-wrap items-center justify-center gap-8 text-muted-foreground/70">
              {[
                { icon: Shield, text: "Dados seguros (LGPD)" },
                { icon: Clock, text: "Setup em 5 min" },
                { icon: School, text: "+500 escolas" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs tracking-wide">
                  <item.icon className="h-3.5 w-3.5" />
                  <span>{item.text}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>


      {/* Divider */}
      <div className="h-px bg-border/40" />

      {/* Features */}
      <section id="recursos" className="py-20">
        <div className="container">
          <div className="text-center mb-14">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-3">Recursos</p>
            <h2 className="text-2xl font-semibold sm:text-3xl mb-3">Tudo que sua escola precisa</h2>
            <p className="text-muted-foreground text-sm max-w-lg mx-auto">
              Uma plataforma completa para gerenciar todos os aspectos da sua instituição.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <Card className="h-full border-border/40 bg-card transition-all hover:-translate-y-0.5 hover:shadow-md">
                  <CardHeader className="pb-1">
                    <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-md bg-muted text-foreground/80">
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-sm font-semibold">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-xs leading-relaxed">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-px bg-border/40" />

      {/* Plans */}
      <section id="planos" className="py-20 bg-muted/20">
        <div className="container">
          <div className="text-center mb-14">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-3">Preços</p>
            <h2 className="text-2xl font-semibold sm:text-3xl mb-3">Planos flexíveis</h2>
            <p className="text-muted-foreground text-sm max-w-lg mx-auto mb-8">
              Comece grátis, evolua quando quiser.
            </p>
            <div className="inline-flex items-center gap-3 rounded-full border border-border/50 bg-card px-4 py-2">
              <span className={`text-xs font-medium ${!isAnnual ? "text-foreground" : "text-muted-foreground"}`}>Mensal</span>
              <button onClick={() => setIsAnnual(!isAnnual)} className={`relative h-5 w-10 rounded-full transition-colors ${isAnnual ? "bg-foreground" : "bg-muted-foreground/30"}`}>
                <div className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-background shadow transition-transform ${isAnnual ? "translate-x-5" : ""}`} />
              </button>
              <span className={`text-xs font-medium ${isAnnual ? "text-foreground" : "text-muted-foreground"}`}>Anual</span>
              {isAnnual && <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-border/50">-20%</Badge>}
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {plans.map((plan, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="h-full">
                <Card className={`relative h-full flex flex-col ${plan.highlighted ? "border-foreground/10 bg-card shadow-lg ring-1 ring-foreground/5" : "border-border/40 bg-card"}`}>
                  {plan.highlighted && (
                    <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-foreground px-2.5 py-0.5 text-[10px] text-background font-medium">
                      Popular
                    </Badge>
                  )}
                  <CardHeader className="text-center pt-7 pb-4">
                    <CardTitle className="text-sm font-semibold">{plan.name}</CardTitle>
                    <div className="mt-2">
                      <span className="text-xs text-muted-foreground">R$</span>
                      <span className="text-3xl font-semibold tracking-tight">{getPrice(plan)}</span>
                      <span className="text-muted-foreground text-xs">{plan.period}</span>
                    </div>
                    <CardDescription className="mt-1.5 text-[11px]">{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <ul className="space-y-2">
                      {plan.features.map((f, fi) => (
                        <li key={fi} className="flex items-center gap-2 text-xs">
                          {f.included ? <Check className="h-3.5 w-3.5 shrink-0 text-foreground/60" /> : <X className="h-3.5 w-3.5 text-muted-foreground/30 shrink-0" />}
                          <span className={f.included ? "text-foreground/80" : "text-muted-foreground/40"}>{f.text}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <div className="p-5 pt-0">
                    <Button size="sm" className={plan.highlighted ? "w-full bg-foreground text-background hover:bg-foreground/90 rounded-full" : "w-full rounded-full"} variant={plan.highlighted ? "default" : "outline"} onClick={() => { setSelectedPlan({ id: plan.id, name: plan.name, price: isAnnual ? plan.annualPrice : plan.monthlyPrice }); setOnboardingOpen(true); }}>
                      {plan.cta} <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-px bg-border/40" />

      {/* Testimonials + FAQ */}
      <section id="depoimentos" className="py-20">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Testimonials */}
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-2">Depoimentos</p>
              <h2 className="text-xl font-semibold mb-6">O que dizem nossos clientes</h2>
              <div className="space-y-3">
                {testimonials.map((t, i) => (
                  <Card key={i} className="border-border/40">
                    <CardContent className="p-4">
                      <div className="flex gap-0.5 mb-2">
                        {Array.from({ length: 5 }).map((_, si) => (
                          <Star key={si} className="h-3 w-3 fill-warning text-warning" />
                        ))}
                      </div>
                      <blockquote className="text-xs leading-relaxed mb-3 text-foreground/80">"{t.quote}"</blockquote>
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-foreground/70">
                          {t.avatar}
                        </div>
                        <div>
                          <p className="font-medium text-xs">{t.author}</p>
                          <p className="text-[10px] text-muted-foreground">{t.role} • {t.school}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div id="faq">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-2">FAQ</p>
              <h2 className="text-xl font-semibold mb-6">Perguntas Frequentes</h2>
              <Accordion type="single" collapsible className="space-y-1.5">
                {faqData.map((faq, i) => (
                  <AccordionItem key={i} value={`faq-${i}`} className="rounded-lg border border-border/40 px-4">
                    <AccordionTrigger className="text-left text-xs font-medium hover:no-underline py-3">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-3 text-xs leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              <div className="mt-6">
                <Button variant="outline" size="sm" className="gap-1.5 rounded-full text-xs" onClick={() => openWhatsApp("Olá! Tenho uma dúvida.")}>
                  <MessageSquare className="h-4 w-4" /> Falar com Especialista
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border/40 py-20">
        <div className="container text-center max-w-xl">
          <h2 className="text-2xl font-semibold mb-3">Pronto para modernizar sua escola?</h2>
          <p className="mb-8 text-sm text-muted-foreground">
            Comece gratuitamente. Sem cartão de crédito. Sem compromisso.
          </p>
          <Link to="/login">
            <Button size="lg" className="gap-2 bg-foreground px-10 text-sm font-medium text-background hover:bg-foreground/90 rounded-full">
              Criar Conta Grátis <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-10">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="md:col-span-2">
              <PlatformLogo size="sm" />
              <p className="text-xs text-muted-foreground mt-2 max-w-xs leading-relaxed">
                Plataforma completa de gestão escolar para Sorocaba e região.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-xs mb-3 uppercase tracking-wider text-muted-foreground">Funcionalidades</h3>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                <li><Link to="/funcionalidades/diario-classe" className="hover:text-foreground transition-colors">Diário de Classe</Link></li>
                <li><Link to="/funcionalidades/gestao-financeira" className="hover:text-foreground transition-colors">Gestão Financeira</Link></li>
                <li><Link to="/funcionalidades/portal-aluno" className="hover:text-foreground transition-colors">Portal do Aluno</Link></li>
                <li><Link to="/funcionalidades/boletins-notas" className="hover:text-foreground transition-colors">Boletins e Notas</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-xs mb-3 uppercase tracking-wider text-muted-foreground">Cidades Atendidas</h3>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                <li><Link to="/gestao-escolar/sorocaba" className="hover:text-foreground transition-colors">Sorocaba</Link></li>
                <li><Link to="/gestao-escolar/votorantim" className="hover:text-foreground transition-colors">Votorantim</Link></li>
                <li><Link to="/gestao-escolar/itu" className="hover:text-foreground transition-colors">Itu</Link></li>
                <li><Link to="/gestao-escolar/indaiatuba" className="hover:text-foreground transition-colors">Indaiatuba</Link></li>
                <li><Link to="/gestao-escolar/tatui" className="hover:text-foreground transition-colors">Tatuí</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/40 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} i ESCOLAS. Todos os direitos reservados. | Feito por Midia Ramos
            </p>
            <div className="flex gap-4 text-xs text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Termos</a>
              <a href="#" className="hover:text-foreground transition-colors">Privacidade</a>
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
