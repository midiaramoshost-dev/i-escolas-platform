import { useState } from "react";
import {
  Clock,
  Search,
  Check,
  X,
  Calendar,
  Users,
  Download,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface PresencaFuncionario {
  id: string;
  nome: string;
  cargo: string;
  departamento: string;
  dias: Record<number, "presente" | "falta" | "justificado" | "">;
}

const diasUteis = Array.from({ length: 28 }, (_, i) => i + 1);

const funcionariosMock: PresencaFuncionario[] = [
  { id: "1", nome: "Carlos Eduardo Lima", cargo: "Coordenador", departamento: "Pedagógico", dias: {} },
  { id: "2", nome: "Fernanda Costa", cargo: "Secretária", departamento: "Administrativo", dias: {} },
  { id: "3", nome: "Roberto Santos", cargo: "Auxiliar Limpeza", departamento: "Serviços Gerais", dias: {} },
  { id: "4", nome: "Mariana Oliveira", cargo: "Professora", departamento: "Pedagógico", dias: {} },
  { id: "5", nome: "João Pedro Alves", cargo: "Porteiro", departamento: "Serviços Gerais", dias: {} },
  { id: "6", nome: "Ana Paula Ribeiro", cargo: "Diretora Adjunta", departamento: "Diretoria", dias: {} },
];

// Pre-fill some attendance
funcionariosMock.forEach((f) => {
  for (let d = 1; d <= 14; d++) {
    const weekday = new Date(2026, 1, d).getDay();
    if (weekday === 0 || weekday === 6) continue;
    f.dias[d] = Math.random() > 0.1 ? "presente" : Math.random() > 0.5 ? "falta" : "justificado";
  }
});

export default function AdminPresencaFuncionarios() {
  const [mes, setMes] = useState("02");
  const [ano, setAno] = useState("2026");
  const [search, setSearch] = useState("");
  const [funcionarios, setFuncionarios] = useState<PresencaFuncionario[]>(funcionariosMock);
  const [deptFilter, setDeptFilter] = useState("Todos");

  const departamentos = ["Todos", ...new Set(funcionarios.map((f) => f.departamento))];

  const filtered = funcionarios.filter((f) => {
    const matchSearch = f.nome.toLowerCase().includes(search.toLowerCase());
    const matchDept = deptFilter === "Todos" || f.departamento === deptFilter;
    return matchSearch && matchDept;
  });

  const daysInMonth = new Date(parseInt(ano), parseInt(mes), 0).getDate();
  const workDays = Array.from({ length: daysInMonth }, (_, i) => {
    const d = i + 1;
    const weekday = new Date(parseInt(ano), parseInt(mes) - 1, d).getDay();
    return { dia: d, isWeekend: weekday === 0 || weekday === 6 };
  });

  const togglePresenca = (funcId: string, dia: number) => {
    setFuncionarios((prev) =>
      prev.map((f) => {
        if (f.id !== funcId) return f;
        const current = f.dias[dia] || "";
        const next = current === "" ? "presente" : current === "presente" ? "falta" : current === "falta" ? "justificado" : "";
        return { ...f, dias: { ...f.dias, [dia]: next } };
      })
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "presente": return <Check className="h-3 w-3 text-emerald-500" />;
      case "falta": return <X className="h-3 w-3 text-red-500" />;
      case "justificado": return <span className="text-[10px] font-bold text-amber-500">J</span>;
      default: return <span className="text-[10px] text-muted-foreground">—</span>;
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case "presente": return "bg-emerald-500/10";
      case "falta": return "bg-red-500/10";
      case "justificado": return "bg-amber-500/10";
      default: return "";
    }
  };

  const countStatus = (f: PresencaFuncionario, status: string) =>
    Object.values(f.dias).filter((v) => v === status).length;

  const exportPDF = () => {
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`Presença de Funcionários — ${mes}/${ano}`, 15, 15);

    const headers = ["Funcionário", "Cargo", "Presentes", "Faltas", "Justif.", "% Presença"];
    const rows = filtered.map((f) => {
      const p = countStatus(f, "presente");
      const fa = countStatus(f, "falta");
      const j = countStatus(f, "justificado");
      const total = p + fa + j;
      const pct = total > 0 ? ((p / total) * 100).toFixed(1) + "%" : "—";
      return [f.nome, f.cargo, String(p), String(fa), String(j), pct];
    });

    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 22,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [59, 130, 246] },
    });

    doc.save(`presenca_funcionarios_${mes}_${ano}.pdf`);
    toast.success("Relatório exportado em PDF!");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Presença de Funcionários</h1>
          <p className="text-muted-foreground">Controle de presença mensal dos funcionários da instituição</p>
        </div>
        <div className="flex gap-2">
          <Select value={mes} onValueChange={setMes}>
            <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {["01","02","03","04","05","06","07","08","09","10","11","12"].map((m) => (
                <SelectItem key={m} value={m}>
                  {new Date(2026, parseInt(m) - 1).toLocaleString("pt-BR", { month: "long" })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={ano} onValueChange={setAno}>
            <SelectTrigger className="w-[100px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2026">2026</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={exportPDF}>
            <Download className="mr-2 h-4 w-4" /> Exportar PDF
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-full p-3 bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Funcionários</p>
              <p className="text-xl font-bold">{funcionarios.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-full p-3 bg-emerald-500/10">
              <Check className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Média Presença</p>
              <p className="text-xl font-bold">
                {(() => {
                  const total = funcionarios.reduce((s, f) => s + countStatus(f, "presente"), 0);
                  const all = funcionarios.reduce((s, f) => s + countStatus(f, "presente") + countStatus(f, "falta") + countStatus(f, "justificado"), 0);
                  return all > 0 ? ((total / all) * 100).toFixed(1) + "%" : "—";
                })()}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-full p-3 bg-red-500/10">
              <X className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Faltas</p>
              <p className="text-xl font-bold">
                {funcionarios.reduce((s, f) => s + countStatus(f, "falta"), 0)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar funcionário..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        <Select value={deptFilter} onValueChange={setDeptFilter}>
          <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            {departamentos.map((d) => (
              <SelectItem key={d} value={d}>{d}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-xs">
        <div className="flex items-center gap-1"><div className="h-3 w-3 rounded bg-emerald-500/20 flex items-center justify-center"><Check className="h-2 w-2 text-emerald-500" /></div> Presente</div>
        <div className="flex items-center gap-1"><div className="h-3 w-3 rounded bg-red-500/20 flex items-center justify-center"><X className="h-2 w-2 text-red-500" /></div> Falta</div>
        <div className="flex items-center gap-1"><div className="h-3 w-3 rounded bg-amber-500/20 flex items-center justify-center"><span className="text-[8px] font-bold text-amber-500">J</span></div> Justificado</div>
        <span className="text-muted-foreground">Clique na célula para alternar</span>
      </div>

      {/* Attendance Grid */}
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="sticky left-0 bg-muted/50 z-10 text-left px-3 py-2 min-w-[180px]">Funcionário</th>
                {workDays.map(({ dia, isWeekend }) => (
                  <th key={dia} className={`px-1 py-2 text-center min-w-[28px] ${isWeekend ? "text-muted-foreground/50" : ""}`}>
                    {dia}
                  </th>
                ))}
                <th className="px-2 py-2 text-center min-w-[40px]">P</th>
                <th className="px-2 py-2 text-center min-w-[40px]">F</th>
                <th className="px-2 py-2 text-center min-w-[40px]">%</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((f) => {
                const p = countStatus(f, "presente");
                const fa = countStatus(f, "falta");
                const j = countStatus(f, "justificado");
                const total = p + fa + j;
                const pct = total > 0 ? ((p / total) * 100).toFixed(0) : "—";
                return (
                  <tr key={f.id} className="border-b hover:bg-muted/30">
                    <td className="sticky left-0 bg-card z-10 px-3 py-2 font-medium">
                      <div>{f.nome}</div>
                      <div className="text-[10px] text-muted-foreground">{f.cargo}</div>
                    </td>
                    {workDays.map(({ dia, isWeekend }) => (
                      <td key={dia} className="px-0 py-1 text-center">
                        {isWeekend ? (
                          <div className="h-6 w-6 mx-auto bg-muted/30 rounded" />
                        ) : (
                          <button
                            className={`h-6 w-6 mx-auto rounded flex items-center justify-center cursor-pointer hover:ring-1 hover:ring-primary/50 ${getStatusBg(f.dias[dia] || "")}`}
                            onClick={() => togglePresenca(f.id, dia)}
                          >
                            {getStatusIcon(f.dias[dia] || "")}
                          </button>
                        )}
                      </td>
                    ))}
                    <td className="px-2 py-2 text-center font-medium text-emerald-600">{p}</td>
                    <td className="px-2 py-2 text-center font-medium text-red-500">{fa}</td>
                    <td className="px-2 py-2 text-center font-medium">{pct}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
