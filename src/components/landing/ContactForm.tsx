import { useState } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { 
  Send, 
  User, 
  Mail, 
  Phone, 
  Building2, 
  MessageSquare,
  CheckCircle2,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const contactSchema = z.object({
  nome: z.string()
    .trim()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  email: z.string()
    .trim()
    .email("E-mail inválido")
    .max(255, "E-mail deve ter no máximo 255 caracteres"),
  telefone: z.string()
    .trim()
    .min(10, "Telefone deve ter pelo menos 10 dígitos")
    .max(20, "Telefone deve ter no máximo 20 caracteres")
    .regex(/^[\d\s()+-]+$/, "Telefone inválido"),
  escola: z.string()
    .trim()
    .min(2, "Nome da escola deve ter pelo menos 2 caracteres")
    .max(200, "Nome da escola deve ter no máximo 200 caracteres"),
  cargo: z.string()
    .min(1, "Selecione seu cargo"),
  mensagem: z.string()
    .trim()
    .min(10, "Mensagem deve ter pelo menos 10 caracteres")
    .max(1000, "Mensagem deve ter no máximo 1000 caracteres"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      nome: "",
      email: "",
      telefone: "",
      escola: "",
      cargo: "",
      mensagem: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Log for demo purposes (in production, this would be an API call)
    console.log("Form submitted:", data);
    
    setIsSubmitting(false);
    setIsSuccess(true);
    
    toast.success("Mensagem enviada com sucesso!", {
      description: "Nossa equipe entrará em contato em até 24 horas.",
    });

    // Reset form after 2 seconds
    setTimeout(() => {
      form.reset();
      setIsSuccess(false);
    }, 3000);
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-12 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-6"
        >
          <CheckCircle2 className="h-10 w-10 text-green-500" />
        </motion.div>
        <h3 className="text-2xl font-bold mb-2">Mensagem Enviada!</h3>
        <p className="text-muted-foreground max-w-md">
          Obrigado pelo contato. Nossa equipe entrará em contato em até 24 horas úteis.
        </p>
      </motion.div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Nome Completo
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Seu nome" 
                    {...field}
                    className="h-12"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  E-mail
                </FormLabel>
                <FormControl>
                  <Input 
                    type="email"
                    placeholder="seu@email.com" 
                    {...field}
                    className="h-12"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="telefone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Telefone
                </FormLabel>
                <FormControl>
                  <Input 
                    type="tel"
                    placeholder="(00) 00000-0000" 
                    {...field}
                    className="h-12"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="escola"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Nome da Escola
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Nome da sua escola" 
                    {...field}
                    className="h-12"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="cargo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Seu Cargo</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Selecione seu cargo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="diretor">Diretor(a)</SelectItem>
                  <SelectItem value="coordenador">Coordenador(a)</SelectItem>
                  <SelectItem value="secretario">Secretário(a)</SelectItem>
                  <SelectItem value="professor">Professor(a)</SelectItem>
                  <SelectItem value="administrativo">Administrativo</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mensagem"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Mensagem
              </FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Como podemos ajudar sua escola?" 
                  {...field}
                  className="min-h-[120px] resize-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button 
            type="submit" 
            size="lg" 
            className="w-full h-14 text-lg gap-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="h-5 w-5" />
                Enviar Mensagem
              </>
            )}
          </Button>
        </motion.div>

        <p className="text-xs text-center text-muted-foreground">
          Ao enviar, você concorda com nossa{" "}
          <a href="#" className="underline hover:text-foreground">
            Política de Privacidade
          </a>
          .
        </p>
      </form>
    </Form>
  );
}
