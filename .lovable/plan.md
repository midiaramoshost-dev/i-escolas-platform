

## Implementar Suporte Completo ao SQL Legado no Painel de Importacao

### Situacao Atual
A pagina de importacao so suporta 2 categorias (Cadastro e Historico), parser SQL de linha unica, e upload apenas de CSV/Excel. O arquivo SQL enviado usa formato multi-row VALUES que nao e reconhecido.

### O que sera feito

**1. Corrigir parser SQL para multi-row VALUES**
- Reescrever `parseSQLInserts` para suportar:
```text
INSERT INTO tabela (col1, col2) VALUES
(val1, val2),
(val3, val4);
```
- Tratar valores com aspas simples contendo virgulas e caracteres especiais latin1
- Auto-detectar nome da tabela de cada INSERT

**2. Expandir para 7 categorias de importacao**

| Categoria | Icone | Campos Mapeados (sem login/senha) |
|---|---|---|
| Dados Cadastrais | FileSpreadsheet | nome, cpf, data_nascimento, endereco, serie, turma, turno, responsavel, telefone, email, matricula |
| Historico Escolar | Database | aluno, turma, bimestre, disciplina, nota, faltas, recuperacao, media, ano_letivo |
| Estoque | Package | nome, categoria, preco_custo, preco_venda, estoque, fornecedor, qtd |
| Fornecedores | Truck | nome, email, telefone, nome_contato, site, cep, endereco, numero, complemento, bairro, estado, cidade |
| Biblioteca | BookOpen | titulo, autor, editora, ano, codigo, localizacao, categoria |
| Emprestimos | BookMarked | livro, aluno_funcionario, data_emprestimo, data_devolucao, data_devolvido |
| Financeiro | DollarSign | sacado, valor, data_vencimento, situacao, banco, observacoes, data_pagamento |

**3. Aceitar upload de arquivo .sql**
- Adicionar `.sql` ao accept do input de arquivo
- Detectar extensao e usar parser SQL automaticamente

**4. Auto-deteccao de tabela**
- Ao processar o SQL, detectar quais tabelas existem e quantos registros cada uma tem
- Sugerir categoria automaticamente com base no nome da tabela (ex: `boletim` -> Historico, `almoxarifados_produtos` -> Estoque)

**5. Download de template para cada categoria**
- Atualizar os botoes de modelo para incluir todas as 7 categorias

**6. UI atualizada**
- Substituir os 2 botoes de tipo por um grid responsivo com 7 opcoes (3 colunas no desktop, 2 no tablet, 1 no mobile)
- Cada opcao com icone, titulo e descricao

### Detalhes Tecnicos

**Arquivo alterado:** `src/pages/escola/ImportarDados.tsx`

- Tipo `ImportJob.type` expandido para: `cadastro | historico | estoque | fornecedores | biblioteca | emprestimos | financeiro`
- 5 novos field maps criados (ESTOQUE_FIELDS, FORNECEDORES_FIELDS, BIBLIOTECA_FIELDS, EMPRESTIMOS_FIELDS, FINANCEIRO_FIELDS)
- Funcao `parseSQLInserts` reescrita com regex que captura blocos multi-row
- Funcao `detectTableCategory` para mapear nomes de tabela MySQL para categorias do sistema
- Campos excluidos: login, senha, password, hash, nome_meta, foto, txt_meta, time, ordem, star, lancamentos, cont, lang

