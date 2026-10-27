O `twig` é uma ferramenta de linha de comando que escrevi para parar de ficar malabarizando branches. Você passa o número de um card e ela monta um ambiente isolado para a tarefa: um git worktree por repositório, um agente de IA por repo e um workspace do VS Code, tudo pronto para trabalhar.

É código aberto: [github.com/RafaelKC/twig](https://github.com/RafaelKC/twig).

## O problema

Uma tarefa de verdade raramente vive em um repositório só. O back end, o front end e uma biblioteca compartilhada mudam juntos. E quando troco de branch nos meus clones principais para trabalhar em uma segunda tarefa, quebro tudo o que estava rodando para a primeira: servidores de desenvolvimento reiniciam, builds falham, mudanças pela metade atrapalham.

Eu queria que cada card tivesse o seu próprio ambiente isolado, e que criar um custasse um comando, não dez minutos.

## A ideia

Cada card (um work item do Azure DevOps ou uma issue do GitHub) ganha uma pasta com um [git worktree](https://git-scm.com/docs/git-worktree) de cada repo que ele toca:

```
~/.wt/52644/
├── api/                    git worktree na branch do card
├── web/                    git worktree na branch do card
├── CLAUDE.md               título, descrição, critérios de aceite, repos e regras do card
├── 52644.code-workspace    workspace do VS Code, colorido por card
└── .ado.json               work item em cache
```

Meus clones principais ficam na `main` e nunca são tocados. Dois cards nunca pisam um no outro.

## Criando um card

```bash
twig new 52644
```

O twig lê o card do Azure DevOps (`az`) ou do GitHub (`gh`), escolhe a branch de cada repo e monta tudo. A branch é uma branch existente no `origin` com o número do card no nome, ou uma nova `feat/52644-vehicle-category-per-route` (`fix/` para bugs), com o slug tirado do título do card.

<!-- IMAGE 1: terminal with the output of `twig new <id>` (cards, branches, workspace created). File: assets/01-twig-new.png -->

![Terminal mostrando a saída do twig new: o título do card, um worktree e uma branch criados para cada repo e os workspaces gerados](assets/01-twig-new.png)

Os arquivos ignorados pelo git que você precisa para rodar o projeto (`appsettings.Development.json`, `.env.local`...) são copiados do clone principal para cada worktree, então o card já começa funcionando.

## Um agente por repo, no herdr

A parte de que mais gosto. Conheci o herdr pelo meu amigo [Luis Otavio](https://blog.wired.rs/), e ele mudou o jeito como trabalho com agentes. O twig abre um workspace no [herdr](https://herdr.dev) com duas abas:

- **agent**: um painel por repo, cada um rodando o agente de IA (o Claude Code, no meu caso) dentro do worktree daquele repo;
- **run**: um painel por repo que sobe o projeto (`pnpm start`, `dotnet watch run`...).

<!-- IMAGE 2: herdr with the card's workspace: `agent` tab with two panes (one per repo). File: assets/02-herdr-workspace.png -->

![O workspace do herdr de um card, com a aba agent mostrando um painel por repositório, cada um rodando um agente de IA](assets/02-herdr-workspace.png)

Fechou um painel sem querer? O `twig add-repo` traz de volta, e é também como você adiciona outro repo a um card depois.

## O contexto do card para o agente

Dentro da pasta do card, o twig gera um `CLAUDE.md` com título, estado, descrição e critérios de aceite do card, os repos, as branches e as regras. O agente já começa sabendo qual é a tarefa. Há também uma seção "card context" para anotações que sobrevive à regeneração, então uma nova sessão continua de onde a anterior parou.

<!-- IMAGE 3: the generated CLAUDE.md of a card open in an editor (hide any private data from the card). File: assets/04-card-claude-md.png -->

![O CLAUDE.md gerado para um card, com o título do work item, a descrição, os critérios de aceite e a lista de repos e branches](assets/04-card-claude-md.png)

## Um workspace do VS Code com cor

O twig também gera um `.code-workspace` com nomes amigáveis nas pastas, uma cor na barra de título diferente para cada card (para eu nunca editar a janela errada), tarefas `run:` e um debug composto que sobe todos os repos de uma vez.

<!-- IMAGE 4: VS Code with a card's workspace: colored title bar and the folders of the repos in the explorer. File: assets/03-vscode-workspace.png -->

![VS Code mostrando o workspace de um card, com a barra de título colorida e uma pasta por repositório no explorador](assets/03-vscode-workspace.png)

```bash
twig code        # abre o card atual no VS Code
```

## No dia a dia

```bash
twig ls                         # cards, branches e mudanças não commitadas (*)
twig herdr 52644                # abre o card no herdr
twig refresh 52644 --refetch    # regenera CLAUDE.md / workspace e busca o card de novo
twig rm 52644 --branches        # terminei: remove os worktrees e as branches locais
twig doctor                     # confere ferramentas, logins, config e repos
```

<!-- IMAGE 5: terminal with the output of `twig ls` showing a few cards. File: assets/05-twig-ls.png -->

![Terminal mostrando o twig ls, com os cards ativos, a branch de cada repositório e um asterisco nos que têm mudanças não commitadas](assets/05-twig-ls.png)

O `twig rm` se recusa a remover um card com mudanças não commitadas, e o `twig doctor` também encontra worktrees órfãos.

## Configuração

Tudo o que é específico do meu ambiente fica em um arquivo, `~/.config/twig/config.toml`:

```toml
version = 1

[provider]
default = "az"                      # ou "gh"

[paths]
worktrees = "~/.wt"
repos     = "~/dev"

[repos.api]
label   = "⚙️ API"                  # nome da pasta no VS Code
short   = "api"                     # nome do painel no herdr
default = true                      # entra em todo card novo
run     = "dotnet watch run --project src/Api"
install = "dotnet restore"

[repos.web]
label   = "🌐 Web"
default = true
run     = "pnpm start"
```

Todos os campos estão na [referência de configuração](https://github.com/RafaelKC/twig/blob/main/docs/CONFIG.md).

## Uma skill para o agente

O twig vem com uma [skill](https://github.com/RafaelKC/twig/blob/main/skills/twig/SKILL.md) para agentes de IA. Com ela, posso só dizer "começa o card 52644" ou "terminei o card 52644" e o agente roda os comandos certos. Quando está dentro da pasta de um card, ele lê o `CLAUDE.md` daquele card antes de qualquer coisa.

## Instalando

Linux (x86_64 e arm64, incluindo WSL) e macOS (Intel e Apple Silicon):

```bash
curl -fsSL https://rndm.chicovis.dev/twig/unix-install | sh
```

Windows nativo (beta), no PowerShell:

```powershell
irm https://rndm.chicovis.dev/twig/windows-install | iex
```

O instalador confere e instala as dependências (git, herdr, `az` ou `gh`, Claude Code e, opcionalmente, o VS Code), baixa a release para o seu sistema, verifica o checksum e a assinatura Sigstore, e instala o twig, a skill, o plugin do herdr e o autocompletar do shell. Rodar de novo atualiza. Depois:

```bash
twig config edit
twig doctor
```

As URLs curtas são só redirects para o instalador da última release no GitHub, então dá para ler o script antes de rodar, o que eu recomendo para qualquer coisa que você manda para o `sh`.

## Próximos passos

O que está no [roadmap](https://github.com/RafaelKC/twig/blob/main/docs/ROADMAP.md), mais ou menos na ordem em que quero:

- **Portas por card**, para dois cards rodarem seus apps ao mesmo tempo, com o front apontando para o back do mesmo card. Para isso, o twig precisa reconhecer o tipo do projeto (.NET, Angular, Node, Vite...) e saber onde definir a porta.
- **Mais ações no herdr**: abrir o card ou o pull request dele no navegador, fechar um card pelo herdr, mostrar o status do card na barra lateral e avisar quando um agente ficar bloqueado esperando por mim.
- **Review de pull request no terminal**, com o [herdr-reviewr](https://github.com/persiyanov/herdr-reviewr): um worktree criado a partir da branch do PR, comentários por linha e o agente postando tudo inline no PR.
- **Dados do pull request pelo provider**: status e link do PR da branch do card.
- **Windows nativo**. Já instala com o comando acima, mas continua em beta até o suporte a Windows do herdr sair do beta. O WSL segue como opção estável.
- **Qualidade**: testes de integração para `new`, `add-repo` e `rm`, CI nos pull requests e testes no macOS.
- **Um nome final**: `twig` ainda é provisório.

## Status

Ainda é cedo e ele se encaixa no meu jeito de trabalhar: Azure DevOps ou GitHub, git, herdr e Claude Code. Se também serve para você, ou se quiser mudar alguma coisa, o [repositório](https://github.com/RafaelKC/twig) está aberto para issues e pull requests.
