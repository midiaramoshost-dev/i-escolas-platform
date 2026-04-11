import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Megaphone, Building2, BarChart3, Eye, MousePointerClick, ExternalLink } from "lucide-react";

interface Anunciante {
  id: string;
  nome: string;
  descricao: string | null;
  logo_url: string | null;
  website: string | null;
  contato_nome: string | null;
  contato_email: string | null;
  contato_telefone: string | null;
  categoria: string;
  ativo: boolean;
  created_at: string;
}

interface Campanha {
  id: string;
  anunciante_id: string;
  titulo: string;
  descricao: string | null;
  imagem_url: string | null;
  link_destino: string | null;
  posicao: string;
  prioridade: number;
  cliques: number;
  impressoes: number;
  ativo: boolean;
  data_inicio: string;
  data_fim: string | null;
}

const categorias = ["geral", "livraria", "tecnologia", "uniformes", "alimentação", "transporte", "material escolar", "cursos"];

export default function AdminAnunciantes() {
  const { toast } = useToast();
  const [anunciantes, setAnunciantes] = useState<Anunciante[]>([]);
  const [campanhas, setCampanhas] = useState<Campanha[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [campanhaDialogOpen, setCampanhaDialogOpen] = useState(false);
  const [editingAnunciante, setEditingAnunciante] = useState<Anunciante | null>(null);
  const [editingCampanha, setEditingCampanha] = useState<Campanha | null>(null);

  // Form state - anunciante
  const [form, setForm] = useState({ nome: "", descricao: "", logo_url: "", website: "", contato_nome: "", contato_email: "", contato_telefone: "", categoria: "geral" });
  // Form state - campanha
  const [cForm, setCForm] = useState({ anunciante_id: "", titulo: "", descricao: "", imagem_url: "", link_destino: "", posicao: "home", prioridade: 0, data_inicio: new Date().toISOString().split("T")[0], data_fim: "" });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    const [{ data: a }, { data: c }] = await Promise.all([
      supabase.from("anunciantes").select("*").order("created_at", { ascending: false }),
      supabase.from("campanhas_anuncio").select("*").order("prioridade", { ascending: false }),
    ]);
    setAnunciantes(a || []);
    setCampanhas(c || []);
    setLoading(false);
  };

  const saveAnunciante = async () => {
    if (!form.nome) return;
    const payload = { ...form, descricao: form.descricao || null, logo_url: form.logo_url || null, website: form.website || null, contato_nome: form.contato_nome || null, contato_email: form.contato_email || null, contato_telefone: form.contato_telefone || null };
    if (editingAnunciante) {
      await supabase.from("anunciantes").update(payload).eq("id", editingAnunciante.id);
      toast({ title: "Anunciante atualizado" });
    } else {
      await supabase.from("anunciantes").insert(payload);
      toast({ title: "Anunciante cadastrado" });
    }
    setDialogOpen(false);
    setEditingAnunciante(null);
    setForm({ nome: "", descricao: "", logo_url: "", website: "", contato_nome: "", contato_email: "", contato_telefone: "", categoria: "geral" });
    fetchData();
  };

  const saveCampanha = async () => {
    if (!cForm.titulo || !cForm.anunciante_id) return;
    const payload = { ...cForm, descricao: cForm.descricao || null, imagem_url: cForm.imagem_url || null, link_destino: cForm.link_destino || null, data_fim: cForm.data_fim || null, prioridade: Number(cForm.prioridade) };
    if (editingCampanha) {
      await supabase.from("campanhas_anuncio").update(payload).eq("id", editingCampanha.id);
      toast({ title: "Campanha atualizada" });
    } else {
      await supabase.from("campanhas_anuncio").insert(payload);
      toast({ title: "Campanha criada" });
    }
    setCampanhaDialogOpen(false);
    setEditingCampanha(null);
    setCForm({ anunciante_id: "", titulo: "", descricao: "", imagem_url: "", link_destino: "", posicao: "home", prioridade: 0, data_inicio: new Date().toISOString().split("T")[0], data_fim: "" });
    fetchData();
  };

  const toggleAnunciante = async (id: string, ativo: boolean) => {
    await supabase.from("anunciantes").update({ ativo }).eq("id", id);
    fetchData();
  };

  const toggleCampanha = async (id: string, ativo: boolean) => {
    await supabase.from("campanhas_anuncio").update({ ativo }).eq("id", id);
    fetchData();
  };

  const deleteAnunciante = async (id: string) => {
    await supabase.from("anunciantes").delete().eq("id", id);
    toast({ title: "Anunciante removido" });
    fetchData();
  };

  const deleteCampanha = async (id: string) => {
    await supabase.from("campanhas_anuncio").delete().eq("id", id);
    toast({ title: "Campanha removida" });
    fetchData();
  };

  const openEditAnunciante = (a: Anunciante) => {
    setEditingAnunciante(a);
    setForm({ nome: a.nome, descricao: a.descricao || "", logo_url: a.logo_url || "", website: a.website || "", contato_nome: a.contato_nome || "", contato_email: a.contato_email || "", contato_telefone: a.contato_telefone || "", categoria: a.categoria });
    setDialogOpen(true);
  };

  const openEditCampanha = (c: Campanha) => {
    setEditingCampanha(c);
    setCForm({ anunciante_id: c.anunciante_id, titulo: c.titulo, descricao: c.descricao || "", imagem_url: c.imagem_url || "", link_destino: c.link_destino || "", posicao: c.posicao, prioridade: c.prioridade, data_inicio: c.data_inicio, data_fim: c.data_fim || "" });
    setCampanhaDialogOpen(true);
  };

  const totalCliques = campanhas.reduce((s, c) => s + c.cliques, 0);
  const totalImpressoes = campanhas.reduce((s, c) => s + c.impressoes, 0);
  const ctr = totalImpressoes > 0 ? ((totalCliques / totalImpressoes) * 100).toFixed(1) : "0";

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2"><Megaphone className="h-6 w-6" /> Anunciantes & Parceiros</h1>
          <p className="text-sm text-muted-foreground">Gerencie anunciantes, campanhas e métricas de performance.</p>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="pt-4 pb-4 text-center"><p className="text-xs text-muted-foreground">Anunciantes</p><p className="text-2xl font-semibold">{anunciantes.length}</p></CardContent></Card>
        <Card><CardContent className="pt-4 pb-4 text-center"><p className="text-xs text-muted-foreground">Campanhas Ativas</p><p className="text-2xl font-semibold">{campanhas.filter(c => c.ativo).length}</p></CardContent></Card>
        <Card><CardContent className="pt-4 pb-4 text-center"><p className="text-xs text-muted-foreground flex items-center justify-center gap-1"><Eye className="h-3 w-3" /> Impressões</p><p className="text-2xl font-semibold">{totalImpressoes.toLocaleString()}</p></CardContent></Card>
        <Card><CardContent className="pt-4 pb-4 text-center"><p className="text-xs text-muted-foreground flex items-center justify-center gap-1"><MousePointerClick className="h-3 w-3" /> CTR</p><p className="text-2xl font-semibold">{ctr}%</p></CardContent></Card>
      </div>

      <Tabs defaultValue="anunciantes">
        <TabsList>
          <TabsTrigger value="anunciantes" className="gap-1"><Building2 className="h-4 w-4" /> Anunciantes</TabsTrigger>
          <TabsTrigger value="campanhas" className="gap-1"><Megaphone className="h-4 w-4" /> Campanhas</TabsTrigger>
          <TabsTrigger value="metricas" className="gap-1"><BarChart3 className="h-4 w-4" /> Métricas</TabsTrigger>
        </TabsList>

        {/* Tab Anunciantes */}
        <TabsContent value="anunciantes" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) { setEditingAnunciante(null); setForm({ nome: "", descricao: "", logo_url: "", website: "", contato_nome: "", contato_email: "", contato_telefone: "", categoria: "geral" }); } }}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1"><Plus className="h-4 w-4" /> Novo Anunciante</Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader><DialogTitle>{editingAnunciante ? "Editar" : "Novo"} Anunciante</DialogTitle></DialogHeader>
                <div className="grid gap-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div><Label className="text-xs">Nome *</Label><Input value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} /></div>
                    <div><Label className="text-xs">Categoria</Label>
                      <Select value={form.categoria} onValueChange={v => setForm({...form, categoria: v})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>{categorias.map(c => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div><Label className="text-xs">Descrição</Label><Textarea value={form.descricao} onChange={e => setForm({...form, descricao: e.target.value})} rows={2} /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><Label className="text-xs">Logo URL</Label><Input value={form.logo_url} onChange={e => setForm({...form, logo_url: e.target.value})} /></div>
                    <div><Label className="text-xs">Website</Label><Input value={form.website} onChange={e => setForm({...form, website: e.target.value})} /></div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div><Label className="text-xs">Contato</Label><Input value={form.contato_nome} onChange={e => setForm({...form, contato_nome: e.target.value})} /></div>
                    <div><Label className="text-xs">Email</Label><Input value={form.contato_email} onChange={e => setForm({...form, contato_email: e.target.value})} /></div>
                    <div><Label className="text-xs">Telefone</Label><Input value={form.contato_telefone} onChange={e => setForm({...form, contato_telefone: e.target.value})} /></div>
                  </div>
                  <Button onClick={saveAnunciante}>{editingAnunciante ? "Salvar" : "Cadastrar"}</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {anunciantes.map(a => (
                  <TableRow key={a.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {a.logo_url ? <img src={a.logo_url} alt="" className="h-8 w-8 rounded object-cover" /> : <div className="h-8 w-8 rounded bg-muted flex items-center justify-center text-xs font-semibold">{a.nome[0]}</div>}
                        <div>
                          <p className="font-medium text-sm">{a.nome}</p>
                          {a.website && <a href={a.website} target="_blank" rel="noopener noreferrer" className="text-[10px] text-muted-foreground hover:underline flex items-center gap-0.5"><ExternalLink className="h-2.5 w-2.5" />{a.website.replace(/https?:\/\//, "").slice(0, 30)}</a>}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell><Badge variant="outline" className="capitalize text-[10px]">{a.categoria}</Badge></TableCell>
                    <TableCell className="text-xs text-muted-foreground">{a.contato_email || "—"}</TableCell>
                    <TableCell><Switch checked={a.ativo} onCheckedChange={v => toggleAnunciante(a.id, v)} /></TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditAnunciante(a)}><Pencil className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteAnunciante(a.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
                {anunciantes.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Nenhum anunciante cadastrado.</TableCell></TableRow>}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* Tab Campanhas */}
        <TabsContent value="campanhas" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={campanhaDialogOpen} onOpenChange={(o) => { setCampanhaDialogOpen(o); if (!o) { setEditingCampanha(null); setCForm({ anunciante_id: "", titulo: "", descricao: "", imagem_url: "", link_destino: "", posicao: "home", prioridade: 0, data_inicio: new Date().toISOString().split("T")[0], data_fim: "" }); } }}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1" disabled={anunciantes.length === 0}><Plus className="h-4 w-4" /> Nova Campanha</Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader><DialogTitle>{editingCampanha ? "Editar" : "Nova"} Campanha</DialogTitle></DialogHeader>
                <div className="grid gap-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div><Label className="text-xs">Anunciante *</Label>
                      <Select value={cForm.anunciante_id} onValueChange={v => setCForm({...cForm, anunciante_id: v})}>
                        <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                        <SelectContent>{anunciantes.map(a => <SelectItem key={a.id} value={a.id}>{a.nome}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div><Label className="text-xs">Título *</Label><Input value={cForm.titulo} onChange={e => setCForm({...cForm, titulo: e.target.value})} /></div>
                  </div>
                  <div><Label className="text-xs">Descrição</Label><Textarea value={cForm.descricao} onChange={e => setCForm({...cForm, descricao: e.target.value})} rows={2} /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><Label className="text-xs">Imagem URL</Label><Input value={cForm.imagem_url} onChange={e => setCForm({...cForm, imagem_url: e.target.value})} /></div>
                    <div><Label className="text-xs">Link Destino</Label><Input value={cForm.link_destino} onChange={e => setCForm({...cForm, link_destino: e.target.value})} /></div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div><Label className="text-xs">Posição</Label>
                      <Select value={cForm.posicao} onValueChange={v => setCForm({...cForm, posicao: v})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="home">Home</SelectItem>
                          <SelectItem value="dashboard">Dashboard</SelectItem>
                          <SelectItem value="parceiros">Parceiros</SelectItem>
                          <SelectItem value="sidebar">Sidebar</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div><Label className="text-xs">Início</Label><Input type="date" value={cForm.data_inicio} onChange={e => setCForm({...cForm, data_inicio: e.target.value})} /></div>
                    <div><Label className="text-xs">Fim</Label><Input type="date" value={cForm.data_fim} onChange={e => setCForm({...cForm, data_fim: e.target.value})} /></div>
                  </div>
                  <div><Label className="text-xs">Prioridade</Label><Input type="number" value={cForm.prioridade} onChange={e => setCForm({...cForm, prioridade: Number(e.target.value)})} /></div>
                  <Button onClick={saveCampanha}>{editingCampanha ? "Salvar" : "Criar"}</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campanha</TableHead>
                  <TableHead>Anunciante</TableHead>
                  <TableHead>Posição</TableHead>
                  <TableHead>Impressões</TableHead>
                  <TableHead>Cliques</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campanhas.map(c => {
                  const anunc = anunciantes.find(a => a.id === c.anunciante_id);
                  return (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium text-sm">{c.titulo}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{anunc?.nome || "—"}</TableCell>
                      <TableCell><Badge variant="outline" className="text-[10px]">{c.posicao}</Badge></TableCell>
                      <TableCell className="text-xs">{c.impressoes.toLocaleString()}</TableCell>
                      <TableCell className="text-xs">{c.cliques.toLocaleString()}</TableCell>
                      <TableCell><Switch checked={c.ativo} onCheckedChange={v => toggleCampanha(c.id, v)} /></TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditCampanha(c)}><Pencil className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteCampanha(c.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {campanhas.length === 0 && <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">Nenhuma campanha cadastrada.</TableCell></TableRow>}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* Tab Métricas */}
        <TabsContent value="metricas" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {campanhas.filter(c => c.ativo).map(c => {
              const anunc = anunciantes.find(a => a.id === c.anunciante_id);
              const campCtr = c.impressoes > 0 ? ((c.cliques / c.impressoes) * 100).toFixed(1) : "0";
              return (
                <Card key={c.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">{c.titulo}</CardTitle>
                    <CardDescription className="text-xs">{anunc?.nome} • {c.posicao}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div><p className="text-lg font-semibold">{c.impressoes.toLocaleString()}</p><p className="text-[10px] text-muted-foreground">Impressões</p></div>
                      <div><p className="text-lg font-semibold">{c.cliques.toLocaleString()}</p><p className="text-[10px] text-muted-foreground">Cliques</p></div>
                      <div><p className="text-lg font-semibold">{campCtr}%</p><p className="text-[10px] text-muted-foreground">CTR</p></div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            {campanhas.filter(c => c.ativo).length === 0 && (
              <Card className="col-span-2"><CardContent className="py-8 text-center text-muted-foreground">Nenhuma campanha ativa para exibir métricas.</CardContent></Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}