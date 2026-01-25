import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Gift,
  Users,
  Award,
  ArrowRight,
  CheckCircle,
  HelpCircle,
  Trophy,
  Medal,
  Star,
  School,
  ArrowLeft,
  Moon,
  Sun,
  Share2,
  Clock,
  Zap,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/contexts/AuthContext";
import { ReferralCard } from "@/components/referral/ReferralCard";
import {
  ScrollReveal,
  FadeUp,
  FadeLeft,
  FadeRight,
  ScaleUp,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/ScrollReveal";

const steps = [
  {
    icon: Share2,
    title: "Compartilhe seu código",
    description: "Copie seu código exclusivo ou link de indicação e envie para escolas, educadores e amigos do setor educacional.",
  },
  {
    icon: Users,
    title: "Eles se cadastram",
    description: "Quando usarem seu código no cadastro, a indicação é automaticamente vinculada à sua conta.",
  },
  {
    icon: Zap,
    title: "Indicação é validada",
    description: "Assim que o indicado ativa a conta e começa a usar a plataforma, sua indicação é confirmada.",
  },
  {
    icon: Gift,
    title: "Ganhe 1 mês grátis",
    description: "Para cada indicação convertida, você ganha 30 dias gratuitos do seu plano atual. Sem limite!",
  },
];

const rules = [
  {
    icon: CheckCircle,
    title: "Sem limite de indicações",
    description: "Indique quantas escolas quiser. Cada conversão = 1 mês grátis.",
  },
  {
    icon: Clock,
    title: "Recompensas não expiram",
    description: "Seus meses gratuitos acumulados nunca vencem e são aplicados automaticamente.",
  },
  {
    icon: Shield,
    title: "Código único e permanente",
    description: "Seu código de indicação é exclusivo e nunca muda, facilitando o compartilhamento.",
  },
  {
    icon: Award,
    title: "Bônus para indicados",
    description: "Quem usa um código de indicação também pode receber benefícios especiais.",
  },
];

const faqData = [
  {
    question: "Como funciona o programa Indique e Ganhe?",
    answer: "É simples: você compartilha seu código de indicação exclusivo com outras escolas. Quando elas se cadastram usando seu código e ativam a conta, você ganha 1 mês grátis do seu plano atual. Não há limite de indicações!",
  },
  {
    question: "Onde encontro meu código de indicação?",
    answer: "Seu código está disponível no seu dashboard após fazer login. Você também pode copiar o link de indicação direto, que já inclui seu código automaticamente.",
  },
  {
    question: "Quando recebo minha recompensa?",
    answer: "A recompensa é creditada automaticamente assim que o indicado completa o cadastro e ativa a conta na plataforma. O mês gratuito é aplicado na sua próxima renovação.",
  },
  {
    question: "Posso indicar qualquer pessoa?",
    answer: "O programa é voltado para indicações de novas escolas e instituições de ensino. Indicações de pessoas físicas sem vínculo com instituições educacionais podem não ser elegíveis.",
  },
  {
    question: "Meus meses gratuitos acumulados expiram?",
    answer: "Não! Suas recompensas nunca expiram. Você pode acumular quantos meses quiser e eles serão aplicados sequencialmente nas suas renovações.",
  },
  {
    question: "Posso usar meu próprio código de indicação?",
    answer: "Não, o código de indicação não pode ser usado pela própria conta que o gerou. Ele é exclusivo para novos cadastros.",
  },
  {
    question: "E se o indicado cancelar a conta?",
    answer: "Sua recompensa já creditada permanece válida. Não há estorno de meses gratuitos já concedidos.",
  },
  {
    question: "Como acompanho minhas indicações?",
    answer: "No seu dashboard, o card 'Indique e Ganhe' mostra todas as suas indicações, status (pendente/convertido), e quantos meses gratuitos você acumulou.",
  },
];

// Mock ranking data
const mockRanking = [
  { position: 1, name: "Colégio São Paulo", referrals: 47, city: "São Paulo, SP" },
  { position: 2, name: "Instituto Educacional ABC", referrals: 38, city: "Belo Horizonte, MG" },
  { position: 3, name: "Escola Nova Era", referrals: 31, city: "Rio de Janeiro, RJ" },
  { position: 4, name: "Centro Educacional Vida", referrals: 28, city: "Fortaleza, CE" },
  { position: 5, name: "Colégio Progresso", referrals: 24, city: "Curitiba, PR" },
  { position: 6, name: "Escola Futuro Brilhante", referrals: 21, city: "Salvador, BA" },
  { position: 7, name: "Instituto Saber", referrals: 19, city: "Recife, PE" },
  { position: 8, name: "Colégio Integração", referrals: 17, city: "Brasília, DF" },
  { position: 9, name: "Escola Criativa", referrals: 15, city: "Porto Alegre, RS" },
  { position: 10, name: "Colégio Excelência", referrals: 12, city: "Manaus, AM" },
];

const getPositionIcon = (position: number) => {
  switch (position) {
    case 1:
      return <Trophy className="h-6 w-6 text-yellow-500" />;
    case 2:
      return <Medal className="h-6 w-6 text-gray-400" />;
    case 3:
      return <Medal className="h-6 w-6 text-amber-600" />;
    default:
      return <span className="text-lg font-bold text-muted-foreground">{position}º</span>;
  }
};

export default function Indicacao() {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <School className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">i ESCOLAS</span>
          </Link>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {isAuthenticated ? (
              <Button asChild>
                <Link to="/escola/dashboard">Meu Dashboard</Link>
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" asChild>
                  <Link to="/login">Entrar</Link>
                </Button>
                <Button asChild>
                  <Link to="/cadastro">Criar conta</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
          <div className="container relative">
            <div className="max-w-4xl mx-auto text-center">
              <FadeUp>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
                  <Gift className="h-4 w-4" />
                  <span className="text-sm font-medium">Programa de Indicação</span>
                </div>
              </FadeUp>

              <FadeUp delay={0.1}>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  Indique e Ganhe{" "}
                  <span className="text-primary">1 Mês Grátis</span>
                </h1>
              </FadeUp>

              <FadeUp delay={0.2}>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Convide outras escolas para conhecer o i ESCOLAS e ganhe meses gratuitos 
                  de plano para cada indicação que se converter em cliente.
                </p>
              </FadeUp>

              <FadeUp delay={0.3}>
                <div className="flex flex-wrap justify-center gap-4">
                  {isAuthenticated ? (
                    <Button size="lg" asChild>
                      <Link to="/escola/dashboard">
                        Ver meu código
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  ) : (
                    <>
                      <Button size="lg" asChild>
                        <Link to="/cadastro">
                          Criar conta e começar
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                      <Button size="lg" variant="outline" asChild>
                        <Link to="/login">
                          Já tenho conta
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              </FadeUp>

              {/* Stats */}
              <FadeUp delay={0.4}>
                <div className="flex flex-wrap justify-center gap-8 mt-12 pt-8 border-t">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-primary">R$ 0</p>
                    <p className="text-sm text-muted-foreground">Custo para participar</p>
                  </div>
                  <div className="w-px bg-border hidden md:block" />
                  <div className="text-center">
                    <p className="text-4xl font-bold text-primary">∞</p>
                    <p className="text-sm text-muted-foreground">Indicações ilimitadas</p>
                  </div>
                  <div className="w-px bg-border hidden md:block" />
                  <div className="text-center">
                    <p className="text-4xl font-bold text-primary">30 dias</p>
                    <p className="text-sm text-muted-foreground">Por indicação convertida</p>
                  </div>
                </div>
              </FadeUp>
            </div>
          </div>
        </section>

        {/* Referral Card for logged users */}
        {isAuthenticated && (
          <section className="py-12 bg-muted/30">
            <div className="container">
              <div className="max-w-md mx-auto">
                <ReferralCard />
              </div>
            </div>
          </section>
        )}

        {/* How it works */}
        <section className="py-20">
          <div className="container">
            <FadeUp>
              <div className="text-center mb-12">
                <Badge variant="outline" className="mb-4">Como funciona</Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Simples assim
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Em apenas 4 passos você já está ganhando meses grátis
                </p>
              </div>
            </FadeUp>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((step, index) => (
                <ScaleUp key={step.title} delay={index * 0.1}>
                  <Card className="relative h-full text-center hover:shadow-lg transition-shadow">
                    <CardContent className="pt-8 pb-6">
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                          {index + 1}
                        </span>
                      </div>
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <step.icon className="h-7 w-7 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </CardContent>
                  </Card>
                </ScaleUp>
              ))}
            </div>
          </div>
        </section>

        {/* Rules */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <FadeLeft>
                <div>
                  <Badge variant="outline" className="mb-4">Regras do Programa</Badge>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Transparência total
                  </h2>
                  <p className="text-muted-foreground mb-8">
                    Sem pegadinhas, sem letras miúdas. Veja como nosso programa funciona.
                  </p>

                  <div className="space-y-4">
                    {rules.map((rule, index) => (
                      <motion.div
                        key={rule.title}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="flex gap-4 p-4 rounded-lg bg-card border"
                      >
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <rule.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">{rule.title}</h3>
                          <p className="text-sm text-muted-foreground">{rule.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </FadeLeft>

              <FadeRight>
                <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground overflow-hidden">
                  <CardContent className="p-8 relative">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
                    
                    <div className="relative z-10">
                      <Gift className="h-12 w-12 mb-6 opacity-90" />
                      <h3 className="text-2xl font-bold mb-4">
                        Comece a indicar agora!
                      </h3>
                      <p className="text-primary-foreground/90 mb-6">
                        Crie sua conta gratuita e receba seu código de indicação exclusivo 
                        para começar a acumular meses grátis.
                      </p>
                      <Button 
                        size="lg" 
                        variant="secondary"
                        asChild
                      >
                        <Link to={isAuthenticated ? "/escola/dashboard" : "/cadastro"}>
                          {isAuthenticated ? "Ir para o Dashboard" : "Criar conta grátis"}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </FadeRight>
            </div>
          </div>
        </section>

        {/* Ranking */}
        <section className="py-20">
          <div className="container">
            <FadeUp>
              <div className="text-center mb-12">
                <Badge variant="outline" className="mb-4">
                  <Trophy className="h-3 w-3 mr-1" />
                  Ranking
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Top Indicadores
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Conheça as escolas que mais indicam e acumulam meses grátis
                </p>
              </div>
            </FadeUp>

            <div className="max-w-3xl mx-auto">
              <Card>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {mockRanking.map((item, index) => (
                      <motion.div
                        key={item.position}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                        className={`flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors ${
                          item.position <= 3 ? "bg-muted/30" : ""
                        }`}
                      >
                        <div className="w-10 flex items-center justify-center">
                          {getPositionIcon(item.position)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.city}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary">{item.referrals}</p>
                          <p className="text-xs text-muted-foreground">indicações</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <FadeUp delay={0.3}>
                <p className="text-center text-sm text-muted-foreground mt-6">
                  <Star className="inline h-4 w-4 mr-1 text-yellow-500" />
                  Ranking atualizado mensalmente. Sua escola pode estar aqui!
                </p>
              </FadeUp>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <FadeUp>
              <div className="text-center mb-12">
                <Badge variant="outline" className="mb-4">
                  <HelpCircle className="h-3 w-3 mr-1" />
                  FAQ
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Perguntas Frequentes
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Tire suas dúvidas sobre o programa de indicação
                </p>
              </div>
            </FadeUp>

            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="space-y-4">
                {faqData.map((item, index) => (
                  <ScaleUp key={index} delay={index * 0.05}>
                    <AccordionItem
                      value={`item-${index}`}
                      className="bg-card border rounded-lg px-6 data-[state=open]:shadow-md transition-shadow"
                    >
                      <AccordionTrigger className="text-left hover:no-underline py-4">
                        <span className="font-medium">{item.question}</span>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-4">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  </ScaleUp>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-20">
          <div className="container">
            <FadeUp>
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Pronto para começar a ganhar?
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Crie sua conta agora e receba seu código de indicação exclusivo
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  {isAuthenticated ? (
                    <Button size="lg" asChild>
                      <Link to="/escola/dashboard">
                        Ir para o Dashboard
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  ) : (
                    <Button size="lg" asChild>
                      <Link to="/cadastro">
                        Criar conta grátis
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                  <Button size="lg" variant="outline" asChild>
                    <Link to="/">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Voltar para o início
                    </Link>
                  </Button>
                </div>
              </div>
            </FadeUp>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <School className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-semibold">i ESCOLAS</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} i ESCOLAS. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
