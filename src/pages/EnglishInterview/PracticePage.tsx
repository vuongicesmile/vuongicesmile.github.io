import { useState, useRef, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { QUESTIONS } from '../../data/english-interview'
import { useProgress } from '../../hooks/useProgress'
import { useAuth } from '../../hooks/useAuth'
import {
  ChevronLeft, ChevronRight, Eye, EyeOff,
  Mic, MicOff, CheckCircle, RotateCcw, AlertCircle
} from 'lucide-react'

// ── Speech Recognition types ─────────────────────────────
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

// ── Scoring engine ────────────────────────────────────────
type Feedback = {
  score: number
  keywordsHit: string[]
  keywordsMissed: string[]
  wordCount: number
  duration: number
  suggestions: string[]
  grade: 'A' | 'B' | 'C' | 'D'
}

function analyzeAnswer(transcript: string, keywords: string[], answer: string, duration: number): Feedback {
  const text = transcript.toLowerCase()
  const words = transcript.trim().split(/\s+/).filter(Boolean)
  const wordCount = words.length

  // Keyword matching (flexible — match partial)
  const keywordsHit = keywords.filter(k =>
    text.includes(k.toLowerCase()) ||
    k.toLowerCase().split(' ').every(w => text.includes(w))
  )
  const keywordsMissed = keywords.filter(k => !keywordsHit.includes(k))

  // Score components
  const keywordScore = keywords.length > 0 ? (keywordsHit.length / keywords.length) * 40 : 40
  const lengthScore = wordCount < 30 ? 10 : wordCount < 60 ? 20 : wordCount < 150 ? 30 : 25
  const fluencyScore = duration > 5 ? Math.min(20, (wordCount / duration) * 3) : 5
  const contentScore = computeContentSimilarity(text, answer) * 10

  const raw = keywordScore + lengthScore + fluencyScore + contentScore
  const score = Math.min(100, Math.max(20, Math.round(raw)))

  // Suggestions
  const suggestions: string[] = []
  if (wordCount < 50) suggestions.push('Câu trả lời quá ngắn — cần ít nhất 60-80 từ cho mỗi câu')
  if (wordCount > 200) suggestions.push('Hơi dài — interviewer thích câu trả lời 60-120 từ')
  if (keywordsMissed.length > 0) suggestions.push(`Chưa đề cập: ${keywordsMissed.slice(0, 3).join(', ')}`)
  if (!text.includes('i') && !text.includes("i've") && !text.includes('my')) suggestions.push('Dùng nhiều "I" hơn — interviewer muốn nghe về BẠN cụ thể')
  if (!text.match(/\b(for example|for instance|such as|like when|specifically)\b/)) suggestions.push('Thêm ví dụ cụ thể: "For example..." hoặc "Specifically..."')
  if (duration > 0 && wordCount / duration < 1.5) suggestions.push('Nói chậm quá — mục tiêu 120-150 từ/phút')

  const grade: 'A' | 'B' | 'C' | 'D' = score >= 85 ? 'A' : score >= 70 ? 'B' : score >= 55 ? 'C' : 'D'

  return { score, keywordsHit, keywordsMissed, wordCount, duration: Math.round(duration), suggestions, grade }
}

function computeContentSimilarity(transcript: string, answer: string): number {
  const stopWords = new Set(['the','a','an','is','are','was','were','i','you','we','they','it','in','on','at','to','for','of','and','or','but'])
  const answerWords = new Set(answer.toLowerCase().split(/\W+/).filter(w => w.length > 3 && !stopWords.has(w)))
  const transcriptWords = transcript.split(/\W+/).filter(w => w.length > 3 && !stopWords.has(w))
  if (answerWords.size === 0) return 5
  const matches = transcriptWords.filter(w => answerWords.has(w)).length
  return Math.min(10, Math.round((matches / answerWords.size) * 15))
}

// ── Grade display ─────────────────────────────────────────
const GRADE_CONFIG = {
  A: { color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/30', label: 'Excellent!' },
  B: { color: 'text-blue-400',  bg: 'bg-blue-500/10 border-blue-500/30',  label: 'Good' },
  C: { color: 'text-yellow-400',bg: 'bg-yellow-500/10 border-yellow-500/30', label: 'Needs work' },
  D: { color: 'text-red-400',   bg: 'bg-red-500/10 border-red-500/30',   label: 'Practice more' },
}

const DIFF_COLOR: Record<string, string> = {
  easy: 'text-green-400 bg-green-500/10 border-green-500/20',
  medium: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  hard: 'text-red-400 bg-red-500/10 border-red-500/20',
}

// ── Main component ────────────────────────────────────────
export default function PracticePage() {
  const { id } = useParams<{ id: string }>()
  const q = QUESTIONS.find(l => l.id === id)
  const idx = QUESTIONS.findIndex(l => l.id === id)
  const prev = QUESTIONS[idx - 1]
  const next = QUESTIONS[idx + 1]

  const { user } = useAuth()
  const { progress, saveProgress } = useProgress(user?.id, 'english')
  const p = progress[id || '']

  // UI state
  const [showAnswer, setShowAnswer] = useState(false)
  const [showTip, setShowTip] = useState(false)

  // Recording state
  const [recording, setRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [interimText, setInterimText] = useState('')
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [speechSupported, setSpeechSupported] = useState(true)

  const recogRef = useRef<any>(null)
  const startTimeRef = useRef<number>(0)
  const finalTranscriptRef = useRef('')

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) setSpeechSupported(false)
  }, [])

  // Reset on question change
  useEffect(() => {
    setShowAnswer(false)
    setShowTip(false)
    setTranscript('')
    setInterimText('')
    setFeedback(null)
    stopRecording()
  }, [id])

  const stopRecording = useCallback(() => {
    recogRef.current?.stop()
    recogRef.current = null
    setRecording(false)
  }, [])

  const startRecording = useCallback(() => {
    if (!q) return
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) return

    finalTranscriptRef.current = ''
    setTranscript('')
    setInterimText('')
    setFeedback(null)

    const recog = new SR()
    recog.lang = 'en-US'
    recog.continuous = true
    recog.interimResults = true

    recog.onresult = (e: any) => {
      let interim = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript
        if (e.results[i].isFinal) {
          finalTranscriptRef.current += t + ' '
          setTranscript(finalTranscriptRef.current.trim())
        } else {
          interim = t
        }
      }
      setInterimText(interim)
    }

    recog.onerror = () => stopRecording()
    recog.onend = () => {
      setRecording(false)
      setInterimText('')
      // Auto-score when stopped
      const duration = (Date.now() - startTimeRef.current) / 1000
      const final = finalTranscriptRef.current.trim()
      if (final.length > 5) {
        const fb = analyzeAnswer(final, q.keywords, q.answer, duration)
        setFeedback(fb)
        saveProgress(q.id, { completed: true, score: fb.score, notes: p?.notes || '' })
      }
    }

    startTimeRef.current = Date.now()
    recog.start()
    recogRef.current = recog
    setRecording(true)
  }, [q, p, saveProgress, stopRecording])

  if (!q) return <div className="p-8 text-center">Question not found</div>

  const gradeConf = feedback ? GRADE_CONFIG[feedback.grade] : null

  return (
    <div className="min-h-screen max-w-2xl mx-auto px-6 py-10">

      {/* Back */}
      <Link to="/english-interview"
        className="inline-flex items-center gap-2 text-[var(--muted)] hover:text-white text-sm mb-8 transition-colors">
        <ChevronLeft size={16} /> All Questions
      </Link>

      {/* Progress bar */}
      <div className="flex items-center gap-2 mb-6 text-xs text-[var(--muted)]">
        <span>{idx + 1}/{QUESTIONS.length}</span>
        <div className="flex-1 h-1 bg-[var(--border)] rounded-full overflow-hidden">
          <div className="h-full bg-green-500 rounded-full" style={{ width: `${(idx+1)/QUESTIONS.length*100}%` }} />
        </div>
        <span className={`px-2 py-0.5 rounded-full border text-xs ${DIFF_COLOR[q.difficulty]}`}>{q.difficulty}</span>
      </div>

      {/* Question */}
      <div className="p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)] mb-6">
        <div className="text-xs text-[var(--muted)] mb-3 uppercase tracking-wider">Interview Question</div>
        <p className="text-xl font-semibold leading-relaxed">"{q.question}"</p>
      </div>

      {/* ── RECORDING AREA ── */}
      <div className="mb-6">
        {!speechSupported ? (
          <div className="p-4 rounded-xl bg-yellow-900/20 border border-yellow-800/30 flex gap-3">
            <AlertCircle size={16} className="text-yellow-400 shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-200/70">
              Browser không hỗ trợ Web Speech API. Dùng Chrome/Edge để record. Bạn vẫn có thể tự chấm điểm bên dưới.
            </div>
          </div>
        ) : (
          <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-medium">🎤 Speak your answer</div>
              {feedback && (
                <button onClick={() => { setTranscript(''); setInterimText(''); setFeedback(null) }}
                  className="flex items-center gap-1 text-xs text-[var(--muted)] hover:text-white transition-colors">
                  <RotateCcw size={12} /> Retry
                </button>
              )}
            </div>

            {/* Record button */}
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={recording ? stopRecording : startRecording}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-all ${
                  recording
                    ? 'bg-red-600 hover:bg-red-500 animate-pulse'
                    : 'bg-green-600 hover:bg-green-500'
                }`}>
                {recording ? <><MicOff size={16} /> Stop</> : <><Mic size={16} /> Start Recording</>}
              </button>

              {recording && (
                <div className="flex items-center gap-1.5 text-red-400 text-sm">
                  <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                  Listening...
                </div>
              )}
            </div>

            {/* Transcript */}
            {(transcript || interimText) && (
              <div className="p-4 rounded-xl bg-black/30 border border-white/10 text-sm min-h-16 leading-relaxed">
                <span className="text-white">{transcript}</span>
                {interimText && <span className="text-[var(--muted)] italic"> {interimText}</span>}
              </div>
            )}

            {!transcript && !recording && !feedback && (
              <p className="text-xs text-[var(--muted)] text-center py-3">
                Bấm record → nói câu trả lời → bấm stop → AI chấm điểm
              </p>
            )}
          </div>
        )}
      </div>

      {/* ── AI FEEDBACK ── */}
      {feedback && (
        <div className="mb-6 space-y-4">
          {/* Score header */}
          <div className={`p-5 rounded-2xl border ${gradeConf?.bg} flex items-center gap-5`}>
            <div className="text-center shrink-0">
              <div className={`text-5xl font-black ${gradeConf?.color}`}>{feedback.grade}</div>
              <div className={`text-xs font-medium mt-1 ${gradeConf?.color}`}>{gradeConf?.label}</div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="text-3xl font-bold">{feedback.score}</div>
                <div className="text-[var(--muted)] text-sm">/100</div>
              </div>
              <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-700 ${
                  feedback.score >= 85 ? 'bg-green-500' : feedback.score >= 70 ? 'bg-blue-500' : feedback.score >= 55 ? 'bg-yellow-500' : 'bg-red-500'
                }`} style={{ width: `${feedback.score}%` }} />
              </div>
              <div className="flex gap-4 mt-2 text-xs text-[var(--muted)]">
                <span>📝 {feedback.wordCount} words</span>
                <span>⏱ {feedback.duration}s</span>
                <span>🎯 {feedback.keywordsHit.length}/{feedback.keywordsHit.length + feedback.keywordsMissed.length} keywords</span>
              </div>
            </div>
          </div>

          {/* Keywords */}
          <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
            <div className="text-xs font-semibold mb-3 uppercase tracking-wider text-[var(--muted)]">Keywords Analysis</div>
            <div className="flex flex-wrap gap-2">
              {feedback.keywordsHit.map(k => (
                <span key={k} className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-green-900/20 text-green-300 border border-green-800/30">
                  <CheckCircle size={10} /> {k}
                </span>
              ))}
              {feedback.keywordsMissed.map(k => (
                <span key={k} className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-red-900/20 text-red-300 border border-red-800/30">
                  ✗ {k}
                </span>
              ))}
            </div>
          </div>

          {/* Suggestions */}
          {feedback.suggestions.length > 0 && (
            <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
              <div className="text-xs font-semibold mb-3 uppercase tracking-wider text-[var(--muted)]">
                Cải thiện
              </div>
              <ul className="space-y-2">
                {feedback.suggestions.map((s, i) => (
                  <li key={i} className="flex gap-2 text-sm text-[var(--muted)]">
                    <span className="text-orange-400 shrink-0">→</span> {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* ── SAMPLE ANSWER + TIP ── */}
      <div className="space-y-3 mb-8">
        <button onClick={() => setShowAnswer(s => !s)}
          className="w-full flex items-center justify-between px-5 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] hover:border-green-600/40 transition-all text-sm font-medium">
          <span className="flex items-center gap-2">
            {showAnswer ? <EyeOff size={15} /> : <Eye size={15} />}
            {showAnswer ? 'Hide sample answer' : 'Show sample answer'}
          </span>
        </button>

        {showAnswer && (
          <div className="p-5 rounded-2xl bg-[var(--surface)] border border-green-800/20">
            <div className="text-xs text-green-400 uppercase tracking-wider font-semibold mb-3">Sample Answer</div>
            <p className="text-sm text-[var(--muted)] leading-relaxed mb-4">{q.answer}</p>
            <div className="pt-3 border-t border-[var(--border)]">
              <div className="text-xs text-[var(--muted)] mb-2">Keywords to use:</div>
              <div className="flex flex-wrap gap-1.5">
                {q.keywords.map(k => (
                  <span key={k} className="text-xs px-2 py-0.5 rounded-full bg-green-900/20 text-green-300 border border-green-800/20">{k}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        <button onClick={() => setShowTip(s => !s)}
          className="w-full flex items-center justify-between px-5 py-3 rounded-xl bg-yellow-900/10 border border-yellow-800/20 hover:border-yellow-600/30 text-sm transition-all">
          <span className="text-yellow-400 flex items-center gap-2">
            💡 {showTip ? 'Hide tip' : 'Interviewer tip'}
          </span>
        </button>
        {showTip && (
          <div className="px-5 py-4 rounded-xl bg-yellow-900/10 border border-yellow-800/20 text-sm text-yellow-100/70 italic">
            {q.tip}
          </div>
        )}
      </div>

      {/* Nav */}
      <div className="flex items-center justify-between pt-6 border-t border-[var(--border)]">
        {prev ? (
          <Link to={`/english-interview/${prev.id}`}
            className="flex flex-col gap-1 p-4 rounded-xl border border-[var(--border)] hover:border-green-600/30 transition-all max-w-[45%] group">
            <span className="text-xs text-[var(--muted)] flex items-center gap-1"><ChevronLeft size={12} /> Prev</span>
            <span className="text-sm line-clamp-2 group-hover:text-green-300 transition-colors">"{prev.question.slice(0,45)}..."</span>
          </Link>
        ) : <div />}
        {next ? (
          <Link to={`/english-interview/${next.id}`}
            className="flex flex-col gap-1 p-4 rounded-xl border border-[var(--border)] hover:border-green-600/30 transition-all max-w-[45%] text-right group ml-auto">
            <span className="text-xs text-[var(--muted)] flex items-center gap-1 justify-end">Next <ChevronRight size={12} /></span>
            <span className="text-sm line-clamp-2 group-hover:text-green-300 transition-colors">"{next.question.slice(0,45)}..."</span>
          </Link>
        ) : <div />}
      </div>
    </div>
  )
}
