import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

/**
 * Rota minima para falar com o Claude.
 *
 * Chame do lado do cliente assim:
 *
 *   const r = await fetch("/api/claude", {
 *     method: "POST",
 *     headers: { "Content-Type": "application/json" },
 *     body: JSON.stringify({
 *       pergunta: "Explique em uma frase por que a previsao caiu.",
 *       contexto: "Amanha e vespera de feriado...",   // opcional
 *     }),
 *   });
 *   const { resposta } = await r.json();
 *
 * A chave fica em ANTHROPIC_API_KEY (arquivo .env.local). Ela NUNCA chega
 * ao navegador: esta rota roda no servidor.
 */

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      {
        erro: "Falta a chave da API.",
        comoResolver:
          "Copie .env.example para .env.local e coloque sua ANTHROPIC_API_KEY. Depois reinicie o npm run dev.",
      },
      { status: 500 },
    );
  }

  let corpo: { pergunta?: string; contexto?: string };
  try {
    corpo = await request.json();
  } catch {
    return NextResponse.json({ erro: "Corpo da requisicao nao e JSON valido." }, { status: 400 });
  }

  const pergunta = corpo.pergunta?.trim();
  if (!pergunta) {
    return NextResponse.json({ erro: "Faltou o campo 'pergunta'." }, { status: 400 });
  }

  const client = new Anthropic();

  try {
    const resposta = await client.messages.create({
      model: "claude-opus-5",
      max_tokens: 16000,
      system:
        "Voce ajuda gente de restaurante e cozinha industrial. Responda em portugues do Brasil, " +
        "em linguagem simples, sem jargao tecnico. Seja direto: comece pela resposta, " +
        "e so depois explique. Se nao souber, diga que nao sabe.",
      messages: [
        {
          role: "user",
          content: corpo.contexto ? `${corpo.contexto}\n\n${pergunta}` : pergunta,
        },
      ],
    });

    const texto = resposta.content
      .filter((bloco) => bloco.type === "text")
      .map((bloco) => (bloco as { type: "text"; text: string }).text)
      .join("\n");

    return NextResponse.json({ resposta: texto });
  } catch (erro) {
    // Erros da API vem tipados — trate os que voce sabe resolver primeiro.
    if (erro instanceof Anthropic.AuthenticationError) {
      return NextResponse.json(
        { erro: "A chave da API foi recusada. Confira o valor em .env.local." },
        { status: 401 },
      );
    }
    if (erro instanceof Anthropic.RateLimitError) {
      return NextResponse.json(
        { erro: "Muitas chamadas seguidas. Espere alguns segundos e tente de novo." },
        { status: 429 },
      );
    }
    if (erro instanceof Anthropic.APIError) {
      return NextResponse.json(
        { erro: `A API respondeu com erro ${erro.status}: ${erro.message}` },
        { status: 502 },
      );
    }
    return NextResponse.json(
      { erro: "Nao consegui falar com a API. Confira sua conexao." },
      { status: 500 },
    );
  }
}
