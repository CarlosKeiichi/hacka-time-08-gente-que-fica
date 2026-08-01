"use client";

import { useEffect } from "react";

/**
 * Recarrega a pagina de tempos em tempos para o progresso andar sozinho.
 * Sem isto, o time so veria um passo virar verde ao apertar F5.
 */
export default function AutoAtualiza({ segundos = 20 }: { segundos?: number }) {
  useEffect(() => {
    const t = setInterval(() => {
      // Nao recarrega enquanto a pessoa esta em outra aba: nao adianta nada
      // e ainda gasta processamento do notebook dela.
      if (document.visibilityState === "visible") location.reload();
    }, segundos * 1000);
    return () => clearInterval(t);
  }, [segundos]);

  return null;
}
