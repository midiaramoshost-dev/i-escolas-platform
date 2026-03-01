import { motion } from "framer-motion";
import {
  Layers,
  Check,
  X,
  Edit,
  Building2,
  Zap,
  Pencil,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState, useRef, useEffect } from "react";
import { EditarPlanoDialog, PlanoRecursos } from "@/components/admin/EditarPlanoDialog";
import { usePlanos, Plano } from "@/contexts/PlanosContext";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const recursosLista = [
  { key: "alunos", label: "Limite de Alunos" },
  { key: "professores", label: "Limite de Professores" },
  { key: "turmas", label: "Limite de Turmas" },
  { key: "armazenamento", label: "Armazenamento" },
  { key: "suporte", label: "Suporte" },
  { key: "relatorios", label: "Relatórios Avançados" },
  { key: "boletins", label: "Boletins" },
  { key: "frequencia", label: "Controle de Frequência" },
  { key: "comunicados", label: "Comunicados" },
  { key: "financeiro", label: "Módulo Financeiro" },
  { key: "api", label: "API de Integração" },
  { key: "branding", label: "Branding Personalizado" },
];

const getPlanoColor = (cor: string) => {
  switch (cor) {
    case "rose": return "from-rose-500 to-red-600";
    case "purple": return "from-purple-500 to-violet-600";
    case "blue": return "from-blue-500 to-cyan-600";
    default: return "from-gray-500 to-slate-600";
  }
};

const getPlanoColorLight = (cor: string) => {
  switch (cor) {
    case "rose": return "bg-rose-500/10 text-rose-500 border-rose-500/20";
    case "purple": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
    case "blue": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    default: return "bg-gray-500/10 text-gray-500 border-gray-500/20";
  }
};

export default function AdminPlanos() {
  const { planos, updatePlano } = usePlanos();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedPlano, setSelectedPlano] = useState<Plano | null>(null);
  const [editingCell, setEditingCell] = useState<{ planoId: string; recursoKey: string } | null>(null);
  const [editValue, setEditValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [modulos, setModulos] = useState([
    { nome: "Diário de Classe", ativo: true },
    { nome: "Boletins Automáticos", ativo: true },
    { nome: "Controle de Frequência", ativo: true },
    { nome: "Portal do Aluno", ativo: true },
    { nome: "Portal do Responsável", ativo: true },
    { nome: "Módulo Financeiro", ativo: true },
    { nome: "Comunicados", ativo: true },
    { nome: "Relatórios Avançados", ativo: true },
    { nome: "Integração API", ativo: false },
  ]);

  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingCell]);

  const handleCellClick = (planoId: string, recursoKey: string, currentValue: string | boolean) => {
    if (typeof currentValue === "boolean") return; // booleans are toggled differently
    setEditingCell({ planoId, recursoKey });
    setEditValue(String(currentValue));
  };

  const handleCellSave = async () => {
    if (!editingCell) return;
    const plano = planos.find(p => p.id === editingCell.planoId);
    if (!plano) return;
    const updatedRecursos = { ...plano.recursos, [editingCell.recursoKey]: editValue };
    const updatedPlano = { ...plano, recursos: updatedRecursos };
    try {
      await updatePlano(updatedPlano);
      toast.success("Recurso atualizado!");
    } catch {
      toast.error("Erro ao atualizar recurso");
    }
    setEditingCell(null);
  };

  const handleToggleRecurso = async (planoId: string, recursoKey: string, currentValue: boolean) => {
    const plano = planos.find(p => p.id === planoId);
    if (!plano) return;
    const updatedRecursos = { ...plano.recursos, [recursoKey]: !currentValue };
    const updatedPlano = { ...plano, recursos: updatedRecursos };
    try {
      await updatePlano(updatedPlano);
      toast.success("Recurso atualizado!");
    } catch {
      toast.error("Erro ao atualizar recurso");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const totalEscolas = planos.reduce((acc, p) => acc + p.escolas, 0);

  const handleEditPlano = (plano: Plano) => {
    setSelectedPlano(plano);
    setEditDialogOpen(true);
  };

  const handleSavePlano = async (updatedPlano: Plano) => {
    try {
      await updatePlano(updatedPlano);
    } catch (error) {
      console.error("Erro ao salvar plano:", error);
    }
  };

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gestão de Planos</h1>
          <p className="text-muted-foreground">
            Configure e gerencie os planos da plataforma
          </p>
        </div>
        <Button 
          className="bg-primary hover:bg-primary/90"
          onClick={() => {
            setSelectedPlano(planos[0]);
            setEditDialogOpen(true);
          }}
        >
          <Edit className="mr-2 h-4 w-4" />
          Editar Planos
        </Button>
      </motion.div>

      {/* Cards de Planos */}
      <motion.div variants={itemVariants} className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {planos.map((plano) => (
          <motion.div
            key={plano.id}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className={`relative h-full ${plano.popular ? "border-2 border-primary" : ""}`}>
              {plano.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary">Mais Popular</Badge>
                </div>
              )}
              <CardHeader className="text-center pb-2">
                <div className={`mx-auto w-12 h-12 rounded-xl bg-gradient-to-br ${getPlanoColor(plano.cor)} flex items-center justify-center mb-3`}>
                  <plano.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">{plano.nome}</CardTitle>
                <CardDescription>{plano.descricao}</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-4">
                  {plano.preco === 0 ? (
                    <p className="text-3xl font-bold">Grátis</p>
                  ) : (
                    <>
                      <p className="text-3xl font-bold">R$ {plano.preco}</p>
                      <p className="text-sm text-muted-foreground">/mês + R$ {plano.precoAluno}/aluno</p>
                    </>
                  )}
                </div>
                
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleEditPlano(plano)}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Editar Plano
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Comparativo de Recursos */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              Comparativo de Recursos
            </CardTitle>
            <CardDescription>Recursos disponíveis em cada plano</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Recurso</TableHead>
                  {planos.map((plano) => (
                    <TableHead key={plano.id} className="text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="font-semibold">{plano.nome}</span>
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {recursosLista.map((recurso) => (
                  <TableRow key={recurso.key}>
                    <TableCell className="font-medium">{recurso.label}</TableCell>
                    {planos.map((plano) => {
                      const valor = plano.recursos[recurso.key as keyof PlanoRecursos];
                      const isEditing = editingCell?.planoId === plano.id && editingCell?.recursoKey === recurso.key;
                      return (
                        <TableCell key={plano.id} className="text-center">
                          {typeof valor === "boolean" ? (
                            <button
                              onClick={() => handleToggleRecurso(plano.id, recurso.key, valor)}
                              className="mx-auto block cursor-pointer hover:opacity-70 transition-opacity"
                              title="Clique para alternar"
                            >
                              {valor ? (
                                <Check className="h-5 w-5 text-green-500 mx-auto" />
                              ) : (
                                <X className="h-5 w-5 text-red-500 mx-auto" />
                              )}
                            </button>
                          ) : isEditing ? (
                            <Input
                              ref={inputRef}
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onBlur={handleCellSave}
                              onKeyDown={(e) => { if (e.key === "Enter") handleCellSave(); if (e.key === "Escape") setEditingCell(null); }}
                              className="h-8 text-center text-sm w-28 mx-auto"
                            />
                          ) : (
                            <span
                              className="text-sm cursor-pointer hover:bg-muted px-2 py-1 rounded transition-colors"
                              onClick={() => handleCellClick(plano.id, recurso.key, valor)}
                              title="Clique para editar"
                            >
                              {valor}
                            </span>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

      {/* Configurações de Módulos */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  Módulos Disponíveis
                </CardTitle>
                <CardDescription>Ative ou desative módulos globalmente</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="toggle-all" className="text-sm text-muted-foreground whitespace-nowrap">
                  {modulos.every(m => m.ativo) ? "Desativar Todos" : "Ativar Todos"}
                </Label>
                <Switch
                  id="toggle-all"
                  checked={modulos.every(m => m.ativo)}
                  onCheckedChange={(checked) => {
                    setModulos(prev => prev.map(m => ({ ...m, ativo: checked })));
                    toast.success(checked ? "Todos os módulos ativados!" : "Todos os módulos desativados!");
                  }}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {modulos.map((modulo, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                >
                  <Label htmlFor={`modulo-${index}`} className="font-medium">
                    {modulo.nome}
                  </Label>
                  <Switch
                    id={`modulo-${index}`}
                    checked={modulo.ativo}
                    onCheckedChange={(checked) => {
                      setModulos(prev => prev.map((m, i) => i === index ? { ...m, ativo: checked } : m));
                    }}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Modal de Edição */}
      <EditarPlanoDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        plano={selectedPlano}
        onSave={handleSavePlano}
      />
    </motion.div>
  );
}
