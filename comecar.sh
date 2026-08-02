#!/usr/bin/env bash
# Sente e comece — prepara a máquina e sobe o app do time.
#
#   ./comecar.sh        (no VS Code: abra a pasta e rode isso no terminal integrado)
#
# Sem Node na máquina? Sem problema: abra este repositório no GitHub e aperte
# a tecla ponto (.) — vira o VS Code no navegador, sem instalar nada.
# Salvou e fez push, o app publica sozinho no link do time.

set -e
cd "$(dirname "$0")"

if ! command -v node >/dev/null 2>&1; then
  echo ""
  echo "  Falta o Node.js nesta máquina (nodejs.org, versão LTS)."
  echo "  Instale e rode de novo — ou use o caminho do navegador:"
  echo "  abra o repositório no GitHub e aperte ponto (.)"
  echo ""
  exit 1
fi
echo "  Node $(node -v) ok"

if [ ! -d node_modules ]; then
  echo "  instalando dependências (1 a 2 minutos, só na primeira vez)..."
  npm install --no-fund --no-audit
fi

echo ""
echo "  Pronto. Subindo o app em http://localhost:3000"
echo "  O passo a passo do time está em http://localhost:3000/guia"
echo "  Para publicar: git add -A && git commit -m \"o que mudou\" && git push"
echo ""
npm run dev
