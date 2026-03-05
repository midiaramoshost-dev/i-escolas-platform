

## Corrigir botão "Ver Demonstração" e formulário de contato

### Problema
Ambos não funcionam porque:
1. **Botão "Ver Demonstração"**: O `<Button>` dentro do `<a>` impede a propagação do clique para o link. O botão renderiza um `<button>` HTML que "engole" o evento de clique.
2. **Formulário de contato**: `window.open` com `mailto:` é bloqueado pelo navegador/iframe. Precisa usar `window.location.href` para abrir o cliente de e-mail.

### Alterações

**1. `src/pages/Index.tsx`** (botão Ver Demonstração)
- Remover o wrapper `<a>` e usar `onClick` com `window.open()` diretamente no Button, ou usar `asChild` no Button para que ele renderize como `<a>`.

**2. `src/components/landing/ContactForm.tsx`** (formulário de contato)
- Trocar `window.open(mailto:..., '_blank')` por `window.location.href = mailto:...` para evitar bloqueio de popup.

### Arquivos modificados
- `src/pages/Index.tsx`
- `src/components/landing/ContactForm.tsx`

