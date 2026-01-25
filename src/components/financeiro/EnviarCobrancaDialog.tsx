import { useState } from "react";
import { MessageCircle, Mail, Send, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

export interface Inadimplente {
  id: string;
  aluno: string;
  turma: string;
  responsavel: string;
  telefone: string;
  email: string;
  mesesDevidos: number;
  valorTotal: number;
  ultimoContato: string;
  status: string;
}

interface EnviarCobrancaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inadimplentes: Inadimplente[];
  selectedIds?: string[];
  onContatoRegistrado?: (id: string, tipo: 'whatsapp' | 'email') => void;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const formatPhone = (phone: string) => {
  // Remove all non-digits
  return phone.replace(/\D/g, "");
};

const gerarMensagemCobranca = (inadimplente: Inadimplente, escola: string = "i ESCOLAS") => {
  const mesesTexto = inadimplente.mesesDevidos === 1 ? "1 mensalidade" : `${inadimplente.mesesDevidos} mensalidades`;
  
  return `Olá ${inadimplente.responsavel.split(" ")[0]}!

Identificamos que há ${mesesTexto} em aberto referente ao(à) aluno(a) *${inadimplente.aluno}* (${inadimplente.turma}).

💰 *Valor total:* ${formatCurrency(inadimplente.valorTotal)}

Gostaríamos de verificar se há alguma pendência ou se podemos ajudar com opções de pagamento.

Entre em contato conosco para regularizar a situação.

Atenciosamente,
${escola}`;
};

const gerarAssuntoEmail = (inadimplente: Inadimplente) => {
  return `Pendência financeira - ${inadimplente.aluno}`;
};

const gerarCorpoEmail = (inadimplente: Inadimplente, escola: string = "i ESCOLAS") => {
  const mesesTexto = inadimplente.mesesDevidos === 1 ? "1 mensalidade" : `${inadimplente.mesesDevidos} mensalidades`;
  
  return `Prezado(a) ${inadimplente.responsavel},

Identificamos que há ${mesesTexto} em aberto referente ao(à) aluno(a) ${inadimplente.aluno} (${inadimplente.turma}).

Valor total pendente: ${formatCurrency(inadimplente.valorTotal)}

Gostaríamos de verificar se há alguma pendência ou se podemos ajudar com opções de pagamento facilitado.

Por favor, entre em contato conosco para regularizar a situação e evitar eventuais transtornos.

Atenciosamente,
Secretaria Financeira
${escola}`;
};

export function EnviarCobrancaDialog({
  open,
  onOpenChange,
  inadimplentes,
  selectedIds = [],
  onContatoRegistrado,
}: EnviarCobrancaDialogProps) {
  const { toast } = useToast();
  const [selectedContacts, setSelectedContacts] = useState<string[]>(selectedIds);
  const [enviando, setEnviando] = useState<string | null>(null);
  const [enviados, setEnviados] = useState<{ id: string; tipo: 'whatsapp' | 'email' }[]>([]);
  const [mensagemPersonalizada, setMensagemPersonalizada] = useState("");
  const [activeTab, setActiveTab] = useState<"whatsapp" | "email">("whatsapp");

  const toggleContact = (id: string) => {
    setSelectedContacts(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedContacts.length === inadimplentes.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(inadimplentes.map(i => i.id));
    }
  };

  const enviarWhatsApp = (inadimplente: Inadimplente) => {
    setEnviando(inadimplente.id);
    
    const phone = formatPhone(inadimplente.telefone);
    const phoneWithCountry = phone.startsWith("55") ? phone : `55${phone}`;
    const mensagem = mensagemPersonalizada || gerarMensagemCobranca(inadimplente);
    const encodedMessage = encodeURIComponent(mensagem);
    
    // Open WhatsApp with pre-filled message
    window.open(`https://wa.me/${phoneWithCountry}?text=${encodedMessage}`, "_blank");
    
    // Register contact
    setEnviados(prev => [...prev, { id: inadimplente.id, tipo: 'whatsapp' }]);
    onContatoRegistrado?.(inadimplente.id, 'whatsapp');
    
    toast({
      title: "WhatsApp aberto",
      description: `Mensagem preparada para ${inadimplente.responsavel}`,
    });
    
    setTimeout(() => setEnviando(null), 500);
  };

  const enviarEmail = (inadimplente: Inadimplente) => {
    setEnviando(inadimplente.id);
    
    const assunto = encodeURIComponent(gerarAssuntoEmail(inadimplente));
    const corpo = encodeURIComponent(
      mensagemPersonalizada || gerarCorpoEmail(inadimplente)
    );
    
    // Open email client
    window.open(`mailto:${inadimplente.email}?subject=${assunto}&body=${corpo}`, "_blank");
    
    // Register contact
    setEnviados(prev => [...prev, { id: inadimplente.id, tipo: 'email' }]);
    onContatoRegistrado?.(inadimplente.id, 'email');
    
    toast({
      title: "E-mail preparado",
      description: `Mensagem preparada para ${inadimplente.email}`,
    });
    
    setTimeout(() => setEnviando(null), 500);
  };

  const enviarParaSelecionados = () => {
    const selecionados = inadimplentes.filter(i => selectedContacts.includes(i.id));
    
    if (selecionados.length === 0) {
      toast({
        variant: "destructive",
        title: "Nenhum contato selecionado",
        description: "Selecione pelo menos um responsável para enviar a cobrança.",
      });
      return;
    }

    // For multiple contacts, we open them one by one with a small delay
    selecionados.forEach((inadimplente, index) => {
      setTimeout(() => {
        if (activeTab === "whatsapp") {
          enviarWhatsApp(inadimplente);
        } else {
          enviarEmail(inadimplente);
        }
      }, index * 1000); // 1 second delay between each
    });

    toast({
      title: `Enviando ${selecionados.length} cobranças`,
      description: `Abrindo ${activeTab === "whatsapp" ? "WhatsApp" : "e-mail"} para cada contato selecionado...`,
    });
  };

  const getStatusEnvio = (id: string) => {
    const envio = enviados.find(e => e.id === id);
    if (!envio) return null;
    return envio.tipo;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5 text-primary" />
            Enviar Cobranças
          </DialogTitle>
          <DialogDescription>
            Selecione os responsáveis e o canal para enviar as cobranças
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "whatsapp" | "email")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="whatsapp" className="gap-2">
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </TabsTrigger>
            <TabsTrigger value="email" className="gap-2">
              <Mail className="h-4 w-4" />
              E-mail
            </TabsTrigger>
          </TabsList>

          <TabsContent value="whatsapp" className="space-y-4">
            <div className="rounded-lg border bg-muted/50 p-4">
              <h4 className="font-medium mb-2">Mensagem Personalizada (opcional)</h4>
              <Textarea
                placeholder="Digite uma mensagem personalizada ou deixe em branco para usar o modelo padrão..."
                value={mensagemPersonalizada}
                onChange={(e) => setMensagemPersonalizada(e.target.value)}
                rows={4}
              />
              <p className="text-xs text-muted-foreground mt-2">
                💡 Variáveis serão substituídas automaticamente: nome do responsável, aluno, valor, etc.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="email" className="space-y-4">
            <div className="rounded-lg border bg-muted/50 p-4">
              <h4 className="font-medium mb-2">Corpo do E-mail (opcional)</h4>
              <Textarea
                placeholder="Digite o corpo do e-mail ou deixe em branco para usar o modelo padrão..."
                value={mensagemPersonalizada}
                onChange={(e) => setMensagemPersonalizada(e.target.value)}
                rows={4}
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* Contact List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Selecionar Responsáveis</h4>
            <Button variant="ghost" size="sm" onClick={selectAll}>
              {selectedContacts.length === inadimplentes.length ? "Desmarcar todos" : "Selecionar todos"}
            </Button>
          </div>
          
          <div className="rounded-lg border divide-y max-h-[300px] overflow-y-auto">
            {inadimplentes.map((inadimplente) => {
              const statusEnvio = getStatusEnvio(inadimplente.id);
              
              return (
                <div
                  key={inadimplente.id}
                  className="flex items-center gap-4 p-3 hover:bg-muted/50 transition-colors"
                >
                  <Checkbox
                    id={inadimplente.id}
                    checked={selectedContacts.includes(inadimplente.id)}
                    onCheckedChange={() => toggleContact(inadimplente.id)}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Label htmlFor={inadimplente.id} className="font-medium cursor-pointer">
                        {inadimplente.responsavel}
                      </Label>
                      {statusEnvio && (
                        <Badge variant="outline" className="gap-1 text-xs">
                          <CheckCircle2 className="h-3 w-3 text-primary" />
                          {statusEnvio === 'whatsapp' ? 'WhatsApp' : 'E-mail'} enviado
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {inadimplente.aluno} • {inadimplente.turma}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                      <span>{inadimplente.telefone}</span>
                      <span>•</span>
                      <span className="truncate">{inadimplente.email}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-destructive">
                      {formatCurrency(inadimplente.valorTotal)}
                    </p>
                    <Badge variant={inadimplente.mesesDevidos >= 3 ? "destructive" : "secondary"} className="text-xs">
                      {inadimplente.mesesDevidos} {inadimplente.mesesDevidos === 1 ? "mês" : "meses"}
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => enviarWhatsApp(inadimplente)}
                      disabled={enviando === inadimplente.id}
                    >
                      <MessageCircle className="h-4 w-4 text-primary" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => enviarEmail(inadimplente)}
                      disabled={enviando === inadimplente.id}
                    >
                      <Mail className="h-4 w-4 text-primary" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary */}
        {enviados.length > 0 && (
          <div className="rounded-lg bg-primary/5 border border-primary/20 p-3">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>
                <strong>{enviados.length}</strong> cobrança(s) enviada(s) nesta sessão
              </span>
            </div>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
          <Button
            onClick={enviarParaSelecionados}
            disabled={selectedContacts.length === 0}
            className="gap-2"
          >
            <Send className="h-4 w-4" />
            Enviar para {selectedContacts.length} selecionado(s)
            {activeTab === "whatsapp" ? (
              <MessageCircle className="h-4 w-4" />
            ) : (
              <Mail className="h-4 w-4" />
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
