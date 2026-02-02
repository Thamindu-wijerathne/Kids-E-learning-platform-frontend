'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import HandwritingcheckCanvas from '../HandwritingcheckCanvas';
import { WORD_COLLECTION } from '@/lib/word-builder-data';
import { useGameProgress } from '@/contexts/game-progress-context';

interface GameProps {
    onLevelUp: () => void;
    onScoreUpdate: (points: number) => void;
    gameData: any;
    level: number;
}

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export default function WordBuilder({ onLevelUp, onScoreUpdate, gameData, level }: GameProps) {
    const [currentPair, setCurrentPair] = useState(WORD_COLLECTION[0]);
    const [shuffledPool, setShuffledPool] = useState<{ id: string; letter: string }[]>([]);
    const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

    const { saveGameProgress } = useGameProgress();

    // Determine difficulty based on level
    const currentDifficulty = useMemo(() => {
        if (level <= 10) return 'easy';
        if (level <= 30) return 'medium';
        return 'hard';
    }, [level]);

    const initGame = useCallback(() => {
        // Filter words by difficulty
        const availableWords = WORD_COLLECTION.filter(w => w.difficulty === currentDifficulty);
        const randomPair = availableWords[Math.floor(Math.random() * availableWords.length)];
        setCurrentPair(randomPair);

        // Create pool of letters from the word
        const correctLetters = randomPair.word.split('').map((letter, index) => ({
            id: `${letter}-${index}-${Math.random()}`,
            letter
        }));

        // Add distractors based on level
        const distractorCount = Math.min(3 + Math.floor(level / 2), 8);
        const distractors = Array.from({ length: distractorCount }).map((_, i) => ({
            id: `distractor-${i}-${Math.random()}`,
            letter: ALPHABET[Math.floor(Math.random() * ALPHABET.length)]
        }));

        const pool = [...correctLetters, ...distractors].sort(() => 0.5 - Math.random());

        setShuffledPool(pool);
        setFeedback(null);
    }, [currentDifficulty, level]);

    useEffect(() => {
        initGame();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [level]);

    return (
        <div className="w-full flex flex-col items-center max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2">Build the Word!</h2>
                <div className="flex gap-4 justify-center items-center">
                    <p className="text-white/80">Goal: Draw the word using the pool below!</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${currentDifficulty === 'easy' ? 'bg-green-400 text-green-900' :
                        currentDifficulty === 'medium' ? 'bg-yellow-400 text-yellow-900' :
                            'bg-red-400 text-red-900'
                        }`}>
                        {currentDifficulty} Mode • Level {level}
                    </span>
                </div>
            </div>

            <div className="relative">
                <Card className="w-40 h-40 md:w-52 md:h-52 flex items-center justify-center bg-white/20 backdrop-blur-xl border-4 border-white/30 rounded-[2.5rem] shadow-2xl">
                    <span className="text-6xl md:text-8xl drop-shadow-lg">{currentPair.emoji}</span>
                </Card>
            </div>

            {/* Pool Area */}
            <div className="flex flex-wrap gap-2 md:gap-3 justify-center bg-black/10 p-6 md:p-8 rounded-[2rem] backdrop-blur-sm border-2 border-white/5 w-full">
                {shuffledPool.map((letterObj) => (
                    <div key={letterObj.id} className="w-12 h-12 md:w-16 md:h-16 bg-white hover:bg-orange-400 hover:text-white text-primary text-xl md:text-2xl font-black rounded-xl shadow-lg transition-all transform active:scale-90 hover:scale-110 flex items-center justify-center">
                        {letterObj.letter}
                    </div>
                ))}
            </div>

            <HandwritingcheckCanvas
                expectedWord={currentPair.word}
                onResult={(isCorrect) => {
                    saveGameProgress({
                        game: "Word Builder",
                        level,
                        difficulty: currentDifficulty,
                        word: currentPair.word,
                        isCorrect,
                        scoreDelta: isCorrect ? 10 : 0,
                        timestamp: Date.now(),
                    });

                    if (isCorrect) {
                        onScoreUpdate(10);
                        onLevelUp();
                    }
                }}
            />

            <div className="h-10 flex items-center justify-center">
                {feedback && (
                    <div className={`text-3xl font-bold italic animate-in zoom-in duration-300
                        ${feedback === 'correct' ? 'text-green-400' : 'text-red-400'}`}>
                        {feedback === 'correct' ? 'EXCELLENT! 🏗️' : 'TRY AGAIN! 🏗️'}
                    </div>
                )}
            </div>
        </div>
    );
}

