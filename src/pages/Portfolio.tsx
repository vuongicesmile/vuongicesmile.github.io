import { GitBranch, Link, Mail, Code2, Server, Database, MapPin, Award, Bot, FlaskConical, Cloud } from 'lucide-react'

const AVATAR = "https://avatars.githubusercontent.com/u/62591859?v=4"

type Project = { name: string; stack: string; desc: string }

type Exp = {
  period: string; role: string; company: string; location: string; current: boolean
  summary?: string
  points: string[]
  projects?: Project[]
  tech: string[]
}

const EXPERIENCE: Exp[] = [
  {
    period: "Jun 2025 — Present",
    role: "AI Product Engineer",
    company: "YTL AI Labs",
    location: "Malaysia (Remote)",
    current: true,
    summary: "Malaysia's homegrown AI chat platform — consumer-facing ChatGPT alternative with text, images, documents, slides, and voice.",
    points: [
      "Mobile QA automation: built Appium iOS + Android test framework from scratch with GitHub Actions CI/CD, OIDC-authenticated S3 upload, and HTML reports surfaced in the ops portal",
      "Parallel test sharding and retry handling to improve CI stability",
      "Artifact build panel with capped user concurrency; prompt autocomplete with suggestion mode and next-action chips",
      "File library storage quota with per-plan limits and client-side image resizing before upload",
      "Localized email templates (EN / BM / ZH), TTFT + artifact analytics endpoints, stream error retry",
      "LLM quality evaluation API with 18 custom DeepEval metrics including Malaysian cultural sensitivity scoring",
      "OpenAI-compatible API wrapper (ilmu-wrapper) providing TTS, ASR, chat completions, and image understanding",
    ],
    projects: [
      { name: "ILMUchat", stack: "Next.js 15 · React 19 · FastAPI · pytest", desc: "Current production version — full-stack AI chat platform" },
      { name: "ILMUchat 0.6.5", stack: "SvelteKit · FastAPI", desc: "OpenWebUI-powered version on Kubernetes multi-pod architecture" },
      { name: "ilmu-wrapper", stack: "FastAPI · OpenWebUI", desc: "OpenAI-compatible wrapper with TTS, ASR, and image understanding" },
      { name: "llm-quality-test", stack: "DeepEval · FastAPI", desc: "LLM evaluation API with Malaysian-context custom metrics" },
    ],
    tech: ["Next.js 15", "React 19", "FastAPI", "SvelteKit", "pytest", "Appium", "DeepEval", "GitHub Actions", "AWS S3/OIDC", "K8s/EKS", "Redis", "Datadog"],
  },
  {
    period: "Mar 2023 — Jun 2025",
    role: "Senior Software Engineer",
    company: "FrogAsia (Frog VLE)",
    location: "Malaysia (Remote)",
    current: false,
    points: [
      "Built Byte Agent — AI-powered Malaysian news assistant supporting ILMU, Gemini, and OpenAI backends with STT (gpt-4o-transcribe), bookmark API, and Docker CI/CD pipeline",
      "AI-powered lesson plan generator for teachers on FrogAsia's Starboard education platform (Mocha)",
      "Integrated GUM authentication service; fixed token parsing, inline citation bugs, and web search integration (SerpAPI)",
      "N8N automation workflows for QA pipeline and output validation; automation testing scripts and documentation",
    ],
    projects: [
      { name: "Byte Agent", stack: "FastAPI · Gemini · OpenAI", desc: "AI news assistant aggregating Malaysian news across multiple LLM backends" },
      { name: "Mocha — Starboard", stack: "Laravel · React", desc: "AI features for FrogAsia's education platform for Malaysian schools" },
      { name: "Core Platform (Frog VLE)", stack: "PHP · Laravel · React.js", desc: "Flagship virtual learning environment for Malaysian schools" },
    ],
    tech: ["PHP", "Laravel", "React.js", "FastAPI", "Material UI", "Selenium", "N8N", "Gemini", "OpenAI"],
  },
  {
    period: "Jun 2023 — Feb 2024",
    role: "Full-Stack Developer",
    company: "Titan Technologies",
    location: "Da Lat, Vietnam",
    current: false,
    points: [
      "Built Deloitte audit management platform — engagement management, change tracking, version migration",
      "Redux state management for complex form flows; fixed Azure authentication issues",
    ],
    tech: ["React.js", "Redux", "Semantic UI", "Azure"],
  },
  {
    period: "Apr 2022 — Jun 2023",
    role: "Front-End Developer",
    company: "Dragon Technologies",
    location: "Vietnam (On-site)",
    current: false,
    points: [
      "Built PMS, POS, HRM, and Admin Dashboard UIs for Vietnamese enterprise clients",
      "Advanced reporting with DevExpress — custom SQL queries, sales analysis, financial tracking",
      "Optimized SQL queries for large datasets; trained end-users and supported on-site deployments",
    ],
    tech: ["React.js", "TypeScript", "Ant Design", "UmiJS", "DevExpress", "Advanced SQL"],
  },
  {
    period: "2021 — 2022",
    role: "Web Developer",
    company: "Labian Labs",
    location: "Da Lat, Vietnam",
    current: false,
    points: [
      "Contributed to Aida — a Vietnamese EdTech multimedia English learning platform",
    ],
    tech: ["React.js", "JavaScript"],
  },
  {
    period: "Aug — Dec 2021",
    role: "Front-End Developer (Internship)",
    company: "ITC DLU · Dalat University",
    location: "Da Lat, Vietnam",
    current: false,
    points: [
      "Built WordPress sites with custom themes, post types, hooks, and metadata",
    ],
    tech: ["WordPress", "WP-MVC", "MySQL"],
  },
]

const SKILLS = [
  { category: "Languages", icon: Code2, color: "from-blue-500 to-cyan-500", items: ["Python", "TypeScript", "JavaScript", "PHP", "SQL"] },
  { category: "Frameworks", icon: Server, color: "from-violet-500 to-purple-500", items: ["FastAPI", "Next.js 15", "React 19", "SvelteKit", "Laravel", "Node.js"] },
  { category: "AI / LLM", icon: Bot, color: "from-pink-500 to-rose-500", items: ["Claude API", "OpenWebUI", "SSE Streaming", "RAG / pgvector", "Agent Design", "LLM Eval"] },
  { category: "Testing & QA", icon: FlaskConical, color: "from-amber-500 to-orange-500", items: ["Appium", "pytest", "Playwright", "Selenium", "DeepEval"] },
  { category: "Cloud & Infra", icon: Cloud, color: "from-green-500 to-emerald-500", items: ["GitHub Actions", "AWS S3 / OIDC", "K8s / EKS", "Docker", "Redis", "Datadog"] },
  { category: "Databases", icon: Database, color: "from-orange-500 to-amber-500", items: ["PostgreSQL", "pgvector", "Redis", "MySQL", "MSSQL"] },
]

export default function Portfolio() {
  return (
    <div className="min-h-screen overflow-x-hidden">

      {/* ── HERO ────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center px-6 overflow-hidden">

        {/* Mesh gradient background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[var(--bg)]" />
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[80px]" />
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>

        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-20">

          {/* Left: text */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Open to opportunities
            </div>

            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-4">
              <span className="block text-[var(--text)]">Nguyen</span>
              <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Quoc Vuong
              </span>
            </h1>

            <p className="text-lg text-[var(--muted)] mb-2 font-medium">
              AI Product Engineer · Full-Stack · QA Automation
            </p>
            <div className="flex items-center gap-2 text-[var(--muted)] text-sm mb-6">
              <MapPin size={14} />
              <span>Da Lat, Vietnam</span>
              <span className="mx-2">·</span>
              <span>5+ Years Experience</span>
            </div>

            <p className="text-[var(--muted)] leading-relaxed mb-8 max-w-lg">
              Building AI products and scalable web apps. Currently at{' '}
              <span className="text-white font-medium">YTL AI Labs</span> shipping features on
              Malaysia's AI chat platform — from mobile QA automation to LLM evaluation APIs.
            </p>

            <div className="flex flex-wrap gap-3">
              <a href="#experience"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-medium text-sm transition-all hover:shadow-lg hover:shadow-indigo-500/25">
                View Experience
              </a>
              <a href="mailto:vu0nqnq@gmail.com"
                className="px-5 py-2.5 border border-[var(--border)] hover:border-indigo-500/50 rounded-lg font-medium text-sm transition-all flex items-center gap-2 hover:bg-white/5">
                <Mail size={14} /> Contact Me
              </a>
            </div>

            <div className="flex gap-4 mt-8">
              <a href="https://github.com/vuongicesmile" target="_blank"
                className="flex items-center gap-2 text-[var(--muted)] hover:text-white transition-colors text-sm">
                <GitBranch size={16} /> GitHub
              </a>
              <a href="https://www.linkedin.com/in/vương-nguyễn-90a96b2a5/" target="_blank"
                className="flex items-center gap-2 text-[var(--muted)] hover:text-white transition-colors text-sm">
                <Link size={16} /> LinkedIn
              </a>
              <a href="/python-25"
                className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors text-sm">
                <Code2 size={16} /> Learning Notes
              </a>
            </div>
          </div>

          {/* Right: avatar card */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-indigo-500/30 via-purple-500/20 to-cyan-500/30 rounded-full blur-xl" />
              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-2 border-white/10 shadow-2xl">
                <img src={AVATAR} alt="Nguyen Quoc Vuong" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)]/60 to-transparent" />
              </div>
              <div className="absolute -top-4 -right-4 px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-xs font-medium shadow-xl flex items-center gap-2">
                <span className="text-yellow-400">⚡</span> FastAPI
              </div>
              <div className="absolute -bottom-4 -left-4 px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-xs font-medium shadow-xl flex items-center gap-2">
                <span className="text-pink-400">🤖</span> AI Agent
              </div>
              <div className="absolute top-1/2 -right-8 px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-xs font-medium shadow-xl flex items-center gap-2">
                <span className="text-green-400">🐍</span> Python
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[var(--muted)] animate-bounce">
          <div className="w-5 h-8 border border-[var(--border)] rounded-full flex items-start justify-center p-1">
            <div className="w-1 h-2 bg-[var(--muted)] rounded-full" />
          </div>
        </div>
      </section>

      {/* ── SKILLS ─────────────────────────────────── */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold mb-3">Tech Stack</h2>
          <p className="text-[var(--muted)]">Technologies I work with daily</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SKILLS.map(({ category, icon: Icon, color, items }) => (
            <div key={category}
              className="group p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-transparent transition-all duration-300 relative overflow-hidden">
              <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${color} bg-opacity-10`}>
                  <Icon size={18} className="text-white" />
                </div>
                <h3 className="font-semibold">{category}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {items.map(item => (
                  <span key={item}
                    className="px-3 py-1 text-sm rounded-full bg-white/5 text-[var(--muted)] border border-white/5 hover:border-indigo-500/30 hover:text-white transition-all cursor-default">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── EXPERIENCE ─────────────────────────────── */}
      <section id="experience" className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold mb-3">Experience</h2>
          <p className="text-[var(--muted)]">5+ years building products across Vietnam & Malaysia</p>
        </div>

        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500/50 via-purple-500/30 to-transparent hidden md:block" />

          <div className="space-y-6">
            {EXPERIENCE.map((exp, i) => (
              <div key={i} className="relative flex gap-8">
                {/* Timeline dot */}
                <div className="hidden md:flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full mt-6 border-2 shrink-0 ${exp.current ? 'bg-green-400 border-green-400 shadow-lg shadow-green-400/50' : 'bg-[var(--surface)] border-indigo-500'}`} />
                </div>

                <div className={`flex-1 p-6 rounded-2xl border transition-all hover:shadow-xl group ${exp.current ? 'bg-indigo-950/30 border-indigo-500/30 hover:border-indigo-400/50' : 'bg-[var(--surface)] border-[var(--border)] hover:border-indigo-500/20'}`}>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-lg">{exp.role}</h3>
                        {exp.current && (
                          <span className="px-2 py-0.5 text-xs bg-green-500/10 text-green-400 border border-green-500/20 rounded-full">Current</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-indigo-400 text-sm">
                        <span className="font-medium">{exp.company}</span>
                        <span className="text-[var(--muted)]">·</span>
                        <span className="text-[var(--muted)] flex items-center gap-1"><MapPin size={12} />{exp.location}</span>
                      </div>
                    </div>
                    <div className="text-[var(--muted)] text-sm whitespace-nowrap">{exp.period}</div>
                  </div>

                  {exp.summary && (
                    <p className="text-[var(--muted)] text-sm italic mb-3">{exp.summary}</p>
                  )}

                  <ul className="space-y-1.5 mb-4">
                    {exp.points.map((p, j) => (
                      <li key={j} className="text-[var(--muted)] text-sm flex gap-2.5">
                        <span className="text-indigo-400 shrink-0 mt-0.5">▸</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Sub-projects */}
                  {exp.projects && exp.projects.length > 0 && (
                    <div className="mt-4 mb-4">
                      <div className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-2">Projects</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {exp.projects.map((proj, k) => (
                          <div key={k} className="p-3 rounded-xl bg-white/3 border border-white/8 hover:border-indigo-500/20 transition-colors">
                            <div className="font-medium text-sm text-white/90">{proj.name}</div>
                            <div className="text-xs text-indigo-400/80 mt-0.5 font-mono">{proj.stack}</div>
                            <div className="text-xs text-[var(--muted)] mt-1 leading-relaxed">{proj.desc}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 mt-3">
                    {exp.tech.map(t => (
                      <span key={t}
                        className="px-2.5 py-0.5 text-xs rounded-md bg-[var(--bg)] text-[var(--muted)] border border-[var(--border)] group-hover:border-indigo-900/50 transition-colors">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AWARDS ─────────────────────────────────── */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold mb-3">Recognition</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { icon: "🥉", title: "3rd Prize", desc: "Software Creative Development Competition", year: "2022", color: "from-amber-500/10 to-yellow-500/5 border-amber-500/20" },
            { icon: "🌟", title: "Top 5 Students", desc: "Dalat University Excellent Students", year: "2022", color: "from-blue-500/10 to-indigo-500/5 border-blue-500/20" },
            { icon: "🎓", title: "TMA Scholarship", desc: "TMA Solutions Merit Award", year: "2022", color: "from-purple-500/10 to-violet-500/5 border-purple-500/20" },
          ].map((a, i) => (
            <div key={i} className={`p-6 rounded-2xl bg-gradient-to-br ${a.color} border text-center hover:scale-105 transition-transform duration-200`}>
              <div className="text-4xl mb-3">{a.icon}</div>
              <div className="font-bold text-lg mb-1">{a.title}</div>
              <div className="text-[var(--muted)] text-sm">{a.desc}</div>
              <div className="text-[var(--muted)] text-xs mt-2 flex items-center justify-center gap-1">
                <Award size={12} /> {a.year}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="p-10 rounded-3xl bg-gradient-to-br from-indigo-950/60 to-purple-950/40 border border-indigo-500/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5" />
            <h2 className="text-3xl font-bold mb-3 relative">Let's Work Together</h2>
            <p className="text-[var(--muted)] mb-8 relative">
              Open to new opportunities in AI engineering, full-stack development, or QA automation.
            </p>
            <a href="mailto:vu0nqnq@gmail.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-medium transition-all hover:shadow-xl hover:shadow-indigo-500/30 relative">
              <Mail size={16} /> vu0nqnq@gmail.com
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 text-center border-t border-[var(--border)]">
        <p className="text-[var(--muted)] text-sm">
          © 2026 Nguyen Quoc Vuong · Built with React + Vite + Tailwind
        </p>
      </footer>
    </div>
  )
}
