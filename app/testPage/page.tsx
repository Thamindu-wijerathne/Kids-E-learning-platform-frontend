'use client';

import { useState } from 'react';
import GameCard from '@/components/GameCard';
import { gamesList } from '@/lib/gamesConfig';

export default function GamesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Games', emoji: '🎮' },
    { id: 'handwriting', label: 'Handwriting', emoji: '✏️' },
    { id: 'math', label: 'Math', emoji: '🔢' },
    { id: 'patterns', label: 'Patterns', emoji: '🟠' },
    { id: 'letters', label: 'Letters', emoji: '📚' },
    { id: 'memory', label: 'Memory', emoji: '🧠' },
  ];

  const filteredGames = gamesList.filter((game) => {
    const matchesSearch = game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || game.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <section className="px-4 py-12 md:py-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-800 mb-4">
            All Games 🎮
          </h1>
          <p className="text-lg text-slate-600">
            Choose a game to play and start your learning adventure!
          </p>
        </div>
      </section>

      <section className="px-4 py-8 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <input
              type="text"
              placeholder="🔍 Search games..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-lg py-4 px-6 rounded-xl border-2 border-slate-300 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-500 mb-4 uppercase tracking-wide">
              Filter by Category
            </h3>
            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`rounded-full px-6 py-2.5 font-semibold transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-slate-800 text-white'
                      : 'border-2 border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {filteredGames.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-3xl font-bold text-slate-800 mb-2">
                No games found!
              </h2>
              <p className="text-lg text-slate-600">
                Try a different search or filter
              </p>
            </div>
          ) : (
            <>
              <p className="text-lg text-slate-600 mb-8">
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
    </main>
  );
}