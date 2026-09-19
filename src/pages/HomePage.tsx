import { Link } from 'react-router-dom';
import { courses } from '../data/courses';
import { useProgress } from '../hooks/useProgress';

export default function HomePage() {
  const { getCourseProgress, getTotalProgress } = useProgress();
  const totalLessons = courses.reduce((sum, c) => sum + c.lessons.length, 0);
  const overallProgress = getTotalProgress(totalLessons);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-lg font-bold">
              N
            </div>
            <span className="text-xl font-bold">Node.js Academy</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-400">
              <span>Overall Progress:</span>
              <div className="w-32 h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
              <span className="text-cyan-400 font-medium">{overallProgress}%</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden py-20 px-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent"></div>
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-sm mb-8">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            Interactive Learning Platform
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-cyan-200 to-blue-400 bg-clip-text text-transparent">
              Master Node.js
            </span>
            <br />
            <span className="text-gray-300">by Writing Code</span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            Learn Node.js through interactive lessons with a built-in code editor. 
            Write real code, see instant results, and track your progress.
          </p>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <span className="text-cyan-400">⚡</span>
              <span>Interactive Terminal</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-cyan-400">📚</span>
              <span>{courses.length} Courses</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-cyan-400">🎯</span>
              <span>{totalLessons} Lessons</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-cyan-400">🏆</span>
              <span>Progress Tracking</span>
            </div>
          </div>
        </div>
      </section>

      {/* Course Cards */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <h2 className="text-2xl font-bold mb-8 text-center">Choose Your Path</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {courses.map((course) => {
            const progress = getCourseProgress(course.id, course.lessons.length);
            return (
              <Link
                key={course.id}
                to={`/course/${course.id}`}
                className="group block bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-cyan-500/30 hover:bg-white/[0.07] transition-all duration-300"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${course.color} flex items-center justify-center text-2xl shadow-lg`}>
                    {course.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold group-hover:text-cyan-300 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">{course.lessons.length} lessons</p>
                  </div>
                </div>
                
                <p className="text-gray-400 text-sm mb-6">{course.description}</p>
                
                {/* Progress bar */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${course.color} rounded-full transition-all duration-500`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-500 font-medium">{progress}%</span>
                </div>

                {progress === 100 && (
                  <div className="mt-3 text-sm text-green-400 flex items-center gap-1">
                    <span>✓</span> Completed
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-500 text-sm">
          <p>Node.js Academy — Learn by doing. Built with React, Monaco Editor & ❤️</p>
        </div>
      </footer>
    </div>
  );
}
