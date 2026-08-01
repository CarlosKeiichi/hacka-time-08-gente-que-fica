import Link from "next/link";
import Copiar from "../Copiar";

export const metadata = { title: "Peças visuais · Hackathon Fogo Alto" };

const NUMERAO = `<div>
  <div className="rotulo">Unidade A · amanhã</div>
  <div className="numerao">418</div>
  <div className="rotulo">refeições</div>
</div>`;

const FAROL = `<div className="item">
  <span className="farol f-bad" />
  <span className="txt">
    <span className="nome">Pão de hambúrguer</span>
    <span className="como">Loja 002 · acaba em 0,6 dia</span>
  </span>
  <span className="val mono">2 dias</span>
</div>`;

const MINIS = `<div className="grade-3">
  <div className="mini"><div className="n">431</div><div className="l">porções</div></div>
  <div className="mini"><div className="n">207 kg</div><div className="l">peso</div></div>
  <div className="mini"><div className="n">R$ 5.344</div><div className="l">custo</div></div>
</div>`;

const BARRAS = `{/* Grafico de barras sem biblioteca nenhuma: div com altura em %. */}
<div className="colunas">
  {dados.map((d) => (
    <div
      key={d.dia}
      style={{ height: \`\${(d.valor / maximo) * 100}%\` }}
      title={\`\${d.dia}: \${d.valor}\`}
    />
  ))}
</div>`;

const TAGS = `<span className="tag t-bad">prejuízo</span>
<span className="tag t-warn">atenção</span>
<span className="tag t-good">no lucro</span>`;

const IA = `const r = await fetch("/api/claude", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    pergunta: "Explique em uma frase por que a previsão caiu.",
    contexto: \`Amanhã é véspera de feriado.
Nas últimas 3 vésperas a presença caiu 18%.\`,
  }),
});
const { resposta } = await r.json();`;

export default function Pecas() {
  const dados = [
    { dia: "seg", valor: 418 }, { dia: "ter", valor: 442 }, { dia: "qua", valor: 451 },
    { dia: "qui", valor: 437 }, { dia: "sex", valor: 396 }, { dia: "sáb", valor: 210 },
  ];
  const maximo = Math.max(...dados.map((d) => d.valor));

  return (
    <main>
      <header className="cabeca">
        <div className="env">
          <span className="crachá">Peças visuais</span>
          <h1>Copie daqui</h1>
          <p className="sub">
            As peças já existem no <span className="mono">globals.css</span>. Ninguém precisa
            começar pelo CSS zerado — pegue a peça, troque o conteúdo, siga em frente.
          </p>
          <nav className="atalhos">
            <Link href="/">Conferência de dados</Link>
            <Link href="/guia">Guia em 6 passos</Link>
          </nav>
        </div>
      </header>

      <div className="env">
        <div className="bloco">
          <h2>O número que decide</h2>
          <p className="prosa" style={{ marginTop: 6 }}>
            Toda tela de resultado precisa de um número que se lê de longe. Um só.
          </p>
          <div className="palco">
            <div>
              <div className="rotulo">Unidade A · amanhã</div>
              <div className="numerao">418</div>
              <div className="rotulo">refeições</div>
            </div>
          </div>
          <Copiar codigo={NUMERAO} />
        </div>

        <div className="bloco">
          <h2>Números de apoio</h2>
          <div className="palco">
            <div className="grade-3" style={{ width: "100%" }}>
              <div className="mini"><div className="n">431</div><div className="l">porções</div></div>
              <div className="mini"><div className="n">207 kg</div><div className="l">peso</div></div>
              <div className="mini"><div className="n">R$ 5.344</div><div className="l">custo</div></div>
            </div>
          </div>
          <Copiar codigo={MINIS} />
        </div>

        <div className="bloco">
          <h2>Lista com semáforo</h2>
          <p className="prosa" style={{ marginTop: 6 }}>
            Para quando cada linha tem um estado: tranquilo, atenção, problema.
          </p>
          <div className="palco">
            <div style={{ width: "100%" }}>
              <div className="item">
                <span className="farol f-bad" />
                <span className="txt">
                  <span className="nome">Pão de hambúrguer</span>
                  <span className="como">Loja 002 · acaba em 0,6 dia</span>
                </span>
                <span className="val mono">2 dias</span>
              </div>
              <div className="item">
                <span className="farol f-warn" />
                <span className="txt">
                  <span className="nome">Queijo mussarela</span>
                  <span className="como">Loja 002 · chega em cima da hora</span>
                </span>
                <span className="val mono">0 dia</span>
              </div>
              <div className="item">
                <span className="farol f-good" />
                <span className="txt">
                  <span className="nome">Refrigerante lata</span>
                  <span className="como">estoque folgado</span>
                </span>
                <span className="val mono">5 dias</span>
              </div>
            </div>
          </div>
          <Copiar codigo={FAROL} />
        </div>

        <div className="bloco">
          <h2>Gráfico de barras, sem biblioteca</h2>
          <p className="prosa" style={{ marginTop: 6 }}>
            Para a maioria dos casos isto basta e instala em zero segundo: uma div por
            barra, altura em porcentagem.
          </p>
          <div className="palco">
            <div style={{ width: "100%" }}>
              <div className="colunas">
                {dados.map((d) => (
                  <div key={d.dia} style={{ height: `${(d.valor / maximo) * 100}%` }} />
                ))}
              </div>
              <div className="eixo">
                {dados.map((d) => (
                  <span key={d.dia}>{d.dia}</span>
                ))}
              </div>
            </div>
          </div>
          <Copiar codigo={BARRAS} />
        </div>

        <div className="bloco">
          <h2>Etiquetas de estado</h2>
          <div className="palco">
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <span className="tag t-bad">prejuízo</span>
              <span className="tag t-warn">atenção</span>
              <span className="tag t-good">no lucro</span>
              <span className="tag t-exemplo">exemplo</span>
            </div>
          </div>
          <Copiar codigo={TAGS} />
        </div>

        <div className="bloco">
          <h2>Chamar a IA</h2>
          <p className="prosa" style={{ marginTop: 6 }}>
            A rota já existe. Mande a pergunta e, se ajudar, o contexto com os números
            que vocês calcularam — a resposta fica muito melhor.
          </p>
          <Copiar codigo={IA} />
        </div>

        <div className="bloco">
          <h2>Bibliotecas: a lista honesta é curta</h2>
          <p className="prosa" style={{ marginTop: 8 }}>
            Escolher biblioteca é onde time de hackathon queima duas horas sem entregar
            nada. Com o que já está aqui, quase nada é necessário.
          </p>
          <div className="rolagem">
            <table>
              <thead>
                <tr><th>precisa de</th><th>use</th><th>quando</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td>ler CSV</td>
                  <td className="mono">lib/dados.ts</td>
                  <td>já está pronto, não instale nada</td>
                </tr>
                <tr>
                  <td>tabela</td>
                  <td className="mono">&lt;table&gt;</td>
                  <td>HTML puro, já estilizado</td>
                </tr>
                <tr>
                  <td>gráfico simples</td>
                  <td className="mono">.colunas</td>
                  <td>a peça acima, sem instalar nada</td>
                </tr>
                <tr>
                  <td>gráfico com eixo e tooltip</td>
                  <td className="mono">npm i recharts</td>
                  <td>só se o gráfico for o centro do pitch</td>
                </tr>
                <tr>
                  <td>QR code</td>
                  <td className="mono">npm i qrcode</td>
                  <td>time 04, para o QR da mesa</td>
                </tr>
                <tr>
                  <td>datas</td>
                  <td className="mono">Date</td>
                  <td>JavaScript puro dá conta de 90 dias</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="aviso" style={{ marginTop: 16 }}>
            <p className="prosa">
              Se der vontade de instalar outra coisa, pergunte antes: <b>isso me faz
              entregar mais rápido, ou só parece mais profissional?</b> No Dia 2, às 17h,
              a resposta é quase sempre a segunda.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
