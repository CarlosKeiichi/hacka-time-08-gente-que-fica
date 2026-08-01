import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

/**
 * O time ja escreveu codigo proprio?
 *
 * Isto e calculado AQUI, em tempo de build, e nao em tempo de execucao — porque
 * em producao (Vercel) o codigo-fonte nao existe mais: so o bundle. Uma
 * comparacao de arquivos em runtime acharia que tudo sumiu e marcaria o passo
 * indevidamente.
 */
function timeMexeuNoCodigo() {
  const raiz = process.cwd();
  const manifesto = path.join(raiz, ".esqueleto.json");
  if (!fs.existsSync(manifesto)) return false;

  const original = JSON.parse(fs.readFileSync(manifesto, "utf-8")).arquivos;

  for (const [rel, digital] of Object.entries(original)) {
    const p = path.join(raiz, rel);
    if (!fs.existsSync(p)) return true;
    const atual = crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex").slice(0, 16);
    if (atual !== digital) return true;
  }

  const pilha = ["app", "lib", "components"].map((d) => path.join(raiz, d)).filter(fs.existsSync);
  while (pilha.length) {
    const atual = pilha.pop();
    for (const e of fs.readdirSync(atual, { withFileTypes: true })) {
      const cheio = path.join(atual, e.name);
      if (e.isDirectory()) pilha.push(cheio);
      else if (/\.(ts|tsx|js|jsx|css)$/.test(e.name) && !(path.relative(raiz, cheio) in original))
        return true;
    }
  }
  return false;
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Os CSVs sao lidos do disco em tempo de execucao no servidor.
  // Nada de banco, nada de fila: e um hackathon de 2 dias.
  env: {
    TIME_MEXEU_NO_CODIGO: timeMexeuNoCodigo() ? "1" : "0",
  },
};

export default nextConfig;
