import { useState, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useAlunosResponsaveis } from "@/contexts/AlunosResponsaveisContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IdCard, CreditCard, Download, Upload, Camera } from "lucide-react";
import { toast } from "sonner";

// ── PDF helpers ──

function readFileAsDataURL(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Falha ao ler arquivo"));
    reader.readAsDataURL(file);
  });
}

function dataUrlToUint8Array(dataUrl: string) {
  const base64 = dataUrl.split(",")[1] || "";
  const bin = atob(base64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

function convertToJpegDataUrl(dataUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (/^data:image\/jpeg/i.test(dataUrl)) {
      resolve(dataUrl);
      return;
    }
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("Canvas não suportado")); return; }
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/jpeg", 0.92));
    };
    img.onerror = () => reject(new Error("Falha ao carregar imagem para conversão"));
    img.src = dataUrl;
  });
}

function escapePdfText(text: string) {
  return String(text).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function buildSimplePdf(params: {
  title: string;
  alunoNome: string;
  matricula: string;
  escolaNome: string;
  escolaCidadeUf: string;
  fotoDataUrl?: string;
  isCarteirinha: boolean;
}) {
  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const cardW = 242;
  const cardH = 153;
  const x = (pageWidth - cardW) / 2;
  const y = pageHeight - 180;
  const rectBorder = `${x} ${y} ${cardW} ${cardH} re S`;
  const headerH = 28;
  const headerFill = `${x} ${y + cardH - headerH} ${cardW} ${headerH} re f`;
  const fotoX = x + 12;
  const fotoY = y + 44;
  const fotoW = 54;
  const fotoH = 70;
  const textX = x + 78;

  const alunoNome = params.alunoNome || "Aluno";
  const matricula = params.matricula || "---";
  const escolaNome = params.escolaNome || "Escola";
  const escolaCidadeUf = params.escolaCidadeUf || "";

  const objects: string[] = [];
  const offsets: number[] = [];
  const pushObject = (content: string) => { objects.push(content); };

  pushObject("<< /Type /Catalog /Pages 2 0 R >>");
  pushObject("<< /Type /Pages /Kids [3 0 R] /Count 1 >>");

  const isJpegDataUrl = Boolean(params.fotoDataUrl && /^data:image\/jpeg/i.test(params.fotoDataUrl));
  const imgBytes = isJpegDataUrl && params.fotoDataUrl ? dataUrlToUint8Array(params.fotoDataUrl) : null;
  const hasImage = Boolean(imgBytes && imgBytes.length);

  const xObjectRef = hasImage ? "/XObject << /Im0 6 0 R >>" : "";
  pushObject(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 4 0 R >> ${xObjectRef} >> /Contents 5 0 R >>`);
  pushObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");

  const title = params.isCarteirinha ? "CARTEIRINHA DO ALUNO" : "CRACHÁ DO ALUNO";
  const contentParts: string[] = [];
  contentParts.push("q", "0 0 0 RG", rectBorder, "0.07 0.62 0.45 rg", headerFill);
  contentParts.push("BT", "1 1 1 rg", "/F1 12 Tf", `${x + 12} ${y + cardH - 20} Td`, `(${escapePdfText(title)}) Tj`, "ET");
  contentParts.push("0 0 0 RG", `${fotoX} ${fotoY} ${fotoW} ${fotoH} re S`);

  if (hasImage) {
    contentParts.push("q", `${fotoW} 0 0 ${fotoH} ${fotoX} ${fotoY} cm`, "/Im0 Do", "Q");
  } else {
    contentParts.push("BT", "0.35 0.35 0.35 rg", "/F1 7 Tf", `${fotoX + 8} ${fotoY + fotoH / 2} Td`, "(Foto) Tj", "ET");
  }

  contentParts.push("BT", "0 0 0 rg", "/F1 10 Tf", `${textX} ${y + 118} Td`);
  contentParts.push(`(Nome: ${escapePdfText(alunoNome)}) Tj`);
  contentParts.push(`0 -14 Td (Matrícula: ${escapePdfText(matricula)}) Tj`);
  contentParts.push(`0 -14 Td (Escola: ${escapePdfText(escolaNome)}) Tj`);
  if (escolaCidadeUf) contentParts.push(`0 -14 Td (${escapePdfText(escolaCidadeUf)}) Tj`);
  contentParts.push("ET");

  contentParts.push("BT", "0.25 0.25 0.25 rg", "/F1 7 Tf", `${x + 12} ${y + 16} Td`);
  contentParts.push(`(Gerado em ${escapePdfText(new Date().toLocaleString("pt-BR"))}) Tj`, "ET", "Q");

  const stream = contentParts.join("\n");
  pushObject(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);

  if (hasImage) {
    pushObject(`<< /Type /XObject /Subtype /Image /Name /Im0 /Width 1 /Height 1 /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${imgBytes!.length} >>\nstream\n__BINARY_IMAGE__\nendstream`);
  }

  let pdf = "%PDF-1.4\n";
  const binaryMarker = "__BINARY_IMAGE__";

  for (let i = 0; i < objects.length; i++) {
    offsets[i] = pdf.length;
    pdf += `${i + 1} 0 obj\n${objects[i]}\nendobj\n`;
  }

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += `0000000000 65535 f \n`;
  for (let i = 0; i < objects.length; i++) {
    pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  if (hasImage) {
    const idx = pdf.indexOf(binaryMarker);
    if (idx !== -1) {
      const encoder = new TextEncoder();
      const before = encoder.encode(pdf.slice(0, idx));
      const after = encoder.encode(pdf.slice(idx + binaryMarker.length));
      const out = new Uint8Array(before.length + imgBytes!.length + after.length);
      out.set(before, 0);
      out.set(imgBytes!, before.length);
      out.set(after, before.length + imgBytes!.length);
      return out;
    }
  }

  return new TextEncoder().encode(pdf);
}

function downloadBytes(bytes: Uint8Array, filename: string) {
  const blob = new Blob([bytes as unknown as BlobPart], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ── Component ──

export default function Carteirinha() {
  const { user } = useAuth();
  const { alunos } = useAlunosResponsaveis();
  const [fotoLocal, setFotoLocal] = useState<string>(() =>
    localStorage.getItem("aluno:foto") || localStorage.getItem("profile:photo") || ""
  );

  const alunoAtual = useMemo(() => alunos.find((a) => a.nome === user?.name), [alunos, user?.name]);

  const alunoNome = user?.name || "Aluno";
  const matricula = (alunoAtual as any)?.matricula || (alunoAtual as any)?.registro || "---";
  const fotoDataUrl = (alunoAtual as any)?.fotoUrl || fotoLocal;
  const escolaNome = (user as any)?.schoolName || (user as any)?.escolaNome || "iESCOLAS";
  const escolaCidadeUf = (user as any)?.schoolCityUf || (user as any)?.escolaCidadeUf || "";

  const initials = alunoNome
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("") || "AL";

  const handleUploadFoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Selecione um arquivo de imagem.");
      return;
    }
    try {
      const rawDataUrl = await readFileAsDataURL(file);
      const jpegDataUrl = await convertToJpegDataUrl(rawDataUrl);
      localStorage.setItem("aluno:foto", jpegDataUrl);
      setFotoLocal(jpegDataUrl);
      toast.success("Foto atualizada com sucesso!");
    } catch {
      toast.error("Erro ao carregar a foto.");
    }
    e.target.value = "";
  };

  const handleGerarPdf = (isCarteirinha: boolean) => {
    const bytes = buildSimplePdf({
      title: isCarteirinha ? "Carteirinha" : "Crachá",
      alunoNome,
      matricula,
      escolaNome,
      escolaCidadeUf,
      fotoDataUrl: fotoDataUrl || undefined,
      isCarteirinha,
    });
    downloadBytes(bytes, isCarteirinha ? "carteirinha-aluno.pdf" : "cracha-aluno.pdf");
    toast.success(`${isCarteirinha ? "Carteirinha" : "Crachá"} gerado com sucesso!`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <IdCard className="h-6 w-6 text-primary" />
          Crachá e Carteirinha
        </h1>
        <p className="text-muted-foreground mt-1">
          Visualize e baixe seu documento de identificação escolar.
        </p>
      </div>

      {/* Dados do aluno */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Seus Dados</CardTitle>
          <CardDescription>Informações exibidas no documento</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start gap-6">
            {/* Foto */}
            <div className="flex flex-col items-center gap-3">
              <Avatar className="h-28 w-28 border-4 border-primary/20">
                <AvatarImage src={fotoDataUrl || "/placeholder.svg"} alt={alunoNome} />
                <AvatarFallback className="text-2xl bg-primary/10 text-primary font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleUploadFoto}
                />
                <Button variant="outline" size="sm" asChild>
                  <span>
                    <Camera className="h-4 w-4 mr-1" />
                    Alterar foto
                  </span>
                </Button>
              </label>
            </div>

            {/* Info */}
            <div className="flex-1 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">Nome</span>
                  <p className="font-semibold text-foreground">{alunoNome}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">Matrícula</span>
                  <p className="font-semibold text-foreground">{matricula}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">Escola</span>
                  <p className="font-semibold text-foreground">{escolaNome}</p>
                </div>
                {escolaCidadeUf && (
                  <div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Cidade/UF</span>
                    <p className="font-semibold text-foreground">{escolaCidadeUf}</p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Badge variant="outline" className="text-xs">
                  {fotoDataUrl ? "✅ Foto pronta para o PDF" : "⚠️ Envie uma foto para o PDF"}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview e Downloads */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Visualização e Download</CardTitle>
          <CardDescription>Escolha o formato do documento</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="carteirinha" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="carteirinha" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Carteirinha
              </TabsTrigger>
              <TabsTrigger value="cracha" className="flex items-center gap-2">
                <IdCard className="h-4 w-4" />
                Crachá
              </TabsTrigger>
            </TabsList>

            <TabsContent value="carteirinha" className="mt-4">
              <div className="flex flex-col items-center gap-4">
                {/* Preview visual */}
                <div className="w-full max-w-sm aspect-[85.6/53.98] rounded-xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10 p-4 flex flex-col justify-between shadow-lg">
                  <div className="bg-primary rounded-lg px-3 py-1.5 text-primary-foreground text-xs font-bold tracking-wide">
                    CARTEIRINHA DO ALUNO
                  </div>
                  <div className="flex gap-3 flex-1 items-center mt-2">
                    <Avatar className="h-14 w-14 border-2 border-primary/30">
                      <AvatarImage src={fotoDataUrl || "/placeholder.svg"} alt={alunoNome} />
                      <AvatarFallback className="text-sm">{initials}</AvatarFallback>
                    </Avatar>
                    <div className="text-xs space-y-0.5">
                      <p className="font-bold text-foreground">{alunoNome}</p>
                      <p className="text-muted-foreground">Mat: {matricula}</p>
                      <p className="text-muted-foreground">{escolaNome}</p>
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-foreground/60 text-right">
                    {new Date().toLocaleDateString("pt-BR")}
                  </p>
                </div>

                <Button onClick={() => handleGerarPdf(true)} className="w-full max-w-sm">
                  <Download className="h-4 w-4 mr-2" />
                  Baixar Carteirinha (PDF)
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="cracha" className="mt-4">
              <div className="flex flex-col items-center gap-4">
                {/* Preview visual crachá - vertical */}
                <div className="w-48 aspect-[53.98/85.6] rounded-xl border-2 border-primary/30 bg-gradient-to-b from-primary/5 to-primary/10 p-3 flex flex-col items-center justify-between shadow-lg">
                  <div className="bg-primary rounded-lg px-3 py-1.5 text-primary-foreground text-[10px] font-bold tracking-wide text-center w-full">
                    CRACHÁ DO ALUNO
                  </div>
                  <Avatar className="h-16 w-16 border-2 border-primary/30 mt-2">
                    <AvatarImage src={fotoDataUrl || "/placeholder.svg"} alt={alunoNome} />
                    <AvatarFallback className="text-lg">{initials}</AvatarFallback>
                  </Avatar>
                  <div className="text-center space-y-0.5 mt-1">
                    <p className="font-bold text-xs text-foreground">{alunoNome}</p>
                    <p className="text-[10px] text-muted-foreground">Mat: {matricula}</p>
                    <p className="text-[10px] text-muted-foreground">{escolaNome}</p>
                  </div>
                  <p className="text-[8px] text-muted-foreground/60">
                    {new Date().toLocaleDateString("pt-BR")}
                  </p>
                </div>

                <Button variant="outline" onClick={() => handleGerarPdf(false)} className="w-full max-w-sm">
                  <Download className="h-4 w-4 mr-2" />
                  Baixar Crachá (PDF)
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Dicas */}
      <Card className="border-dashed">
        <CardContent className="pt-4">
          <div className="text-sm text-muted-foreground space-y-2">
            <p className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              <span>Use o botão <strong>"Alterar foto"</strong> acima para enviar sua foto.</span>
            </p>
            <p className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              <span>Fotos <strong>PNG ou JPEG</strong> são aceitas — a conversão para JPEG é automática.</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
