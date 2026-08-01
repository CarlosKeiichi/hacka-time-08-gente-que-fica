# Dados de EXEMPLO · Gente Que Fica

> **Estes dados são inventados.** Foram gerados para o time conseguir construir antes de a
> empresa parceira entregar os dados reais. Quando os reais chegarem, vão para `dados/` e esta
> pasta pode ser apagada.
>
> **Dado de pessoa exige cuidado dobrado.** Não há nome, CPF ou matrícula em lugar nenhum
> destes arquivos, e o dado real também não pode ter.

## A operação que estes dados descrevem

Uma empresa da cadeia de alimentação com cinco unidades de tipos diferentes — três lojas,
um centro de distribuição e uma fábrica. 315 pessoas. 12 meses de histórico de entrada e
saída de gente, de agosto de 2025 a julho de 2026.

O card diz que a dor é a mesma em fábrica, frota e loja. O dado foi montado para mostrar
isso — e para mostrar onde ela é pior.

## Os arquivos

### `procedimentos/` — 4 manuais
Os procedimentos reais de uma operação, em Markdown. São a **matéria-prima da trilha de
treinamento**: é daqui que a IA tira as microlições.

| arquivo | do que trata |
|---|---|
| `proc-01-abertura-de-loja.md` | Os 45 minutos antes de abrir a porta |
| `proc-02-montagem-do-pedido.md` | Os 90 segundos do pedido, na ordem que não muda |
| `proc-03-recebimento-e-estoque.md` | Conferência, temperatura, PVPS |
| `proc-04-fechamento-e-higienizacao.md` | Fechamento, óleo, caixa |

Todos têm a mesma estrutura: passo a passo numerado, **ponto crítico** e registro.
Cada passo vira uma microlição; cada ponto crítico vira uma pergunta de check.

### `unidades.csv` — 5 linhas
As cinco unidades e o tamanho de cada uma.

| coluna | o que é |
|---|---|
| `unidade` | Loja 001-003, CD Regional, Fabrica Unidade 1 |
| `tipo` | `loja`, `distribuicao`, `industria` |
| `descricao` | Perfil da unidade |
| `headcount_atual` | Pessoas hoje |

### `funcoes-e-escala.csv` — 16 linhas
Quem faz o quê, em que escala, ganhando quanto.

| coluna | o que é |
|---|---|
| `unidade` / `funcao` / `quantidade` | Quem e quantos |
| `escala` | 6x1, 5x2, turno A/B/C |
| `salario_base_brl` | Salário base da função |

### `turnover-12meses.csv` — 60 linhas
A série mensal por unidade. **É a base do radar.**

| coluna | o que é |
|---|---|
| `mes_referencia` | AAAA-MM, de 2025-08 a 2026-07 |
| `unidade` / `tipo_unidade` | Onde |
| `headcount` | Tamanho da equipe |
| `admissoes` / `desligamentos` | Entradas e saídas no mês |
| `turnover_mensal_pct` | desligamentos ÷ headcount × 100 |

### `motivos-desligamento.csv` — 214 linhas
Cada saída do ano, sem identificar ninguém.

| coluna | o que é |
|---|---|
| `data_desligamento` | Quando |
| `unidade` / `funcao` | Onde e o quê |
| `tempo_de_casa_meses` | **A coluna que conta a história** |
| `motivo` / `tipo` | Pediu demissão, abandono, dispensa / voluntário ou involuntário |
| `categoria_motivo` | Escala, Salário, Transporte, Liderança, Desempenho... |
| `concluiu_treinamento_inicial` | `sim` / `nao` — **cruze esta com tempo de casa** |
| `observacao` | O motivo em linguagem de gente |

## Confira se você leu certo

- 214 desligamentos em 12 meses, 5 unidades, 315 pessoas
- **108 deles (50%) com até 3 meses de casa**
- A Loja 003 saiu de **9,1% para 11,4%** de turnover mensal ao longo do ano

## O que dá pra provar com este dado

Metade de quem sai não chega ao quarto mês. Cruze `tempo_de_casa_meses` com
`concluiu_treinamento_inicial` e a relação aparece sozinha: quem não terminou o treinamento
sai muito mais cedo. Isso liga as duas metades do produto — a trilha não é um brinde
ao lado do radar, é a alavanca que mexe no número dele.

E o radar tem um alvo claro: a Loja 003, a de rodovia, que piorou mês a mês enquanto as outras
ficaram estáveis. Ela perde gente primeiro, e a categoria de motivo diz por quê.

## Como o dado real substitui este

Peça à empresa parceira:

1. **Procedimentos de uma função** — Word, PDF, apresentação de integração. Anonimize marca,
   logo e nome de pessoa.
2. **Lista de funções e escala** — planilha do RH.
3. **Turnover por unidade nos últimos 12 meses** — admissões e desligamentos por mês.
4. **Motivos de desligamento** — se houver entrevista de desligamento, é ouro. Se não houver,
   data de admissão e de saída já sustentam o radar.

**Sem nome, sem CPF, sem matrícula, sem cargo individualizado.** Se um arquivo permite
identificar uma pessoa, ele volta para o RH e não sobe para o repositório.
