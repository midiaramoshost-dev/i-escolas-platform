## Módulo de Contabilidade para Escolas

### Visão Geral
Criar um módulo contábil completo no painel da escola com plano de contas, lançamentos, demonstrativos financeiros (DRE, Balanço Patrimonial, Balancete), fluxo de caixa avançado e exportação para integração com contador.

### Fase 1 — Banco de Dados (Migração)

Tabelas necessárias:

1. **`plano_contas`** — Plano de contas contábil padrão brasileiro
   - código, nome, tipo (ativo/passivo/receita/despesa/patrimônio), grupo, natureza (devedora/credora), escola_id, conta_pai_id (hierarquia), ativo

2. **`lancamentos_contabeis`** — Lançamentos no livro razão
   - escola_id, data_competencia, data_caixa, descricao, numero_documento, tipo_documento, status (rascunho/confirmado/estornado)

3. **`lancamento_itens`** — Partidas dobradas (débito/crédito)
   - lancamento_id, conta_id, tipo (debito/credito), valor, historico

4. **`centros_custo`** — Centros de custo
   - escola_id, nome, codigo, ativo

### Fase 2 — Página Principal (`/escola/contabilidade`)

Tabs:
- **Dashboard** — Resumo financeiro, saldos por grupo, gráficos de receita vs despesa
- **Plano de Contas** — CRUD hierárquico com contas padrão pré-carregadas
- **Lançamentos** — Lista com filtros, novo lançamento com partidas dobradas (débito = crédito)
- **Fluxo de Caixa** — Entradas/saídas por categoria com gráficos mensais
- **DRE** — Demonstração de Resultado do Exercício
- **Balanço Patrimonial** — Ativo vs Passivo + PL
- **Exportação** — Relatórios em PDF/Excel + formato compatível SPED

### Fase 3 — Funcionalidades Chave

- Regime de competência e caixa lado a lado
- Validação de partidas dobradas (soma débitos = soma créditos)
- Plano de contas inicial pré-populado (padrão escolar brasileiro)
- Centro de custo opcional por lançamento
- Filtros por período, conta, centro de custo
- Exportação SPED-compatível (CSV estruturado)

### Arquivos

- `supabase/migrations/` — Criação das tabelas
- `src/pages/escola/Contabilidade.tsx` — Página principal com tabs
- `src/components/contabilidade/` — Subcomponentes (PlanoContas, Lancamentos, DRE, Balanco, FluxoCaixa, Exportacao)
- Atualizar `src/components/layout/AppSidebar.tsx` — Adicionar link no menu

### Ordem de Execução
1. Migração do banco (tabelas + RLS + plano de contas padrão)
2. Página principal com tabs e dashboard
3. CRUD do plano de contas
4. Lançamentos contábeis com validação
5. Relatórios (DRE, Balanço, Fluxo de Caixa)
6. Exportação para contador
