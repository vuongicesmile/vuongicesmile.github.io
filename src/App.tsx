import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import { Code2, User, LogOut, Bot, Globe, Zap, Shield, Boxes } from 'lucide-react'
import Portfolio from './pages/Portfolio'
import Python25Dashboard from './pages/Python25/index'
import DayPage from './pages/Python25/DayPage'
import LoginPage from './pages/Python25/LoginPage'
import ClaudeMasteryDashboard from './pages/ClaudeMastery/index'
import ClaudeLessonPage from './pages/ClaudeMastery/LessonPage'
import EnglishInterviewDashboard from './pages/EnglishInterview/index'
import PracticePage from './pages/EnglishInterview/PracticePage'
import FastAPIDashboard from './pages/FastAPIModule/index'
import FastAPILessonPage from './pages/FastAPIModule/LessonPage'
import RealWorldDashboard from './pages/RealWorldPatterns/index'
import RWLessonPage from './pages/RealWorldPatterns/LessonPage'
import BookManagementDashboard from './pages/BookManagement/index'
import BookManagementLessonPage from './pages/BookManagement/LessonPage'
import { useAuth } from './hooks/useAuth'

function Nav() {
  const loc = useLocation()
  const { user, signOut } = useAuth()
  const isActive = (path: string) => loc.pathname === path || loc.pathname.startsWith(path + '/')

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]/90 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-2">
        <Link to="/" className="font-bold text-sm hover:text-indigo-400 transition-colors shrink-0">VQ.</Link>
        <div className="flex items-center gap-4 overflow-x-auto text-sm">
          <Link to="/" className={`flex items-center gap-1.5 transition-colors shrink-0 ${loc.pathname === '/' ? 'text-white' : 'text-[var(--muted)] hover:text-white'}`}>
            <User size={13} /><span className="hidden sm:inline">Portfolio</span>
          </Link>
          <Link to="/python-25" className={`flex items-center gap-1.5 shrink-0 transition-colors ${isActive('/python-25') ? 'text-indigo-400' : 'text-[var(--muted)] hover:text-white'}`}>
            <Code2 size={13} />Python
          </Link>
          <Link to="/fastapi" className={`flex items-center gap-1.5 shrink-0 transition-colors ${isActive('/fastapi') ? 'text-orange-400' : 'text-[var(--muted)] hover:text-white'}`}>
            <Zap size={13} />FastAPI
          </Link>
          <Link to="/real-world" className={`flex items-center gap-1.5 shrink-0 transition-colors ${isActive('/real-world') ? 'text-teal-400' : 'text-[var(--muted)] hover:text-white'}`}>
            <Shield size={13} />Patterns
          </Link>
          <Link to="/claude-mastery" className={`flex items-center gap-1.5 shrink-0 transition-colors ${isActive('/claude-mastery') ? 'text-purple-400' : 'text-[var(--muted)] hover:text-white'}`}>
            <Bot size={13} />Claude
          </Link>
          <Link to="/english-interview" className={`flex items-center gap-1.5 shrink-0 transition-colors ${isActive('/english-interview') ? 'text-green-400' : 'text-[var(--muted)] hover:text-white'}`}>
            <Globe size={13} />English
          </Link>
          <Link to="/book-management" className={`flex items-center gap-1.5 shrink-0 transition-colors ${isActive('/book-management') ? 'text-teal-400' : 'text-[var(--muted)] hover:text-white'}`}>
            <Boxes size={13} />Projects
          </Link>
          {user ? (
            <button onClick={signOut} className="text-[var(--muted)] hover:text-white flex items-center gap-1 shrink-0 transition-colors">
              <LogOut size={13} />
            </button>
          ) : (
            <Link to="/python-25/login" className="text-[var(--muted)] hover:text-white flex items-center gap-1 shrink-0 transition-colors">
              <User size={13} />
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
          <Route path="/fastapi" element={<FastAPIDashboard />} />
          <Route path="/fastapi/:id" element={<FastAPILessonPage />} />
          <Route path="/real-world" element={<RealWorldDashboard />} />
          <Route path="/real-world/:id" element={<RWLessonPage />} />
          <Route path="/claude-mastery" element={<ClaudeMasteryDashboard />} />
          <Route path="/claude-mastery/:id" element={<ClaudeLessonPage />} />
          <Route path="/english-interview" element={<EnglishInterviewDashboard />} />
          <Route path="/english-interview/:id" element={<PracticePage />} />
          <Route path="/book-management" element={<BookManagementDashboard />} />
          <Route path="/book-management/:id" element={<BookManagementLessonPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
