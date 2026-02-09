'use client';

import { Card } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { saveLevelApi, getLevelApi } from '@/services/game-progress-service';

interface LevelCardProps {
  gameId: string;
  currentLevel: number;
  maxLevel?: number;
}

export function LevelCard({ gameId, currentLevel, maxLevel = 10 }: LevelCardProps) {
  const [level, setLevel] = useState(currentLevel);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial level
  useEffect(() => {
    const fetchLevel = async () => {
      try {
        const data = await getLevelApi(gameId);
        setLevel(data.level || 1);
      } catch (error: any) {if (error?.response?.status === 401) {
        console.log('User not authenticated, using session levels only');
        setLevel(currentLevel);
      } else {
        console.error('Failed to fetch level:', error);
        setLevel(currentLevel);
      }
      } finally {
        setIsLoading(false);
      }
    };

    fetchLevel();
  }, [gameId]);

  // Update level when currentLevel changes
  useEffect(() => {
    setLevel(currentLevel);
  }, [currentLevel]);

  // Save level when it changes
  useEffect(() => {
    if (level === 1 && currentLevel === 1) return;

    const saveLevel = async () => {
      try {
        await saveLevelApi(gameId, level);
      } catch (error) {
        console.error('Failed to save level:', error);
      }
    };

    saveLevel();
  }, [gameId, level]);

  const progress = Math.min((level / maxLevel) * 100, 100);
  
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