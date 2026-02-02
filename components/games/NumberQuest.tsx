'use client';

import { Button } from '@/components/ui/button';

interface GameProps {
    onLevelUp: () => void;
    onScoreUpdate: (points: number) => void;
    gameData: any;
}

export default function NumberQuest({ onLevelUp, onScoreUpdate, gameData }: GameProps) {
    return (
        <div className="text-center w-full">
            <div className="text-7xl mb-8">{gameData.emoji}</div>
            <h2 className="text-4xl font-bold text-white mb-4">Number Quest</h2>
            <p className="text-white/90 text-xl mb-8">
                Solve the math puzzles!
            </p>
            <div className="flex gap-4 justify-center">
                <Button
                    onClick={() => {
                        onScoreUpdate(150);
                        onLevelUp();
                    }}
                    className="bg-green-500 hover:bg-green-600 text-white text-lg px-8 py-4 rounded-xl"
                >
                    Complete Level ✓
                </Button>
            </div>
        </div>
    );
}
