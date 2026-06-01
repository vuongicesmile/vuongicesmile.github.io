import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import { Code2, User, LogOut } from 'lucide-react'
import Portfolio from './pages/Portfolio'
import Python25Dashboard from './pages/Python25/index'
import DayPage from './pages/Python25/DayPage'
import LoginPage from './pages/Python25/LoginPage'
import { useAuth } from './hooks/useAuth'

function Nav() {
  const loc = useLocation()
  const { user, signOut } = useAuth()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]/90 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link to="/" className="font-bold text-sm hover:text-indigo-400 transition-colors">VQ.</Link>
        <div className="flex items-center gap-6">
          <Link to="/" className={`text-sm transition-colors flex items-center gap-1.5 ${loc.pathname === '/' ? 'text-white' : 'text-[var(--muted)] hover:text-white'}`}>
            <User size={14} /> Portfolio
          </Link>
          <Link to="/python-25" className={`text-sm transition-colors flex items-center gap-1.5 ${loc.pathname.startsWith('/python-25') ? 'text-indigo-400' : 'text-[var(--muted)] hover:text-white'}`}>
            <Code2 size={14} /> Python-25
          </Link>
          {user ? (
            <button onClick={signOut} className="text-sm text-[var(--muted)] hover:text-white flex items-center gap-1.5 transition-colors">
              <LogOut size={14} /> Logout
            </button>
          ) : (
            <Link to="/python-25/login" className="text-sm text-[var(--muted)] hover:text-white flex items-center gap-1.5 transition-colors">
              <User size={14} /> Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Nav />
      <div className="pt-14">
        <Routes>
          <Route path="/" element={<Portfolio />} />
          <Route path="/python-25" element={<Python25Dashboard />} />
          <Route path="/python-25/:day" element={<DayPage />} />
          <Route path="/python-25/login" element={<LoginPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
