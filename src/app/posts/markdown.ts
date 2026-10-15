import hljs from 'highlight.js/lib/core';
import bash from 'highlight.js/lib/languages/bash';
import csharp from 'highlight.js/lib/languages/csharp';
import css from 'highlight.js/lib/languages/css';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import markdown from 'highlight.js/lib/languages/markdown';
import python from 'highlight.js/lib/languages/python';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import yaml from 'highlight.js/lib/languages/yaml';
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import { postBaseUrl } from './post.model';

// Only the languages posts actually use, to keep the bundle small. Add more here when needed.
const LANGUAGES = { bash, csharp, css, javascript, json, markdown, python, typescript, xml, yaml };
for (const [name, definition] of Object.entries(LANGUAGES)) hljs.registerLanguage(name, definition);
hljs.registerAliases(['sh', 'shell', 'zsh'], { languageName: 'bash' });
hljs.registerAliases(['ts'], { languageName: 'typescript' });
hljs.registerAliases(['js'], { languageName: 'javascript' });
hljs.registerAliases(['html', 'svg'], { languageName: 'xml' });
hljs.registerAliases(['cs'], { languageName: 'csharp' });
hljs.registerAliases(['yml'], { languageName: 'yaml' });
hljs.registerAliases(['md'], { languageName: 'markdown' });

const marked = new Marked(
  markedHighlight({
    emptyLangClass: 'hljs',
    langPrefix: 'hljs language-',
    highlight: (code, lang) => (hljs.getLanguage(lang) ? hljs.highlight(code, { language: lang }).value : escapeHtml(code)),
  }),
);

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * Markdown → HTML, with syntax highlighting for fenced code blocks. Raw HTML inside the Markdown is kept
 * (Angular's `[innerHTML]` sanitizes it later). Files in the post's `assets/` folder are referenced as
 * `assets/<file>` and rewritten to their public URL.
 */
export function renderMarkdown(source: string, postId: string): string {
  const html = marked.parse(source, { async: false });
  return html.replace(/\b(src|href|poster)="assets\//g, `$1="${postBaseUrl(postId)}/assets/`);
}
