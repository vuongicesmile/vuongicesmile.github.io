export type QuestionCard = {
  id: string
  category: string
  categoryColor: string
  question: string
  answer: string
  tip: string
  keywords: string[]
  difficulty: 'easy' | 'medium' | 'hard'
}

export type InterviewCategory = {
  id: string
  title: string
  icon: string
  color: string
  description: string
}

export const CATEGORIES: InterviewCategory[] = [
  { id: 'intro', title: 'Introduction', icon: '👋', color: 'from-blue-500 to-cyan-500', description: 'Tell me about yourself, background' },
  { id: 'technical', title: 'Technical', icon: '💻', color: 'from-violet-500 to-purple-500', description: 'Python, React, AI, FastAPI' },
  { id: 'behavioral', title: 'Behavioral', icon: '🧠', color: 'from-orange-500 to-amber-500', description: 'STAR method, team work, challenges' },
  { id: 'remote', title: 'Remote Work', icon: '🌏', color: 'from-green-500 to-emerald-500', description: 'Working remotely, Malaysia/Vietnam' },
  { id: 'ai', title: 'AI & Products', icon: '🤖', color: 'from-pink-500 to-rose-500', description: 'AI products, LLMs, tools you built' },
  { id: 'culture', title: 'Culture Fit', icon: '🤝', color: 'from-teal-500 to-cyan-500', description: 'Values, growth, career goals' },
  { id: 'questions', title: 'Your Questions', icon: '❓', color: 'from-indigo-500 to-blue-500', description: 'Smart questions to ask interviewer' },
]

export const QUESTIONS: QuestionCard[] = [
  // ── INTRODUCTION ──────────────────────────────────
  {
    id: 'intro-1', category: 'intro', categoryColor: 'from-blue-500 to-cyan-500',
    difficulty: 'easy',
    question: 'Can you tell me about yourself?',
    answer: `Sure! I'm Vuong, a Full-Stack Developer with 5 years of experience. I started as a front-end developer working with React and TypeScript, then expanded into backend development with Python and FastAPI. Currently I'm an AI Product Engineer at YTL AI Labs in Malaysia, where I build AI-powered applications — things like news summarization agents, speech-to-text integration, and AI chat interfaces. I'm passionate about building products that actually solve real problems for users.`,
    tip: 'Keep it 60-90 seconds. Structure: Current role → background → key skills → why this opportunity.',
    keywords: ['AI Product Engineer', 'Full-Stack', 'React', 'Python', 'FastAPI', 'YTL AI Labs'],
  },
  {
    id: 'intro-2', category: 'intro', categoryColor: 'from-blue-500 to-cyan-500',
    difficulty: 'easy',
    question: 'Walk me through your career so far.',
    answer: `I started my career in 2021 as a front-end developer at a university IT center, building WordPress sites. Then I joined Dragon Technologies where I built enterprise systems — Property Management, Point of Sale, HR systems — using React and DevExpress for advanced reporting. After that, I moved to FrogAsia in Malaysia remotely, working on their Frog Virtual Learning Environment for Southeast Asian schools. That's where I got into AI — I built an AI-powered lesson plan generator. Then I joined YTL AI Labs where I focus entirely on AI product engineering.`,
    tip: 'Go chronologically but focus on growth and the "why" behind each move.',
    keywords: ['career progression', 'growth', 'enterprise', 'education', 'AI'],
  },
  {
    id: 'intro-3', category: 'intro', categoryColor: 'from-blue-500 to-cyan-500',
    difficulty: 'easy',
    question: 'Why are you looking for a new opportunity?',
    answer: `I'm not actively job hunting — I'm selectively exploring opportunities where I can have more impact on AI product direction. At my current role I've built a solid foundation in AI engineering, but I'm looking for a place where I can go deeper into product strategy, work on larger scale AI systems, or contribute to a product that reaches more users. When I saw this role, it stood out because [mention specific thing about company].`,
    tip: 'Always frame it positively — about growth, not running away. Research the company and reference something specific.',
    keywords: ['growth', 'impact', 'AI product', 'new challenges', 'scale'],
  },
  {
    id: 'intro-4', category: 'intro', categoryColor: 'from-blue-500 to-cyan-500',
    difficulty: 'medium',
    question: 'What are your strengths?',
    answer: `Three things stand out. First, I bridge frontend and backend well — I can own a feature end-to-end without needing to hand off between teams. Second, I'm strong at AI integration — I've shipped real products using LLMs, not just prototypes. Third, I have a product mindset. I don't just implement what's asked — I think about why we're building it and whether it's the right approach. For example, when building the lesson plan generator, I pushed back on the initial spec to simplify the UX, and it led to much better adoption.`,
    tip: 'Give 3 strengths with concrete examples. Avoid generic answers like "I am hardworking".',
    keywords: ['full-stack', 'end-to-end', 'AI integration', 'product mindset', 'initiative'],
  },
  {
    id: 'intro-5', category: 'intro', categoryColor: 'from-blue-500 to-cyan-500',
    difficulty: 'medium',
    question: 'What is your biggest weakness?',
    answer: `I tend to want to understand systems deeply before I start building — which is a strength but can slow me down early on. I've been working on this by timebox my research phase and start with a prototype first. If I spend more than two hours on a design decision, I force myself to write a quick proof of concept instead. It's helped me ship faster while still building the right thing.`,
    tip: 'Be genuine — pick a real weakness. Show awareness and what you\'re doing to improve. Avoid "I work too hard."',
    keywords: ['self-aware', 'improvement', 'timeboxing', 'prototype first'],
  },

  // ── TECHNICAL ─────────────────────────────────────
  {
    id: 'tech-1', category: 'technical', categoryColor: 'from-violet-500 to-purple-500',
    difficulty: 'medium',
    question: 'How would you explain async/await in Python to a junior developer?',
    answer: `I'd use a restaurant analogy. Imagine you're a waiter. Without async, you take an order, go to the kitchen, stand there and wait for the food, then come back. You can only serve one table at a time. With async/await, you take an order, put it in the kitchen, and while the food is being cooked, you go take another table's order. Await just means "I'll pause here and let others run until this finishes." In code terms, async def makes a coroutine, await suspends it to let the event loop run other things — typically I/O like database queries or API calls.`,
    tip: 'Use analogies for concept questions. Then show you can go deeper with code if needed.',
    keywords: ['async', 'await', 'event loop', 'coroutine', 'I/O bound'],
  },
  {
    id: 'tech-2', category: 'technical', categoryColor: 'from-violet-500 to-purple-500',
    difficulty: 'medium',
    question: 'What is the difference between REST and GraphQL? When would you choose one over the other?',
    answer: `REST has fixed endpoints — GET /users/123 always returns a user object. GraphQL has one endpoint and you specify exactly what fields you want. I'd choose REST for simple CRUD APIs, public APIs where caching matters, or when the team is familiar with it. I'd choose GraphQL when the frontend needs flexible data shapes — like a dashboard that shows different fields on mobile vs desktop — or when you have many nested relationships and REST would require multiple round trips. In most of my projects I've used REST with FastAPI since it's simpler and the Pydantic schemas serve as documentation.`,
    tip: 'Show you know both and can make pragmatic decisions, not just "X is better."',
    keywords: ['REST', 'GraphQL', 'endpoints', 'flexible queries', 'tradeoffs'],
  },
  {
    id: 'tech-3', category: 'technical', categoryColor: 'from-violet-500 to-purple-500',
    difficulty: 'hard',
    question: 'How do you handle state management in large React applications?',
    answer: `I use different tools for different types of state. Server state — data from APIs — I manage with TanStack Query because it handles caching, background refetching, and loading states automatically. Client state — UI state like modals, filters, selected items — I use Zustand because it's minimal and doesn't require boilerplate. I avoid putting server data in Zustand since that causes sync issues. For form state, react-hook-form. The key principle is: don't over-centralize. Most state should live as close to where it's used as possible. I only "lift" state when multiple unrelated components need it.`,
    tip: 'Mention specific libraries and the reasoning behind choosing them. Show you think in patterns.',
    keywords: ['TanStack Query', 'Zustand', 'server state', 'client state', 'separation of concerns'],
  },
  {
    id: 'tech-4', category: 'technical', categoryColor: 'from-violet-500 to-purple-500',
    difficulty: 'medium',
    question: 'How do you approach debugging a performance issue in production?',
    answer: `I follow a systematic process. First, I reproduce and measure — get actual numbers, not guesses. I check Datadog or logs to find where the slowness is. Is it the database, an external API, or the application code? Once I know the layer, I dig deeper. For database issues I look at query execution plans and check for N+1 patterns. For application code I'd profile with py-spy or use Langfuse traces to see where time is spent. I never optimize before I've profiled — I've seen engineers spend days optimizing code that wasn't the bottleneck.`,
    tip: '"Profile before optimizing" is the key phrase interviewers love. Show systematic thinking.',
    keywords: ['profiling', 'Datadog', 'N+1 queries', 'systematic', 'measure first'],
  },
  {
    id: 'tech-5', category: 'technical', categoryColor: 'from-violet-500 to-purple-500',
    difficulty: 'hard',
    question: 'How do you ensure code quality in a team environment?',
    answer: `A few layers. First, automated gates — pre-commit hooks that run formatters and type checkers so bad code can't even be committed. CI runs tests and requires 80% coverage. Second, code review culture — PRs have a template, reviewers focus on correctness and security first, not style. We use GitHub suggestions to make small edits frictionless. Third, shared conventions in CLAUDE.md or team docs — so Claude and humans are aligned on patterns. The goal is to catch issues automatically where possible, so code review can focus on architecture and logic rather than tabs vs spaces.`,
    tip: 'Mention automation + process + culture. Shows engineering maturity.',
    keywords: ['pre-commit', 'CI/CD', 'code review', 'conventions', 'automation', 'CLAUDE.md'],
  },

  // ── BEHAVIORAL ────────────────────────────────────
  {
    id: 'beh-1', category: 'behavioral', categoryColor: 'from-orange-500 to-amber-500',
    difficulty: 'medium',
    question: 'Tell me about a time you had to deal with a difficult technical challenge.',
    answer: `At FrogAsia, we had a streaming SSE connection that would silently disconnect when users refreshed mid-response, causing them to lose the AI output. The challenge was that refreshing kills the browser's connection but the server didn't know this. I designed a resume system: when the server detects a disconnect, a background task continues consuming the stream and buffers chunks in memory. When the client reconnects, it sends a resume flag — the server checks if there's an active stream and sends only the new chunks. If not, it tells the client to fetch from the database. This reduced lost-response incidents to nearly zero and improved user trust significantly.`,
    tip: 'Use STAR: Situation, Task, Action, Result. Be specific about what YOU did.',
    keywords: ['SSE', 'stream resume', 'disconnect recovery', 'background task', 'user trust'],
  },
  {
    id: 'beh-2', category: 'behavioral', categoryColor: 'from-orange-500 to-amber-500',
    difficulty: 'medium',
    question: 'Describe a time you disagreed with a decision and how you handled it.',
    answer: `When building the AI lesson plan generator at FrogAsia, the initial spec called for a complex multi-step form with 8 fields. I felt this would create too much friction and teachers wouldn't use it. Instead of just complaining, I built a quick prototype of a simpler version with just 3 required fields and showed how it could generate the same output. I presented both options to the team with data on teacher behavior from similar tools. The team chose the simpler version. It had 3x better adoption than we projected for the complex version. The lesson for me was: disagreement without a concrete alternative isn't helpful — bring data or a prototype.`,
    tip: 'Show you can disagree professionally, back it with data, and accept the outcome gracefully.',
    keywords: ['prototype', 'data-driven', 'adoption', 'constructive disagreement', 'initiative'],
  },
  {
    id: 'beh-3', category: 'behavioral', categoryColor: 'from-orange-500 to-amber-500',
    difficulty: 'easy',
    question: 'How do you prioritize when you have multiple deadlines?',
    answer: `I use a simple framework: urgency versus impact. First I list everything out — it's impossible to prioritize in your head. Then I ask: what breaks if it's not done today? That's urgent. What moves the most important metric? That's high impact. I tackle urgent+high impact first, then high impact but flexible timeline, then urgent but low impact. I also communicate proactively — if I realize something will be late, I tell the stakeholders early with a revised estimate, not the day it's due. Surprises are worse than bad news delivered early.`,
    tip: '"Communicate proactively" is the answer they really want. Show you manage up, not just down.',
    keywords: ['prioritization', 'urgency vs impact', 'communication', 'proactive', 'stakeholders'],
  },
  {
    id: 'beh-4', category: 'behavioral', categoryColor: 'from-orange-500 to-amber-500',
    difficulty: 'medium',
    question: 'Tell me about a project you are most proud of.',
    answer: `The AI-powered lesson plan generator at FrogAsia. Teachers in Malaysia spend hours creating lesson plans aligned to the national curriculum. I built a tool where teachers input a topic and grade level, and it generates a structured lesson plan with objectives, activities, and assessments — all aligned to KSSR standards. What I'm proud of: it's not just a wrapper around GPT. I built a retrieval system that grounds the output in actual curriculum documents, so it generates relevant content. Teachers in 50+ schools use it weekly. Hearing from a teacher that it saved her 2 hours of preparation a week — that's why I'm in this field.`,
    tip: 'Pick something with real user impact. Numbers matter. Explain the technical depth briefly.',
    keywords: ['lesson plan', 'curriculum', 'RAG', 'teacher impact', 'user adoption'],
  },

  // ── REMOTE WORK ───────────────────────────────────
  {
    id: 'remote-1', category: 'remote', categoryColor: 'from-green-500 to-emerald-500',
    difficulty: 'easy',
    question: 'How do you stay productive working remotely?',
    answer: `I've worked remotely for over 2 years, so I have a solid system. I keep fixed working hours and a dedicated workspace — no working from the couch. I start each day by writing 3 things I need to accomplish. I use async communication by default — I document things in Confluence or Notion so my teammates in different timezones don't need to wait for me to be online. I do focused deep work blocks in the morning when my energy is highest, and handle meetings and async replies in the afternoon. I also over-communicate progress — I'd rather give a quick update that wasn't needed than leave someone wondering.`,
    tip: 'Show you have a system. Mention async communication — this is key for remote teams.',
    keywords: ['async', 'fixed hours', 'over-communicate', 'deep work', 'documentation'],
  },
  {
    id: 'remote-2', category: 'remote', categoryColor: 'from-green-500 to-emerald-500',
    difficulty: 'easy',
    question: 'How do you collaborate with a distributed team across timezones?',
    answer: `I lean heavily on async communication. I write clear, self-contained messages so people don't need to ask follow-up questions. For technical decisions, I document the context, options, and my recommendation — so teammates in other timezones can review and respond without needing a meeting. When I do need to sync, I prepare an agenda and record the meeting for teammates who can't attend. I've worked with teams in Malaysia, and I'm in Da Lat, Vietnam — 1 hour difference, so it's manageable, but the habits still help when working with people in Europe or US.`,
    tip: 'Show empathy for teammates in different timezones. Mention documentation culture.',
    keywords: ['async', 'self-contained messages', 'documentation', 'meeting recording', 'timezone'],
  },

  // ── AI & PRODUCTS ─────────────────────────────────
  {
    id: 'ai-1', category: 'ai', categoryColor: 'from-pink-500 to-rose-500',
    difficulty: 'medium',
    question: 'How do you evaluate whether an AI feature is working well in production?',
    answer: `I look at both technical metrics and user behavior metrics. On the technical side: latency percentiles, error rates, how often the AI refuses to answer or gives a safety block. On the user side: do users actually use the feature? Do they complete the flow or abandon mid-way? Do they edit the AI output heavily — that's a signal it's not useful. I also set up qualitative feedback mechanisms — thumbs up/down, or occasional user interviews. For LLMs specifically I use tracing tools like Langfuse to see the full context of each call and identify where the model goes wrong.`,
    tip: 'Combine quantitative + qualitative. Mentioning specific tools like Langfuse shows hands-on experience.',
    keywords: ['latency', 'user behavior', 'abandonment rate', 'Langfuse', 'qualitative feedback'],
  },
  {
    id: 'ai-2', category: 'ai', categoryColor: 'from-pink-500 to-rose-500',
    difficulty: 'hard',
    question: 'What is RAG and when would you use it?',
    answer: `RAG stands for Retrieval-Augmented Generation. Instead of relying only on what the LLM knows from training, you retrieve relevant documents at query time and include them in the context. Use it when you need the AI to answer questions about specific, up-to-date, or private data that wasn't in the training data — like company documentation, product specs, or a knowledge base. The key components are: a retrieval system (usually vector search with embeddings) that finds relevant chunks, and a generation step where the LLM synthesizes an answer from those chunks. I used this approach in the lesson plan generator to ground responses in actual curriculum documents.`,
    tip: 'Explain it simply, then give a real use case. Shows you\'ve actually implemented it, not just read about it.',
    keywords: ['RAG', 'embeddings', 'vector search', 'retrieval', 'grounding', 'private data'],
  },
  {
    id: 'ai-3', category: 'ai', categoryColor: 'from-pink-500 to-rose-500',
    difficulty: 'medium',
    question: 'How do you handle hallucinations in LLM outputs?',
    answer: `A few strategies. First, constrain the output space — give the model a template to fill in rather than free text generation. Second, use RAG to ground answers in actual documents — include the source and tell the model to only answer from it. Third, add a verification step — for critical information, cross-check with a database or have a second model validate the output. Fourth, design the UX to set expectations — show sources, add uncertainty indicators, make it easy for users to report errors. In practice I've found that well-designed prompts with clear constraints reduce hallucinations more than any technical trick.`,
    tip: 'Show you think in layers: prompt engineering → architecture → UX. Not just "add a system prompt."',
    keywords: ['hallucination', 'RAG', 'grounding', 'verification', 'prompt constraints', 'UX'],
  },

  // ── CULTURE FIT ───────────────────────────────────
  {
    id: 'culture-1', category: 'culture', categoryColor: 'from-teal-500 to-cyan-500',
    difficulty: 'easy',
    question: 'Where do you see yourself in 3-5 years?',
    answer: `In 3-5 years I want to be a senior technical leader on an AI product — someone who shapes not just the code but the product direction. I want to have shipped AI features that millions of users interact with daily. I'm also interested in growing in system design — understanding how to build AI systems that are reliable at scale, not just impressive demos. I see myself becoming the kind of engineer who can take a fuzzy product idea, break it down technically, and lead a small team to execute on it.`,
    tip: 'Show ambition but tie it back to the company\'s trajectory. Avoid "I want to start my own company."',
    keywords: ['technical leadership', 'AI product', 'system design', 'scale', 'mentorship'],
  },
  {
    id: 'culture-2', category: 'culture', categoryColor: 'from-teal-500 to-cyan-500',
    difficulty: 'easy',
    question: 'How do you keep your technical skills up to date?',
    answer: `I have a few habits. I follow specific people on Twitter and read their writing — ML engineers and product builders, not just language hype. I build small experiments when something interests me — not just read about it. Right now I'm going through a structured Python review and practicing Claude Code workflows. I also read post-mortems and architecture writeups from companies like Stripe, Cloudflare, and Uber — real problems at scale teach more than tutorials. And I try to apply what I learn in my actual work within a week — otherwise it fades.`,
    tip: 'Mention specific sources or what you\'re learning now. Vague answers like "read blogs" don\'t stand out.',
    keywords: ['experiments', 'apply immediately', 'post-mortems', 'system design', 'structured learning'],
  },

  // ── YOUR QUESTIONS ─────────────────────────────────
  {
    id: 'q-1', category: 'questions', categoryColor: 'from-indigo-500 to-blue-500',
    difficulty: 'easy',
    question: 'What does a typical day look like for someone in this role?',
    answer: `Why this is a good question: It reveals team structure, balance between meetings and coding, and expectations. Listen for: how much product input engineers have, how autonomous vs directed the work is, how much time is spent on maintenance vs new features.`,
    tip: 'Good follow-up: "What would the first 30-60-90 days look like?"',
    keywords: ['day in life', 'team structure', 'autonomy', 'product input'],
  },
  {
    id: 'q-2', category: 'questions', categoryColor: 'from-indigo-500 to-blue-500',
    difficulty: 'easy',
    question: 'What are the biggest technical challenges the team is facing right now?',
    answer: `Why this is a great question: It shows you think about problems, not just features. It also tells you what you'd be working on. Listen for: are they scaling challenges? AI reliability issues? Technical debt? This helps you tailor your pitch to their actual pain.`,
    tip: 'Follow up with "How is the team approaching it?" to show curiosity.',
    keywords: ['technical challenges', 'pain points', 'growth', 'scale'],
  },
  {
    id: 'q-3', category: 'questions', categoryColor: 'from-indigo-500 to-blue-500',
    difficulty: 'medium',
    question: 'How does the team balance shipping quickly vs maintaining quality?',
    answer: `Why this is smart: It reveals engineering culture and if you'll be fighting to do good work. Red flags: "we move fast and break things" with no follow-up about paying technical debt. Green flags: "we have strong CI/CD, code review culture, and we invest in test coverage because it actually speeds us up long-term."`,
    tip: 'This question reveals if you\'ll be writing throwaway code or building something maintainable.',
    keywords: ['engineering culture', 'quality', 'technical debt', 'shipping speed'],
  },
]
