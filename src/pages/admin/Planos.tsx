import { motion } from "framer-motion";
import {
  Layers,
  Check,
  X,
  Edit,
  Users,
  DollarSign,
  Building2,
  Sparkles,
  Crown,
  Zap,
  Star,
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
import { useState } from "react";

const planos = [
  {
    id: "free",
    nome: "Free",
    descricao: "Para escolas que estão começando",
    preco: 0,
    precoAluno: 0,
    cor: "gray",
    icon: Sparkles,
    escolas: 25,
    limiteAlunos: 100,
    recursos: {
      alunos: "Até 100",
      professores: "Até 10",
      turmas: "Até 5",
      armazenamento: "1 GB",
      suporte: "E-mail",
      relatorios: false,
      boletins: true,
      frequencia: true,
      comunicados: true,
      financeiro: false,
      api: false,
      branding: false,
    },
  },
  {
    id: "start",
    nome: "Start",
    descricao: "Para escolas em crescimento",
    preco: 299,
    precoAluno: 5,
    cor: "blue",
    icon: Zap,
    escolas: 35,
    limiteAlunos: 500,
    recursos: {
      alunos: "Até 500",
      professores: "Até 50",
      turmas: "Até 20",
      armazenamento: "10 GB",
      suporte: "E-mail + Chat",
      relatorios: true,
      boletins: true,
      frequencia: true,
      comunicados: true,
      financeiro: true,
      api: false,
      branding: false,
    },
  },
  {
    id: "pro",
    nome: "Pro",
    descricao: "Para escolas estabelecidas",
    preco: 599,
    precoAluno: 4,
    cor: "purple",
    icon: Star,
    escolas: 42,
    limiteAlunos: 2000,
    popular: true,
    recursos: {
      alunos: "Até 2000",
      professores: "Ilimitado",
      turmas: "Ilimitado",
      armazenamento: "50 GB",
      suporte: "Prioritário",
      relatorios: true,
      boletins: true,
      frequencia: true,
      comunicados: true,
      financeiro: true,
      api: true,
      branding: false,
    },
  },
  {
    id: "premium",
    nome: "Premium",
    descricao: "Para grandes instituições",
    preco: 999,
    precoAluno: 3,
    cor: "rose",
    icon: Crown,
    escolas: 25,
    limiteAlunos: null,
    recursos: {
      alunos: "Ilimitado",
      professores: "Ilimitado",
      turmas: "Ilimitado",
      armazenamento: "Ilimitado",
      suporte: "24/7 Dedicado",
      relatorios: true,
      boletins: true,
      frequencia: true,
      comunicados: true,
      financeiro: true,
      api: true,
      branding: true,
    },
  },
];

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
        <Button className="bg-rose-500 hover:bg-rose-600">
          <Edit className="mr-2 h-4 w-4" />
          Editar Preços
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
            <Card className={`relative h-full ${plano.popular ? "border-2 border-purple-500" : ""}`}>
              {plano.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-purple-500">Mais Popular</Badge>
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
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{plano.escolas} escolas</span>
                </div>
                <div className={`rounded-lg p-2 ${getPlanoColorLight(plano.cor)}`}>
                  <p className="text-sm font-medium">{((plano.escolas / totalEscolas) * 100).toFixed(1)}% do total</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Ver Detalhes
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
              <Layers className="h-5 w-5 text-rose-500" />
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
                      const valor = plano.recursos[recurso.key as keyof typeof plano.recursos];
                      return (
                        <TableCell key={plano.id} className="text-center">
                          {typeof valor === "boolean" ? (
                            valor ? (
                              <Check className="h-5 w-5 text-green-500 mx-auto" />
                            ) : (
                              <X className="h-5 w-5 text-red-500 mx-auto" />
                            )
                          ) : (
                            <span className="text-sm">{valor}</span>
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
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Módulos Disponíveis
            </CardTitle>
            <CardDescription>Ative ou desative módulos globalmente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[
                { nome: "Diário de Classe", ativo: true },
                { nome: "Boletins Automáticos", ativo: true },
                { nome: "Controle de Frequência", ativo: true },
                { nome: "Portal do Aluno", ativo: true },
                { nome: "Portal do Responsável", ativo: true },
                { nome: "Módulo Financeiro", ativo: true },
                { nome: "Comunicados", ativo: true },
                { nome: "Relatórios Avançados", ativo: true },
                { nome: "Integração API", ativo: false },
              ].map((modulo, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                >
                  <Label htmlFor={`modulo-${index}`} className="font-medium">
                    {modulo.nome}
                  </Label>
                  <Switch id={`modulo-${index}`} defaultChecked={modulo.ativo} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
