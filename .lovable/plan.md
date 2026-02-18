

## Problema Identificado

As politicas RLS da tabela `payment_gateways` estao configuradas como **RESTRICTIVE** (restritivas), mas nao existem politicas **PERMISSIVE** (permissivas). No PostgreSQL, politicas restritivas so funcionam em conjunto com politicas permissivas -- elas servem para "restringir ainda mais" o que uma politica permissiva ja permite. Sem nenhuma politica permissiva, todo acesso e negado silenciosamente.

Isso explica por que o "Salvar Configuracoes" no painel nao persiste os dados: o Supabase retorna sucesso aparente (sem erro explicito), mas zero linhas sao afetadas.

**O mesmo problema afeta TODAS as tabelas do projeto** (`admin_usuarios`, `escolas`, `pagamentos`, `materiais_didaticos`, etc.), pois todas usam politicas RESTRICTIVE sem nenhuma PERMISSIVE.

## Plano de Correcao

### 1. Corrigir RLS da tabela `payment_gateways`
- Remover as 4 politicas restritivas atuais
- Recriar como politicas **PERMISSIVE** (o padrao do PostgreSQL)
- Mesmas regras: admin pode SELECT, INSERT, UPDATE, DELETE

### 2. Corrigir RLS de TODAS as outras tabelas afetadas
Aplicar a mesma correcao (RESTRICTIVE -> PERMISSIVE) para:
- `admin_usuarios` (4 politicas)
- `escolas` (5 politicas)
- `pagamentos` (5 politicas)
- `materiais_didaticos` (4 politicas)
- `planos` (4 politicas)
- `platform_settings` (3 politicas)
- `profiles` (3 politicas)
- `user_roles` (2 politicas)

### 3. Re-testar o fluxo
- Salvar o Access Token real do Mercado Pago no painel
- Testar o onboarding com Pix

### Detalhes Tecnicos

A migracao SQL ira:
1. `DROP POLICY` para cada politica restritiva existente
2. `CREATE POLICY` com as mesmas regras, mas sem a clausula `AS RESTRICTIVE` (que faz com que sejam permissivas por padrao)

Exemplo para uma tabela:
```text
DROP POLICY "Admins podem ver gateways" ON payment_gateways;
CREATE POLICY "Admins podem ver gateways"
  ON payment_gateways FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));
```

Nenhum arquivo de codigo precisa ser alterado -- o problema e exclusivamente nas politicas RLS do banco de dados.

