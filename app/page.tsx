'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import GameCard from '@/components/game-card';
import Header from '@/components/header';

export default function Home() {
  const [gameHovered, setGameHovered] = useState<number | null>(null);

  const featuredGames = [
    {
      id: 1,
      name: 'Letter Trace',
      description: 'Learn to write letters beautifully',
      color: 'bg-blue-400',
      emoji: '✏️',
    },
    {
      id: 2,
      name: 'Shape Match',
      description: 'Match shapes and patterns',
      color: 'bg-yellow-300',
      emoji: '🟠',
    },
    {
      id: 3,
      name: 'Number Quest',
      description: 'Count and solve math puzzles',
      color: 'bg-green-400',
      emoji: '🔢',
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-blue-50">
      <Header />

      {/* Hero Section */}
      <section className="px-4 py-12 md:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left: Text Content */}
            <div className="flex flex-col gap-6">
              <div>
                <h1 className="text-5xl md:text-6xl font-bold text-primary mb-4 text-balance">
                  Learn, Play & Grow! 🎮
                </h1>
                <p className="text-lg text-foreground/80 leading-relaxed text-balance">
                  Discover fun educational games that make learning exciting for every kid. From handwriting to problem-solving, we've got it all!
                </p>
              </div>

              <div className="flex gap-4 flex-wrap">
                <Link href="/games">
                  <Button size="lg" className="bg-primary hover:bg-secondary text-white text-lg px-8 py-6 rounded-2xl">
                    Play Now! 🚀
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6 rounded-2xl border-2 border-primary text-primary hover:bg-blue-50 bg-transparent"
                >
                  Learn More
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="flex gap-8 mt-4">
                <div>
                  <p className="text-3xl font-bold text-primary">10+</p>
                  <p className="text-sm text-foreground/60">Fun Games</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-accent">100%</p>
                  <p className="text-sm text-foreground/60">Kid Friendly</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-secondary">∞</p>
                  <p className="text-sm text-foreground/60">Learning Fun</p>
                </div>
              </div>
            </div>

            {/* Right: Illustration */}
            <div className="flex justify-center">
              <div className="relative w-full max-w-sm">
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-yellow-300 rounded-full opacity-20 blur-3xl"></div>
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-blue-300 rounded-full opacity-20 blur-3xl"></div>
                <div className="relative bg-gradient-to-br from-blue-100 to-blue-50 rounded-3xl p-8 shadow-xl">
                  <div className="text-center">
                    <div className="text-8xl mb-4">🎨</div>
                    <p className="text-xl font-bold text-primary mb-2">Fun Learning</p>
                    <p className="text-sm text-foreground/60">Interactive games designed for young minds</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Games Section */}
      <section className="px-4 py-16 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-3 text-balance">
              Popular Games
            </h2>
            <p className="text-lg text-foreground/70">
              Check out our most loved games by kids around the world
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredGames.map((game, idx) => (
              <div
                key={game.id}
                onMouseEnter={() => setGameHovered(idx)}
                onMouseLeave={() => setGameHovered(null)}
                className="group cursor-pointer"
              >
                <Card className="overflow-hidden h-full shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  <div className={`${game.color} p-8 h-40 flex items-center justify-center`}>
                    <span className="text-7xl animate-bounce" style={{
                      animationDelay: `${idx * 0.1}s`
                    }}>
                      {game.emoji}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-foreground mb-2">{game.name}</h3>
                    <p className="text-foreground/70 mb-4">{game.description}</p>
                    <Link href={`/games/${game.id}`}>
                      <Button className="w-full bg-primary hover:bg-secondary text-white rounded-xl">
                        Play Game 🎮
                      </Button>
                    </Link>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-primary mb-12 text-center text-balance">
            Why Kids Love Our Games ⭐
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '🎯', title: 'Fun Learning', desc: 'Games that teach real skills while having tons of fun' },
              { icon: '🏆', title: 'Achievements', desc: 'Earn stars and badges as you progress' },
              { icon: '👨‍👩‍👧‍👦', title: 'Safe & Secure', desc: 'Parent-friendly with no ads or distractions' },
            ].map((feature, i) => (
              <Card key={i} className="p-8 text-center hover:shadow-lg transition-shadow">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-foreground/70">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 bg-gradient-to-r from-primary to-secondary rounded-3xl m-4 md:m-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4 text-balance">
            Ready to Start the Adventure? 🚀
          </h2>
          <p className="text-xl text-white/90 mb-8 text-balance">
            Join thousands of kids learning and having fun every day!
          </p>
          <Link href="/games">
            <Button size="lg" className="bg-accent hover:bg-yellow-400 text-foreground text-lg px-10 py-6 rounded-2xl font-bold">
              Explore All Games Now! 🎮
            </Button>
          </Link>
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
                <li><a href="/games" className="hover:text-white">All Games</a></li>
                <li><a href="#" className="hover:text-white">About Us</a></li>
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
    </main>
  );
}
