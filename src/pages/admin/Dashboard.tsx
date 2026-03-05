import { motion } from "framer-motion";
import {
  Building2,
  Users,
  TrendingUp,
  DollarSign,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  GraduationCap,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface EscolaRow {
  id: string;
  nome: string;
  cidade: string;
  uf: string;
  plano: string;
  alunos: number;
  status: string;
  created_at: string;
}

const getPlanoColor = (plano: string) => {
  switch (plano.toLowerCase()) {
    case "premium": return "bg-rose-500/10 text-rose-500";
    case "pro": return "bg-purple-500/10 text-purple-500";
    case "start": return "bg-blue-500/10 text-blue-500";
    default: return "bg-gray-500/10 text-gray-500";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "ativo": return "bg-green-500/10 text-green-500";
    case "trial": return "bg-yellow-500/10 text-yellow-500";
    case "inativo": return "bg-red-500/10 text-red-500";
    default: return "bg-gray-500/10 text-gray-500";
  }
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [escolas, setEscolas] = useState<EscolaRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("escolas")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setEscolas(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalEscolas = escolas.length;
  const totalAlunos = escolas.reduce((acc, e) => acc + (e.alunos || 0), 0);
  const escolasAtivas = escolas.filter(e => e.status === "ativo").length;
  const escolasTrial = escolas.filter(e => e.status === "trial").length;
  const escolasInativas = escolas.filter(e => e.status === "inativo").length;

  // Distribuição por plano
  const planos = ["Free", "Start", "Pro", "Premium"];
  const planoCores: Record<string, string> = { Free: "bg-gray-500", Start: "bg-blue-500", Pro: "bg-purple-500", Premium: "bg-rose-500" };
  const planoDistribuicao = planos.map(plano => {
    const count = escolas.filter(e => e.plano.toLowerCase() === plano.toLowerCase()).length;
    return {
      plano,
      escolas: count,
      percentual: totalEscolas > 0 ? Math.round((count / totalEscolas) * 1000) / 10 : 0,
      cor: planoCores[plano] || "bg-gray-500",
    };
  });

  const escolasRecentes = escolas.slice(0, 5);

  const kpis = [
    {
      title: "Total de Escolas",
      value: totalEscolas.toString(),
      icon: Building2,
      color: "text-rose-500",
      bgColor: "bg-rose-500/10",
    },
    {
      title: "Alunos Ativos",
      value: totalAlunos.toLocaleString("pt-BR"),
      icon: GraduationCap,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Escolas Ativas",
      value: escolasAtivas.toString(),
      icon: CheckCircle,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Em Trial",
      value: escolasTrial.toString(),
      icon: Clock,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Dashboard ADM Master</h1>
          <p className="text-sm text-muted-foreground">Visão geral da plataforma i ESCOLAS</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none" onClick={() => navigate("/admin/monitoramento")}>
            <Activity className="mr-2 h-4 w-4" />
            <span className="hidden xs:inline">Monitoramento</span>
            <span className="xs:hidden">Monitor</span>
          </Button>
          <Button size="sm" className="bg-rose-500 hover:bg-rose-600 flex-1 sm:flex-none" onClick={() => navigate("/admin/escolas")}>
            <Building2 className="mr-2 h-4 w-4" />
            Nova Escola
          </Button>
        </div>
      </motion.div>

      {/* KPIs */}
      <motion.div variants={itemVariants} className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <motion.div key={kpi.title} variants={itemVariants} whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
            <Card>
              <CardContent className="p-3 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">{kpi.title}</p>
                    <p className="text-xl sm:text-2xl font-bold">{kpi.value}</p>
                  </div>
                  <div className={`rounded-full p-2 sm:p-3 ${kpi.bgColor} shrink-0`}>
                    <kpi.icon className={`h-4 w-4 sm:h-6 sm:w-6 ${kpi.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Alertas */}
        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Resumo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {escolasInativas > 0 && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-red-500/5 border border-red-500/20">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full shrink-0 bg-red-500/10">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{escolasInativas} escola(s) inativa(s)</p>
                  </div>
                </div>
              )}
              {escolasTrial > 0 && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full shrink-0 bg-yellow-500/10">
                    <Clock className="h-4 w-4 text-yellow-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{escolasTrial} escola(s) em período trial</p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3 p-3 rounded-lg bg-green-500/5 border border-green-500/20">
                <div className="flex h-8 w-8 items-center justify-center rounded-full shrink-0 bg-green-500/10">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm">{escolasAtivas} escola(s) ativa(s)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Distribuição por Plano */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-rose-500" />
                Distribuição por Plano
              </CardTitle>
              <CardDescription>Escolas por tipo de assinatura</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {planoDistribuicao.map((item) => (
                  <div key={item.plano} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${item.cor}`} />
                        <span className="font-medium">{item.plano}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{item.escolas} escolas</span>
                        <span className="text-sm font-medium">{item.percentual}%</span>
                      </div>
                    </div>
                    <Progress value={item.percentual} className="h-2" />
                  </div>
                ))}
              </div>

              <div className="mt-4 sm:mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-4 border-t">
                <div className="text-center">
                  <p className="text-2xl font-bold">{totalEscolas}</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-500">{escolasAtivas}</p>
                  <p className="text-xs text-muted-foreground">Ativos</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-500">{escolasTrial}</p>
                  <p className="text-xs text-muted-foreground">Trial</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-500">{escolasInativas}</p>
                  <p className="text-xs text-muted-foreground">Inativos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Escolas Recentes */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-rose-500" />
                  Escolas Recentes
                </CardTitle>
                <CardDescription>Últimas escolas cadastradas na plataforma</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate("/admin/escolas")}>
                Ver Todas
              </Button>
            </div>
          </CardHeader>
           <CardContent className="overflow-x-auto">
            {escolasRecentes.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Nenhuma escola cadastrada ainda.</p>
            ) : (
              <Table className="min-w-[600px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Escola</TableHead>
                    <TableHead>Cidade</TableHead>
                    <TableHead>Plano</TableHead>
                    <TableHead className="text-center">Alunos</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {escolasRecentes.map((escola) => (
                    <TableRow key={escola.id}>
                      <TableCell className="font-medium">{escola.nome}</TableCell>
                      <TableCell className="text-muted-foreground">{escola.cidade} - {escola.uf}</TableCell>
                      <TableCell>
                        <Badge className={getPlanoColor(escola.plano)}>{escola.plano}</Badge>
                      </TableCell>
                      <TableCell className="text-center">{escola.alunos.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(escola.status)}>
                          {escola.status === "ativo" ? "Ativo" : escola.status === "trial" ? "Trial" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost" onClick={() => navigate("/admin/escolas")}>
                          Ver Detalhes
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
