'use client';

import { Card } from '@/components/ui/card';
import { useEffect, useState } from 'react';

interface LevelCardProps {
  gameId: string;
  currentLevel: number;
  maxLevel?: number;
}

export function LevelCard({ gameId, currentLevel, maxLevel = 10 }: LevelCardProps) {
  const [level, setLevel] = useState(currentLevel);

  // Placeholder API
  useEffect(() => {
    fetch(`/api/levels/${gameId}`)
      .then(res => res.json())
      .then(data => setLevel(data.level || currentLevel))
      .catch(() => setLevel(currentLevel));
  }, [gameId, currentLevel]);

  useEffect(() => {
    fetch(`/api/levels/${gameId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ level: currentLevel })
    });
  }, [gameId, currentLevel]);

  const progress = Math.min((level / maxLevel) * 100, 100);

  return (
    <Card className="p-6 bg-white shadow-lg">
      <h3 className="text-xl font-bold text-foreground mb-4">⭐ Level</h3>
      <div className="space-y-4">
        <div>
          <p className="text-sm text-foreground/60 mb-1">Current Level</p>
          <p className="text-4xl font-bold text-secondary">{level}</p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-gradient-to-r from-primary to-secondary h-4 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-foreground/60 text-center">
          {level} / {maxLevel}
        </p>
      </div>
    </Card>
  );
}