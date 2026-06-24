import { Link } from 'react-router-dom'
import { CLAUDE_CURRICULUM } from '../../data/claude-curriculum'
import { useProgress } from '../../hooks/useProgress'
import { useAuth } from '../../hooks/useAuth'
import { CheckCircle, Clock, BookOpen, Zap, Trophy, Flame } from 'lucide-react'

const MODULES = [...new Map(CLAUDE_CURRICULUM.map(l => [l.module, {
  num: l.module, title: l.moduleTitle, color: l.moduleColor,
  lessons: CLAUDE_CURRICULUM.filter(x => x.module === l.module)
}])).values()]

export default function ClaudeMasteryDashboard() {
  const { user } = useAuth()
  const { progress } = useProgress(user?.id, 'claude')
  const totalLessons = CLAUDE_CURRICULUM.length
  const totalRead = Object.values(progress).filter(p => p.completed).length
  const totalReadTime = CLAUDE_CURRICULUM.reduce((s, l) => s + l.readTime, 0)

  return (
    <div className="min-h-screen px-6 py-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs mb-4">
          <Zap size={12} /> Advanced Track
        </div>
        <h1 className="text-4xl font-bold mb-2">🤖 Claude Mastery</h1>
        <p className="text-[var(--muted)]">Commands · Coworking · MCP Plugins · Skills · Agents · API</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { icon: BookOpen, label: "Lessons", value: `${totalRead}/${totalLessons}`, color: "text-blue-400" },
          { icon: Trophy, label: "Modules", value: `${MODULES.length}`, color: "text-yellow-400" },
          { icon: Clock, label: "Total Read Time", value: `${totalReadTime}m`, color: "text-green-400" },
          { icon: Flame, label: "Progress", value: `${Math.round(totalRead/totalLessons*100)}%`, color: "text-orange-400" },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-center">
            <Icon size={20} className={`${color} mx-auto mb-2`} />
            <div className="text-2xl font-bold">{value}</div>
            <div className="text-[var(--muted)] text-xs mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Modules */}
      <div className="space-y-8">
        {MODULES.map(mod => {
          const modDone = mod.lessons.filter(l => progress[l.id]?.completed).length
          return (
            <div key={mod.num}>
              {/* Module header */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${mod.color} flex items-center justify-center text-white font-bold text-sm`}>
                  {String(mod.num).padStart(2,'0')}
                </div>
                <div>
                  <h2 className="font-semibold">{mod.title}</h2>
                  <div className="text-[var(--muted)] text-xs">{modDone}/{mod.lessons.length} completed</div>
                </div>
                {/* Progress bar */}
                <div className="flex-1 h-1.5 bg-[var(--border)] rounded-full overflow-hidden ml-2">
                  <div className={`h-full bg-gradient-to-r ${mod.color} rounded-full transition-all duration-500`}
                    style={{ width: `${mod.lessons.length ? modDone/mod.lessons.length*100 : 0}%` }} />
                </div>
              </div>

              {/* Lessons grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-11">
                {mod.lessons.map((lesson, i) => {
                  const done = progress[lesson.id]?.completed
                  const prev = i === 0 || progress[mod.lessons[i-1].id]?.completed
                  const locked = !prev && i > 0

                  return (
                    <Link key={lesson.id}
                      to={locked ? '#' : `/claude-mastery/${lesson.id}`}
                      className={`group p-4 rounded-xl border transition-all ${
                        done ? 'bg-green-900/10 border-green-800/40 hover:border-green-600/50'
                        : locked ? 'bg-[var(--surface)] border-[var(--border)] opacity-40 cursor-not-allowed'
                        : 'bg-[var(--surface)] border-[var(--border)] hover:border-purple-600/50 hover:bg-purple-900/5'
                      }`}>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          {done
                            ? <CheckCircle size={15} className="text-green-400 shrink-0" />
                            : <div className={`w-4 h-4 rounded-full border-2 shrink-0 ${locked ? 'border-[var(--muted)]' : `border-current bg-gradient-to-br ${mod.color} opacity-30`}`} />
                          }
                          <span className="text-xs text-[var(--muted)] font-mono">#{String(i+1).padStart(2,'0')}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-[var(--muted)] shrink-0">
                          <Clock size={11} /> {lesson.readTime}m
                        </div>
                      </div>

                      <h3 className="text-sm font-medium mb-2 group-hover:text-purple-300 transition-colors line-clamp-2 leading-snug">
                        {lesson.title}
                      </h3>

                      {/* Key takeaway */}
                      <div className="text-xs text-[var(--muted)] italic line-clamp-1 mb-2">
                        💡 {lesson.keyTakeaway}
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1">
                        {lesson.tags.slice(0,3).map(t => (
                          <span key={t} className="text-xs px-1.5 py-0.5 rounded bg-white/5 text-[var(--muted)]">
                            {t}
                          </span>
                        ))}
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
