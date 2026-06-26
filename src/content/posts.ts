import stillness from './posts/stillness-between-thoughts.md?raw'
import consciousness from './posts/consciousness-and-code.md?raw'

export type Post = {
  slug: string
  title: string
  date: string // ISO date
  readingTime: string
  excerpt: string
  content: string
}

export const posts: Post[] = [
  {
    slug: 'consciousness-and-code',
    title: 'Consciousness & Code',
    date: '2026-06-20',
    readingTime: '3 min',
    excerpt:
      'I spend my days building systems out of logic, and my mornings dissolving the one who builds them. Lately I suspect they are the same inquiry.',
    content: consciousness,
  },
  {
    slug: 'stillness-between-thoughts',
    title: 'The Stillness Between Thoughts',
    date: '2026-06-08',
    readingTime: '2 min',
    excerpt:
      'There is a gap between two thoughts. Meditation, at its simplest, is the slow art of lingering in that gap.',
    content: stillness,
  },
]

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug)
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
