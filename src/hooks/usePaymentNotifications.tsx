import { useEffect, useCallback, useState } from 'react';
import { toast } from '@/hooks/use-toast';

interface Mensalidade {
  id: string;
  mes: string;
  ano: number;
  valor: number;
  vencimento: string;
  status: string;
  alunoNome?: string;
}

interface NotificationSettings {
  enabled: boolean;
  daysBeforeDue: number[];
  notifyOnDue: boolean;
  notifyOverdue: boolean;
}

const STORAGE_KEY = 'iescolas_notification_settings';
const NOTIFIED_KEY = 'iescolas_notified_payments';

const defaultSettings: NotificationSettings = {
  enabled: true,
  daysBeforeDue: [3, 1],
  notifyOnDue: true,
  notifyOverdue: true,
};

export function usePaymentNotifications() {
  const [settings, setSettings] = useState<NotificationSettings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);

  // Check and request notification permission
  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      toast({
        title: 'Notificações não suportadas',
        description: 'Seu navegador não suporta notificações push.',
        variant: 'destructive',
      });
      return false;
    }

    if (Notification.permission === 'granted') {
      setPermissionGranted(true);
      return true;
    }

    if (Notification.permission === 'denied') {
      toast({
        title: 'Notificações bloqueadas',
        description: 'Habilite as notificações nas configurações do navegador.',
        variant: 'destructive',
      });
      return false;
    }

    const permission = await Notification.requestPermission();
    const granted = permission === 'granted';
    setPermissionGranted(granted);
    
    if (granted) {
      toast({
        title: 'Notificações ativadas!',
        description: 'Você receberá alertas sobre vencimentos.',
      });
    }
    
    return granted;
  }, []);

  // Save settings
  const updateSettings = useCallback((newSettings: Partial<NotificationSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Get already notified payments
  const getNotifiedPayments = useCallback((): Record<string, string[]> => {
    try {
      const stored = localStorage.getItem(NOTIFIED_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }, []);

  // Mark payment as notified
  const markAsNotified = useCallback((paymentId: string, type: string) => {
    const notified = getNotifiedPayments();
    if (!notified[paymentId]) {
      notified[paymentId] = [];
    }
    if (!notified[paymentId].includes(type)) {
      notified[paymentId].push(type);
    }
    localStorage.setItem(NOTIFIED_KEY, JSON.stringify(notified));
  }, [getNotifiedPayments]);

  // Check if already notified
  const wasNotified = useCallback((paymentId: string, type: string): boolean => {
    const notified = getNotifiedPayments();
    return notified[paymentId]?.includes(type) || false;
  }, [getNotifiedPayments]);

  // Send browser notification
  const sendNotification = useCallback((title: string, body: string, tag: string) => {
    if (!permissionGranted || !settings.enabled) return;

    try {
      const notification = new Notification(title, {
        body,
        icon: '/favicon.ico',
        tag,
        requireInteraction: true,
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      // Also show toast
      toast({
        title,
        description: body,
      });
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }, [permissionGranted, settings.enabled]);

  // Format currency
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  // Check payments and send notifications
  const checkPayments = useCallback((mensalidades: Mensalidade[]) => {
    if (!settings.enabled || !permissionGranted) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    mensalidades.forEach(mensalidade => {
      if (mensalidade.status === 'pago' || mensalidade.status === 'futuro') return;

      const dueDate = new Date(mensalidade.vencimento);
      dueDate.setHours(0, 0, 0, 0);
      
      const diffTime = dueDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      const alunoInfo = mensalidade.alunoNome ? ` - ${mensalidade.alunoNome}` : '';
      const paymentId = mensalidade.id;

      // Check for approaching due dates
      settings.daysBeforeDue.forEach(days => {
        if (diffDays === days) {
          const notifType = `approaching_${days}`;
          if (!wasNotified(paymentId, notifType)) {
            sendNotification(
              `⏰ Vencimento em ${days} dia${days > 1 ? 's' : ''}`,
              `Mensalidade de ${mensalidade.mes}${alunoInfo}: ${formatCurrency(mensalidade.valor)}`,
              `payment_${paymentId}_${notifType}`
            );
            markAsNotified(paymentId, notifType);
          }
        }
      });

      // Check for due today
      if (settings.notifyOnDue && diffDays === 0) {
        const notifType = 'due_today';
        if (!wasNotified(paymentId, notifType)) {
          sendNotification(
            '🔔 Vencimento Hoje!',
            `Mensalidade de ${mensalidade.mes}${alunoInfo}: ${formatCurrency(mensalidade.valor)}`,
            `payment_${paymentId}_${notifType}`
          );
          markAsNotified(paymentId, notifType);
        }
      }

      // Check for overdue
      if (settings.notifyOverdue && diffDays < 0 && mensalidade.status === 'atrasado') {
        const overdueDays = Math.abs(diffDays);
        // Notify once when first overdue, then every 7 days
        const notifType = overdueDays === 1 ? 'overdue_1' : `overdue_week_${Math.floor(overdueDays / 7)}`;
        
        if ((overdueDays === 1 || overdueDays % 7 === 0) && !wasNotified(paymentId, notifType)) {
          sendNotification(
            '⚠️ Pagamento em Atraso',
            `Mensalidade de ${mensalidade.mes}${alunoInfo}: ${formatCurrency(mensalidade.valor)} - ${overdueDays} dia${overdueDays > 1 ? 's' : ''} em atraso`,
            `payment_${paymentId}_${notifType}`
          );
          markAsNotified(paymentId, notifType);
        }
      }
    });
  }, [settings, permissionGranted, wasNotified, sendNotification, markAsNotified]);

  // Initial permission check
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'granted') {
      setPermissionGranted(true);
    }
  }, []);

  return {
    settings,
    updateSettings,
    requestPermission,
    permissionGranted,
    checkPayments,
    sendNotification,
  };
}
