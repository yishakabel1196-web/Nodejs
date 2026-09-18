import { useState } from 'react';

type Skill = {
  name: string;
  description: string;
  invoked: 'user' | 'model';
};

type Category = {
  name: string;
  icon: string;
  skills: Skill[];
};

const categories: Category[] = [
  {
    name: 'Engineering',
    icon: '⚙️',
    skills: [
      { name: 'ask-matt', description: 'Ask which skill or flow fits your situation. A router over the user-invoked skills.', invoked: 'user' },
      { name: 'grill-with-docs', description: 'Grilling session that also builds your project\'s domain model, sharpening terminology and updating CONTEXT.md and ADRs inline.', invoked: 'user' },
      { name: 'triage', description: 'Move issues through a state machine of triage roles.', invoked: 'user' },
      { name: 'improve-codebase-architecture', description: 'Scan a codebase for deepening opportunities, present them as a visual HTML report.', invoked: 'user' },
      { name: 'setup-matt-pocock-skills', description: 'Configure this repo for the engineering skills (issue tracker, triage labels, domain doc layout).', invoked: 'user' },
      { name: 'to-spec', description: 'Turn the current conversation into a spec and publish it to the issue tracker.', invoked: 'user' },
      { name: 'to-tickets', description: 'Break any plan, spec, or conversation into a set of tracer-bullet tickets.', invoked: 'user' },
      { name: 'implement', description: 'Build the work described by a spec or set of tickets, driving /tdd at pre-agreed seams.', invoked: 'user' },
      { name: 'wayfinder', description: 'Plan a huge chunk of work as a shared map of decision tickets on the issue tracker.', invoked: 'user' },
      { name: 'prototype', description: 'Build a throwaway prototype to answer a design question.', invoked: 'model' },
      { name: 'diagnosing-bugs', description: 'Disciplined diagnosis loop for hard bugs and performance regressions.', invoked: 'model' },
      { name: 'research', description: 'Investigate a question against high-trust primary sources and capture the findings.', invoked: 'model' },
      { name: 'tdd', description: 'Test-driven development with a red-green-refactor loop.', invoked: 'model' },
      { name: 'domain-modeling', description: 'Actively build and sharpen a project\'s domain model.', invoked: 'model' },
      { name: 'codebase-design', description: 'Shared discipline and vocabulary for designing deep modules.', invoked: 'model' },
      { name: 'code-review', description: 'Two-axis review of the diff since a fixed point: Standards and Spec.', invoked: 'model' },
      { name: 'resolving-merge-conflicts', description: 'Work through an in-progress git merge or rebase conflict hunk by hunk.', invoked: 'model' },
      { name: 'wizard', description: 'Generate an interactive bash wizard that walks a human through steps only they can perform.', invoked: 'model' },
    ],
  },
  {
    name: 'Productivity',
    icon: '🚀',
    skills: [
      { name: 'grill-me', description: 'Get relentlessly interviewed about a plan or design until every branch of the design tree is resolved.', invoked: 'user' },
      { name: 'handoff', description: 'Compact the current conversation into a handoff document so another agent can continue the work.', invoked: 'user' },
      { name: 'teach', description: 'Teach the user a new skill or concept over multiple sessions.', invoked: 'user' },
      { name: 'to-questionnaire', description: 'Turn a decision you can\'t answer alone into a Markdown questionnaire.', invoked: 'user' },
      { name: 'wait-what', description: 'Fire this the moment a message doesn\'t land. The agent re-pitches it with the context you\'re missing.', invoked: 'user' },
      { name: 'grilling', description: 'Interview the user relentlessly about a plan, decision, or idea until every branch is resolved.', invoked: 'model' },
      { name: 'writing-for-agents', description: 'Writing documents for agents: skills, AGENTS.md/CLAUDE.md, and any doc an agent reaches by a pointer.', invoked: 'model' },
    ],
  },
];

const problems = [
  {
    id: 1,
    title: 'The Agent Didn\'t Do What I Want',
    quote: '"No-one knows exactly what they want"',
    source: 'David Thomas & Andrew Hunt, The Pragmatic Programmer',
    fix: 'Use /grill-me or /grill-with-docs to align with the agent before getting started.',
    icon: '🎯',
  },
  {
    id: 2,
    title: 'The Agent Is Way Too Verbose',
    quote: '"With a ubiquitous language, conversations among developers and expressions of the code are all derived from the same domain model."',
    source: 'Eric Evans, Domain-Driven-Design',
    fix: 'Build a shared language via CONTEXT.md to reduce verbosity and improve consistency.',
    icon: '📝',
  },
  {
    id: 3,
    title: 'The Code Doesn\'t Work',
    quote: '"Always take small, deliberate steps. The rate of feedback is your speed limit."',
    source: 'David Thomas & Andrew Hunt, The Pragmatic Programmer',
    fix: 'Use /tdd for red-green-refactor and /diagnosing-bugs for disciplined debugging.',
    icon: '🐛',
  },
  {
    id: 4,
    title: 'We Built A Ball Of Mud',
    quote: '"Invest in the design of the system every day."',
    source: 'Kent Beck, Extreme Programming Explained',
    fix: 'Use /improve-codebase-architecture to survey for deepening opportunities regularly.',
    icon: '🏗️',
  },
];

function App() {
  const [activeCategory, setActiveCategory] = useState('Engineering');
  const [filter, setFilter] = useState<'all' | 'user' | 'model'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const currentCategory = categories.find((c) => c.name === activeCategory)!;
  const filteredSkills = currentCategory.skills.filter((skill) => {
    const matchesFilter = filter === 'all' || skill.invoked === filter;
    const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      skill.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-purple-500/5 rounded-full blur-3xl"></div>
        
        <nav className="relative z-10 max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-lg font-bold">
              S
            </div>
            <span className="text-xl font-bold">Skills Explorer</span>
          </div>
          <a
            href="https://github.com/mattpocock/skills"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            View on GitHub
          </a>
        </nav>

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm mb-8">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            264k+ Stars • 22.3k Forks • MIT License
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
              Skills for Real Engineers
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-4">
            Straight from Matt Pocock's .agents directory. Small, easy to adapt, and composable skills that work with any model.
          </p>
          
          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10">
            Based on decades of engineering experience. Not vibe coding.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://github.com/mattpocock/skills"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 font-semibold text-lg transition-all shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
            >
              View Repository →
            </a>
            <a
              href="https://www.aihero.dev/s/skills-newsletter"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 font-semibold text-lg transition-all"
            >
              Join Newsletter (~60k devs)
            </a>
          </div>
        </div>
      </header>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-6 -mt-8 mb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Stars', value: '264k+', icon: '⭐' },
            { label: 'Forks', value: '22.3k', icon: '🍴' },
            { label: 'Skills', value: '25+', icon: '🛠️' },
            { label: 'Version', value: 'v1.2.3', icon: '📦' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Installation Section */}
      <section className="max-w-7xl mx-auto px-6 mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Installation (30-second setup)</h2>
          <p className="text-gray-400 text-lg">Two ways in, two philosophies</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center text-xl">🔌</div>
              <h3 className="text-xl font-bold">Claude Code Plugin</h3>
            </div>
            <p className="text-gray-400 mb-4">Managed, read-only bundle that updates automatically.</p>
            <div className="bg-gray-950 rounded-lg p-4 font-mono text-sm">
              <span className="text-green-400">$</span> claude plugins install mattpocock-skills
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center text-xl">🛠️</div>
              <h3 className="text-xl font-bold">For Tinkerers</h3>
            </div>
            <p className="text-gray-400 mb-4">Editable skill files you own and can hack on.</p>
            <div className="bg-gray-950 rounded-lg p-4 font-mono text-sm">
              <span className="text-green-400">$</span> npx skills@latest add mattpocock/skills
            </div>
          </div>
        </div>
      </section>

      {/* Problems Section */}
      <section className="max-w-7xl mx-auto px-6 mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why These Skills Exist</h2>
          <p className="text-gray-400 text-lg">Fixing common failure modes with coding agents</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {problems.map((problem) => (
            <div key={problem.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-purple-500/30 transition-colors">
              <div className="text-4xl mb-4">{problem.icon}</div>
              <h3 className="text-xl font-bold mb-3">#{problem.id}: {problem.title}</h3>
              <blockquote className="text-gray-400 italic mb-2 border-l-2 border-purple-500/50 pl-4">
                {problem.quote}
              </blockquote>
              <p className="text-sm text-gray-500 mb-4">{problem.source}</p>
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                <p className="text-purple-200 text-sm font-medium">
                  <span className="text-purple-400 font-bold">The Fix:</span> {problem.fix}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Skills Explorer */}
      <section className="max-w-7xl mx-auto px-6 mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Skills Reference</h2>
          <p className="text-gray-400 text-lg">Explore all 25+ skills organized by category</p>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center gap-4 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                activeCategory === cat.name
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="mr-2">{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>

        {/* Filter & Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'user', 'model'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  filter === f
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                {f === 'all' ? 'All' : f === 'user' ? '👤 User-invoked' : '🤖 Model-invoked'}
              </button>
            ))}
          </div>
        </div>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSkills.map((skill) => (
            <div
              key={skill.name}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-purple-500/30 hover:bg-white/[0.07] transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-mono font-bold text-purple-300 group-hover:text-purple-200">
                  /{skill.name}
                </h4>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  skill.invoked === 'user'
                    ? 'bg-blue-500/10 text-blue-300 border border-blue-500/20'
                    : 'bg-green-500/10 text-green-300 border border-green-500/20'
                }`}>
                  {skill.invoked === 'user' ? '👤 User' : '🤖 Model'}
                </span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">{skill.description}</p>
            </div>
          ))}
        </div>

        {filteredSkills.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No skills found matching your search.</p>
          </div>
        )}
      </section>

      {/* About Section */}
      <section className="max-w-7xl mx-auto px-6 mb-20">
        <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/20 rounded-3xl p-10 md:p-16">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-4xl font-bold shadow-2xl shadow-purple-500/30">
                MP
              </div>
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-3">About Matt Pocock</h3>
              <p className="text-gray-300 text-lg mb-4">
                TypeScript wizard. Building Total TypeScript. Ex-Vercel, Stately. 45.8k followers on GitHub.
              </p>
              <p className="text-gray-400 mb-6">
                These skills are his personal .claude directory, made public. They represent decades of engineering experience condensed into repeatable practices for AI-powered development.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="https://github.com/mattpocock" target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-sm font-medium transition-colors">
                  GitHub Profile
                </a>
                <a href="https://www.totaltypescript.com" target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-sm font-medium transition-colors">
                  Total TypeScript
                </a>
                <a href="https://www.aihero.dev" target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-sm font-medium transition-colors">
                  AI Hero
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-500 mb-2">
            Built to showcase the <a href="https://github.com/mattpocock/skills" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">mattpocock/skills</a> repository
          </p>
          <p className="text-gray-600 text-sm">
            MIT License • Shell 71.3% • JavaScript 28.7% • 471 Commits
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
