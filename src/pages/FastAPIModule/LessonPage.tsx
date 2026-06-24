import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Clock, CheckCircle, Save, Code2, BookOpen } from 'lucide-react'
import { FASTAPI_LESSONS } from '../../data/fastapi-curriculum'
import { useProgress } from '../../hooks/useProgress'
import { useAuth } from '../../hooks/useAuth'
import MarkdownContent from '../../components/MarkdownContent'

export default function FastAPILessonPage() {
  const { id } = useParams<{ id: string }>()
  const lesson = FASTAPI_LESSONS.find(l => l.id === id)
  const idx = FASTAPI_LESSONS.findIndex(l => l.id === id)
  const prev = FASTAPI_LESSONS[idx - 1]
  const next = FASTAPI_LESSONS[idx + 1]

  const { user } = useAuth()
  const { progress, saveProgress } = useProgress(user?.id, 'fastapi')
  const [notes, setNotes] = useState(progress[id || '']?.notes || '')
  const [tab, setTab] = useState<'read' | 'notes'>('read')
  const [saved, setSaved] = useState(false)

  if (!lesson) return <div className="p-8 text-center text-[var(--muted)]">Lesson not found</div>

  const isRead = progress[lesson.id]?.completed
  const totalDone = Object.values(progress).filter(p => p.completed).length

  const markRead = async () => {
    await saveProgress(lesson.id, { completed: true, score: 100, notes })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const saveNotes = async () => {
    await saveProgress(lesson.id, { notes, completed: isRead, score: isRead ? 100 : 0 })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Top progress bar */}
      <div className="fixed top-14 left-0 right-0 z-40 h-0.5 bg-[var(--border)]">
        <div
          className="h-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-500"
          style={{ width: `${((idx + 1) / FASTAPI_LESSONS.length) * 100}%` }}
        />
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[var(--muted)] mb-8">
          <Link to="/fastapi" className="hover:text-white transition-colors flex items-center gap-1">
            <Code2 size={12} /> FastAPI
          </Link>
          <span>/</span>
          <span className="text-white/60">Bài {lesson.unit}</span>
        </div>

        {/* Hero section */}
        <div className="mb-8">
          {/* Unit + meta */}
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-orange-500/15 border border-orange-500/30 text-orange-400">
              Bài {String(lesson.unit).padStart(2,'0')} / {FASTAPI_LESSONS.length}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
              <Clock size={12} /> {lesson.readTime} phút đọc
            </span>
            {isRead && (
              <span className="flex items-center gap-1.5 text-xs text-green-400">
                <CheckCircle size={12} /> Đã hoàn thành
              </span>
            )}
            <span className="flex items-center gap-1.5 text-xs text-[var(--muted)] ml-auto">
              <BookOpen size={12} /> {totalDone}/{FASTAPI_LESSONS.length} bài xong
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">{lesson.title}</h1>
          <p className="text-[var(--muted)] text-lg">{lesson.subtitle}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            {lesson.tags.map(t => (
              <span key={t} className="text-xs px-2.5 py-1 rounded-full border border-[var(--border)] text-[var(--muted)] hover:border-orange-600/40 transition-colors">
                #{t}
              </span>
            ))}
          </div>
        </div>

        {/* Key Takeaway card */}
        <div className="relative p-5 rounded-2xl bg-gradient-to-br from-orange-500/10 to-amber-500/5 border border-orange-500/25 mb-8 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative flex gap-4">
            <div className="text-3xl shrink-0">💡</div>
            <div>
              <div className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-2">Key Takeaway</div>
              <p className="text-sm text-orange-100/80 leading-relaxed font-medium">{lesson.keyTakeaway}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-[var(--surface)] rounded-2xl border border-[var(--border)] w-fit mb-8">
          {(['read', 'notes'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                tab === t
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/20'
                  : 'text-[var(--muted)] hover:text-white hover:bg-white/5'
              }`}>
              {t === 'read' ? '📖 Đọc bài' : '📝 Ghi chú'}
            </button>
          ))}
        </div>

        {/* READ TAB */}
        {tab === 'read' && (
          <>
            <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6 md:p-8 mb-8">
              <MarkdownContent content={lesson.content} accentColor="orange" />
            </div>

            {/* Mark as read */}
            {!isRead ? (
              <div className="sticky bottom-6 flex justify-center">
                <button onClick={markRead}
                  className="flex items-center gap-2.5 px-8 py-3.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-2xl font-semibold text-sm shadow-2xl shadow-green-500/30 transition-all hover:scale-105 hover:shadow-green-500/40">
                  <CheckCircle size={18} /> Đọc xong — Next bài!
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3 py-4">
                <span className="flex items-center gap-2 text-green-400 font-medium">
                  <CheckCircle size={18} /> Bài này đã hoàn thành!
                </span>
                {saved && <span className="text-xs text-[var(--muted)]">✓ Saved</span>}
              </div>
            )}
          </>
        )}

        {/* NOTES TAB */}
        {tab === 'notes' && (
          <div>
            <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] overflow-hidden mb-4">
              <div className="px-5 py-3.5 border-b border-[var(--border)] flex items-center justify-between bg-white/3">
                <span className="text-sm font-medium">📝 Ghi chú — Bài {lesson.unit}: {lesson.title}</span>
                <span className="text-xs text-[var(--muted)] bg-white/5 px-2 py-0.5 rounded">Markdown</span>
              </div>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder={`# Ghi chú bài ${lesson.unit}\n\n## Điều cần nhớ\n- \n\n## Code mình đã thử\n\`\`\`python\n\n\`\`\`\n\n## Câu hỏi / Chưa hiểu\n- \n\n## Apply vào project thật như nào?`}
                className="w-full h-96 p-5 bg-transparent text-sm text-[var(--text)] resize-none focus:outline-none font-mono placeholder-[var(--muted)]/40 leading-relaxed"
              />
            </div>
            <button onClick={saveNotes}
              className="flex items-center gap-2 px-6 py-2.5 bg-orange-600 hover:bg-orange-500 rounded-xl text-sm font-medium transition-all hover:shadow-lg hover:shadow-orange-500/20">
              <Save size={14} /> {saved ? '✓ Đã lưu!' : 'Lưu ghi chú'}
            </button>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-stretch justify-between gap-4 mt-12 pt-8 border-t border-[var(--border)]">
          {prev ? (
            <Link to={`/fastapi/${prev.id}`}
              className="flex-1 flex items-start gap-3 p-4 rounded-2xl border border-[var(--border)] hover:border-orange-600/40 hover:bg-orange-900/5 transition-all group max-w-[48%]">
              <ChevronLeft size={18} className="text-[var(--muted)] group-hover:text-orange-400 transition-colors mt-0.5 shrink-0" />
              <div>
                <div className="text-xs text-[var(--muted)] mb-1">Bài trước</div>
                <div className="text-sm font-medium group-hover:text-orange-300 transition-colors line-clamp-2 leading-snug">{prev.title}</div>
              </div>
            </Link>
          ) : <div />}

          {next ? (
            <Link to={`/fastapi/${next.id}`}
              className="flex-1 flex items-start justify-end gap-3 p-4 rounded-2xl border border-[var(--border)] hover:border-orange-600/40 hover:bg-orange-900/5 transition-all group text-right max-w-[48%]">
              <div>
                <div className="text-xs text-[var(--muted)] mb-1">Bài tiếp</div>
                <div className="text-sm font-medium group-hover:text-orange-300 transition-colors line-clamp-2 leading-snug">{next.title}</div>
              </div>
              <ChevronRight size={18} className="text-[var(--muted)] group-hover:text-orange-400 transition-colors mt-0.5 shrink-0" />
            </Link>
          ) : <div />}
        </div>
      </div>
    </div>
  )
}
