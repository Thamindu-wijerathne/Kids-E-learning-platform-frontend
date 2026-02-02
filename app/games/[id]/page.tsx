'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import { gamesData } from '@/lib/games';

// Import game components
import LetterTrace from '@/components/games/LetterTrace';
import ShapeMatch from '@/components/games/ShapeMatch';
import NumberQuest from '@/components/games/NumberQuest';
import ColorExplorer from '@/components/games/ColorExplorer';
import AlphabetAdventure from '@/components/games/AlphabetAdventure';
import MemoryMaster from '@/components/games/MemoryMaster';
import PuzzlePal from '@/components/games/PuzzlePal';
import SoundSafari from '@/components/games/SoundSafari';
import MatchTheWord from '@/components/games/MatchTheWord';
import { TetrisWord } from '@/components/games/TetrisWord';
import WordBuilder from '@/components/games/WordBuilder';

const componentMap: Record<number, any> = {
  1: LetterTrace,
  2: ShapeMatch,
  3: NumberQuest,
  4: ColorExplorer,
  5: AlphabetAdventure,
  6: MemoryMaster,
  7: PuzzlePal,
  8: SoundSafari,
  9: MatchTheWord,
  10: TetrisWord,
  11: WordBuilder,
};

export default function GamePage() {
  const params = useParams();
  const gameId = parseInt(params.id as string);
  const game = gamesData[gameId];
  const GameComponent = componentMap[gameId];

  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  if (!game) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-background to-blue-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="text-6xl mb-4">😕</div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Game not found</h1>
            <Link href="/games">
              <Button className="mt-4 bg-primary hover:bg-secondary text-white rounded-xl">
                Back to Games
              </Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const handlePlayGame = () => {
    setIsPlaying(true);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);
  };

  const handleNextLevel = () => {
    setLevel(level + 1);
    setScore(score + 100);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);
  };

  const handleRetry = () => {
    setIsPlaying(false);
    setLevel(1);
    setScore(0);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-blue-50">
      <Header />

      {/* Game Header */}
      <section className="px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <Link href="/games">
            <Button variant="outline" className="mb-4 rounded-lg bg-transparent">
              ← Back to Games
            </Button>
          </Link>
        </div>
      </section>

      {/* Main Game Area */}
      <section className="px-4 py-8">
        <div className="max-w-8xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Game Canvas */}
            <div className="lg:col-span-2">
              <Card className="overflow-hidden shadow-2xl">
                <div className={`${game.color} p-8 min-h-96 flex flex-col items-center justify-center`}>
                  {!isPlaying ? (
                    <div className="text-center">
                      <div className="text-9xl mb-6 animate-bounce">{game.emoji}</div>
                      <h1 className="text-4xl font-bold text-white mb-4">{game.name}</h1>
                      <p className="text-white/90 text-lg mb-8 max-w-md">{game.instructions}</p>
                      <Button
                        size="lg"
                        onClick={handlePlayGame}
                        className="bg-white text-foreground hover:bg-gray-100 text-xl px-10 py-6 rounded-2xl font-bold"
                      >
                        Start Game! 🎮
                      </Button>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center min-h-[400px]">
                      {GameComponent ? (
                        <GameComponent
                          onLevelUp={handleNextLevel}
                          onScoreUpdate={setScore}
                          gameData={game}
                          level={level}
                        />
                      ) : (
                        <div className="text-center w-full">
                          <div className="text-7xl mb-8">{game.emoji}</div>
                          <h2 className="text-4xl font-bold text-white mb-4">Level {level}</h2>
                          <p className="text-white/90 text-xl mb-8">
                            Play the game here! (Interactive game would render here)
                          </p>
                          <div className="flex gap-4 justify-center">
                            <Button
                              onClick={handleNextLevel}
                              className="bg-green-500 hover:bg-green-600 text-white text-lg px-8 py-4 rounded-xl"
                            >
                              Complete Level ✓
                            </Button>
                            <Button
                              onClick={handleRetry}
                              variant="outline"
                              className="border-2 border-white text-white hover:bg-white/20 text-lg px-8 py-4 rounded-xl bg-transparent"
                            >
                              Back
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Right Sidebar */}
            <div className="flex flex-col gap-6">
              {/* Score Card */}
              <Card className="p-6 bg-white shadow-lg">
                <h3 className="text-xl font-bold text-foreground mb-4">📊 Your Progress</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-foreground/60 mb-1">Current Score</p>
                    <p className="text-4xl font-bold text-primary">{score}</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60 mb-1">Level</p>
                    <p className="text-4xl font-bold text-secondary">{level}</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 mt-4">
                    <div
                      className="bg-gradient-to-r from-primary to-secondary h-4 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(level * 25, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </Card>

              {/* Game Info */}
              <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg">
                <h3 className="text-lg font-bold text-foreground mb-4">ℹ️ Game Info</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-foreground/70">Difficulty</span>
                    <span className="font-bold text-primary">{game.difficulty}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/70">Duration</span>
                    <span className="font-bold text-primary">{game.duration}</span>
                  </div>
                </div>
              </Card>

              {/* Achievements */}
              <Card className="p-6 bg-white shadow-lg">
                <h3 className="text-lg font-bold text-foreground mb-4">🏆 Achievements</h3>
                <div className="flex flex-wrap gap-3">
                  {score > 0 && <div className="text-3xl" title="First Play">🎮</div>}
                  {level > 1 && <div className="text-3xl" title="Level Up">⭐</div>}
                  {score >= 200 && <div className="text-3xl" title="Score Champ">🥇</div>}
                  {!isPlaying && score === 0 && <div className="text-3xl opacity-30" title="Locked">🔒</div>}
                </div>
              </Card>

              {/* CTA */}
              {!isPlaying && (
                <Button
                  size="lg"
                  onClick={handlePlayGame}
                  className="w-full bg-accent hover:bg-yellow-400 text-foreground text-lg py-6 rounded-2xl font-bold"
                >
                  Start Now! 🚀
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                animation: `fall 2s ease-out forwards`,
                animationDelay: `${i * 0.05}s`,
              }}
            >
              {['🎉', '⭐', '🎊'][Math.floor(Math.random() * 3)]}
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <footer className="bg-primary text-white py-12 px-4 mt-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-xl font-bold mb-4">PlayLearn</h4>
              <p className="text-white/80">Educational games for happy learners</p>
            </div>
            <div>
              <h5 className="font-bold mb-4">Quick Links</h5>
              <ul className="space-y-2 text-white/80">
                <li><a href="/" className="hover:text-white">Home</a></li>
                <li><a href="/games" className="hover:text-white">All Games</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4">Support</h5>
              <ul className="space-y-2 text-white/80">
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4">Legal</h5>
              <ul className="space-y-2 text-white/80">
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 pt-8 text-center text-white/70">
            <p>&copy; 2024 PlayLearn. All rights reserved. 🎮</p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes fall {
          to {
            transform: translateY(100vh);
            opacity: 0;
          }
        }
      `}</style>
    </main>
  );
}
