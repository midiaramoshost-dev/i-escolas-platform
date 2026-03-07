

## Detalhar módulo RH na seção de módulos da landing page

### Situação atual
O módulo RH **não está** listado na home page. A plataforma possui funcionalidades de RH espalhadas nas páginas da escola (Funcionários, Folha de Pagamento, Presença de Funcionários, Crachás), mas não estão representadas na landing page nem no cadastro de módulos.

### Alterações

**1. `src/pages/Index.tsx` — Adicionar módulo RH na categoria Administrativo**

Expandir o array de módulos da categoria "Administrativo" (linha ~935) adicionando os seguintes itens:

- **Gestão de Funcionários** — Cadastro, contratos e gestão completa de colaboradores
- **Folha de Pagamento** — Holerites, cálculos de INSS, FGTS, IRRF e proventos
- **Presença de Funcionários** — Controle de ponto e relatórios de frequência
- **Crachás** — Geração e impressão de crachás com foto e QR Code
- **Controle de Estoque** — Gestão de materiais e suprimentos escolares

Usar ícones Lucide apropriados (`UserCog`, `Receipt`, `Clock`, `BadgeCheck`, `Package`).

**2. `src/pages/Index.tsx` — Importar ícones adicionais**

Adicionar os ícones necessários na linha de imports do Lucide.

### Arquivos modificados
- `src/pages/Index.tsx`

