# O esqueleto do app

Isto **não é o produto de vocês**. É o ponto de partida: um Next.js que já roda,
já lê os CSVs do time, já tem a identidade visual do evento e já fala com a API
do Claude. Serve para vocês não perderem as duas primeiras horas com configuração.

## Três telas que já vêm prontas

| Endereço | Para quê |
|---|---|
| `/` | Conferência: mostra se o app está lendo os seus CSVs |
| `/guia` | **Comece por aqui.** Seis passos que se conferem sozinhos, com o exemplo rodando no dado de vocês |
| `/pecas` | Catálogo visual: número gigante, semáforo, gráfico, etiquetas — com o código para copiar |

O `/guia` não tem caixinha para clicar: cada passo vira verde quando passa a
funcionar de verdade. Se um passo está cinza, ele diz o que falta fazer.

## Rodando pela primeira vez

```bash
npm install            # uma vez só
cp .env.example .env.local
# abra .env.local e cole sua ANTHROPIC_API_KEY
npm run dev            # abre em http://localhost:3000
```

A primeira tela é uma **conferência**: mostra quais CSVs o app encontrou, quantas
linhas tem cada um e as três primeiras linhas. Se aparecer tudo certo, o app está
lendo seus dados. Apague essa tela e construa a de vocês no lugar.

## Onde mexer

| Arquivo | Para quê |
|---|---|
| `app/page.tsx` | A tela inicial. **É aqui que o produto de vocês começa.** |
| `lib/dados.ts` | Leitor de CSV. `carregar("arquivo.csv")` devolve colunas e linhas. |
| `app/api/claude/route.ts` | A rota da IA. Recebe uma pergunta, devolve a resposta. |
| `app/globals.css` | Cores, fontes e peças visuais. Já vem pronto. |

## Lendo dados

```ts
import { carregar, somar, agrupar } from "@/lib/dados";

const tabela = carregar("refeicoes-servidas-90dias.csv");
if (tabela) {
  const total = somar(tabela.linhas, "refeicoes_servidas");
  const porUnidade = agrupar(tabela.linhas, "unidade");
}
```

O leitor procura primeiro em `dados/` e só depois em `dados/exemplo/`. Quando o
dado real do parceiro chegar, **é só colocar o arquivo em `dados/` com o mesmo
nome** — o app passa a usar ele sem mexer em código.

## Chamando a IA

```ts
const r = await fetch("/api/claude", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    pergunta: "Explique em uma frase por que a previsão caiu.",
    contexto: "Amanhã é véspera de feriado...",   // opcional
  }),
});
const { resposta } = await r.json();
```

A chave fica no servidor e **nunca chega ao navegador**. Não mova essa chamada
para dentro de um componente `"use client"`.

## Deploy

```bash
npx vercel            # primeira vez: cria o projeto
npx vercel --prod     # publica
```

Cadastre a `ANTHROPIC_API_KEY` também na Vercel (Settings → Environment Variables),
senão a rota da IA volta erro em produção.

**Faça o primeiro deploy no começo do dia, não no fim.** Um deploy quebrado às 18h
custa muito mais caro que às 10h.

## Regras que não mudam

- `.env.local` não sobe para o git. O `.gitignore` já bloqueia — confira mesmo assim.
- Dado sensível não entra no repositório, nem em prompt.
- O escopo é 1 fluxo + 1 tela de resultado. O resto vai para `contexto/backlog.md`.
