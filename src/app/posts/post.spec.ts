import { renderMarkdown } from './markdown';
import { GUID_PATTERN, formatPostDate, pickContentLang } from './post.model';

describe('pickContentLang', () => {
  it('uses the requested language when available', () => {
    expect(pickContentLang(['pt', 'en'], 'pt', 'en')).toBe('pt');
  });

  it('falls back to the default language', () => {
    expect(pickContentLang(['en'], 'pt', 'en')).toBe('en');
  });

  it('uses the only available language when the default is missing', () => {
    expect(pickContentLang(['pt'], 'en', 'en')).toBe('pt');
  });
});

describe('renderMarkdown', () => {
  const id = '8bb0a6ea-2834-4698-99cf-7ed3d7f1e3a3';

  it('renders Markdown', () => {
    expect(renderMarkdown('## Title\n\n**bold**', id)).toContain('<h2>Title</h2>');
  });

  it('keeps raw HTML in the middle of the Markdown', () => {
    const html = renderMarkdown('Before\n\n<details><summary>More</summary><p>Hi</p></details>\n\nAfter', id);
    expect(html).toContain('<details>');
    expect(html).toContain('<p>After</p>');
  });

  it('rewrites assets/ paths, in Markdown and in HTML', () => {
    const html = renderMarkdown('![x](assets/a.png)\n\n<img src="assets/b.png" alt="">', id);
    expect(html).toContain(`src="/posts/${id}/assets/a.png"`);
    expect(html).toContain(`src="/posts/${id}/assets/b.png"`);
  });

  it('leaves external links alone', () => {
    expect(renderMarkdown('[a](https://example.com)', id)).toContain('href="https://example.com"');
  });
});

describe('post helpers', () => {
  it('recognizes GUIDs', () => {
    expect(GUID_PATTERN.test('8bb0a6ea-2834-4698-99cf-7ed3d7f1e3a3')).toBe(true);
    expect(GUID_PATTERN.test('not-a-guid')).toBe(false);
  });

  it('formats calendar dates without shifting the day', () => {
    expect(formatPostDate(new Date('2026-10-14'), 'en')).toBe('Oct 14, 2026');
  });
});
