

## SEO Agressivo Local — Sorocaba e Região

### Problema
O SEO atual é 100% genérico/nacional. Não há **nenhuma menção** a Sorocaba, região metropolitana, ou qualquer termo de geolocalização. Isso torna impossível ranquear para buscas locais como "sistema escolar Sorocaba", "gestão escolar Sorocaba", etc.

### O que será feito

**1. `index.html` — Meta tags com foco local**
- Title: incluir "Sorocaba e Região" → `i ESCOLAS | Gestão Escolar em Sorocaba e Região`
- Description: reescrever com palavras-chave locais (Sorocaba, Votorantim, Itu, Salto, Indaiatuba, região metropolitana)
- Keywords: adicionar termos geolocalizados (escola Sorocaba, sistema escolar Sorocaba, software escola interior SP)
- `og:title`, `og:description`, `twitter:title`, `twitter:description`: atualizar com menções a Sorocaba
- Adicionar meta tag `geo.region`, `geo.placename`, `geo.position` e `ICBM` para geolocalização

**2. `index.html` — JSON-LD LocalBusiness**
- Adicionar schema `LocalBusiness` com `areaServed` listando Sorocaba, Votorantim, Itu, Salto, Indaiatuba, Araçoiaba da Serra, Piedade, São Roque, Mairinque, Alumínio
- Incluir `address` com Sorocaba/SP
- Manter o `SoftwareApplication` existente e adicionar `availableIn` com foco regional

**3. `index.html` — FAQ JSON-LD expandido**
- Adicionar perguntas focadas em Sorocaba:
  - "Qual o melhor sistema de gestão escolar em Sorocaba?"
  - "O i ESCOLAS atende escolas em Sorocaba e região?"
  - "Escolas de Sorocaba podem usar o i ESCOLAS gratuitamente?"

**4. `public/robots.txt` — Adicionar sitemap**
- Incluir referência ao sitemap: `Sitemap: https://iescolas.com.br/sitemap.xml`

**5. `public/sitemap.xml` — Criar sitemap**
- Arquivo XML com todas as rotas públicas (/, /login, /cadastro, /indicacao, /verificar-carteirinha)

**6. `src/pages/Index.tsx` — Conteúdo textual com palavras-chave locais**
- Hero: incluir menção a "Sorocaba e região" no subtítulo/descrição
- Seção de stats/prova social: mencionar "escolas em Sorocaba e interior de SP"
- Footer: adicionar texto "Atendemos escolas em Sorocaba, Votorantim, Itu, Salto, Indaiatuba e toda a região metropolitana"
- Seção de FAQ visível: adicionar pergunta sobre atendimento em Sorocaba

### Arquivos modificados
- `index.html`
- `public/robots.txt`
- `public/sitemap.xml` (novo)
- `src/pages/Index.tsx`

