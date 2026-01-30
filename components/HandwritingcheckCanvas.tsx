'use client';

import React, { useRef, useState } from 'react';
import { useEffect } from 'react';

interface HandwritingCanvasProps {
    expectedWord: string;
    onResult: (isCorrect: boolean) => void;
}

function normalize(text: string) {
    return text
        .toUpperCase()
        .replace(/[^A-Z]/g, '');
}

// thamindu implemation with python
export default function HandwritingcheckCanvas({ expectedWord, onResult }: HandwritingCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [result, setResult] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [tool, setTool] = useState<'pen' | 'eraser'>('pen');

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;

        setIsDrawing(true);
        ctx.beginPath();
        ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    };


    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;

        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;

        ctx.lineWidth = tool === 'eraser' ? 20 : 3;
        ctx.lineCap = 'round';

        if (tool === 'eraser') {
            ctx.globalCompositeOperation = 'destination-out';
        } else {
            ctx.globalCompositeOperation = 'source-over';
            ctx.strokeStyle = 'black';
        }

        ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        ctx.stroke();
    };


    const stopDrawing = () => setIsDrawing(false);

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        setResult('');
    };

    const sendToOCR = async () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        setLoading(true);

        canvas.toBlob(async (blob) => {
            if (!blob) return;

            // Force PNG
            const file = new File([blob], 'handwriting.png', {
                type: 'image/png',
            });

            const formData = new FormData();
            formData.append('file', file);

            try {
                const res = await fetch('http://localhost:8000/ocr/handwriting-ocr', {
                    method: 'POST',
                    body: formData,
                });

                const data = await res.json();

                // OCR text
                const rawText = data.text.map((t: any) => t[1]).join('');
                const detected = normalize(rawText);
                const expected = normalize(expectedWord);

                setResult(detected);

                onResult(detected === expected);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        });
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }, []);

    return (
        <div style={{ padding: 20 }}>
            <h2>Handwriting OCR Test</h2>

            <canvas
                ref={canvasRef}
                width={700}
                height={200}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                style={{ border: '2px solid black', background: 'white' }}
            />
            <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                <button onClick={() => setTool('pen')}>✏️ Pen</button>
                <button onClick={() => setTool('eraser')}>🧽 Eraser</button>
            </div>

            <div style={{ marginTop: 10, display: 'flex', gap: 10 }}>
                <button onClick={sendToOCR} disabled={loading}>
                    {loading ? 'Recognizing...' : 'Submit'}
                </button>
                <button onClick={clearCanvas}>Clear</button>
            </div>

            {result && (
                <p style={{ marginTop: 15 }}>
                    <strong>Recognized Text:</strong> {result}
                </p>
            )}
        </div>
    );
}
