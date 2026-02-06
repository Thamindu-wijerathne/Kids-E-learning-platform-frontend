'use client';

import { useParams } from 'next/navigation';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { gamesList } from '@/config/gamesConfig';
import { useGameProgress } from '@/contexts/game-progress-context';
import { useEffect } from 'react';
import { ScoreCard } from '@/components/game-hud/ScoreCard';
import { LevelCard } from '@/components/game-hud/LevelCard';


export default function GamePage() {
  const params = useParams();
  const id = params.id as string;
  const game = gamesList.find((g) => g.id === id);

  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // const gameProgress = useGameProgress();

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

  const GameComponent = game.component;

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-blue-50">
      <Header />

      <section className="px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <Link href="/games">
            <Button variant="outline" className="mb-4 rounded-lg bg-transparent">
              ← Back to Games
            </Button>
          </Link>
        </div>
      </section>

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
                      <p className="text-white/90 text-lg mb-8 max-w-md">{game.description}</p>
                      <Button size="lg" onClick={() => setIsPlaying(true)} className="bg-white text-foreground hover:bg-gray-100 text-xl px-10 py-6 rounded-2xl font-bold">
                        Start Game! 🎮
                      </Button>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center min-h-[400px]">
                      <GameComponent
                        onLevelUp={() => setLevel(l => l + 1)}
                        onScoreUpdate={setScore}
                        level={level}
                        currentScore={score}
                      />
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Right Sidebar - Dynamic HUD */}
            <div className="flex flex-col gap-6">
              {game.config.scoring?.enabled && (
                <ScoreCard 
                  gameId={game.id}
                  currentScore={score}
                  scoringType={game.config.scoring.type}
                />
              )}

              {game.config.leveling?.enabled && (
                <LevelCard 
                  gameId={game.id}
                  currentLevel={level}
                  maxLevel={game.config.leveling.maxLevel}
                />
              )}

              <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg">
                <h3 className="text-lg font-bold mb-4">ℹ️ Game Info</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-foreground/70">Category</span>
                    <span className="font-bold text-primary capitalize">{game.category}</span>
                  </div>
                </div>
              </Card>
              
            </div>
          </div>
        </div>
      </section>


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