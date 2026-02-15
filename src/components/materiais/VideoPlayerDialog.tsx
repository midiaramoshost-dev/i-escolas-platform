import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Material {
  id: string;
  titulo: string;
  arquivo_url?: string;
  url_externa?: string;
}

interface VideoPlayerDialogProps {
  material: Material | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function getYouTubeEmbedUrl(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

export default function VideoPlayerDialog({
  material,
  open,
  onOpenChange,
}: VideoPlayerDialogProps) {
  if (!material) return null;

  const url = material.url_externa || material.arquivo_url;
  const youtubeEmbed = url ? getYouTubeEmbedUrl(url) : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{material.titulo}</DialogTitle>
        </DialogHeader>
        <div className="mt-2 flex items-center justify-center min-h-[400px]">
          {!url ? (
            <p className="text-muted-foreground">Vídeo não disponível.</p>
          ) : youtubeEmbed ? (
            <iframe
              src={youtubeEmbed}
              title={material.titulo}
              className="w-full aspect-video rounded-lg border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video
              src={url}
              controls
              className="w-full max-h-[70vh] rounded-lg"
            >
              Seu navegador não suporta a reprodução de vídeo.
            </video>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
