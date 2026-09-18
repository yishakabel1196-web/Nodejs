import { useParams, Link, useNavigate } from 'react-router-dom';
import { getCourse } from '../data/courses';
import { useProgress } from '../hooks/useProgress';

export default function CoursePage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { isCompleted, getCourseProgress } = useProgress();
  
  const course = getCourse(courseId || '');
  
  if (!course) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Course Not Found</h1>
          <Link to="/" className="text-cyan-400 hover:text-cyan-300">← Back to courses</Link>
        </div>
      </div>
    );
  }

  const progress = getCourseProgress(course.id, course.lessons.length);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ← Back
            </button>
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${course.color} flex items-center justify-center text-sm`}>
              {course.icon}
            </div>
            <span className="font-bold">{course.title}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <div className="w-24 h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${course.color} rounded-full transition-all duration-500`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-cyan-400 font-medium">{progress}%</span>
          </div>
        </div>
      </header>

      {/* Course Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${course.color} flex items-center justify-center text-4xl mx-auto mb-6 shadow-2xl`}>
            {course.icon}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.title}</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">{course.description}</p>
        </div>

        {/* Lessons List */}
        <div className="space-y-3">
          {course.lessons.map((lesson, index) => {
            const completed = isCompleted(course.id, lesson.id);
            return (
              <Link
                key={lesson.id}
                to={`/course/${course.id}/lesson/${lesson.id}`}
                className={`group flex items-center gap-4 p-5 rounded-xl border transition-all duration-200 ${
                  completed
                    ? 'bg-green-500/5 border-green-500/20 hover:border-green-500/40'
                    : 'bg-white/5 border-white/10 hover:border-cyan-500/30 hover:bg-white/[0.07]'
                }`}
              >
                {/* Number/Check */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                  completed
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-gray-800 text-gray-400 group-hover:bg-cyan-500/20 group-hover:text-cyan-400'
                }`}>
                  {completed ? '✓' : index + 1}
                </div>

                {/* Lesson Info */}
                <div className="flex-1 min-w-0">
                  <h3 className={`font-semibold group-hover:text-cyan-300 transition-colors ${
                    completed ? 'text-green-300' : 'text-white'
                  }`}>
                    {lesson.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-0.5 truncate">
                    {lesson.exercise.instructions.slice(0, 80)}...
                  </p>
                </div>

                {/* Arrow */}
                <div className="text-gray-600 group-hover:text-cyan-400 transition-colors">
                  →
                </div>
              </Link>
            );
          })}
        </div>

        {/* Course complete message */}
        {progress === 100 && (
          <div className="mt-10 text-center p-8 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
            <div className="text-4xl mb-3">🎉</div>
            <h3 className="text-xl font-bold text-green-300 mb-2">Course Completed!</h3>
            <p className="text-gray-400">Great job! You've finished all lessons in {course.title}.</p>
            <Link to="/" className="inline-block mt-4 px-6 py-2 rounded-lg bg-green-500/20 text-green-300 hover:bg-green-500/30 transition-colors text-sm font-medium">
              Continue Learning →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
