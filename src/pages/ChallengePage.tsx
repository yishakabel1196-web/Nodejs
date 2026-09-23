import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { getChallenge } from '../data/challenges';
import { useStreak } from '../hooks/useStreak';
import { useBadges, ALL_BADGES } from '../hooks/useBadges';

export default function ChallengePage() {
  const { day } = useParams<{ day: string }>();
  const navigate = useNavigate();
  const challengeDay = parseInt(day || '1');
  
  const challenge = getChallenge(challengeDay);
  const { completeDay, isDayCompleted, completedDays } = useStreak();
  const { checkAndAwardBadges } = useBadges();

  const [code, setCode] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [newBadges, setNewBadges] = useState<string[]>([]);

  useEffect(() => {
    if (challenge) {
      setCode('');
      setAttempts(0);
      setShowSolution(false);
      setValidationResult(null);
      setNewBadges([]);
    }
  }, [challengeDay]);

  if (!challenge) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Challenge Not Found</h1>
          <Link to="/" className="text-orange-400 hover:text-orange-300">← Back to home</Link>
        </div>
      </div>
    );
  }

  const isCompleted = isDayCompleted(challengeDay);
  const maxAttempts = 3;

  const handleRun = () => {
    setIsRunning(true);
    
    // Simulate validation
    setTimeout(() => {
      // For now, we'll just check if there's any code
      const hasCode = code.trim().length > 0;
      
      const result = {
        passed: hasCode,
        testResults: challenge.testCases.map(tc => ({
          description: tc.description,
          passed: hasCode,
          request: tc.request,
          expectedStatus: tc.expectedStatus,
          actualStatus: hasCode ? tc.expectedStatus : null,
          expectedBody: tc.expectedBody,
          actualBody: hasCode ? tc.expectedBody : null
        }))
      };
      
      setValidationResult(result);
      setIsRunning(false);
    }, 500);
  };

  const handleSubmit = () => {
    setIsRunning(true);
    
    setTimeout(() => {
      const hasCode = code.trim().length > 0;
      
      const result = {
        passed: hasCode,
        testResults: challenge.testCases.map(tc => ({
          description: tc.description,
          passed: hasCode,
          request: tc.request,
          expectedStatus: tc.expectedStatus,
          actualStatus: hasCode ? tc.expectedStatus : null,
          expectedBody: tc.expectedBody,
          actualBody: hasCode ? tc.expectedBody : null
        }))
      };
      
      setValidationResult(result);
      
      if (result.passed && !isCompleted) {
        // Mark day as complete
        completeDay(challengeDay);
        
        // Check for new badges
        const progress = {
          completedDays: [...completedDays, challengeDay],
          currentStreak: 1, // This would be calculated properly
          longestStreak: 1
        };
        const earned = checkAndAwardBadges(progress);
        setNewBadges(earned);
      } else if (!result.passed) {
        setAttempts(prev => prev + 1);
      }
      
      setIsRunning(false);
    }, 500);
  };

  const handleShowSolution = () => {
    setShowSolution(true);
    setCode(challenge.solution);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-gray-900/80 backdrop-blur-sm flex-shrink-0">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-gray-400 hover:text-white transition-colors">
              ← Home
            </Link>
            <span className="text-gray-600">/</span>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-lg font-bold">
                {challenge.day}
              </div>
              <div>
                <div className="text-sm text-gray-400">Day {challenge.day}</div>
                <div className="font-bold">{challenge.title}</div>
              </div>
            </div>
            {isCompleted && (
              <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/20">
                ✓ Complete
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {challengeDay > 1 && (
              <Link
                to={`/challenge/${challengeDay - 1}`}
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm transition-colors"
              >
                ← Previous
              </Link>
            )}
            {challengeDay < 30 && (
              <Link
                to={`/challenge/${challengeDay + 1}`}
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm transition-colors"
              >
                Next →
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Challenge Spec */}
        <div className="w-1/3 border-r border-white/10 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6">
            {/* Challenge Type Badge */}
            <div className="mb-4">
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                challenge.type === 'A' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/20' :
                challenge.type === 'B' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/20' :
                'bg-purple-500/20 text-purple-400 border border-purple-500/20'
              }`}>
                Type {challenge.type}: {
                  challenge.type === 'A' ? 'Write this route' :
                  challenge.type === 'B' ? 'Debug this route' :
                  'Design schema + route'
                }
              </span>
            </div>

            {/* Spec */}
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-3 text-orange-400">Challenge</h2>
              <div className="bg-orange-500/5 border border-orange-500/20 rounded-xl p-4">
                <p className="text-gray-300 leading-relaxed">{challenge.spec}</p>
              </div>
            </div>

            {/* Test Cases */}
            <div className="mb-6">
              <h3 className="text-sm font-bold mb-3 text-gray-400">Test Cases ({challenge.testCases.length})</h3>
              <div className="space-y-2">
                {challenge.testCases.map((tc, idx) => (
                  <div key={idx} className="bg-white/5 border border-white/10 rounded-lg p-3 text-xs">
                    <div className="font-medium text-gray-300 mb-1">{tc.description}</div>
                    <div className="text-gray-500">
                      {tc.request.method} {tc.request.path}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hints */}
            {challenge.hints && challenge.hints.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-bold mb-3 text-gray-400">Hints</h3>
                <div className="space-y-2">
                  {challenge.hints.map((hint, idx) => (
                    <div key={idx} className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-3 text-xs text-yellow-200/80">
                      {hint}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Attempts Counter */}
            {!isCompleted && attempts > 0 && (
              <div className="mb-6">
                <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3 text-sm">
                  <div className="text-red-400 font-medium">
                    Attempts: {attempts} / {maxAttempts}
                  </div>
                  {attempts >= maxAttempts && (
                    <button
                      onClick={handleShowSolution}
                      className="mt-2 text-xs text-orange-400 hover:text-orange-300 underline"
                    >
                      Show solution
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* New Badges */}
            {newBadges.length > 0 && (
              <div className="mb-6">
                <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                  <div className="text-green-400 font-bold mb-2">🎉 New Badges Earned!</div>
                  <div className="space-y-2">
                    {newBadges.map(badgeId => {
                      const badge = ALL_BADGES.find(b => b.id === badgeId);
                      if (!badge) return null;
                      return (
                        <div key={badgeId} className="flex items-center gap-2 text-sm">
                          <span className="text-2xl">{badge.icon}</span>
                          <div>
                            <div className="font-medium">{badge.name}</div>
                            <div className="text-xs text-gray-400">{badge.description}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Code Editor */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Editor Header */}
          <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-white/10 flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/60"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/60"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/60"></div>
              <span className="text-xs text-gray-500 ml-2">route.js</span>
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
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                padding: { top: 16 },
                lineNumbers: 'on',
                renderLineHighlight: 'line',
                automaticLayout: true,
                tabSize: 2,
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
              {isRunning ? <span className="animate-spin">⚙</span> : <span>▶</span>}
              Run Tests
            </button>
            <button
              onClick={handleSubmit}
              disabled={isRunning || isCompleted}
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-medium text-sm transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50 flex items-center gap-2"
            >
              {isRunning ? <span className="animate-spin">⚙</span> : <span>✓</span>}
              Submit
            </button>
            {showSolution && (
              <button
                onClick={() => {
                  setShowSolution(false);
                  setCode('');
                }}
                className="px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-sm transition-colors"
              >
                Reset
              </button>
            )}
          </div>

          {/* Validation Results */}
          {validationResult && (
            <div className="h-64 border-t border-white/10 flex flex-col flex-shrink-0">
              <div className="flex items-center justify-between px-4 py-2 bg-gray-900/50 border-b border-white/10">
                <span className="text-sm font-medium text-gray-400">
                  Test Results {validationResult.passed ? '✓' : '✗'}
                </span>
              </div>
              <div className="flex-1 overflow-y-auto p-4 bg-gray-950">
                <div className="space-y-3">
                  {validationResult.testResults.map((test: any, idx: number) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg border ${
                        test.passed
                          ? 'bg-green-500/5 border-green-500/20'
                          : 'bg-red-500/5 border-red-500/20'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{test.passed ? '✓' : '✗'}</span>
                        <span className="text-sm font-medium">{test.description}</span>
                      </div>
                      
                      {!test.passed && (
                        <div className="text-xs space-y-1 text-gray-400">
                          <div>
                            <span className="text-gray-500">Request:</span>{' '}
                            {test.request.method} {test.request.path}
                          </div>
                          {test.request.body && (
                            <div>
                              <span className="text-gray-500">Body:</span>{' '}
                              {JSON.stringify(test.request.body)}
                            </div>
                          )}
                          <div>
                            <span className="text-gray-500">Expected:</span>{' '}
                            <span className="text-green-400">{test.expectedStatus}</span>{' '}
                            {JSON.stringify(test.expectedBody)}
                          </div>
                          <div>
                            <span className="text-gray-500">Actual:</span>{' '}
                            <span className="text-red-400">{test.actualStatus}</span>{' '}
                            {JSON.stringify(test.actualBody)}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
