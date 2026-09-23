import { useState, useCallback, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { getCourseById, getLesson, getNextLesson, getPrevLesson } from '../data/courses';
import { executeCode, checkOutput } from '../utils/executor';
import { useProgress } from '../hooks/useProgress';
import { FileTree, FileTabs, useFileSystem, FileNode } from '../components/FileTree';

type Tab = 'learn' | 'exercise' | 'solution';

// Generate file tree for a lesson
function getLessonFiles(lessonId: string, starterCode: string): FileNode[] {
  // Different file structures based on course type
  const isExpress = lessonId.includes('express') || lessonId.includes('rest') || lessonId.includes('auth') || lessonId.includes('middleware') || lessonId.includes('routing') || lessonId.includes('login') || lessonId.includes('error-handling-api') || lessonId.includes('api-versioning') || lessonId.includes('request-validation') || lessonId.includes('auth-middleware') || lessonId.includes('integration-testing');
  const isDatabase = lessonId.includes('postgres') || lessonId.includes('sql') || lessonId.includes('schema') || lessonId.includes('transaction') || lessonId.includes('query-optim') || lessonId.includes('node-postgres');
  const isTesting = lessonId.includes('test');

  if (isExpress) {
    return [
      {
        name: 'src',
        type: 'folder',
        children: [
          { name: 'index.js', type: 'file', content: starterCode },
          { name: 'routes.js', type: 'file', content: '// Define your routes here\n' },
          { name: 'middleware.js', type: 'file', content: '// Middleware functions\n' },
        ]
      },
      { name: 'package.json', type: 'file', content: JSON.stringify({ name: 'express-app', version: '1.0.0', dependencies: { express: '^4.18.0' } }, null, 2) },
      { name: '.env', type: 'file', content: 'PORT=3000\nNODE_ENV=development\n' },
    ];
  }

  if (isDatabase) {
    return [
      {
        name: 'src',
        type: 'folder',
        children: [
          { name: 'index.js', type: 'file', content: starterCode },
          { name: 'db.js', type: 'file', content: '// Database connection\nconst { Pool } = require("pg");\n' },
          { name: 'queries.js', type: 'file', content: '// SQL queries\n' },
        ]
      },
      {
        name: 'migrations',
        type: 'folder',
        children: [
          { name: '001_create_users.sql', type: 'file', content: 'CREATE TABLE users (\n  id SERIAL PRIMARY KEY,\n  email VARCHAR(255) UNIQUE NOT NULL,\n  name VARCHAR(100)\n);\n' },
        ]
      },
      { name: 'package.json', type: 'file', content: JSON.stringify({ name: 'db-app', version: '1.0.0', dependencies: { pg: '^8.11.0' } }, null, 2) },
    ];
  }

  if (isTesting) {
    return [
      {
        name: 'src',
        type: 'folder',
        children: [
          { name: 'index.js', type: 'file', content: starterCode },
          { name: 'utils.js', type: 'file', content: '// Utility functions\n' },
        ]
      },
      {
        name: 'tests',
        type: 'folder',
        children: [
          { name: 'index.test.js', type: 'file', content: '// Tests go here\n' },
        ]
      },
      { name: 'package.json', type: 'file', content: JSON.stringify({ name: 'test-app', version: '1.0.0', devDependencies: { jest: '^29.0.0' } }, null, 2) },
    ];
  }

  // Default structure
  return [
    {
      name: 'src',
      type: 'folder',
      children: [
        { name: 'index.js', type: 'file', content: starterCode },
      ]
    },
    { name: 'package.json', type: 'file', content: JSON.stringify({ name: 'node-app', version: '1.0.0' }, null, 2) },
  ];
}

export default function LessonPage() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const navigate = useNavigate();
  const { markComplete, isCompleted } = useProgress();
  
  const course = getCourseById(courseId || '');
  const lesson = getLesson(courseId || '', lessonId || '');
  
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('learn');
  const [showSolution, setShowSolution] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [hintLevel, setHintLevel] = useState(0); // 0 = no hint, 1-3 = progressive hints
  const [isRunning, setIsRunning] = useState(false);
  const [showFileTree, setShowFileTree] = useState(true);

  const initialFiles = lesson ? getLessonFiles(lesson.id, lesson.exercise.starterCode) : [];
  const fileSystem = useFileSystem(initialFiles);

  // Reset file system when lesson changes
  useEffect(() => {
    if (lesson) {
      const newFiles = getLessonFiles(lesson.id, lesson.exercise.starterCode);
      fileSystem.setFiles(newFiles);
      fileSystem.openFile('src/index.js');
      setOutput('');
      setError(null);
      setIsCorrect(null);
      setHintLevel(0);
      setShowSolution(false);
      setActiveTab('learn');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId, lesson?.id]);

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

  const currentCode = fileSystem.activeFile ? fileSystem.getFileContent(fileSystem.activeFile) : '';

  const handleCodeChange = useCallback((value: string | undefined) => {
    if (fileSystem.activeFile) {
      fileSystem.updateFileContent(fileSystem.activeFile, value || '');
    }
  }, [fileSystem]);

  const handleRun = useCallback(() => {
    setIsRunning(true);
    setTimeout(() => {
      // Execute the main file (src/index.js)
      const mainCode = fileSystem.getFileContent('src/index.js');
      const result = executeCode(mainCode);
      setOutput(result.output);
      setError(result.error);
      setIsCorrect(null);
      setIsRunning(false);
    }, 300);
  }, [fileSystem]);

  const handleSubmit = useCallback(() => {
    if (!lesson || !course) return;
    setIsRunning(true);
    setTimeout(() => {
      const mainCode = fileSystem.getFileContent('src/index.js');
      const result = executeCode(mainCode);
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
  }, [fileSystem, lesson, course, markComplete]);

  const handleReset = useCallback(() => {
    if (!lesson) return;
    fileSystem.updateFileContent('src/index.js', lesson.exercise.starterCode);
    setOutput('');
    setError(null);
    setIsCorrect(null);
    setHintLevel(0);
  }, [lesson, fileSystem]);

  const handleShowSolution = useCallback(() => {
    if (!lesson) return;
    setShowSolution(true);
    fileSystem.updateFileContent('src/index.js', lesson.exercise.solution);
  }, [lesson, fileSystem]);

  const handleFileCreate = useCallback((path: string, isFolder: boolean) => {
    fileSystem.createFile(path, isFolder);
  }, [fileSystem]);

  const handleFileDelete = useCallback((path: string) => {
    fileSystem.deleteFile(path);
  }, [fileSystem]);

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
            <button
              onClick={() => setShowFileTree(!showFileTree)}
              className="px-3 py-1.5 text-sm rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              title="Toggle file explorer"
            >
              {showFileTree ? '◀ Hide Files' : '▶ Show Files'}
            </button>
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

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* File Tree Sidebar */}
        {showFileTree && (
          <div className="w-56 border-r border-white/10 flex-shrink-0 overflow-hidden">
            <FileTree
              files={fileSystem.files}
              activeFile={fileSystem.activeFile}
              openFiles={fileSystem.openFiles}
              onFileSelect={fileSystem.openFile}
              onFileClose={fileSystem.closeFile}
              onFileCreate={handleFileCreate}
              onFileDelete={handleFileDelete}
            />
          </div>
        )}

        {/* Left Panel - Lesson Content */}
        <div className="w-[380px] border-r border-white/10 flex flex-col overflow-hidden flex-shrink-0">
          {/* Tabs */}
          <div className="flex border-b border-white/10 flex-shrink-0">
            <button
              onClick={() => setActiveTab('learn')}
              className={`px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'learn'
                  ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-500/5'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              📖 Learn
            </button>
            <button
              onClick={() => setActiveTab('exercise')}
              className={`px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'exercise'
                  ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-500/5'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              🎯 Exercise
            </button>
            <button
              onClick={() => setActiveTab('solution')}
              className={`px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'solution'
                  ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-500/5'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              💡
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-5">
            {activeTab === 'learn' && (
              <div className="prose prose-invert max-w-none">
                {/* Version Badge */}
                {lesson.nodeVersion && (
                  <div className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs">
                    <span>⚡</span>
                    <span>Tested on Node.js {lesson.nodeVersion}</span>
                  </div>
                )}

                {/* Prerequisites */}
                {lesson.prerequisites && lesson.prerequisites.length > 0 && (
                  <div className="mb-4 p-3 rounded-lg bg-purple-500/5 border border-purple-500/20">
                    <h4 className="text-sm font-medium text-purple-300 mb-2 flex items-center gap-1">
                      <span>📋</span> Prerequisites
                    </h4>
                    <ul className="text-xs text-purple-200/70 space-y-1">
                      {lesson.prerequisites.map((prereq, idx) => (
                        <li key={idx} className="flex items-center gap-1">
                          <span>•</span>
                          <span>{prereq}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Spiral Learning Connections */}
                {lesson.spiralConnections && lesson.spiralConnections.length > 0 && (
                  <div className="mb-4 p-3 rounded-lg bg-green-500/5 border border-green-500/20">
                    <h4 className="text-sm font-medium text-green-300 mb-2 flex items-center gap-1">
                      <span>🔄</span> Building On Previous Concepts
                    </h4>
                    <div className="space-y-2">
                      {lesson.spiralConnections.map((connection, idx) => (
                        <div key={idx} className="text-xs text-green-200/70">
                          <span className="font-medium text-green-300">{connection.concept}</span>
                          <span className="text-gray-500"> from </span>
                          <span className="text-green-300">{connection.fromLesson}</span>
                          <span className="text-gray-500"> → </span>
                          <span>{connection.connection}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Deprecation Warnings */}
                {lesson.deprecationWarnings && lesson.deprecationWarnings.length > 0 && (
                  <div className="mb-4 p-3 rounded-lg bg-red-500/5 border border-red-500/20">
                    <h4 className="text-sm font-medium text-red-300 mb-2 flex items-center gap-1">
                      <span>⚠️</span> Deprecation Warnings
                    </h4>
                    <ul className="text-xs text-red-200/70 space-y-1">
                      {lesson.deprecationWarnings.map((warning, idx) => (
                        <li key={idx} className="flex items-start gap-1">
                          <span>•</span>
                          <span>{warning}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div
                  className="text-gray-300 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: formatMarkdown(lesson.theory) }}
                />
                <div className="mt-6">
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

                {/* Further Reading Section */}
                {lesson.furtherReading && lesson.furtherReading.length > 0 && (
                  <div className="mt-6 p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20">
                    <h3 className="text-sm font-bold text-indigo-300 mb-3 flex items-center gap-2">
                      <span>📚</span> Further Reading
                    </h3>
                    <ul className="space-y-2">
                      {lesson.furtherReading.map((resource, idx) => (
                        <li key={idx}>
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-indigo-300 hover:text-indigo-200 flex items-center gap-2 group"
                          >
                            <span className="text-indigo-400">
                              {resource.type === 'docs' && '📖'}
                              {resource.type === 'blog' && '📝'}
                              {resource.type === 'book' && '📕'}
                              {resource.type === 'video' && '🎥'}
                            </span>
                            <span className="group-hover:underline">{resource.title}</span>
                            <span className="text-indigo-500 text-[10px] uppercase">({resource.type})</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'exercise' && (
              <div>
                <h3 className="text-lg font-bold text-cyan-300 mb-4 flex items-center gap-2">
                  <span>🎯</span> Exercise
                </h3>
                <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-xl p-4 mb-4">
                  <p className="text-gray-300 leading-relaxed text-sm">{lesson.exercise.instructions}</p>
                </div>

                {/* Progressive Hints System */}
                {(lesson.exercise.hints || lesson.exercise.hint) && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-yellow-400">💡 Hints</span>
                      {hintLevel > 0 && (
                        <span className="text-xs text-gray-500">Level {hintLevel}/3</span>
                      )}
                    </div>
                    
                    {/* Hint Level 1 */}
                    {hintLevel === 0 && (
                      <button
                        onClick={() => setHintLevel(1)}
                        className="text-sm text-yellow-400 hover:text-yellow-300 flex items-center gap-1"
                      >
                        <span>▶</span> Show Hint 1 (Basic)
                      </button>
                    )}
                    
                    {hintLevel >= 1 && (
                      <div className="mt-2 p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
                        <p className="text-sm text-yellow-200/80">
                          {lesson.exercise.hints?.[0] || lesson.exercise.hint || 'Try breaking the problem into smaller steps.'}
                        </p>
                        {hintLevel === 1 && (
                          <button
                            onClick={() => setHintLevel(2)}
                            className="mt-2 text-xs text-yellow-400 hover:text-yellow-300"
                          >
                            Need more help? → Show Hint 2
                          </button>
                        )}
                      </div>
                    )}
                    
                    {/* Hint Level 2 */}
                    {hintLevel >= 2 && (
                      <div className="mt-2 p-3 bg-orange-500/5 border border-orange-500/20 rounded-lg">
                        <p className="text-sm text-orange-200/80">
                          {lesson.exercise.hints?.[1] || 'Check the documentation for the specific method or pattern needed.'}
                        </p>
                        {hintLevel === 2 && (
                          <button
                            onClick={() => setHintLevel(3)}
                            className="mt-2 text-xs text-orange-400 hover:text-orange-300"
                          >
                            Still stuck? → Show Hint 3 (Detailed)
                          </button>
                        )}
                      </div>
                    )}
                    
                    {/* Hint Level 3 */}
                    {hintLevel >= 3 && (
                      <div className="mt-2 p-3 bg-red-500/5 border border-red-500/20 rounded-lg">
                        <p className="text-sm text-red-200/80">
                          {lesson.exercise.hints?.[2] || 'Review the example code and compare it with your implementation.'}
                        </p>
                      </div>
                    )}
                    
                    {/* Reset hints */}
                    {hintLevel > 0 && (
                      <button
                        onClick={() => setHintLevel(0)}
                        className="mt-2 text-xs text-gray-500 hover:text-gray-400"
                      >
                        ↺ Reset hints
                      </button>
                    )}
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Expected Output:</h4>
                  <div className="bg-gray-900 rounded-lg border border-white/10 p-3">
                    <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap">{lesson.exercise.expectedOutput}</pre>
                  </div>
                </div>

                {isCorrect !== null && (
                  <div className={`mt-4 p-3 rounded-xl border ${
                    isCorrect ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'
                  }`}>
                    {isCorrect ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🎉</span>
                        <div>
                          <p className="font-bold text-green-300 text-sm">Correct!</p>
                          <p className="text-xs text-green-400/70">Great job!</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-xl">❌</span>
                        <div>
                          <p className="font-bold text-red-300 text-sm">Not quite right</p>
                          <p className="text-xs text-red-400/70">Check your output.</p>
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
                  <div className="text-center py-8">
                    <p className="text-gray-400 mb-3 text-sm">Try the exercise first!</p>
                    <button
                      onClick={handleShowSolution}
                      className="px-4 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 hover:bg-yellow-500/20 transition-colors text-sm"
                    >
                      Show Solution
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="bg-gray-900 rounded-xl border border-white/10 overflow-hidden">
                      <pre className="p-4 text-sm overflow-x-auto">
                        <code className="text-gray-300">{lesson.exercise.solution}</code>
                      </pre>
                    </div>
                    <button
                      onClick={() => { handleShowSolution(); setActiveTab('exercise'); }}
                      className="mt-3 px-3 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 hover:bg-cyan-500/20 transition-colors text-xs"
                    >
                      Load into editor →
                    </button>

                    {/* Alternative Solutions */}
                    {lesson.exercise.alternativeSolutions && lesson.exercise.alternativeSolutions.length > 0 && (
                      <div className="mt-6">
                        <h4 className="text-sm font-bold text-purple-300 mb-3 flex items-center gap-2">
                          <span>🔀</span> Alternative Approaches
                        </h4>
                        <div className="space-y-4">
                          {lesson.exercise.alternativeSolutions.map((alt, idx) => (
                            <div key={idx} className="p-4 rounded-lg bg-purple-500/5 border border-purple-500/20">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-medium text-purple-300">Approach {idx + 1}:</span>
                                <span className="text-xs text-purple-200/70">{alt.approach}</span>
                              </div>
                              <div className="bg-gray-900 rounded-lg border border-white/10 overflow-hidden mb-2">
                                <pre className="p-3 text-xs overflow-x-auto">
                                  <code className="text-gray-300">{alt.code}</code>
                                </pre>
                              </div>
                              <div className="text-xs text-purple-200/60">
                                <span className="font-medium text-purple-300">Trade-offs:</span> {alt.tradeoffs}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Code Editor */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* File Tabs */}
          <FileTabs
            openFiles={fileSystem.openFiles}
            activeFile={fileSystem.activeFile}
            onSelect={fileSystem.openFile}
            onClose={fileSystem.closeFile}
          />

          {/* Monaco Editor */}
          <div className="flex-1 min-h-0">
            {fileSystem.activeFile ? (
              <Editor
                height="100%"
                defaultLanguage="javascript"
                value={currentCode}
                onChange={handleCodeChange}
                theme="vs-dark"
                options={{
                  fontSize: 14,
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
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
            ) : (
              <div className="h-full flex items-center justify-center text-gray-600">
                <p>Select a file from the explorer to edit</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 px-4 py-2.5 bg-gray-900 border-t border-white/10 flex-shrink-0">
            <button
              onClick={handleRun}
              disabled={isRunning}
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium text-sm transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isRunning ? <span className="animate-spin">⚙</span> : <span>▶</span>}
              Run
            </button>
            <button
              onClick={handleSubmit}
              disabled={isRunning}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium text-sm transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50 flex items-center gap-2"
            >
              {isRunning ? <span className="animate-spin">⚙</span> : <span>✓</span>}
              Submit
            </button>
            <button
              onClick={handleReset}
              className="px-3 py-2 text-xs rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              ↺ Reset
            </button>
            {isCorrect && nextLesson && (
              <Link
                to={`/course/${course.id}/lesson/${nextLesson.id}`}
                className="ml-auto px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white font-medium text-sm transition-colors flex items-center gap-2"
              >
                Next Lesson →
              </Link>
            )}
          </div>

          {/* Output Panel */}
          <div className="h-36 border-t border-white/10 flex flex-col flex-shrink-0">
            <div className="flex items-center justify-between px-4 py-1.5 bg-gray-900/50 border-b border-white/10">
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
            <div className="flex-1 overflow-y-auto p-3 bg-gray-950 font-mono text-xs">
              {error && (
                <div className="text-red-400 mb-1">
                  <span className="text-red-500 font-bold">Error: </span>{error}
                </div>
              )}
              {output ? (
                <pre className="text-green-400 whitespace-pre-wrap">{output}</pre>
              ) : !error ? (
                <span className="text-gray-600 italic">Click "Run" to see output...</span>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatMarkdown(text: string): string {
  return text
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-white mt-5 mb-2">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 class="text-base font-bold text-cyan-300 mt-3 mb-1.5">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
    .replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 rounded bg-gray-800 text-cyan-300 text-xs font-mono">$1</code>')
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="bg-gray-900 rounded-lg p-3 my-2 overflow-x-auto border border-white/10"><code class="text-xs text-gray-300">$2</code></pre>')
    .replace(/^- (.+)$/gm, '<li class="ml-3 text-gray-300 mb-0.5 text-sm">• $1</li>')
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>');
}
