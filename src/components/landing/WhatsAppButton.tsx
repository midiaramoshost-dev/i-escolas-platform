import { useState, useRef, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const menuItems = [
  { label: "Quero conhecer a plataforma", message: "Olá! Gostaria de conhecer a plataforma i ESCOLAS." },
  { label: "Suporte técnico", message: "Olá! Preciso de suporte técnico." },
  { label: "Dúvidas sobre planos", message: "Olá! Tenho dúvidas sobre os planos." },
  { label: "Falar com vendas", message: "Olá! Gostaria de falar com a equipe de vendas." },
];

const PHONE = "5515997625135";

export function WhatsAppButton() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSelect = (message: string) => {
    const url = `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="mb-2 w-72 rounded-2xl border border-border bg-card shadow-xl overflow-hidden"
          >
            <div className="bg-[#25D366] px-4 py-3 text-white font-semibold text-sm flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Como podemos ajudar?
            </div>
            <ul className="py-2">
              {menuItems.map((item) => (
                <li key={item.label}>
                  <button
                    onClick={() => handleSelect(item.message)}
                    className="w-full text-left px-4 py-3 text-sm text-foreground hover:bg-accent transition-colors"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((v) => !v)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 hover:bg-[#20bd5a] transition-colors"
        aria-label="Abrir WhatsApp"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </motion.button>
    </div>
  );
}
