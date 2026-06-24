import { Link } from 'react-router-dom'
import { FASTAPI_LESSONS } from '../../data/fastapi-curriculum'
import { useProgress } from '../../hooks/useProgress'
import { useAuth } from '../../hooks/useAuth'
import { CheckCircle, Clock, BookOpen, Code2, Trophy, Zap } from 'lucide-react'

export default function FastAPIDashboard() {
  const { user } = useAuth()
  const { progress } = useProgress(user?.id, 'fastapi')
  const totalDone = Object.values(progress).filter(p => p.completed).length
  const totalTime = FASTAPI_LESSONS.reduce((s, l) => s + l.readTime, 0)

  return (
    <div className="min-h-screen px-6 py-12 max-w-4xl mx-auto">
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs mb-4">
          <Code2 size={12} /> Backend Track
        </div>
        <h1 className="text-4xl font-bold mb-2">⚡ FastAPI Mastery</h1>
        <p className="text-[var(--muted)]">Build REST API thực tế — Quản lý sách từ zero đến deploy</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { icon: BookOpen, label: 'Bài học', value: `${totalDone}/${FASTAPI_LESSONS.length}`, color: 'text-orange-400' },
          { icon: Clock, label: 'Tổng thời gian', value: `${totalTime}m`, color: 'text-blue-400' },
          { icon: Trophy, label: 'Hoàn thành', value: `${Math.round(totalDone/FASTAPI_LESSONS.length*100)}%`, color: 'text-green-400' },
          { icon: Zap, label: 'Dự án', value: 'Book API', color: 'text-purple-400' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-center">
            <Icon size={20} className={`${color} mx-auto mb-2`} />
            <div className="text-xl font-bold">{value}</div>
            <div className="text-[var(--muted)] text-xs mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Project overview */}
      <div className="p-5 rounded-2xl bg-orange-900/10 border border-orange-800/30 mb-8">
        <h2 className="font-semibold mb-2 flex items-center gap-2">📚 Dự án: Book Management API</h2>
        <p className="text-sm text-[var(--muted)] mb-3">Build API quản lý sách với đầy đủ tính năng từ PDF tutorial</p>
        <div className="flex flex-wrap gap-2 text-xs">
          {['FastAPI', 'SQLAlchemy', 'Alembic', 'Pydantic', 'SQLite→PostgreSQL', 'File Upload', 'pytest'].map(t => (
            <span key={t} className="px-2.5 py-1 rounded-full bg-orange-900/30 text-orange-300 border border-orange-800/30">{t}</span>
          ))}
        </div>
      </div>

      {/* Lessons list */}
      <div className="space-y-3">
        {FASTAPI_LESSONS.map((lesson, i) => {
          const done = progress[lesson.id]?.completed
          const prevDone = i === 0 || progress[FASTAPI_LESSONS[i-1].id]?.completed
          const locked = !prevDone && i > 0

          return (
            <Link key={lesson.id}
              to={locked ? '#' : `/fastapi/${lesson.id}`}
              className={`flex items-start gap-4 p-5 rounded-2xl border transition-all group ${
                done ? 'bg-green-900/10 border-green-800/30 hover:border-green-600/50'
                : locked ? 'opacity-40 cursor-not-allowed bg-[var(--surface)] border-[var(--border)]'
                : 'bg-[var(--surface)] border-[var(--border)] hover:border-orange-600/50 hover:bg-orange-900/5'
              }`}>
              {/* Unit number */}
              <div className={`w-9 h-9 rounded-xl shrink-0 flex items-center justify-center text-sm font-bold ${
                done ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/10 text-orange-400'
              }`}>
                {done ? <CheckCircle size={18} /> : String(lesson.unit).padStart(2,'0')}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className={`font-semibold text-sm group-hover:text-orange-300 transition-colors ${locked ? '' : ''}`}>
                    {lesson.title}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-[var(--muted)] shrink-0">
                    <Clock size={11} /> {lesson.readTime}m
                  </div>
                </div>
                <p className="text-xs text-[var(--muted)] mt-0.5 line-clamp-1">{lesson.subtitle}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-orange-400/70 italic line-clamp-1">💡 {lesson.keyTakeaway}</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {lesson.tags.slice(0,4).map(t => (
                    <span key={t} className="text-xs px-1.5 py-0.5 rounded bg-white/5 text-[var(--muted)]">{t}</span>
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
