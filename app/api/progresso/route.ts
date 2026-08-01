import { NextResponse } from "next/server";
import { verificar } from "@/lib/guia";

/**
 * Publica o progresso deste time.
 *
 * O placar do evento busca esta rota no deploy de cada time para montar o
 * telao. E por isso que ela existe: sem ela, a organizacao so enxergaria o
 * repositorio local e o placar ficaria parado o evento inteiro.
 *
 * NAO devolve nada sensivel: so quantos passos foram feitos e o titulo de cada
 * um. Nem conteudo de dado, nem chave, nem caminho de arquivo.
 */

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const passos = verificar();

  return NextResponse.json(
    {
      passos: passos.map((p) => ({ numero: p.numero, titulo: p.titulo, feito: p.feito })),
      feitos: passos.filter((p) => p.feito).length,
      total: passos.length,
      em: new Date().toISOString(),
    },
    {
      headers: {
        // O placar e um site estatico em outro dominio; precisa poder ler daqui.
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-store",
      },
    },
  );
}
