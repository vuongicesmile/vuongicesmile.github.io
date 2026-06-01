import { GitBranch, Link, Mail, ExternalLink, Code2, Server, Database, Wrench } from 'lucide-react'

const EXPERIENCE = [
  {
    period: "Jun 2025 — Present", role: "AI Product Engineer", company: "YTL AI Labs", location: "Malaysia (Remote)",
    points: ["Built AI agent apps (news summarization, topic tracking) with FastAPI", "Integrated STT/TTS and streaming capabilities", "Implemented OpenWebUI integration for model showcase"],
    tech: ["Python", "FastAPI", "TypeScript", "AWS", "Datadog"]
  },
  {
    period: "Mar 2023 — Jun 2025", role: "Senior Software Engineer", company: "FrogAsia", location: "Malaysia (Remote)",
    points: ["Built AI-powered lesson plan generator", "Developed N8N automation workflows for QA pipeline", "Optimized performance across web and mobile platforms"],
    tech: ["PHP", "Laravel", "React.js", "Material UI", "Selenium", "N8N"]
  },
  {
    period: "Jun 2023 — Feb 2024", role: "Full-Stack Developer", company: "Titan Technologies", location: "Da Lat, Vietnam",
    points: ["Built UI for Deloitte audit management platform", "Implemented engagement management and change tracking"],
    tech: ["React.js", "Redux", "Semantic UI", "Azure"]
  },
  {
    period: "Apr 2022 — Jun 2023", role: "Front-End Developer", company: "Dragon Technologies", location: "Vietnam",
    points: ["Built PMS, POS, HRM systems", "Advanced reporting with DevExpress + custom SQL", "Trained end-users across Vietnam"],
    tech: ["React.js", "TypeScript", "UmiJS", "DevExpress", "Ant Design"]
  },
]

const SKILLS = [
  { category: "Frontend", icon: Code2, items: ["React.js", "TypeScript", "JavaScript", "HTML5", "SCSS", "Material UI"] },
  { category: "Backend", icon: Server, items: ["Python", "FastAPI", "PHP", "Laravel", "Node.js", "REST APIs"] },
  { category: "Data & Tools", icon: Database, items: ["MySQL", "MSSQL", "Redis", "DevExpress", "N8N", "Selenium"] },
  { category: "DevOps", icon: Wrench, items: ["Git", "Docker", "AWS", "Datadog", "CI/CD", "GitHub Actions"] },
]

export default function Portfolio() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="min-h-screen flex flex-col justify-center px-6 max-w-5xl mx-auto">
        <div className="mb-4 text-[var(--accent-light)] font-mono text-sm">Hello, I'm</div>
        <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-white to-indigo-400 bg-clip-text text-transparent">
          Nguyen Quoc Vuong
        </h1>
        <p className="text-xl md:text-2xl text-[var(--muted)] mb-6">
          AI Product Engineer · Full-Stack Developer · React & Python Specialist
        </p>
        <p className="text-[var(--muted)] max-w-2xl mb-8 leading-relaxed">
          5 years building scalable web applications for education platforms, HR systems, and AI products.
          Currently at <span className="text-white">YTL AI Labs</span> developing AI-powered products for the Malaysian market.
        </p>
        <div className="flex gap-4 flex-wrap">
          <a href="#experience" className="px-6 py-3 bg-[var(--accent)] rounded-lg font-medium hover:bg-indigo-500 transition-colors">
            View Experience
          </a>
          <a href="mailto:vuong.quoc@ytlailabs.com" className="px-6 py-3 border border-[var(--border)] rounded-lg font-medium hover:border-indigo-500 transition-colors flex items-center gap-2">
            <Mail size={16} /> Contact Me
          </a>
        </div>
        <div className="flex gap-4 mt-8">
          <a href="https://github.com/vuongicesmile" target="_blank" className="text-[var(--muted)] hover:text-white transition-colors">
            <GitBranch size={24} />
          </a>
          <a href="https://www.linkedin.com/in/vương-nguyễn-90a96b2a5/" target="_blank" className="text-[var(--muted)] hover:text-white transition-colors">
            <Link size={24} />
          </a>
          <a href="https://github.com/vuongicesmile/25-day-python" target="_blank" className="text-[var(--muted)] hover:text-white transition-colors">
            <ExternalLink size={24} />
          </a>
        </div>
      </section>

      {/* Skills */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-12">Tech Stack</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SKILLS.map(({ category, icon: Icon, items }) => (
            <div key={category} className="p-6 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
              <div className="flex items-center gap-3 mb-4">
                <Icon size={20} className="text-[var(--accent-light)]" />
                <h3 className="font-semibold">{category}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {items.map(item => (
                  <span key={item} className="px-3 py-1 text-sm rounded-full bg-indigo-900/30 text-indigo-300 border border-indigo-800/50">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Experience */}
      <section id="experience" className="py-20 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-12">Experience</h2>
        <div className="space-y-8">
          {EXPERIENCE.map((exp, i) => (
            <div key={i} className="p-6 rounded-xl bg-[var(--surface)] border border-[var(--border)] hover:border-indigo-800 transition-colors">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                <div>
                  <h3 className="font-bold text-lg">{exp.role}</h3>
                  <div className="text-[var(--accent-light)]">{exp.company} · {exp.location}</div>
                </div>
                <div className="text-[var(--muted)] text-sm mt-1 md:mt-0">{exp.period}</div>
              </div>
              <ul className="space-y-1 mb-4">
                {exp.points.map((p, j) => (
                  <li key={j} className="text-[var(--muted)] text-sm flex gap-2">
                    <span className="text-indigo-400 mt-1">▸</span> {p}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2">
                {exp.tech.map(t => (
                  <span key={t} className="px-2 py-0.5 text-xs rounded bg-[var(--bg)] text-[var(--muted)] border border-[var(--border)]">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Awards */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">Awards</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: "🥉", title: "3rd Prize", desc: "Software Creative Development Competition (2022)" },
            { icon: "🌟", title: "Top 5 Students", desc: "Dalat University Excellent Students (2022)" },
            { icon: "🎓", title: "TMA Scholarship", desc: "TMA Solutions Scholarship Award" },
          ].map((a, i) => (
            <div key={i} className="p-5 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-center">
              <div className="text-3xl mb-2">{a.icon}</div>
              <div className="font-semibold">{a.title}</div>
              <div className="text-[var(--muted)] text-sm mt-1">{a.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 text-center text-[var(--muted)] border-t border-[var(--border)]">
        <p>Built with React + Vite + Tailwind · Deployed on GitHub Pages</p>
        <p className="mt-2 text-sm">© 2026 Nguyen Quoc Vuong</p>
      </footer>
    </div>
  )
}
