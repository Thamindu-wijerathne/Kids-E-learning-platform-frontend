import React, { useRef, useState, useEffect } from 'react';
import Tesseract from 'tesseract.js';

interface HandwritingCanvasProps {
  onWordRecognized?: (word: string) => void;
  targetWord?: string;
  onComplete?: () => void;
  width?: number;
  height?: number;
}

export const HandwritingCanvas: React.FC<HandwritingCanvasProps> = ({
  onWordRecognized,
  targetWord,
  onComplete,
  width = 400,
  height = 200,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recognizedText, setRecognizedText] = useState(''); // <-- new state


  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set white background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);
  }, [width, height]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);
  };

  const recognizeText = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsProcessing(true);

    try {
      const result = await Tesseract.recognize(canvas, 'eng', {
        logger: (m) => console.log("tessaract : ", m),
      });

      const recognizedText = result.data.text.trim().toLowerCase();
      setRecognizedText(recognizedText);
      console.log("recognizedText : ", recognizedText);

      if (onWordRecognized) {
        onWordRecognized(recognizedText);
      }

      if (targetWord && onComplete && recognizedText === targetWord.toLowerCase()) {
        onComplete();
      }
    } catch (error) {
      console.error('OCR Error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ display: 'inline-block' }}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        style={{
          border: '2px solid #333',
          cursor: 'crosshair',
          display: 'block',
          marginBottom: '10px',
        }}
      />
      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={recognizeText} disabled={isProcessing}>
          {isProcessing ? 'Processing...' : 'Submit'}
        </button>
        <button onClick={clearCanvas} disabled={isProcessing}>
          Clear
        </button>
      </div>
    </div>
  );
};