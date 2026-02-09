'use client';

import { Card } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { saveScoreApi, getScoreApi } from '@/services/game-progress-service';
import { AxiosError } from 'axios';

interface ScoreCardProps {
  gameId: string;
  currentScore: number;
  scoringType: 'session' | 'persistent' | 'highest';
}

export function ScoreCard({ gameId, currentScore, scoringType }: ScoreCardProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const data = await getScoreApi(gameId);
        setHighScore(data.highScore || 0);
        setTotalScore(data.totalScore || 0);
        
        if (scoringType === 'persistent') {
          setDisplayScore(data.totalScore + currentScore);
        } else {
          setDisplayScore(currentScore);
        }
      } catch (error: any) {
        const axiosError = error as any;
        if (axiosError?.response?.status === 401) {
        console.log('User not authenticated, using session scores only');
        setDisplayScore(currentScore);
      } else {
        console.error('Failed to fetch scores:', error);
        setDisplayScore(currentScore);
      }
      } finally {
        setIsLoading(false);
      }
    };

    fetchScores();
  }, [gameId, scoringType]);

  // Update display score when current score changes
  useEffect(() => {
    if (scoringType === 'persistent') {
      setDisplayScore(totalScore + currentScore);
    } else if (scoringType === "highest") {
      setDisplayScore(currentScore)
    } else {
      setDisplayScore(currentScore);
    }
  }, [currentScore, totalScore, scoringType]);


  // Save score periodically
  useEffect(() => {
    if (currentScore === 0) return;

    const interval = setInterval(async () => {
      try {
        await saveScoreApi(gameId, currentScore, scoringType);
      } catch (error) {
        console.error('Failed to save score:', error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [gameId, currentScore, scoringType]);

  if (isLoading) {
    return (
      <Card className="p-6 bg-white shadow-lg">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
          <div className="h-10 bg-gray-200 rounded w-32"></div>
        </div>
      </Card>
    );
  }

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