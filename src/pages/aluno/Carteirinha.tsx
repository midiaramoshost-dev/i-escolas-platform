import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useAlunosResponsaveis } from "@/contexts/AlunosResponsaveisContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IdCard, CreditCard, Download, Upload, Camera, QrCode, Printer } from "lucide-react";
import { toast } from "sonner";
import {
  readFileAsDataURL,
  convertToJpegDataUrl,
  buildSimplePdf,
  downloadBytes,
} from "@/lib/carteirinha/pdf-helpers";
import {
  buildQrPayload,
  generateQrDataUrl,
  generateQrJpegDataUrl,
} from "@/lib/carteirinha/qr-helpers";

export default function Carteirinha() {
  const { user } = useAuth();
  const { alunos } = useAlunosResponsaveis();
  const [fotoLocal, setFotoLocal] = useState<string>(() =>
    localStorage.getItem("aluno:foto") || localStorage.getItem("profile:photo") || ""
  );
  const [qrPngDataUrl, setQrPngDataUrl] = useState<string>("");
  const [qrJpegDataUrl, setQrJpegDataUrl] = useState<string>("");

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

  // Generate QR code whenever student data changes
  useEffect(() => {
    const payload = buildQrPayload({ nome: alunoNome, matricula, escola: escolaNome });
    generateQrDataUrl(payload).then(setQrPngDataUrl).catch(() => {});
    generateQrJpegDataUrl(payload).then(setQrJpegDataUrl).catch(() => {});
  }, [alunoNome, matricula, escolaNome]);

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
      qrDataUrl: qrJpegDataUrl || undefined,
      isCarteirinha,
    });
    downloadBytes(bytes, isCarteirinha ? "carteirinha-aluno.pdf" : "cracha-aluno.pdf");
    toast.success(`${isCarteirinha ? "Carteirinha" : "Crachá"} gerado com sucesso!`);
  };

  const carteirinhaRef = useRef<HTMLDivElement>(null);
  const crachaRef = useRef<HTMLDivElement>(null);

  const handleImprimir = useCallback((ref: React.RefObject<HTMLDivElement | null>) => {
    const el = ref.current;
    if (!el) return;
    const printWindow = window.open("", "_blank", "width=600,height=500");
    if (!printWindow) {
      toast.error("Pop-ups bloqueados. Permita pop-ups para imprimir.");
      return;
    }
    const clone = el.cloneNode(true) as HTMLElement;
    // Inline all images as they already are data URLs
    printWindow.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Imprimir</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{display:flex;justify-content:center;align-items:center;min-height:100vh;background:#fff;font-family:system-ui,sans-serif;-webkit-print-color-adjust:exact;print-color-adjust:exact}
@media print{body{margin:0}}
</style></head><body></body></html>`);
    printWindow.document.close();
    // Copy computed styles as inline
    const sourceEl = el;
    const applyStyles = (src: Element, dest: Element) => {
      const computed = window.getComputedStyle(src);
      (dest as HTMLElement).style.cssText = computed.cssText;
      for (let i = 0; i < src.children.length; i++) {
        if (dest.children[i]) applyStyles(src.children[i], dest.children[i]);
      }
    };
    applyStyles(sourceEl, clone);
    printWindow.document.body.appendChild(clone);
    setTimeout(() => { printWindow.print(); }, 300);
  }, []);

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
                <input type="file" accept="image/*" className="hidden" onChange={handleUploadFoto} />
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
                <Badge variant="outline" className="text-xs">
                  <QrCode className="h-3 w-3 mr-1" />
                  {qrPngDataUrl ? "QR Code ativo" : "Gerando QR…"}
                </Badge>
              </div>
            </div>

            {/* QR Code preview */}
            {qrPngDataUrl && (
              <div className="flex flex-col items-center gap-1">
                <img src={qrPngDataUrl} alt="QR Code do aluno" className="h-24 w-24 rounded-md border border-border" />
                <span className="text-[10px] text-muted-foreground">QR de validação</span>
              </div>
            )}
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
                <div ref={carteirinhaRef} className="w-full max-w-sm aspect-[85.6/53.98] rounded-xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10 p-4 flex flex-col justify-between shadow-lg">
                  <div className="bg-primary rounded-lg px-3 py-1.5 text-primary-foreground text-xs font-bold tracking-wide">
                    CARTEIRINHA DO ALUNO
                  </div>
                  <div className="flex gap-3 flex-1 items-center mt-2">
                    <Avatar className="h-14 w-14 border-2 border-primary/30">
                      <AvatarImage src={fotoDataUrl || "/placeholder.svg"} alt={alunoNome} />
                      <AvatarFallback className="text-sm">{initials}</AvatarFallback>
                    </Avatar>
                    <div className="text-xs space-y-0.5 flex-1">
                      <p className="font-bold text-foreground">{alunoNome}</p>
                      <p className="text-muted-foreground">Mat: {matricula}</p>
                      <p className="text-muted-foreground">{escolaNome}</p>
                    </div>
                    {qrPngDataUrl && (
                      <img src={qrPngDataUrl} alt="QR" className="h-12 w-12 rounded" />
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground/60 text-right">
                    {new Date().toLocaleDateString("pt-BR")}
                  </p>
                </div>

                <div className="flex gap-2 w-full max-w-sm">
                  <Button onClick={() => handleGerarPdf(true)} className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Baixar PDF
                  </Button>
                  <Button variant="outline" onClick={() => handleImprimir(carteirinhaRef)}>
                    <Printer className="h-4 w-4 mr-2" />
                    Imprimir
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="cracha" className="mt-4">
              <div className="flex flex-col items-center gap-4">
                {/* Preview visual crachá - vertical */}
                <div ref={crachaRef} className="w-48 aspect-[53.98/85.6] rounded-xl border-2 border-primary/30 bg-gradient-to-b from-primary/5 to-primary/10 p-3 flex flex-col items-center justify-between shadow-lg">
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
                  {qrPngDataUrl && (
                    <img src={qrPngDataUrl} alt="QR" className="h-10 w-10 rounded mt-1" />
                  )}
                  <p className="text-[8px] text-muted-foreground/60">
                    {new Date().toLocaleDateString("pt-BR")}
                  </p>
                </div>

                <div className="flex gap-2 w-full max-w-sm">
                  <Button variant="outline" onClick={() => handleGerarPdf(false)} className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Baixar PDF
                  </Button>
                  <Button variant="outline" onClick={() => handleImprimir(crachaRef)}>
                    <Printer className="h-4 w-4 mr-2" />
                    Imprimir
                  </Button>
                </div>
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
            <p className="flex items-center gap-2">
              <QrCode className="h-4 w-4" />
              <span>O <strong>QR Code</strong> contém seus dados para validação rápida da carteirinha.</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
