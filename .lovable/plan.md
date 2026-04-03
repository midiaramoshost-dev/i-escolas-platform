

## Plano: Homepage Mais Clean

### Situacao Atual
A pagina ja foi simplificada anteriormente, mas ainda tem excesso de secoes e conteudo que compete pela atencao do visitante. Atualmente sao **9 secoes** na homepage: Hero, Stats, Features, Referral (com 3 sub-secoes: steps + CTA + stats), Plans, Testimonials, FAQ, Contact, CTA final.

### O que mudar

1. **Remover a secao ReferralSection inteira** da homepage -- esse conteudo e relevante apenas para clientes logados, nao para visitantes novos. Mover para area interna ou pagina dedicada `/indicacao`.

2. **Remover a secao Stats** (500+ escolas, 150k+ alunos...) -- dados ja mencionados no hero e no CTA. Redundante.

3. **Simplificar a secao de Features** -- reduzir de 6 cards para 4, agrupando funcionalidades relacionadas, com descricoes mais curtas.

4. **Reduzir o espaco vertical** -- diminuir paddings de `py-20` para `py-16` nas secoes restantes.

5. **Remover a secao de Contato** com formulario -- manter apenas o CTA final com botao para WhatsApp e link de e-mail. O formulario e fricao desnecessaria quando ja tem WhatsApp.

6. **Simplificar o CTA final** -- uma unica linha de acao em vez de dois botoes + bullets.

### Resultado Final
A homepage tera **5 secoes** em vez de 9:
- Hero (com trust badges)
- Features (4 cards)
- Plans (com toggle mensal/anual)
- Testimonials + FAQ (lado a lado ou sequencial compacto)
- CTA final + Footer

### Arquivos Editados
- `src/pages/Index.tsx` -- remover secoes, simplificar layout

### Detalhes Tecnicos
- Remover import de `ReferralSection` e `ContactForm`
- Remover icons nao utilizados apos limpeza (Send, Mail, MapPin, Globe, Award, Clock, Heart, etc.)
- Manter SEOHead, SchoolOnboardingDialog, WhatsAppButton
- Manter footer com links SEO para cidades e funcionalidades

