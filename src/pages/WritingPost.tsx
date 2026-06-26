import { Link, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import PageTransition from '../components/PageTransition'
import { getPost, formatDate } from '../content/posts'

function WritingPost() {
  const { slug } = useParams()
  const post = slug ? getPost(slug) : undefined

  if (!post) {
    return (
      <PageTransition>
        <section className="mx-auto max-w-3xl px-6 pt-40 pb-24 text-center">
          <h1 className="font-display text-3xl text-mist-100">
            This writing wandered off.
          </h1>
          <Link
            to="/writings"
            className="mt-6 inline-block text-sm text-aura-300 hover:underline"
          >
            ← Back to all writings
          </Link>
        </section>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <article className="mx-auto max-w-2xl px-6 pt-32 pb-24">
        <Link
          to="/writings"
          className="text-sm text-mist-500 transition-colors hover:text-mist-100"
        >
          ← Writings
        </Link>

        <header className="mt-8">
          <div className="flex items-center gap-3 text-xs tracking-wide text-mist-500">
            <span>{formatDate(post.date)}</span>
            <span className="h-1 w-1 rounded-full bg-mist-500" />
            <span>{post.readingTime}</span>
          </div>
          <h1 className="mt-3 font-display text-4xl leading-tight font-light sm:text-5xl">
            {post.title}
          </h1>
        </header>

        <div
          className="mt-10 space-y-6 leading-relaxed text-mist-300
            [&_blockquote]:border-l-2 [&_blockquote]:border-aura-400/50 [&_blockquote]:pl-5 [&_blockquote]:font-display [&_blockquote]:text-xl [&_blockquote]:text-mist-100 [&_blockquote]:italic
            [&_h2]:mt-12 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-light [&_h2]:text-mist-100
            [&_li]:ml-1 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6
            [&_strong]:text-mist-100
            [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6"
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>
      </article>
    </PageTransition>
  )
}

export default WritingPost
