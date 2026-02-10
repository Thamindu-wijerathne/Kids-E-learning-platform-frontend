'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import HandwritingcheckCanvas from '../HandwritingcheckCanvas';
import { WORD_COLLECTION } from '@/lib/word-builder-data';
import { useGameProgress } from '@/contexts/game-progress-context';
import { Butcherman } from 'next/font/google';
import { Button } from '../ui/button';

interface GameProps {
    onLevelUp?: () => void;
    onScoreUpdate?: (points: number) => void;
    gameData?: any;
    level: number;
    currentScore: number;
}

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export default function WordBuilder({ onLevelUp, onScoreUpdate, gameData, level, currentScore }: GameProps) {
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

    const skipThisWord = () => {
        if (currentScore >= 50) {
            onScoreUpdate?.(-50);

            saveGameProgress({
                game: "Word Builder",
                level: level,
                difficulty: currentDifficulty,
                word: currentPair.word,
                isCorrect: false,
                scoreDelta: -50,
                timestamp: Date.now(),
            });
            initGame();
        }
    }

    useEffect(() => {
        initGame();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [level]);

    return (
        <div className="w-full flex flex-col items-center max-w-4xl mx-auto space-y-10 py-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Game Header Section */}
            <div className="text-center space-y-3">
                <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-md">
                    Build the Word!
                </h2>
                <div className="flex flex-col md:flex-row gap-3 justify-center items-center">
                    <p className="text-white/90 font-medium text-lg bg-white/10 px-4 py-1 rounded-full backdrop-blur-md border border-white/10">
                        Goal: Recognize the emoji and draw the letters!
                    </p>
                    <span className={`px-4 py-1.5 rounded-2xl text-sm font-black uppercase tracking-widest shadow-lg ${currentDifficulty === 'easy' ? 'bg-emerald-400 text-emerald-950 shadow-emerald-500/20' :
                            currentDifficulty === 'medium' ? 'bg-amber-400 text-amber-950 shadow-amber-500/20' :
                                'bg-rose-500 text-white shadow-rose-900/20'
                        }`}>
                        {currentDifficulty}
                    </span>
                </div>
            </div>

            {/* Main Emoji Display */}
            <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-tr from-white/20 to-transparent rounded-[3rem] blur-2xl opacity-50 group-hover:opacity-80 transition-opacity" />
                <Card className="relative w-44 h-44 md:w-56 md:h-56 flex items-center justify-center bg-white/20 backdrop-blur-2xl border-2 border-white/30 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] ring-1 ring-white/20 transition-transform duration-500 hover:scale-105">
                    <span className="text-7xl md:text-9xl drop-shadow-2xl filter brightness-110">{currentPair.emoji}</span>
                </Card>
            </div>

            {/* Letter Pool Area */}
            <div className="w-full space-y-4">
                <div className="flex justify-between items-center px-6">
                    <h3 className="text-white/60 font-bold text-sm uppercase tracking-widest">Letter Pool</h3>
                    {currentScore >= 50 && (
                        <Button
                            variant="ghost"
                            onClick={skipThisWord}
                            className="text-white/70 hover:text-white hover:bg-white/10 rounded-xl px-4 py-1 h-auto text-xs font-bold border border-white/10 transition-all"
                        >
                            Skip? (50 pts)
                        </Button>
                    )}
                </div>
                <div className="flex flex-wrap gap-3 md:gap-4 justify-center bg-white/5 p-8 rounded-[2.5rem] backdrop-blur-md border-2 border-white/10 shadow-inner w-full">
                    {shuffledPool.map((letterObj) => (
                        <div
                            key={letterObj.id}
                            className="w-14 h-14 md:w-20 md:h-20 bg-white hover:bg-gradient-to-br hover:from-white hover:to-orange-50 text-slate-800 text-2xl md:text-4xl font-black rounded-2xl shadow-[0_8px_0_rgba(0,0,0,0.05)] border-b-4 border-slate-200 transition-all transform hover:-translate-y-1 active:translate-y-0.5 active:border-b-0 hover:shadow-xl flex items-center justify-center cursor-default group"
                        >
                            <span className="group-hover:scale-110 transition-transform">{letterObj.letter}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Canvas Section */}
            <div className="w-full space-y-4">
                <div className="flex justify-center">
                    <div className="bg-white/10 backdrop-blur-md p-2 rounded-3xl border border-white/20 shadow-2xl w-full max-w-2xl">
                        <HandwritingcheckCanvas
                            expectedWord={currentPair.word}
                            onResult={(isCorrect) => {
                                if (isCorrect) {
                                    setFeedback('correct');
                                    onScoreUpdate?.(10);
                                    onLevelUp?.();

                                    saveGameProgress({
                                        game: "Word Builder",
                                        level: level + 1,
                                        difficulty: currentDifficulty,
                                        word: currentPair.word,
                                        isCorrect: true,
                                        scoreDelta: 10,
                                        timestamp: Date.now(),
                                    });

                                    setTimeout(initGame, 1200);
                                } else {
                                    setFeedback('wrong');

                                    saveGameProgress({
                                        game: "Word Builder",
                                        level: level,
                                        difficulty: currentDifficulty,
                                        word: currentPair.word,
                                        isCorrect: false,
                                        scoreDelta: 0,
                                        timestamp: Date.now(),
                                    });
                                    
                                    setTimeout(() => setFeedback(null), 1500);
                                }
                            }}
                        />
                    </div>
                </div>

                {/* Feedback Messages */}
                <div className="h-16 flex items-center justify-center">
                    {feedback && (
                        <div className={`text-3xl md:text-5xl font-black px-8 py-3 rounded-2xl backdrop-blur-xl border-2 shadow-2xl animate-in zoom-in slide-in-from-top-4 duration-300
                            ${feedback === 'correct' ? 'bg-emerald-400/20 border-emerald-400 text-emerald-300' : 'bg-rose-500/20 border-rose-500 text-rose-300'}`}>
                            {feedback === 'correct' ? 'AMAZING! 🏗️' : 'TRY AGAIN! 🏗️'}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

