'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '../ui/button';
import { useGameProgress } from '@/contexts/game-progress-context';
import { MATH_PROBLEMS, MathProblem } from '@/lib/math-game-data';

interface GameProps {
    onLevelUp?: () => void;
    onScoreUpdate?: (points: number) => void;
    gameData?: any;
    level: number;
    currentScore: number;
}

const OPERATORS = ['+', '-', 'x', '/', '='];

/**
 * Helper to evaluate a math sequence.
 * Supports basic arithmetic and checks if left side equals right side.
 */
const checkEquality = (sequence: string[]) => {
    const eqIndex = sequence.indexOf('=');
    if (eqIndex === -1 || eqIndex === 0 || eqIndex === sequence.length - 1) return false;

    const leftParts = sequence.slice(0, eqIndex);
    const rightParts = sequence.slice(eqIndex + 1);

    const evaluate = (parts: string[]) => {
        try {
            // Join and replace 'x' with '*' for eval
            const expression = parts.join('').replace(/x/g, '*');
            // Using Function constructor as a safer alternative to eval
            return new Function(`return ${expression}`)();
        } catch (e) {
            return null;
        }
    };

    const leftVal = evaluate(leftParts);
    const rightVal = evaluate(rightParts);

    return leftVal !== null && rightVal !== null && leftVal === rightVal;
};

interface Tile {
    id: string;
    value: string;
}

export default function MathMaster({ onLevelUp, onScoreUpdate, level, currentScore }: GameProps) {
    const [currentProblem, setCurrentProblem] = useState<MathProblem>(MATH_PROBLEMS[0]);
    const [slotContents, setSlotContents] = useState<(Tile | null)[]>([]);
    const [shuffledPool, setShuffledPool] = useState<Tile[]>([]);
    const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [draggedTile, setDraggedTile] = useState<Tile | null>(null);
    const [draggedFromSlot, setDraggedFromSlot] = useState<number | null>(null);

    const { saveGameProgress } = useGameProgress();

    const currentDifficulty = useMemo(() => {
        if (level <= 10) return 'easy';
        if (level <= 20) return 'medium';
        return 'hard';
    }, [level]);

    const initGame = useCallback(() => {
        const availableProblems = MATH_PROBLEMS.filter(p => p.difficulty === currentDifficulty);
        const randomProblem = availableProblems[Math.floor(Math.random() * availableProblems.length)];

        setCurrentProblem(randomProblem);
        setSlotContents(new Array(randomProblem.targetEquation.length).fill(null));
        setFeedback(null);
        setIsAnimating(false);

        const targetItems = randomProblem.targetEquation.map((val, idx) => ({
            id: `target-${val}-${idx}-${Math.random()}`,
            value: val
        }));

        const distractorCount = Math.min(2 + Math.floor(level / 5), 5);
        const distractors = Array.from({ length: distractorCount }).map((_, i) => {
            const isOperator = Math.random() > 0.7;
            return {
                id: `distractor-${i}-${Math.random()}`,
                value: isOperator
                    ? OPERATORS[Math.floor(Math.random() * OPERATORS.length)]
                    : Math.floor(Math.random() * 20).toString()
            };
        });

        const pool = [...targetItems, ...distractors].sort(() => Math.random() - 0.5);
        setShuffledPool(pool);
    }, [currentDifficulty, level]);

    useEffect(() => {
        initGame();
    }, [level, initGame]);

    // Validation Effect: Triggered when slotContents changes
    useEffect(() => {
        if (slotContents.length === 0 || isAnimating) return;

        // Check if all slots are filled
        const filledSequence = slotContents.filter((s): s is Tile => s !== null).map(s => s.value);
        if (filledSequence.length === currentProblem.targetEquation.length) {
            const isCorrect = checkEquality(filledSequence);

            if (isCorrect) {
                setFeedback('correct');
                setIsAnimating(true);
                onScoreUpdate?.(10);

                saveGameProgress({
                    game: "Math Master",
                    level: level,
                    difficulty: currentDifficulty,
                    isCorrect: true,
                    scoreDelta: 10,
                    timestamp: Date.now(),
                });

                setTimeout(() => {
                    onLevelUp?.();
                    initGame();
                }, 1500);
            } else {
                setFeedback('wrong');

                saveGameProgress({
                    game: "Math Master",
                    level: level,
                    difficulty: currentDifficulty,
                    isCorrect: false,
                    scoreDelta: 0,
                    timestamp: Date.now(),
                });

                setTimeout(() => {
                    setFeedback(null);
                    setSlotContents(new Array(currentProblem.targetEquation.length).fill(null));
                }, 1500);
            }
        }
    }, [slotContents, currentProblem, currentDifficulty, level, onScoreUpdate, onLevelUp, initGame, saveGameProgress, isAnimating]);

    // --- Drag & Drop Handlers ---

    const handleDragStart = (tile: Tile, fromSlotIndex: number | null = null) => {
        setDraggedTile(tile);
        setDraggedFromSlot(fromSlotIndex);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault(); // Required to allow drop
    };

    const handleDrop = (slotIndex: number) => {
        if (!draggedTile || isAnimating || feedback === 'correct') return;

        setSlotContents(prev => {
            const next = [...prev];

            // If dragging from another slot, clear that slot
            if (draggedFromSlot !== null) {
                next[draggedFromSlot] = null;
            }

            // If the target slot already has a tile, we could swap or just overwrite.
            // For kids, let's keep it simple: Overwrite and return existing tile to pool.
            next[slotIndex] = draggedTile;
            return next;
        });

        setDraggedTile(null);
        setDraggedFromSlot(null);
    };

    const handlePoolDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (draggedFromSlot !== null) {
            // Remove from slot if dropped back to pool
            setSlotContents(prev => {
                const next = [...prev];
                next[draggedFromSlot] = null;
                return next;
            });
        }
        setDraggedTile(null);
        setDraggedFromSlot(null);
    };

    // Keep click-to-add for accessibility
    const handleTileClick = (tile: Tile) => {
        if (isAnimating || feedback === 'correct') return;

        const firstEmptyIndex = slotContents.findIndex(s => s === null);
        if (firstEmptyIndex !== -1) {
            setSlotContents(prev => {
                const next = [...prev];
                next[firstEmptyIndex] = tile;
                return next;
            });
        }
    };

    const handleSlotClick = (index: number) => {
        if (isAnimating || feedback === 'correct') return;
        setSlotContents(prev => {
            const next = [...prev];
            next[index] = null;
            return next;
        });
    };

    const resetSequence = () => {
        setSlotContents(new Array(currentProblem.targetEquation.length).fill(null));
        setFeedback(null);
    };

    const usedTileIds = useMemo(() =>
        slotContents.filter((s): s is Tile => s !== null).map(s => s.id)
        , [slotContents]);

    return (
        <div className="w-full flex flex-col items-center max-w-4xl mx-auto space-y-8 py-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Game Header Section */}
            <div className="text-center space-y-3">
                <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-md">
                    Equation Builder! 🔢
                </h2>
                <div className="flex flex-col md:flex-row gap-3 justify-center items-center">
                    <p className="text-white/90 font-medium text-lg bg-white/10 px-4 py-1 rounded-full backdrop-blur-md border border-white/10">
                        Drag or tap tiles to build the equation!
                    </p>
                    <span className={`px-4 py-1.5 rounded-2xl text-sm font-black uppercase tracking-widest shadow-lg ${currentDifficulty === 'easy' ? 'bg-emerald-400 text-emerald-950 shadow-emerald-500/20' :
                        currentDifficulty === 'medium' ? 'bg-amber-400 text-amber-950 shadow-amber-500/20' :
                            'bg-rose-500 text-white shadow-rose-900/20'
                        }`}>
                        {currentDifficulty}
                    </span>
                </div>
            </div>

            {/* Target Display & Build Area */}
            <div className="w-full flex flex-col items-center space-y-6">
                <Card className="relative w-24 h-24 flex items-center justify-center bg-white/20 backdrop-blur-2xl border-2 border-white/30 rounded-3xl shadow-lg">
                    <span className="text-6xl">{currentProblem.emoji}</span>
                </Card>

                <div className="flex flex-wrap gap-2 md:gap-4 justify-center items-center min-h-[120px] w-full bg-black/10 p-6 rounded-[2.5rem] border-2 border-dashed border-white/20">
                    {slotContents.map((tile, idx) => (
                        <div
                            key={`slot-${idx}`}
                            onDragOver={handleDragOver}
                            onDrop={() => handleDrop(idx)}
                            onClick={() => tile && handleSlotClick(idx)}
                            className={`w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-2xl border-2 transition-all duration-300 cursor-pointer
                                ${tile
                                    ? 'bg-white border-white text-slate-900 shadow-xl scale-100'
                                    : 'bg-white/5 border-white/20 text-white/20 scale-95 border-dashed'
                                } hover:border-white/40`}
                        >
                            {tile ? (
                                <span
                                    draggable
                                    onDragStart={() => handleDragStart(tile, idx)}
                                    className="text-2xl md:text-4xl font-black select-none"
                                >
                                    {tile.value}
                                </span>
                            ) : (
                                <span className="text-xs font-bold uppercase tracking-wider">Drop</span>
                            )}
                        </div>
                    ))}

                    {slotContents.some(s => s !== null) && !isAnimating && (
                        <Button
                            variant="ghost"
                            onClick={resetSequence}
                            className="ml-4 text-white/50 hover:text-white hover:bg-white/10 rounded-full w-10 h-10 p-0"
                        >
                            ✕
                        </Button>
                    )}
                </div>
            </div>

            {/* Pool Area */}
            <div
                className="w-full space-y-4"
                onDragOver={handleDragOver}
                onDrop={handlePoolDrop}
            >
                <div className="flex justify-between items-center px-6">
                    <h3 className="text-white/60 font-bold text-sm uppercase tracking-widest">Available Tiles</h3>
                </div>
                <div className="flex flex-wrap gap-3 md:gap-4 justify-center bg-white/5 p-8 rounded-[2.5rem] backdrop-blur-md border-2 border-white/10 shadow-inner w-full min-h-[200px]">
                    {shuffledPool
                        .filter(tile => !usedTileIds.includes(tile.id))
                        .map((tile) => (
                            <button
                                key={tile.id}
                                draggable
                                onDragStart={() => handleDragStart(tile)}
                                onClick={() => handleTileClick(tile)}
                                disabled={isAnimating}
                                className="w-16 h-16 md:w-24 md:h-24 bg-white hover:bg-gradient-to-br hover:from-white hover:to-blue-50 text-slate-800 text-2xl md:text-4xl font-black rounded-2xl shadow-[0_8px_0_rgba(0,0,0,0.1)] border-b-6 border-slate-200 transition-all transform hover:-translate-y-1 active:translate-y-1 active:border-b-0 hover:shadow-xl flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed cursor-grab active:cursor-grabbing"
                            >
                                <span className="group-hover:scale-110 transition-transform select-none">{tile.value}</span>
                            </button>
                        ))
                    }
                </div>
            </div>

            {/* Feedback Messages */}
            <div className="h-16 flex items-center justify-center">
                {feedback && (
                    <div className={`text-3xl md:text-5xl font-black px-8 py-3 rounded-2xl backdrop-blur-xl border-2 shadow-2xl animate-in zoom-in slide-in-from-top-4 duration-300
                        ${feedback === 'correct' ? 'bg-emerald-400/20 border-emerald-400 text-emerald-300' : 'bg-rose-500/20 border-rose-500 text-rose-300'}`}>
                        {feedback === 'correct' ? 'GREAT JOB! ✨' : 'WHOOPS! 🤔'}
                    </div>
                )}
            </div>
        </div>
    );
}
