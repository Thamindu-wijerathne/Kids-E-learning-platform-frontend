'use client';

import { useState } from 'react';
import Header from '@/components/header';
import GameCard from '@/components/GameCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { gamesList } from '@/lib/gamesConfig';

export default function GamesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const games = gamesList;

  const categories = [
    { id: 'all', label: 'All Games', emoji: '🎮' },
    { id: 'handwriting', label: 'Handwriting', emoji: '✏️' },
    { id: 'math', label: 'Math', emoji: '🔢' },
    { id: 'patterns', label: 'Patterns', emoji: '🟠' },
    { id: 'letters', label: 'Letters', emoji: '📚' },
    { id: 'memory', label: 'Memory', emoji: '🧠' },
  ];

  const filteredGames = games.filter((game) => {
    const matchesSearch = game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || game.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
      <Header />

      {/* Page Header */}
      <section className="px-4 py-12 md:py-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-primary mb-4 text-balance">
            All Games 🎮
          </h1>
          <p className="text-lg text-foreground/70 text-balance">
            Choose a game to play and start your learning adventure!
          </p>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="px-4 py-8 bg-white/50">
        <div className="max-w-6xl mx-auto">
          {/* Search Bar */}
          <div className="mb-8">
            <Input
              type="text"
              placeholder="🔍 Search games..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-lg py-6 px-4 rounded-2xl border-2 border-primary focus:border-secondary"
            />
          </div>

          {/* Category Filter */}
          <div>
            <h3 className="text-sm font-semibold text-foreground/60 mb-4 uppercase tracking-wide">
              Filter by Category
            </h3>
            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.id ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`rounded-full px-6 py-5 font-semibold transition-all ${selectedCategory === cat.id
                    ? 'bg-primary text-white'
                    : 'border-2 border-primary text-primary hover:bg-primary/10'
                    }`}
                >
                  {cat.emoji} {cat.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Games Grid */}
      <section className="px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {filteredGames.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-3xl font-bold text-foreground mb-2">
                No games found!
              </h2>
              <p className="text-lg text-foreground/60">
                Try a different search or filter to find your game
              </p>
            </div>
          ) : (
            <>
              <p className="text-lg text-foreground/60 mb-8">
                Showing {filteredGames.length} game{filteredGames.length !== 1 ? 's' : ''}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredGames.map((game) => (
                  <GameCard
                    key={game.id}
                    id={game.id}
                    name={game.name}
                    description={game.description}
                    emoji={game.emoji}
                    color={game.color}
                  />
                ))}
              </div>
            </>
          )}
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
    </main>
  );
}
