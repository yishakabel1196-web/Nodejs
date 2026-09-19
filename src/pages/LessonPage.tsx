import { useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { getCourse, getLesson, getNextLesson, getPrevLesson } from '../data/courses';
import { executeCode, checkOutput } from '../utils/executor';
import { useProgress } from '../hooks/useProgress';

type Tab = 'learn' | 'exercise' | 'solution';

export default function LessonPage() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const navigate = useNavigate();
  const { markComplete, isCompleted } = useProgress();
  
  const course = getCourse(courseId || '');
  const lesson = getLesson(courseId || '', lessonId || '');
  
  const [code, setCode] = useState(lesson?.exercise.starterCode || '');
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('learn');
  const [showSolution, setShowSolution] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  if (!course || !lesson) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Lesson Not Found</h1>
          <Link to="/" className="text-cyan-400 hover:text-cyan-300">← Back to courses</Link>
        </div>
      </div>
    );
  }

  const completed = isCompleted(course.id, lesson.id);
  const nextLesson = getNextLesson(course.id, lesson.id);
  const prevLesson = getPrevLesson(course.id, lesson.id);
  const lessonIndex = course.lessons.findIndex(l => l.id === lesson.id);

  const handleRun = useCallback(() => {
    setIsRunning(true);
    // Simulate a small delay for UX
    setTimeout(() => {
      const result = executeCode(code);
      setOutput(result.output);
      setError(result.error);
      setIsCorrect(null);
      setIsRunning(false);
    }, 300);
  }, [code]);

  const handleSubmit = useCallback(() => {
    setIsRunning(true);
    setTimeout(() => {
      const result = executeCode(code);
      setOutput(result.output);
      setError(result.error);
      
      if (result.success) {
        const correct = checkOutput(result.output, lesson.exercise.expectedOutput);
        setIsCorrect(correct);
        if (correct) {
          markComplete(course.id, lesson.id);
        }
      } else {
        setIsCorrect(false);
      }
      setIsRunning(false);
    }, 300);
  }, [code, lesson, course.id, markComplete]);

  const handleReset = useCallback(() => {
    setCode(lesson.exercise.starterCode);
    setOutput('');
    setError(null);
    setIsCorrect(null);
    setShowHint(false);
  }, [lesson]);

  const handleShowSolution = useCallback(() => {
    setShowSolution(true);
    setCode(lesson.exercise.solution);
  }, [lesson]);

  return (
    <div className="h-screen flex flex-col bg-gray-950 text-white overflow-hidden">
      {/* Top Bar */}
      <header className="border-b border-white/10 bg-gray-900/80 backdrop-blur-sm flex-shrink-0">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(`/course/${course.id}`)}
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              ← {course.title}
            </button>
            <span className="text-gray-600">/</span>
            <span className="text-sm text-gray-300 font-medium">
              {lessonIndex + 1}. {lesson.title}
            </span>
            {completed && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/20">
                ✓ Complete
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {prevLesson && (
              <Link
                to={`/course/${course.id}/lesson/${prevLesson.id}`}
                className="px-3 py-1.5 text-sm rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                ← Prev
              </Link>
            )}
            {nextLesson && (
              <Link
                to={`/course/${course.id}/lesson/${nextLesson.id}`}
                className="px-3 py-1.5 text-sm rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                Next →
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content - Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Lesson Content */}
        <div className="w-1/2 border-r border-white/10 flex flex-col overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-white/10 flex-shrink-0">
            <button
              onClick={() => setActiveTab('learn')}
              className={`px-5 py-3 text-sm font-medium transition-colors ${
                activeTab === 'learn'
                  ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-500/5'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              📖 Learn
            </button>
            <button
              onClick={() => setActiveTab('exercise')}
              className={`px-5 py-3 text-sm font-medium transition-colors ${
                activeTab === 'exercise'
                  ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-500/5'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              🎯 Exercise
            </button>
            <button
              onClick={() => setActiveTab('solution')}
              className={`px-5 py-3 text-sm font-medium transition-colors ${
                activeTab === 'solution'
                  ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-500/5'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              💡 Solution
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'learn' && (
              <div className="prose prose-invert max-w-none">
                {/* Theory */}
                <div className="mb-8">
                  <div
                    className="text-gray-300 leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: formatMarkdown(lesson.theory)
                    }}
                  />
                </div>

                {/* Example Code */}
                <div>
                  <h3 className="text-lg font-bold text-cyan-300 mb-3 flex items-center gap-2">
                    <span>💻</span> Example Code
                  </h3>
                  <div className="bg-gray-900 rounded-xl border border-white/10 overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 border-b border-white/10">
                      <div className="w-3 h-3 rounded-full bg-red-500/60"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500/60"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500/60"></div>
                      <span className="text-xs text-gray-500 ml-2">example.js</span>
                    </div>
                    <pre className="p-4 text-sm overflow-x-auto">
                      <code className="text-gray-300">{lesson.exampleCode}</code>
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'exercise' && (
              <div>
                <h3 className="text-lg font-bold text-cyan-300 mb-4 flex items-center gap-2">
                  <span>🎯</span> Exercise
                </h3>
                <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-xl p-5 mb-6">
                  <p className="text-gray-300 leading-relaxed">{lesson.exercise.instructions}</p>
                </div>

                {/* Hint */}
                {lesson.exercise.hint && (
                  <div className="mb-6">
                    <button
                      onClick={() => setShowHint(!showHint)}
                      className="text-sm text-yellow-400 hover:text-yellow-300 flex items-center gap-1"
                    >
                      <span>{showHint ? '▼' : '▶'}</span>
                      {showHint ? 'Hide Hint' : 'Show Hint'}
                    </button>
                    {showHint && (
                      <div className="mt-2 p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
                        <p className="text-sm text-yellow-200/80">{lesson.exercise.hint}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Expected Output */}
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Expected Output:</h4>
                  <div className="bg-gray-900 rounded-lg border border-white/10 p-4">
                    <pre className="text-sm text-green-400 font-mono">{lesson.exercise.expectedOutput}</pre>
                  </div>
                </div>

                {/* Result Feedback */}
                {isCorrect !== null && (
                  <div className={`mt-6 p-4 rounded-xl border ${
                    isCorrect
                      ? 'bg-green-500/10 border-green-500/30'
                      : 'bg-red-500/10 border-red-500/30'
                  }`}>
                    {isCorrect ? (
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🎉</span>
                        <div>
                          <p className="font-bold text-green-300">Correct!</p>
                          <p className="text-sm text-green-400/70">Great job! You've completed this exercise.</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">❌</span>
                        <div>
                          <p className="font-bold text-red-300">Not quite right</p>
                          <p className="text-sm text-red-400/70">Check your output against the expected result.</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'solution' && (
              <div>
                <h3 className="text-lg font-bold text-cyan-300 mb-4 flex items-center gap-2">
                  <span>💡</span> Solution
                </h3>
                
                {!showSolution ? (
                  <div className="text-center py-10">
                    <p className="text-gray-400 mb-4">Try the exercise first before looking at the solution!</p>
                    <button
                      onClick={handleShowSolution}
                      className="px-6 py-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 hover:bg-yellow-500/20 transition-colors"
                    >
                      Show Solution
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="bg-gray-900 rounded-xl border border-white/10 overflow-hidden">
                      <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 border-b border-white/10">
                        <div className="w-3 h-3 rounded-full bg-red-500/60"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/60"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/60"></div>
                        <span className="text-xs text-gray-500 ml-2">solution.js</span>
                      </div>
                      <pre className="p-4 text-sm overflow-x-auto">
                        <code className="text-gray-300">{lesson.exercise.solution}</code>
                      </pre>
                    </div>
                    <button
                      onClick={() => { handleShowSolution(); setActiveTab('exercise'); }}
                      className="mt-4 px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 hover:bg-cyan-500/20 transition-colors text-sm"
                    >
                      Load solution into editor →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Code Editor */}
        <div className="w-1/2 flex flex-col overflow-hidden">
          {/* Editor Header */}
          <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-white/10 flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/60"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/60"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/60"></div>
              <span className="text-xs text-gray-500 ml-2">exercise.js</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="px-3 py-1.5 text-xs rounded-md bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                title="Reset to starter code"
              >
                ↺ Reset
              </button>
            </div>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1 min-h-0">
            <Editor
              height="100%"
              defaultLanguage="javascript"
              value={code}
              onChange={(value) => setCode(value || '')}
              theme="vs-dark"
              options={{
                fontSize: 14,
                fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                padding: { top: 16 },
                lineNumbers: 'on',
                renderLineHighlight: 'line',
                bracketPairColorization: { enabled: true },
                automaticLayout: true,
                tabSize: 2,
                wordWrap: 'on',
              }}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 px-4 py-3 bg-gray-900 border-t border-white/10 flex-shrink-0">
            <button
              onClick={handleRun}
              disabled={isRunning}
              className="px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium text-sm transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isRunning ? (
                <span className="animate-spin">⚙</span>
              ) : (
                <span>▶</span>
              )}
              Run
            </button>
            <button
              onClick={handleSubmit}
              disabled={isRunning}
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium text-sm transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50 flex items-center gap-2"
            >
              {isRunning ? (
                <span className="animate-spin">⚙</span>
              ) : (
                <span>✓</span>
              )}
              Submit
            </button>
            {isCorrect && nextLesson && (
              <Link
                to={`/course/${course.id}/lesson/${nextLesson.id}`}
                className="ml-auto px-5 py-2.5 rounded-lg bg-green-600 hover:bg-green-500 text-white font-medium text-sm transition-colors flex items-center gap-2"
              >
                Next Lesson →
              </Link>
            )}
          </div>

          {/* Output Panel */}
          <div className="h-40 border-t border-white/10 flex flex-col flex-shrink-0">
            <div className="flex items-center justify-between px-4 py-2 bg-gray-900/50 border-b border-white/10">
              <span className="text-xs font-medium text-gray-400">📟 Output</span>
              {(output || error) && (
                <button
                  onClick={() => { setOutput(''); setError(null); setIsCorrect(null); }}
                  className="text-xs text-gray-500 hover:text-gray-300"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="flex-1 overflow-y-auto p-4 bg-gray-950 font-mono text-sm">
              {error && (
                <div className="text-red-400 mb-2">
                  <span className="text-red-500 font-bold">Error: </span>
                  {error}
                </div>
              )}
              {output ? (
                <pre className="text-green-400 whitespace-pre-wrap">{output}</pre>
              ) : !error ? (
                <span className="text-gray-600 italic">Click "Run" to see output here...</span>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple markdown formatter
function formatMarkdown(text: string): string {
  return text
    .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold text-white mt-6 mb-3">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold text-cyan-300 mt-4 mb-2">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
    .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-gray-800 text-cyan-300 text-sm font-mono">$1</code>')
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="bg-gray-900 rounded-lg p-4 my-3 overflow-x-auto border border-white/10"><code class="text-sm text-gray-300">$2</code></pre>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 text-gray-300 mb-1">• $1</li>')
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>');
}
