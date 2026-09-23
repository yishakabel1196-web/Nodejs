import { Link } from 'react-router-dom';
import { useStreak } from '../hooks/useStreak';
import { useBadges } from '../hooks/useBadges';
import { challenges } from '../data/challenges';

export default function HomePage() {
  const { currentStreak, longestStreak, completedDays, isDayCompleted } = useStreak();
  const { getEarnedBadgeDetails } = useBadges();

  const earnedBadges = getEarnedBadgeDetails();

  // Determine which day is available
  const today = new Date();
  const currentDay = Math.min(completedDays.length + 1, 30);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-lg font-bold">
              DR
            </div>
            <span className="text-xl font-bold">Daily Routes</span>
          </div>
          
          <div className="flex items-center gap-6">
            {/* Streak Counter */}
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔥</span>
              <div>
                <div className="text-2xl font-bold text-orange-400">{currentStreak}</div>
                <div className="text-xs text-gray-400">day streak</div>
              </div>
            </div>

            {/* Badges Preview */}
            {earnedBadges.length > 0 && (
              <div className="flex items-center gap-1">
                {earnedBadges.slice(0, 5).map(badge => (
                  <span key={badge.id} className="text-xl" title={badge.name}>
                    {badge.icon}
                  </span>
                ))}
                {earnedBadges.length > 5 && (
                  <span className="text-sm text-gray-400">+{earnedBadges.length - 5}</span>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 px-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-900/20 via-transparent to-transparent"></div>
        
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-orange-200 to-red-400 bg-clip-text text-transparent">
              One Route Per Day
            </span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            Build a complete blog platform in 30 days. No hand-holding. Real-world complexity from Day 1.
          </p>

          {/* Today's Challenge Card */}
          <div className="max-w-2xl mx-auto">
            <Link
              to={`/challenge/${currentDay}`}
              className="block bg-gradient-to-br from-orange-500/10 to-red-500/10 border-2 border-orange-500/30 rounded-2xl p-8 hover:border-orange-500/50 transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-xl font-bold">
                    {currentDay}
                  </div>
                  <div className="text-left">
                    <div className="text-sm text-orange-400 font-medium">Today's Challenge</div>
                    <div className="text-xl font-bold group-hover:text-orange-300 transition-colors">
                      {challenges[currentDay - 1]?.title || 'Complete the platform!'}
                    </div>
                  </div>
                </div>
                <div className="text-3xl group-hover:translate-x-1 transition-transform">→</div>
              </div>
              
              <p className="text-gray-300 text-left">
                {challenges[currentDay - 1]?.spec || 'You\'ve completed all 30 challenges! 🎉'}
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Calendar View */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">30-Day Journey</h2>
        
        <div className="grid grid-cols-7 gap-3 max-w-3xl mx-auto">
          {challenges.map((challenge) => {
            const completed = isDayCompleted(challenge.day);
            const isCurrent = challenge.day === currentDay;
            const isLocked = challenge.day > currentDay;

            return (
              <Link
                key={challenge.day}
                to={isLocked ? '#' : `/challenge/${challenge.day}`}
                className={`aspect-square rounded-xl flex flex-col items-center justify-center p-2 transition-all ${
                  completed
                    ? 'bg-green-500/20 border-2 border-green-500/40 hover:border-green-500/60'
                    : isCurrent
                    ? 'bg-orange-500/20 border-2 border-orange-500/40 hover:border-orange-500/60 animate-pulse'
                    : isLocked
                    ? 'bg-gray-800/50 border-2 border-gray-700/40 cursor-not-allowed opacity-50'
                    : 'bg-gray-800/50 border-2 border-gray-700/40 hover:border-gray-600/60'
                }`}
                onClick={(e) => isLocked && e.preventDefault()}
              >
                <div className={`text-2xl font-bold ${
                  completed ? 'text-green-400' : isCurrent ? 'text-orange-400' : 'text-gray-400'
                }`}>
                  {challenge.day}
                </div>
                <div className="text-xs text-center text-gray-400 mt-1 line-clamp-2">
                  {completed ? '✓' : isLocked ? '🔒' : challenge.type}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-6 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-500/20 border border-green-500/40"></div>
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-orange-500/20 border border-orange-500/40"></div>
            <span>Today</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gray-800/50 border border-gray-700/40"></div>
            <span>Locked</span>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
            <div className="text-4xl font-bold text-orange-400 mb-2">{completedDays.length}</div>
            <div className="text-gray-400">Challenges Completed</div>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
            <div className="text-4xl font-bold text-orange-400 mb-2">{currentStreak}</div>
            <div className="text-gray-400">Current Streak</div>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
            <div className="text-4xl font-bold text-orange-400 mb-2">{longestStreak}</div>
            <div className="text-gray-400">Longest Streak</div>
          </div>
        </div>
      </section>

      {/* Badges Section */}
      {earnedBadges.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 pb-16">
          <h2 className="text-2xl font-bold mb-6 text-center">Earned Badges</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
            {earnedBadges.map(badge => (
              <div
                key={badge.id}
                className="bg-white/5 border border-white/10 rounded-xl p-4 text-center hover:bg-white/10 transition-colors"
                title={badge.description}
              >
                <div className="text-4xl mb-2">{badge.icon}</div>
                <div className="text-sm font-medium">{badge.name}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-500 text-sm">
          <p>Daily Routes — Learn Node.js by building one route per day</p>
        </div>
      </footer>
    </div>
  );
}
