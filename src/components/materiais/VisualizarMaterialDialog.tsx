import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Material {
  id: string;
  titulo: string;
  tipo: string;
  arquivo_url?: string;
  url_externa?: string;
}

interface VisualizarMaterialDialogProps {
  material: Material | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function VisualizarMaterialDialog({
  material,
  open,
  onOpenChange,
}: VisualizarMaterialDialogProps) {
  if (!material) return null;

  const url = material.arquivo_url || material.url_externa;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{material.titulo}</DialogTitle>
        </DialogHeader>
        <div className="mt-2 flex items-center justify-center min-h-[400px]">
          {!url ? (
            <p className="text-muted-foreground">Arquivo não disponível para visualização.</p>
          ) : material.tipo === "imagem" ? (
            <img
              src={url}
              alt={material.titulo}
              className="max-w-full max-h-[70vh] rounded-lg object-contain"
            />
          ) : (
            <iframe
              src={url}
              title={material.titulo}
              className="w-full h-[70vh] rounded-lg border-0"
              allowFullScreen
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
