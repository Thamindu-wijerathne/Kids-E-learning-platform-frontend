'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Card } from '@/components/ui/card';
import Header from '@/components/header';
import { useEffect, useState } from 'react';

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
}

export default function Progress() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/signin');
    }
  }, [isAuthenticated, router]);

  const gameProgress: GameProgress[] = [
    {
      id: 1,
      name: 'Letter Trace',
      emoji: '✏️',
      progress: 90,
      level: 15,
      score: 2450,
      timesPlayed: 24,
      lastPlayed: '2 hours ago',
      status: 'advanced',
    },
    {
      id: 2,
      name: 'Shape Match',
      emoji: '🟠',
      progress: 60,
      level: 8,
      score: 1850,
      timesPlayed: 15,
      lastPlayed: '1 day ago',
      status: 'intermediate',
    },
    {
      id: 3,
      name: 'Number Quest',
      emoji: '🔢',
      progress: 45,
      level: 5,
      score: 1200,
      timesPlayed: 10,
      lastPlayed: '3 days ago',
      status: 'beginner',
    },
    {
      id: 4,
      name: 'Color Wizard',
      emoji: '🎨',
      progress: 75,
      level: 12,
      score: 2100,
      timesPlayed: 18,
      lastPlayed: 'Today',
      status: 'advanced',
    },
    {
      id: 5,
      name: 'Memory Master',
      emoji: '🧠',
      progress: 55,
      level: 7,
      score: 1650,
      timesPlayed: 12,
      lastPlayed: '5 days ago',
      status: 'intermediate',
    },
    {
      id: 6,
      name: 'Sound Academy',
      emoji: '🎵',
      progress: 35,
      level: 4,
      score: 900,
      timesPlayed: 6,
      lastPlayed: '1 week ago',
      status: 'beginner',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'advanced':
        return 'text-green-600 bg-green-50';
      case 'intermediate':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-blue-600 bg-blue-50';
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

  const sortedGames = [...gameProgress].sort((a, b) => {
    switch (sortBy) {
      case 'progress':
        return b.progress - a.progress;
      case 'level':
        return b.level - a.level;
      case 'score':
        return b.score - a.score;
      case 'recent':
        return a.lastPlayed.localeCompare(b.lastPlayed);
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const totalScore = gameProgress.reduce((sum, game) => sum + game.score, 0);
  const totalTimesPlayed = gameProgress.reduce((sum, game) => sum + game.timesPlayed, 0);
  const averageProgress = Math.round(gameProgress.reduce((sum, game) => sum + game.progress, 0) / gameProgress.length);

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-blue-50">
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
            <p className="text-3xl font-bold text-primary">{gameProgress.length}</p>
            <p className="text-foreground/70 font-semibold">Games</p>
          </Card>
          <Card className="p-6 text-center shadow-lg">
            <div className="text-4xl mb-2">🏆</div>
            <p className="text-3xl font-bold text-primary">{totalScore.toLocaleString()}</p>
            <p className="text-foreground/70 font-semibold">Total Score</p>
          </Card>
          <Card className="p-6 text-center shadow-lg">
            <div className="text-4xl mb-2">⏱️</div>
            <p className="text-3xl font-bold text-primary">{totalTimesPlayed}</p>
            <p className="text-foreground/70 font-semibold">Times Played</p>
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
          {['name', 'progress', 'level', 'score', 'recent'].map((option) => (
            <button
              key={option}
              onClick={() => setSortBy(option)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                sortBy === option
                  ? 'bg-primary text-white'
                  : 'bg-white border-2 border-primary text-primary hover:bg-blue-50'
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
                <div className="grid grid-cols-3 gap-4 md:gap-6 w-full md:w-auto">
                  <div className="text-center">
                    <p className="text-xl font-bold text-primary">{game.score}</p>
                    <p className="text-xs text-foreground/70">Score</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-primary">{game.timesPlayed}</p>
                    <p className="text-xs text-foreground/70">Played</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-primary">{game.progress}%</p>
                    <p className="text-xs text-foreground/70">Progress</p>
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
