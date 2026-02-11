import { useState, useEffect } from "react";
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
  { id: "academico", label: "Acadêmico" },
  { id: "financeiro", label: "Financeiro" },
  { id: "biblioteca", label: "Biblioteca" },
  { id: "comunicacao", label: "Comunicação" },
  { id: "importacao", label: "Importação (Migração)" },
];

export function EditarEscolaDialog({ escola, open, onOpenChange, onSave, destacarPlano }: EditarEscolaDialogProps) {
  const [formData, setFormData] = useState<Escola | null>(null);
  const [planoDestacado, setPlanoDestacado] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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
        const { data: fnData, error: fnError } = await supabase.functions.invoke("update-school-credentials", {
          body: {
            userId: formData.id,
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

  if (!formData) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar Escola</DialogTitle>
          <DialogDescription>
            Atualize os dados da escola. Clique em salvar quando terminar.
          </DialogDescription>
        </DialogHeader>
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
            <div className="flex flex-wrap gap-2">
              {MODULOS_OPTIONS.map((m) => {
                const active = (formData.modulos || []).includes(m.id);
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => toggleModulo(m.id)}
                    className="focus:outline-none"
                  >
                    <Badge
                      variant={active ? "default" : "secondary"}
                      className={active ? "bg-rose-500 hover:bg-rose-600" : ""}
                    >
                      {m.label}
                    </Badge>
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              Selecione quais módulos ficam disponíveis para esta escola.
            </p>
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
        <DialogFooter>
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
