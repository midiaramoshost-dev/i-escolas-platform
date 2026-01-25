import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
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

const Index = () => {
  const { theme, toggleTheme } = useTheme();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
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

  const plans = [
    {
      name: "Free",
      price: "0",
      period: "para sempre",
      description: "Perfeito para começar",
      features: [
        { text: "Até 50 alunos", included: true },
        { text: "1 administrador", included: true },
        { text: "Diário de classe básico", included: true },
        { text: "Suporte por email", included: true },
        { text: "Portal do aluno", included: false },
        { text: "Relatórios avançados", included: false }
      ],
      highlighted: false,
      cta: "Começar Grátis"
    },
    {
      name: "Start",
      price: "299",
      period: "/mês",
      description: "Para escolas em crescimento",
      features: [
        { text: "Até 200 alunos", included: true },
        { text: "5 administradores", included: true },
        { text: "Diário completo", included: true },
        { text: "Portal do aluno", included: true },
        { text: "Relatórios básicos", included: true },
        { text: "Suporte prioritário", included: true }
      ],
      highlighted: false,
      cta: "Iniciar Trial"
    },
    {
      name: "Pro",
      price: "599",
      period: "/mês",
      description: "Para quem busca excelência",
      features: [
        { text: "Até 500 alunos", included: true },
        { text: "Usuários ilimitados", included: true },
        { text: "Todos os módulos", included: true },
        { text: "Dashboard avançado", included: true },
        { text: "API de integração", included: true },
        { text: "Suporte 24/7", included: true }
      ],
      highlighted: true,
      cta: "Escolher Pro"
    },
    {
      name: "Premium",
      price: "999",
      period: "/mês",
      description: "Para redes de escolas",
      features: [
        { text: "Alunos ilimitados", included: true },
        { text: "Multi-unidades", included: true },
        { text: "Personalização total", included: true },
        { text: "Módulo financeiro", included: true },
        { text: "Gerente dedicado", included: true },
        { text: "SLA garantido", included: true }
      ],
      highlighted: false,
      cta: "Falar com Vendas"
    }
  ];

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
              { href: "#depoimentos", label: "Depoimentos" },
              { href: "#comparativo", label: "Comparativo" }
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
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
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
              className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
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
              className="mb-10 text-xl text-muted-foreground md:text-2xl max-w-3xl mx-auto leading-relaxed"
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
                      <div className="mt-4">
                        <span className="text-sm text-muted-foreground">R$</span>
                        <span className="text-5xl font-bold">{plan.price}</span>
                        <span className="text-muted-foreground">{plan.period}</span>
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
                <li><a href="#" className="hover:text-foreground transition-colors">Contato</a></li>
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
    </div>
  );
};

export default Index;
