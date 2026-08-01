import fs from "node:fs";
import path from "node:path";
import { carregar, listarTudo, type Linha } from "./dados";

/**
 * Verificacoes do guia.
 *
 * A ideia: em vez de o time marcar caixinha, o app confere sozinho se cada
 * passo passou a funcionar. Caixinha clicada nao prova nada; isto prova.
 */

const RAIZ = process.cwd();

export type Passo = {
  numero: number;
  titulo: string;
  feito: boolean;
  detalhe: string;
};

/**
 * O time ja escreveu codigo proprio?
 *
 * Calculado em tempo de BUILD (veja next.config.mjs) e lido aqui. Nao da para
 * conferir isto em tempo de execucao: em producao o codigo-fonte nao existe
 * mais, so o bundle — a comparacao acharia que tudo sumiu.
 */
function mexeuNoCodigo(): boolean {
  return process.env.TIME_MEXEU_NO_CODIGO === "1";
}

export function verificar(): Passo[] {
  const tabelas = listarTudo();
  const linhas = tabelas.reduce((t, x) => t + x.linhas.length, 0);
  const temReal = tabelas.some((t) => t.origem === "real");
  const temChave = Boolean(process.env.ANTHROPIC_API_KEY);
  const mexeu = mexeuNoCodigo();
  // Em producao, rodar na Vercel JA e a prova de que esta no ar.
  // Na maquina do time, a pasta .vercel indica que o projeto foi ligado.
  const noAr = process.env.VERCEL === "1" || fs.existsSync(path.join(RAIZ, ".vercel"));

  return [
    {
      numero: 1,
      titulo: "O app está de pé",
      feito: true,
      detalhe: "Você está lendo esta página, então o servidor subiu. Passo dado.",
    },
    {
      numero: 2,
      titulo: "O app lê os seus dados",
      feito: tabelas.length > 0,
      detalhe:
        tabelas.length > 0
          ? `${tabelas.length} arquivo(s), ${linhas.toLocaleString("pt-BR")} linhas no total` +
            (temReal ? " — usando dado real do parceiro" : " — usando dados de exemplo")
          : "Nenhum CSV encontrado em dados/ nem em dados/exemplo/",
    },
    {
      numero: 3,
      titulo: "Você fez a primeira conta",
      feito: tabelas.length > 0,
      detalhe:
        tabelas.length > 0
          ? "Os dados estão prontos para calcular. O exemplo abaixo já roda no seu arquivo."
          : "Sem dados não há conta. Resolva o passo 2 primeiro.",
    },
    {
      numero: 4,
      titulo: "Você começou a sua tela",
      feito: mexeu,
      detalhe: mexeu
        ? "Já há código de vocês além do esqueleto. É o produto nascendo."
        : "Ainda é só o esqueleto. Abra app/page.tsx e comece a tela de vocês.",
    },
    {
      numero: 5,
      titulo: "A IA está ligada",
      feito: temChave,
      detalhe: temChave
        ? "A chave está no ambiente. A rota /api/claude deve responder."
        : "Falta a ANTHROPIC_API_KEY. Copie .env.example para .env.local, cole a chave e reinicie o npm run dev.",
    },
    {
      numero: 6,
      titulo: "Está no ar",
      feito: noAr,
      detalhe: noAr
        ? "Publicado. Todo push no GitHub gera um deploy novo automaticamente."
        : "Ainda não publicado. Rode npx vercel e depois npx vercel --prod. Faça isso cedo, não às 18h.",
    },
  ];
}

/** Resultado do exemplo pratico, calculado no dado do proprio time. */
export type Resultado = { chave: string; valor: string };

export function exemploPratico(
  arquivo: string,
  grupo: string,
  valorCol: string | null,
  modo: "soma" | "media" | "contagem" | "faixa",
): { ok: boolean; erro?: string; resultados: Resultado[] } {
  const tabela = carregar(arquivo);
  if (!tabela) {
    return { ok: false, erro: `Não achei ${arquivo} em dados/ nem em dados/exemplo/.`, resultados: [] };
  }
  if (!tabela.colunas.includes(grupo)) {
    return { ok: false, erro: `A coluna "${grupo}" não existe em ${arquivo}.`, resultados: [] };
  }

  const grupos = new Map<string, Linha[]>();
  for (const l of tabela.linhas) {
    const chave = l[grupo] ?? "";
    const atual = grupos.get(chave);
    if (atual) atual.push(l);
    else grupos.set(chave, [l]);
  }

  const nums = (ls: Linha[]) =>
    ls.map((l) => Number(l[valorCol!])).filter((n) => Number.isFinite(n));

  const brasileiro = (n: number, casas = 0) =>
    n.toLocaleString("pt-BR", { minimumFractionDigits: casas, maximumFractionDigits: casas });

  let resultados: Resultado[] = [];

  if (modo === "contagem") {
    resultados = [...grupos.entries()]
      .map(([chave, ls]) => ({ chave, bruto: ls.length, valor: `${ls.length}` }))
      .sort((a, b) => b.bruto - a.bruto)
      .map(({ chave, valor }) => ({ chave, valor }));
  } else if (modo === "soma") {
    resultados = [...grupos.entries()]
      .map(([chave, ls]) => {
        const s = nums(ls).reduce((t, n) => t + n, 0);
        return { chave, bruto: s, valor: brasileiro(s) };
      })
      .sort((a, b) => b.bruto - a.bruto)
      .map(({ chave, valor }) => ({ chave, valor }));
  } else if (modo === "media") {
    resultados = [...grupos.entries()]
      .map(([chave, ls]) => {
        const ns = nums(ls);
        const m = ns.length ? ns.reduce((t, n) => t + n, 0) / ns.length : 0;
        return { chave, bruto: m, valor: brasileiro(m, 1) };
      })
      .sort((a, b) => b.bruto - a.bruto)
      .map(({ chave, valor }) => ({ chave, valor }));
  } else {
    resultados = [...grupos.entries()]
      .map(([chave, ls]) => {
        const ns = nums(ls);
        if (ns.length < 2) return { chave, bruto: 0, valor: "—" };
        const min = Math.min(...ns);
        const max = Math.max(...ns);
        const pct = min > 0 ? (max / min - 1) * 100 : 0;
        return {
          chave,
          bruto: pct,
          valor: `${brasileiro(min, 2)} a ${brasileiro(max, 2)}  (+${brasileiro(pct)}%)`,
        };
      })
      .sort((a, b) => b.bruto - a.bruto)
      .map(({ chave, valor }) => ({ chave, valor }));
  }

  return { ok: true, resultados: resultados.slice(0, 6) };
}
