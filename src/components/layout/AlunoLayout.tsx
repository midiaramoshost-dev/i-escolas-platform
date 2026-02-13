import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AlunoSidebar } from "./AlunoSidebar";
import { AppHeader } from "./AppHeader";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useAlunosResponsaveis } from "@/contexts/AlunosResponsaveisContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const readFileAsDataURL = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Falha ao ler arquivo"));
    reader.readAsDataURL(file);
  });

function dataUrlToUint8Array(dataUrl: string) {
  const base64 = dataUrl.split(",")[1] || "";
  const bin = atob(base64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
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

  // Cartão (ID-1) ~ 85.6mm x 53.98mm => ~ 242 x 153 pt
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
  const pushObject = (content: string) => {
    objects.push(content);
  };

  // 1: Catalog
  pushObject("<< /Type /Catalog /Pages 2 0 R >>");
  // 2: Pages
  pushObject("<< /Type /Pages /Kids [3 0 R] /Count 1 >>");

  const imgBytes = params.fotoDataUrl ? dataUrlToUint8Array(params.fotoDataUrl) : null;
  const hasImage = Boolean(imgBytes && imgBytes.length);

  // 3: Page
  const xObjectRef = hasImage ? "/XObject << /Im0 6 0 R >>" : "";
  pushObject(
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 4 0 R >> ${xObjectRef} >> /Contents 5 0 R >>`,
  );

  // 4: Font
  pushObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");

  // 5: Contents
  const title = params.isCarteirinha ? "CARTEIRINHA DO ALUNO" : "CRACHÁ DO ALUNO";

  const contentParts: string[] = [];
  contentParts.push("q");
  // border
  contentParts.push("0 0 0 RG");
  contentParts.push(rectBorder);
  // header background
  contentParts.push("0.07 0.62 0.45 rg"); // verde/teal
  contentParts.push(headerFill);

  // header text
  contentParts.push("BT");
  contentParts.push("1 1 1 rg");
  contentParts.push("/F1 12 Tf");
  contentParts.push(`${x + 12} ${y + cardH - 20} Td`);
  contentParts.push(`(${escapePdfText(title)}) Tj`);
  contentParts.push("ET");

  // photo placeholder border
  contentParts.push("0 0 0 RG");
  contentParts.push(`${fotoX} ${fotoY} ${fotoW} ${fotoH} re S`);

  // image
  if (hasImage) {
    contentParts.push("q");
    contentParts.push(`${fotoW} 0 0 ${fotoH} ${fotoX} ${fotoY} cm`);
    contentParts.push("/Im0 Do");
    contentParts.push("Q");
  }

  // body text
  contentParts.push("BT");
  contentParts.push("0 0 0 rg");
  contentParts.push("/F1 10 Tf");
  contentParts.push(`${textX} ${y + 118} Td`);
  contentParts.push(`(Nome: ${escapePdfText(alunoNome)}) Tj`);
  contentParts.push(`0 -14 Td (Matrícula: ${escapePdfText(matricula)}) Tj`);
  contentParts.push(`0 -14 Td (Escola: ${escapePdfText(escolaNome)}) Tj`);
  if (escolaCidadeUf) {
    contentParts.push(`0 -14 Td (${escapePdfText(escolaCidadeUf)}) Tj`);
  }
  contentParts.push("ET");

  // footer small
  contentParts.push("BT");
  contentParts.push("0.25 0.25 0.25 rg");
  contentParts.push("/F1 7 Tf");
  contentParts.push(`${x + 12} ${y + 16} Td`);
  contentParts.push(`(Gerado em ${escapePdfText(new Date().toLocaleString("pt-BR"))}) Tj`);
  contentParts.push("ET");

  contentParts.push("Q");

  const stream = contentParts.join("\n");
  pushObject(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);

  // 6: Image XObject (JPEG) if any
  if (hasImage) {
    pushObject(
      `<< /Type /XObject /Subtype /Image /Name /Im0 /Width 1 /Height 1 /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${imgBytes!.length} >>\nstream\n__BINARY_IMAGE__\nendstream`,
    );
  }

  // Build PDF
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
    const off = String(offsets[i]).padStart(10, "0");
    pdf += `${off} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  // If image exists, replace marker by raw bytes inside the already built string.
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

export function AlunoLayout() {
  const { user } = useAuth();
  const { alunos } = useAlunosResponsaveis();

  const [openCarteirinha, setOpenCarteirinha] = useState(false);

  // VibeCoding: como não temos acesso aos formulários aqui, eu "plugo" um interceptador
  // leve no layout para capturar qualquer <input type="file" data-profile-photo="...">.
  // Quando o usuário escolher a imagem, salvamos um DataURL temporário no localStorage.
  useEffect(() => {
    const handler = async (ev: Event) => {
      const target = ev.target as HTMLInputElement | null;
      if (!target) return;
      if (target.tagName !== "INPUT") return;
      if (target.type !== "file") return;

      const key = target.getAttribute("data-profile-photo");
      if (!key) return;

      const file = target.files?.[0];
      if (!file) return;
      if (!file.type?.startsWith("image/")) return;

      try {
        const dataUrl = await readFileAsDataURL(file);
        localStorage.setItem(key, dataUrl);
      } catch {
        // silencioso: é temporário; o formulário pode tratar UX
      } finally {
        // permite reenviar o mesmo arquivo
        target.value = "";
      }
    };

    document.addEventListener("change", handler, true);
    return () => document.removeEventListener("change", handler, true);
  }, []);

  // VibeCoding: módulo de Carteirinha/Crachá "plugado" na rota /aluno/carteirinha
  const isCarteirinhaRoute = typeof window !== "undefined" && window.location.pathname === "/aluno/carteirinha";

  const alunoAtual = useMemo(() => {
    return alunos.find((a) => a.nome === user?.name);
  }, [alunos, user?.name]);

  const alunoNome = user?.name || "Aluno";
  const matricula = (alunoAtual as any)?.matricula || (alunoAtual as any)?.registro || "---";
  const fotoDataUrl =
    (alunoAtual as any)?.fotoUrl || localStorage.getItem("aluno:foto") || localStorage.getItem("profile:photo") || "";

  // Dados da escola (mínimo e fallback)
  const escolaNome = (user as any)?.schoolName || (user as any)?.escolaNome || "iESCOLAS";
  const escolaCidadeUf =
    (user as any)?.schoolCityUf || (user as any)?.escolaCidadeUf || (user as any)?.escolaCidade || "";

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
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AlunoSidebar />
        <SidebarInset className="flex flex-col flex-1">
          <AppHeader onOpenCarteirinha={() => setOpenCarteirinha(true)} />

          <main className="flex-1 overflow-auto p-6 animate-fade-in">
            {isCarteirinhaRoute ? (
              <div className="max-w-3xl mx-auto">
                <Card>
                  <CardHeader>
                    <CardTitle>Crachá e Carteirinha do Aluno</CardTitle>
                    <CardDescription>Gere seu PDF com foto, nome, matrícula e dados da escola.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={fotoDataUrl || "/placeholder.svg"} alt={alunoNome} />
                        <AvatarFallback>
                          {alunoNome
                            .split(" ")
                            .filter(Boolean)
                            .slice(0, 2)
                            .map((p) => p[0]?.toUpperCase())
                            .join("") || "AL"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <div className="text-sm">
                          <span className="text-muted-foreground">Nome: </span>
                          <span className="font-medium">{alunoNome}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Matrícula: </span>
                          <span className="font-medium">{matricula}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Escola: </span>
                          <span className="font-medium">{escolaNome}</span>
                          {escolaCidadeUf ? <span className="text-muted-foreground"> • {escolaCidadeUf}</span> : null}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Button onClick={() => handleGerarPdf(false)}>Baixar Crachá (PDF)</Button>
                      <Button variant="outline" onClick={() => handleGerarPdf(true)}>
                        Baixar Carteirinha (PDF)
                      </Button>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      Dica: para atualizar a foto, use um campo de upload que grave em <code>localStorage</code> com a
                      chave <code>aluno:foto</code> ou <code>profile:photo</code>.
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Outlet />
            )}
          </main>

          <Dialog open={openCarteirinha} onOpenChange={setOpenCarteirinha}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crachá e Carteirinha</DialogTitle>
                <DialogDescription>Gere seu PDF rapidamente.</DialogDescription>
              </DialogHeader>

              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14">
                  <AvatarImage src={fotoDataUrl || "/placeholder.svg"} alt={alunoNome} />
                  <AvatarFallback>
                    {alunoNome
                      .split(" ")
                      .filter(Boolean)
                      .slice(0, 2)
                      .map((p) => p[0]?.toUpperCase())
                      .join("") || "AL"}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <div className="text-sm font-medium">{alunoNome}</div>
                  <div className="text-xs text-muted-foreground">Matrícula: {matricula}</div>
                  <div className="text-xs text-muted-foreground">
                    {escolaNome}
                    {escolaCidadeUf ? ` • ${escolaCidadeUf}` : ""}
                  </div>
                </div>
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                <Button variant="outline" onClick={() => handleGerarPdf(false)}>
                  Baixar Crachá
                </Button>
                <Button onClick={() => handleGerarPdf(true)}>Baixar Carteirinha</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
