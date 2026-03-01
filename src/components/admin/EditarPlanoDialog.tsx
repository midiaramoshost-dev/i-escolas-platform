import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  Users, 
  Settings2, 
  Save,
  Sparkles,
  Zap,
  Star,
  Crown
} from "lucide-react";
import { toast } from "sonner";

export interface PlanoRecursos {
  alunos: string;
  professores: string;
  turmas: string;
  armazenamento: string;
  suporte: string;
  relatorios: boolean;
  boletins: boolean;
  frequencia: boolean;
  comunicados: boolean;
  financeiro: boolean;
  api: boolean;
  branding: boolean;
  rh: boolean;
}

export interface Plano {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  precoAluno: number;
  cor: string;
  icon: React.ComponentType<{ className?: string }>;
  escolas: number;
  limiteAlunos: number | null;
  popular?: boolean;
  recursos: PlanoRecursos;
}

interface EditarPlanoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plano: Plano | null;
  onSave: (plano: Plano) => void;
}

const recursosBooleanos = [
  { key: "relatorios", label: "Relatórios Avançados" },
  { key: "boletins", label: "Boletins" },
  { key: "frequencia", label: "Controle de Frequência" },
  { key: "comunicados", label: "Comunicados" },
  { key: "financeiro", label: "Módulo Financeiro" },
  { key: "api", label: "API de Integração" },
  { key: "branding", label: "Branding Personalizado" },
  { key: "rh", label: "Módulo RH" },
];

const recursosTexto = [
  { key: "alunos", label: "Limite de Alunos", placeholder: "Ex: Até 200" },
  { key: "professores", label: "Limite de Professores", placeholder: "Ex: Até 20 ou Ilimitado" },
  { key: "turmas", label: "Limite de Turmas", placeholder: "Ex: Até 10 ou Ilimitado" },
  { key: "armazenamento", label: "Armazenamento", placeholder: "Ex: 5 GB ou Ilimitado" },
  { key: "suporte", label: "Tipo de Suporte", placeholder: "Ex: E-mail + Chat" },
];

const getPlanoIcon = (id: string) => {
  switch (id) {
    case "free": return Sparkles;
    case "start": return Zap;
    case "pro": return Star;
    case "premium": return Crown;
    default: return Sparkles;
  }
};

const getPlanoColorClass = (cor: string) => {
  switch (cor) {
    case "rose": return "bg-rose-500";
    case "purple": return "bg-purple-500";
    case "blue": return "bg-blue-500";
    default: return "bg-gray-500";
  }
};

export function EditarPlanoDialog({ open, onOpenChange, plano, onSave }: EditarPlanoDialogProps) {
  const [formData, setFormData] = useState<Plano | null>(null);

  useEffect(() => {
    if (plano) {
      setFormData({ ...plano });
    }
  }, [plano]);

  if (!formData) return null;

  const handleInputChange = (field: keyof Plano, value: string | number | boolean) => {
    setFormData(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleRecursoTextoChange = (key: string, value: string) => {
    setFormData(prev => prev ? {
      ...prev,
      recursos: { ...prev.recursos, [key]: value }
    } : null);
  };

  const handleRecursoBoolChange = (key: string, value: boolean) => {
    setFormData(prev => prev ? {
      ...prev,
      recursos: { ...prev.recursos, [key]: value }
    } : null);
  };

  const handleSave = () => {
    if (!formData) return;
    
    // Validação básica
    if (formData.preco < 0) {
      toast.error("O preço não pode ser negativo");
      return;
    }
    if (formData.precoAluno < 0) {
      toast.error("O preço por aluno não pode ser negativo");
      return;
    }
    if (!formData.nome.trim()) {
      toast.error("O nome do plano é obrigatório");
      return;
    }
    if (!formData.descricao.trim()) {
      toast.error("A descrição do plano é obrigatória");
      return;
    }

    onSave(formData);
    toast.success(`Plano ${formData.nome} atualizado com sucesso!`);
    onOpenChange(false);
  };

  const IconComponent = getPlanoIcon(formData.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${getPlanoColorClass(formData.cor)} flex items-center justify-center`}>
              <IconComponent className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl">Editar Plano {formData.nome}</DialogTitle>
              <DialogDescription>
                Configure preços, limites e recursos do plano
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="precos" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="precos" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Preços
            </TabsTrigger>
            <TabsTrigger value="limites" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Limites
            </TabsTrigger>
            <TabsTrigger value="recursos" className="flex items-center gap-2">
              <Settings2 className="h-4 w-4" />
              Recursos
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[400px] mt-4 pr-4">
            <TabsContent value="precos" className="space-y-6 mt-0">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="nome">Nome do Plano</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => handleInputChange("nome", e.target.value)}
                    placeholder="Nome do plano"
                    maxLength={50}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="descricao">Descrição</Label>
                  <Input
                    id="descricao"
                    value={formData.descricao}
                    onChange={(e) => handleInputChange("descricao", e.target.value)}
                    placeholder="Breve descrição do plano"
                    maxLength={100}
                  />
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="preco">Preço Base (R$/mês)</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">R$</span>
                      <Input
                        id="preco"
                        type="number"
                        min="0"
                        step="1"
                        value={formData.preco}
                        onChange={(e) => handleInputChange("preco", parseFloat(e.target.value) || 0)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="precoAluno">Preço por Aluno (R$)</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">R$</span>
                      <Input
                        id="precoAluno"
                        type="number"
                        min="0"
                        step="0.5"
                        value={formData.precoAluno}
                        onChange={(e) => handleInputChange("precoAluno", parseFloat(e.target.value) || 0)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground mb-2">Simulação de preço:</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">
                      R$ {(formData.preco + (formData.precoAluno * 100)).toFixed(2)}
                    </span>
                    <span className="text-muted-foreground">/mês para 100 alunos</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <Label htmlFor="popular" className="font-medium">Marcar como Popular</Label>
                    <p className="text-sm text-muted-foreground">Destaca o plano com badge "Mais Popular"</p>
                  </div>
                  <Switch
                    id="popular"
                    checked={formData.popular || false}
                    onCheckedChange={(checked) => handleInputChange("popular", checked)}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="limites" className="space-y-4 mt-0">
              {recursosTexto.map((recurso) => (
                <div key={recurso.key} className="grid gap-2">
                  <Label htmlFor={recurso.key}>{recurso.label}</Label>
                  <Input
                    id={recurso.key}
                    value={formData.recursos[recurso.key as keyof PlanoRecursos] as string}
                    onChange={(e) => handleRecursoTextoChange(recurso.key, e.target.value)}
                    placeholder={recurso.placeholder}
                    maxLength={50}
                  />
                </div>
              ))}

              <Separator className="my-4" />

              <div className="grid gap-2">
                <Label htmlFor="limiteAlunos">Limite Máximo de Alunos (número)</Label>
                <Input
                  id="limiteAlunos"
                  type="number"
                  min="0"
                  value={formData.limiteAlunos || ""}
                  onChange={(e) => handleInputChange("limiteAlunos", e.target.value ? parseInt(e.target.value) : null)}
                  placeholder="Deixe vazio para ilimitado"
                />
                <p className="text-xs text-muted-foreground">
                  Usado para validação do sistema. Deixe vazio para ilimitado.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="recursos" className="space-y-4 mt-0">
              <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
                <div>
                  <Label htmlFor="toggle-all-recursos" className="font-medium">Ativar/Desativar Todos</Label>
                  <p className="text-sm text-muted-foreground">Marque ou desmarque todos os recursos de uma vez</p>
                </div>
                <Switch
                  id="toggle-all-recursos"
                  checked={recursosBooleanos.every(r => formData.recursos[r.key as keyof PlanoRecursos] as boolean)}
                  onCheckedChange={(checked) => {
                    const updatedRecursos = { ...formData.recursos };
                    recursosBooleanos.forEach(r => {
                      (updatedRecursos as any)[r.key] = checked;
                    });
                    setFormData(prev => prev ? { ...prev, recursos: updatedRecursos } : null);
                  }}
                />
              </div>

              <Separator />
              
              {recursosBooleanos.map((recurso) => (
                <div
                  key={recurso.key}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      formData.recursos[recurso.key as keyof PlanoRecursos] 
                        ? "bg-green-500" 
                        : "bg-muted-foreground/30"
                    }`} />
                    <Label htmlFor={recurso.key} className="font-medium cursor-pointer">
                      {recurso.label}
                    </Label>
                  </div>
                  <Switch
                    id={recurso.key}
                    checked={formData.recursos[recurso.key as keyof PlanoRecursos] as boolean}
                    onCheckedChange={(checked) => handleRecursoBoolChange(recurso.key, checked)}
                  />
                </div>
              ))}

              <div className="mt-4 p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">Resumo</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {recursosBooleanos.filter(r => formData.recursos[r.key as keyof PlanoRecursos] as boolean).length} de {recursosBooleanos.length} recursos ativos
                </p>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
            <Save className="h-4 w-4 mr-2" />
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
