'use client';

import { Card } from '@/components/ui/card';
import { useEffect, useState } from 'react';

interface ScoreCardProps {
  gameId: string;
  currentScore: number;
  scoringType: 'session' | 'persistent' | 'highest';
}

export function ScoreCard({ gameId, currentScore, scoringType }: ScoreCardProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    // Fetch score from fake placeholder API. This needs to change
    fetch(`/api/scores/${gameId}`)
      .then(res => res.json())
      .then(data => {
        if (scoringType === 'persistent') {
          setDisplayScore(data.totalScore + currentScore);
        } else if (scoringType === 'highest') {
          setHighScore(data.highScore);
          setDisplayScore(currentScore);
        } else {
          setDisplayScore(currentScore);
        }
      })
      .catch(() => setDisplayScore(currentScore));
  }, [gameId, currentScore, scoringType]);

  // Save score periodically
  useEffect(() => {
    const interval = setInterval(() => {
      fetch(`/api/scores/${gameId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score: currentScore, type: scoringType })
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [gameId, currentScore, scoringType]);

  return (
    <Card className="p-6 bg-white shadow-lg">
      <h3 className="text-xl font-bold text-foreground mb-4">Your Progress</h3>
      <div className="space-y-4">
        <div>
          <p className="text-sm text-foreground/60 mb-1">
            {scoringType === 'persistent' ? 'Total Score' : 'Current Score'}
          </p>
          <p className="text-4xl font-bold text-primary">{displayScore}</p>
        </div>
        {scoringType === 'highest' && highScore > 0 && (
          <div>
            <p className="text-sm text-foreground/60 mb-1">High Score</p>
            <p className="text-2xl font-bold text-secondary">{highScore}</p>
          </div>
        )}
      </div>
    </Card>
  );
}