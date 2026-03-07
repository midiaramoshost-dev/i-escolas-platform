

## Adicionar opção "Incluir/Excluir Todos" e recurso RH no diálogo de edição de plano

### Problema
Na aba **Recursos** do diálogo "Editar Plano", falta:
1. Um toggle para **ativar/desativar todos** os recursos de uma vez
2. O recurso **RH (Recursos Humanos)** nos planos

### Alteracoes

**1. Adicionar campo `rh` ao tipo `PlanoRecursos`**
- Arquivos: `src/components/admin/EditarPlanoDialog.tsx` e `src/contexts/PlanosContext.tsx`
- Adicionar `rh: boolean` na interface `PlanoRecursos`
- Adicionar valores padrão nos planos iniciais (Free/Start = false, Pro/Premium = true)

**2. Adicionar "RH" nas listas de recursos**
- Em `EditarPlanoDialog.tsx`: adicionar `{ key: "rh", label: "Módulo RH" }` ao array `recursosBooleanos`
- Em `Planos.tsx`: adicionar `{ key: "rh", label: "Módulo RH" }` ao array `recursosLista`

**3. Adicionar toggle "Ativar/Desativar Todos" na aba Recursos do diálogo**
- Na aba "Recursos" do `EditarPlanoDialog`, adicionar um botão/switch no topo que liga ou desliga todos os recursos booleanos de uma vez
- Similar ao que ja existe na secao "Modulos Disponiveis" da pagina de Planos

### Arquivos modificados
- `src/components/admin/EditarPlanoDialog.tsx`
- `src/contexts/PlanosContext.tsx`
- `src/pages/admin/Planos.tsx`
