

## Plano: Indexação Completa no Google para Sorocaba e Região

### Problema Atual

1. **Sitemap incompleto** — Apenas 5 URLs públicas listadas, faltam páginas de funcionalidades
2. **SPA sem páginas por cidade** — O Google não consegue associar a plataforma a cidades específicas da região
3. **Sem páginas de funcionalidades indexáveis** — Módulos como "Diário de Classe", "Gestão Financeira", etc. não têm landing pages públicas que o Google possa indexar
4. **Meta tags apenas na index.html** — Todas as rotas compartilham os mesmos meta tags, sem diferenciação por página

### Estratégia

Criar **landing pages públicas por cidade** e **por funcionalidade** para que o Google indexe conteúdo único e relevante para cada busca local (ex: "gestão escolar Votorantim", "diário de classe digital Sorocaba").

### O que será criado

#### 1. Páginas por cidade (15 cidades)
Rota: `/gestao-escolar-{cidade}` (ex: `/gestao-escolar-sorocaba`, `/gestao-escolar-votorantim`)

Cada página terá:
- H1 com nome da cidade (ex: "Gestão Escolar em Votorantim")
- Texto único sobre necessidades educacionais da cidade
- Seção de funcionalidades com links internos
- CTA para cadastro
- FAQ localizado com JSON-LD
- Meta tags únicos (title, description, og) via `react-helmet` ou `useEffect` no `document.head`

Cidades: Sorocaba, Votorantim, Itu, Salto, Indaiatuba, Araçoiaba da Serra, Piedade, São Roque, Mairinque, Alumínio, Ibiúna, Tatuí, Boituva, Cerquilho, Capela do Alto.

#### 2. Páginas por funcionalidade (8 páginas)
Rota: `/funcionalidades/{slug}` (ex: `/funcionalidades/diario-classe`, `/funcionalidades/gestao-financeira`)

Funcionalidades com landing page:
- Diário de Classe Digital
- Gestão Financeira Escolar
- Portal do Aluno
- Portal do Responsável
- Comunicação Escola-Família
- Controle de Frequência
- Boletins e Notas Online
- Matrícula e CRM

Cada página terá: H1 otimizado, descrição, benefícios, screenshot/ilustração, CTA, meta tags únicos.

#### 3. Componente de SEO dinâmico
Criar `src/components/SEOHead.tsx` que usa `useEffect` para atualizar `document.title`, meta description, og tags e canonical URL dinamicamente por rota.

#### 4. Sitemap atualizado
Atualizar `public/sitemap.xml` com todas as novas URLs (~28 páginas públicas total).

#### 5. Rotas no App.tsx
Adicionar rotas públicas para as páginas de cidade e funcionalidades.

#### 6. Links internos
- Footer da landing page com links para todas as cidades
- Seção "Atendemos sua cidade" na página principal com links para as páginas locais
- Cross-links entre páginas de cidade e funcionalidades

### Estrutura de arquivos

```text
src/components/SEOHead.tsx              — Componente de meta tags dinâmicos
src/pages/cidades/CidadeLanding.tsx     — Template reutilizável para cidades
src/pages/cidades/cidades-data.ts       — Dados de cada cidade (texto, FAQ, meta)
src/pages/funcionalidades/FuncionalidadeLanding.tsx  — Template para funcionalidades
src/pages/funcionalidades/funcionalidades-data.ts    — Dados de cada funcionalidade
public/sitemap.xml                      — Atualizado com ~28 URLs
src/App.tsx                             — Novas rotas públicas
src/pages/Index.tsx                     — Links internos no footer
```

### Detalhes Técnicos

- **SEOHead**: Usa `useEffect` para manipular `document.head` diretamente (título, meta tags, canonical, JSON-LD). Limpa ao desmontar.
- **Cidades**: Rota dinâmica `/gestao-escolar/:cidade` renderiza `CidadeLanding` com dados de `cidades-data.ts`.
- **Funcionalidades**: Rota `/funcionalidades/:slug` renderiza `FuncionalidadeLanding`.
- **JSON-LD por página**: Cada cidade gera schema `LocalBusiness` + `FAQPage` específico. Cada funcionalidade gera `SoftwareApplication` com `featureList`.
- **Canonical URLs**: Cada página aponta para `https://iescolas.com.br/{path}`.

