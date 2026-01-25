import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, BellOff, BellRing, Clock, AlertTriangle, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface NotificationSettings {
  enabled: boolean;
  daysBeforeDue: number[];
  notifyOnDue: boolean;
  notifyOverdue: boolean;
}

interface NotificacoesConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: NotificationSettings;
  onUpdateSettings: (settings: Partial<NotificationSettings>) => void;
  permissionGranted: boolean;
  onRequestPermission: () => Promise<boolean>;
}

const availableDays = [1, 2, 3, 5, 7];

export function NotificacoesConfigDialog({
  open,
  onOpenChange,
  settings,
  onUpdateSettings,
  permissionGranted,
  onRequestPermission,
}: NotificacoesConfigDialogProps) {
  const [localSettings, setLocalSettings] = useState<NotificationSettings>(settings);

  const handleSave = () => {
    onUpdateSettings(localSettings);
    toast({
      title: "Configurações salvas!",
      description: "Suas preferências de notificação foram atualizadas.",
    });
    onOpenChange(false);
  };

  const handleDayToggle = (day: number) => {
    const newDays = localSettings.daysBeforeDue.includes(day)
      ? localSettings.daysBeforeDue.filter(d => d !== day)
      : [...localSettings.daysBeforeDue, day].sort((a, b) => b - a);
    setLocalSettings({ ...localSettings, daysBeforeDue: newDays });
  };

  const handleEnableNotifications = async () => {
    const granted = await onRequestPermission();
    if (granted) {
      setLocalSettings({ ...localSettings, enabled: true });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-violet-500" />
            Configurar Notificações
          </DialogTitle>
          <DialogDescription>
            Receba alertas automáticos sobre vencimentos de mensalidades
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Permission Status */}
          {!permissionGranted ? (
            <Card className="border-yellow-500/50 bg-yellow-500/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <BellOff className="h-8 w-8 text-yellow-500" />
                  <div className="flex-1">
                    <p className="font-medium text-yellow-600 dark:text-yellow-400">
                      Notificações não habilitadas
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Permita notificações no navegador para receber alertas
                    </p>
                  </div>
                  <Button onClick={handleEnableNotifications} size="sm">
                    Habilitar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-green-500/50 bg-green-500/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <div>
                    <p className="font-medium text-green-600 dark:text-green-400">
                      Notificações habilitadas
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Você receberá alertas no navegador
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Master Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notifications-enabled" className="text-base font-medium">
                Ativar notificações
              </Label>
              <p className="text-sm text-muted-foreground">
                Receber alertas automáticos de vencimentos
              </p>
            </div>
            <Switch
              id="notifications-enabled"
              checked={localSettings.enabled}
              onCheckedChange={(checked) => setLocalSettings({ ...localSettings, enabled: checked })}
              disabled={!permissionGranted}
            />
          </div>

          {localSettings.enabled && permissionGranted && (
            <>
              {/* Days Before Due */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-violet-500" />
                  <Label className="text-base font-medium">Alertar antes do vencimento</Label>
                </div>
                <div className="flex flex-wrap gap-2">
                  {availableDays.map((day) => (
                    <button
                      key={day}
                      onClick={() => handleDayToggle(day)}
                      className={`px-3 py-2 rounded-lg border transition-colors ${
                        localSettings.daysBeforeDue.includes(day)
                          ? 'bg-violet-500 text-white border-violet-500'
                          : 'bg-background border-border hover:border-violet-500/50'
                      }`}
                    >
                      {day} dia{day > 1 ? 's' : ''}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Selecione quando deseja ser notificado antes do vencimento
                </p>
              </div>

              {/* Notify on Due Day */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BellRing className="h-4 w-4 text-blue-500" />
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium">No dia do vencimento</Label>
                    <p className="text-xs text-muted-foreground">
                      Receber alerta no dia exato do vencimento
                    </p>
                  </div>
                </div>
                <Switch
                  checked={localSettings.notifyOnDue}
                  onCheckedChange={(checked) => setLocalSettings({ ...localSettings, notifyOnDue: checked })}
                />
              </div>

              {/* Notify Overdue */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium">Pagamentos em atraso</Label>
                    <p className="text-xs text-muted-foreground">
                      Receber lembretes de pagamentos vencidos
                    </p>
                  </div>
                </div>
                <Switch
                  checked={localSettings.notifyOverdue}
                  onCheckedChange={(checked) => setLocalSettings({ ...localSettings, notifyOverdue: checked })}
                />
              </div>

              {/* Summary */}
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <p className="text-sm font-medium mb-2">Resumo das notificações:</p>
                  <div className="flex flex-wrap gap-2">
                    {localSettings.daysBeforeDue.map(day => (
                      <Badge key={day} variant="secondary" className="bg-violet-500/10 text-violet-500">
                        {day} dia{day > 1 ? 's' : ''} antes
                      </Badge>
                    ))}
                    {localSettings.notifyOnDue && (
                      <Badge variant="secondary" className="bg-blue-500/10 text-blue-500">
                        No vencimento
                      </Badge>
                    )}
                    {localSettings.notifyOverdue && (
                      <Badge variant="secondary" className="bg-red-500/10 text-red-500">
                        Em atraso
                      </Badge>
                    )}
                    {localSettings.daysBeforeDue.length === 0 && !localSettings.notifyOnDue && !localSettings.notifyOverdue && (
                      <span className="text-sm text-muted-foreground">Nenhuma notificação configurada</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} className="bg-violet-500 hover:bg-violet-600">
            Salvar Configurações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
