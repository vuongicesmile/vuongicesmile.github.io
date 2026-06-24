import { Link } from 'react-router-dom'
import { BOOK_MANAGEMENT_LESSONS } from '../../data/book-management-curriculum'
import { useProgress } from '../../hooks/useProgress'
import { useAuth } from '../../hooks/useAuth'
import { CheckCircle, Clock, BookOpen, Code2, Trophy, Boxes } from 'lucide-react'

export default function BookManagementDashboard() {
  const { user } = useAuth()
  const { progress } = useProgress(user?.id, 'book-management')
  const totalDone = Object.values(progress).filter(p => p.completed).length
  const totalTime = BOOK_MANAGEMENT_LESSONS.reduce((s, l) => s + l.readTime, 0)

  return (
    <div className="min-h-screen px-6 py-12 max-w-4xl mx-auto">
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs mb-4">
          <Boxes size={12} /> Mini Project
        </div>
        <h1 className="text-4xl font-bold mb-2">📚 Book Management</h1>
        <p className="text-[var(--muted)]">Build một FastAPI app thực tế từ zero — CRUD đến AI Agent, từng bước rõ ràng cho fresher</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { icon: BookOpen, label: 'Bài học', value: `${totalDone}/${BOOK_MANAGEMENT_LESSONS.length}`, color: 'text-teal-400' },
          { icon: Clock, label: 'Tổng thời gian', value: `${totalTime}m`, color: 'text-blue-400' },
          { icon: Trophy, label: 'Hoàn thành', value: `${BOOK_MANAGEMENT_LESSONS.length ? Math.round(totalDone / BOOK_MANAGEMENT_LESSONS.length * 100) : 0}%`, color: 'text-green-400' },
          { icon: Code2, label: 'Stack', value: 'FastAPI + AI', color: 'text-purple-400' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-center">
            <Icon size={20} className={`${color} mx-auto mb-2`} />
            <div className="text-xl font-bold">{value}</div>
            <div className="text-[var(--muted)] text-xs mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Project overview */}
      <div className="p-5 rounded-2xl bg-teal-900/10 border border-teal-800/30 mb-6">
        <h2 className="font-semibold mb-2 flex items-center gap-2">🗂️ Dự án: Book Management API</h2>
        <p className="text-sm text-[var(--muted)] mb-3">
          Python FastAPI project build từng bước — từ CRUD cơ bản đến AI Agent với SSE streaming.
          Mỗi commit = một bài học thực tế. Code trên GitHub, giải thích chi tiết ở đây.
        </p>
        <div className="flex flex-wrap gap-2 text-xs mb-4">
          {['FastAPI', 'SQLAlchemy', 'Alembic', 'Pydantic', 'Redis', 'OpenAI', 'RAG', 'Agent', 'SSE'].map(t => (
            <span key={t} className="px-2.5 py-1 rounded-full bg-teal-900/30 text-teal-300 border border-teal-800/30">{t}</span>
          ))}
        </div>
        <a
          href="https://github.com/vuongicesmile/book-management"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-teal-400 hover:text-teal-300 transition-colors"
        >
          <Code2 size={12} /> github.com/vuongicesmile/book-management →
        </a>
      </div>

      {/* Learning path note */}
      <div className="p-4 rounded-xl bg-white/3 border border-[var(--border)] mb-8 text-xs text-[var(--muted)]">
        <span className="text-white font-medium">📌 Gợi ý:</span> Đọc theo thứ tự từ bài 01.
        Mỗi bài có so sánh với <span className="text-yellow-400">PHP Laravel</span> / <span className="text-yellow-400">Node.js Express</span> để dễ hiểu hơn nếu bạn đã biết web dev.
      </div>

      {/* Lessons list */}
      <div className="space-y-3">
        {BOOK_MANAGEMENT_LESSONS.map((lesson, i) => {
          const done = progress[lesson.id]?.completed
          const prevDone = i === 0 || progress[BOOK_MANAGEMENT_LESSONS[i - 1].id]?.completed
          const locked = !prevDone && i > 0

          return (
            <Link
              key={lesson.id}
              to={locked ? '#' : `/book-management/${lesson.id}`}
              className={`flex items-start gap-4 p-5 rounded-2xl border transition-all group ${
                done
                  ? 'bg-green-900/10 border-green-800/30 hover:border-green-600/50'
                  : locked
                  ? 'opacity-40 cursor-not-allowed bg-[var(--surface)] border-[var(--border)]'
                  : 'bg-[var(--surface)] border-[var(--border)] hover:border-teal-600/50 hover:bg-teal-900/5'
              }`}
            >
              {/* Unit number */}
              <div className={`w-9 h-9 rounded-xl shrink-0 flex items-center justify-center text-sm font-bold ${
                done ? 'bg-green-500/20 text-green-400' : 'bg-teal-500/10 text-teal-400'
              }`}>
                {done ? <CheckCircle size={18} /> : String(lesson.unit).padStart(2, '0')}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-sm group-hover:text-teal-300 transition-colors">
                    {lesson.title}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-[var(--muted)] shrink-0">
                    <Clock size={11} /> {lesson.readTime}m
                  </div>
                </div>
                <p className="text-xs text-[var(--muted)] mt-0.5 line-clamp-1">{lesson.subtitle}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-teal-400/70 italic line-clamp-1">💡 {lesson.keyTakeaway}</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {lesson.tags.slice(0, 4).map(t => (
                    <span key={t} className="text-xs px-1.5 py-0.5 rounded bg-white/5 text-[var(--muted)]">#{t}</span>
                  ))}
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
