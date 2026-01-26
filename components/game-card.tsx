'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface GameCardProps {
  id: number;
  name: string;
  description: string;
  emoji: string;
  color: string;
  onClick?: () => void;
}

export default function GameCard({
  id,
  name,
  description,
  emoji,
  color,
  onClick,
}: GameCardProps) {
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer h-full">
      <div className={`${color} p-8 h-40 flex items-center justify-center`}>
        <span className="text-6xl">{emoji}</span>
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-bold text-foreground mb-2">{name}</h3>
        <p className="text-foreground/70 mb-4">{description}</p>
        <Link href={`/games/${id}`}>
          <Button
            className="w-full bg-primary hover:bg-secondary text-white rounded-xl font-semibold"
            onClick={onClick}
          >
            Play Game 🎮
          </Button>
        </Link>
      </div>
    </Card>
  );
}
