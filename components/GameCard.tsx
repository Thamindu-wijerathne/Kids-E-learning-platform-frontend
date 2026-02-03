'use client';

import Link from 'next/link';

interface GameCardProps {
  id: string;
  name: string;
  description: string;
  emoji: string;
  color: string;
}

export default function GameCard({ id, name, description, emoji, color }: GameCardProps) {
  return (
    <Link href={`/games/${id}`}>
      <div className="group cursor-pointer h-full">
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform group-hover:scale-105 overflow-hidden h-full flex flex-col">
          <div className={`${color} p-8 h-40 flex items-center justify-center`}>
            <span className="text-6xl">{emoji}</span>
          </div>
          
          <div className="p-6 flex-1 flex flex-col">
            <h3 className="text-2xl font-bold text-slate-800 mb-2">{name}</h3>
            <p className="text-slate-600/70 mb-4 flex-1">{description}</p>
            
            <div className="pt-2">
              <div className="w-full bg-primary hover:bg-secondary text-white text-center py-3 rounded-xl font-semibold transition-colors">
                Play Game 🎮
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}