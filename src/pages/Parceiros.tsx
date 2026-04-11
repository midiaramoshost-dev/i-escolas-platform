import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { PlatformLogo } from "@/components/PlatformLogo";
import { WhatsAppButton } from "@/components/landing/WhatsAppButton";
import { SEOHead } from "@/components/SEOHead";
import { useTheme } from "@/hooks/useTheme";
import { ExternalLink, Moon, Sun, ArrowRight, Handshake } from "lucide-react";

interface Anunciante {
  id: string;
  nome: string;
  descricao: string | null;
  logo_url: string | null;
  website: string | null;
  categoria: string;
}

interface Campanha {
  id: string;
  anunciante_id: string;
  titulo: string;
  descricao: string | null;
  imagem_url: string | null;
  link_destino: string | null;
  posicao: string;
}

export default function Parceiros() {
  const { theme, toggleTheme } = useTheme();
  const [anunciantes, setAnunciantes] = useState<Anunciante[]>([]);
  const [campanhas, setCampanhas] = useState<Campanha[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const [{ data: a }, { data: c }] = await Promise.all([
        supabase.from("anunciantes").select("id,nome,descricao,logo_url,website,categoria").eq("ativo", true),
        supabase.from("campanhas_anuncio").select("id,anunciante_id,titulo,descricao,imagem_url,link_destino,posicao").eq("ativo", true),
      ]);
      setAnunciantes(a || []);
      setCampanhas(c || []);
    };
    fetch();
  }, []);

  const trackClick = async (campanhaId: string) => {
    await supabase.rpc("increment_campanha_cliques" as any, { campanha_id: campanhaId });
  };

  const parceirosCampanhas = campanhas.filter(c => c.posicao === "parceiros" || c.posicao === "home");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead title="Parceiros — i ESCOLAS" description="Conheça nossos parceiros e anunciantes que fazem parte do ecossistema i ESCOLAS." canonical="https://iescolas.com.br/parceiros" />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/30 bg-background/80 backdrop-blur-2xl">
        <div className="container flex h-14 items-center justify-between">
          <Link to="/"><PlatformLogo size="md" /></Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Link to="/login"><Button variant="ghost" size="sm">Entrar</Button></Link>
            <Link to="/login"><Button size="sm" className="gap-1.5 bg-foreground text-background hover:bg-foreground/90 rounded-full">Começar Agora</Button></Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,hsl(var(--muted)),transparent)]" />
        <div className="container relative text-center max-w-2xl">
          <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full border border-border/50 bg-card text-xs text-muted-foreground">
            <Handshake className="h-3.5 w-3.5" /> Ecossistema de Parceiros
          </div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl mb-4">Nossos Parceiros</h1>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            Empresas que acreditam na educação e fazem parte do ecossistema i ESCOLAS, oferecendo soluções e benefícios para escolas e famílias.
          </p>
        </div>
      </section>

      {/* Campanhas em destaque */}
      {parceirosCampanhas.length > 0 && (
        <section className="py-12 border-t border-border/40">
          <div className="container">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-6">Em Destaque</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {parceirosCampanhas.map(c => {
                const anunc = anunciantes.find(a => a.id === c.anunciante_id);
                return (
                  <a key={c.id} href={c.link_destino || "#"} target="_blank" rel="noopener noreferrer" onClick={() => trackClick(c.id)}>
                    <Card className="h-full overflow-hidden border-border/40 hover:shadow-md transition-all hover:-translate-y-0.5 group">
                      {c.imagem_url && (
                        <div className="h-36 bg-muted overflow-hidden">
                          <img src={c.imagem_url} alt={c.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        </div>
                      )}
                      <CardContent className="p-4">
                        <p className="font-semibold text-sm mb-1">{c.titulo}</p>
                        {c.descricao && <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{c.descricao}</p>}
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-muted-foreground">{anunc?.nome}</span>
                          <ExternalLink className="h-3 w-3 text-muted-foreground" />
                        </div>
                      </CardContent>
                    </Card>
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Lista de Anunciantes */}
      <section className="py-12 border-t border-border/40">
        <div className="container">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-6">Parceiros</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {anunciantes.map(a => (
              <Card key={a.id} className="border-border/40 hover:shadow-md transition-all">
                <CardContent className="p-4 flex items-start gap-3">
                  {a.logo_url ? (
                    <img src={a.logo_url} alt={a.nome} className="h-10 w-10 rounded-md object-cover shrink-0" />
                  ) : (
                    <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center text-sm font-semibold text-foreground/70 shrink-0">{a.nome[0]}</div>
                  )}
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate">{a.nome}</p>
                    <Badge variant="outline" className="text-[9px] capitalize mt-0.5">{a.categoria}</Badge>
                    {a.descricao && <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">{a.descricao}</p>}
                    {a.website && (
                      <a href={a.website} target="_blank" rel="noopener noreferrer" className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-0.5 mt-1">
                        <ExternalLink className="h-2.5 w-2.5" /> Visitar site
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
            {anunciantes.length === 0 && (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                <Handshake className="h-8 w-8 mx-auto mb-3 text-muted-foreground/50" />
                <p className="text-sm">Nenhum parceiro cadastrado ainda.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border/40 py-16">
        <div className="container text-center max-w-xl">
          <h2 className="text-xl font-semibold mb-3">Quer ser um parceiro?</h2>
          <p className="text-sm text-muted-foreground mb-6">Entre em contato e faça parte do ecossistema i ESCOLAS.</p>
          <Link to="/login">
            <Button className="gap-2 bg-foreground text-background hover:bg-foreground/90 rounded-full">
              Fale Conosco <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8">
        <div className="container text-center">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} i ESCOLAS. Todos os direitos reservados. | Feito por Midia Ramos</p>
        </div>
      </footer>

      <WhatsAppButton />
    </div>
  );
}