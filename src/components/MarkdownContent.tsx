import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useState } from 'react'

// ── Copy button ───────────────────────────────────────────
function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button onClick={copy}
      className="absolute top-3 right-3 px-2.5 py-1 text-xs rounded-md bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-all">
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  )
}

// ── Language badge ────────────────────────────────────────
const LANG_COLORS: Record<string, string> = {
  python: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  bash:   'bg-green-500/20 text-green-300 border-green-500/30',
  sql:    'bg-orange-500/20 text-orange-300 border-orange-500/30',
  typescript: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  javascript: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  ini:    'bg-purple-500/20 text-purple-300 border-purple-500/30',
  dockerfile: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
}

// ── Callout detector (lines starting with > 💡 or > ⚠️) ──
function parseCallout(text: string) {
  if (text.startsWith('💡') || text.startsWith('**💡')) {
    return { type: 'tip', icon: '💡', color: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-200/80' }
  }
  if (text.startsWith('⚠️') || text.startsWith('**⚠️')) {
    return { type: 'warning', icon: '⚠️', color: 'bg-orange-500/10 border-orange-500/30 text-orange-200/80' }
  }
  if (text.startsWith('🎯') || text.startsWith('**🎯')) {
    return { type: 'goal', icon: '🎯', color: 'bg-blue-500/10 border-blue-500/30 text-blue-200/80' }
  }
  return null
}

// ── Main MarkdownContent component ───────────────────────
export default function MarkdownContent({
  content,
  accentColor = 'orange',
}: {
  content: string
  accentColor?: 'orange' | 'purple' | 'green' | 'indigo' | 'teal'
}) {
  const h2Class = {
    orange: 'text-orange-300 border-orange-800/40',
    purple: 'text-purple-300 border-purple-800/40',
    green:  'text-green-300 border-green-800/40',
    indigo: 'text-indigo-300 border-indigo-800/40',
    teal:   'text-teal-300 border-teal-800/40',
  }[accentColor]

  const codeInlineClass = {
    orange: 'text-orange-300 bg-orange-900/20',
    purple: 'text-purple-300 bg-purple-900/20',
    green:  'text-green-300 bg-green-900/20',
    indigo: 'text-indigo-300 bg-indigo-900/20',
    teal:   'text-teal-300 bg-teal-900/20',
  }[accentColor]

  return (
    <ReactMarkdown
      components={{
        // ── Code blocks ───────────────────────────────────
        code({ className, children }) {
          const match = /language-(\w+)/.exec(className || '')
          const lang = match?.[1] || 'text'
          const code = String(children).replace(/\n$/, '')
          const isBlock = code.includes('\n') || match

          if (!isBlock) {
            return (
              <code className={`font-mono text-[0.8em] px-1.5 py-0.5 rounded ${codeInlineClass}`}>
                {children}
              </code>
            )
          }

          const langColor = LANG_COLORS[lang] || 'bg-white/10 text-white/50 border-white/10'

          return (
            <div className="relative my-5 rounded-xl overflow-hidden border border-white/10 shadow-xl">
              {/* Header bar */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-[#1a1a2e] border-b border-white/10">
                <div className="flex items-center gap-3">
                  {/* Traffic lights */}
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/70" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                    <div className="w-3 h-3 rounded-full bg-green-500/70" />
                  </div>
                  {/* Language badge */}
                  <span className={`text-xs px-2 py-0.5 rounded border font-mono ${langColor}`}>
                    {lang}
                  </span>
                </div>
                <CopyButton code={code} />
              </div>
              {/* Code */}
              <SyntaxHighlighter
                language={lang === 'bash' ? 'shell' : lang}
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  padding: '1.25rem 1rem',
                  background: '#0d1117',
                  fontSize: '0.78rem',
                  lineHeight: '1.7',
                  borderRadius: 0,
                }}
                showLineNumbers={code.split('\n').length > 5}
                lineNumberStyle={{ color: '#4a5568', minWidth: '2em', paddingRight: '1em' }}
              >
                {code}
              </SyntaxHighlighter>
            </div>
          )
        },

        // ── Headings ──────────────────────────────────────
        h1: ({ children }) => (
          <h1 className="text-2xl font-bold mb-6 mt-2">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className={`text-lg font-semibold mt-10 mb-4 pb-2 border-b ${h2Class}`}>
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-base font-medium mt-6 mb-3 text-white/90">{children}</h3>
        ),

        // ── Paragraphs & blockquotes ──────────────────────
        p: ({ children }) => (
          <p className="text-[var(--muted)] leading-relaxed mb-4">{children}</p>
        ),
        blockquote: ({ children }) => {
          // Extract text for callout detection
          const text = children?.toString() || ''
          const callout = parseCallout(text.trim())
          if (callout) {
            return (
              <div className={`flex gap-3 p-4 rounded-xl border my-4 ${callout.color}`}>
                <span className="text-lg shrink-0">{callout.icon}</span>
                <div className="text-sm leading-relaxed">{children}</div>
              </div>
            )
          }
          return (
            <blockquote className="border-l-4 border-white/20 pl-4 my-4 text-[var(--muted)] italic text-sm">
              {children}
            </blockquote>
          )
        },

        // ── Lists ─────────────────────────────────────────
        ul: ({ children }) => (
          <ul className="space-y-2 mb-4 ml-4">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="space-y-2 mb-4 ml-4 list-decimal list-inside">{children}</ol>
        ),
        li: ({ children }) => (
          <li className="text-[var(--muted)] text-sm leading-relaxed flex gap-2">
            <span className="text-orange-400 shrink-0 mt-0.5">▸</span>
            <span>{children}</span>
          </li>
        ),

        // ── Table ─────────────────────────────────────────
        table: ({ children }) => (
          <div className="overflow-x-auto my-5 rounded-xl border border-[var(--border)]">
            <table className="w-full text-sm border-collapse">{children}</table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-white/5">{children}</thead>
        ),
        th: ({ children }) => (
          <th className="px-4 py-3 text-left text-xs font-semibold text-white/70 uppercase tracking-wider border-b border-[var(--border)]">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="px-4 py-3 text-sm text-[var(--muted)] border-b border-[var(--border)]/50">
            {children}
          </td>
        ),
        tr: ({ children }) => (
          <tr className="hover:bg-white/3 transition-colors">{children}</tr>
        ),

        // ── Strong / em ───────────────────────────────────
        strong: ({ children }) => (
          <strong className="font-semibold text-white">{children}</strong>
        ),
        em: ({ children }) => (
          <em className="text-white/80 not-italic font-medium">{children}</em>
        ),

        // ── Horizontal rule ───────────────────────────────
        hr: () => (
          <hr className="border-[var(--border)] my-8" />
        ),
      }}
      remarkPlugins={[remarkGfm]}
    >
      {content}
    </ReactMarkdown>
  )
}
