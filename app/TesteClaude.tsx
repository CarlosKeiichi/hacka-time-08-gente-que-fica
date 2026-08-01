"use client";

import { useState } from "react";

/**
 * Prova de que a rota do Claude funciona. Apague quando nao precisar mais.
 */
export default function TesteClaude() {
  const [pergunta, setPergunta] = useState("");
  const [resposta, setResposta] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function perguntar() {
    setCarregando(true);
    setResposta("");
    setErro("");
    try {
      const r = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pergunta }),
      });
      const dados = await r.json();
      if (r.ok) setResposta(dados.resposta);
      else setErro(dados.comoResolver ? `${dados.erro} ${dados.comoResolver}` : dados.erro);
    } catch {
      setErro("Nao consegui chamar a rota. O servidor esta rodando?");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="bloco">
      <h2>A IA esta ligada?</h2>
      <p className="prosa" style={{ marginTop: 8 }}>
        Faca uma pergunta qualquer. Se vier resposta, a chave esta certa e a rota funciona.
      </p>

      <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
        <input
          className="campo"
          style={{ flex: 1, minWidth: 220 }}
          value={pergunta}
          onChange={(e) => setPergunta(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && pergunta.trim() && !carregando && perguntar()}
          placeholder="ex: o que e CMV, em uma frase?"
        />
        <button
          className="botao"
          onClick={perguntar}
          disabled={carregando || !pergunta.trim()}
        >
          {carregando ? "Perguntando..." : "Perguntar"}
        </button>
      </div>

      {erro && (
        <div className="aviso erro">
          <p className="prosa">{erro}</p>
        </div>
      )}
      {resposta && (
        <div className="aviso ok">
          <p className="prosa" style={{ whiteSpace: "pre-wrap" }}>
            {resposta}
          </p>
        </div>
      )}
    </div>
  );
}
