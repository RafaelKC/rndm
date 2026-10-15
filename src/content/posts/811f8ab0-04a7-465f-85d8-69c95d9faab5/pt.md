Este é o primeiro post do blog, então ele funciona como teste e como tutorial. Estou escrevendo principalmente **para mim mesmo**: um lembrete do que é este projeto e dos passos para publicar um novo post, para que daqui a alguns meses eu não precise reler o código.

## O que é este blog

"Random" é o meu blog pessoal, irmão do meu site principal, o [chicovis.dev](https://chicovis.dev). Ele usa as mesmas cores, fontes, ícones, cabeçalho e rodapé. É onde escrevo sobre o que eu tiver vontade: filmes, jogos, livros, séries e software.

Ele é feito com Angular, usando componentes standalone, signals e CSS puro. Não há framework como Tailwind nem backend: cada página é gerada como HTML estático no build, o que ajuda no SEO e nas prévias de links.

- **Dois idiomas**: inglês e português. Cada um tem sua própria URL, `/en/...` e `/pt/...`.
- **Temas escuro e claro**, lembrados em um cookie compartilhado com o site principal.
- **Acessibilidade em primeiro lugar**, com a WCAG 2.2 AA como meta.

![Página inicial do blog no tema escuro, com a lista de posts](assets/home-dark.png)

![Página inicial do blog no tema claro e em português](assets/home-light-pt.png)

## Como um post é organizado

Cada post é uma pasta dentro de `src/content/posts/`, e o nome da pasta é um GUID. Esse GUID é o id do post e também a sua URL: `/pt/post/<guid>`. Ele nunca deve ser renomeado depois de publicado.

```text
src/content/posts/<guid>/
  manifest.json   título, resumo, capa, tags, data, availableLangs
  en.md           o post em inglês
  pt.md           o post em português
  assets/         capa e imagens
```

O `manifest.json` guarda os metadados. Todo texto nele é um objeto com uma entrada por idioma, por exemplo `{ "en": "...", "pt": "..." }`. O campo `wordCount` fica como `{}`, porque é calculado automaticamente.

Os arquivos Markdown guardam só o corpo. O título vem do manifest e é o `h1` da página, então os títulos dentro do Markdown começam em `##`.

<!-- SCREENSHOT 3: a pasta do post aberta no editor -->

## Criando um novo post

Eu não faço isso na mão. O projeto tem uma skill do Claude Code para isso.

1. Abro o projeto no editor e rodo `/new-post` no Claude Code, seguido de uma descrição curta do post: assunto, idiomas, tags e capa.
2. A skill cria uma pasta com um novo GUID, baixa ou copia a capa, preenche o manifest e escreve o Markdown a partir dos templates.
3. Ela roda `pnpm posts`, que valida tudo e falha com uma mensagem clara se algo estiver faltando.
4. Eu subo o app com `pnpm start`, confiro o post na home e na própria página, e ajusto o que não gostei.

<!-- SCREENSHOT 4: o comando /new-post no terminal do Claude Code -->

Se um dia eu precisar fazer manualmente, os passos são os mesmos: gerar um GUID com `node -e "console.log(crypto.randomUUID())"`, criar a pasta e a subpasta `assets/`, copiar os templates de `.claude/skills/new-post/templates/`, preencher e rodar `pnpm posts`.

## Adicionando imagens

As imagens vão na pasta `assets/` do post e são referenciadas no Markdown com um caminho relativo. O texto alternativo é obrigatório, porque é o que os leitores de tela anunciam.

```md
![Página inicial do blog no tema escuro](assets/home-dark.png)
```

## Visualizando e publicando

- `pnpm start` roda o servidor de desenvolvimento. Depois de adicionar um post, reinicie para a lista da home ser regenerada.
- `pnpm build` faz o build de produção, com todas as páginas pré-renderizadas.
- `pnpm posts` valida os posts e regenera o índice e o `public/sitemap.xml`. O sitemap muda a cada novo post, então ele é commitado junto.

![Este post aberto no navegador](assets/post-dark.png)

## Editando um post publicado

Altere o arquivo `.md`, defina `updated` no manifest com a data atual e rode `pnpm posts` de novo.

## Sobre este post

Este é o primeiríssimo post e foi escrito como um tutorial para o meu eu do futuro. Os prints do projeto já estão aqui; faltam os do editor e do terminal. Se você não sou eu e veio parar aqui mesmo assim, seja bem-vindo, e espero que tenha sido ao menos um pouco útil.
