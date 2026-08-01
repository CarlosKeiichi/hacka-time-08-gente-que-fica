"use client";

import { useState } from "react";

/** Bloco de codigo com botao de copiar. */
export default function Copiar({ codigo }: { codigo: string }) {
  const [copiado, setCopiado] = useState(false);

  async function copiar() {
    await navigator.clipboard.writeText(codigo);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 1800);
  }

  return (
    <div className="codigo">
      <button className="copiar" onClick={copiar}>
        {copiado ? "copiado" : "copiar"}
      </button>
      <pre>{codigo}</pre>
    </div>
  );
}
