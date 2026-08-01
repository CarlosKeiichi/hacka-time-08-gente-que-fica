import { listarTudo } from "@/lib/dados";
import TesteClaude from "./TesteClaude";

// Le os CSVs a cada acesso, nao so no build. Assim, quando voces trocarem um
// arquivo em dados/, a tela mostra o novo sem precisar buildar de novo.
export const dynamic = "force-dynamic";

/**
 * Tela de conferencia. NAO e o produto de voces.
 *
 * Ela existe para responder uma pergunta: "o app le meus dados?"
 * Quando a resposta for sim, apague esta tela e construa a de voces por cima.
 */
export default function Home() {
  const tabelas = listarTudo();
  const temReal = tabelas.some((t) => t.origem === "real");

  return (
    <main>
      <header className="cabeca">
        <div className="env">
          <span className="crachá">Time 08 · Esqueleto</span>
          <h1>Gente Que Fica</h1>
          <p className="sub">
            O app esta de pe e lendo os dados. Esta tela e so a conferencia —
            a tela de voces entra no lugar dela.
          </p>
        </div>
      </header>

      <div className="env">
        <div className="bloco">
          <div className="entre">
            <h2>Dados encontrados</h2>
            <span className="rotulo">
              {tabelas.length} arquivo{tabelas.length === 1 ? "" : "s"}
            </span>
          </div>

          {tabelas.length === 0 ? (
            <div className="aviso erro">
              <p className="prosa">
                Nenhum CSV encontrado. Confira se a pasta <span className="mono">dados/</span>{" "}
                ou <span className="mono">dados/exemplo/</span> tem arquivos.
              </p>
            </div>
          ) : (
            <div className="aviso ok">
              <p className="prosa">
                {temReal
                  ? "Ha dado real do parceiro sendo usado. O app prefere ele ao de exemplo."
                  : "Rodando com dados de exemplo. Quando o real chegar, coloque em dados/ que o app troca sozinho."}
              </p>
            </div>
          )}

          <div style={{ marginTop: 18 }}>
            {tabelas.map((t) => (
              <div key={t.arquivo} className="bloco" style={{ background: "var(--slate-3)" }}>
                <div className="entre">
                  <h3 className="mono">{t.arquivo}</h3>
                  <span className={t.origem === "real" ? "tag t-real" : "tag t-exemplo"}>
                    {t.origem === "real" ? "dado real" : "exemplo"}
                  </span>
                </div>
                <div className="rotulo" style={{ marginTop: 8 }}>
                  {t.linhas.length} linhas · {t.colunas.length} colunas
                </div>

                <div className="rolagem">
                  <table>
                    <thead>
                      <tr>
                        {t.colunas.map((c) => (
                          <th key={c}>{c}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {t.linhas.slice(0, 3).map((linha, i) => (
                        <tr key={i}>
                          {t.colunas.map((c) => (
                            <td key={c}>{linha[c]}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>

        <TesteClaude />

        <div className="bloco">
          <h2>Por onde comecar</h2>
          <p className="prosa" style={{ marginTop: 10 }}>
            O leitor de dados esta em <span className="mono">lib/dados.ts</span>. Use{" "}
            <span className="mono">carregar(&quot;nome-do-arquivo.csv&quot;)</span> para pegar
            uma tabela e <span className="mono">somar()</span> / <span className="mono">agrupar()</span>{" "}
            para as contas. A rota do Claude fica em{" "}
            <span className="mono">app/api/claude/route.ts</span>.
          </p>
          <p className="prosa" style={{ marginTop: 12 }}>
            O visual ja vem pronto em <span className="mono">app/globals.css</span> — as
            cores, as fontes e as pecas basicas. Nao precisa comecar do CSS zerado.
          </p>
        </div>
      </div>
    </main>
  );
}
