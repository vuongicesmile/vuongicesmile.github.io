export type ClaudeLesson = {
  id: string; module: number; moduleTitle: string; moduleColor: string;
  title: string; tags: string[]; keyTakeaway: string; readTime: number; content: string;
}

export const CLAUDE_CURRICULUM: ClaudeLesson[] = [
  {
    id: "cli-basics",
    module: 1,
    moduleTitle: "CLI & Commands",
    moduleColor: "from-green-500 to-emerald-500",
    title: "Claude CLI \u2014 Kh\u1edfi \u0111\u1ed9ng v\u00e0 Flags",
    tags: ["cli", "terminal", "flags"],
    keyTakeaway: "git diff | claude l\u00e0 combo m\u1ea1nh nh\u1ea5t \u0111\u1ec3 d\u00f9ng h\u00e0ng ng\u00e0y",
    readTime: 2,
    content: `# Module 01 — CLI Commands & Keyboard Shortcuts

## 🖥 Khởi động Claude Code

\`\`\`bash
# Cơ bản
claude                          # start interactive session
claude "explain this code"      # one-shot query
claude -p "your prompt"         # pipe mode

# Model selection
claude --model claude-opus-4-7      # Opus — deepest reasoning
claude --model claude-sonnet-4-6    # Sonnet — best coding (default)
claude --model claude-haiku-4-5     # Haiku — fast, lightweight

# File input
claude < input.txt              # pipe file content
cat error.log | claude "fix this"
\`\`\`

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| \`Ctrl+C\` | Cancel current response |
| \`Ctrl+L\` | Clear screen |
| \`Ctrl+R\` | Search history |
| \`↑ / ↓\` | Navigate history |
| \`Tab\` | Autocomplete |
| \`Shift+Enter\` | New line (multi-line input) |
| \`Alt+T\` | Toggle extended thinking |
| \`Ctrl+O\` | Toggle verbose/thinking output |

## 🔧 Session Flags

\`\`\`bash
claude --no-auto-updates        # tắt auto update
claude --verbose                # hiện chi tiết tool calls
claude --debug                  # debug mode
claude --dangerously-skip-permissions  # ⚠️ skip confirmations
\`\`\`

## 📁 Working with Files

\`\`\`bash
# Claude đọc files trong context
claude "review @src/app.py"    # @ syntax để reference file

# Nhiều files
claude "compare @old.py and @new.py"

# Cả folder
claude "what does @src/ do"
\`\`\`

## 🔗 Chaining Commands

\`\`\`bash
# Pipeline với Unix tools
git diff | claude "summarize these changes"
cat requirements.txt | claude "any security issues?"
ls -la | claude "what's taking the most space?"

# Save output
claude "generate unit tests for @auth.py" > tests/test_auth.py
\`\`\`

## 💡 Pro Tips

\`\`\`bash
# Non-interactive mode (CI/CD)
claude -p "fix lint errors" --no-interactive

# Specify working directory
claude --dir /path/to/project "add type hints"

# Continue last session
claude --continue

# With custom system prompt
claude --system "You are a security expert"
\`\`\`
`,
  },
  {
    id: "cli-exercises",
    module: 1,
    moduleTitle: "CLI & Commands",
    moduleColor: "from-green-500 to-emerald-500",
    title: "CLI Exercises \u2014 Pipeline v\u00e0 Chaining",
    tags: ["cli", "pipeline", "practice"],
    keyTakeaway: "claude ... > output.py \u2014 generate thang ra file",
    readTime: 1,
    content: `# Exercises — CLI Commands

## Exercise 1: First Commands
Thử các lệnh này trong terminal:
\`\`\`bash
claude --version
claude "hello, what can you do in 3 bullet points?"
echo "print('hello world')" | claude "explain this Python"
\`\`\`

## Exercise 2: File Analysis
\`\`\`bash
# Tạo 1 file Python có bug
cat > /tmp/buggy.py << 'PYEOF'
def divide(a, b):
    return a / b

result = divide(10, 0)
print(result)
PYEOF

# Nhờ Claude fix
claude "find and fix the bug in @/tmp/buggy.py"
\`\`\`

## Exercise 3: Git Integration
\`\`\`bash
# Trong một repo git
git log --oneline -5 | claude "write a release notes from these commits"
git diff HEAD~1 | claude "review this change, any issues?"
\`\`\`

## Exercise 4: Chain Pipeline
\`\`\`bash
# Generate code và save thẳng
claude "write a Python function to validate email address, just the code" > /tmp/email_validator.py
cat /tmp/email_validator.py
\`\`\`

## Challenge: Build a Mini Script
Dùng Claude CLI để:
1. Generate một Python script đọc CSV và tính statistics
2. Save vào file
3. Nhờ Claude thêm error handling
4. Nhờ Claude viết unit tests
`,
  },
  {
    id: "coworking-patterns",
    module: 2,
    moduleTitle: "Coworking Patterns",
    moduleColor: "from-blue-500 to-cyan-500",
    title: "CRAFT Framework \u2014 Viet Prompt Hieu Qua",
    tags: ["prompting", "coworking", "framework"],
    keyTakeaway: "Context + Role + Action + Format + Target = prompt hoan hao",
    readTime: 3,
    content: `# Module 02 — Coworking Patterns

> Làm việc hiệu quả với Claude = biết cách **frame vấn đề** + **delegate đúng cách** + **verify kết quả**

## 🧠 Mental Model: Claude là Senior Dev

Đừng dùng Claude như Google Search — dùng như **pair programmer senior**:

\`\`\`
❌ "fix my code"
✅ "This function should return sorted users by score,
    but it's returning them unsorted. Here's the code: [...]
    What's wrong and how to fix it?"

❌ "add authentication"
✅ "I need to add JWT auth to this FastAPI app.
    Current setup: [context]. Requirements: [specs].
    Existing patterns in codebase: [example].
    Generate the auth middleware following the same patterns."
\`\`\`

## 📋 The CRAFT Framework

| Letter | Meaning | Example |
|--------|---------|---------|
| **C** | Context | "This is a FastAPI app with PostgreSQL..." |
| **R** | Role | "Act as a security-focused backend engineer" |
| **A** | Action | "Review this auth code for vulnerabilities" |
| **F** | Format | "Return findings as bullet points by severity" |
| **T** | Target | "Focus on SQL injection and auth bypass" |

## 🎯 Pattern 1: Context Priming

Bắt đầu session bằng context dump:

\`\`\`
"Let me give you context before we start:
- Project: E-commerce API in Python/FastAPI
- Database: PostgreSQL with SQLAlchemy
- Auth: JWT tokens, 15min access / 7day refresh
- Patterns: Repository pattern, dependency injection
- Current issue: [describe]"
\`\`\`

## 🔄 Pattern 2: Incremental Refinement

\`\`\`
Step 1: "Generate a basic version of X"
Step 2: "Now add error handling"
Step 3: "Add logging following our pattern: [example]"
Step 4: "Write tests for edge cases"
Step 5: "Review for security issues"
\`\`\`

Đừng yêu cầu tất cả cùng lúc → output quality giảm.

## 🧩 Pattern 3: Role Assignment

\`\`\`bash
# Security review
"Act as a senior security engineer. Review this auth code
for OWASP Top 10 vulnerabilities. Be skeptical."

# Performance optimization
"Act as a performance engineer. Profile this function
mentally and suggest optimizations. Show Big O analysis."

# Code review
"Act as a strict code reviewer at Google.
Review this PR with high standards."
\`\`\`

## 📸 Pattern 4: Show Don't Tell

\`\`\`
❌ "Add error handling like we do elsewhere"
✅ "Add error handling following this pattern we use:
   \`\`\`python
   try:
       result = await service.get_user(id)
   except UserNotFoundError:
       raise HTTPException(status_code=404, detail={'error': {'code': 'user.not_found'}})
   except DatabaseError as e:
       logger.error('db.error', extra={'error': str(e)})
       raise HTTPException(status_code=500)
   \`\`\`"
\`\`\`

## ✅ Pattern 5: Verification Loop

\`\`\`
1. Claude generates code
2. You: "Walk me through what this does step by step"
3. You: "What edge cases does this NOT handle?"
4. You: "What would break this in production?"
5. You: "Write a test that would catch regressions"
\`\`\`

## 🚫 Anti-Patterns

| Anti-Pattern | Problem | Fix |
|---|---|---|
| "Fix all bugs" | Too vague | Specify which bug, what behavior expected |
| Giant code dumps | Claude loses focus | Break into smaller chunks |
| No context | Generic solutions | Always provide stack/pattern context |
| Accept first output | Missing edge cases | Always ask "what could go wrong?" |
| Skip verification | Silent regressions | Run tests, ask Claude to self-review |

## 🏋️ Advanced: Multi-Turn Strategy

\`\`\`
Turn 1: "Understand the codebase" — explore
Turn 2: "Plan the implementation" — design  
Turn 3: "Implement step by step" — build
Turn 4: "Review and improve" — refine
Turn 5: "Write tests" — verify
Turn 6: "Document the change" — ship
\`\`\`
`,
  },
  {
    id: "coworking-cheatsheet",
    module: 2,
    moduleTitle: "Coworking Patterns",
    moduleColor: "from-blue-500 to-cyan-500",
    title: "Prompt Templates \u2014 Cheat Sheet",
    tags: ["prompting", "templates", "cheatsheet"],
    keyTakeaway: "Copy paste template vao prompt, dien vao \u2014 khong can nghi nhieu",
    readTime: 1,
    content: `# Coworking Cheat Sheet

## Prompt Templates

### Bug Fix
\`\`\`
Bug: [describe unexpected behavior]
Expected: [what should happen]
Actual: [what happens]
Code: [relevant snippet]
Already tried: [what you've attempted]
\`\`\`

### Code Review Request
\`\`\`
Review this [language] code for:
1. Correctness (logic bugs)
2. Security (OWASP Top 10)
3. Performance (Big O, N+1)
4. Maintainability (naming, structure)

Context: [what it does, how it's called]
Code: [snippet]
\`\`\`

### Feature Implementation
\`\`\`
Feature: [what to build]
Stack: [tech stack]
Constraints: [performance, security, backwards compat]
Existing pattern: [show example from codebase]
Tests needed: [yes/no, what kind]
\`\`\`

### Debugging Session
\`\`\`
I'm debugging [issue].
Environment: [OS, versions, config]
Error: [full error message + stack trace]
Reproduction: [steps to reproduce]
What I've tried: [attempted solutions]
Hypothesis: [my current theory]
\`\`\`

### Architecture Decision
\`\`\`
Decision: [what to decide]
Options I'm considering:
  A) [option with tradeoffs]
  B) [option with tradeoffs]
  
Context: [scale, team size, timeline]
Constraints: [budget, existing tech, skills]
Recommendation: [your leaning and why]
\`\`\`
`,
  },
  {
    id: "slash-commands",
    module: 3,
    moduleTitle: "Slash Commands",
    moduleColor: "from-violet-500 to-purple-500",
    title: "Slash Commands va Custom Commands",
    tags: ["commands", "slash", "custom"],
    keyTakeaway: "/init tao CLAUDE.md, custom commands trong .claude/commands/",
    readTime: 3,
    content: `# Module 03 — Slash Commands & Custom Commands

## Built-in Slash Commands

\`\`\`bash
/help           # show all commands
/clear          # clear conversation
/compact        # compact conversation (save context)
/config         # open settings
/cost           # show token usage
/doctor         # diagnose setup
/exit           # exit Claude Code
/init           # create CLAUDE.md for project
/login          # login to Claude
/logout         # logout
/memory         # view/edit memory
/model          # switch model
/pr-comments    # show PR comments
/review         # code review current diff
/terminal-setup # setup terminal integration
/vim            # toggle vim mode
\`\`\`

## /init — Project Setup

\`\`\`bash
# Trong project folder
cd my-project
claude /init
\`\`\`

Tạo \`CLAUDE.md\` — file hướng dẫn Claude về project của bạn:

\`\`\`markdown
# My Project — CLAUDE.md

## Stack
- Python 3.12, FastAPI, PostgreSQL
- React 19, TypeScript, Tailwind

## Conventions
- snake_case for Python, camelCase for JS
- Always add type hints
- Use httpx, never requests

## Testing
- pytest for backend, vitest for frontend
- 80% coverage minimum

## What NOT to do
- No print() — use logger
- No raw SQL — use SQLAlchemy ORM
\`\`\`

## /review — Code Review

\`\`\`bash
# Review staged changes
git add .
claude /review

# Review với custom focus
claude /review --focus security
claude /review --effort high
\`\`\`

## /memory — Persistent Memory

\`\`\`bash
# View current memory
claude /memory

# Claude tự lưu memory về bạn và project
# Memory persist qua sessions
\`\`\`

## 🔨 Custom Slash Commands

Tạo file trong \`.claude/commands/\`:

\`\`\`bash
mkdir -p .claude/commands
\`\`\`

### Example: \`/test-gen\`

\`\`\`markdown
<!-- .claude/commands/test-gen.md -->
Generate comprehensive unit tests for the selected code.

Requirements:
- Use pytest for Python, vitest for TypeScript
- Test happy path, edge cases, error cases
- Mock external dependencies
- Add docstrings explaining what each test verifies
- Aim for 100% branch coverage of the provided code
\`\`\`

Dùng:
\`\`\`bash
claude /test-gen  # Claude generates tests for selected/recent code
\`\`\`

### Example: \`/security-scan\`

\`\`\`markdown
<!-- .claude/commands/security-scan.md -->
Perform a security audit of the provided code.

Check for:
1. OWASP Top 10 vulnerabilities
2. Hardcoded secrets or credentials
3. SQL injection / NoSQL injection
4. XSS vulnerabilities
5. Insecure deserialization
6. Authentication/authorization bypasses

Return findings as: CRITICAL / HIGH / MEDIUM / LOW
For each finding: location, description, fix recommendation
\`\`\`

### Example: \`/commit-msg\`

\`\`\`markdown
<!-- .claude/commands/commit-msg.md -->
Generate a conventional commit message for the current git diff.

Format: type(scope): description
Types: feat, fix, refactor, docs, test, chore, perf, ci

Rules:
- Under 72 characters
- Present tense, imperative mood
- Focus on WHY not WHAT
- Include breaking changes if any

Output ONLY the commit message, nothing else.
\`\`\`

Dùng:
\`\`\`bash
git diff --staged | claude /commit-msg
\`\`\`

### Example: \`/explain-like-5\`

\`\`\`markdown
<!-- .claude/commands/explain-like-5.md -->
Explain the selected code as if the reader is:
- Experienced in programming but new to this specific pattern/technology
- Wants to understand WHAT it does, WHY it was written this way, and HOW it works
- Appreciates analogies to simpler, more familiar concepts

Format:
## What it does (1-2 sentences)
## Why this approach (design decision)
## How it works (step by step)
## Gotchas (what could go wrong)
\`\`\`

## Global vs Project Commands

\`\`\`
~/.claude/commands/     ← available in ALL projects
.claude/commands/       ← only in THIS project
\`\`\`
`,
  },
  {
    id: "mcp-intro",
    module: 4,
    moduleTitle: "MCP Plugins",
    moduleColor: "from-orange-500 to-amber-500",
    title: "MCP Architecture va Setup",
    tags: ["mcp", "plugins", "tools"],
    keyTakeaway: "MCP = USB ports cho Claude \u2014 cam GitHub/DB/Browser vao la dung duoc",
    readTime: 3,
    content: `# Module 04 — MCP Plugins (Model Context Protocol)

> MCP = cách extend Claude với external tools, data sources, APIs
> Giống như "USB ports" cho Claude — cắm tool nào vào là Claude dùng được tool đó

## 🔌 MCP Architecture

\`\`\`
Claude Code
    ↕ MCP Protocol
MCP Servers (tools)
    ↕
External Services (GitHub, DB, Slack, Browser...)
\`\`\`

## ⚙️ Cấu hình MCP

Trong \`~/.claude/settings.json\` hoặc \`.claude/settings.json\`:

\`\`\`json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "your-token"
      }
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "POSTGRES_CONNECTION_STRING": "postgresql://..."
      }
    },
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/dir"]
    },
    "brave-search": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-brave-search"],
      "env": {
        "BRAVE_API_KEY": "your-key"
      }
    }
  }
}
\`\`\`

## 🛠 Popular MCP Servers

### Official (Anthropic)
\`\`\`bash
@modelcontextprotocol/server-github      # GitHub repos, PRs, issues
@modelcontextprotocol/server-postgres    # Query PostgreSQL
@modelcontextprotocol/server-sqlite      # Query SQLite
@modelcontextprotocol/server-filesystem  # Read/write files
@modelcontextprotocol/server-brave-search # Web search
@modelcontextprotocol/server-slack       # Slack messages
@modelcontextprotocol/server-puppeteer   # Browser automation
\`\`\`

### Community
\`\`\`bash
mcp-server-supabase     # Supabase queries
mcp-server-redis        # Redis operations
mcp-server-docker       # Docker container management
mcp-server-kubernetes   # K8s cluster management
mcp-server-datadog      # Logs & metrics
mcp-server-jira         # Jira tickets
mcp-server-notion       # Notion pages
\`\`\`

## 🐙 GitHub MCP — Use Cases

Sau khi config GitHub MCP:

\`\`\`
"Show me all open PRs in vuonglearning/vuonglearning"
"Find issues labeled 'bug' from last week"
"What changed in the auth module in the last 10 commits?"
"Create an issue: [title and description]"
"Review PR #123 and leave inline comments"
\`\`\`

## 🗄 Database MCP — Use Cases

\`\`\`
"How many active users signed up this month?"
"Find the top 10 users by token usage"
"Are there any orphaned records in the sessions table?"
"Optimize this slow query: [SQL]"
"Show the schema for the progress table"
\`\`\`

## 🌐 Browser/Puppeteer MCP

\`\`\`
"Navigate to localhost:3000 and take a screenshot"
"Fill out the login form and check if it works"
"Scrape the pricing table from [url]"
"Run the E2E test flow manually and report issues"
\`\`\`

## 🔨 Build Your Own MCP Server

\`\`\`typescript
// my-mcp-server.ts
import { Server } from "@modelcontextprotocol/sdk/server/index.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"

const server = new Server(
  { name: "my-tools", version: "1.0.0" },
  { capabilities: { tools: {} } }
)

// Define a tool
server.setRequestHandler("tools/list", async () => ({
  tools: [{
    name: "get_weather",
    description: "Get current weather for a city",
    inputSchema: {
      type: "object",
      properties: {
        city: { type: "string", description: "City name" }
      },
      required: ["city"]
    }
  }]
}))

// Handle tool calls
server.setRequestHandler("tools/call", async (request) => {
  if (request.params.name === "get_weather") {
    const city = request.params.arguments?.city
    // Call weather API...
    return { content: [{ type: "text", text: \`Weather in \${city}: Sunny, 28°C\` }] }
  }
})

// Start
const transport = new StdioServerTransport()
await server.connect(transport)
\`\`\`

\`\`\`json
// Add to settings.json
{
  "mcpServers": {
    "my-tools": {
      "command": "npx",
      "args": ["tsx", "/path/to/my-mcp-server.ts"]
    }
  }
}
\`\`\`

## 🔒 Security Best Practices

\`\`\`
✅ Store API keys in env vars, never hardcode
✅ Use read-only tokens where possible
✅ Scope permissions minimally (read vs write vs admin)
✅ Review what tools are available before sensitive operations
⚠️  MCP servers run with YOUR system permissions
⚠️  Be careful with filesystem MCP — can read/write any file
⚠️  Never give MCP servers production DB write access
\`\`\`
`,
  },
  {
    id: "skills-workflows",
    module: 5,
    moduleTitle: "Skills & Workflows",
    moduleColor: "from-pink-500 to-rose-500",
    title: "Skills va Workflow Scripts",
    tags: ["skills", "workflows", "automation"],
    keyTakeaway: "Skill = instructions file. Workflow = multi-agent orchestration script",
    readTime: 3,
    content: `# Module 05 — Skills & Workflows

> Skills = custom instructions Claude loads on demand
> Workflows = multi-agent orchestration scripts

## 📚 Skills System

Skills = markdown files Claude reads as instructions.

\`\`\`
~/.claude/skills/          ← global skills
.claude/skills/            ← project-specific skills
\`\`\`

### Anatomy of a Skill

\`\`\`markdown
---
name: tdd-workflow
description: Test-driven development workflow enforcing write-tests-first
when_to_use: When implementing new features or fixing bugs
---

## TDD Workflow

MANDATORY steps:
1. Write failing test FIRST
2. Run test → must FAIL (Red)
3. Write minimal implementation
4. Run test → must PASS (Green)
5. Refactor while keeping tests green
6. Verify coverage >= 80%

Never skip the Red phase.
Never write implementation before tests.
\`\`\`

Invoke: \`claude /tdd-workflow\`

### Skill Examples

#### \`/debug\` skill
\`\`\`markdown
---
name: debug
description: Systematic debugging approach for any bug or unexpected behavior
---

## Debugging Protocol

1. **Reproduce** — Create minimal reproduction case
2. **Isolate** — Binary search to find exact location
3. **Hypothesize** — Form theory about root cause
4. **Verify** — Test hypothesis with targeted change
5. **Fix** — Apply minimal fix
6. **Prevent** — Add test to catch regression

Do NOT guess. Do NOT fix multiple things at once.
Always understand WHY before fixing.
\`\`\`

#### \`/architect\` skill
\`\`\`markdown
---
name: architect
description: System design and architecture review
---

When reviewing or designing systems, always consider:

## Functional Requirements
- What must it do?
- What are the user journeys?

## Non-Functional Requirements  
- Scale: how many users/requests?
- Latency: p99 acceptable?
- Availability: 99.9% or 99.99%?
- Consistency: eventual vs strong?

## Design Decisions
For each major decision, document:
- Options considered
- Tradeoffs
- Decision made and why
- What would make you reconsider

## Red Flags to Check
- Single points of failure
- N+1 query patterns
- Unbounded growth
- Missing error handling
- Security boundaries
\`\`\`

## ⚙️ Workflows

Workflows = JavaScript scripts that orchestrate multiple agents.

\`\`\`javascript
// .claude/workflows/code-review.js
export const meta = {
  name: 'code-review',
  description: 'Multi-angle code review with auto-fix',
  phases: [
    { title: 'Review', detail: 'Bug, security, performance analysis' },
    { title: 'Fix', detail: 'Apply critical fixes' },
  ]
}

const DIMENSIONS = [
  { key: 'bugs',     prompt: 'Find logic bugs and incorrect behavior' },
  { key: 'security', prompt: 'Find security vulnerabilities (OWASP Top 10)' },
  { key: 'perf',     prompt: 'Find performance issues (N+1, O(n²), memory leaks)' },
]

// Fan out parallel reviews
const results = await pipeline(
  DIMENSIONS,
  d => agent(d.prompt, { label: \`review:\${d.key}\`, phase: 'Review' }),
)

// Collect critical findings
const critical = results.flat().filter(r => r?.severity === 'CRITICAL')
log(\`Found \${critical.length} critical issues\`)

// Auto-fix critical issues
await parallel(critical.map(issue => () =>
  agent(\`Fix this issue: \${issue.description} in \${issue.file}\`, { phase: 'Fix' })
))
\`\`\`

Run: \`claude /workflow code-review\`

## 🔄 Built-in Workflows

\`\`\`bash
/workflow code-review           # multi-angle review
/workflow test-coverage         # find gaps, generate tests  
/workflow security-audit        # full security scan
/workflow refactor-module       # safe refactoring
/workflow dependency-update     # check + update deps
\`\`\`

## 💡 Workflow Patterns

### Parallel Fan-out
\`\`\`javascript
// Run N agents at once
const results = await parallel([
  () => agent("Find bugs"),
  () => agent("Find security issues"),
  () => agent("Find performance issues"),
])
\`\`\`

### Pipeline (staged)
\`\`\`javascript
// Each stage feeds the next
const findings = await pipeline(
  files,
  file => agent(\`Analyze \${file}\`),
  finding => agent(\`Verify: \${finding}\`),
  verified => agent(\`Fix: \${verified}\`),
)
\`\`\`

### Loop until done
\`\`\`javascript
// Keep searching until nothing new found
const issues = []
let dry = 0
while (dry < 2) {
  const found = await agent("Find more issues not yet in list")
  const fresh = found.filter(f => !issues.includes(f))
  if (fresh.length === 0) { dry++; continue }
  dry = 0
  issues.push(...fresh)
}
\`\`\`
`,
  },
  {
    id: "agent-patterns",
    module: 6,
    moduleTitle: "Agent Patterns",
    moduleColor: "from-red-500 to-orange-500",
    title: "Multi-Agent Patterns",
    tags: ["agents", "parallel", "orchestration"],
    keyTakeaway: "Adversarial verify = spawn 3 attacker agents de tim loi truoc khi merge",
    readTime: 3,
    content: `# Module 06 — Agent Patterns

> Multi-agent = spawn Claude instances để làm việc song song hoặc theo pipeline

## 🤖 When to Use Agents

\`\`\`
Single Claude session:
  ✅ Most tasks (chat, code, review)
  ✅ Tasks under ~100K tokens
  ✅ Linear workflows

Multi-agent:
  ✅ Tasks needing multiple independent perspectives
  ✅ Large codebases (agent per module)
  ✅ Parallel work (test + docs + review simultaneously)
  ✅ Long-running tasks that would overflow context
  ✅ Tasks needing adversarial verification
\`\`\`

## 🏗 Agent Types in Claude Code

\`\`\`
claude        → main orchestrator (you talk to this)
  ↓ spawns
Explore       → fast read-only search
Plan          → architecture/design planning
code-reviewer → code quality review
tdd-guide     → test-driven development
security-reviewer → security analysis
\`\`\`

## 🔁 Pattern 1: Orchestrator + Workers

\`\`\`
You → Claude (orchestrator)
         ↓
    Worker A: "Analyze auth module"
    Worker B: "Analyze payment module"  (parallel)
    Worker C: "Analyze user module"
         ↓
    Synthesizer: "Combine findings + prioritize"
\`\`\`

Example prompt:
\`\`\`
"Spawn 3 parallel agents:
1. Review auth.py for security issues
2. Review payments.py for security issues
3. Review users.py for security issues
Then synthesize findings into a prioritized report"
\`\`\`

## 🔍 Pattern 2: Researcher + Implementer

\`\`\`
Researcher agent:
  → Read codebase
  → Find relevant patterns
  → Return: existing conventions, similar code

Implementer agent:
  → Receives researcher output as context
  → Implements following established patterns
  → No need to re-read everything
\`\`\`

## ✅ Pattern 3: Adversarial Verification

\`\`\`
Generator:    "Implement JWT auth"
                    ↓
Attacker 1:   "Try to bypass this auth" → finds issues
Attacker 2:   "Find race conditions"    → finds issues
Attacker 3:   "Find injection points"   → finds issues
                    ↓
Fixer:        "Fix all identified issues"
\`\`\`

\`\`\`javascript
// In a workflow
const implementation = await agent("Implement JWT auth")
const attacks = await parallel([
  () => agent(\`Attack this auth implementation: \${implementation} — focus on bypass\`),
  () => agent(\`Attack this auth implementation: \${implementation} — focus on race conditions\`),
  () => agent(\`Attack this auth implementation: \${implementation} — focus on injection\`),
])
const vulnerabilities = attacks.flat().filter(Boolean)
const fixed = await agent(\`Fix these vulnerabilities: \${vulnerabilities.join('\\n')} in:\\n\${implementation}\`)
\`\`\`

## 🗺 Pattern 4: Map-Reduce

\`\`\`
Input: 50 files to analyze

Map phase:
  Agent 1: analyze files 1-10
  Agent 2: analyze files 11-20  (parallel)
  ...
  Agent 5: analyze files 41-50

Reduce phase:
  Agent 6: merge all findings, deduplicate, prioritize
\`\`\`

## 🔄 Pattern 5: Self-Reflection Loop

\`\`\`
Draft → Critic → Revise → Critic → Revise → ...
\`\`\`

\`\`\`
Turn 1: "Write a design doc for X"
Turn 2: "Now criticize your design. What's weak?"
Turn 3: "Revise based on your criticism"
Turn 4: "What would a skeptical senior engineer object to?"
Turn 5: "Address those objections"
\`\`\`

## 📊 Agent Communication

Agents communicate through:
1. **Return values** — structured output passed to next agent
2. **Files** — write to disk, next agent reads
3. **Context injection** — paste output into next prompt
4. **Shared tools** — both agents use same MCP server

## ⚡ Agent Spawning Syntax

\`\`\`
In Claude Code chat:
"Use the Agent tool to spawn a sub-agent that..."
"Run these 3 tasks in parallel using agents:"
"Delegate the security review to a specialized agent"

In Claude's thinking:
Agent({ description: "...", prompt: "..." })
\`\`\`

## 🎯 Real-World Example: PR Review

\`\`\`
PR Review Agent System:

1. Diff Reader (1 agent)
   → Reads git diff
   → Returns: changed files + line ranges

2. Parallel Reviewers (3 agents)
   → Agent A: correctness & logic
   → Agent B: security vulnerabilities
   → Agent C: performance & scalability

3. Test Generator (1 agent)
   → Receives: identified bugs
   → Generates: regression tests for each bug

4. Summarizer (1 agent)
   → Receives: all findings
   → Generates: PR review comment with severity ratings
\`\`\`
`,
  },
  {
    id: "prompt-engineering",
    module: 7,
    moduleTitle: "Prompt Engineering",
    moduleColor: "from-teal-500 to-cyan-500",
    title: "Prompt Engineering cho Developers",
    tags: ["prompting", "engineering", "patterns"],
    keyTakeaway: "Constraints are features \u2014 noi ro MUST/MUST NOT thay vi de Claude tu doan",
    readTime: 3,
    content: `# Module 07 — Prompt Engineering for Developers

## 🧠 Core Principles

### 1. Specificity > Brevity
\`\`\`
❌ "Refactor this code"
✅ "Refactor this function to:
    - Reduce cyclomatic complexity from ~8 to <4
    - Extract the validation logic into a separate function
    - Keep the same public interface (don't change function signature)
    - Do NOT change the error handling behavior"
\`\`\`

### 2. Constraints are Features
\`\`\`
❌ "Write authentication middleware"
✅ "Write authentication middleware that:
    MUST: verify JWT, inject user into request
    MUST NOT: hit database on every request (use Redis cache)
    MUST NOT: change the existing middleware interface
    SHOULD: log auth failures with user_id and ip
    SHOULD NOT: log successful auths (too noisy)"
\`\`\`

### 3. Show the Shape of the Answer
\`\`\`
"Return your findings in this exact format:
## Summary (2 sentences)
## Critical Issues (bullet list)
## Recommendations (numbered, prioritized)
## Estimated effort (S/M/L per item)"
\`\`\`

## 🎭 Persona Prompts

\`\`\`
# For deep security review
"You are a paranoid security researcher who has found
critical vulnerabilities in major companies. You assume
all code is vulnerable until proven otherwise. Review this
auth system with maximum skepticism."

# For performance optimization
"You are a performance engineer at a company processing
1 billion requests/day. Even 1ms matters. Profile this
code mentally and suggest every possible optimization,
no matter how small."

# For code review
"You are a senior engineer who values simplicity above all.
Your motto is 'the best code is no code'. Review this PR
and suggest everything that could be simplified, removed,
or replaced with existing libraries."
\`\`\`

## 🔗 Chain of Thought Prompting

\`\`\`
"Think through this step by step:
1. First, identify what the current code does
2. Then, identify what the bug report says should happen
3. Find the gap between actual and expected behavior
4. Identify the root cause
5. Propose the minimal fix
6. Consider what else might break

Show your reasoning at each step."
\`\`\`

## 🎯 Few-Shot Prompting

\`\`\`
"Generate a commit message for the following diff.
Here are examples of our commit style:

EXAMPLE 1:
Diff: [adds user avatar upload]
Message: feat(profile): add avatar upload with S3 storage

EXAMPLE 2:
Diff: [fixes null check in auth]
Message: fix(auth): prevent crash when user.email is null

EXAMPLE 3:
Diff: [refactors query builder]
Message: refactor(db): extract query builder to reduce duplication

Now generate for this diff:
[your diff here]"
\`\`\`

## 🏗 Structured Output

\`\`\`
"Analyze this codebase and return ONLY valid JSON:
{
  'health_score': 0-100,
  'critical_issues': [
    {'file': '...', 'line': 0, 'issue': '...', 'fix': '...'}
  ],
  'tech_debt': ['...'],
  'positive_patterns': ['...']
}"
\`\`\`

## 🔄 Iterative Refinement Prompts

\`\`\`
Round 1: "Generate a basic solution"
Round 2: "What are the weaknesses of this solution?"
Round 3: "Fix the weaknesses you identified"
Round 4: "What would make this production-ready?"
Round 5: "Make it production-ready"
Round 6: "Final review — any remaining issues?"
\`\`\`

## 📐 Prompt Templates Library

### The STAR Bug Report
\`\`\`
Situation: [codebase context, what the code is supposed to do]
Task: [what behavior is expected]
Action: [what actually happens / error message]
Result: [impact, what's broken]

Code: [minimal reproduction]
Tried: [what you've already attempted]
\`\`\`

### The PREP Feature Request
\`\`\`
Problem: [what user pain point this solves]
Result: [what success looks like]
Evidence: [why this matters, data if any]
Proposal: [your suggested approach]

Constraints: [time, backwards compat, performance]
Questions: [decisions that need to be made]
\`\`\`

### The DEBUG Protocol
\`\`\`
Bug: [one-line description]
Reproduction: [exact steps]
Expected: [what should happen]
Actual: [what happens instead]
Environment: [OS, versions, config]
Error: [full error + stack trace]
Context: [relevant code, recent changes]
Hypothesis: [your current theory]
Ruled out: [what you've eliminated]
\`\`\`
`,
  },
  {
    id: "claude-api",
    module: 8,
    moduleTitle: "Claude API & SDK",
    moduleColor: "from-indigo-500 to-blue-500",
    title: "Claude API \u2014 Streaming, Tools, Caching",
    tags: ["api", "sdk", "python"],
    keyTakeaway: "Prompt caching tiet kiem 90% cost cho system prompt lon",
    readTime: 3,
    content: `# Module 08 — Claude API & SDK

## 🔑 Setup

\`\`\`bash
pip install anthropic          # Python
npm install @anthropic-ai/sdk  # TypeScript/JavaScript
\`\`\`

\`\`\`python
import anthropic
client = anthropic.Anthropic(api_key="sk-ant-...")
\`\`\`

## 💬 Basic Chat

\`\`\`python
message = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "Explain async/await in Python"}
    ]
)
print(message.content[0].text)
\`\`\`

## 📡 Streaming

\`\`\`python
with client.messages.stream(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Write a poem"}],
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
\`\`\`

## 🛠 Tool Use (Function Calling)

\`\`\`python
tools = [{
    "name": "get_weather",
    "description": "Get current weather for a city",
    "input_schema": {
        "type": "object",
        "properties": {
            "city": {"type": "string", "description": "City name"}
        },
        "required": ["city"]
    }
}]

response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    tools=tools,
    messages=[{"role": "user", "content": "What's the weather in Da Lat?"}]
)

# Handle tool call
if response.stop_reason == "tool_use":
    tool_use = next(b for b in response.content if b.type == "tool_use")
    city = tool_use.input["city"]
    
    # Call your actual weather API
    weather = call_weather_api(city)
    
    # Send result back
    final = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        tools=tools,
        messages=[
            {"role": "user", "content": "Weather in Da Lat?"},
            {"role": "assistant", "content": response.content},
            {"role": "user", "content": [{"type": "tool_result", "tool_use_id": tool_use.id, "content": weather}]}
        ]
    )
\`\`\`

## 💾 Prompt Caching (SAVE 90% COST)

\`\`\`python
# Without cache: every call re-processes the system prompt
# With cache: processed once, cached for 5 minutes

response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    system=[{
        "type": "text",
        "text": "You are a helpful assistant. " + LARGE_CONTEXT,
        "cache_control": {"type": "ephemeral"}  # ← cache this!
    }],
    messages=[{"role": "user", "content": user_question}]
)

# Check cache performance
print(response.usage.cache_creation_input_tokens)  # first call
print(response.usage.cache_read_input_tokens)       # subsequent calls
\`\`\`

## 🧠 Extended Thinking

\`\`\`python
response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=16000,
    thinking={
        "type": "enabled",
        "budget_tokens": 10000  # how much to think
    },
    messages=[{"role": "user", "content": "Solve this complex problem..."}]
)

# Get thinking + answer
for block in response.content:
    if block.type == "thinking":
        print("THINKING:", block.thinking)
    elif block.type == "text":
        print("ANSWER:", block.text)
\`\`\`

## 📁 Files API

\`\`\`python
# Upload a file
with open("document.pdf", "rb") as f:
    file = client.beta.files.upload(
        file=("document.pdf", f, "application/pdf")
    )

# Use in message
response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    messages=[{
        "role": "user",
        "content": [
            {"type": "document", "source": {"type": "file", "file_id": file.id}},
            {"type": "text", "text": "Summarize this document"}
        ]
    }]
)
\`\`\`

## 🔢 Batch API (Process 1000s of requests)

\`\`\`python
# Create batch
batch = client.messages.batches.create(
    requests=[
        {"custom_id": f"req-{i}", "params": {
            "model": "claude-haiku-4-5",
            "max_tokens": 100,
            "messages": [{"role": "user", "content": f"Question {i}"}]
        }}
        for i in range(1000)
    ]
)

# Check status
batch = client.messages.batches.retrieve(batch.id)
print(batch.processing_status)  # "in_progress" or "ended"

# Get results
for result in client.messages.batches.results(batch.id):
    if result.result.type == "succeeded":
        print(result.custom_id, result.result.message.content[0].text)
\`\`\`

## 🏗 Build a Simple AI App

\`\`\`python
# ai_assistant.py — production-ready pattern
import anthropic
from functools import lru_cache

@lru_cache
def get_client():
    return anthropic.Anthropic()

SYSTEM_PROMPT = """
You are a helpful coding assistant specialized in Python and FastAPI.
Always provide working code examples.
Always add error handling.
"""

def chat(user_message: str, history: list = None) -> str:
    client = get_client()
    
    messages = history or []
    messages.append({"role": "user", "content": user_message})
    
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2048,
        system=[{
            "type": "text",
            "text": SYSTEM_PROMPT,
            "cache_control": {"type": "ephemeral"}
        }],
        messages=messages,
    )
    
    reply = response.content[0].text
    messages.append({"role": "assistant", "content": reply})
    
    return reply, messages

# Usage
reply, history = chat("How do I add JWT auth to FastAPI?")
reply2, history = chat("Show me the refresh token logic", history)
\`\`\`
`,
  },
  {
    id: "real-world-overview",
    module: 9,
    moduleTitle: "Real World",
    moduleColor: "from-slate-500 to-gray-500",
    title: "Real Project Setup \u2014 Cau Truc File",
    tags: ["real-world", "setup", "structure"],
    keyTakeaway: "CLAUDE.md + .claude/rules/ + .claude/commands/ = bo 3 khong the thieu",
    readTime: 1,
    content: `# Module 09 — Real World: How vuonglearning Uses Claude Code

> Đây là cách Claude Code được dùng trong production tại VuongLearning.
> Tất cả examples dưới đây là từ codebase thật, không phải demo.

## 📁 Cấu trúc thực tế

\`\`\`
vuonglearning/
├── CLAUDE.md                    ← Global architecture guide (1200+ lines!)
├── .claude/
│   ├── settings.local.json      ← Permission allowlist cho máy này
│   ├── rules/                   ← Auto-loaded rules (7 files)
│   │   ├── pre-push.md          ← Pre-push checklist
│   │   ├── pr-review.md         ← PR etiquette + SLA
│   │   ├── maintainability.md   ← Code complexity ceilings
│   │   ├── documentation.md     ← Doc requirements by scope
│   │   ├── observability.md     ← Logging + tracing
│   │   ├── performance.md       ← SLO + profiling
│   │   └── dependencies.md      ← Dependency management
│   └── commands/                ← 20+ audit slash commands
│       ├── audit-security.md
│       ├── audit-performance.md
│       └── ... (18 more)
├── services/
│   ├── vuonglearning-api/CLAUDE.md   ← Per-service guide (2062 lines!)
│   ├── ai-service/CLAUDE.md
│   └── .../CLAUDE.md
└── scripts/hooks/               ← Git hooks
    ├── pre-commit
    ├── pre-push
    ├── commit-msg
    └── lib.sh
\`\`\`

## 💡 Key Insight

**CLAUDE.md = living architecture document** — không phải README thông thường.
Claude đọc file này trước mỗi task để hiểu:
- Stack và conventions
- What NOT to do (rất quan trọng!)
- Security model
- Testing requirements
- Patterns đang dùng trong codebase
`,
  },
  {
    id: "real-world-claudemd",
    module: 9,
    moduleTitle: "Real World",
    moduleColor: "from-slate-500 to-gray-500",
    title: "CLAUDE.md Pattern tu Production",
    tags: ["CLAUDE.md", "conventions", "real-world"],
    keyTakeaway: "What NOT to do section quan trong hon What to do \u2014 override Claude defaults",
    readTime: 3,
    content: `# Pattern: Root CLAUDE.md

## Tại sao vuonglearning có CLAUDE.md 1200+ dòng?

Vì Claude **đọc lại từ đầu mỗi session**. File này trả lời trước tất cả câu hỏi Claude có thể hỏi.

## Structure thực tế

\`\`\`markdown
# VuongLearning — AI Coding Agent Instructions

## What This Is
[mô tả project 2-3 dòng]

## VuongLearning Skills & Agents
[bảng skill nào dùng cho task nào]

## Layout
[bảng service → path → port → stack]

## Architecture
[diagram ASCII của service dependencies]

## Coding Conventions
[Python: ruff, mypy strict, httpx only, never requests]
[Frontend: pnpm, shadcn/ui, Zustand + TanStack Query]

## Security
[inter-service auth, CORS, never commit secrets]

## API Type Synchronization
[make types-generate khi thay đổi Pydantic schema]

## What NOT to do
[list cụ thể những gì KHÔNG làm — quan trọng nhất!]

## Change Workflow
[mandatory steps cho mọi code change]
\`\`\`

## "What NOT to do" Section — Cực kỳ quan trọng

\`\`\`markdown
## What NOT to do
- No \`print()\` — use logger
- No \`requests\` or \`urllib\` — use httpx
- No \`os.environ\` directly — use \`get_settings()\`
- No real secrets in \`.env.example\`
- No committing \`.env\`, \`__pycache__\`, \`node_modules\`, \`.next/\`
- No cross-service imports — services communicate via HTTP only
- No cross-service database access — each service owns its database
- No \`usage_daily.chat_messages\` in analytics — source from \`ai_usage_records\`
\`\`\`

**Tại sao effective?** Claude sẽ không suggest print() hay requests nữa, dù đó là gợi ý tự nhiên nhất.

## Per-Service CLAUDE.md

Mỗi service có CLAUDE.md riêng với:
1. **Immutable Stack** — table liệt kê library + rules (Never use X, Always use Y)
2. **Domain Module Structure** — template cho folder mới
3. **Naming Conventions** — cụ thể từng loại file
4. **Security Model** — chi tiết auth flow
5. **Known Incomplete Features** — tránh implement lại cái đang làm dở

### Ví dụ Immutable Stack Table:

\`\`\`markdown
| Component | Library | Rules |
|-----------|---------|-------|
| HTTP | httpx async | Never requests, never aiohttp |
| ORM | SQLAlchemy 2.0 async | asyncpg driver, never sync |
| Config | pydantic-settings | Single Settings class |
| Lint | ruff | Never black, flake8, isort separately |
| Package | uv | Never pip directly, never poetry |
\`\`\`

Claude sẽ không bao giờ suggest \`pip install\` hay \`import requests\` nữa.

## Template: CLAUDE.md cho Project Cá nhân

\`\`\`markdown
# [Project Name] — CLAUDE.md

## Project Overview
[1-2 sentences: what it does, who uses it]

## Tech Stack (Immutable)
| Layer | Technology | Rules |
|-------|-----------|-------|
| Runtime | Python 3.12 | |
| Framework | FastAPI | No Flask |
| HTTP Client | httpx async | Never requests |
| DB | PostgreSQL + SQLAlchemy async | No raw SQL |
| Cache | Redis | Slot 0 for app cache |
| Tests | pytest | 80% coverage minimum |

## Commands
\`\`\`bash
make dev     # start development
make test    # run tests
make lint    # lint + format
\`\`\`

## Naming Conventions
- Files: snake_case.py
- Classes: PascalCase
- Functions: verb_noun (create_user, get_by_id)
- Constants: UPPER_SNAKE_CASE

## What NOT to do
- No print() → use logger
- No os.environ → use get_settings()
- No requests → use httpx
- [Add your own project-specific rules]

## Architecture
[ASCII or describe service dependencies]

## Testing
- Unit: test business logic in isolation
- Integration: test HTTP endpoints
- Coverage: 80% minimum, enforced by CI
\`\`\`
`,
  },
  {
    id: "real-world-hooks",
    module: 9,
    moduleTitle: "Real World",
    moduleColor: "from-slate-500 to-gray-500",
    title: "Git Hooks \u2014 Auto-fix va Quality Gates",
    tags: ["hooks", "automation", "git"],
    keyTakeaway: "pre-commit auto-fix ruff/prettier + type check = khong can nho chay format",
    readTime: 3,
    content: `# Pattern: Git Hooks — Automation Layer

## vuonglearning dùng 3 hooks

\`\`\`
scripts/hooks/
├── pre-commit    ← auto-fix + check trước commit
├── pre-push      ← lint + typecheck trước push
├── commit-msg    ← validate conventional commit format
└── lib.sh        ← shared utilities
\`\`\`

Cài đặt: \`make hooks-install\` → sets \`core.hooksPath = scripts/hooks\`

## pre-commit — Tự động fix + check

\`\`\`bash
#!/bin/bash
# Phase 0: File hygiene + secrets scan
gitleaks detect --source . --staged

# Phase 1: Auto-fix staged files
# Python
if has_python_changes; then
    uv run ruff format src/       # format
    uv run ruff check --fix src/  # lint fix
    git add -u                    # re-stage fixed files
fi

# Node
if has_node_changes; then
    pnpm eslint --fix src/
    pnpm prettier --write src/
    git add -u
fi

# Phase 2: CI-equivalent checks (fail fast)
run_python_checks   # ruff format --check, ruff check, mypy
run_node_checks     # pnpm lint, pnpm typecheck
\`\`\`

**Result:** Commit chỉ pass khi code đã format + type-safe.
Claude không cần nhớ phải chạy format — hook làm tự động.

## commit-msg — Enforce Conventional Commits

\`\`\`bash
#!/bin/bash
MSG=$(cat "$1")
PATTERN="^(feat|fix|refactor|docs|test|chore|perf|ci)(\\(.+\\))?: .{1,72}$"

if ! echo "$MSG" | grep -qE "$PATTERN"; then
    echo "ERROR: Commit message không đúng format!"
    echo "Expected: type(scope): description"
    echo "Types: feat, fix, refactor, docs, test, chore, perf, ci"
    echo "Scopes: web, api, ai-service, ai-safety, ops, shared"
    exit 1
fi
\`\`\`

**Result:** Mọi commit trong vuonglearning đều có format:
\`\`\`
feat(api): add JWT refresh token rotation
fix(web): prevent crash when user.email is null
refactor(ai-service): extract tool dispatch to separate module
\`\`\`

## lib.sh — Detect Changed Services

\`\`\`bash
# Chỉ check service bị thay đổi — không check tất cả
detect_changed_services() {
    local changed_files=$(git diff --cached --name-only)
    
    echo "$changed_files" | grep -q "^services/vuonglearning-api/"  && echo "vuonglearning-api"
    echo "$changed_files" | grep -q "^services/ai-service/"    && echo "ai-service"  
    echo "$changed_files" | grep -q "^services/ai-safety/"     && echo "ai-safety"
    echo "$changed_files" | grep -q "^clients/web/"            && echo "web"
    echo "$changed_files" | grep -q "^clients/ops/"            && echo "ops"
}

# Chỉ chạy checks cho service thay đổi
for service in $(detect_changed_services); do
    case "$service" in
        "vuonglearning-api") cd services/vuonglearning-api && make format-check typecheck ;;
        "web")          cd clients/web && pnpm lint typecheck ;;
    esac
done
\`\`\`

**Tại sao clever?** 5 services, nhưng chỉ check service bạn đang thay đổi.
Tiết kiệm 80% thời gian pre-commit.

## Template: Pre-commit cho Personal Project

\`\`\`bash
#!/bin/bash
# scripts/hooks/pre-commit

set -e

echo "🔍 Running pre-commit checks..."

# Check Python files changed
if git diff --cached --name-only | grep -q "\\.py$"; then
    echo "  Fixing Python..."
    uv run ruff format . --quiet
    uv run ruff check . --fix --quiet
    git add -u
    
    echo "  Checking Python..."
    uv run ruff format . --check --quiet || { echo "❌ Format check failed"; exit 1; }
    uv run mypy src/ --quiet || { echo "❌ Type check failed"; exit 1; }
fi

# Check TypeScript files changed
if git diff --cached --name-only | grep -qE "\\.(ts|tsx)$"; then
    echo "  Fixing TypeScript..."
    pnpm prettier --write src/ --quiet
    git add -u
    
    echo "  Checking TypeScript..."
    pnpm lint --quiet || { echo "❌ Lint failed"; exit 1; }
    pnpm typecheck || { echo "❌ Type check failed"; exit 1; }
fi

echo "✅ Pre-commit passed!"
\`\`\`

Setup:
\`\`\`bash
git config core.hooksPath scripts/hooks
chmod +x scripts/hooks/pre-commit
\`\`\`
`,
  },
  {
    id: "real-world-commands",
    module: 9,
    moduleTitle: "Real World",
    moduleColor: "from-slate-500 to-gray-500",
    title: "20+ Audit Commands trong Production",
    tags: ["commands", "audit", "real-world"],
    keyTakeaway: "/audit-security, /audit-performance \u2014 structured audit tot hon review my code",
    readTime: 3,
    content: `# Pattern: Custom Slash Commands — Audit System

## vuonglearning có 20+ audit commands

Tất cả trong \`.claude/commands/\`. Invoke bằng \`/audit-security\`, \`/audit-performance\`, etc.

## audit-security.md (thực tế)

\`\`\`markdown
Perform a comprehensive security audit of the vuonglearning codebase.

Focus areas:
1. Authentication & Authorization
   - JWT token validation (type checking, expiry)
   - MFA gate enforcement on all auth flows
   - BOLA/IDOR — verify ownership before mutations
   - Anti-enumeration delays on sensitive endpoints

2. Input Validation
   - SQL injection via ORM (parameterized queries)
   - Path traversal in file operations
   - XSS in HTML responses
   - Request body size limits

3. Secrets & Credentials
   - No hardcoded secrets (API keys, passwords, tokens)
   - Environment variables properly sourced via get_settings()
   - No secrets in logs (JWT, passwords, MFA codes)

4. Inter-Service Security
   - INTERNAL_API_KEY on all internal endpoints
   - CORS restricted to explicit allowlist
   - No cross-service DB access

Return findings as:
## CRITICAL (fix before merge)
## HIGH (fix before merge)
## MEDIUM (consider fixing)
## LOW (optional)

For each: location, description, attack vector, remediation
\`\`\`

## audit-performance.md

\`\`\`markdown
Analyze vuonglearning for performance issues.

Check:
1. Database Queries
   - N+1 query patterns (missing selectinload/joinedload)
   - Missing indexes on filtered/sorted columns
   - Unbounded queries without pagination/limits
   - Synchronous I/O in async handlers

2. Cache Usage
   - Redis cache hits vs misses (auth user cache 60s TTL)
   - Missing caches on expensive operations
   - Cache invalidation correctness

3. SSE Streaming Path (latency-sensitive)
   - Unnecessary buffering in relay path
   - Processing in hot path that could be async
   - Memory accumulation in long streams

4. Frontend Bundle
   - Bundle size regressions (>200KB new dependency)
   - Unnecessary re-renders
   - Missing lazy loading for heavy components

Report as: [SEVERITY] [COMPONENT] description + estimated impact
\`\`\`

## audit-api-contracts.md

\`\`\`markdown
Verify all API contracts in vuonglearning are correct and consistent.

Check:
1. OpenAPI Spec vs Implementation
   - Run: make specs && make specs-check
   - Every new endpoint documented

2. TypeScript Types vs Pydantic Schemas  
   - Run: make types-check
   - Generated types match current schemas

3. SSE Event Shapes
   - Verify all SSE events match CLAUDE.md specification
   - Check payload structure for: content, status, sources, images,
     safety, reasoning, usage, error, done, stream_resumed, stream_resume_fallback

4. Inter-Service Contracts
   - vuonglearning-api → ai-service: POST /chat/completions fields
   - ai-service → ai-safety-service: POST /v1/evaluate fields
   - Internal endpoints match Internal API Key auth

Return: list of mismatches with file locations
\`\`\`

## Tạo Custom Commands cho Personal Project

Ví dụ cho Python FastAPI project:

\`\`\`markdown
<!-- .claude/commands/check-endpoints.md -->
Review all FastAPI endpoints in this project for:

1. Missing auth (should every endpoint require authentication?)
2. Missing rate limiting on public endpoints
3. Missing input validation (Pydantic schemas for all bodies)
4. Missing error handling (HTTPException for all error cases)
5. Missing tests (at least 1 test per endpoint)
6. Logging (entry + exit for each request handler)

List endpoints that need attention with specific issues.
\`\`\`

\`\`\`markdown
<!-- .claude/commands/db-review.md -->
Review all database operations in this project:

1. N+1 queries (missing eager loading)
2. Missing transactions for multi-step writes
3. Missing indexes (columns in WHERE/ORDER BY clauses)
4. Unbounded queries (missing LIMIT)
5. Sync operations in async handlers

Show the query, the issue, and the fix.
\`\`\`

## Insight: Commands vs Skills

| | Slash Commands (.claude/commands/) | Skills (~/.claude/skills/) |
|---|---|---|
| **Scope** | Project-specific | Global (all projects) |
| **Purpose** | Domain-specific audits | Generic workflows |
| **Example** | /audit-vuonglearning-security | /tdd, /debug, /code-review |
| **Format** | Instructions only | Can include metadata, workflow |
| **Best for** | "check THIS codebase for X" | "do X using this process" |
`,
  },
  {
    id: "real-world-skills",
    module: 9,
    moduleTitle: "Real World",
    moduleColor: "from-slate-500 to-gray-500",
    title: "Skills System va Rules Files",
    tags: ["skills", "rules", "real-world"],
    keyTakeaway: "Skill Priority Table bat Claude follow process, khong freestyle",
    readTime: 4,
    content: `# Pattern: Skills System — VuongLearning Plugin

## Cách vuonglearning dùng Skills

CLAUDE.md có bảng "Skill Priority" — bắt Claude dùng skill thay vì tự làm:

\`\`\`markdown
## VuongLearning Skills & Agents

### Skill & Command Priority
When a vuonglearning skill or command exists for the task, **always prefer it**:

| Task | Use This | Not This |
|------|----------|----------|
| Planning | \`/vuonglearning:plan\` | ad-hoc planning |
| TDD | \`/vuonglearning:tdd\` | writing tests without workflow |
| Code review | \`/vuonglearning:code-review\` | manual review |
| Build errors | \`/vuonglearning:build-fix\` | guessing at fixes |
| E2E tests | \`/vuonglearning:e2e\` | writing Playwright from scratch |
| Security scan | \`/vuonglearning:security-scan\` | manual checklist |

### Agent Delegation
For sub-agent work, prefer \`vuonglearning:*\` agents:
- \`vuonglearning:code-reviewer\` over generic \`code-reviewer\`
- \`vuonglearning:tdd-guide\` over generic \`tdd-guide\`
- \`vuonglearning:architect\` over generic \`architect\`
\`\`\`

**Result:** Claude không tự "freestyle" — luôn follow đúng process của team.

## Anatomy của một Production Skill

Skill \`/vuonglearning:tdd\` thực tế:

\`\`\`markdown
---
name: tdd-workflow
description: Test-driven development — enforces write-tests-first methodology
when_to_use: When implementing new features, fixing bugs, or refactoring
---

## TDD Workflow — MANDATORY

### Phase 1: RED
1. Understand the requirement completely before writing ANY code
2. Write the test first — describe expected behavior
3. Run the test — it MUST FAIL (if it passes, test is wrong)
4. Commit the failing test: \`test: add failing test for [feature]\`

### Phase 2: GREEN
5. Write MINIMAL implementation to make test pass
6. No over-engineering — just enough to pass
7. Run tests — they MUST PASS
8. Commit: \`feat: implement [feature] (tests passing)\`

### Phase 3: REFACTOR
9. Improve code quality while keeping tests green
10. Extract functions, improve naming, remove duplication
11. Run tests after each change
12. Commit: \`refactor: improve [feature] implementation\`

### Coverage Gate
- Check: \`make test-cov\` or \`pnpm test:cov\`
- Must be >= 80% on changed paths
- Never decrease existing coverage

NEVER skip RED phase.
NEVER write implementation before tests.
NEVER commit code without passing tests.
\`\`\`

## Skill cho Personal Projects

Tạo \`~/.claude/skills/my-python-project.md\`:

\`\`\`markdown
---
name: my-python-project
description: Standards for my FastAPI projects
when_to_use: When working on any Python FastAPI project
---

## My Python Standards

### Always
- Type hints on all function signatures
- Docstring on public functions (one line is fine)
- httpx for HTTP calls, never requests
- pydantic-settings for config
- pytest + pytest-asyncio for tests
- ruff for formatting/linting

### Never
- print() → use structlog or logging
- os.environ.get() → use Settings class
- Hardcoded secrets or API keys
- Sync SQLAlchemy in async handlers

### Test Pattern
\`\`\`python
# One test per behavior, not per function
async def test_create_user_returns_201_with_valid_data():
    response = await client.post("/users", json=valid_user)
    assert response.status_code == 201
    assert response.json()["email"] == valid_user["email"]

async def test_create_user_returns_422_with_invalid_email():
    response = await client.post("/users", json={"email": "not-email"})
    assert response.status_code == 422
\`\`\`

### Error Pattern
\`\`\`python
try:
    result = await service.do_thing(id)
except ThingNotFoundError:
    raise HTTPException(404, detail={"error": {"code": "thing.not_found"}})
except DatabaseError as e:
    logger.error("db.error", extra={"error": str(e)})
    raise HTTPException(500)
\`\`\`
\`\`\`

## Rules Files — Auto-loaded Standards

vuonglearning có 7 rule files trong \`.claude/rules/\` — tự động load vào mọi session:

\`\`\`
pre-push.md         → nhắc chạy lint + test trước push
pr-review.md        → format PR + review checklist
maintainability.md  → soft ceilings cho file/function size
documentation.md    → khi nào cần viết doc
observability.md    → structured logging standards
performance.md      → SLO và profiling guidance
dependencies.md     → cách thêm dependency mới
\`\`\`

### Tạo Rules cho Personal Project

\`.claude/rules/my-standards.md\`:

\`\`\`markdown
# My Coding Standards

## Test Coverage
- Minimum 80% coverage, enforced by CI
- Every bug fix needs a regression test
- Run: \`pytest --cov=src --cov-fail-under=80\`

## Commit Format
- Use conventional commits: type(scope): description
- Types: feat, fix, refactor, docs, test, chore
- Run \`make check\` before committing

## Code Review Checklist
- [ ] No hardcoded values (use constants or config)
- [ ] No TODO without a ticket number
- [ ] Tests pass locally
- [ ] No debug code (print, breakpoint, etc.)

## Documentation
- Public functions: one-line docstring minimum
- New endpoints: update API docs
- Architecture changes: update CLAUDE.md
\`\`\`

**Tại sao rules > CLAUDE.md?** Rules files focus vào specific domains,
dễ update từng file riêng mà không phải sửa CLAUDE.md monolith.
`,
  },
  {
    id: "key-lessons",
    module: 9,
    moduleTitle: "Real World",
    moduleColor: "from-slate-500 to-gray-500",
    title: "7 Key Lessons tu Production",
    tags: ["lessons", "summary", "best-practices"],
    keyTakeaway: "30 phut setup CLAUDE.md + hooks + commands = save gio moi tuan",
    readTime: 1,
    content: `# Key Lessons — What Makes vuonglearning's Claude Setup Effective

## Lesson 1: "What NOT to do" > "What to do"

CLAUDE.md có section riêng cho **What NOT to do**:
\`\`\`
- No print() — use logger
- No requests — use httpx
- No os.environ — use get_settings()
- No cross-service DB access
\`\`\`

Claude "biết" cách làm Python. Section này override knowledge đó với project constraints.
**Bạn không cần dạy Claude Python — chỉ cần dạy project-specific rules.**

## Lesson 2: Immutable Stack Tables

Table này không để đọc — để Claude **không suggest wrong libraries**.
Một lần viết, tiết kiệm vô số lần sửa suggestion.

## Lesson 3: Hooks = Silent Quality Gates

- **pre-commit**: auto-fix format → check type → fail nếu còn lỗi
- **commit-msg**: reject nếu không phải conventional commit
- **Stop hook**: scan console.log trong code đã sửa

**Automation > Memory**

## Lesson 4: Per-Service CLAUDE.md

Context-specific instructions > Generic instructions

## Lesson 5: 20+ Audit Commands

Thay vì "review my code" → trigger specific audit với checklist cụ thể.
**Structured prompts > Open-ended requests**

## Lesson 6: Skill Priority Table

Claude phải follow process, không được freestyle.
**Defined workflow > Ad-hoc decisions**

## Lesson 7: Modular Rules Files

7 rule files auto-loaded, mỗi file focused.
**Modular rules > Monolithic instructions**

## Quick Start cho Personal Project (30 phút)

1. Tạo CLAUDE.md với stack + "What NOT to do"
2. Tạo .claude/rules/ cho cross-cutting concerns
3. Tạo .claude/commands/ cho domain-specific audits
4. Setup git hooks (pre-commit, commit-msg)
5. Add permission allowlist trong .claude/settings.json

**Time investment**: 30 phút setup → save giờ mỗi tuần.
`,
  },
]