import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PlatformSettings {
  id: string;
  whatsapp_number: string;
  nome_plataforma: string;
  email_suporte: string;
  telefone_suporte: string;
  cor_primaria: string;
  cor_secundaria: string;
  logo_url: string | null;
  updated_at: string;
}

export function usePlatformSettings() {
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ["platform-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("platform_settings" as any)
        .select("*")
        .limit(1)
        .single();
      if (error) throw error;
      return data as unknown as PlatformSettings;
    },
    staleTime: 5 * 60 * 1000,
  });

  const updateSettings = useMutation({
    mutationFn: async (updates: Partial<Omit<PlatformSettings, "id" | "updated_at">>) => {
      if (!settings?.id) throw new Error("No settings found");
      const { error } = await supabase
        .from("platform_settings" as any)
        .update(updates as any)
        .eq("id", settings.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["platform-settings"] });
    },
  });

  const uploadLogo = async (file: File): Promise<string> => {
    const ext = file.name.split(".").pop();
    const filePath = `logo/logo-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("platform-assets")
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage
      .from("platform-assets")
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  };

  const whatsappNumber = settings?.whatsapp_number ?? "5515997625135";

  const openWhatsApp = (message: string) => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return { settings, isLoading, updateSettings, uploadLogo, whatsappNumber, openWhatsApp };
}
