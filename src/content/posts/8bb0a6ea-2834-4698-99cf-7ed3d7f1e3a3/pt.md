Este é o primeiro post do **Random**, e na prática um test drive. Ele existe para conferir se tudo o que um post precisa funciona: texto, listas, código, imagens e um pouco de HTML puro no meio do Markdown.

## O que é este blog

Um lugar para escrever o que eu tiver vontade: anotações, experimentos, o que estou aprendendo e resenhas de filmes, séries, jogos e livros. Principalmente software, mas nem sempre.

> Escrever é como eu descubro o que eu realmente penso.

## Como um post é feito

Cada post fica na sua própria pasta, com um arquivo Markdown por idioma e um manifesto com os metadados:

- `manifest.json`: título, resumo, tags, data e contagem de palavras
- `pt.md` e `en.md`: o conteúdo, em cada idioma
- `assets/`: as imagens usadas pelo post

![Um diagrama pequeno: uma ideia vira rascunho, que vira post](assets/diagram.svg)

Se um post existe em um só idioma, é esse que você recebe.

## Código também funciona

```ts
const greeting = (name: string) => `Olá, ${name}!`;
console.log(greeting('Random'));
```

Código em linha como `pnpm build` também funciona, e tabelas também:

| Tipo | Exemplo |
| --- | --- |
| Filme | Uma resenha |
| Jogo | Outra resenha |

## HTML puro no meio

O Markdown aceita HTML quando precisa de mais controle. Aperte <kbd>Ctrl</kbd> + <kbd>K</kbd>, destaque uma <mark>frase importante</mark> ou esconda algo atrás de um toggle:

<details>
  <summary>Clique para expandir</summary>
  <p>Este bloco foi escrito em HTML, no meio do arquivo Markdown.</p>
</details>

<figure>
  <img src="assets/diagram.svg" alt="O mesmo diagrama, agora dentro de um elemento figure" width="640" height="200">
  <figcaption>Uma imagem com legenda, usando <code>&lt;figure&gt;</code>.</figcaption>
</figure>

É isso. Mais em breve.
