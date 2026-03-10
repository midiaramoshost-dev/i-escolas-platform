import { useParams, Link, Navigate } from "react-router-dom";
import { getFuncionalidadeBySlug, funcionalidadesData } from "./funcionalidades-data";
import { cidadesData } from "@/pages/cidades/cidades-data";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PlatformLogo } from "@/components/PlatformLogo";
import { WhatsAppButton } from "@/components/landing/WhatsAppButton";
import { CheckCircle2, ArrowRight, MapPin, Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

const FuncionalidadeLanding = () => {
  const { slug } = useParams<{ slug: string }>();
  const { theme, toggleTheme } = useTheme();
  const data = slug ? getFuncionalidadeBySlug(slug) : undefined;

  if (!data) return <Navigate to="/" replace />;

  const baseUrl = "https://iescolas.com.br";
  const canonical = `${baseUrl}/funcionalidades/${data.slug}`;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: `i ESCOLAS - ${data.nome}`,
      description: data.descricao,
      url: canonical,
      applicationCategory: "EducationalApplication",
      operatingSystem: "Web",
      featureList: data.beneficios,
      offers: { "@type": "Offer", price: "299", priceCurrency: "BRL" },
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
      <SEOHead title={data.titulo} description={data.descricao} canonical={canonical} jsonLd={jsonLd} />

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
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{data.nome}</h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">{data.texto}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/cadastro">
              <Button size="lg" className="gap-2">Experimentar Grátis <ArrowRight className="h-4 w-4" /></Button>
            </Link>
            <Link to="/#planos">
              <Button size="lg" variant="outline">Ver Planos</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="py-16">
        <div className="container max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">Benefícios</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {data.beneficios.map((b) => (
              <div key={b} className="flex items-start gap-3 p-4 rounded-lg bg-muted/30">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <span className="font-medium">{b}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-muted/30">
        <div className="container max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-12">Perguntas Frequentes</h2>
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

      {/* Outras funcionalidades */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-2xl font-bold text-center mb-8">Outras Funcionalidades</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {funcionalidadesData.filter((f) => f.slug !== data.slug).map((f) => (
              <Link key={f.slug} to={`/funcionalidades/${f.slug}`}>
                <Card className="h-full hover:shadow-md transition-shadow hover:border-primary/30">
                  <CardContent className="pt-4 pb-4">
                    <h3 className="font-semibold text-sm">{f.nome}</h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Cidades atendidas */}
      <section className="py-12 bg-muted/30">
        <div className="container">
          <h2 className="text-xl font-semibold text-center mb-6">
            <MapPin className="inline h-5 w-5 mr-1" /> Disponível em Sorocaba e região
          </h2>
          <div className="flex flex-wrap justify-center gap-2">
            {cidadesData.map((c) => (
              <Link key={c.slug} to={`/gestao-escolar-${c.slug}`}>
                <Button variant="outline" size="sm">{c.nome}</Button>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container text-center max-w-3xl">
          <h2 className="text-3xl font-bold mb-4">Comece a usar {data.nome} hoje</h2>
          <p className="text-primary-foreground/80 mb-8">Crie sua conta gratuitamente e modernize a gestão da sua escola.</p>
          <Link to="/cadastro">
            <Button size="lg" variant="secondary" className="gap-2">Criar Conta Grátis <ArrowRight className="h-4 w-4" /></Button>
          </Link>
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

export default FuncionalidadeLanding;
