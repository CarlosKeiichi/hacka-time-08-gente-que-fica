import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";

/**
 * O plano do time. Vive em contexto/passos.json — versionado com o codigo.
 *
 * Rodando local (npm run dev): editavel, grava no arquivo.
 * No link publicado: somente leitura — mostra o estado do ultimo git push.
 */

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const ARQUIVO = path.join(process.cwd(), "contexto", "passos.json");

function editavel() {
  return process.env.VERCEL !== "1";
}

function ler(): { passos: { id: string; texto: string; feito: boolean }[] } {
  try {
    const d = JSON.parse(fs.readFileSync(ARQUIVO, "utf-8"));
    return { passos: Array.isArray(d.passos) ? d.passos : [] };
  } catch {
    return { passos: [] };
  }
}

function gravar(passos: { id: string; texto: string; feito: boolean }[]) {
  const atual = (() => {
    try { return JSON.parse(fs.readFileSync(ARQUIVO, "utf-8")); } catch { return {}; }
  })();
  fs.writeFileSync(ARQUIVO, JSON.stringify({ ...atual, passos }, null, 2) + "\n");
}

export async function GET() {
  return NextResponse.json({ ...ler(), editavel: editavel() });
}

export async function POST(request: Request) {
  if (!editavel()) {
    return NextResponse.json(
      { erro: "No link publicado o plano é somente leitura. Editem rodando npm run dev — e o git push atualiza aqui." },
      { status: 403 },
    );
  }

  let corpo: { acao?: string; id?: string; texto?: string };
  try { corpo = await request.json(); } catch {
    return NextResponse.json({ erro: "JSON inválido." }, { status: 400 });
  }

  const { passos } = ler();

  if (corpo.acao === "alternar" && corpo.id) {
    const p = passos.find((x) => x.id === corpo.id);
    if (p) p.feito = !p.feito;
  } else if (corpo.acao === "adicionar" && corpo.texto?.trim()) {
    passos.push({
      id: "p" + Date.now().toString(36),
      texto: corpo.texto.trim().slice(0, 200),
      feito: false,
    });
  } else if (corpo.acao === "remover" && corpo.id) {
    const i = passos.findIndex((x) => x.id === corpo.id);
    if (i >= 0) passos.splice(i, 1);
  } else {
    return NextResponse.json({ erro: "Ação desconhecida." }, { status: 400 });
  }

  gravar(passos);
  return NextResponse.json({ passos, editavel: true });
}
