import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { GitBranch } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

export default function LoginPage() {
  const { signIn, signUp, signInWithGitHub } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handle = async () => {
    setError(''); setLoading(true)
    const fn = mode === 'login' ? signIn : signUp
    const { error: err } = await fn(email, password)
    setLoading(false)
    if (err) { setError(err.message); return }
    navigate('/python-25')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">🐍 Python-25</h1>
          <p className="text-[var(--muted)] text-sm mt-2">Login để lưu tiến độ học</p>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 space-y-4">
          <button onClick={signInWithGitHub}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg bg-[var(--bg)] border border-[var(--border)] hover:border-indigo-600 transition-colors font-medium text-sm">
            <GitBranch size={18} /> Continue with GitHub
          </button>

          <div className="relative flex items-center">
            <div className="flex-1 border-t border-[var(--border)]" />
            <span className="px-3 text-xs text-[var(--muted)]">or</span>
            <div className="flex-1 border-t border-[var(--border)]" />
          </div>

          <div className="space-y-3">
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-sm focus:outline-none focus:border-indigo-600 transition-colors" />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handle()}
              className="w-full px-4 py-3 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-sm focus:outline-none focus:border-indigo-600 transition-colors" />
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <button onClick={handle} disabled={loading}
            className="w-full py-3 bg-[var(--accent)] rounded-lg font-medium text-sm hover:bg-indigo-500 transition-colors disabled:opacity-50">
            {loading ? 'Loading...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>

          <p className="text-center text-xs text-[var(--muted)]">
            {mode === 'login' ? "Chưa có account? " : "Đã có account? "}
            <button onClick={() => setMode(m => m === 'login' ? 'signup' : 'login')}
              className="text-indigo-400 hover:underline">
              {mode === 'login' ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>

        <div className="text-center mt-4">
          <Link to="/python-25" className="text-xs text-[var(--muted)] hover:text-white transition-colors">
            ← Tiếp tục không cần login (lưu tại browser)
          </Link>
        </div>
      </div>
    </div>
  )
}
