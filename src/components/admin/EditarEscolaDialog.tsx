import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

export interface Escola {
  id: string;
  nome: string;
  cnpj: string;
  cidade: string;
  uf: string;
  porte: string;
  plano: string;
  alunos: number;
  professores: number;
  status: string;
  datacadastro: string;
  linkAcesso?: string;
  modulos?: string[];

  // Logo (URL)
  logoUrl?: string;

  // Auth user ID (from escolas.user_id)
  userId?: string;

  // Credenciais (para o painel ADM Master conseguir ajustar)
  emailDiretor?: string;
  novaSenha?: string;
}

interface EditarEscolaDialogProps {
  escola: Escola | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (escola: Escola) => void;
  destacarPlano?: boolean;
}

const UF_OPTIONS = ["SP", "RJ", "MG", "PR", "BA", "CE", "AM", "RS", "SC", "PE", "GO", "DF"];
const PORTE_OPTIONS = ["Pequeno", "Médio", "Grande"];
const PLANO_OPTIONS = ["Free", "Start", "Pro", "Premium"];
const STATUS_OPTIONS = ["ativo", "trial", "inativo"];

const MODULOS_OPTIONS = [
  // Acadêmico
  { id: "diario_classe", label: "Diário de Classe", categoria: "Acadêmico" },
  { id: "notas", label: "Gestão de Notas", categoria: "Acadêmico" },
  { id: "frequencia", label: "Controle de Frequência", categoria: "Acadêmico" },
  { id: "boletins", label: "Boletins Automáticos", categoria: "Acadêmico", planoMinimo: "Start" },
  { id: "matriculas", label: "Gestão de Matrículas", categoria: "Acadêmico", planoMinimo: "Pro" },
  { id: "maternal", label: "Maternal", categoria: "Acadêmico", planoMinimo: "Start" },
  { id: "nutricao", label: "Nutrição e Alimentação", categoria: "Acadêmico", planoMinimo: "Start" },
  // Financeiro
  { id: "mensalidades", label: "Gestão de Mensalidades", categoria: "Financeiro", planoMinimo: "Start" },
  { id: "inadimplencia", label: "Gestão de Inadimplência", categoria: "Financeiro", planoMinimo: "Pro" },
  { id: "relatorios_financeiros", label: "Relatórios Financeiros", categoria: "Financeiro", planoMinimo: "Pro" },
  { id: "folha_pagamento", label: "Folha de Pagamento", categoria: "Financeiro", planoMinimo: "Pro" },
  // Comunicação
  { id: "comunicados", label: "Central de Comunicados", categoria: "Comunicação" },
  { id: "notificacoes_push", label: "Notificações Push", categoria: "Comunicação", planoMinimo: "Pro" },
  { id: "chat_escola", label: "Chat Escola-Família", categoria: "Comunicação", planoMinimo: "Premium" },
  // Administrativo
  { id: "gestao_turmas", label: "Gestão de Turmas", categoria: "Administrativo" },
  { id: "gestao_professores", label: "Gestão de Professores", categoria: "Administrativo" },
  { id: "configuracoes_escola", label: "Configurações da Escola", categoria: "Administrativo" },
  { id: "biblioteca", label: "Biblioteca", categoria: "Administrativo" },
  // Portais
  { id: "portal_aluno", label: "Portal do Aluno", categoria: "Portais", planoMinimo: "Start" },
  { id: "portal_responsavel", label: "Portal do Responsável", categoria: "Portais", planoMinimo: "Start" },
  // Avançado
  { id: "api_integracao", label: "API de Integração", categoria: "Avançado", planoMinimo: "Premium" },
  { id: "sso", label: "Single Sign-On (SSO)", categoria: "Avançado", planoMinimo: "Premium" },
  // Migração
  { id: "importacao", label: "Importação (Migração)", categoria: "Migração" },
];

type ImportMode = "cadastro" | "historico";

export function EditarEscolaDialog({ escola, open, onOpenChange, onSave, destacarPlano }: EditarEscolaDialogProps) {
  const [formData, setFormData] = useState<Escola | null>(null);
  const [planoDestacado, setPlanoDestacado] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Importação (UI mínima)
  const [importMode, setImportMode] = useState<ImportMode>("cadastro");
  const [importFile, setImportFile] = useState<File | null>(null);
  const [legacySql, setLegacySql] = useState<string>("");

  useEffect(() => {
    if (destacarPlano && open) {
      setPlanoDestacado(true);
      // Remover destaque após 3 segundos
      const timer = setTimeout(() => setPlanoDestacado(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [destacarPlano, open]);

  useEffect(() => {
    if (escola) {
      setFormData({
        ...escola,
        modulos: escola.modulos || [],
        emailDiretor: escola.emailDiretor || "",
        novaSenha: "",
        logoUrl: escola.logoUrl || "",
      });
    }
  }, [escola]);

  useEffect(() => {
    // Reset de importação quando abrir/fechar para evitar reuso indevido
    if (!open) {
      setImportMode("cadastro");
      setImportFile(null);
      setLegacySql("");
    }
  }, [open]);

  const toggleModulo = (id: string) => {
    if (!formData) return;
    const current = new Set(formData.modulos || []);
    if (current.has(id)) current.delete(id);
    else current.add(id);
    setFormData({ ...formData, modulos: Array.from(current) });
  };

  const handleSave = async () => {
    if (!formData) return;

    // Validation
    if (!formData.nome.trim()) {
      toast.error("O nome da escola é obrigatório");
      return;
    }
    if (!formData.cnpj.trim()) {
      toast.error("O CNPJ é obrigatório");
      return;
    }
    if (!formData.cidade.trim()) {
      toast.error("A cidade é obrigatória");
      return;
    }

    // Regras simples de credenciais
    const emailChanged = (formData.emailDiretor || "").trim() !== (escola?.emailDiretor || "").trim();
    const passwordProvided = !!(formData.novaSenha || "").trim();

    if (emailChanged && !(formData.emailDiretor || "").trim()) {
      toast.error("Informe o e-mail (login) da instituição");
      return;
    }

    if (passwordProvided && (formData.novaSenha || "").trim().length < 6) {
      toast.error("A nova senha deve ter no mínimo 6 caracteres");
      return;
    }

    setIsSaving(true);
    try {
      // Se o ADM master alterou e-mail e/ou senha, chamamos a edge function.
      // Importante: o userId aqui é o ID do usuário no Auth (no app, a escola.id está sendo usado como esse ID).
      if (emailChanged || passwordProvided) {
        const authUserId = formData.userId || formData.id;
        const { data: fnData, error: fnError } = await supabase.functions.invoke("update-school-credentials", {
          body: {
            userId: authUserId,
            email: emailChanged ? (formData.emailDiretor || "").trim() : undefined,
            password: passwordProvided ? (formData.novaSenha || "").trim() : undefined,
          },
        });

        if (fnError) {
          console.error("Edge function error:", fnError);
          toast.error("Erro ao atualizar credenciais. Tente novamente.");
          return;
        }

        if (fnData?.error) {
          toast.error(fnData.error);
          return;
        }

        toast.success("Credenciais atualizadas com sucesso!");
      }

      onSave({ ...formData, novaSenha: "" });
      toast.success("Escola atualizada com sucesso!");
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving school:", error);
      toast.error("Erro inesperado ao salvar. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleImport = async () => {
    if (!formData) return;

    const hasFile = !!importFile;
    const hasSql = !!legacySql.trim();

    if (!hasFile && !hasSql) {
      toast.error("Envie um arquivo (CSV/Excel) ou cole um SQL para importação.");
      return;
    }

    // Mudança mínima: UI + validações + orientação.
    // A execução real (parse de XLSX/CSV e processamento SQL) deve ser feita via Edge Function/Backend.
    const fileInfo = hasFile ? `${importFile!.name} (${Math.round(importFile!.size / 1024)} KB)` : "sem arquivo";
    toast.success(
      `Importação preparada (${importMode}). Arquivo: ${fileInfo}. SQL: ${hasSql ? "informado" : "não"}.`
    );

    toast.message("Próximo passo", {
      description:
        "Conecte uma Edge Function para receber o arquivo/SQL e gravar em tabelas de staging. Este commit adiciona a UI e a base de schema (staging + jobs).",
    });
  };

  if (!formData) return null;

  const importacaoAtiva = (formData.modulos || []).includes("importacao");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] !grid grid-rows-[auto_1fr_auto] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle>Editar Escola</DialogTitle>
          <DialogDescription>
            Atualize os dados da escola. Clique em salvar quando terminar.
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto px-6">
        <div className="grid gap-4 py-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome da Escola</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Ex: Colégio São Paulo"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cnpj">CNPJ</Label>
              <Input
                id="cnpj"
                value={formData.cnpj}
                onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                placeholder="00.000.000/0001-00"
              />
            </div>
          </div>

          {/* Logo */}
          <div className="space-y-2">
            <Label htmlFor="logoUrl">Logo da escola (URL)</Label>
            <Input
              id="logoUrl"
              value={formData.logoUrl || ""}
              onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
              placeholder="https://.../logo.png"
            />
            {(formData.logoUrl || "").trim() ? (
              <div className="flex items-center gap-3 rounded-md border bg-muted/20 p-3">
                <img
                  src={formData.logoUrl}
                  alt={`Logo ${formData.nome}`}
                  className="h-12 w-12 rounded-md object-contain bg-background border"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
                <p className="text-xs text-muted-foreground break-all">{formData.logoUrl}</p>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">Opcional: cole uma URL pública da imagem (PNG/JPG/SVG).</p>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="cidade">Cidade</Label>
              <Input
                id="cidade"
                value={formData.cidade}
                onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                placeholder="São Paulo"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="uf">UF</Label>
              <Select
                value={formData.uf}
                onValueChange={(value) => setFormData({ ...formData, uf: value })}
              >
                <SelectTrigger id="uf">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {UF_OPTIONS.map((uf) => (
                    <SelectItem key={uf} value={uf}>{uf}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="porte">Porte</Label>
              <Select
                value={formData.porte}
                onValueChange={(value) => setFormData({ ...formData, porte: value })}
              >
                <SelectTrigger id="porte">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {PORTE_OPTIONS.map((porte) => (
                    <SelectItem key={porte} value={porte}>{porte}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className={`space-y-2 p-2 -m-2 rounded-lg transition-all duration-500 ${planoDestacado ? "bg-rose-500/10 ring-2 ring-rose-500" : ""}`}>
              <Label htmlFor="plano" className={planoDestacado ? "text-rose-600 font-semibold" : ""}>
                Plano {planoDestacado && <span className="text-xs">(Faça o upgrade aqui!)</span>}
              </Label>
              <Select
                value={formData.plano}
                onValueChange={(value) => setFormData({ ...formData, plano: value })}
              >
                <SelectTrigger id="plano" className={planoDestacado ? "border-rose-500" : ""}>
                  <SelectValue placeholder="Selecione o plano" />
                </SelectTrigger>
                <SelectContent>
                  {PLANO_OPTIONS.map((plano) => (
                    <SelectItem key={plano} value={plano}>{plano}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="trial">Trial</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="alunos">Nº de Alunos</Label>
              <Input
                id="alunos"
                type="number"
                value={formData.alunos}
                onChange={(e) => setFormData({ ...formData, alunos: parseInt(e.target.value) || 0 })}
              />
              <p className="text-xs text-muted-foreground">
                Observação: as carteiras dos alunos são cadastradas no painel da escola, na tela de Alunos.
              </p>
            </div>
          </div>

          {/* Credenciais */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="emailDiretor">Login (E-mail do Diretor)</Label>
              <Input
                id="emailDiretor"
                type="email"
                value={formData.emailDiretor || ""}
                onChange={(e) => setFormData({ ...formData, emailDiretor: e.target.value })}
                placeholder="diretor@escola.com.br"
              />
              <p className="text-xs text-muted-foreground">
                Se alterar aqui, o e-mail do usuário no Auth será atualizado.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="novaSenha">Nova senha</Label>
              <Input
                id="novaSenha"
                type="password"
                value={formData.novaSenha || ""}
                onChange={(e) => setFormData({ ...formData, novaSenha: e.target.value })}
                placeholder="Deixe em branco para não alterar"
              />
              <p className="text-xs text-muted-foreground">
                Por segurança, não exibimos a senha atual. Preencha apenas se quiser trocar.
              </p>
            </div>
          </div>

          {/* Módulos (implantação) */}
          <div className="space-y-2">
            <Label>Módulos implantados</Label>
            {(() => {
              const categorias = [...new Set(MODULOS_OPTIONS.map(m => m.categoria))];
              return categorias.map((cat) => (
                <div key={cat} className="space-y-1.5">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{cat}</p>
                  <div className="flex flex-wrap gap-2">
                    {MODULOS_OPTIONS.filter(m => m.categoria === cat).map((m) => {
                      const active = (formData.modulos || []).includes(m.id);
                      return (
                        <Tooltip key={m.id}>
                          <TooltipTrigger asChild>
                            <button type="button" onClick={() => toggleModulo(m.id)} className="focus:outline-none">
                              <Badge variant={active ? "default" : "secondary"} className={cn(active ? "bg-rose-500 hover:bg-rose-600" : "", "gap-1")}>
                                {m.label}
                                {m.planoMinimo && <Sparkles className="h-3 w-3" />}
                              </Badge>
                            </button>
                          </TooltipTrigger>
                          {m.planoMinimo && (
                            <TooltipContent>
                              <p>Opcional — requer plano {m.planoMinimo} ou superior</p>
                            </TooltipContent>
                          )}
                        </Tooltip>
                      );
                    })}
                  </div>
                </div>
              ));
            })()}
            <p className="text-xs text-muted-foreground">
              Selecione quais módulos ficam disponíveis para esta escola.
            </p>
          </div>

          {/* Importação (CSV/Excel + SQL) */}
          <div className="space-y-2 rounded-lg border p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Label>Importação (Migração)</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Envie CSV/Excel ou cole um SQL de outro sistema para migração. Requer módulo <strong>Importação</strong>.
                </p>
              </div>
              <Badge variant={importacaoAtiva ? "default" : "secondary"} className={importacaoAtiva ? "bg-rose-500" : ""}>
                {importacaoAtiva ? "Habilitado" : "Desabilitado"}
              </Badge>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="importMode">Tipo de importação</Label>
                <Select value={importMode} onValueChange={(value) => setImportMode(value as ImportMode)}>
                  <SelectTrigger id="importMode" disabled={!importacaoAtiva}>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cadastro">Dados cadastrais</SelectItem>
                    <SelectItem value="historico">Histórico</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="importFile">Arquivo (CSV/Excel)</Label>
                <Input
                  id="importFile"
                  type="file"
                  disabled={!importacaoAtiva}
                  accept=".csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  onChange={(e) => setImportFile(e.currentTarget.files?.[0] || null)}
                />
                {importFile ? (
                  <p className="text-xs text-muted-foreground">Selecionado: {importFile.name}</p>
                ) : (
                  <p className="text-xs text-muted-foreground">Formatos aceitos: .csv, .xls, .xlsx</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="legacySql">SQL (migração de outro sistema)</Label>
              <textarea
                id="legacySql"
                value={legacySql}
                disabled={!importacaoAtiva}
                onChange={(e) => setLegacySql(e.target.value)}
                placeholder="Cole aqui um INSERT/SELECT do sistema legado (opcional)."
                className="min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <p className="text-xs text-muted-foreground">
                Dica: use tabelas de <em>staging</em> no banco e processe via job/Edge Function.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setImportFile(null);
                  setLegacySql("");
                  toast.message("Importação", { description: "Campos de importação limpos." });
                }}
                disabled={!importacaoAtiva}
              >
                Limpar
              </Button>
              <Button type="button" onClick={handleImport} disabled={!importacaoAtiva}>
                Importar
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="professores">Nº de Professores</Label>
              <Input
                id="professores"
                type="number"
                value={formData.professores}
                onChange={(e) => setFormData({ ...formData, professores: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label>Data de Cadastro</Label>
              <Input
                value={formData.datacadastro}
                disabled
                className="bg-muted"
              />
            </div>
          </div>
        </div>
        </div>
        <DialogFooter className="px-6 pb-6 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Cancelar
          </Button>
          <Button onClick={handleSave} className="bg-rose-500 hover:bg-rose-600" disabled={isSaving}>
            {isSaving ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
