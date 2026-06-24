import { useState } from 'react'
import { Link } from 'react-router-dom'
import { QUESTIONS, CATEGORIES } from '../../data/english-interview'
import { useProgress } from '../../hooks/useProgress'
import { useAuth } from '../../hooks/useAuth'
import { CheckCircle, Circle, BookOpen, Zap, Target, Trophy } from 'lucide-react'

const DIFF_COLOR = { easy: 'text-green-400 bg-green-500/10 border-green-500/20', medium: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20', hard: 'text-red-400 bg-red-500/10 border-red-500/20' }

export default function EnglishInterviewDashboard() {
  const { user } = useAuth()
  const { progress } = useProgress(user?.id, 'english')
  const [activeCategory, setActiveCategory] = useState('all')

  const filtered = activeCategory === 'all' ? QUESTIONS : QUESTIONS.filter(q => q.category === activeCategory)
  const totalDone = Object.values(progress).filter(p => p.completed).length
  const confident = Object.values(progress).filter(p => p.score >= 90).length
  const needsPractice = Object.values(progress).filter(p => p.completed && p.score < 70).length

  return (
    <div className="min-h-screen px-6 py-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs mb-4">
          <Target size={12} /> Interview Prep
        </div>
        <h1 className="text-4xl font-bold mb-2">🇬🇧 English Interview</h1>
        <p className="text-[var(--muted)]">Câu hỏi thực tế cho AI Engineer / Full-Stack Developer · Bấm để luyện tập</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: BookOpen, label: 'Practiced', value: `${totalDone}/${QUESTIONS.length}`, color: 'text-blue-400' },
          { icon: CheckCircle, label: 'Confident', value: confident, color: 'text-green-400' },
          { icon: Zap, label: 'Need Work', value: needsPractice, color: 'text-orange-400' },
          { icon: Trophy, label: 'Categories', value: CATEGORIES.length, color: 'text-purple-400' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-center">
            <Icon size={20} className={`${color} mx-auto mb-2`} />
            <div className="text-2xl font-bold">{value}</div>
            <div className="text-[var(--muted)] text-xs mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button onClick={() => setActiveCategory('all')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${activeCategory === 'all' ? 'bg-white/10 border-white/20 text-white' : 'border-[var(--border)] text-[var(--muted)] hover:text-white hover:border-white/20'}`}>
          All ({QUESTIONS.length})
        </button>
        {CATEGORIES.map(cat => {
          const count = QUESTIONS.filter(q => q.category === cat.id).length
          const done = QUESTIONS.filter(q => q.category === cat.id && progress[q.id]?.completed).length
          return (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border flex items-center gap-1.5 ${activeCategory === cat.id ? 'bg-white/10 border-white/20 text-white' : 'border-[var(--border)] text-[var(--muted)] hover:text-white'}`}>
              {cat.icon} {cat.title}
              <span className="text-xs opacity-60">{done}/{count}</span>
            </button>
          )
        })}
      </div>

      {/* Questions grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(q => {
          const p = progress[q.id]
          const done = p?.completed
          const score = p?.score || 0
          const scoreColor = score >= 90 ? 'text-green-400' : score >= 70 ? 'text-yellow-400' : score > 0 ? 'text-orange-400' : ''

          return (
            <Link key={q.id} to={`/english-interview/${q.id}`}
              className={`group p-5 rounded-2xl border transition-all hover:shadow-lg ${
                done ? 'bg-green-900/10 border-green-800/30 hover:border-green-600/50'
                : 'bg-[var(--surface)] border-[var(--border)] hover:border-green-600/30 hover:bg-green-900/5'
              }`}>
              {/* Top row */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  {done ? <CheckCircle size={16} className="text-green-400 shrink-0" /> : <Circle size={16} className="text-[var(--muted)] shrink-0" />}
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${DIFF_COLOR[q.difficulty]}`}>
                    {q.difficulty}
                  </span>
                </div>
                {score > 0 && <span className={`text-sm font-bold ${scoreColor}`}>{score}%</span>}
              </div>

              {/* Question */}
              <p className="text-sm font-medium mb-3 group-hover:text-green-200 transition-colors leading-snug line-clamp-3">
                "{q.question}"
              </p>

              {/* Keywords */}
              <div className="flex flex-wrap gap-1">
                {q.keywords.slice(0,3).map(k => (
                  <span key={k} className="text-xs px-2 py-0.5 rounded bg-white/5 text-[var(--muted)]">
                    {k}
                  </span>
                ))}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
