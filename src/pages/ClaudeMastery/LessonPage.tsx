import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import MarkdownContent from '../../components/MarkdownContent'
import { ChevronLeft, ChevronRight, Clock, CheckCircle, Save, Zap } from 'lucide-react'
import { CLAUDE_CURRICULUM } from '../../data/claude-curriculum'
import { useProgress } from '../../hooks/useProgress'
import { useAuth } from '../../hooks/useAuth'

export default function ClaudeLessonPage() {
  const { id } = useParams<{ id: string }>()
  const lesson = CLAUDE_CURRICULUM.find(l => l.id === id)
  const idx = CLAUDE_CURRICULUM.findIndex(l => l.id === id)
  const prev = CLAUDE_CURRICULUM[idx - 1]
  const next = CLAUDE_CURRICULUM[idx + 1]

  const { user } = useAuth()
  const { progress, saveProgress } = useProgress(user?.id, 'claude')
  const [notes, setNotes] = useState(progress[id || '']?.notes || '')
  const [tab, setTab] = useState<'read' | 'notes'>('read')
  const [saved, setSaved] = useState(false)

  if (!lesson) return <div className="p-8 text-center text-[var(--muted)]">Lesson not found</div>

  const isRead = progress[lesson.id]?.completed

  const markRead = async () => {
    await saveProgress(lesson.id, { completed: true, score: 100, notes })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const saveNotes = async () => {
    await saveProgress(lesson.id, { notes, completed: isRead, score: isRead ? 100 : 0 })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="min-h-screen max-w-3xl mx-auto px-6 py-10">

      {/* Back */}
      <Link to="/claude-mastery"
        className="inline-flex items-center gap-2 text-[var(--muted)] hover:text-white text-sm mb-8 transition-colors">
        <ChevronLeft size={16} /> Back to Claude Mastery
      </Link>

      {/* Module badge */}
      <div className="flex items-center gap-3 mb-4">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${lesson.moduleColor} bg-opacity-10 border border-white/10 text-white`}>
          <Zap size={11} /> {lesson.moduleTitle}
        </span>
        <span className="flex items-center gap-1 text-xs text-[var(--muted)]">
          <Clock size={12} /> {lesson.readTime} min read
        </span>
        {isRead && <CheckCircle size={15} className="text-green-400" />}
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold mb-4 leading-tight">{lesson.title}</h1>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        {lesson.tags.map(t => (
          <span key={t} className="text-xs px-2.5 py-1 rounded-full border border-[var(--border)] text-[var(--muted)]">
            #{t}
          </span>
        ))}
      </div>

      {/* Key Takeaway card */}
      <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 mb-8 flex gap-3">
        <span className="text-xl shrink-0">💡</span>
        <div>
          <div className="text-xs font-semibold text-yellow-400 uppercase tracking-wider mb-1">Key Takeaway</div>
          <p className="text-sm text-yellow-100/80">{lesson.keyTakeaway}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-[var(--surface)] rounded-xl border border-[var(--border)] w-fit mb-6">
        {(['read', 'notes'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
              tab === t ? 'bg-purple-600 text-white' : 'text-[var(--muted)] hover:text-white'
            }`}>
            {t === 'read' ? '📖 Read' : '📝 Notes'}
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === 'read' && (
        <>
          <MarkdownContent content={lesson.content} accentColor="purple" />

          {/* Mark as read */}
          {!isRead && (
            <div className="sticky bottom-6 flex justify-center">
              <button onClick={markRead}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 rounded-xl font-medium text-sm shadow-2xl shadow-green-500/30 transition-all hover:scale-105">
                <CheckCircle size={16} /> Mark as Read
              </button>
            </div>
          )}
          {isRead && (
            <div className="flex items-center justify-center gap-2 py-4 text-green-400 text-sm">
              <CheckCircle size={16} /> Đã đọc xong! {saved && '✓ Saved'}
            </div>
          )}
        </>
      )}

      {tab === 'notes' && (
        <div>
          <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] overflow-hidden mb-4">
            <div className="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between">
              <span className="text-sm font-medium">📝 My Notes</span>
              <span className="text-xs text-[var(--muted)]">Markdown supported</span>
            </div>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder={`Notes for: ${lesson.title}\n\n## Key points\n\n## Will apply when\n\n## Questions`}
              className="w-full h-80 p-4 bg-transparent text-sm text-[var(--text)] resize-none focus:outline-none font-mono placeholder-[var(--muted)]/50 leading-relaxed"
            />
          </div>
          <button onClick={saveNotes}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-medium transition-colors">
            <Save size={14} /> {saved ? '✓ Saved!' : 'Save Notes'}
          </button>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-12 pt-6 border-t border-[var(--border)]">
        {prev ? (
          <Link to={`/claude-mastery/${prev.id}`}
            className="flex flex-col gap-1 p-4 rounded-xl border border-[var(--border)] hover:border-purple-600/50 transition-all max-w-[45%] group">
            <span className="text-xs text-[var(--muted)] flex items-center gap-1"><ChevronLeft size={12} /> Previous</span>
            <span className="text-sm font-medium group-hover:text-purple-300 transition-colors line-clamp-2">{prev.title}</span>
          </Link>
        ) : <div />}
        {next ? (
          <Link to={`/claude-mastery/${next.id}`}
            className="flex flex-col gap-1 p-4 rounded-xl border border-[var(--border)] hover:border-purple-600/50 transition-all max-w-[45%] text-right group ml-auto">
            <span className="text-xs text-[var(--muted)] flex items-center gap-1 justify-end">Next <ChevronRight size={12} /></span>
            <span className="text-sm font-medium group-hover:text-purple-300 transition-colors line-clamp-2">{next.title}</span>
          </Link>
        ) : <div />}
      </div>
    </div>
  )
}
