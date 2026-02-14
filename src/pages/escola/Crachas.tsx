import { useState, useRef } from "react";
import {
  CreditCard,
  Search,
  Download,
  Printer,
  Check,
  User,
  Camera,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useAlunosResponsaveis, type Aluno } from "@/contexts/AlunosResponsaveisContext";
import jsPDF from "jspdf";

const turmasOptions = [
  "Todas", "1º Ano A", "1º Ano B", "2º Ano A", "3º Ano A", "4º Ano A",
  "5º Ano A", "6º Ano A", "7º Ano B", "8º Ano A", "9º Ano A",
];

// Helper: get photo from localStorage or return null
const getAlunoPhoto = (alunoId: string): string | null => {
  try {
    return localStorage.getItem(`aluno_foto_${alunoId}`);
  } catch {
    return null;
  }
};

// Helper: save photo to localStorage
const saveAlunoPhoto = (alunoId: string, base64: string) => {
  try {
    localStorage.setItem(`aluno_foto_${alunoId}`, base64);
  } catch {
    toast.error("Erro ao salvar foto. O armazenamento pode estar cheio.");
  }
};

// School mock data
const escolaInfo = {
  nome: "Colégio Exemplo",
  cnpj: "12.345.678/0001-00",
  endereco: "Rua das Escolas, 100 - São Paulo, SP",
  telefone: "(11) 3456-7890",
  anoLetivo: "2026",
};

export default function Crachas() {
  const { alunos } = useAlunosResponsaveis();
  const [search, setSearch] = useState("");
  const [turmaFilter, setTurmaFilter] = useState("Todas");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [tab, setTab] = useState("carteirinha");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadTargetId, setUploadTargetId] = useState<string | null>(null);

  const filtered = alunos.filter((a) => {
    const matchSearch = a.nome.toLowerCase().includes(search.toLowerCase()) ||
      a.matricula.includes(search);
    const matchTurma = turmaFilter === "Todas" || a.turma === turmaFilter;
    return matchSearch && matchTurma;
  });

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((a) => a.id)));
    }
  };

  const handlePhotoUpload = (alunoId: string) => {
    setUploadTargetId(alunoId);
    fileInputRef.current?.click();
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !uploadTargetId) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Selecione um arquivo de imagem.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      saveAlunoPhoto(uploadTargetId, base64);
      toast.success("Foto salva com sucesso!");
      // Force re-render
      setUploadTargetId(null);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // ── PDF Generation ──────────────────────────────────────────
  const generatePDF = (type: "carteirinha" | "cracha") => {
    const selected = alunos.filter((a) => selectedIds.has(a.id));
    if (selected.length === 0) {
      toast.error("Selecione pelo menos um aluno.");
      return;
    }

    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();

    if (type === "carteirinha") {
      generateCarteirinhas(doc, selected, pageW, pageH);
    } else {
      generateCrachas(doc, selected, pageW, pageH);
    }

    doc.save(`${type}_alunos.pdf`);
    toast.success(`${selected.length} ${type === "carteirinha" ? "carteirinha(s)" : "crachá(s)"} gerado(s)!`);
  };

  const generateCarteirinhas = (doc: jsPDF, alunos: Aluno[], pageW: number, pageH: number) => {
    // Card dimensions (credit card ratio ~85.6x54mm)
    const cardW = 86;
    const cardH = 54;
    const cols = 3;
    const rows = 3;
    const marginX = (pageW - cols * cardW) / (cols + 1);
    const marginY = (pageH - rows * cardH) / (rows + 1);

    alunos.forEach((aluno, i) => {
      if (i > 0 && i % (cols * rows) === 0) doc.addPage();
      const idx = i % (cols * rows);
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = marginX + col * (cardW + marginX);
      const y = marginY + row * (cardH + marginY);

      // Card border
      doc.setDrawColor(59, 130, 246);
      doc.setLineWidth(0.5);
      doc.roundedRect(x, y, cardW, cardH, 3, 3);

      // Header stripe
      doc.setFillColor(59, 130, 246);
      doc.rect(x, y, cardW, 12, "F");

      // School name
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.text(escolaInfo.nome.toUpperCase(), x + cardW / 2, y + 5, { align: "center" });
      doc.setFontSize(5);
      doc.setFont("helvetica", "normal");
      doc.text("CARTEIRA DE IDENTIFICAÇÃO ESCOLAR", x + cardW / 2, y + 9, { align: "center" });

      // Photo placeholder
      const photoSize = 20;
      const photoX = x + 5;
      const photoY = y + 15;
      const photo = getAlunoPhoto(aluno.id);

      if (photo) {
        try {
          doc.addImage(photo, "JPEG", photoX, photoY, photoSize, photoSize);
        } catch {
          doc.setFillColor(229, 231, 235);
          doc.rect(photoX, photoY, photoSize, photoSize, "F");
          doc.setTextColor(156, 163, 175);
          doc.setFontSize(6);
          doc.text("SEM\nFOTO", photoX + photoSize / 2, photoY + photoSize / 2 - 1, { align: "center" });
        }
      } else {
        doc.setFillColor(229, 231, 235);
        doc.rect(photoX, photoY, photoSize, photoSize, "F");
        doc.setTextColor(156, 163, 175);
        doc.setFontSize(6);
        doc.text("SEM\nFOTO", photoX + photoSize / 2, photoY + photoSize / 2 - 1, { align: "center" });
      }
      doc.setDrawColor(59, 130, 246);
      doc.rect(photoX, photoY, photoSize, photoSize);

      // Student info
      const infoX = photoX + photoSize + 4;
      doc.setTextColor(31, 41, 55);
      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      doc.text(aluno.nome, infoX, photoY + 4);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(6);
      doc.setTextColor(107, 114, 128);

      doc.text(`Matrícula: ${aluno.matricula}`, infoX, photoY + 9);
      doc.text(`Turma: ${aluno.turma}`, infoX, photoY + 13);
      doc.text(`Turno: ${aluno.turno}`, infoX, photoY + 17);

      // Footer
      doc.setFontSize(5);
      doc.setTextColor(156, 163, 175);
      doc.text(`Ano Letivo: ${escolaInfo.anoLetivo}`, x + 5, y + cardH - 4);
      doc.text(`Validade: 12/${escolaInfo.anoLetivo}`, x + cardW - 5, y + cardH - 4, { align: "right" });
    });
  };

  const generateCrachas = (doc: jsPDF, alunos: Aluno[], pageW: number, pageH: number) => {
    // Badge dimensions (vertical)
    const badgeW = 60;
    const badgeH = 85;
    const cols = 4;
    const rows = 2;
    const marginX = (pageW - cols * badgeW) / (cols + 1);
    const marginY = (pageH - rows * badgeH) / (rows + 1);

    alunos.forEach((aluno, i) => {
      if (i > 0 && i % (cols * rows) === 0) doc.addPage();
      const idx = i % (cols * rows);
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = marginX + col * (badgeW + marginX);
      const y = marginY + row * (badgeH + marginY);

      // Badge border
      doc.setDrawColor(59, 130, 246);
      doc.setLineWidth(0.5);
      doc.roundedRect(x, y, badgeW, badgeH, 3, 3);

      // Header
      doc.setFillColor(59, 130, 246);
      doc.rect(x, y, badgeW, 14, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      doc.text(escolaInfo.nome.toUpperCase(), x + badgeW / 2, y + 6, { align: "center" });
      doc.setFontSize(5);
      doc.setFont("helvetica", "normal");
      doc.text("ALUNO", x + badgeW / 2, y + 11, { align: "center" });

      // Photo
      const photoSize = 28;
      const photoX = x + (badgeW - photoSize) / 2;
      const photoY = y + 18;
      const photo = getAlunoPhoto(aluno.id);

      if (photo) {
        try {
          doc.addImage(photo, "JPEG", photoX, photoY, photoSize, photoSize);
        } catch {
          doc.setFillColor(229, 231, 235);
          doc.rect(photoX, photoY, photoSize, photoSize, "F");
          doc.setTextColor(156, 163, 175);
          doc.setFontSize(7);
          doc.text("SEM\nFOTO", photoX + photoSize / 2, photoY + photoSize / 2 - 1, { align: "center" });
        }
      } else {
        doc.setFillColor(229, 231, 235);
        doc.rect(photoX, photoY, photoSize, photoSize, "F");
        doc.setTextColor(156, 163, 175);
        doc.setFontSize(7);
        doc.text("SEM\nFOTO", photoX + photoSize / 2, photoY + photoSize / 2 - 1, { align: "center" });
      }
      doc.setDrawColor(59, 130, 246);
      doc.rect(photoX, photoY, photoSize, photoSize);

      // Name
      const nameY = photoY + photoSize + 6;
      doc.setTextColor(31, 41, 55);
      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      const nameLines = doc.splitTextToSize(aluno.nome, badgeW - 8);
      doc.text(nameLines, x + badgeW / 2, nameY, { align: "center" });

      // Info
      const infoY = nameY + nameLines.length * 4 + 2;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(6);
      doc.setTextColor(107, 114, 128);
      doc.text(`Mat: ${aluno.matricula}`, x + badgeW / 2, infoY, { align: "center" });
      doc.text(`${aluno.turma} | ${aluno.turno}`, x + badgeW / 2, infoY + 4, { align: "center" });

      // Footer
      doc.setFontSize(4.5);
      doc.setTextColor(156, 163, 175);
      doc.text(escolaInfo.anoLetivo, x + badgeW / 2, y + badgeH - 3, { align: "center" });
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Crachás e Carteirinhas</h1>
          <p className="text-muted-foreground">
            Gerencie fotos e gere crachás e carteirinhas dos alunos em PDF
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => generatePDF("cracha")}
            disabled={selectedIds.size === 0}
          >
            <Printer className="mr-2 h-4 w-4" />
            Gerar Crachás ({selectedIds.size})
          </Button>
          <Button
            onClick={() => generatePDF("carteirinha")}
            disabled={selectedIds.size === 0}
          >
            <Download className="mr-2 h-4 w-4" />
            Gerar Carteirinhas ({selectedIds.size})
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-full p-3 bg-primary/10">
              <CreditCard className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total de Alunos</p>
              <p className="text-xl font-bold">{alunos.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-full p-3 bg-emerald-500/10">
              <Camera className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Com Foto</p>
              <p className="text-xl font-bold">
                {alunos.filter((a) => getAlunoPhoto(a.id)).length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-full p-3 bg-amber-500/10">
              <User className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Sem Foto</p>
              <p className="text-xl font-bold">
                {alunos.filter((a) => !getAlunoPhoto(a.id)).length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou matrícula..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={turmaFilter} onValueChange={setTurmaFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Turma" />
          </SelectTrigger>
          <SelectContent>
            {turmasOptions.map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFileChange}
      />

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="carteirinha">
            <CreditCard className="mr-2 h-4 w-4" />
            Carteirinhas
          </TabsTrigger>
          <TabsTrigger value="cracha">
            <User className="mr-2 h-4 w-4" />
            Crachás
          </TabsTrigger>
        </TabsList>

        <TabsContent value="carteirinha" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Prévia da Carteirinha</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedIds.size > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {alunos.filter((a) => selectedIds.has(a.id)).slice(0, 6).map((aluno) => (
                    <CarteirinhaPreview key={aluno.id} aluno={aluno} />
                  ))}
                  {selectedIds.size > 6 && (
                    <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-border p-6">
                      <p className="text-sm text-muted-foreground">
                        +{selectedIds.size - 6} carteirinha(s) selecionada(s)
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Selecione alunos na tabela abaixo para ver a prévia das carteirinhas.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cracha" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Prévia do Crachá</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedIds.size > 0 ? (
                <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
                  {alunos.filter((a) => selectedIds.has(a.id)).slice(0, 8).map((aluno) => (
                    <CrachaPreview key={aluno.id} aluno={aluno} />
                  ))}
                  {selectedIds.size > 8 && (
                    <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-border p-6">
                      <p className="text-sm text-muted-foreground">
                        +{selectedIds.size - 8} crachá(s) selecionado(s)
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Selecione alunos na tabela abaixo para ver a prévia dos crachás.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Lista de Alunos</CardTitle>
            <Badge variant="secondary">{filtered.length} aluno(s)</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox
                    checked={selectedIds.size === filtered.length && filtered.length > 0}
                    onCheckedChange={toggleAll}
                  />
                </TableHead>
                <TableHead>Foto</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Matrícula</TableHead>
                <TableHead>Turma</TableHead>
                <TableHead>Turno</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((aluno) => {
                const photo = getAlunoPhoto(aluno.id);
                return (
                  <TableRow key={aluno.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.has(aluno.id)}
                        onCheckedChange={() => toggleSelect(aluno.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="h-10 w-10 rounded-full overflow-hidden bg-muted flex items-center justify-center border">
                        {photo ? (
                          <img src={photo} alt={aluno.nome} className="h-full w-full object-cover" />
                        ) : (
                          <User className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{aluno.nome}</TableCell>
                    <TableCell>{aluno.matricula}</TableCell>
                    <TableCell>{aluno.turma}</TableCell>
                    <TableCell>{aluno.turno}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePhotoUpload(aluno.id)}
                      >
                        <Camera className="mr-1 h-3 w-3" />
                        {photo ? "Trocar Foto" : "Adicionar Foto"}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Preview Components ────────────────────────────────────────

function CarteirinhaPreview({ aluno }: { aluno: Aluno }) {
  const photo = getAlunoPhoto(aluno.id);
  return (
    <div className="rounded-xl border-2 border-primary/30 overflow-hidden shadow-sm bg-card" style={{ aspectRatio: "86/54" }}>
      {/* Header */}
      <div className="bg-primary px-3 py-2">
        <p className="text-[10px] font-bold text-primary-foreground tracking-wider text-center">
          {escolaInfo.nome.toUpperCase()}
        </p>
        <p className="text-[7px] text-primary-foreground/80 text-center">
          CARTEIRA DE IDENTIFICAÇÃO ESCOLAR
        </p>
      </div>
      {/* Body */}
      <div className="flex gap-3 p-3">
        <div className="h-14 w-14 rounded border border-primary/30 overflow-hidden bg-muted flex items-center justify-center shrink-0">
          {photo ? (
            <img src={photo} alt={aluno.nome} className="h-full w-full object-cover" />
          ) : (
            <User className="h-6 w-6 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold truncate">{aluno.nome}</p>
          <p className="text-[9px] text-muted-foreground">Mat: {aluno.matricula}</p>
          <p className="text-[9px] text-muted-foreground">Turma: {aluno.turma}</p>
          <p className="text-[9px] text-muted-foreground">Turno: {aluno.turno}</p>
        </div>
      </div>
      {/* Footer */}
      <div className="flex justify-between px-3 pb-1">
        <span className="text-[7px] text-muted-foreground">Ano Letivo: {escolaInfo.anoLetivo}</span>
        <span className="text-[7px] text-muted-foreground">Validade: 12/{escolaInfo.anoLetivo}</span>
      </div>
    </div>
  );
}

function CrachaPreview({ aluno }: { aluno: Aluno }) {
  const photo = getAlunoPhoto(aluno.id);
  return (
    <div className="rounded-xl border-2 border-primary/30 overflow-hidden shadow-sm bg-card flex flex-col items-center" style={{ aspectRatio: "60/85" }}>
      {/* Header */}
      <div className="bg-primary w-full px-3 py-2">
        <p className="text-[9px] font-bold text-primary-foreground tracking-wider text-center">
          {escolaInfo.nome.toUpperCase()}
        </p>
        <p className="text-[7px] text-primary-foreground/80 text-center">ALUNO</p>
      </div>
      {/* Photo */}
      <div className="mt-3 h-16 w-16 rounded border border-primary/30 overflow-hidden bg-muted flex items-center justify-center">
        {photo ? (
          <img src={photo} alt={aluno.nome} className="h-full w-full object-cover" />
        ) : (
          <User className="h-8 w-8 text-muted-foreground" />
        )}
      </div>
      {/* Info */}
      <div className="flex-1 flex flex-col items-center justify-center px-2 text-center">
        <p className="text-[10px] font-bold leading-tight">{aluno.nome}</p>
        <p className="text-[8px] text-muted-foreground mt-1">Mat: {aluno.matricula}</p>
        <p className="text-[8px] text-muted-foreground">{aluno.turma} | {aluno.turno}</p>
      </div>
      {/* Footer */}
      <p className="text-[7px] text-muted-foreground pb-2">{escolaInfo.anoLetivo}</p>
    </div>
  );
}
