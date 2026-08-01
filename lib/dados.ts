import fs from "node:fs";
import path from "node:path";

/**
 * Leitor dos CSVs do time.
 *
 * Procura primeiro em dados/ (o dado real do parceiro) e depois em
 * dados/exemplo/ (o dado de exemplo). Assim, quando o real chegar, e so
 * jogar o arquivo em dados/ que o app passa a usar ele sozinho.
 */

export type Linha = Record<string, string>;

export type Tabela = {
  arquivo: string;
  origem: "real" | "exemplo";
  colunas: string[];
  linhas: Linha[];
};

const RAIZ = process.cwd();

/** Divide uma linha de CSV respeitando aspas duplas. */
function partirLinha(linha: string): string[] {
  const campos: string[] = [];
  let atual = "";
  let dentroDeAspas = false;

  for (let i = 0; i < linha.length; i++) {
    const c = linha[i];
    if (c === '"') {
      if (dentroDeAspas && linha[i + 1] === '"') {
        atual += '"';
        i++;
      } else {
        dentroDeAspas = !dentroDeAspas;
      }
    } else if (c === "," && !dentroDeAspas) {
      campos.push(atual);
      atual = "";
    } else {
      atual += c;
    }
  }
  campos.push(atual);
  return campos.map((s) => s.trim());
}

function lerCsv(caminho: string): { colunas: string[]; linhas: Linha[] } {
  const texto = fs.readFileSync(caminho, "utf-8").replace(/^\uFEFF/, "");
  const linhasCruas = texto.split(/\r?\n/).filter((l) => l.trim() !== "");
  if (linhasCruas.length === 0) return { colunas: [], linhas: [] };

  const colunas = partirLinha(linhasCruas[0]);
  const linhas = linhasCruas.slice(1).map((crua) => {
    const campos = partirLinha(crua);
    const obj: Linha = {};
    colunas.forEach((col, i) => {
      obj[col] = campos[i] ?? "";
    });
    return obj;
  });

  return { colunas, linhas };
}

/** Onde um arquivo mora: no dado real ou no de exemplo. */
function localizar(arquivo: string): { caminho: string; origem: "real" | "exemplo" } | null {
  const real = path.join(RAIZ, "dados", arquivo);
  if (fs.existsSync(real)) return { caminho: real, origem: "real" };

  const exemplo = path.join(RAIZ, "dados", "exemplo", arquivo);
  if (fs.existsSync(exemplo)) return { caminho: exemplo, origem: "exemplo" };

  return null;
}

/**
 * Le um CSV pelo nome do arquivo.
 *
 *   const refeicoes = carregar("refeicoes-servidas-90dias.csv");
 *   refeicoes.linhas[0]["refeicoes_servidas"]
 *
 * Devolve null se o arquivo nao existir em lugar nenhum.
 */
export function carregar(arquivo: string): Tabela | null {
  const achado = localizar(arquivo);
  if (!achado) return null;

  const { colunas, linhas } = lerCsv(achado.caminho);
  return { arquivo, origem: achado.origem, colunas, linhas };
}

/** Lista tudo que existe, para a tela de conferencia. */
export function listarTudo(): Tabela[] {
  const vistos = new Set<string>();
  const tabelas: Tabela[] = [];

  for (const pasta of [
    path.join(RAIZ, "dados"),
    path.join(RAIZ, "dados", "exemplo"),
  ]) {
    if (!fs.existsSync(pasta)) continue;
    for (const arquivo of fs.readdirSync(pasta).sort()) {
      if (!arquivo.endsWith(".csv") || vistos.has(arquivo)) continue;
      vistos.add(arquivo);
      const t = carregar(arquivo);
      if (t) tabelas.push(t);
    }
  }

  return tabelas;
}

/** Soma uma coluna numerica. Ignora o que nao for numero. */
export function somar(linhas: Linha[], coluna: string): number {
  return linhas.reduce((total, l) => {
    const n = Number(l[coluna]);
    return Number.isFinite(n) ? total + n : total;
  }, 0);
}

/** Agrupa linhas por uma coluna. */
export function agrupar(linhas: Linha[], coluna: string): Map<string, Linha[]> {
  const mapa = new Map<string, Linha[]>();
  for (const l of linhas) {
    const chave = l[coluna] ?? "";
    const atual = mapa.get(chave);
    if (atual) atual.push(l);
    else mapa.set(chave, [l]);
  }
  return mapa;
}
