import { Link } from 'react-router-dom'
import { CheckCircle, Circle, Lock, Trophy, Flame, BookOpen } from 'lucide-react'
import { CURRICULUM } from '../../data/curriculum'
import { useProgress } from '../../hooks/useProgress'
import { useAuth } from '../../hooks/useAuth'

export default function Python25Dashboard() {
  const { user } = useAuth()
  const { progress, totalScore, completedDays } = useProgress(user?.id)

  const streak = completedDays // simplified streak

  return (
    <div className="min-h-screen px-6 py-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-2">🐍 25 Days Python</h1>
        <p className="text-[var(--muted)]">Ôn luyện Python từ cơ bản đến advanced · Chuẩn bị phỏng vấn</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { icon: CheckCircle, label: "Completed", value: `${completedDays}/25`, color: "text-green-400" },
          { icon: Trophy, label: "Total Score", value: totalScore, color: "text-yellow-400" },
          { icon: Flame, label: "Streak", value: `${streak} days`, color: "text-orange-400" },
          { icon: BookOpen, label: "Progress", value: `${Math.round(completedDays/25*100)}%`, color: "text-indigo-400" },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-center">
            <Icon size={24} className={`${color} mx-auto mb-2`} />
            <div className="text-2xl font-bold">{value}</div>
            <div className="text-[var(--muted)] text-xs mt-1">{label}</div>
          </div>
        ))}
      </div>

      {!user && (
        <div className="mb-8 p-4 rounded-xl bg-indigo-900/20 border border-indigo-800/50 flex items-center justify-between">
          <div>
            <div className="font-medium">Đăng nhập để lưu tiến độ</div>
            <div className="text-[var(--muted)] text-sm">Dữ liệu hiện tại lưu tại browser</div>
          </div>
          <Link to="/python-25/login" className="px-4 py-2 bg-[var(--accent)] rounded-lg text-sm font-medium hover:bg-indigo-500 transition-colors">
            Login
          </Link>
        </div>
      )}

      {/* Day Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {CURRICULUM.map((lesson) => {
          const p = progress[lesson.day]
          const completed = p?.completed
          const score = p?.score || 0
          const locked = lesson.day > 1 && !progress[lesson.day - 1]?.completed

          return (
            <Link
              key={lesson.day}
              to={locked ? '#' : `/python-25/${lesson.day}`}
              className={`p-5 rounded-xl border transition-all group ${
                completed
                  ? 'bg-green-900/20 border-green-800/50 hover:border-green-600'
                  : locked
                  ? 'bg-[var(--surface)] border-[var(--border)] opacity-50 cursor-not-allowed'
                  : 'bg-[var(--surface)] border-[var(--border)] hover:border-indigo-600 hover:bg-indigo-900/10'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {completed ? (
                    <CheckCircle size={18} className="text-green-400 shrink-0" />
                  ) : locked ? (
                    <Lock size={18} className="text-[var(--muted)] shrink-0" />
                  ) : (
                    <Circle size={18} className="text-[var(--muted)] shrink-0" />
                  )}
                  <span className="text-[var(--muted)] text-xs font-mono">Day {String(lesson.day).padStart(2,'0')}</span>
                </div>
                {score > 0 && (
                  <span className="text-xs font-bold text-yellow-400">{score}pts</span>
                )}
              </div>
              <h3 className="font-semibold text-sm mb-2 group-hover:text-indigo-300 transition-colors line-clamp-2">
                {lesson.title}
              </h3>
              <div className="flex flex-wrap gap-1">
                {lesson.topics.slice(0,3).map(t => (
                  <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-[var(--bg)] text-[var(--muted)]">
                    {t}
                  </span>
                ))}
              </div>
              {completed && (
                <div className="mt-3 h-1 bg-[var(--bg)] rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: `${Math.min(score/lesson.points*100,100)}%` }} />
                </div>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
