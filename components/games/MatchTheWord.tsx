'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface GameProps {
    onLevelUp: () => void;
    onScoreUpdate: (points: number) => void;
    gameData: any;
}

const MATCHING_PAIRS = [
    { word: 'APPLE', emoji: '🍎' },
    { word: 'DOG', emoji: '🐶' },
    { word: 'CAT', emoji: '🐱' },
    { word: 'BALL', emoji: '⚽' },
    { word: 'SUN', emoji: '☀️' },
    { word: 'TREE', emoji: '🌳' },
    { word: 'FISH', emoji: '🐟' },
    { word: 'BOOK', emoji: '📖' },
    { word: 'CAKE', emoji: '🍰' },
    { word: 'CAR', emoji: '🚗' },
];

export default function MatchTheWord({ onLevelUp, onScoreUpdate, gameData }: GameProps) {
    const [currentPair, setCurrentPair] = useState(MATCHING_PAIRS[0]);
    const [shuffledPool, setShuffledPool] = useState<{ id: string; letter: string }[]>([]);
    const [selectedLetters, setSelectedLetters] = useState<{ id: string; letter: string }[]>([]);
    const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

    const initGame = useCallback(() => {
        const randomPair = MATCHING_PAIRS[Math.floor(Math.random() * MATCHING_PAIRS.length)];
        setCurrentPair(randomPair);

        // Create pool of letters with unique IDs
        const pool = randomPair.word.split('').map((letter, index) => ({
            id: `${letter}-${index}-${Math.random()}`,
            letter
        })).sort(() => 0.5 - Math.random());

        setShuffledPool(pool);
        setSelectedLetters([]);
        setFeedback(null);
    }, []);

    useEffect(() => {
        initGame();
    }, [initGame]);

    const handlePoolClick = (letterObj: { id: string; letter: string }) => {
        if (feedback === 'correct') return;

        // Add to selected
        const newSelected = [...selectedLetters, letterObj];
        setSelectedLetters(newSelected);

        // Remove from pool
        setShuffledPool(prev => prev.filter(item => item.id !== letterObj.id));

        // Check if word is complete
        if (newSelected.length === currentPair.word.length) {
            const assembledWord = newSelected.map(l => l.letter).join('');
            if (assembledWord === currentPair.word) {
                setFeedback('correct');
                onScoreUpdate(20);
                setTimeout(() => {
                    onLevelUp();
                    initGame();
                }, 1500);
            } else {
                setFeedback('wrong');
                setTimeout(() => {
                    setFeedback(null);
                    // Return letters to pool
                    setShuffledPool(prev => [...prev, ...newSelected].sort(() => 0.5 - Math.random()));
                    setSelectedLetters([]);
                }, 1000);
            }
        }
    };

    const handleSelectedClick = (letterObj: { id: string; letter: string }) => {
        if (feedback === 'correct') return;

        // Remove from selected
        setSelectedLetters(prev => prev.filter(item => item.id !== letterObj.id));

        // Add back to pool
        setShuffledPool(prev => [...prev, letterObj].sort(() => 0.5 - Math.random()));
        setFeedback(null);
    };

    return (
        <div className="w-full flex flex-col items-center max-w-4xl mx-auto space-y-12 animate-in fade-in duration-700">
            {/* Target Display */}
            <div className="relative transform hover:scale-105 transition-transform duration-300">
                <Card className="w-48 h-48 md:w-64 md:h-64 flex items-center justify-center bg-white/20 backdrop-blur-xl border-4 border-white/30 rounded-[3rem] shadow-2xl">
                    <span className="text-7xl md:text-9xl drop-shadow-lg animate-bounce duration-2000">{currentPair.emoji}</span>
                </Card>
            </div>

            {/* Slots / Assembled Word Area */}
            <div className="flex gap-2 md:gap-4 min-h-[100px] items-center justify-center flex-wrap">
                {Array.from({ length: currentPair.word.length }).map((_, i) => {
                    const letterObj = selectedLetters[i];
                    return (
                        <div
                            key={letterObj?.id || `empty-${i}`}
                            onClick={() => letterObj && handleSelectedClick(letterObj)}
                            className={`w-14 h-18 md:w-20 md:h-24 flex items-center justify-center text-3xl md:text-4xl font-black rounded-2xl border-b-8 transition-all cursor-pointer transform
                ${letterObj
                                    ? feedback === 'correct'
                                        ? 'bg-green-400 border-green-600 text-white animate-bounce'
                                        : feedback === 'wrong'
                                            ? 'bg-red-400 border-red-600 text-white animate-shake'
                                            : 'bg-white border-gray-300 text-primary hover:-translate-y-1'
                                    : 'bg-white/10 border-white/20'
                                }`}
                        >
                            {letterObj?.letter}
                        </div>
                    );
                })}
            </div>

            {/* Letter Pool */}
            <div className="flex flex-wrap gap-3 md:gap-4 justify-center bg-white/5 p-6 md:p-8 rounded-[2.5rem] backdrop-blur-sm border-2 border-white/10 w-full animate-in slide-in-from-bottom duration-500">
                {shuffledPool.map((letterObj) => (
                    <button
                        key={letterObj.id}
                        onClick={() => handlePoolClick(letterObj)}
                        className="w-14 h-14 md:w-20 md:h-20 bg-white hover:bg-primary hover:text-white text-primary text-2xl md:text-3xl font-black rounded-2xl shadow-xl transition-all transform active:scale-90 hover:scale-110 flex items-center justify-center"
                    >
                        {letterObj.letter}
                    </button>
                ))}
            </div>

            {/* Feedback Overlay */}
            <div className="h-12 flex items-center justify-center">
                {feedback && (
                    <div className={`text-3xl md:text-4xl font-black italic tracking-wider animate-in zoom-in duration-300
            ${feedback === 'correct' ? 'text-green-400' : 'text-red-400'}`}>
                        {feedback === 'correct' ? 'AMAZING! 🌟' : 'TRY AGAIN! 🔁'}
                    </div>
                )}
            </div>
        </div>
    );
}
