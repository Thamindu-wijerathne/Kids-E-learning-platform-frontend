"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { HandwritingCanvas } from '@/components/HandwritingCanvas';

interface LetterBlock {
  id: string;
  letter: string;
  row: number;
  col: number;
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
  const [message, setMessage] = useState('Click "Start Game" to begin!');
  const [inputWord, setInputWord] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [finalScore, setFinalScore] = useState<number | null>(null);

  const startGame = () => {
    setGrid([]);
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
    setGamePaused(false);
    setFinalScore(null);
    setMessage('Game started! Form words from the letters.');
    setInputWord('');
  };

  const pauseGame = () => {
    setGamePaused(!gamePaused);
    setMessage(gamePaused ? 'Game resumed!' : 'Game paused');
  };

  const stopGame = () => {
    setGameStarted(false);
    setGamePaused(false);
    setGameOver(true);
    setFinalScore(score);
    setMessage(`Game stopped! Final score: ${score} (ready to send to backend)`);
    console.log('Final score for backend:', score);
  };

  // Add new letter every 2 seconds
  useEffect(() => {
    if (!gameStarted || gameOver || gamePaused) return;

    const interval = setInterval(() => {
      addNewLetter();
    }, 2000);

    return () => clearInterval(interval);
  }, [grid, gameOver, gameStarted, gamePaused]);

  const getRandomLetter = () => {
    return LETTER_FREQUENCY[Math.floor(Math.random() * LETTER_FREQUENCY.length)];
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameStarted || gamePaused || gameOver) return;

      // Ignore if typing in input field or it's Enter key
      if (e.target instanceof HTMLInputElement || e.key === 'Enter') return;

      // Only letters
      if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
        setInputWord(prev => prev + e.key.toUpperCase());
      }
      // Backspace
      else if (e.key === 'Backspace') {
        setInputWord(prev => prev.slice(0, -1));
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStarted, gamePaused, gameOver]);

  const addNewLetter = () => {
    setGrid(currentGrid => {
      // Find available columns at the top
      const topRowBlocks = currentGrid.filter(block => block.row === 0);
      const occupiedCols = new Set(topRowBlocks.map(block => block.col));
      const availableCols = Array.from({ length: GRID_COLS }, (_, i) => i).filter(col => !occupiedCols.has(col));

      if (availableCols.length === 0) {
        setGameOver(true);
        setGameStarted(false);
        setFinalScore(score);
        setMessage('Game Over! No more space for letters.');
        return currentGrid;
      }

      const randomCol = availableCols[Math.floor(Math.random() * availableCols.length)];
      const newBlock: LetterBlock = {
        id: `${Date.now()}-${randomCol}`,
        letter: getRandomLetter(),
        row: 0,
        col: randomCol,
      };

      // Apply gravity to all blocks
      const updatedGrid = applyGravity([...currentGrid, newBlock]);

      // Check if grid is full
      if (updatedGrid.length >= GRID_ROWS * GRID_COLS) {
        setGameOver(true);
        setGameStarted(false);
        setFinalScore(score);
        setMessage('Game Over! Grid is full.');
      }

      return updatedGrid;
    });
  };

  const applyGravity = (blocks: LetterBlock[]): LetterBlock[] => {
    const newBlocks = [...blocks];
    let moved = true;

    while (moved) {
      moved = false;
      for (let i = 0; i < newBlocks.length; i++) {
        const block = newBlocks[i];
        if (block.row < GRID_ROWS - 1) {
          // Check if there's space below
          const hasBlockBelow = newBlocks.some(
            b => b.col === block.col && b.row === block.row + 1
          );
          if (!hasBlockBelow) {
            newBlocks[i] = { ...block, row: block.row + 1 };
            moved = true;
          }
        }
      }
    }

    return newBlocks;
  };

  const validateWord = async (word: string) => {
    if (word.length < 2) {
      setMessage('Word must be at least 2 letters long');
      return false;
    }

    setIsValidating(true);
    setMessage('Validating word...');

    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`);

      if (response.ok) {
        return true;
      } else if (response.status === 404) {
        setMessage(`"${word}" is not a valid word`);
        setInputWord('');
        return false;
      } else {
        setMessage('Error validating word. Please try again.');
        return false;
      }
    } catch (error) {
      console.error('Validation error:', error);
      setMessage('Network error. Please check your connection.');
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  const canFormWord = (word: string): boolean => {
    const wordLetters = word.toUpperCase().split('');
    const availableLetters = grid.map(block => block.letter);

    const letterCount: { [key: string]: number } = {};
    availableLetters.forEach(letter => {
      letterCount[letter] = (letterCount[letter] || 0) + 1;
    });

    for (const letter of wordLetters) {
      if (!letterCount[letter] || letterCount[letter] === 0) {
        return false;
      }
      letterCount[letter]--;
    }

    return true;
  };

  const removeLettersFromWord = (word: string) => {
    const wordLetters = word.toUpperCase().split('');
    const newGrid = [...grid];

    for (const letter of wordLetters) {
      const index = newGrid.findIndex(block => block.letter === letter);
      if (index !== -1) {
        newGrid.splice(index, 1);
      }
    }

    // Apply gravity after removal
    return applyGravity(newGrid);
  };

  const handleSubmitWord = async () => {
    if (!inputWord || isValidating || !gameStarted || gamePaused) return;

    const word = inputWord.trim().toUpperCase();

    if (!canFormWord(word)) {
      setMessage(`Cannot form "${word}" with available letters`);
      setInputWord('');
      return;
    }

    const isValid = await validateWord(word);

    if (isValid) {
      const points = word.length;
      setScore(score + points);
      setGrid(removeLettersFromWord(word));
      setMessage(`✓ "${word}" is correct! +${points} points`);
      setInputWord('');
    }
  };

  const handleCanvasWord = async (recognizedWord: string) => {
    if (!gameStarted || gamePaused) return;

    const word = recognizedWord.trim().toUpperCase();
    if (!word) return;

    setInputWord(word);

    if (!canFormWord(word)) {
      setMessage(`Cannot form "${word}" with available letters`);
      return;
    }

    const isValid = await validateWord(word);

    if (isValid) {
      const points = word.length;
      setScore(score + points);
      setGrid(removeLettersFromWord(word));
      setMessage(`✓ "${word}" is correct! +${points} points`);
      setInputWord('');
    }
  };

  const renderGrid = () => {
    const cells = [];
    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        const block = grid.find(b => b.row === row && b.col === col);
        cells.push(
          <div
            key={`${row}-${col}`}
            style={{
              width: '50px',
              height: '50px',
              border: '1px solid #ccc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: block ? '#4CAF50' : 'white',
              fontSize: '24px',
              fontWeight: 'bold',
              color: block ? 'white' : '#eee',
              transition: 'all 0.3s ease-in-out',
              position: 'relative',
            }}
          >
            {block ? block.letter : ''}
          </div>
        );
      }
    }
    return cells;
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Letter Tetris</h1>

      <div style={{ display: 'flex', gap: '40px', marginTop: '20px' }}>
        {/* Game Grid */}
        <div>
          <h2>Game Board</h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${GRID_COLS}, 50px)`,
              gap: '0',
              border: '3px solid #333',
              backgroundColor: '#f5f5f5',
              opacity: gamePaused ? 0.5 : 1,
            }}
          >
            {renderGrid()}
          </div>

          <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
            {!gameStarted ? (
              <button
                onClick={startGame}
                style={{
                  padding: '10px 20px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                }}
              >
                Start Game
              </button>
            ) : (
              <>
                <button
                  onClick={pauseGame}
                  disabled={gameOver}
                  style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    cursor: gameOver ? 'not-allowed' : 'pointer',
                    backgroundColor: gamePaused ? '#FFC107' : '#FF9800',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                  }}
                >
                  {gamePaused ? 'Resume' : 'Pause'}
                </button>
                <button
                  onClick={stopGame}
                  style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    backgroundColor: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                  }}
                >
                  Stop Game
                </button>
              </>
            )}
          </div>
        </div>

        {/* Controls */}
        <div>
          <h2>Score: {score}</h2>
          {finalScore !== null && (
            <p style={{ color: '#4CAF50', fontWeight: 'bold' }}>
              Final Score: {finalScore} (ready for backend)
            </p>
          )}

          <div style={{ marginBottom: '20px' }}>
            <p style={{
              padding: '10px',
              backgroundColor: message.includes('✓') ? '#d4edda' : '#f8f9fa',
              border: '1px solid #ddd',
              minHeight: '40px'
            }}>
              {message}
            </p>
          </div>

          <h3>Type a word:</h3>
          <div style={{ marginBottom: '20px' }}>
            <input
              type="text"
              value={inputWord}
              onChange={(e) => setInputWord(e.target.value.toUpperCase())}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmitWord()}
              disabled={!gameStarted || gameOver || isValidating || gamePaused}
              style={{
                padding: '10px',
                fontSize: '16px',
                width: '200px',
                marginRight: '10px',
              }}
              placeholder="Type word..."
            />
            <button
              onClick={handleSubmitWord}
              disabled={!gameStarted || gameOver || isValidating || gamePaused}
              style={{
                padding: '10px 20px',
                fontSize: '16px',
                cursor: (!gameStarted || gameOver || isValidating || gamePaused) ? 'not-allowed' : 'pointer',
              }}
            >
              {isValidating ? 'Checking...' : 'Submit'}
            </button>
          </div>

          <h3>Or draw a word:</h3>
          <HandwritingCanvas
            onWordRecognized={handleCanvasWord}
            width={400}
            height={150}
          />

          <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
            <p><strong>How to play:</strong></p>
            <ul style={{ marginLeft: '20px' }}>
              <li>Click "Start Game" to begin</li>
              <li>Letters fall into the grid automatically</li>
              <li>Form words using available letters</li>
              <li>Type or draw your word and submit</li>
              <li>Correct words remove those letters from the grid</li>
              <li>Use Pause to take a break</li>
              <li>Use Stop to end and save your score</li>
              <li>Game ends when grid fills up</li>
              <li>Longer words = more points!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}