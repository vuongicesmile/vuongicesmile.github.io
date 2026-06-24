import { useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import Editor from '@monaco-editor/react'
import ReactMarkdown from 'react-markdown'
import {
  ChevronLeft, ChevronRight, Lightbulb, CheckCircle,
  Save, Trophy, Play, RotateCcw, Eye, EyeOff
} from 'lucide-react'
import { CURRICULUM } from '../../data/curriculum'
import { useProgress } from '../../hooks/useProgress'
import { useAuth } from '../../hooks/useAuth'

type TestResult = { expr: string; passed: boolean; output: string }
type RunStatus = 'idle' | 'loading-pyodide' | 'running' | 'done' | 'error'

export default function DayPage() {
  const { day } = useParams<{ day: string }>()
  const dayNum = parseInt(day || '1')
  const lesson = CURRICULUM.find(l => l.day === dayNum)
  const { user } = useAuth()
  const { progress, saveProgress } = useProgress(user?.id, 'python')

  const [tab, setTab] = useState<'theory' | 'challenge' | 'notes'>('theory')
  const [code, setCode] = useState(lesson?.challenge.starter || '')
  const [hintsRevealed, setHintsRevealed] = useState(0)
  const [notes, setNotes] = useState(progress[dayNum]?.notes || '')
  const [showSolution, setShowSolution] = useState(false)
  const [score, setScore] = useState(progress[dayNum]?.score || 0)
  const [saved, setSaved] = useState(false)

  // Pyodide runner
  const pyodideRef = useRef<any>(null)
  const [runStatus, setRunStatus] = useState<RunStatus>('idle')
  const [output, setOutput] = useState('')
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [autoScore, setAutoScore] = useState<number | null>(null)

  if (!lesson) return <div className="p-8 text-center text-[var(--muted)]">Day not found</div>

  const p = progress[dayNum]
  const isCompleted = p?.completed

  // Load Pyodide on first Run click (lazy)
  const loadPyodide = async () => {
    if (pyodideRef.current) return pyodideRef.current
    setRunStatus('loading-pyodide')
    const pyodide = await (window as any).loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/',
    })
    pyodideRef.current = pyodide
    return pyodide
  }

  const runCode = async () => {
    if (showSolution) return
    setRunStatus('running')
    setOutput('')
    setTestResults([])
    setAutoScore(null)

    try {
      const pyodide = await loadPyodide()
      setRunStatus('running')

      // Capture stdout
      let captured = ''
      pyodide.setStdout({ batched: (s: string) => { captured += s + '\n' } })
      pyodide.setStderr({ batched: (s: string) => { captured += '[stderr] ' + s + '\n' } })

      // Run user code
      await pyodide.runPythonAsync(code)
      setOutput(captured.trim())

      // Run test cases
      const results: TestResult[] = []
      for (const expr of lesson.challenge.testCases) {
        try {
          const result = await pyodide.runPythonAsync(`bool(${expr})`)
          results.push({ expr, passed: result === true, output: result ? 'True' : 'False' })
        } catch (e: any) {
          results.push({ expr, passed: false, output: e.message?.split('\n').pop() || 'Error' })
        }
      }
      setTestResults(results)

      // Auto-score
      if (results.length > 0) {
        const passed = results.filter(r => r.passed).length
        const ratio = passed / results.length
        const usedHints = hintsRevealed > 0
        const pts = Math.round(lesson.points * ratio * (usedHints ? 0.8 : 1))
        setAutoScore(pts)
        if (pts > score) {
          setScore(pts)
          await saveProgress(String(dayNum), { score: pts, completed: pts > 0, notes })
        }
      }

      setRunStatus('done')
    } catch (e: any) {
      const msg = e.message || String(e)
      setOutput(msg)
      setRunStatus('error')
    }
  }

  const resetCode = () => {
    setCode(lesson.challenge.starter)
    setOutput('')
    setTestResults([])
    setAutoScore(null)
    setRunStatus('idle')
    setShowSolution(false)
  }

  const handleSave = async () => {
    await saveProgress(String(dayNum), { notes, score, completed: score > 0 })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleManualScore = async (pts: number) => {
    setScore(pts)
    await saveProgress(String(dayNum), { score: pts, completed: pts > 0, notes })
  }

  return (
    <div className="min-h-screen px-4 py-8 max-w-6xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link to="/python-25" className="flex items-center gap-2 text-[var(--muted)] hover:text-white transition-colors text-sm">
          <ChevronLeft size={16} /> Dashboard
        </Link>
        <div className="flex items-center gap-3">
          {isCompleted && <CheckCircle size={18} className="text-green-400" />}
          {score > 0 && (
            <span className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400 text-sm font-bold border border-yellow-500/20">
              {score} pts
            </span>
          )}
          <button onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium transition-colors">
            <Save size={14} /> {saved ? '✓ Saved!' : 'Save'}
          </button>
        </div>
      </div>

      {/* Title */}
      <div className="mb-6">
        <div className="text-[var(--muted)] text-xs font-mono mb-1 tracking-wider">
          DAY {String(dayNum).padStart(2, '0')} / 25
        </div>
        <h1 className="text-3xl font-bold">{lesson.title}</h1>
        <div className="flex flex-wrap gap-2 mt-3">
          {lesson.topics.map(t => (
            <span key={t} className="text-xs px-3 py-1 rounded-full bg-indigo-900/30 text-indigo-300 border border-indigo-800/40">
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 bg-[var(--surface)] rounded-xl w-fit border border-[var(--border)]">
        {(['theory', 'challenge', 'notes'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
              tab === t ? 'bg-indigo-600 text-white shadow-lg' : 'text-[var(--muted)] hover:text-white'
            }`}>
            {t === 'theory' ? '📖 Theory' : t === 'challenge' ? '💻 Challenge' : '📝 Notes'}
          </button>
        ))}
      </div>

      {/* ── THEORY ─── */}
      {tab === 'theory' && (
        <div className="prose prose-invert prose-sm max-w-none bg-[var(--surface)] p-8 rounded-2xl border border-[var(--border)]
          prose-code:bg-white/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-indigo-300
          prose-pre:bg-black/40 prose-pre:border prose-pre:border-white/10">
          <ReactMarkdown>{lesson.theory}</ReactMarkdown>
        </div>
      )}

      {/* ── CHALLENGE ─── */}
      {tab === 'challenge' && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Left panel (2/5) */}
          <div className="lg:col-span-2 space-y-4">

            {/* Prompt */}
            <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
              <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider text-[var(--muted)]">Challenge</h3>
              <p className="text-sm leading-relaxed">{lesson.challenge.prompt}</p>
            </div>

            {/* Test Cases */}
            {lesson.challenge.testCases.length > 0 && (
              <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
                <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider text-[var(--muted)]">Test Cases</h3>
                <div className="space-y-2">
                  {lesson.challenge.testCases.map((tc, i) => {
                    const result = testResults[i]
                    return (
                      <div key={i} className={`flex items-start gap-2 p-2.5 rounded-lg text-xs font-mono transition-colors ${
                        !result ? 'bg-white/5' :
                        result.passed ? 'bg-green-500/10 border border-green-500/20' :
                        'bg-red-500/10 border border-red-500/20'
                      }`}>
                        <span className="shrink-0 mt-0.5">
                          {!result ? '⬜' : result.passed ? '✅' : '❌'}
                        </span>
                        <span className={result?.passed ? 'text-green-300' : result ? 'text-red-300' : 'text-[var(--muted)]'}>
                          {tc}
                          {result && !result.passed && (
                            <span className="block text-red-400/70 mt-1">→ {result.output}</span>
                          )}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Hints */}
            <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <Lightbulb size={15} className="text-yellow-400" /> Hints
                </h3>
                <button onClick={() => hintsRevealed < lesson.hints.length && setHintsRevealed(h => h + 1)}
                  disabled={hintsRevealed >= lesson.hints.length}
                  className="text-xs px-2.5 py-1 rounded-lg bg-yellow-900/30 text-yellow-400 border border-yellow-800/40 hover:bg-yellow-900/50 disabled:opacity-40 transition-colors">
                  {hintsRevealed >= lesson.hints.length ? 'All shown' : `+Hint (${hintsRevealed}/${lesson.hints.length})`}
                </button>
              </div>
              {hintsRevealed === 0
                ? <p className="text-[var(--muted)] text-xs italic">Thử tự giải trước nhé 💪</p>
                : lesson.hints.slice(0, hintsRevealed).map((h, i) => (
                  <div key={i} className="text-sm text-[var(--muted)] py-2 border-b border-[var(--border)] last:border-0 flex gap-2">
                    <span className="text-yellow-400 text-xs font-mono shrink-0">#{i + 1}</span>
                    <span>{h}</span>
                  </div>
                ))
              }
            </div>

            {/* Score */}
            {(autoScore !== null || testResults.length === 0) && (
              <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
                <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <Trophy size={15} className="text-yellow-400" />
                  {autoScore !== null ? 'Auto Score' : 'Manual Score'}
                </h3>
                {autoScore !== null ? (
                  <div className="text-center py-2">
                    <div className="text-4xl font-bold text-yellow-400">{autoScore}</div>
                    <div className="text-[var(--muted)] text-xs mt-1">/ {lesson.points} pts</div>
                    <div className="mt-3 h-2 bg-[var(--bg)] rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-yellow-500 to-green-500 rounded-full transition-all duration-700"
                        style={{ width: `${Math.round(autoScore / lesson.points * 100)}%` }} />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "Cần hint", pts: Math.round(lesson.points * 0.6), color: "text-orange-400 border-orange-800/50" },
                      { label: "Tự làm", pts: Math.round(lesson.points * 0.8), color: "text-blue-400 border-blue-800/50" },
                      { label: "Perfect", pts: lesson.points, color: "text-green-400 border-green-800/50" },
                    ].map(({ label, pts, color }) => (
                      <button key={label} onClick={() => handleManualScore(pts)}
                        className={`p-3 rounded-xl border text-center text-xs transition-all hover:scale-105 ${color} ${score === pts ? 'bg-white/10' : 'bg-[var(--bg)]'}`}>
                        <div className="font-bold text-lg">{pts}</div>
                        <div className="mt-0.5 opacity-80">{label}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right panel — editor (3/5) */}
          <div className="lg:col-span-3 flex flex-col gap-4">

            {/* Editor toolbar */}
            <div className="rounded-2xl overflow-hidden border border-[var(--border)] flex flex-col">
              <div className="flex items-center justify-between px-4 py-2.5 bg-[var(--surface)] border-b border-[var(--border)]">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/60" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                    <div className="w-3 h-3 rounded-full bg-green-500/60" />
                  </div>
                  <span className="text-xs text-[var(--muted)] font-mono ml-2">solution.py</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={resetCode}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-[var(--muted)] hover:text-white hover:bg-white/10 transition-colors">
                    <RotateCcw size={12} /> Reset
                  </button>
                  <button onClick={() => setShowSolution(s => !s)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-[var(--muted)] hover:text-white hover:bg-white/10 transition-colors">
                    {showSolution ? <EyeOff size={12} /> : <Eye size={12} />}
                    {showSolution ? 'Hide' : 'Solution'}
                  </button>
                </div>
              </div>

              <Editor
                height="360px"
                defaultLanguage="python"
                value={showSolution ? lesson.challenge.solution : code}
                onChange={v => !showSolution && setCode(v || '')}
                theme="vs-dark"
                options={{
                  fontSize: 13,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  lineNumbers: 'on',
                  readOnly: showSolution,
                  padding: { top: 12, bottom: 12 },
                  fontFamily: 'JetBrains Mono, Fira Code, Consolas, monospace',
                  cursorBlinking: 'smooth',
                  smoothScrolling: true,
                }}
              />
            </div>

            {/* Run button */}
            <button onClick={runCode}
              disabled={runStatus === 'loading-pyodide' || runStatus === 'running' || showSolution}
              className="flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm transition-all
                bg-green-600 hover:bg-green-500 disabled:opacity-60 disabled:cursor-not-allowed
                hover:shadow-lg hover:shadow-green-500/20 active:scale-95">
              {runStatus === 'loading-pyodide' ? (
                <><span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> Loading Python...</>
              ) : runStatus === 'running' ? (
                <><span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> Running...</>
              ) : (
                <><Play size={16} fill="currentColor" /> Run & Check</>
              )}
            </button>

            {/* Output */}
            {(output || runStatus === 'error') && (
              <div className={`rounded-2xl overflow-hidden border ${runStatus === 'error' ? 'border-red-500/30' : 'border-[var(--border)]'}`}>
                <div className={`px-4 py-2 text-xs font-medium border-b ${runStatus === 'error' ? 'bg-red-900/20 text-red-400 border-red-500/20' : 'bg-[var(--surface)] text-[var(--muted)] border-[var(--border)]'}`}>
                  {runStatus === 'error' ? '❌ Error' : '▶ Output'}
                </div>
                <pre className="p-4 text-xs font-mono text-[var(--muted)] bg-black/30 max-h-48 overflow-auto whitespace-pre-wrap">
                  {output || '(no output)'}
                </pre>
              </div>
            )}

            {/* Test summary */}
            {testResults.length > 0 && (
              <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--muted)]">Test results:</span>
                  <span className={`font-bold ${testResults.every(r => r.passed) ? 'text-green-400' : 'text-orange-400'}`}>
                    {testResults.filter(r => r.passed).length} / {testResults.length} passed
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── NOTES ─── */}
      {tab === 'notes' && (
        <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] overflow-hidden">
          <div className="px-5 py-3 border-b border-[var(--border)] flex items-center justify-between">
            <span className="text-sm font-medium">📝 My Notes — Day {dayNum}</span>
            <span className="text-xs text-[var(--muted)]">Markdown supported</span>
          </div>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder={`Ghi chú Day ${dayNum}...\n\n## Điều cần nhớ\n\n## Còn chưa hiểu\n\n## Ví dụ thêm`}
            className="w-full h-96 p-5 bg-transparent text-sm text-[var(--text)] resize-none focus:outline-none font-mono leading-relaxed placeholder-[var(--muted)]/50"
          />
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-[var(--border)]">
        {dayNum > 1 ? (
          <Link to={`/python-25/${dayNum - 1}`}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-[var(--muted)] hover:text-white hover:bg-white/5 transition-all">
            <ChevronLeft size={16} /> Day {dayNum - 1}
          </Link>
        ) : <div />}
        {dayNum < 25 ? (
          <Link to={`/python-25/${dayNum + 1}`}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-[var(--muted)] hover:text-white hover:bg-white/5 transition-all">
            Day {dayNum + 1} <ChevronRight size={16} />
          </Link>
        ) : <div />}
      </div>
    </div>
  )
}
