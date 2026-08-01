"use client";

import { useState } from "react";

/**
 * O botao "pede a leitura da IA" do guia. O time coloca os arquivos
 * (contexto, dados, codigo) e a IA le e devolve o progresso.
 */
export default function LeituraIA() {
  const [leitura, setLeitura] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function pedir() {
    setCarregando(true);
    setErro("");
    try {
      const r = await fetch("/api/leitura", { method: "POST" });
      const d = await r.json();
      if (r.ok) setLeitura(d.leitura);
      else setErro(d.comoResolver ? `${d.erro} ${d.comoResolver}` : d.erro);
    } catch {
      setErro("Não consegui chamar a rota. O servidor está rodando?");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="bloco">
      <div className="entre">
        <h2 style={{ fontSize: 19, fontWeight: 700 }}>A leitura da IA</h2>
        <span className="rotulo">lê os seus arquivos</span>
      </div>
      <p className="prosa" style={{ marginTop: 8 }}>
        Colocou um arquivo novo — a dor preenchida, o dado do parceiro, código?
        Peça a leitura: a IA olha o que existe no repositório e diz o que está
        sólido, o que está raso e o próximo passo que mais destrava.
      </p>

      <button className="botao" style={{ marginTop: 14 }} onClick={pedir} disabled={carregando}>
        {carregando ? "Lendo os arquivos..." : "Pedir a leitura da IA"}
      </button>

      {erro && (
        <div className="aviso erro" style={{ marginTop: 14 }}>
          <p className="prosa">{erro}</p>
        </div>
      )}
      {leitura && (
        <div className="aviso ok" style={{ marginTop: 14 }}>
          <p className="prosa" style={{ whiteSpace: "pre-wrap" }}>{leitura}</p>
        </div>
      )}
    </div>
  );
}
