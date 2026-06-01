import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Editor from '@monaco-editor/react'
import ReactMarkdown from 'react-markdown'
import { ChevronLeft, ChevronRight, Lightbulb, CheckCircle, Save, Trophy } from 'lucide-react'
import { CURRICULUM } from '../../data/curriculum'
import { useProgress } from '../../hooks/useProgress'
import { useAuth } from '../../hooks/useAuth'

export default function DayPage() {
  const { day } = useParams<{ day: string }>()
  const dayNum = parseInt(day || '1')
  const lesson = CURRICULUM.find(l => l.day === dayNum)
  const { user } = useAuth()
  const { progress, saveProgress } = useProgress(user?.id)

  const [tab, setTab] = useState<'theory' | 'challenge' | 'notes'>('theory')
  const [code, setCode] = useState(lesson?.challenge.starter || '')
  const [hintsRevealed, setHintsRevealed] = useState(0)
  const [notes, setNotes] = useState(progress[dayNum]?.notes || '')
  const [showSolution, setShowSolution] = useState(false)
  const [score, setScore] = useState(progress[dayNum]?.score || 0)
  const [saved, setSaved] = useState(false)

  if (!lesson) return <div className="p-8 text-center text-[var(--muted)]">Day not found</div>

  const p = progress[dayNum]
  const isCompleted = p?.completed

  const handleSave = async () => {
    await saveProgress(dayNum, { notes, score, completed: score > 0 })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleScore = async (pts: number) => {
    setScore(pts)
    await saveProgress(dayNum, { score: pts, completed: pts > 0, notes })
  }

  const revealHint = () => {
    if (hintsRevealed < lesson.hints.length) setHintsRevealed(h => h + 1)
  }

  return (
    <div className="min-h-screen px-4 py-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link to="/python-25" className="flex items-center gap-2 text-[var(--muted)] hover:text-white transition-colors text-sm">
          <ChevronLeft size={16} /> Back to Dashboard
        </Link>
        <div className="flex items-center gap-3">
          {isCompleted && <CheckCircle size={18} className="text-green-400" />}
          {score > 0 && <span className="text-yellow-400 text-sm font-bold">{score} pts</span>}
          <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-[var(--accent)] rounded-lg text-sm font-medium hover:bg-indigo-500 transition-colors">
            <Save size={14} /> {saved ? 'Saved!' : 'Save'}
          </button>
        </div>
      </div>

      {/* Title */}
      <div className="mb-6">
        <div className="text-[var(--muted)] text-sm font-mono mb-1">Day {String(dayNum).padStart(2,'0')} / 25</div>
        <h1 className="text-3xl font-bold">{lesson.title}</h1>
        <div className="flex flex-wrap gap-2 mt-3">
          {lesson.topics.map(t => (
            <span key={t} className="text-xs px-3 py-1 rounded-full bg-indigo-900/30 text-indigo-300 border border-indigo-800/40">{t}</span>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 bg-[var(--surface)] rounded-lg w-fit border border-[var(--border)]">
        {(['theory', 'challenge', 'notes'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-colors ${
              tab === t ? 'bg-[var(--accent)] text-white' : 'text-[var(--muted)] hover:text-white'
            }`}>
            {t}
          </button>
        ))}
      </div>

      {/* Theory Tab */}
      {tab === 'theory' && (
        <div className="prose prose-invert prose-sm max-w-none bg-[var(--surface)] p-6 rounded-xl border border-[var(--border)]">
          <ReactMarkdown>{lesson.theory}</ReactMarkdown>
        </div>
      )}

      {/* Challenge Tab */}
      {tab === 'challenge' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: prompt + hints */}
          <div className="space-y-4">
            <div className="p-5 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
              <h3 className="font-semibold mb-3">📝 Challenge</h3>
              <p className="text-[var(--muted)] text-sm leading-relaxed">{lesson.challenge.prompt}</p>
            </div>

            {/* Hints */}
            <div className="p-5 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold flex items-center gap-2"><Lightbulb size={16} className="text-yellow-400" /> Hints</h3>
                <button onClick={revealHint} disabled={hintsRevealed >= lesson.hints.length}
                  className="text-xs px-3 py-1 rounded-lg bg-yellow-900/30 text-yellow-400 border border-yellow-800/40 hover:bg-yellow-900/50 disabled:opacity-40 transition-colors">
                  {hintsRevealed >= lesson.hints.length ? 'All revealed' : `Reveal hint ${hintsRevealed + 1}/${lesson.hints.length}`}
                </button>
              </div>
              {hintsRevealed === 0 && (
                <p className="text-[var(--muted)] text-sm italic">Thử giải trước khi xem hint nhé!</p>
              )}
              {lesson.hints.slice(0, hintsRevealed).map((h, i) => (
                <div key={i} className="text-sm text-[var(--muted)] py-2 border-b border-[var(--border)] last:border-0">
                  <span className="text-yellow-400 font-mono text-xs">#{i+1}</span> {h}
                </div>
              ))}
            </div>

            {/* Scoring */}
            <div className="p-5 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
              <h3 className="font-semibold mb-3 flex items-center gap-2"><Trophy size={16} className="text-yellow-400" /> Self-Score</h3>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Cần hint", pts: Math.round(lesson.points * 0.6), color: "border-orange-800/50 text-orange-400" },
                  { label: "Tự làm được", pts: Math.round(lesson.points * 0.8), color: "border-blue-800/50 text-blue-400" },
                  { label: "Perfect!", pts: lesson.points, color: "border-green-800/50 text-green-400" },
                ].map(({ label, pts, color }) => (
                  <button key={label} onClick={() => handleScore(pts)}
                    className={`p-3 rounded-lg border text-center text-xs transition-all hover:scale-105 ${color} ${score === pts ? 'bg-white/10' : 'bg-[var(--bg)]'}`}>
                    <div className="font-bold text-base">{pts}</div>
                    <div>{label}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: editor */}
          <div className="space-y-4">
            <div className="rounded-xl overflow-hidden border border-[var(--border)]">
              <div className="flex items-center justify-between px-4 py-2 bg-[var(--surface)] border-b border-[var(--border)]">
                <span className="text-xs text-[var(--muted)] font-mono">solution.py</span>
                <button onClick={() => setShowSolution(s => !s)}
                  className="text-xs text-[var(--muted)] hover:text-white transition-colors">
                  {showSolution ? 'Hide' : 'Show'} solution
                </button>
              </div>
              <Editor
                height="400px"
                defaultLanguage="python"
                value={showSolution ? lesson.challenge.solution : code}
                onChange={v => !showSolution && setCode(v || '')}
                theme="vs-dark"
                options={{
                  fontSize: 13, minimap: { enabled: false }, scrollBeyondLastLine: false,
                  lineNumbers: 'on', readOnly: showSolution,
                  padding: { top: 12 }, fontFamily: 'JetBrains Mono, Fira Code, monospace'
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Notes Tab */}
      {tab === 'notes' && (
        <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] overflow-hidden">
          <div className="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between">
            <span className="text-sm font-medium">My Notes — Day {dayNum}</span>
            <span className="text-xs text-[var(--muted)]">Markdown supported</span>
          </div>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Ghi chú những điều cần nhớ, điểm còn chưa hiểu, ví dụ thêm..."
            className="w-full h-96 p-4 bg-transparent text-sm text-[var(--text)] resize-none focus:outline-none font-mono placeholder-[var(--muted)]"
          />
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-[var(--border)]">
        {dayNum > 1 ? (
          <Link to={`/python-25/${dayNum - 1}`} className="flex items-center gap-2 text-[var(--muted)] hover:text-white transition-colors text-sm">
            <ChevronLeft size={16} /> Day {dayNum - 1}
          </Link>
        ) : <div />}
        {dayNum < 25 ? (
          <Link to={`/python-25/${dayNum + 1}`} className="flex items-center gap-2 text-[var(--muted)] hover:text-white transition-colors text-sm">
            Day {dayNum + 1} <ChevronRight size={16} />
          </Link>
        ) : <div />}
      </div>
    </div>
  )
}
