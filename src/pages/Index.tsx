import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useMemo, useEffect } from "react";
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  BarChart3, 
  Shield, 
  Smartphone,
  CheckCircle2,
  ArrowRight,
  School,
  Bell,
  FileText,
  Calendar,
  MessageSquare,
  CreditCard,
  Moon,
  Sun,
  Star,
  HelpCircle,
  Send,
  MapPin,
  Mail,
  Phone,
  Zap,
  Globe,
  Lock,
  TrendingUp,
  Play,
  ChevronRight,
  Sparkles,
  Award,
  Clock,
  Heart,
  Check,
  X,
  ArrowUpRight,
  MousePointer2
} from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { usePlanos } from "@/contexts/PlanosContext";
import { ContactForm } from "@/components/landing/ContactForm";
import { ReferralSection } from "@/components/landing/ReferralSection";
import { WhatsAppButton } from "@/components/landing/WhatsAppButton";
import {
  ScrollReveal,
  FadeUp,
  FadeLeft,
  FadeRight,
  ScaleUp,
  Blur,
  SlideUp,
  Bounce,
  Elastic,
  Reveal,
  WordReveal,
  LineReveal,
  StaggerContainer,
  StaggerItem,
  Counter,
  TextReveal,
} from "@/components/animations/ScrollReveal";
import { useParallax, useScrollProgress } from "@/hooks/useScrollReveal";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import heroSlide1 from "@/assets/hero-slide-1.jpg";
import heroSlide2 from "@/assets/hero-slide-2.jpg";
import heroSlide3 from "@/assets/hero-slide-3.jpg";
import heroSlide4 from "@/assets/hero-slide-4.jpg";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0 }
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 }
};

const slideInLeft = {
  hidden: { opacity: 0, x: -100 },
  visible: { opacity: 1, x: 0 }
};

const slideInRight = {
  hidden: { opacity: 0, x: 100 },
  visible: { opacity: 1, x: 0 }
};

const faqData = [
  {
    question: "Como funciona o período de teste gratuito?",
    answer: "Oferecemos um plano Free permanente com até 50 alunos, ideal para escolas pequenas ou para testar a plataforma. Não é necessário cartão de crédito. Você pode migrar para um plano pago quando precisar de mais recursos ou capacidade."
  },
  {
    question: "Posso migrar meus dados de outro sistema?",
    answer: "Sim! Nossa equipe de suporte oferece assistência gratuita para migração de dados. Importamos alunos, professores, turmas, notas e históricos de planilhas Excel ou de outros sistemas de gestão escolar."
  },
  {
    question: "O sistema funciona em dispositivos móveis?",
    answer: "Absolutamente! O i ESCOLAS é totalmente responsivo e funciona perfeitamente em smartphones, tablets e computadores. Professores podem lançar notas e frequência de qualquer lugar, e pais acompanham tudo pelo celular."
  },
  {
    question: "Como funciona a cobrança por aluno?",
    answer: "Além do valor base mensal do plano, há uma taxa adicional por aluno ativo. Por exemplo, no plano Pro (R$399/mês + R$2/aluno), uma escola com 200 alunos pagaria R$799/mês. Quanto maior o plano, menor o custo por aluno."
  },
  {
    question: "Meus dados estão seguros?",
    answer: "Sim! Utilizamos criptografia de ponta a ponta, servidores seguros no Brasil (conformidade com LGPD), backups diários automáticos e autenticação em dois fatores. Seus dados são 100% protegidos."
  },
  {
    question: "Posso personalizar a plataforma com a marca da minha escola?",
    answer: "Sim, no plano Premium você pode personalizar completamente a plataforma com o logo, cores e identidade visual da sua escola. Os portais de alunos e responsáveis refletem sua marca."
  },
  {
    question: "Qual o prazo de implementação?",
    answer: "A maioria das escolas está operando em menos de uma semana. O setup inicial leva cerca de 5 minutos, e nossa equipe oferece treinamento online gratuito para toda a equipe."
  },
  {
    question: "Posso cancelar a qualquer momento?",
    answer: "Sim, não há fidelidade ou multa de cancelamento. Você pode fazer downgrade para o plano Free ou cancelar completamente quando quiser. Seus dados ficam disponíveis para exportação."
  }
];

const Index = () => {
  const { theme, toggleTheme } = useTheme();
  const { planos } = usePlanos();
  const [isAnnual, setIsAnnual] = useState(false);
  const [heroCarouselApi, setHeroCarouselApi] = useState<CarouselApi | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  // Add FAQ Schema JSON-LD for SEO
  useEffect(() => {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqData.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };

    const existingScript = document.getElementById('faq-schema');
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.id = 'faq-schema';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(faqSchema);
    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.getElementById('faq-schema');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (!heroCarouselApi) return;

    const onSelect = () => {
      setActiveSlide(heroCarouselApi.selectedScrollSnap());
    };
    heroCarouselApi.on("select", onSelect);
    onSelect();

    const interval = setInterval(() => {
      heroCarouselApi.scrollNext();
    }, 5000);

    return () => {
      clearInterval(interval);
      heroCarouselApi.off("select", onSelect);
    };
  }, [heroCarouselApi]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const features = [
    {
      icon: Users,
      title: "Gestão de Usuários",
      description: "Controle completo de professores, alunos e responsáveis com permissões granulares.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: BookOpen,
      title: "Diário de Classe Digital",
      description: "Registro de aulas, frequência e conteúdos de forma simples e intuitiva.",
      gradient: "from-violet-500 to-purple-500"
    },
    {
      icon: BarChart3,
      title: "Dashboard Inteligente",
      description: "Indicadores em tempo real sobre desempenho e alertas de risco acadêmico.",
      gradient: "from-emerald-500 to-teal-500"
    },
    {
      icon: FileText,
      title: "Boletins Automáticos",
      description: "Geração automática de boletins, históricos e relatórios pedagógicos.",
      gradient: "from-orange-500 to-amber-500"
    },
    {
      icon: MessageSquare,
      title: "Comunicação Integrada",
      description: "Mural de comunicados e notificações para toda a comunidade escolar.",
      gradient: "from-pink-500 to-rose-500"
    },
    {
      icon: CreditCard,
      title: "Gestão Financeira",
      description: "Controle de mensalidades, cobranças automáticas e relatórios financeiros.",
      gradient: "from-indigo-500 to-blue-500"
    }
  ];

  // Transforma os planos do contexto em formato para exibição
  const plans = useMemo(() => {
    const ctaMap: Record<string, string> = {
      free: "Começar Grátis",
      start: "Iniciar Trial",
      pro: "Escolher Pro",
      premium: "Falar com Vendas"
    };

    return planos.map(plano => {
      const features = [
        { text: plano.recursos.alunos, included: true },
        { text: plano.recursos.professores, included: true },
        { text: plano.recursos.suporte, included: true },
        { text: "Relatórios Avançados", included: plano.recursos.relatorios },
        { text: "Módulo Financeiro", included: plano.recursos.financeiro },
        { text: "API de Integração", included: plano.recursos.api }
      ];

      return {
        name: plano.nome,
        monthlyPrice: plano.preco,
        annualPrice: plano.preco > 0 ? Math.round(plano.preco * 12 * 0.8 / 12) : 0,
        period: plano.preco === 0 ? "para sempre" : (isAnnual ? "/mês (anual)" : "/mês"),
        description: plano.descricao,
        features,
        highlighted: plano.popular || false,
        cta: ctaMap[plano.id] || "Escolher Plano"
      };
    });
  }, [planos, isAnnual]);

  const getPrice = (plan: typeof plans[0]) => {
    if (plan.monthlyPrice === 0) return "0";
    return isAnnual ? plan.annualPrice.toString() : plan.monthlyPrice.toString();
  };

  const testimonials = [
    {
      quote: "Reduzimos 70% do tempo gasto com processos administrativos. Uma transformação completa na nossa gestão.",
      author: "Maria Silva",
      role: "Diretora",
      school: "Colégio São Paulo",
      avatar: "MS",
      rating: 5
    },
    {
      quote: "A comunicação com os pais melhorou drasticamente. Agora eles acompanham tudo em tempo real.",
      author: "Carlos Santos",
      role: "Coordenador Pedagógico",
      school: "Escola Nova Era",
      avatar: "CS",
      rating: 5
    },
    {
      quote: "O diário digital facilitou muito meu trabalho. Lanço notas e frequência de qualquer lugar.",
      author: "Ana Oliveira",
      role: "Professora",
      school: "Instituto Educacional ABC",
      avatar: "AO",
      rating: 5
    }
  ];

  const stats = [
    { value: "500+", label: "Escolas Ativas", icon: School },
    { value: "150k+", label: "Alunos", icon: Users },
    { value: "12k+", label: "Professores", icon: GraduationCap },
    { value: "98%", label: "Satisfação", icon: Heart }
  ];

  const comparisonItems = [
    { feature: "Gestão de alunos e turmas", iescolas: true, traditional: true },
    { feature: "Diário de classe digital", iescolas: true, traditional: false },
    { feature: "Portal do aluno/responsável", iescolas: true, traditional: false },
    { feature: "Comunicação integrada", iescolas: true, traditional: false },
    { feature: "Relatórios automáticos", iescolas: true, traditional: false },
    { feature: "Acesso mobile", iescolas: true, traditional: false },
    { feature: "Atualizações em tempo real", iescolas: true, traditional: false },
    { feature: "Suporte especializado", iescolas: true, traditional: false },
  ];

  const heroSlides = [
    {
      title: "Dashboard Inteligente",
      description: "Indicadores em tempo real para decisões rápidas e seguras.",
      image: heroSlide1,
    },
    {
      title: "Diário Digital",
      description: "Registro de aulas e frequência em poucos cliques.",
      image: heroSlide2,
    },
    {
      title: "Portal do Responsável",
      description: "Comunicação e acompanhamento em tempo real com as famílias.",
      image: heroSlide3,
    },
    {
      title: "Gestão Completa",
      description: "Tudo integrado em um só lugar para sua equipe pedagógica.",
      image: heroSlide4,
    }
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Header - Glassmorphism Effect */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60"
      >
        <nav className="container flex h-16 items-center justify-between" aria-label="Navegação principal">
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/25">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
              <div className="absolute -inset-1 rounded-xl bg-primary/20 blur-lg" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              i ESCOLAS
            </span>
          </motion.div>
          
          <div className="hidden md:flex items-center gap-8">
            {[
              { href: "#recursos", label: "Recursos" },
              { href: "#planos", label: "Planos" },
              { href: "#indicacao", label: "Indique e Ganhe" },
              { href: "#depoimentos", label: "Depoimentos" },
              { href: "#faq", label: "FAQ" },
              { href: "#contato", label: "Contato" }
            ].map((item, index) => (
              <motion.a 
                key={item.href}
                href={item.href} 
                className="relative text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
              </motion.a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.4 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full"
                aria-label={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            </motion.div>
            <Link to="/login">
              <Button variant="ghost" className="hidden sm:flex">Entrar</Button>
            </Link>
            <Link to="/login">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="gap-2 shadow-lg shadow-primary/25">
                  Começar Agora
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
            </Link>
          </div>
        </nav>
      </motion.header>

      {/* Hero Section - Modern with Parallax */}
      <section ref={heroRef} className="relative flex items-center justify-center pt-24 pb-12 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
          <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000" />
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.3)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.3)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        </div>

        <motion.div 
          className="container relative z-10"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          <motion.div 
            className="mx-auto max-w-5xl text-center"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {/* Badge */}
            <motion.div variants={fadeInUp} transition={{ duration: 0.6 }}>
              <Badge className="mb-6 py-2 px-4 text-sm bg-primary/10 text-primary border-primary/20 hover:bg-primary/15">
                <Sparkles className="mr-2 h-4 w-4" />
                Plataforma #1 em Gestão Escolar no Brasil
              </Badge>
            </motion.div>

            {/* Main Heading */}
            <motion.h1 
              className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
              variants={fadeInUp}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <span className="block text-foreground">A escola ensina.</span>
              <span className="block mt-2 bg-gradient-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent">
                Nós cuidamos do resto.
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p 
              className="mb-8 text-lg text-muted-foreground md:text-xl max-w-3xl mx-auto leading-relaxed"
              variants={fadeInUp}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              Automatize processos, melhore a comunicação e transforme a gestão da sua escola com a plataforma mais completa do mercado.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={fadeInUp}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <Link to="/login">
                <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" className="w-full sm:w-auto gap-2 text-lg px-8 py-6 shadow-xl shadow-primary/30">
                    Começar Gratuitamente
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </motion.div>
              </Link>
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 text-lg px-8 py-6 group">
                  <Play className="h-5 w-5 group-hover:text-primary transition-colors" />
                  Ver Demonstração
                </Button>
              </motion.div>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div 
              className="mt-16 flex flex-wrap items-center justify-center gap-8 text-muted-foreground"
              variants={fadeIn}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <span className="text-sm">Dados 100% seguros</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <span className="text-sm">Setup em 5 minutos</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                <span className="text-sm">+500 escolas confiam</span>
              </div>
            </motion.div>

            {/* Hero Slideshow */}
            <motion.div
              className="mt-10"
              variants={fadeIn}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Carousel
                opts={{ loop: true }}
                setApi={setHeroCarouselApi}
                className="relative mx-auto max-w-5xl"
                aria-label="Slideshow de recursos"
              >
                <CarouselContent>
                  {heroSlides.map((slide, index) => (
                    <CarouselItem key={index}>
                      <div className="relative h-72 sm:h-80 md:h-[28rem] rounded-2xl overflow-hidden group shadow-2xl shadow-primary/10 border border-border/40">
                        <img
                          src={slide.image}
                          alt={slide.title}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading={index === 0 ? "eager" : "lazy"}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="relative h-full flex flex-col items-center justify-end gap-2 p-6 pb-10 md:p-8 md:pb-14 text-center">
                          <span className="inline-flex items-center rounded-full bg-primary/90 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-primary-foreground mb-2">
                            {slide.title}
                          </span>
                          <p className="text-white/90 max-w-lg mx-auto text-sm md:text-lg drop-shadow-lg">{slide.description}</p>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden md:inline-flex left-4 bg-white/20 border-white/30 text-white hover:bg-white/30" />
                <CarouselNext className="hidden md:inline-flex right-4 bg-white/20 border-white/30 text-white hover:bg-white/30" />
              </Carousel>
              {/* Dot indicators */}
              <div className="flex justify-center gap-2 mt-5">
                {heroSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => heroCarouselApi?.scrollTo(index)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      activeSlide === index
                        ? "w-8 bg-primary"
                        : "w-2.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    }`}
                    aria-label={`Ir para slide ${index + 1}`}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <MousePointer2 className="h-6 w-6 text-muted-foreground" />
        </motion.div>
      </section>

      {/* Stats Section - Floating Cards with Enhanced Animations */}
      <section className="relative py-20 -mt-20">
        <div className="container">
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4" staggerDelay={0.15}>
            {stats.map((stat, index) => (
              <StaggerItem key={index} animation="bounce">
                <motion.div whileHover={{ y: -12, scale: 1.05 }} transition={{ type: "spring", stiffness: 400, damping: 15 }}>
                  <Card className="relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm group">
                    <CardContent className="p-6 text-center">
                      <motion.div 
                        className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4"
                        whileHover={{ rotate: 360, scale: 1.2 }}
                        transition={{ duration: 0.6 }}
                      >
                        <stat.icon className="h-6 w-6" />
                      </motion.div>
                      <div className="text-4xl font-bold text-foreground">
                        <Counter 
                          to={parseInt(stat.value.replace(/[^0-9]/g, "")) || 0} 
                          suffix={stat.value.includes("+") ? "+" : stat.value.includes("%") ? "%" : stat.value.includes("k") ? "k+" : ""}
                          duration={2}
                          className="inline"
                        />
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                    </CardContent>
                    <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
                  </Card>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Partners/Clients Section */}
      <section className="py-16 border-y bg-muted/30">
        <div className="container">
          <FadeUp delay={0.1}>
            <div className="text-center mb-10">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
                Confiança de mais de 500 escolas
              </p>
              <h3 className="text-xl font-semibold text-foreground">
                Escolas que transformaram sua gestão com o i ESCOLAS
              </h3>
            </div>
          </FadeUp>

          <div className="relative overflow-hidden">
            {/* Gradient masks */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-muted/80 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-muted/80 to-transparent z-10 pointer-events-none" />
            
            {/* Scrolling logos - first row */}
            <motion.div
              className="flex gap-12 py-4"
              animate={{ x: [0, -1920] }}
              transition={{ 
                duration: 30, 
                repeat: Infinity, 
                ease: "linear",
                repeatType: "loop"
              }}
            >
              {[
                { name: "Colégio São Paulo", city: "São Paulo, SP" },
                { name: "Escola Nova Era", city: "Rio de Janeiro, RJ" },
                { name: "Instituto Educacional ABC", city: "Belo Horizonte, MG" },
                { name: "Colégio Progresso", city: "Curitiba, PR" },
                { name: "Escola Futuro Brilhante", city: "Salvador, BA" },
                { name: "Centro Educacional Vida", city: "Fortaleza, CE" },
                { name: "Colégio Integração", city: "Brasília, DF" },
                { name: "Escola Criativa", city: "Porto Alegre, RS" },
                { name: "Instituto Saber", city: "Recife, PE" },
                { name: "Colégio Excelência", city: "Manaus, AM" },
                { name: "Colégio São Paulo", city: "São Paulo, SP" },
                { name: "Escola Nova Era", city: "Rio de Janeiro, RJ" },
                { name: "Instituto Educacional ABC", city: "Belo Horizonte, MG" },
                { name: "Colégio Progresso", city: "Curitiba, PR" },
                { name: "Escola Futuro Brilhante", city: "Salvador, BA" },
                { name: "Centro Educacional Vida", city: "Fortaleza, CE" },
              ].map((school, index) => (
                <motion.div
                  key={index}
                  className="flex-shrink-0 flex items-center gap-3 px-6 py-3 rounded-xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-shadow"
                  whileHover={{ scale: 1.05, y: -4 }}
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <GraduationCap className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm whitespace-nowrap">{school.name}</p>
                    <p className="text-xs text-muted-foreground whitespace-nowrap">{school.city}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <FadeUp delay={0.3}>
            <div className="flex flex-wrap justify-center gap-8 mt-10 text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span className="text-sm">500+ escolas ativas</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span className="text-sm">26 estados + DF</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span className="text-sm">150k+ alunos gerenciados</span>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Referral Program Section */}
      <ReferralSection />

      {/* Features Section - Bento Grid with Enhanced Scroll Animations */}
      <section id="recursos" className="py-24 relative">
        <div className="container">
          <div className="text-center mb-16">
            <Blur delay={0.1}>
              <Badge variant="outline" className="mb-4">Recursos</Badge>
            </Blur>
            <SlideUp delay={0.2}>
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
                Tudo que sua escola precisa
              </h2>
            </SlideUp>
            <FadeUp delay={0.3}>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Uma plataforma completa para gerenciar todos os aspectos da sua instituição
              </p>
            </FadeUp>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <ScrollReveal 
                key={index} 
                animation={index % 3 === 0 ? "fadeLeft" : index % 3 === 1 ? "fadeUp" : "fadeRight"}
                staggerIndex={index}
                staggerDelay={0.12}
              >
                <motion.div
                  whileHover={{ y: -12, rotateY: 5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="h-full perspective-1000"
                >
                  <Card className="group h-full border-border/50 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 transition-all duration-500 overflow-hidden">
                    <CardHeader className="pb-4">
                      <motion.div 
                        className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.gradient} text-white shadow-lg`}
                        whileHover={{ scale: 1.15, rotate: 10 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <feature.icon className="h-7 w-7" />
                      </motion.div>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base leading-relaxed">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                    <motion.div 
                      className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary/50"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.4 }}
                      style={{ transformOrigin: "left" }}
                    />
                  </Card>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>

          {/* Extra Features */}
          <StaggerContainer className="mt-12 flex flex-wrap justify-center gap-3" staggerDelay={0.08}>
            {[
              { icon: Bell, label: "Alertas Inteligentes" },
              { icon: Shield, label: "Segurança Avançada" },
              { icon: Smartphone, label: "100% Responsivo" },
              { icon: Zap, label: "Alta Performance" },
              { icon: Globe, label: "Acesso em Qualquer Lugar" },
              { icon: Lock, label: "LGPD Compliance" }
            ].map((item, index) => (
              <StaggerItem key={index} animation="elastic">
                <motion.div whileHover={{ scale: 1.15, y: -4, rotate: 3 }} transition={{ type: "spring", stiffness: 500 }}>
                  <Badge variant="secondary" className="gap-2 py-2 px-4 text-sm cursor-pointer">
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Badge>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Plans Section - Modern Pricing with Reveal Animations */}
      <section id="planos" className="py-24 bg-muted/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        <div className="container relative">
          <div className="text-center mb-16">
            <Elastic delay={0.1}>
              <Badge variant="outline" className="mb-4">Planos</Badge>
            </Elastic>
            <Reveal delay={0.2}>
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
                Investimento que se paga
              </h2>
            </Reveal>
            <FadeUp delay={0.3}>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Planos flexíveis que crescem com sua escola. Comece grátis, evolua quando quiser.
              </p>
            </FadeUp>
            
            {/* Toggle Mensal/Anual */}
            <FadeUp delay={0.4}>
              <div className="flex items-center justify-center gap-4 mt-8">
                <span className={`text-sm font-medium transition-colors ${!isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
                  Mensal
                </span>
                <button
                  onClick={() => setIsAnnual(!isAnnual)}
                  className={`relative w-16 h-8 rounded-full transition-colors duration-300 ${
                    isAnnual ? 'bg-primary' : 'bg-muted-foreground/30'
                  }`}
                  aria-label="Alternar entre plano mensal e anual"
                >
                  <motion.div
                    className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md"
                    animate={{ x: isAnnual ? 32 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </button>
                <span className={`text-sm font-medium transition-colors ${isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
                  Anual
                </span>
                {isAnnual && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, x: -10 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    className="ml-2"
                  >
                    <Badge className="bg-green-500/90 text-white border-0 shadow-lg shadow-green-500/25">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Economize 20%
                    </Badge>
                  </motion.div>
                )}
              </div>
            </FadeUp>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan, index) => (
              <ScrollReveal 
                key={index} 
                animation="flipY"
                staggerIndex={index}
                staggerDelay={0.15}
              >
                <motion.div
                  whileHover={{ y: -12, scale: 1.03, rotateX: 5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="h-full"
                >
                  <Card 
                    className={`relative h-full flex flex-col transition-all duration-500 ${
                      plan.highlighted 
                        ? 'border-primary shadow-xl shadow-primary/20 scale-105' 
                        : 'border-border/50 hover:shadow-xl hover:shadow-primary/10'
                    }`}
                  >
                    {plan.highlighted && (
                      <motion.div 
                        className="absolute -top-4 left-1/2 -translate-x-1/2"
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5, type: "spring" }}
                      >
                        <Badge className="bg-primary shadow-lg px-4 py-1">
                          <Star className="h-3 w-3 mr-1" />
                          Mais Popular
                        </Badge>
                      </motion.div>
                    )}
                    <CardHeader className="text-center pt-8">
                      <CardTitle className="text-xl">{plan.name}</CardTitle>
                      <div className="mt-4 relative">
                        <span className="text-sm text-muted-foreground">R$</span>
                        <motion.span 
                          key={`${plan.name}-${isAnnual}`}
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-5xl font-bold"
                        >
                          {getPrice(plan)}
                        </motion.span>
                        <span className="text-muted-foreground">{plan.period}</span>
                        {isAnnual && plan.monthlyPrice > 0 && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-1"
                          >
                            <span className="text-xs text-muted-foreground line-through">
                              R$ {plan.monthlyPrice}/mês
                            </span>
                          </motion.div>
                        )}
                      </div>
                      <CardDescription className="mt-2">{plan.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <ul className="space-y-3">
                        {plan.features.map((feature, featureIndex) => (
                          <motion.li 
                            key={featureIndex} 
                            className="flex items-center gap-3"
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 + featureIndex * 0.08 }}
                          >
                            {feature.included ? (
                              <Check className="h-5 w-5 text-primary flex-shrink-0" />
                            ) : (
                              <X className="h-5 w-5 text-muted-foreground/50 flex-shrink-0" />
                            )}
                            <span className={feature.included ? "" : "text-muted-foreground/50"}>
                              {feature.text}
                            </span>
                          </motion.li>
                        ))}
                      </ul>
                    </CardContent>
                    <div className="p-6 pt-0">
                      <Link to="/login">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button 
                            className="w-full" 
                            variant={plan.highlighted ? "default" : "outline"}
                            size="lg"
                          >
                            {plan.cta}
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </motion.div>
                      </Link>
                    </div>
                  </Card>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section with Enhanced Animations */}
      <section id="comparativo" className="py-24">
        <div className="container">
          <div className="text-center mb-16">
            <ScaleUp delay={0.1}>
              <Badge variant="outline" className="mb-4">Comparativo</Badge>
            </ScaleUp>
            <SlideUp delay={0.2}>
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
                Por que escolher o i ESCOLAS?
              </h2>
            </SlideUp>
            <Blur delay={0.3}>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Veja como nos comparamos com métodos tradicionais de gestão
              </p>
            </Blur>
          </div>

          <FadeUp delay={0.2}>
            <Card className="overflow-hidden max-w-3xl mx-auto">
              <div className="grid grid-cols-3 bg-muted/50 p-4 font-semibold text-center">
                <div>Funcionalidade</div>
                <div className="text-primary">i ESCOLAS</div>
                <div className="text-muted-foreground">Tradicional</div>
              </div>
              {comparisonItems.map((item, index) => (
                <ScrollReveal 
                  key={index} 
                  animation="wave"
                  staggerIndex={index}
                  staggerDelay={0.08}
                >
                  <motion.div
                    className="grid grid-cols-3 p-4 border-t items-center text-center hover:bg-muted/30 transition-colors"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <div className="text-left font-medium">{item.feature}</div>
                    <div>
                      {item.iescolas ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ type: "spring", stiffness: 500, delay: 0.2 + index * 0.05 }}
                        >
                          <Check className="h-6 w-6 text-primary mx-auto" />
                        </motion.div>
                      ) : (
                        <X className="h-6 w-6 text-muted-foreground/50 mx-auto" />
                      )}
                    </div>
                    <div>
                      {item.traditional ? (
                        <Check className="h-6 w-6 text-muted-foreground mx-auto" />
                      ) : (
                        <X className="h-6 w-6 text-muted-foreground/50 mx-auto" />
                      )}
                    </div>
                  </motion.div>
                </ScrollReveal>
              ))}
            </Card>
          </FadeUp>
        </div>
      </section>

      {/* Testimonials Section - Modern Cards with Stagger */}
      <section id="depoimentos" className="py-24 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <Bounce delay={0.1}>
              <Badge variant="outline" className="mb-4">Depoimentos</Badge>
            </Bounce>
            <LineReveal delay={0.2}>
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
                O que nossos clientes dizem
              </h2>
            </LineReveal>
            <FadeUp delay={0.3}>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Histórias reais de escolas que transformaram sua gestão
              </p>
            </FadeUp>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <ScrollReveal 
                key={index} 
                animation={index === 0 ? "fadeLeft" : index === 2 ? "fadeRight" : "fadeUp"}
                staggerIndex={index}
                staggerDelay={0.2}
              >
                <motion.div
                  whileHover={{ y: -12, scale: 1.02, rotateY: 5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="h-full perspective-1000"
                >
                  <Card className="h-full border-border/50 hover:shadow-xl hover:shadow-primary/10 transition-all duration-500">
                    <CardContent className="p-6">
                      <div className="flex gap-1 mb-4">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ scale: 0, rotate: -180 }}
                            whileInView={{ scale: 1, rotate: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 + i * 0.1, type: "spring", stiffness: 500 }}
                          >
                            <Star className="h-5 w-5 fill-primary text-primary" />
                          </motion.div>
                        ))}
                      </div>
                      <blockquote className="text-lg mb-6 leading-relaxed">
                        "{testimonial.quote}"
                      </blockquote>
                      <div className="flex items-center gap-4">
                        <motion.div 
                          className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold"
                          whileHover={{ scale: 1.2, rotate: 360 }}
                          transition={{ duration: 0.5 }}
                        >
                          {testimonial.avatar}
                        </motion.div>
                        <div>
                          <div className="font-semibold">{testimonial.author}</div>
                          <div className="text-sm text-muted-foreground">
                            {testimonial.role} • {testimonial.school}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <ScaleUp delay={0.1}>
              <Badge variant="outline" className="mb-4">
                <HelpCircle className="mr-2 h-4 w-4" />
                Dúvidas Frequentes
              </Badge>
            </ScaleUp>
            <SlideUp delay={0.2}>
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
                Perguntas Frequentes
              </h2>
            </SlideUp>
            <Blur delay={0.3}>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Encontre respostas para as dúvidas mais comuns sobre o i ESCOLAS
              </p>
            </Blur>
          </div>

          <FadeUp delay={0.2}>
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="w-full space-y-4">
                {faqData.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <AccordionItem 
                      value={`item-${index}`} 
                      className="bg-card border rounded-xl px-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <AccordionTrigger className="text-left text-lg font-medium hover:no-underline py-5">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
              </Accordion>
            </div>
          </FadeUp>

          <FadeUp delay={0.5}>
            <div className="text-center mt-12">
              <p className="text-muted-foreground mb-4">
                Ainda tem dúvidas?
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" size="lg" className="gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Falar com Especialista
                </Button>
              </motion.div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contato" className="py-24">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Column - Info */}
            <div>
              <ScaleUp delay={0.1}>
                <Badge variant="outline" className="mb-4">
                  <Send className="mr-2 h-4 w-4" />
                  Entre em Contato
                </Badge>
              </ScaleUp>
              <SlideUp delay={0.2}>
                <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
                  Fale com nossa equipe
                </h2>
              </SlideUp>
              <Blur delay={0.3}>
                <p className="text-xl text-muted-foreground mb-8">
                  Tire suas dúvidas, agende uma demonstração ou solicite um orçamento personalizado para sua escola.
                </p>
              </Blur>

              <FadeUp delay={0.4}>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">E-mail</h3>
                      <p className="text-muted-foreground">contato@iescolas.com.br</p>
                      <p className="text-muted-foreground">suporte@iescolas.com.br</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Telefone</h3>
                      <p className="text-muted-foreground">(11) 4000-1234</p>
                      <p className="text-muted-foreground text-sm">Seg à Sex, 8h às 18h</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Endereço</h3>
                      <p className="text-muted-foreground">Av. Paulista, 1000 - Bela Vista</p>
                      <p className="text-muted-foreground">São Paulo - SP, 01310-100</p>
                    </div>
                  </div>
                </div>
              </FadeUp>
            </div>

            {/* Right Column - Form */}
            <FadeUp delay={0.3}>
              <Card className="p-6 md:p-8 shadow-xl border-border/50">
                <ContactForm />
              </Card>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* CTA Section - Gradient Background with Enhanced Reveal */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <Elastic delay={0.1}>
              <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
                <Zap className="mr-2 h-4 w-4" />
                Comece Hoje Mesmo
              </Badge>
            </Elastic>
            
            <Reveal delay={0.2}>
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
                Pronto para transformar sua escola?
              </h2>
            </Reveal>
            
            <FadeUp delay={0.4}>
              <p className="text-xl text-muted-foreground mb-10">
                Junte-se a mais de 500 escolas que já modernizaram sua gestão. 
                Comece gratuitamente e veja os resultados.
              </p>
            </FadeUp>

            <FadeUp delay={0.5}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/login">
                  <motion.div 
                    whileHover={{ scale: 1.08, y: -4 }} 
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Button size="lg" className="w-full sm:w-auto gap-2 text-lg px-8 py-6 shadow-xl shadow-primary/30">
                      Criar Conta Grátis
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </motion.div>
                </Link>
                <motion.div 
                  whileHover={{ scale: 1.08, y: -4 }} 
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 text-lg px-8 py-6">
                    Agendar Demo
                    <ArrowUpRight className="h-5 w-5" />
                  </Button>
                </motion.div>
              </div>
            </FadeUp>

            <Blur delay={0.7}>
              <p className="mt-8 text-sm text-muted-foreground">
                ✓ Sem cartão de crédito &nbsp;&nbsp; ✓ Setup em 5 minutos &nbsp;&nbsp; ✓ Cancele quando quiser
              </p>
            </Blur>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/50 py-16">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <span className="text-xl font-bold">i ESCOLAS</span>
              </div>
              <p className="text-muted-foreground max-w-sm mb-6">
                Plataforma completa de gestão escolar para educação infantil, fundamental e médio. 
                Simplifique processos e foque na educação.
              </p>
              <div className="flex gap-4">
                {['facebook', 'instagram', 'linkedin', 'twitter'].map((social) => (
                  <a 
                    key={social}
                    href={`https://${social}.com/iescolas`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-10 w-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary/10 transition-colors"
                    aria-label={`Seguir no ${social}`}
                  >
                    <Globe className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Produto</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li><a href="#recursos" className="hover:text-foreground transition-colors">Recursos</a></li>
                <li><a href="#planos" className="hover:text-foreground transition-colors">Planos</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Integrações</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Atualizações</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Suporte</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Documentação</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Status</a></li>
                <li><a href="#contato" className="hover:text-foreground transition-colors">Contato</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} i ESCOLAS. Todos os direitos reservados.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Termos de Uso</a>
              <a href="#" className="hover:text-foreground transition-colors">Privacidade</a>
              <a href="#" className="hover:text-foreground transition-colors">LGPD</a>
            </div>
          </div>
        </div>
      </footer>

      <WhatsAppButton />
    </div>
  );
};

export default Index;
