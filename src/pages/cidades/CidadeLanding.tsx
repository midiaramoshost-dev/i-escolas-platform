import { useParams, Link, Navigate } from "react-router-dom";
import { getCidadeBySlug, cidadesData } from "./cidades-data";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PlatformLogo } from "@/components/PlatformLogo";
import { WhatsAppButton } from "@/components/landing/WhatsAppButton";
import { funcionalidadesData } from "@/pages/funcionalidades/funcionalidades-data";
import {
  MapPin, CheckCircle2, ArrowRight, GraduationCap, BookOpen,
  CreditCard, Users, MessageSquare, FileText, Moon, Sun, Globe
} from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

const CidadeLanding = () => {
  const { cidade } = useParams<{ cidade: string }>();
  const { theme, toggleTheme } = useTheme();
  const data = cidade ? getCidadeBySlug(cidade) : undefined;

  if (!data) return <Navigate to="/" replace />;

  const baseUrl = "https://iescolas.com.br";
  const canonical = `${baseUrl}/gestao-escolar-${data.slug}`;
  const title = `Gestão Escolar em ${data.nome} | i ESCOLAS - Sistema para Escolas`;
  const description = data.descricao;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: `i ESCOLAS - Gestão Escolar ${data.nome}`,
      description,
      url: canonical,
      areaServed: { "@type": "City", name: data.nome },
      address: { "@type": "PostalAddress", addressLocality: data.nome, addressRegion: "SP", addressCountry: "BR" },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: data.faq.map((f) => ({
        "@type": "Question",
        name: f.pergunta,
        acceptedAnswer: { "@type": "Answer", text: f.resposta },
      })),
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead title={title} description={description} canonical={canonical} jsonLd={jsonLd} />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/"><PlatformLogo size="md" /></Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Link to="/login"><Button variant="outline" size="sm">Entrar</Button></Link>
            <Link to="/cadastro"><Button size="sm">Começar Grátis</Button></Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <MapPin className="h-4 w-4" /> {data.nome} e Região
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Gestão Escolar em <span className="text-primary">{data.nome}</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">{data.texto}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/cadastro">
              <Button size="lg" className="gap-2">Começar Agora <ArrowRight className="h-4 w-4" /></Button>
            </Link>
            <Link to="/#planos">
              <Button size="lg" variant="outline">Ver Planos</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Funcionalidades */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-4">Funcionalidades para Escolas de {data.nome}</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Conheça os módulos do i ESCOLAS disponíveis para sua escola
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {funcionalidadesData.map((f) => (
              <Link key={f.slug} to={`/funcionalidades/${f.slug}`}>
                <Card className="h-full hover:shadow-lg transition-shadow hover:border-primary/30">
                  <CardContent className="pt-6">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <GraduationCap className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{f.nome}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{f.descricao}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="py-16 bg-muted/30">
        <div className="container max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">Por que escolher o i ESCOLAS em {data.nome}?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              "Suporte local para Sorocaba e região",
              "Implementação e treinamento personalizado",
              "Planos acessíveis para todos os portes",
              "Plataforma 100% online e responsiva",
              "Dados seguros na nuvem com backup",
              "Atualizações constantes sem custo adicional",
            ].map((b) => (
              <div key={b} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <span>{b}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="container max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-12">Perguntas Frequentes — {data.nome}</h2>
          <Accordion type="single" collapsible className="w-full">
            {data.faq.map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger>{f.pergunta}</AccordionTrigger>
                <AccordionContent>{f.resposta}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container text-center max-w-3xl">
          <h2 className="text-3xl font-bold mb-4">Pronto para modernizar sua escola em {data.nome}?</h2>
          <p className="text-primary-foreground/80 mb-8">Comece gratuitamente e descubra como o i ESCOLAS pode transformar a gestão da sua instituição.</p>
          <Link to="/cadastro">
            <Button size="lg" variant="secondary" className="gap-2">Criar Conta Grátis <ArrowRight className="h-4 w-4" /></Button>
          </Link>
        </div>
      </section>

      {/* Cidades */}
      <section className="py-12 bg-muted/30">
        <div className="container">
          <h2 className="text-xl font-semibold text-center mb-6">Atendemos também:</h2>
          <div className="flex flex-wrap justify-center gap-2">
            {cidadesData.filter((c) => c.slug !== data.slug).map((c) => (
              <Link key={c.slug} to={`/gestao-escolar-${c.slug}`}>
                <Button variant="outline" size="sm">{c.nome}</Button>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/50 py-8">
        <div className="container text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} i ESCOLAS. Todos os direitos reservados. | Feito por Midia Ramos
          </p>
        </div>
      </footer>

      <WhatsAppButton />
    </div>
  );
};

export default CidadeLanding;
