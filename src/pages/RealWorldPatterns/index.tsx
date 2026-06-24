import { Link } from 'react-router-dom'
import { RW_LESSONS } from '../../data/rw-curriculum'
import { useProgress } from '../../hooks/useProgress'
import { useAuth } from '../../hooks/useAuth'
import { CheckCircle, Clock, BookOpen, Zap, Shield, Database, Globe } from 'lucide-react'

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  "async-sqlalchemy":    <Database size={16} className="text-blue-400" />,
  "fastapi-lifespan":    <Zap size={16} className="text-green-400" />,
  "auth-redis-cache":    <Shield size={16} className="text-red-400" />,
  "exception-hierarchy": <Zap size={16} className="text-orange-400" />,
  "pure-asgi-middleware":<Zap size={16} className="text-purple-400" />,
  "sse-streaming":       <Globe size={16} className="text-cyan-400" />,
  "security-patterns":   <Shield size={16} className="text-red-400" />,
  "redis-patterns":      <Database size={16} className="text-red-500" />,
  "frontend-patterns":   <Globe size={16} className="text-blue-400" />,
  "interview-qa":        <BookOpen size={16} className="text-yellow-400" />,
}

const DIFFICULTY = [
  "⭐⭐⭐", "⭐⭐⭐", "⭐⭐⭐⭐",
  "⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐⭐",
  "⭐⭐⭐⭐", "⭐⭐⭐", "⭐⭐⭐", "⭐⭐⭐⭐",
]

export default function RealWorldDashboard() {
  const { user } = useAuth()
  const { progress } = useProgress(user?.id, 'realworld')
  const done = Object.values(progress).filter(p => p.completed).length
  const totalTime = RW_LESSONS.reduce((s, l) => s + l.readTime, 0)

  return (
    <div className="min-h-screen px-6 py-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs mb-4">
          <Shield size={12} /> Production Codebase
        </div>
        <h1 className="text-4xl font-bold mb-2">🏭 Real-World Patterns</h1>
        <p className="text-[var(--muted)] max-w-xl">
          10 engineering patterns extracted từ production AI SaaS — FastAPI, Redis, SSE, Security, React.
          Đây là những gì thực sự được dùng ở scale, không phải tutorial toys.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { icon: CheckCircle, label: "Đã đọc", value: `${done}/${RW_LESSONS.length}`, color: "text-green-400" },
          { icon: Clock,       label: "Tổng thời gian", value: `${totalTime}m`, color: "text-blue-400" },
          { icon: Shield,      label: "Security patterns", value: "3", color: "text-red-400" },
          { icon: BookOpen,    label: "Interview Q&A",     value: "20+", color: "text-yellow-400" },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-center">
            <Icon size={20} className={`${color} mx-auto mb-2`} />
            <div className="text-xl font-bold">{value}</div>
            <div className="text-[var(--muted)] text-xs mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Context card */}
      <div className="p-5 rounded-2xl bg-teal-900/10 border border-teal-800/30 mb-8">
        <div className="flex gap-3">
          <span className="text-2xl shrink-0">🏭</span>
          <div>
            <h3 className="font-semibold mb-1">Nguồn gốc các patterns này</h3>
            <p className="text-sm text-[var(--muted)]">
              Extracted từ một production AI chat SaaS (đã đổi tên thành "vuonglearning" để protect privacy).
              Stack: Python FastAPI + SQLAlchemy + Redis + React + Next.js + Kubernetes.
              Tất cả patterns đều được tested ở scale thực tế.
            </p>
          </div>
        </div>
      </div>

      {/* Lessons grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {RW_LESSONS.map((lesson, i) => {
          const isDone = progress[lesson.id]?.completed
          const prevDone = i === 0 || progress[RW_LESSONS[i-1].id]?.completed
          const locked = !prevDone && i > 0

          return (
            <Link key={lesson.id}
              to={locked ? '#' : `/real-world/${lesson.id}`}
              className={`group p-5 rounded-2xl border transition-all ${
                isDone  ? 'bg-green-900/10 border-green-800/30 hover:border-green-600/50'
                : locked ? 'opacity-40 cursor-not-allowed bg-[var(--surface)] border-[var(--border)]'
                : 'bg-[var(--surface)] border-[var(--border)] hover:border-teal-600/50 hover:bg-teal-900/5'
              }`}>
              {/* Top row */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-teal-500/10 flex items-center justify-center text-xs font-bold text-teal-400">
                    {String(lesson.unit).padStart(2,'0')}
                  </div>
                  {CATEGORY_ICONS[lesson.id]}
                  <span className="text-xs text-[var(--muted)]">{DIFFICULTY[i]}</span>
                </div>
                <div className="flex items-center gap-2">
                  {isDone && <CheckCircle size={14} className="text-green-400" />}
                  <span className="text-xs text-[var(--muted)] flex items-center gap-1">
                    <Clock size={11} />{lesson.readTime}m
                  </span>
                </div>
              </div>

              <h3 className="font-semibold text-sm mb-1 group-hover:text-teal-300 transition-colors leading-snug">
                {lesson.title}
              </h3>
              <p className="text-xs text-[var(--muted)] mb-3 line-clamp-2">{lesson.subtitle}</p>

              {/* Key takeaway */}
              <div className="p-2.5 rounded-lg bg-teal-900/10 border border-teal-800/20 text-xs text-teal-200/70 italic line-clamp-2">
                💡 {lesson.keyTakeaway}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mt-3">
                {lesson.tags.slice(0,3).map(t => (
                  <span key={t} className="text-xs px-1.5 py-0.5 rounded bg-white/5 text-[var(--muted)]">{t}</span>
                ))}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
