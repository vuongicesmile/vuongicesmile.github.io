import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function LoginPage() {
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  const handle = async () => {
    setError(''); setSuccess(''); setLoading(true)
    const fn = mode === 'login' ? signIn : signUp
    const { error: err } = await fn(email, password)
    setLoading(false)
    if (err) { setError(err.message); return }
    if (mode === 'signup') {
      setSuccess('Account created! Đăng nhập ngay nhé.')
      setMode('login')
      return
    }
    navigate('/python-25')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🐍</div>
          <h1 className="text-2xl font-bold">Python-25</h1>
          <p className="text-[var(--muted)] text-sm mt-2">
            {mode === 'login' ? 'Đăng nhập để lưu tiến độ' : 'Tạo account miễn phí'}
          </p>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 space-y-4">
          <div className="flex rounded-lg bg-[var(--bg)] p-1 border border-[var(--border)]">
            {(['login', 'signup'] as const).map(m => (
              <button key={m} onClick={() => { setMode(m); setError(''); setSuccess('') }}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${mode === m ? 'bg-indigo-600 text-white' : 'text-[var(--muted)] hover:text-white'}`}>
                {m === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-sm focus:outline-none focus:border-indigo-600 transition-colors" />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handle()}
              className="w-full px-4 py-3 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-sm focus:outline-none focus:border-indigo-600 transition-colors" />
          </div>

          {error && (
            <div className="px-3 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
              {error}
            </div>
          )}
          {success && (
            <div className="px-3 py-2.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-xs">
              ✅ {success}
            </div>
          )}

          <button onClick={handle} disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-medium text-sm transition-all disabled:opacity-50 hover:shadow-lg hover:shadow-indigo-500/20">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Loading...
              </span>
            ) : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
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
