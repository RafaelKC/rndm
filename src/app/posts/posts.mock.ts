import { Post } from './post.model';

/** Placeholder data until posts are loaded from Markdown (see ROADMAP). */
export const MOCK_POSTS: Post[] = [
  {
    id: 'sample-movie',
    title: { en: 'Sample movie review', pt: 'Resenha de filme de exemplo' },
    summary: {
      en: 'A placeholder summary for a movie review. It only exists to show how a post card looks with a few lines of text, so it can be replaced as soon as real posts are available.',
      pt: 'Um resumo de exemplo para uma resenha de filme. Ele serve só para mostrar como o card de um post fica com algumas linhas de texto, e será trocado quando houver posts de verdade.',
    },
    imageUrl: 'https://picsum.photos/seed/rndm-movie/600/400',
    tags: [{ en: 'Movie', pt: 'Filme' }, { en: 'Review', pt: 'Resenha' }],
    date: new Date('2026-10-10'),
    wordCount: { en: 820, pt: 840 },
    availableLangs: ['pt', 'en'],
  },
  {
    id: 'sample-game',
    title: { en: 'Sample game review', pt: 'Resenha de jogo de exemplo' },
    summary: {
      en: 'Another placeholder summary, this time for a game. This one is only available in English, to check how the list behaves when a post has a single language.',
    },
    imageUrl: 'https://picsum.photos/seed/rndm-game/600/400',
    tags: [{ en: 'Game', pt: 'Jogo' }],
    date: new Date('2026-10-05'),
    wordCount: { en: 1500 },
    availableLangs: ['en'],
  },
  {
    id: 'sample-book',
    title: { pt: 'Resenha de livro de exemplo' },
    summary: {
      pt: 'Mais um resumo de exemplo, agora para um livro. Este só existe em português, para testar como a lista se comporta quando o idioma atual não está disponível.',
    },
    imageUrl: 'https://picsum.photos/seed/rndm-book/600/400',
    tags: [{ en: 'Book', pt: 'Livro' }, { en: 'Review', pt: 'Resenha' }, { en: 'Fiction', pt: 'Ficção' }],
    date: new Date('2026-09-28'),
    wordCount: { pt: 960 },
    availableLangs: ['pt'],
  },
  {
    id: 'sample-series',
    title: { en: 'Sample series review', pt: 'Resenha de série de exemplo' },
    summary: {
      en: 'A placeholder summary for a series review with a considerably longer text, to make sure the card cuts it off cleanly instead of growing forever. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      pt: 'Um resumo de exemplo para uma resenha de série com um texto bem mais longo, para garantir que o card o corte direito em vez de crescer sem parar. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
    imageUrl: 'https://picsum.photos/seed/rndm-series/600/400',
    tags: [{ en: 'Series', pt: 'Série' }],
    date: new Date('2026-09-15'),
    wordCount: { en: 1100, pt: 1130 },
    availableLangs: ['pt', 'en'],
  },
  {
    id: 'sample-software',
    title: { en: 'Sample software note', pt: 'Anotação de software de exemplo' },
    summary: {
      en: 'A short placeholder note about something learned while writing code.',
      pt: 'Uma anotação curta de exemplo sobre algo aprendido enquanto escrevia código.',
    },
    imageUrl: 'https://picsum.photos/seed/rndm-software/600/400',
    tags: [{ en: 'Software', pt: 'Software' }, { en: 'Angular', pt: 'Angular' }],
    date: new Date('2026-09-01'),
    wordCount: { en: 450, pt: 460 },
    availableLangs: ['pt', 'en'],
  },
];
