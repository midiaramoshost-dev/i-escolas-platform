import { useState, useRef, useCallback, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScanLine, Upload, CheckCircle2, XCircle, ShieldCheck, User, School, Hash, CalendarDays } from "lucide-react";
import { toast } from "sonner";

interface CarteirinhaData {
  tipo: string;
  nome: string;
  matricula: string;
  escola: string;
  emitido: string;
}

function parseQrPayload(text: string): CarteirinhaData | null {
  try {
    const data = JSON.parse(text);
    if (data?.tipo === "carteirinha_aluno" && data.nome && data.matricula && data.escola) {
      return data as CarteirinhaData;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Decode QR from an image using canvas + jsQR-like approach.
 * We use the BarcodeDetector API (available in modern browsers) with fallback.
 */
async function decodeQrFromImage(file: File): Promise<string | null> {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.drawImage(bitmap, 0, 0);

  // Try BarcodeDetector API first (Chrome, Edge, etc.)
  if ("BarcodeDetector" in window) {
    try {
      // @ts-ignore - BarcodeDetector is not in all TS libs
      const detector = new BarcodeDetector({ formats: ["qr_code"] });
      const results = await detector.detect(canvas);
      if (results.length > 0) return results[0].rawValue;
    } catch { /* fallback below */ }
  }

  // Fallback: try reading from the image data manually won't work without a library.
  // Return null to show a helpful message.
  return null;
}

async function decodeQrFromCamera(video: HTMLVideoElement): Promise<string | null> {
  if (!("BarcodeDetector" in window)) return null;
  try {
    // @ts-ignore
    const detector = new BarcodeDetector({ formats: ["qr_code"] });
    const results = await detector.detect(video);
    if (results.length > 0) return results[0].rawValue;
  } catch { /* ignore */ }
  return null;
}

export default function VerificarCarteirinha() {
  const [result, setResult] = useState<CarteirinhaData | null>(null);
  const [error, setError] = useState<string>("");
  const [scanning, setScanning] = useState(false);
  const [hasBarcodeApi, setHasBarcodeApi] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    setHasBarcodeApi("BarcodeDetector" in window);
    return () => stopCamera();
  }, []);

  const stopCamera = useCallback(() => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setScanning(false);
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    setResult(null);
    setError("");

    const raw = await decodeQrFromImage(file);
    if (!raw) {
      setError("Não foi possível ler o QR Code da imagem. Use um navegador compatível (Chrome/Edge) ou tente com a câmera.");
      return;
    }

    const data = parseQrPayload(raw);
    if (!data) {
      setError("QR Code lido, mas não é uma carteirinha válida do iESCOLAS.");
      return;
    }

    setResult(data);
    toast.success("Carteirinha verificada com sucesso!");
  };

  const startCamera = async () => {
    if (!hasBarcodeApi) {
      toast.error("Seu navegador não suporta leitura de QR por câmera. Use Chrome ou Edge.");
      return;
    }

    setResult(null);
    setError("");
    setScanning(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 640 }, height: { ideal: 480 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      // Poll for QR every 500ms
      scanIntervalRef.current = window.setInterval(async () => {
        if (!videoRef.current) return;
        const raw = await decodeQrFromCamera(videoRef.current);
        if (raw) {
          const data = parseQrPayload(raw);
          if (data) {
            setResult(data);
            toast.success("Carteirinha verificada com sucesso!");
            stopCamera();
          }
        }
      }, 500);
    } catch {
      setError("Não foi possível acessar a câmera. Verifique as permissões.");
      setScanning(false);
    }
  };

  const handleManualInput = () => {
    const raw = prompt("Cole o conteúdo do QR Code (JSON):");
    if (!raw) return;
    setResult(null);
    setError("");
    const data = parseQrPayload(raw);
    if (!data) {
      setError("Dados inválidos. O conteúdo não corresponde a uma carteirinha do iESCOLAS.");
      return;
    }
    setResult(data);
    toast.success("Carteirinha verificada com sucesso!");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-2">
            <ShieldCheck className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Verificar Carteirinha</h1>
          <p className="text-muted-foreground text-sm">
            Escaneie ou envie uma imagem do QR Code da carteirinha para validar os dados do aluno.
          </p>
        </div>

        {/* Scanner / Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ler QR Code</CardTitle>
            <CardDescription>Escolha como deseja verificar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Camera area */}
            {scanning && (
              <div className="relative rounded-lg overflow-hidden border border-border bg-black aspect-[4/3]">
                <video ref={videoRef} className="w-full h-full object-cover" muted playsInline />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-48 h-48 border-2 border-primary/60 rounded-lg animate-pulse" />
                </div>
                <Badge className="absolute top-2 left-2 bg-primary/80">
                  <ScanLine className="h-3 w-3 mr-1 animate-pulse" />
                  Escaneando…
                </Badge>
              </div>
            )}

            <div className="grid grid-cols-1 gap-2">
              {!scanning ? (
                <Button onClick={startCamera} className="w-full" disabled={!hasBarcodeApi}>
                  <ScanLine className="h-4 w-4 mr-2" />
                  {hasBarcodeApi ? "Escanear com Câmera" : "Câmera não suportada"}
                </Button>
              ) : (
                <Button variant="destructive" onClick={stopCamera} className="w-full">
                  Parar Câmera
                </Button>
              )}

              <label className="cursor-pointer">
                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                <Button variant="outline" className="w-full" asChild>
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    Enviar Imagem do QR
                  </span>
                </Button>
              </label>

              <Button variant="ghost" size="sm" onClick={handleManualInput} className="text-xs text-muted-foreground">
                Inserir dados manualmente
              </Button>
            </div>

            {!hasBarcodeApi && (
              <p className="text-xs text-muted-foreground text-center">
                A leitura por câmera requer Chrome ou Edge. Você pode enviar uma imagem do QR Code.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Error */}
        {error && (
          <Card className="border-destructive/50">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Result */}
        {result && (
          <Card className="border-primary/50 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg text-primary">Carteirinha Válida</CardTitle>
              </div>
              <CardDescription>Dados do aluno verificados com sucesso</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Nome</span>
                    <p className="font-semibold text-foreground">{result.nome}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Matrícula</span>
                    <p className="font-semibold text-foreground">{result.matricula}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <School className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Escola</span>
                    <p className="font-semibold text-foreground">{result.escola}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Data de Emissão</span>
                    <p className="font-semibold text-foreground">
                      {new Date(result.emitido + "T00:00:00").toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          Verificação por <strong>iESCOLAS</strong> · Sistema de Gestão Escolar
        </p>
      </div>
    </div>
  );
}
