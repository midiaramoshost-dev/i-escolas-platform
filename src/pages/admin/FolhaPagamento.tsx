import { useState } from "react";
import {
  DollarSign,
  Plus,
  Search,
  Download,
  Edit,
  Trash2,
  Eye,
  Copy,
  Calculator,
  FileText,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import jsPDF from "jspdf";

interface Funcionario {
  id: string;
  nome: string;
  cargo: string;
  departamento: string;
  salarioBase: number;
  admissao: string;
}

interface FolhaItem {
  id: string;
  funcionarioId: string;
  nome: string;
  cargo: string;
  salarioBase: number;
  horasExtras: number;
  valorHorasExtras: number;
  bonificacao: number;
  inss: number;
  irrf: number;
  valeTransporte: number;
  valeRefeicao: number;
  outrosDescontos: number;
  totalProventos: number;
  totalDescontos: number;
  liquido: number;
}

const funcionariosMock: Funcionario[] = [
  { id: "1", nome: "Carlos Eduardo Lima", cargo: "Coordenador Pedagógico", departamento: "Pedagógico", salarioBase: 5500, admissao: "2020-03-15" },
  { id: "2", nome: "Fernanda Costa", cargo: "Secretária Escolar", departamento: "Administrativo", salarioBase: 3200, admissao: "2021-06-01" },
  { id: "3", nome: "Roberto Santos", cargo: "Auxiliar de Limpeza", departamento: "Serviços Gerais", salarioBase: 1800, admissao: "2022-01-10" },
  { id: "4", nome: "Mariana Oliveira", cargo: "Professora", departamento: "Pedagógico", salarioBase: 4200, admissao: "2019-02-01" },
  { id: "5", nome: "João Pedro Alves", cargo: "Porteiro", departamento: "Serviços Gerais", salarioBase: 2100, admissao: "2023-08-15" },
  { id: "6", nome: "Ana Paula Ribeiro", cargo: "Diretora Adjunta", departamento: "Diretoria", salarioBase: 7000, admissao: "2018-01-10" },
];

const calcINSS = (base: number): number => {
  if (base <= 1412) return base * 0.075;
  if (base <= 2666.68) return base * 0.09;
  if (base <= 4000.03) return base * 0.12;
  return base * 0.14;
};

const calcIRRF = (base: number, inss: number): number => {
  const baseCalc = base - inss;
  if (baseCalc <= 2259.20) return 0;
  if (baseCalc <= 2826.65) return baseCalc * 0.075 - 169.44;
  if (baseCalc <= 3751.05) return baseCalc * 0.15 - 381.44;
  if (baseCalc <= 4664.68) return baseCalc * 0.225 - 662.77;
  return baseCalc * 0.275 - 896.0;
};

const buildFolhaItem = (f: Funcionario, horasExtras = 0, bonificacao = 0, outrosDescontos = 0): FolhaItem => {
  const valorHE = horasExtras * (f.salarioBase / 220) * 1.5;
  const totalProventos = f.salarioBase + valorHE + bonificacao;
  const inss = calcINSS(totalProventos);
  const irrf = Math.max(0, calcIRRF(totalProventos, inss));
  const vt = f.salarioBase * 0.06;
  const vr = 0;
  const totalDescontos = inss + irrf + vt + vr + outrosDescontos;
  return {
    id: f.id,
    funcionarioId: f.id,
    nome: f.nome,
    cargo: f.cargo,
    salarioBase: f.salarioBase,
    horasExtras,
    valorHorasExtras: valorHE,
    bonificacao,
    inss,
    irrf,
    valeTransporte: vt,
    valeRefeicao: vr,
    outrosDescontos,
    totalProventos,
    totalDescontos,
    liquido: totalProventos - totalDescontos,
  };
};

const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function AdminFolhaPagamento() {
  const [mes, setMes] = useState("02");
  const [ano, setAno] = useState("2026");
  const [search, setSearch] = useState("");
  const [folha, setFolha] = useState<FolhaItem[]>(() =>
    funcionariosMock.map((f) => buildFolhaItem(f))
  );
  const [editItem, setEditItem] = useState<FolhaItem | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [viewItem, setViewItem] = useState<FolhaItem | null>(null);
  const [viewOpen, setViewOpen] = useState(false);

  // Edit form state
  const [editHE, setEditHE] = useState(0);
  const [editBon, setEditBon] = useState(0);
  const [editDesc, setEditDesc] = useState(0);

  const filtered = folha.filter((f) =>
    f.nome.toLowerCase().includes(search.toLowerCase()) || f.cargo.toLowerCase().includes(search.toLowerCase())
  );

  const totalLiquido = folha.reduce((s, f) => s + f.liquido, 0);
  const totalBruto = folha.reduce((s, f) => s + f.totalProventos, 0);

  const openEdit = (item: FolhaItem) => {
    setEditItem(item);
    setEditHE(item.horasExtras);
    setEditBon(item.bonificacao);
    setEditDesc(item.outrosDescontos);
    setEditOpen(true);
  };

  const saveEdit = () => {
    if (!editItem) return;
    const func = funcionariosMock.find((f) => f.id === editItem.funcionarioId);
    if (!func) return;
    const updated = buildFolhaItem(func, editHE, editBon, editDesc);
    setFolha((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
    setEditOpen(false);
    toast.success("Folha atualizada!");
  };

  const gerarReciboPDF = (item: FolhaItem) => {
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const w = doc.internal.pageSize.getWidth();
    const mL = 8;
    const mR = w - 8;
    const cW = mR - mL;
    const mesNome = new Date(2026, parseInt(mes) - 1).toLocaleString("pt-BR", { month: "long" });
    const mesNomeCap = mesNome.charAt(0).toUpperCase() + mesNome.slice(1);
    const ultimoDia = new Date(parseInt(ano), parseInt(mes), 0).getDate();

    const colCod = mL;
    const colDesc = mL + 14;
    const colRef = mL + 85;
    const colVenc = mL + 115;
    const colDescCol = mL + 150;

    const rows: { cod: string; desc: string; ref: string; venc: string; desconto: string }[] = [
      { cod: "001", desc: "Salário Base", ref: "30 dias", venc: fmt(item.salarioBase), desconto: "" },
      ...(item.horasExtras > 0 ? [{ cod: "002", desc: "Horas Extras 50%", ref: `${item.horasExtras}h`, venc: fmt(item.valorHorasExtras), desconto: "" }] : []),
      ...(item.bonificacao > 0 ? [{ cod: "003", desc: "Bonificação / Gratificação", ref: "", venc: fmt(item.bonificacao), desconto: "" }] : []),
      { cod: "101", desc: "INSS", ref: "", venc: "", desconto: fmt(item.inss) },
      ...(item.irrf > 0 ? [{ cod: "102", desc: "IRRF", ref: "", venc: "", desconto: fmt(item.irrf) }] : []),
      { cod: "103", desc: "Vale Transporte (6%)", ref: "", venc: "", desconto: fmt(item.valeTransporte) },
      ...(item.outrosDescontos > 0 ? [{ cod: "199", desc: "Outros Descontos", ref: "", venc: "", desconto: fmt(item.outrosDescontos) }] : []),
    ];

    const drawVia = (startY: number, viaLabel: string) => {
      let y = startY;
      const line = (yy: number) => { doc.setLineWidth(0.2); doc.line(mL, yy, mR, yy); };
      const box = (x: number, yy: number, bw: number, h: number) => { doc.setLineWidth(0.2); doc.rect(x, yy, bw, h); };
      const vLine = (x: number, y1: number, y2: number) => { doc.setLineWidth(0.2); doc.line(x, y1, x, y2); };

      // Header
      box(mL, y, cW, 7);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.text("DEMONSTRATIVO DE PAGAMENTO DE SALÁRIO", w / 2, y + 4.8, { align: "center" });
      doc.setFontSize(6);
      doc.setFont("helvetica", "normal");
      doc.text(viaLabel, mR - 2, y + 4.8, { align: "right" });
      y += 7;

      // Empresa + Período
      box(mL, y, cW / 2, 9);
      box(mL + cW / 2, y, cW / 2, 9);
      doc.setFontSize(6);
      doc.setFont("helvetica", "bold");
      doc.text("EMPREGADOR:", mL + 1.5, y + 3.5);
      doc.setFont("helvetica", "normal");
      doc.text("iEscolas Plataforma Educacional", mL + 22, y + 3.5);
      doc.setFont("helvetica", "bold");
      doc.text("CNPJ:", mL + 1.5, y + 7);
      doc.setFont("helvetica", "normal");
      doc.text("00.000.000/0001-00", mL + 11, y + 7);

      const rxStart = mL + cW / 2;
      doc.setFont("helvetica", "bold");
      doc.text("COMPETÊNCIA:", rxStart + 1.5, y + 3.5);
      doc.setFont("helvetica", "normal");
      doc.text(`${mesNomeCap} / ${ano}`, rxStart + 22, y + 3.5);
      doc.setFont("helvetica", "bold");
      doc.text("PERÍODO:", rxStart + 1.5, y + 7);
      doc.setFont("helvetica", "normal");
      doc.text(`01/${mes}/${ano} a ${ultimoDia}/${mes}/${ano}`, rxStart + 16, y + 7);
      y += 9;

      // Funcionário
      box(mL, y, cW, 9);
      doc.setFont("helvetica", "bold");
      doc.text("FUNCIONÁRIO:", mL + 1.5, y + 3.5);
      doc.setFont("helvetica", "normal");
      doc.text(item.nome.toUpperCase(), mL + 22, y + 3.5);
      doc.setFont("helvetica", "bold");
      doc.text("CARGO:", mL + 1.5, y + 7);
      doc.setFont("helvetica", "normal");
      doc.text(item.cargo, mL + 13, y + 7);
      doc.setFont("helvetica", "bold");
      doc.text("ADMISSÃO:", mR - 45, y + 7);
      doc.setFont("helvetica", "normal");
      const func = funcionariosMock.find(f => f.id === item.funcionarioId);
      if (func) {
        const [ay, am, ad] = func.admissao.split("-");
        doc.text(`${ad}/${am}/${ay}`, mR - 30, y + 7);
      }
      y += 9;

      // Table header
      const thY = y;
      box(mL, thY, cW, 6);
      doc.setFontSize(6);
      doc.setFont("helvetica", "bold");
      doc.text("CÓD.", colCod + 1.5, thY + 4);
      doc.text("DESCRIÇÃO", colDesc + 1, thY + 4);
      doc.text("REF.", colRef + 1, thY + 4);
      doc.text("VENCIMENTOS", colVenc + 1, thY + 4);
      doc.text("DESCONTOS", colDescCol + 1, thY + 4);
      vLine(colDesc, thY, thY + 6);
      vLine(colRef, thY, thY + 6);
      vLine(colVenc, thY, thY + 6);
      vLine(colDescCol, thY, thY + 6);
      y += 6;

      // Table body
      const bodyStart = y;
      const rH = 4.5;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(6);
      rows.forEach((r) => {
        doc.text(r.cod, colCod + 1.5, y + 3.2);
        doc.text(r.desc, colDesc + 1, y + 3.2);
        doc.text(r.ref, colRef + 1, y + 3.2);
        if (r.venc) doc.text(r.venc, colVenc + 33, y + 3.2, { align: "right" });
        if (r.desconto) doc.text(r.desconto, colDescCol + 33, y + 3.2, { align: "right" });
        y += rH;
      });
      // Empty rows
      const minR = 8;
      const empty = Math.max(0, minR - rows.length);
      for (let i = 0; i < empty; i++) y += rH;

      // Body box + vertical lines
      box(mL, bodyStart, cW, y - bodyStart);
      vLine(colDesc, bodyStart, y);
      vLine(colRef, bodyStart, y);
      vLine(colVenc, bodyStart, y);
      vLine(colDescCol, bodyStart, y);

      // Totals
      box(mL, y, cW, 6);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(6);
      doc.text("TOTAIS", colDesc + 1, y + 4);
      doc.text(fmt(item.totalProventos), colVenc + 33, y + 4, { align: "right" });
      doc.text(fmt(item.totalDescontos), colDescCol + 33, y + 4, { align: "right" });
      vLine(colDesc, y, y + 6);
      vLine(colRef, y, y + 6);
      vLine(colVenc, y, y + 6);
      vLine(colDescCol, y, y + 6);
      y += 6;

      // Valor Líquido
      box(mL, y, cW, 7);
      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      doc.text("VALOR LÍQUIDO A RECEBER:", mL + 2, y + 4.8);
      doc.setFontSize(9);
      doc.text(fmt(item.liquido), mR - 3, y + 5, { align: "right" });
      y += 7;

      // Bases de cálculo
      box(mL, y, cW, 8);
      doc.setFontSize(5.5);
      const bases = [
        { l: "Salário Base", v: fmt(item.salarioBase) },
        { l: "Base INSS", v: fmt(item.totalProventos) },
        { l: "Base FGTS", v: fmt(item.totalProventos) },
        { l: "FGTS Mês", v: fmt(item.totalProventos * 0.08) },
        { l: "Base IRRF", v: fmt(item.totalProventos - item.inss) },
      ];
      const bW = cW / bases.length;
      bases.forEach((b, i) => {
        const x = mL + i * bW;
        doc.setFont("helvetica", "bold");
        doc.text(b.l, x + 1.5, y + 3.5);
        doc.setFont("helvetica", "normal");
        doc.text(b.v, x + 1.5, y + 6.5);
        if (i > 0) vLine(x, y, y + 8);
      });
      y += 8;

      // Assinatura
      y += 3;
      doc.setFontSize(5.5);
      doc.setFont("helvetica", "normal");
      doc.text("DECLARO TER RECEBIDO A IMPORTÂNCIA LÍQUIDA DISCRIMINADA NESTE RECIBO.", w / 2, y, { align: "center" });
      y += 8;
      doc.setLineWidth(0.15);
      doc.line(mL + 5, y, mL + 55, y);
      doc.line(mR - 70, y, mR - 5, y);
      doc.setFontSize(5.5);
      doc.text("___/___/______", mL + 30, y + 3.5, { align: "center" });
      doc.text("ASSINATURA DO FUNCIONÁRIO", mR - 37.5, y + 3.5, { align: "center" });

      return y + 6;
    };

    // 1ª Via - Empresa
    let endY = drawVia(10, "1ª Via - Empresa");

    // Linha de corte
    endY += 3;
    doc.setLineDashPattern([2, 2], 0);
    doc.setLineWidth(0.3);
    doc.line(mL, endY, mR, endY);
    doc.setFontSize(5);
    doc.setFont("helvetica", "normal");
    doc.text("✂ Corte aqui", w / 2, endY - 1, { align: "center" });
    doc.setLineDashPattern([], 0);
    endY += 3;

    // 2ª Via - Funcionário
    drawVia(endY, "2ª Via - Funcionário");

    doc.save(`recibo_${item.nome.replace(/\s+/g, "_")}_${mes}_${ano}.pdf`);
    toast.success("Recibo gerado em PDF!");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Folha de Pagamento</h1>
          <p className="text-muted-foreground">Gerencie a folha de pagamento e gere recibos dos funcionários</p>
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
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-full p-3 bg-primary/10">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Bruto</p>
              <p className="text-xl font-bold">{fmt(totalBruto)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-full p-3 bg-emerald-500/10">
              <Calculator className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Líquido</p>
              <p className="text-xl font-bold">{fmt(totalLiquido)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-full p-3 bg-amber-500/10">
              <FileText className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Funcionários</p>
              <p className="text-xl font-bold">{folha.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar funcionário..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Folha — {new Date(2026, parseInt(mes) - 1).toLocaleString("pt-BR", { month: "long" })} / {ano}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Funcionário</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead className="text-right">Sal. Base</TableHead>
                <TableHead className="text-right">Proventos</TableHead>
                <TableHead className="text-right">Descontos</TableHead>
                <TableHead className="text-right">Líquido</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.nome}</TableCell>
                  <TableCell className="text-muted-foreground">{item.cargo}</TableCell>
                  <TableCell className="text-right">{fmt(item.salarioBase)}</TableCell>
                  <TableCell className="text-right text-emerald-600">{fmt(item.totalProventos)}</TableCell>
                  <TableCell className="text-right text-red-500">{fmt(item.totalDescontos)}</TableCell>
                  <TableCell className="text-right font-bold">{fmt(item.liquido)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost" onClick={() => openEdit(item)} title="Editar">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => { setViewItem(item); setViewOpen(true); }} title="Detalhes">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => gerarReciboPDF(item)} title="Gerar Recibo PDF">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Folha — {editItem?.nome}</DialogTitle>
            <DialogDescription>Ajuste horas extras, bonificações e descontos.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Horas Extras</Label>
              <Input type="number" value={editHE} onChange={(e) => setEditHE(Number(e.target.value))} min={0} />
            </div>
            <div className="space-y-2">
              <Label>Bonificação (R$)</Label>
              <Input type="number" value={editBon} onChange={(e) => setEditBon(Number(e.target.value))} min={0} />
            </div>
            <div className="space-y-2">
              <Label>Outros Descontos (R$)</Label>
              <Input type="number" value={editDesc} onChange={(e) => setEditDesc(Number(e.target.value))} min={0} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancelar</Button>
            <Button onClick={saveEdit}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detalhes — {viewItem?.nome}</DialogTitle>
          </DialogHeader>
          {viewItem && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cargo</p>
                <p className="font-medium">{viewItem.cargo}</p>
              </div>
              <Separator />
              <p className="text-sm font-medium">Proventos</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between"><span>Salário Base</span><span>{fmt(viewItem.salarioBase)}</span></div>
                <div className="flex justify-between"><span>Horas Extras ({viewItem.horasExtras}h)</span><span>{fmt(viewItem.valorHorasExtras)}</span></div>
                <div className="flex justify-between"><span>Bonificação</span><span>{fmt(viewItem.bonificacao)}</span></div>
                <div className="flex justify-between font-bold border-t pt-1"><span>Total Proventos</span><span className="text-emerald-600">{fmt(viewItem.totalProventos)}</span></div>
              </div>
              <Separator />
              <p className="text-sm font-medium">Descontos</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between"><span>INSS</span><span>{fmt(viewItem.inss)}</span></div>
                <div className="flex justify-between"><span>IRRF</span><span>{fmt(viewItem.irrf)}</span></div>
                <div className="flex justify-between"><span>Vale Transporte</span><span>{fmt(viewItem.valeTransporte)}</span></div>
                <div className="flex justify-between"><span>Outros</span><span>{fmt(viewItem.outrosDescontos)}</span></div>
                <div className="flex justify-between font-bold border-t pt-1"><span>Total Descontos</span><span className="text-red-500">{fmt(viewItem.totalDescontos)}</span></div>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Valor Líquido</span>
                <span className="text-primary">{fmt(viewItem.liquido)}</span>
              </div>
              <Button className="w-full" onClick={() => gerarReciboPDF(viewItem)}>
                <Download className="mr-2 h-4 w-4" /> Gerar Recibo PDF
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
