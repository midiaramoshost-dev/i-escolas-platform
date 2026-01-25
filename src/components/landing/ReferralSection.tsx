import { Gift, Users, Award, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const steps = [
  {
    icon: Users,
    title: "Indique amigos",
    description: "Compartilhe seu código exclusivo com outras escolas e educadores"
  },
  {
    icon: Gift,
    title: "Eles se cadastram",
    description: "Quando usarem seu código no cadastro, a indicação é registrada"
  },
  {
    icon: Award,
    title: "Ganhe 1 mês grátis",
    description: "Para cada indicação convertida, você ganha 1 mês de plano grátis"
  }
];

export function ReferralSection() {
  return (
    <section id="indicacao" className="py-20 bg-gradient-to-br from-primary/5 via-transparent to-primary/5">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <Gift className="h-4 w-4" />
            <span className="text-sm font-medium">Programa de Indicação</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Indique e Ganhe <span className="text-primary">1 Mês Grátis</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Convide outras escolas para conhecer o i ESCOLAS e ganhe meses gratuitos 
            de plano para cada indicação que se converter em cliente.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              <div className="text-center p-6 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 relative">
                  <step.icon className="h-8 w-8 text-primary" />
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
              
              {/* Arrow between steps */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <ArrowRight className="h-6 w-6 text-primary/40" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Highlight Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <div className="relative p-8 rounded-2xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold mb-2">
                  Sem limite de indicações!
                </h3>
                <p className="text-primary-foreground/90">
                  Quanto mais você indica, mais meses grátis você acumula. 
                  Suas recompensas nunca expiram.
                </p>
              </div>
              <Button 
                size="lg" 
                variant="secondary"
                className="shrink-0"
                asChild
              >
                <Link to="/cadastro">
                  Criar conta e começar
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-8 mt-12 text-center"
        >
          <div>
            <p className="text-4xl font-bold text-primary">R$ 0</p>
            <p className="text-sm text-muted-foreground">Custo para participar</p>
          </div>
          <div className="w-px bg-border hidden md:block" />
          <div>
            <p className="text-4xl font-bold text-primary">∞</p>
            <p className="text-sm text-muted-foreground">Indicações ilimitadas</p>
          </div>
          <div className="w-px bg-border hidden md:block" />
          <div>
            <p className="text-4xl font-bold text-primary">30 dias</p>
            <p className="text-sm text-muted-foreground">Por indicação convertida</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
