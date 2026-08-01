import fs from "node:fs";
import path from "node:path";
import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { listarTudo } from "@/lib/dados";

/**
 * A leitura de progresso pela IA.
 *
 * Junta o que EXISTE nos arquivos do time — contexto preenchido, plano,
 * dados, sinal de codigo proprio — e pede ao Claude uma leitura honesta:
 * o que esta solido, o que esta raso, o proximo passo que mais destrava.
 *
 * GET  /api/leitura?seco=1  -> so os fatos coletados, sem chamar a IA
 * POST /api/leitura         -> a leitura completa
 */

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const RAIZ = process.cwd();

function lerTexto(rel: string, max = 2400): string {
  try {
    const t = fs.readFileSync(path.join(RAIZ, rel), "utf-8");
    return t.length > max ? t.slice(0, max) + "\n[...cortado...]" : t;
  } catch {
    return "";
  }
}

/** O arquivo do kit ainda e so template? (mesma regra do placar do evento) */
function temConteudo(rel: string): boolean {
  const t = lerTexto(rel, 100000);
  const util = t
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !/^[#>(|-]/.test(l) && !/^\d\./.test(l) && !l.startsWith("*"))
    .join(" ");
  return util.length > 120;
}

function coletar() {
  const desafio = lerTexto("desafio.md", 1600);

  const contexto = {
    dor: { preenchido: temConteudo("contexto/01-dor.md"), texto: lerTexto("contexto/01-dor.md") },
    prd: { preenchido: temConteudo("contexto/02-prd.md"), texto: lerTexto("contexto/02-prd.md") },
    negocio: { preenchido: temConteudo("contexto/03-negocio.md"), texto: lerTexto("contexto/03-negocio.md") },
  };

  let plano: { feitos: number; total: number; pendentes: string[] } = { feitos: 0, total: 0, pendentes: [] };
  try {
    const p = JSON.parse(fs.readFileSync(path.join(RAIZ, "contexto", "passos.json"), "utf-8"));
    const passos: { texto: string; feito: boolean }[] = p.passos ?? [];
    plano = {
      feitos: passos.filter((x) => x.feito).length,
      total: passos.length,
      pendentes: passos.filter((x) => !x.feito).map((x) => x.texto).slice(0, 8),
    };
  } catch {}

  const tabelas = listarTudo();
  const dados = {
    arquivos: tabelas.map((t) => ({ nome: t.arquivo, origem: t.origem, linhas: t.linhas.length })),
    temReal: tabelas.some((t) => t.origem === "real"),
  };

  const codigoProprio = process.env.TIME_MEXEU_NO_CODIGO === "1";

  return { desafio, contexto, plano, dados, codigoProprio };
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  if (url.searchParams.get("seco") === "1") {
    const f = coletar();
    return NextResponse.json({
      ...f,
      contexto: {
        dor: f.contexto.dor.preenchido,
        prd: f.contexto.prd.preenchido,
        negocio: f.contexto.negocio.preenchido,
      },
    });
  }
  return NextResponse.json({ erro: "Use POST para a leitura, ou GET ?seco=1 para os fatos." }, { status: 405 });
}

export async function POST() {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      {
        erro: "A IA ainda não está ligada.",
        comoResolver: "Coloque a ANTHROPIC_API_KEY no .env.local (ou peça à organização, no deploy) e tente de novo.",
      },
      { status: 500 },
    );
  }

  const f = coletar();

  const resumo = [
    "## O desafio do time",
    f.desafio || "(desafio.md não encontrado)",
    "",
    "## Estado dos arquivos de contexto (mise en place)",
    `01-dor.md ${f.contexto.dor.preenchido ? "PREENCHIDO" : "AINDA NO TEMPLATE"}:`,
    f.contexto.dor.texto,
    "",
    `02-prd.md ${f.contexto.prd.preenchido ? "PREENCHIDO" : "AINDA NO TEMPLATE"}:`,
    f.contexto.prd.texto,
    "",
    `03-negocio.md ${f.contexto.negocio.preenchido ? "PREENCHIDO" : "AINDA NO TEMPLATE"}:`,
    f.contexto.negocio.texto,
    "",
    "## Plano do time (contexto/passos.json)",
    `${f.plano.feitos} de ${f.plano.total} concluídos. Pendentes: ${f.plano.pendentes.join(" · ") || "nenhum"}`,
    "",
    "## Dados",
    f.dados.arquivos.map((a) => `- ${a.nome} (${a.origem}, ${a.linhas} linhas)`).join("\n") || "- nenhum arquivo",
    f.dados.temReal ? "Há dado REAL do parceiro." : "Só dados de EXEMPLO por enquanto.",
    "",
    "## Código",
    f.codigoProprio
      ? "O time JÁ escreveu código próprio além do esqueleto."
      : "AINDA é só o esqueleto — nenhum código do time.",
  ].join("\n");

  const client = new Anthropic();

  try {
    const resposta = await client.messages.create({
      model: "claude-opus-5",
      max_tokens: 16000,
      system:
        "Você acompanha um time de hackathon de food service (2 dias, demo ao vivo). " +
        "Vai receber o estado real dos arquivos do time. Faça a leitura de progresso em português do Brasil, " +
        "tom caloroso e direto, sem jargão. Estruture em três partes curtas: " +
        "(1) O que já está sólido — só o que os arquivos provam; " +
        "(2) O que está raso ou faltando — seja específico, cite o arquivo; " +
        "(3) O próximo passo que mais destrava — UM só, concreto, para a próxima hora. " +
        "Máximo de 12 frases no total. Nunca invente conteúdo que não está nos arquivos. " +
        "Se o contexto está no template, diga com todas as letras que a mise en place vem antes do código.",
      messages: [{ role: "user", content: resumo }],
    });

    const texto = resposta.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { type: "text"; text: string }).text)
      .join("\n");

    return NextResponse.json({
      leitura: texto,
      fatos: {
        dor: f.contexto.dor.preenchido,
        prd: f.contexto.prd.preenchido,
        negocio: f.contexto.negocio.preenchido,
        plano: `${f.plano.feitos}/${f.plano.total}`,
        dadoReal: f.dados.temReal,
        codigoProprio: f.codigoProprio,
      },
    });
  } catch (erro) {
    if (erro instanceof Anthropic.AuthenticationError) {
      return NextResponse.json({ erro: "A chave da API foi recusada. Confira o .env.local." }, { status: 401 });
    }
    if (erro instanceof Anthropic.RateLimitError) {
      return NextResponse.json({ erro: "Muitas chamadas seguidas. Espere um pouco." }, { status: 429 });
    }
    return NextResponse.json({ erro: "Não consegui falar com a IA agora." }, { status: 502 });
  }
}
