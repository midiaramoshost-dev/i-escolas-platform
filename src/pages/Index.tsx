import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { useState, useMemo, useEffect } from "react";
import {
  BookOpen, BarChart3, Shield, ArrowRight, School, MessageSquare, CreditCard,
  Moon, Sun, Star, ChevronRight, Check, X, Users, GraduationCap, FileText,
  MapPin, Zap, Clock, Award, TrendingUp, Smartphone, Lock, Globe,
} from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { usePlanos } from "@/contexts/PlanosContext";
import { SchoolOnboardingDialog } from "@/components/onboarding/SchoolOnboardingDialog";
import { usePlatformSettings } from "@/hooks/usePlatformSettings";
import { PlatformLogo } from "@/components/PlatformLogo";
import { WhatsAppButton } from "@/components/landing/WhatsAppButton";
import { SEOHead } from "@/components/SEOHead";
import { cidadesData } from "@/pages/cidades/cidades-data";
import { funcionalidadesData } from "@/pages/funcionalidades/funcionalidades-data";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const faqData = [
  { question: "Qual o melhor sistema de gestão escolar em Sorocaba?", answer: "O i ESCOLAS é a plataforma #1 de gestão escolar em Sorocaba e região metropolitana. Com mais de 500 escolas atendidas, oferece diário digital, portal do aluno, comunicação com pais, gestão financeira, boletins automáticos e muito mais. Teste gratuitamente!" },
  { question: "O i ESCOLAS atende escolas de Sorocaba, Votorantim, Itu e região?", answer: "Sim! Atendemos escolas em Sorocaba, Votorantim, Itu, Salto, Indaiatuba, Araçoiaba da Serra, Piedade, São Roque, Mairinque, Alumínio, Ibiúna, Tatuí, Boituva, Cerquilho, Capela do Alto e toda a região metropolitana de Sorocaba." },
  { question: "Como funciona o período de teste gratuito?", answer: "Oferecemos um plano Free permanente com até 50 alunos, ideal para escolas pequenas de Sorocaba e região. Não é necessário cartão de crédito. Planos pagos possuem trial de 14 dias." },
  { question: "Posso migrar meus dados de outro sistema?", answer: "Sim! Nossa equipe oferece assistência gratuita para migração de dados de escolas em Sorocaba e região. Importamos alunos, professores, turmas, notas e históricos de planilhas Excel ou de outros sistemas." },
  { question: "O sistema funciona em dispositivos móveis?", answer: "Sim! O i ESCOLAS é uma Progressive Web App (PWA) totalmente responsiva, funciona em smartphones, tablets e computadores. Instale como app no celular sem precisar da App Store." },
  { question: "Meus dados estão seguros?", answer: "Utilizamos criptografia de ponta a ponta, servidores no Brasil (em conformidade com a LGPD), backups diários automáticos e autenticação segura. Seus dados estão 100% protegidos." },
  { question: "Quanto custa o i ESCOLAS para escolas de Sorocaba?", answer: "Oferecemos planos a partir de R$ 0 (grátis para até 50 alunos) até R$ 999/mês para redes de escolas com funcionalidades premium e suporte dedicado. Desconto de 20% no plano anual." },
];

const features = [
  { icon: BookOpen, title: "Diário de Classe Digital", description: "Registro de aulas, conteúdos e frequência 100% online. Elimine cadernos físicos e acesse tudo em tempo real.", link: "/funcionalidades/diario-classe" },
  { icon: CreditCard, title: "Gestão Financeira", description: "Mensalidades, cobranças automáticas via boleto e PIX, controle de inadimplência e relatórios financeiros.", link: "/funcionalidades/gestao-financeira" },
  { icon: MessageSquare, title: "Comunicação Escola-Família", description: "Comunicados segmentados, notificações push, confirmação de leitura e canal direto com a coordenação.", link: "/funcionalidades/comunicacao-escola-familia" },
  { icon: BarChart3, title: "Dashboard Inteligente", description: "Indicadores de desempenho em tempo real, alertas automáticos e relatórios analíticos para tomada de decisão.", link: "/funcionalidades/boletins-notas" },
  { icon: GraduationCap, title: "Portal do Aluno", description: "Notas, frequência, materiais didáticos, tarefas, comunicados e carteirinha digital com QR Code.", link: "/funcionalidades/portal-aluno" },
  { icon: Users, title: "Portal do Responsável", description: "Pais acompanham notas, frequência, financeiro, cardápio nutricional e recebem notificações em tempo real.", link: "/funcionalidades/portal-responsavel" },
];

const metrics = [
  { value: "500+", label: "Escolas em Sorocaba e região", icon: School },
  { value: "150k+", label: "Alunos gerenciados", icon: GraduationCap },
  { value: "70%", label: "Menos burocracia", icon: TrendingUp },
  { value: "99.9%", label: "Uptime garantido", icon: Shield },
];

const whyChooseUs = [
  { icon: MapPin, title: "Suporte Local em Sorocaba", description: "Equipe de suporte na região de Sorocaba para treinamento presencial e atendimento personalizado." },
  { icon: Zap, title: "Implementação em 24h", description: "Configure sua escola em menos de um dia. Migração de dados gratuita e treinamento incluso." },
  { icon: Smartphone, title: "100% Mobile e PWA", description: "Funciona em qualquer dispositivo. Instale como app no celular sem App Store." },
  { icon: Lock, title: "LGPD e Dados Seguros", description: "Servidores no Brasil, criptografia, backups diários. 100% em conformidade com a LGPD." },
  { icon: Clock, title: "Suporte Rápido", description: "Tempo médio de resposta de 15 minutos. Suporte via WhatsApp, e-mail e chat." },
  { icon: Award, title: "Sem Fidelidade", description: "Cancele quando quiser. Sem multas, sem burocracia. Comece pelo plano gratuito." },
];

const testimonials = [
  { quote: "Reduzimos 70% do tempo gasto com processos administrativos. A equipe finalmente pode focar no que importa: a educação dos nossos alunos.", author: "Maria Silva", role: "Diretora", school: "Colégio São Paulo — Sorocaba", avatar: "MS" },
  { quote: "A comunicação com os pais melhorou drasticamente. Antes era um caos de bilhetes e ligações, hoje é tudo organizado e rastreável.", author: "Carlos Santos", role: "Coordenador Pedagógico", school: "Escola Nova Era — Votorantim", avatar: "CS" },
  { quote: "Lanço notas e frequência de qualquer lugar pelo celular. O portal do professor é intuitivo, rápido e confiável.", author: "Ana Oliveira", role: "Professora", school: "Instituto Educacional ABC — Itu", avatar: "AO" },
  { quote: "O módulo financeiro transformou nossa gestão. Inadimplência caiu 40% com as cobranças automáticas por PIX e boleto.", author: "Roberto Mendes", role: "Diretor Financeiro", school: "Colégio Integrado — Indaiatuba", avatar: "RM" },
];

const seoJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "i ESCOLAS",
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web Browser",
    offers: { "@type": "AggregateOffer", lowPrice: "0", highPrice: "999", priceCurrency: "BRL", offerCount: "4" },
    aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", ratingCount: "523", bestRating: "5", worstRating: "1" },
    description: "Plataforma completa de gestão escolar para Sorocaba, Votorantim, Itu, Salto, Indaiatuba e toda a região metropolitana. Educação infantil, fundamental e médio.",
    featureList: "Diário de Classe Digital, Portal do Aluno, Comunicação Integrada, Gestão Financeira, Boletins Automáticos, CRM de Matrícula, Controle de Frequência",
    author: { "@type": "Organization", name: "i ESCOLAS", url: "https://iescolas.com.br" },
  },
  {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "i ESCOLAS - Gestão Escolar em Sorocaba",
    description: "Sistema completo de gestão escolar para escolas de Sorocaba e região metropolitana. Diário digital, portal do aluno, comunicação com pais, gestão financeira e muito mais.",
    url: "https://iescolas.com.br",
    telephone: "+55-15-99999-9999",
    priceRange: "R$ 0 - R$ 999/mês",
    address: { "@type": "PostalAddress", addressLocality: "Sorocaba", addressRegion: "SP", postalCode: "18000-000", addressCountry: "BR" },
    geo: { "@type": "GeoCoordinates", latitude: "-23.5015", longitude: "-47.4526" },
    areaServed: [
      { "@type": "City", name: "Sorocaba" }, { "@type": "City", name: "Votorantim" },
      { "@type": "City", name: "Itu" }, { "@type": "City", name: "Salto" },
      { "@type": "City", name: "Indaiatuba" }, { "@type": "City", name: "Araçoiaba da Serra" },
      { "@type": "City", name: "Piedade" }, { "@type": "City", name: "São Roque" },
      { "@type": "City", name: "Mairinque" }, { "@type": "City", name: "Alumínio" },
      { "@type": "City", name: "Ibiúna" }, { "@type": "City", name: "Tatuí" },
      { "@type": "City", name: "Boituva" }, { "@type": "City", name: "Cerquilho" },
      { "@type": "City", name: "Capela do Alto" },
    ],
    openingHoursSpecification: { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:00", closes: "18:00" },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqData.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  },
];

const Index = () => {
  const { theme, toggleTheme } = useTheme();
  const { planos } = usePlanos();
  const { openWhatsApp } = usePlatformSettings();
  const [isAnnual, setIsAnnual] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{ id: string; name: string; price: number } | null>(null);

  const plans = useMemo(() => {
    const ctaMap: Record<string, string> = { free: "Começar Grátis", start: "Iniciar Trial", pro: "Escolher Pro", premium: "Falar com Vendas" };
    return planos.map((plano) => ({
      id: plano.id, name: plano.nome,
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
        title="i ESCOLAS — Sistema de Gestão Escolar #1 em Sorocaba e Região"
        description="O melhor sistema de gestão escolar para Sorocaba, Votorantim, Itu, Salto, Indaiatuba e região. Diário digital, portal do aluno, gestão financeira, comunicação com pais. +500 escolas confiam. Teste grátis!"
        canonical="https://iescolas.com.br"
        jsonLd={seoJsonLd}
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
              { href: "#cidades", label: "Cidades" },
              { href: "#faq", label: "FAQ" },
            ].map((item) => (
              <a key={item.href} href={item.href} className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors">
                {item.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full h-9 w-9">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Link to="/login">
              <Button variant="ghost" size="sm" className="hidden sm:flex text-muted-foreground hover:text-foreground text-[13px]">Entrar</Button>
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
      <section className="relative overflow-hidden pt-32 pb-20 md:pt-44 md:pb-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-5%,hsl(var(--muted)/0.6),transparent)]" />
        <div className="container relative text-center max-w-3xl mx-auto">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-muted/60 border border-border/40 text-muted-foreground px-4 py-1.5 rounded-full text-[12px] font-medium mb-8">
              <MapPin className="h-3.5 w-3.5" /> Atendendo Sorocaba e +15 cidades da região
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-[2.75rem] font-semibold tracking-tight sm:text-5xl md:text-6xl leading-[1.08] mb-6">
              A escola ensina.
              <br />
              <span className="text-muted-foreground">Nós cuidamos do resto.</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              Plataforma completa de gestão escolar para educação infantil, fundamental e médio em Sorocaba e região. Automatize processos e foque na educação.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/login">
                <Button size="lg" className="w-full sm:w-auto gap-2 bg-foreground px-10 text-sm font-medium text-background hover:bg-foreground/90 rounded-full h-12">
                  Começar Gratuitamente <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 border-border/50 px-10 text-sm font-medium hover:bg-muted rounded-full h-12" onClick={() => openWhatsApp("Olá! Sou de Sorocaba/região e gostaria de agendar uma demonstração do i ESCOLAS.")}>
                Agendar Demonstração
              </Button>
            </motion.div>
            <motion.p variants={fadeUp} className="text-[11px] text-muted-foreground/60 mt-5">
              ✓ Grátis para até 50 alunos &nbsp;·&nbsp; ✓ Sem cartão de crédito &nbsp;·&nbsp; ✓ Configuração em 5 min
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ─── Metrics ─── */}
      <section className="border-y border-border/30 bg-muted/30">
        <div className="container py-10">
          <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-8" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            {metrics.map((m, i) => (
              <motion.div key={i} variants={fadeUp} className="text-center">
                <div className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-muted mb-3">
                  <m.icon className="h-5 w-5 text-foreground/60" />
                </div>
                <p className="text-2xl md:text-3xl font-semibold tracking-tight">{m.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section id="recursos" className="py-24 md:py-32">
        <div className="container">
          <div className="text-center mb-16">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">Recursos</p>
            <h2 className="text-2xl font-semibold sm:text-3xl md:text-4xl tracking-tight mb-4">
              Tudo que sua escola em Sorocaba precisa
            </h2>
            <p className="text-muted-foreground text-sm max-w-lg mx-auto leading-relaxed">
              Uma plataforma completa para gerenciar todos os aspectos da sua instituição de ensino. Da matrícula à formatura.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.4 }}>
                <Link to={feature.link}>
                  <Card className="h-full border-border/30 bg-card hover:bg-muted/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-sm group">
                    <CardHeader className="pb-2">
                      <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-muted text-foreground/70 group-hover:text-foreground transition-colors">
                        <feature.icon className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-[15px] font-semibold flex items-center gap-2">
                        {feature.title}
                        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-[13px] leading-relaxed">{feature.description}</CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/funcionalidades/matricula-crm">
              <Button variant="outline" className="rounded-full text-[13px] px-6 gap-2">
                Ver todas as funcionalidades <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Why Choose Us ─── */}
      <section className="py-24 md:py-32 border-y border-border/20 bg-muted/10">
        <div className="container">
          <div className="text-center mb-16">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">Diferenciais</p>
            <h2 className="text-2xl font-semibold sm:text-3xl md:text-4xl tracking-tight mb-4">
              Por que escolas de Sorocaba escolhem o i ESCOLAS?
            </h2>
            <p className="text-muted-foreground text-sm max-w-lg mx-auto leading-relaxed">
              Mais que um sistema, uma parceira local para a transformação digital da sua escola.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChooseUs.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.4 }}>
                <div className="flex gap-4 p-5 rounded-xl border border-border/20 bg-card hover:bg-muted/20 transition-colors">
                  <div className="shrink-0 h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                    <item.icon className="h-5 w-5 text-foreground/60" />
                  </div>
                  <div>
                    <h3 className="text-[14px] font-semibold mb-1">{item.title}</h3>
                    <p className="text-[12px] text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Plans ─── */}
      <section id="planos" className="py-24 md:py-32">
        <div className="container">
          <div className="text-center mb-16">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">Preços</p>
            <h2 className="text-2xl font-semibold sm:text-3xl md:text-4xl tracking-tight mb-4">
              Planos flexíveis para escolas de Sorocaba e região
            </h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto mb-10 leading-relaxed">
              Comece grátis, evolua conforme sua necessidade. Sem fidelidade.
            </p>
            <div className="inline-flex items-center gap-3 rounded-full border border-border/40 bg-card px-5 py-2.5 shadow-sm">
              <span className={`text-[13px] font-medium transition-colors ${!isAnnual ? "text-foreground" : "text-muted-foreground"}`}>Mensal</span>
              <button onClick={() => setIsAnnual(!isAnnual)} className={`relative h-6 w-11 rounded-full transition-colors ${isAnnual ? "bg-foreground" : "bg-muted-foreground/25"}`}>
                <div className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-background shadow-sm transition-transform ${isAnnual ? "translate-x-5" : ""}`} />
              </button>
              <span className={`text-[13px] font-medium transition-colors ${isAnnual ? "text-foreground" : "text-muted-foreground"}`}>Anual</span>
              {isAnnual && <Badge variant="outline" className="text-[10px] px-2 py-0.5 border-border/40 font-semibold">-20%</Badge>}
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {plans.map((plan, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.4 }} className="h-full">
                <Card className={`relative h-full flex flex-col transition-all duration-300 ${plan.highlighted ? "border-foreground/10 bg-card shadow-lg ring-1 ring-foreground/5 scale-[1.02]" : "border-border/30 bg-card hover:shadow-sm"}`}>
                  {plan.highlighted && (
                    <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-foreground px-3 py-0.5 text-[10px] text-background font-semibold tracking-wide">Popular</Badge>
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
                          {f.included ? <Check className="h-4 w-4 shrink-0 text-foreground/50 mt-0.5" /> : <X className="h-4 w-4 text-muted-foreground/25 shrink-0 mt-0.5" />}
                          <span className={f.included ? "text-foreground/80" : "text-muted-foreground/40"}>{f.text}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <div className="p-6 pt-2">
                    <Button
                      className={`w-full rounded-full h-10 text-[13px] font-medium ${plan.highlighted ? "bg-foreground text-background hover:bg-foreground/90" : ""}`}
                      variant={plan.highlighted ? "default" : "outline"}
                      onClick={() => { setSelectedPlan({ id: plan.id, name: plan.name, price: isAnnual ? plan.annualPrice : plan.monthlyPrice }); setOnboardingOpen(true); }}
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

      {/* ─── Testimonials ─── */}
      <section id="depoimentos" className="py-24 md:py-32 border-y border-border/20 bg-muted/10">
        <div className="container">
          <div className="text-center mb-16">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">Depoimentos</p>
            <h2 className="text-2xl font-semibold sm:text-3xl md:text-4xl tracking-tight mb-4">
              O que dizem escolas de Sorocaba e região
            </h2>
            <p className="text-muted-foreground text-sm max-w-lg mx-auto leading-relaxed">
              Mais de 500 instituições confiam no i ESCOLAS para sua gestão escolar.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {testimonials.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.4 }}>
                <Card className="border-border/30 hover:shadow-sm transition-shadow h-full">
                  <CardContent className="p-6">
                    <div className="flex gap-0.5 mb-4">
                      {Array.from({ length: 5 }).map((_, si) => (
                        <Star key={si} className="h-3.5 w-3.5 fill-warning text-warning" />
                      ))}
                    </div>
                    <blockquote className="text-[13px] leading-relaxed mb-5 text-foreground/80">"{t.quote}"</blockquote>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-[11px] font-semibold text-foreground/60">{t.avatar}</div>
                      <div>
                        <p className="font-medium text-[13px]">{t.author}</p>
                        <p className="text-[11px] text-muted-foreground">{t.role} · {t.school}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Cities SEO Section ─── */}
      <section id="cidades" className="py-24 md:py-32">
        <div className="container">
          <div className="text-center mb-16">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">
              <Globe className="h-3.5 w-3.5 inline mr-1" /> Cobertura Regional
            </p>
            <h2 className="text-2xl font-semibold sm:text-3xl md:text-4xl tracking-tight mb-4">
              Gestão escolar em Sorocaba e região metropolitana
            </h2>
            <p className="text-muted-foreground text-sm max-w-lg mx-auto leading-relaxed">
              Atendemos escolas de educação infantil, fundamental e médio em toda a região de Sorocaba com suporte local e treinamento presencial.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {cidadesData.map((cidade) => (
              <Link key={cidade.slug} to={`/gestao-escolar/${cidade.slug}`}>
                <div className="flex items-center gap-2 p-3 rounded-lg border border-border/30 bg-card hover:bg-muted/30 hover:border-foreground/10 transition-all text-[13px] font-medium group">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
                  <span className="truncate">{cidade.nome}</span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity ml-auto shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section id="faq" className="py-24 md:py-32 border-y border-border/20 bg-muted/10">
        <div className="container max-w-3xl">
          <div className="text-center mb-16">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">FAQ</p>
            <h2 className="text-2xl font-semibold sm:text-3xl md:text-4xl tracking-tight mb-4">
              Perguntas frequentes sobre gestão escolar em Sorocaba
            </h2>
          </div>
          <Accordion type="single" collapsible className="space-y-2">
            {faqData.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="rounded-xl border border-border/30 px-5 data-[state=open]:bg-muted/20">
                <AccordionTrigger className="text-left text-[13px] font-medium hover:no-underline py-4">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4 text-[13px] leading-relaxed">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="mt-8 text-center">
            <Button variant="outline" size="sm" className="gap-2 rounded-full text-[13px] px-5 h-10" onClick={() => openWhatsApp("Olá! Tenho uma dúvida sobre o i ESCOLAS para minha escola em Sorocaba.")}>
              <MessageSquare className="h-4 w-4" /> Falar com Especialista
            </Button>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-24 md:py-32">
        <div className="container text-center max-w-2xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.h2 variants={fadeUp} className="text-2xl font-semibold sm:text-3xl md:text-4xl tracking-tight mb-4">
              Pronto para modernizar sua escola em Sorocaba?
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
            <div className="md:col-span-1">
              <PlatformLogo size="sm" />
              <p className="text-[13px] text-muted-foreground mt-3 max-w-xs leading-relaxed">
                Plataforma completa de gestão escolar para Sorocaba e região metropolitana. Tecnologia a serviço da educação.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-[11px] mb-4 uppercase tracking-[0.15em] text-muted-foreground">Funcionalidades</h3>
              <ul className="space-y-2.5 text-[13px] text-muted-foreground">
                {funcionalidadesData.slice(0, 6).map((f) => (
                  <li key={f.slug}><Link to={`/funcionalidades/${f.slug}`} className="hover:text-foreground transition-colors">{f.nome}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-[11px] mb-4 uppercase tracking-[0.15em] text-muted-foreground">Cidades Atendidas</h3>
              <ul className="space-y-2.5 text-[13px] text-muted-foreground">
                {cidadesData.slice(0, 7).map((c) => (
                  <li key={c.slug}><Link to={`/gestao-escolar/${c.slug}`} className="hover:text-foreground transition-colors">{c.nome}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-[11px] mb-4 uppercase tracking-[0.15em] text-muted-foreground">Empresa</h3>
              <ul className="space-y-2.5 text-[13px] text-muted-foreground">
                <li><Link to="/parceiros" className="hover:text-foreground transition-colors">Parceiros</Link></li>
                <li><Link to="/indicacao" className="hover:text-foreground transition-colors">Programa de Indicação</Link></li>
                <li><a href="https://www.instagram.com/iescolas.sp" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Instagram</a></li>
                <li><a href="mailto:contato@iescolas.com.br" className="hover:text-foreground transition-colors">Contato</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/20 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[12px] text-muted-foreground">
              © {new Date().getFullYear()} i ESCOLAS — Sistema de Gestão Escolar em Sorocaba e Região. Todos os direitos reservados. | Feito por Midia Ramos
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
        <SchoolOnboardingDialog open={onboardingOpen} onOpenChange={setOnboardingOpen} planId={selectedPlan.id} planName={selectedPlan.name} planPrice={selectedPlan.price} />
      )}
    </div>
  );
};

export default Index;
