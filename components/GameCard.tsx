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
        <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col">
          {/* Emoji Header */}
          <div className={`${color} h-32 flex items-center justify-center group-hover:scale-105 transition-transform`}>
            <span className="text-5xl">{emoji}</span>
          </div>
          
          {/* Content */}
          <div className="p-5 flex-1 flex flex-col">
            <h3 className="text-xl font-bold text-slate-800 mb-2">{name}</h3>
            <p className="text-sm text-slate-600 mb-4 flex-1">{description}</p>
            
            {/* Play Button */}
            <div className="pt-2">
              <div className="w-full bg-slate-800 hover:bg-slate-700 text-white text-center py-2.5 rounded-lg font-semibold text-sm transition-colors">
                Play Now →
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}