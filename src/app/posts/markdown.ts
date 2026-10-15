import { marked } from 'marked';
import { postBaseUrl } from './post.model';

/**
 * Markdown → HTML. Raw HTML inside the Markdown is kept (Angular's `[innerHTML]` sanitizes it later).
 * Files in the post's `assets/` folder are referenced as `assets/<file>` and rewritten to their public URL.
 */
export function renderMarkdown(markdown: string, postId: string): string {
  const html = marked.parse(markdown, { async: false });
  return html.replace(/\b(src|href|poster)="assets\//g, `$1="${postBaseUrl(postId)}/assets/`);
}
