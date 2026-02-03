'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { useUser } from '@/contexts/user-context';
import { Card } from '@/components/ui/card';
import Header from '@/components/header';
import { useEffect, useState, useMemo } from 'react';
import { gamesData } from '@/lib/games';

interface GameProgress {
  id: number;
  name: string;
  emoji: string;
  progress: number;
  level: number;
  score: number;
  timesPlayed: number;
  lastPlayed: string;
  status: 'beginner' | 'intermediate' | 'advanced';
  timeSpent?: number;
}

export default function Progress() {
  const { isAuthenticated, isLoading } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  const gameProgress: GameProgress[] = useMemo(() => {
    if (!user?.games) return [];

    return Object.entries(user.games).map(([gameKey, data]: [string, any], index) => {
      const metadata = Object.values(gamesData).find(g => g.name === data.game);

      return {
        id: index,
        name: data.game,
        emoji: metadata?.emoji || '🎮',
        progress: Math.min(100, (data.level / 20) * 100), // Assuming level 20 is a milestone
        level: data.level,
        score: data.scoreDelta || 0,
        timesPlayed: data.timesPlayed || 1,
        lastPlayed: 'Recently',
        status: data.level > 15 ? 'advanced' : data.level > 5 ? 'intermediate' : 'beginner',
        timeSpent: data.timeSpent || 0
      };
    });
  }, [user?.games]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'advanced':
        return 'text-green-600 bg-green-50';
      case 'intermediate':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-primary bg-primary/10';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'advanced':
        return '⭐ Advanced';
      case 'intermediate':
        return '🌟 Intermediate';
      default:
        return '✨ Beginner';
    }
  };

  const sortedGames = useMemo(() => {
    return [...gameProgress].sort((a, b) => {
      switch (sortBy) {
        case 'progress':
          return b.progress - a.progress;
        case 'level':
          return b.level - a.level;
        case 'score':
          return b.score - a.score;
        case 'time':
          return (b.timeSpent || 0) - (a.timeSpent || 0);
        default:
          return a.name.localeCompare(b.name);
      }
    });
  }, [gameProgress, sortBy]);

  const totalScore = user?.totalScore || 0;
  const totalTimesPlayed = gameProgress.reduce((sum, game) => sum + game.timesPlayed, 0);
  const averageProgress = gameProgress.length > 0
    ? Math.round(gameProgress.reduce((sum, game) => sum + game.progress, 0) / gameProgress.length)
    : 0;

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-primary mb-2">Your Learning Progress 📈</h1>
          <p className="text-lg text-foreground/70">Track your performance across all games and see how you're improving!</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 text-center shadow-lg">
            <div className="text-4xl mb-2">🎮</div>
            <p className="text-3xl font-bold text-primary">{user?.gameCount}</p>
            <p className="text-foreground/70 font-semibold">Games</p>
          </Card>
          <Card className="p-6 text-center shadow-lg">
            <div className="text-4xl mb-2">🏆</div>
            <p className="text-3xl font-bold text-primary">{user?.totalScore}</p>
            <p className="text-foreground/70 font-semibold">Total Score</p>
          </Card>
          <Card className="p-6 text-center shadow-lg">
            <div className="text-4xl mb-2">⏱️</div>
            <p className="text-3xl font-bold text-primary">
              {user?.totalTimeSpent ?
                `${Math.floor(user.totalTimeSpent / 60)}m ${user.totalTimeSpent % 60}s` :
                '0s'}
            </p>
            <p className="text-foreground/70 font-semibold">Total Time</p>
          </Card>
          <Card className="p-6 text-center shadow-lg">
            <div className="text-4xl mb-2">📊</div>
            <p className="text-3xl font-bold text-primary">{averageProgress}%</p>
            <p className="text-foreground/70 font-semibold">Avg Progress</p>
          </Card>
        </div>

        {/* Sort Controls */}
        <div className="mb-8 flex flex-wrap gap-3">
          <span className="self-center font-semibold text-foreground">Sort by:</span>
          {['name', 'progress', 'level', 'score', 'time'].map((option) => (
            <button
              key={option}
              onClick={() => setSortBy(option)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${sortBy === option
                ? 'bg-primary text-white'
                : 'bg-white border-2 border-primary text-primary hover:bg-primary/10'
                }`}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>

        {/* Games Progress List */}
        <div className="space-y-4">
          {sortedGames.map((game) => (
            <Card key={game.id} className="p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                {/* Game Info */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="text-5xl flex-shrink-0">{game.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-2xl font-bold text-foreground mb-2">{game.name}</h3>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <span className={`px-3 py-1 rounded-full font-semibold ${getStatusColor(game.status)}`}>
                        {getStatusLabel(game.status)}
                      </span>
                      <span className="text-foreground/70">Level <span className="font-bold text-primary">{game.level}</span></span>
                      <span className="text-foreground/70">Last played: <span className="font-semibold">{game.lastPlayed}</span></span>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4 md:gap-6 w-full md:w-auto">
                  <div className="text-center">
                    <p className="text-xl font-bold text-primary">{game.score}</p>
                    <p className="text-xs text-foreground/70">Score</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-primary">{game.level}</p>
                    <p className="text-xs text-foreground/70">Level</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-primary">{game.progress}%</p>
                    <p className="text-xs text-foreground/70">Progress</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-primary">
                      {(game as any).timeSpent ? `${Math.floor((game as any).timeSpent / 60)}m` : '0m'}
                    </p>
                    <p className="text-xs text-foreground/70">Time</p>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-foreground">Game Completion</span>
                  <span className="text-sm font-bold text-primary">{game.progress}%</span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
                    style={{ width: `${game.progress}%` }}
                  ></div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Motivational Section */}
        <Card className="mt-12 p-8 bg-gradient-to-r from-primary to-secondary text-white text-center shadow-lg">
          <div className="text-5xl mb-4">🌟</div>
          <h2 className="text-2xl font-bold mb-3">You're Doing Amazing!</h2>
          <p className="text-lg text-white/90 mb-6">
            Keep up the great work! Your consistent effort is paying off.
            {averageProgress >= 75 ? " You're a superstar! 🚀" : " Just a little more to reach mastery!"}
          </p>
          <p className="text-sm text-white/80">
            Complete more games to unlock new achievements and challenges!
          </p>
        </Card>
      </div>
    </main>
  );
}
