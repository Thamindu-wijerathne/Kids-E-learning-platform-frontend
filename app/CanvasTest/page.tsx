'use client';

import React, { useState } from 'react';
import { HandwritingCanvas } from '@/components/HandwritingCanvas';

export default function CanvasTest() {
  const [recognizedWord, setRecognizedWord] = useState<string>('');

  const handleWordRecognized = (word: string) => {
    setRecognizedWord(word);
    console.log('Recognized word:', word);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Handwriting Canvas Test</h1>
      <p>Draw a word on the canvas and click Submit</p>
      
      <HandwritingCanvas onWordRecognized={handleWordRecognized} />
      
      <div style={{ marginTop: '20px' }}>
        <h3>Recognized Text:</h3>
        <p style={{ 
          padding: '10px', 
          backgroundColor: '#f0f0f0', 
          minHeight: '30px',
          border: '1px solid #ccc'
        }}>
          {recognizedWord || '(nothing yet)'}
        </p>
      </div>
    </div>
  );
}
