'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import HandwritingcheckCanvas from '../HandwritingcheckCanvas';

interface GameProps {
    onLevelUp?: () => void;
    onScoreUpdate?: (points: number) => void;
    gameData?: any;
}

const WORDS = [
    { word: 'GIRAFFE', emoji: '🦒' },
    { word: 'ROCKET', emoji: '🚀' },
    { word: 'PIZZA', emoji: '🍕' },
    { word: 'DRAGON', emoji: '🐲' },
    { word: 'GUITAR', emoji: '🎸' },
    { word: 'BICYCLE', emoji: '🚲' },
    { word: 'RAINBOW', emoji: '🌈' },
    { word: 'PENGUIN', emoji: '🐧' },
    { word: 'CHICKEN', emoji: '🐔' },
    { word: 'BALLOON', emoji: '🎈' },
];


const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export default function WordBuilder({ onLevelUp, onScoreUpdate, gameData }: GameProps) {
    const [currentPair, setCurrentPair] = useState(WORDS[0]);
    const [shuffledPool, setShuffledPool] = useState<{ id: string; letter: string }[]>([]);
    const [selectedLetters, setSelectedLetters] = useState<{ id: string; letter: string }[]>([]);
    const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

    const initGame = useCallback(() => {
        const randomPair = WORDS[Math.floor(Math.random() * WORDS.length)];
        setCurrentPair(randomPair);

        // Create pool of letters from the word
        const correctLetters = randomPair.word.split('').map((letter, index) => ({
            id: `${letter}-${index}-${Math.random()}`,
            letter
        }));

        // Add 3 random distractor letters
        const distractors = Array.from({ length: 3 }).map((_, i) => ({
            id: `distractor-${i}-${Math.random()}`,
            letter: ALPHABET[Math.floor(Math.random() * ALPHABET.length)]
        }));

        const pool = [...correctLetters, ...distractors].sort(() => 0.5 - Math.random());

        setShuffledPool(pool);
        setSelectedLetters([]);
        setFeedback(null);
    }, []);

    useEffect(() => {
        initGame();
    }, [initGame]);

    return (
        <div className="w-full flex flex-col items-center max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2">Build the Word!</h2>
                <p className="text-white/80">Distractor letters are mixed in – be careful!</p>
            </div>

            <div className="relative">
                <Card className="w-40 h-40 md:w-52 md:h-52 flex items-center justify-center bg-white/20 backdrop-blur-xl border-4 border-white/30 rounded-[2.5rem] shadow-2xl">
                    <span className="text-6xl md:text-8xl drop-shadow-lg">{currentPair.emoji}</span>
                </Card>
            </div>

            {/* Pool Area */}
            <div className="flex flex-wrap gap-2 md:gap-3 justify-center bg-black/10 p-6 md:p-8 rounded-[2rem] backdrop-blur-sm border-2 border-white/5 w-full">
                {shuffledPool.map((letterObj) => (
                    <div 
                        key={letterObj.id}
                        className="w-12 h-12 md:w-16 md:h-16 bg-white hover:bg-orange-400 hover:text-white text-primary text-xl md:text-2xl font-black rounded-xl shadow-lg transition-all transform active:scale-90 hover:scale-110 flex items-center justify-center"
                    >
                        {letterObj.letter}
                    </div>
                ))}
            </div>

            <HandwritingcheckCanvas
                expectedWord={currentPair.word}
                onResult={(isCorrect) => {
                    setFeedback(isCorrect ? 'correct' : 'wrong');

                    if (isCorrect) {
                        if (onScoreUpdate) {
                            onScoreUpdate(10);
                        }
                        setTimeout(initGame, 800);
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
