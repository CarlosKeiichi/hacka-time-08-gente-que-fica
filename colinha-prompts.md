# Colinha de Prompts · um por papel, um por fase

> Como falar com o Claude: diga QUEM você é, o CONTEXTO, o que QUER e em que FORMATO. Cole e adapte os prompts abaixo.

## FASE 1 · DESCOBRIR

**Voz do Cliente / time (preparar a entrevista):**
> Você é um consultor experiente de foodservice. Vamos entrevistar um [dono de restaurante / gerente de refeição coletiva / comprador de rede] sobre esta dor: [cole a dor do card]. Gere 10 perguntas de entrevista que revelem QUANDO a dor acontece, QUANTO custa e o que já foi tentado. Perguntas curtas, de conversa, sem jargão.

**Depois da entrevista (virar o 01-dor.md):**
> Aqui estão minhas anotações da entrevista: [cole]. Organize no formato do arquivo que vou colar a seguir, mantendo as palavras do entrevistado sempre que possível: [cole o template 01-dor.md].

## FASE 2 · DEFINIR

**Chef de Produto (gerar o PRD):**
> Com base nesta dor [cole 01-dor.md], proponha 3 opções de MVP que caibam em 6 horas de construção, cada uma com 1 fluxo principal + 1 tela de resultado. Para cada opção: o que faz, o que a IA faz dentro dela, e qual é a demo de 60 segundos. Depois me ajude a escolher pela Matriz Impacto x Esforço.

**Cortar escopo (usar sempre que a ideia crescer):**
> Isso cabe em 6 horas de construção com Claude Code? Se não, corte até caber e mova o resto para o backlog. Seja impiedoso.

**Gerente de Salão (negócio):**
> Com base na dor [cole 01-dor.md] e no MVP [cole a escolha], preencha este template de negócio com números realistas do foodservice brasileiro, citando premissas: [cole 03-negocio.md].

## FASE 2 · WIREFRAME

**Empratamento (wireframe navegável em HTML):**
> Crie um wireframe navegável em um único arquivo HTML (sem frameworks) com as telas do MVP: [cole o fluxo do 02-prd.md]. Estilo: preto e branco, caixas e textos de exemplo, botões clicáveis navegando entre as telas. Grande o suficiente pra testar no celular. Não é o produto final, é o esqueleto pra validar com o dono.

## FASE 3 · CONSTRUIR (Claude Code)

**Prompt 1 (o plano, sempre primeiro):**
> Leia toda a pasta contexto/ e a pasta dados/. Me devolva: (1) um resumo de 5 linhas do que vamos construir, (2) um plano em etapas de ~30 minutos da mais essencial à menos essencial, (3) o que você precisa que a gente decida agora. NÃO escreva código ainda.

**Prompt 2 (executar por etapa):**
> Aprovado. Execute a etapa 1 do plano. Ao terminar: rode, me diga como testar em 2 frases simples e faça o deploy.

**Quando travar:**
> Este erro apareceu: [cole]. Explique em linguagem simples o que houve, conserte e me diga o que você mudou.

**Pedido da Voz do Cliente (qualquer um do time pode pilotar):**
> O dono testou e pediu: [mudança]. Isso cabe no escopo do 02-prd.md? Se sim, implemente. Se não, registre em contexto/backlog.md e me avise.

## FASE 4 · DEMONSTRAR

**Roteiro do pitch (Gerente de Salão + Cronista):**
> Com base em contexto/01-dor.md, 02-prd.md e 03-negocio.md, escreva um roteiro de pitch de 5 minutos: 30s a dor (com o número que dói), 60s a solução, 2min o roteiro da demo ao vivo passo a passo, 60s o negócio (os 3 números), 30s o pedido (A Fornada). Linguagem falada, sem jargão.

**Ensaio de perguntas da banca:**
> Você é uma banca exigente (investidora, indústria e técnico). Faça as 6 perguntas mais prováveis sobre este projeto e sugira respostas curtas: [cole o pitch].

## REGRAS DE SEGURANÇA (valem pra todos)

1. Nunca cole senha, chave ou dado pessoal real no chat.
2. Dados só anonimizados (veja dados/LEIA-ME.md).
3. Código gerado é revisado pelo Chef de Partida antes do deploy.
4. Na dúvida sobre um número que a IA deu, peça a fonte ou confira.
