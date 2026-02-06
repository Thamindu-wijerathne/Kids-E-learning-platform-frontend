'use client';

import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Mic, Square, Loader2, Sparkles, Volume2 } from 'lucide-react';
import AudioRecorder from '../AudioRecorder'; 
import { useGameProgress } from '@/contexts/game-progress-context';
import { saveSpeechExplorerProgressApi } from '@/services/game-progress-service';

interface GameProps {
    onLevelUp?: () => void;
    onScoreUpdate?: (points: number) => void;
    gameData?: any;
    level: number;
    currentScore: number;
}

const TARGET_WORDS = [
    { word: 'APPLE', emoji: '🍎' },
    { word: 'BANANA', emoji: '🍌' },
    { word: 'CAT', emoji: '🐱' },
    { word: 'DOG', emoji: '🐶' },
    { word: 'ELEPHANT', emoji: '🐘' },
    { word: 'FLOWER', emoji: '🌸' },
    { word: 'GRAPES', emoji: '🍇' },
    { word: 'HOUSE', emoji: '🏠' },
];



export default function SpeechExplorer({ onLevelUp, onScoreUpdate, level, currentScore }: GameProps) {
    const [result, setResult] = useState<string>('');
    const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const screenStartTimeRef = useRef<number>(Date.now());


    const target = TARGET_WORDS[currentIndex % TARGET_WORDS.length];

    return (
        <div className="w-full flex flex-col items-center max-w-4xl mx-auto space-y-10 py-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Game Header Section */}
            <div className="text-center space-y-3">
                <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-md">
                    Speech Explorer 🎤
                </h2>
                <div className="flex flex-col md:flex-row gap-3 justify-center items-center">
                    <p className="text-white/90 font-medium text-lg bg-white/10 px-4 py-1 rounded-full backdrop-blur-md border border-white/10">
                        Goal: Say the word shown below!
                    </p>
                    <div className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-2xl border border-white/20 text-white font-bold text-sm">
                        Level {level}
                    </div>
                </div>
            </div>

            {/* Target Display */}
            <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 rounded-[3rem] blur-2xl opacity-50 group-hover:opacity-80 transition-opacity" />
                <Card className="relative w-64 h-72 md:w-80 md:h-96 flex flex-col items-center justify-center bg-white/20 backdrop-blur-2xl border-2 border-white/30 rounded-[3rem] shadow-2xl transition-transform duration-500 hover:scale-105 overflow-hidden">
                    <div className="flex-1 flex items-center justify-center">
                        <span className="text-9xl md:text-[10rem] drop-shadow-2xl">{target.emoji}</span>
                    </div>
                    <div className="w-full bg-white/20 py-6 text-center">
                        <span className="text-4xl md:text-5xl font-black text-white tracking-widest">{target.word}</span>
                    </div>
                </Card>
            </div>

            {/* Recording Controls */}
            <AudioRecorder
            endpoint="http://localhost:8000/speech-recognize/speech-recognize-word"
            onText={(recognizedText) => {
                setResult(recognizedText);

                const isCorrect = recognizedText
                .toLowerCase()
                .includes(target.word.toLowerCase());

                if (isCorrect) {
                    setFeedback('correct');

                    const timeSpentMs = Date.now() - screenStartTimeRef.current;

                    // Save game status
                    saveSpeechExplorerProgressApi({
                        game: "Speech Explorer",
                        level,
                        score: currentScore + 10,     // because you add 10 on correct
                        targetWord: target.word,
                        recognizedText,
                        index: currentIndex,
                        timestamp: Date.now(),
                        timeSpent: Math.floor(timeSpentMs / 1000), // convert to seconds
                    });

                    screenStartTimeRef.current = Date.now();

                if (onScoreUpdate) onScoreUpdate(10);

                setTimeout(() => {
                    setCurrentIndex((prev) => prev + 1);
                    setFeedback(null);
                    setResult('');
                    if (onLevelUp) onLevelUp();
                }, 2000);

                } else {
                    setFeedback('wrong');
                    setTimeout(() => setFeedback(null), 1500);
                }
            }}
            >
            {({ isRecording, loading, start, stop }) => (
                <div className="flex flex-col items-center space-y-6 w-full max-w-md">
                    <div className="relative">
                        {isRecording && (
                        <div className="absolute -inset-4 bg-red-500/30 rounded-full animate-ping pointer-events-none" />
                        )}

                        <button
                        onClick={isRecording ? stop : start}
                        disabled={loading}
                        className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl border-4 ${
                            isRecording
                            ? 'bg-red-500 border-red-300 scale-110 hover:bg-red-600'
                            : 'bg-white border-white/50 hover:scale-105 hover:shadow-indigo-500/30'
                        } disabled:opacity-50 disabled:cursor-not-allowed group`}
                        >
                        {isRecording ? (
                            <Square className="w-12 h-12 text-white fill-white" />
                        ) : (
                            <Mic
                            className={`w-12 h-12 ${
                                isRecording ? 'text-white' : 'text-indigo-600'
                            } group-hover:rotate-12 transition-transform`}
                            />
                        )}
                        </button>
                    </div>

                    <p className="text-white font-bold text-lg">
                        {isRecording ? 'Listening...' : loading ? 'Processing...' : 'Click to Speak'}
                    </p>

                    <div className="flex items-center gap-3">
                        {loading && <Loader2 className="w-6 h-6 text-white animate-spin" />}
                        {result && !loading && (
                        <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20 animate-in slide-in-from-bottom-2">
                            <p className="text-white/80 text-sm font-medium">I heard:</p>
                            <p className="text-white font-black text-xl">"{result}"</p>
                        </div>
                        )}
                    </div>
                </div>
            )}
            </AudioRecorder>


            {/* Feedback Message */}
            <div className="h-16 flex items-center justify-center">
                {feedback && (
                    <div className={`text-3xl md:text-5xl font-black px-8 py-3 rounded-2xl backdrop-blur-xl border-2 shadow-2xl animate-in zoom-in duration-300
                        ${feedback === 'correct' ? 'bg-emerald-400/20 border-emerald-400 text-emerald-300' : 'bg-rose-500/20 border-rose-500 text-rose-300'}`}>
                        {feedback === 'correct' ? 'GREAT SPEAKING! ✨' : 'TRY AGAIN! 🎤'}
                    </div>
                )}
            </div>
        </div>
    );
}
