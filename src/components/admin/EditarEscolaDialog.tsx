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
import { toast } from "sonner";

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

export function EditarEscolaDialog({ escola, open, onOpenChange, onSave, destacarPlano }: EditarEscolaDialogProps) {
  const [formData, setFormData] = useState<Escola | null>(null);
  const [planoDestacado, setPlanoDestacado] = useState(false);

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
      setFormData({ ...escola });
    }
  }, [escola]);

  const handleSave = () => {
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

    onSave(formData);
    toast.success("Escola atualizada com sucesso!");
    onOpenChange(false);
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} className="bg-rose-500 hover:bg-rose-600">
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
