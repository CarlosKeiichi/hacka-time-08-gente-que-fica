"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Passo = { id: string; texto: string; feito: boolean };

/**
 * O plano do time — a lista que VOCES controlam.
 *
 * Diferenca para o /guia: o guia se confere sozinho (maquina); este plano e
 * de gente — voces marcam, acrescentam e removem. Fica gravado em
 * contexto/passos.json e viaja no git push com o resto do trabalho.
 */
export default function Passos() {
  const [passos, setPassos] = useState<Passo[]>([]);
  const [editavel, setEditavel] = useState(false);
  const [novo, setNovo] = useState("");
  const [carregou, setCarregou] = useState(false);

  async function carregar() {
    const r = await fetch("/api/passos");
    const d = await r.json();
    setPassos(d.passos);
    setEditavel(d.editavel);
    setCarregou(true);
  }

  useEffect(() => { carregar(); }, []);

  async function agir(corpo: object) {
    const r = await fetch("/api/passos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(corpo),
    });
    if (r.ok) {
      const d = await r.json();
      setPassos(d.passos);
    }
  }

  const feitos = passos.filter((p) => p.feito).length;

  return (
    <main>
      <header className="cabeca">
        <div className="env">
          <span className="crachá">Plano do time</span>
          <h1>O que falta<br />para o pitch</h1>
          <p className="sub">
            Esta lista é de vocês: marquem, acrescentem, removam. Ela fica no
            repositório e o git push publica o estado para o time inteiro.
          </p>
          <nav className="atalhos">
            <Link href="/">Conferência</Link>
            <Link href="/guia">Guia em 6 passos</Link>
            <Link href="/pecas">Peças visuais</Link>
          </nav>
        </div>
      </header>

      <div className="env" style={{ maxWidth: 760 }}>
        {!editavel && carregou && (
          <div className="bloco">
            <div className="aviso">
              <p className="prosa">
                Aqui no link publicado o plano é <b>somente leitura</b> — mostra o
                último git push. Para marcar e editar, rodem{" "}
                <span className="mono">npm run dev</span> e abram esta página no
                localhost.
              </p>
            </div>
          </div>
        )}

        <div className="bloco">
          <div className="entre">
            <h2 style={{ fontSize: 19, fontWeight: 700 }}>O plano</h2>
            <span className="rotulo">{feitos} de {passos.length} concluídos</span>
          </div>
          <div className="trilha" style={{ marginTop: 14 }}>
            <span style={{ width: `${passos.length ? Math.max((feitos / passos.length) * 100, 3) : 3}%` }} />
          </div>

          <div style={{ marginTop: 16 }}>
            {passos.map((p) => (
              <div key={p.id} className={p.feito ? "passo ok" : "passo"}>
                <button
                  className="bola"
                  style={{ cursor: editavel ? "pointer" : "default", border: p.feito ? 0 : undefined }}
                  onClick={() => editavel && agir({ acao: "alternar", id: p.id })}
                  aria-label={p.feito ? "desmarcar" : "marcar como concluído"}
                >
                  {p.feito ? "✓" : ""}
                </button>
                <span className="txt" style={{ flex: 1 }}>
                  <span className="nome" style={p.feito ? { textDecoration: "line-through", opacity: 0.6 } : undefined}>
                    {p.texto}
                  </span>
                </span>
                {editavel && (
                  <button
                    onClick={() => agir({ acao: "remover", id: p.id })}
                    style={{ background: "none", border: 0, color: "var(--ink-3)", cursor: "pointer", fontSize: 15 }}
                    aria-label="remover"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>

          {editavel && (
            <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
              <input
                className="campo"
                style={{ flex: 1, minWidth: 200 }}
                value={novo}
                onChange={(e) => setNovo(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && novo.trim()) {
                    agir({ acao: "adicionar", texto: novo });
                    setNovo("");
                  }
                }}
                placeholder="novo passo... (Enter adiciona)"
              />
              <button
                className="botao"
                style={{ padding: "12px 20px", fontSize: 14 }}
                onClick={() => { if (novo.trim()) { agir({ acao: "adicionar", texto: novo }); setNovo(""); } }}
              >
                Adicionar
              </button>
            </div>
          )}
        </div>

        <div className="bloco">
          <div className="rotulo">Qual a diferença para o /guia?</div>
          <p className="prosa" style={{ marginTop: 8 }}>
            O <span className="mono">/guia</span> se confere sozinho — mede a máquina
            (dados, chave, deploy). Este plano é de gente: é o combinado do time,
            na ordem que vocês escolherem. Os dois juntos contam a história inteira.
          </p>
        </div>
      </div>
    </main>
  );
}
