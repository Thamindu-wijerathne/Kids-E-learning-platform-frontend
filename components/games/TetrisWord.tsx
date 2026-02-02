"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { HandwritingCanvas } from '@/components/HandwritingCanvas';

interface LetterBlock {
  id: string;
  letter: string;
  row: number;
  col: number;
  state: 'normal' | 'correct' | 'exploding';
}

const GRID_ROWS = 10;
const GRID_COLS = 8;
const LETTER_FREQUENCY = 'EEEEEEEEEEETTTTTTTTTAAAAAAAOOOOOOIIIIIIINNNNNNSSSSSSHHHHHHRRRRRDDDLLLUUUCCCMMMWWWFFFGGGYYYPPBBVVKJXQZ';

export function TetrisWord() {
  const [grid, setGrid] = useState<LetterBlock[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gamePaused, setGamePaused] = useState(false);
  const [message, setMessage] = useState({ text: 'Ready to play?', type: 'info' });
  const [inputWord, setInputWord] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const applyGravity = useCallback((blocks: LetterBlock[]): LetterBlock[] => {
    let newBlocks = [...blocks];
    let moved = true;
    while (moved) {
      moved = false;
      newBlocks.sort((a, b) => b.row - a.row);
      for (let i = 0; i < newBlocks.length; i++) {
        const block = newBlocks[i];
        if (block.row < GRID_ROWS - 1) {
          const hasBlockBelow = newBlocks.some(b => b.col === block.col && b.row === block.row + 1);
          if (!hasBlockBelow) {
            newBlocks[i] = { ...block, row: block.row + 1 };
            moved = true;
          }
        }
      }
    }
    return newBlocks;
  }, []);

  const addNewLetter = useCallback(() => {
    setGrid(currentGrid => {
      const topRowBlocks = currentGrid.filter(block => block.row === 0);
      const availableCols = Array.from({ length: GRID_COLS }, (_, i) => i)
        .filter(col => !topRowBlocks.some(b => b.col === col));

      if (availableCols.length === 0) {
        setGameOver(true);
        setGameStarted(false);
        return currentGrid;
      }

      const randomCol = availableCols[Math.floor(Math.random() * availableCols.length)];
      const newBlock: LetterBlock = {
        id: Math.random().toString(36).substr(2, 9),
        letter: LETTER_FREQUENCY[Math.floor(Math.random() * LETTER_FREQUENCY.length)],
        row: 0,
        col: randomCol,
        state: 'normal'
      };

      return applyGravity([...currentGrid, newBlock]);
    });
  }, [applyGravity]);

  useEffect(() => {
    if (!gameStarted || gameOver || gamePaused) return;
    const interval = setInterval(addNewLetter, 2000);
    return () => clearInterval(interval);
  }, [gameStarted, gameOver, gamePaused, addNewLetter]);

  const handleSubmitWord = async (wordToSubmit?: string) => {
    const word = (typeof wordToSubmit === 'string' ? wordToSubmit : inputWord).trim().toUpperCase();
    if (!word || word.length < 2 || isValidating) return;

    const tempGrid = [...grid];
    const blocksToRemove: string[] = [];
    let canForm = true;

    for (const char of word) {
      const index = tempGrid.findIndex(b => b.letter === char && b.state === 'normal');
      if (index !== -1) {
        blocksToRemove.push(tempGrid[index].id);
        tempGrid.splice(index, 1);
      } else {
        canForm = false;
        break;
      }
    }

    if (!canForm) {
      setMessage({ text: `Missing letters for "${word}"`, type: 'error' });
      return;
    }

    setIsValidating(true);
    try {
      const resp = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`);
      if (resp.ok) {
        setGrid(prevGrid => 
          prevGrid.map(b => 
            blocksToRemove.includes(b.id) ? { ...b, state: 'correct' as const } : b
          )
        );

        setTimeout(() => {
          setGrid(prevGrid => 
            prevGrid.map(b => 
              blocksToRemove.includes(b.id) ? { ...b, state: 'exploding' as const } : b
            )
          );

          setTimeout(() => {
            setGrid(prevGrid => 
              applyGravity(prevGrid.filter(b => !blocksToRemove.includes(b.id)))
            );
          }, 500);
        }, 500);

        setScore(s => s + (word.length * 10));
        setMessage({ text: `Great! +${word.length * 10}`, type: 'success' });
        setInputWord('');
      } else {
        setMessage({ text: `"${word}" isn't a word!`, type: 'error' });
      }
    } catch (e) {
      setMessage({ text: "Connection error", type: 'error' });
    } finally {
      setIsValidating(false);
    }
  };



  return (
    <div className="min-h-screen bg-[#E9F5F2] p-6 md:p-12 font-sans text-slate-700 flex items-center justify-center">
      <div className="max-w-4xl w-full">
        
        <div className="flex flex-row items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-800">WordDrop</h1>
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Score: {score}</p>
          </div>
          
          <div className="flex gap-3">
            {!gameStarted ? (
              <button onClick={() => { setGrid([]); setScore(0); setGameOver(false); setGameStarted(true); }} className="px-6 py-2 bg-slate-800 text-white rounded-lg font-bold hover:bg-slate-700 transition-all shadow-sm">
                Start Game
              </button>
            ) : (
              <button onClick={() => setGamePaused(!gamePaused)} className="px-4 py-2 bg-white/50 text-slate-600 rounded-lg font-bold text-xs border border-slate-200">
                {gamePaused ? 'Resume' : 'Pause'}
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          <div className="w-full lg:w-[320px] shrink-0">
            <div className="relative p-1.5 bg-white rounded-2xl shadow-sm">
              <div 
                className={`grid gap-0.5 bg-slate-50 rounded-xl overflow-hidden transition-all duration-300 ${gamePaused ? 'blur-sm opacity-20' : 'opacity-100'}`}
                style={{ 
                  gridTemplateColumns: `repeat(${GRID_COLS}, minmax(0, 1fr))`,
                  aspectRatio: `${GRID_COLS}/${GRID_ROWS}` 
                }}
              >
                {Array.from({ length: GRID_ROWS * GRID_COLS }).map((_, i) => {
                  const r = Math.floor(i / GRID_COLS);
                  const c = i % GRID_COLS;
                  const block = grid.find(b => b.row === r && b.col === c);
                  
                  return (
                    <div key={i} className="bg-white flex items-center justify-center aspect-square border-[0.5px] border-slate-100">
                      {block && (
                        <div 
                          className={`w-full h-full flex items-center justify-center text-slate-700 text-lg font-black transition-all
                            ${block.state === 'normal' ? 'bg-slate-100 animate-in zoom-in-90' : ''}
                            ${block.state === 'correct' ? 'bg-emerald-400 text-white scale-110' : ''}
                            ${block.state === 'exploding' ? 'bg-emerald-400 text-white animate-ping opacity-0' : ''}
                          `}
                        >
                          {block.letter}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {gameOver && (
                <div className="absolute inset-0 z-10 bg-white/90 rounded-2xl flex flex-col items-center justify-center p-6 text-center animate-in fade-in">
                  <h2 className="text-2xl font-black mb-4">Game Over!</h2>
                  <button onClick={() => { setGrid([]); setGameOver(false); setGameStarted(true); setScore(0); }} className="bg-slate-800 text-white px-6 py-2 rounded-lg font-bold">
                    Try Again
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 w-full flex flex-col gap-4">
            
            <div className={`h-10 flex items-center px-4 rounded-xl text-xs font-bold transition-all ${
              message.type === 'error' ? 'text-rose-500' : 
              message.type === 'success' ? 'text-emerald-600' : 'text-slate-400'
            }`}>
              {message.text}
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-6">
              
              <div className="flex items-stretch gap-2 h-11">
                <input 
                  type="text"
                  value={inputWord}
                  onChange={(e) => setInputWord(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmitWord()}
                  placeholder="Enter word..."
                  disabled={!gameStarted || gamePaused}
                  className="w-2/3 bg-slate-50 rounded-lg px-4 font-bold text-sm focus:outline-none focus:ring-1 focus:ring-emerald-400 transition-all uppercase"
                />
                <button 
                  onClick={() => handleSubmitWord()}
                  disabled={isValidating || !gameStarted || gamePaused || inputWord.length < 2}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold text-sm transition-all disabled:opacity-30 flex items-center justify-center"
                >
                  {isValidating ? '...' : 'Submit'}
                </button>
              </div>

              <div className="border-t border-slate-100"></div>

              <div className="flex flex-col items-center">
                <div className="bg-slate-50 rounded-xl p-3 w-full overflow-hidden flex justify-center">
                  <div className="scale-90 origin-center">
                    <HandwritingCanvas 
                      onWordRecognized={handleSubmitWord}
                      width={300} 
                      height={120}
                    />
                  </div>
                </div>
                <p className="mt-3 text-[10px] font-medium text-slate-400">Handwrite your word above</p>
              </div>
            </div>

            <div className="px-6 py-4 bg-white/40 rounded-2xl border border-white">
              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                Find words using the letters in the grid. Longer words clear more space and give you more points!
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}