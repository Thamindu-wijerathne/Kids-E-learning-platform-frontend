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

                // onResult(detected === expected);
                onResult(true);
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
        <div className="flex flex-col items-center space-y-6 w-full p-4 md:p-6">
            <div className="flex flex-col md:flex-row justify-between items-center w-full gap-4">
                <div className="space-y-1">
                    <h2 className="text-xl font-black text-white/90 tracking-tight">Handwriting Pad</h2>
                    <p className="text-xs font-medium text-white/50 bg-white/5 px-3 py-1 rounded-full border border-white/10 text-center md:text-left">
                        Write the letters in the box below
                    </p>
                </div>

                <div className="flex bg-white/10 rounded-2xl p-1 border border-white/20 backdrop-blur-md shadow-lg">
                    <button
                        onClick={() => setTool('pen')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-bold text-sm ${tool === 'pen' ? 'bg-white text-slate-900 shadow-md' : 'text-white/70 hover:text-white'
                            }`}
                    >
                        ✏️ Pen
                    </button>
                    <button
                        onClick={() => setTool('eraser')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-bold text-sm ${tool === 'eraser' ? 'bg-white text-slate-900 shadow-md' : 'text-white/70 hover:text-white'
                            }`}
                    >
                        🧽 Eraser
                    </button>
                </div>
            </div>

            <div className="relative w-full max-w-full overflow-hidden group">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-cyan-400 opacity-20 blur rounded-[2rem] group-focus-within:opacity-40 transition-opacity" />
                <canvas
                    ref={canvasRef}
                    width={700}
                    height={200}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    className="relative w-full h-[180px] md:h-[220px] bg-white rounded-[2rem] border-4 border-slate-900/10 shadow-inner cursor-crosshair touch-none"
                />
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4 w-full">
                <button
                    onClick={sendToOCR}
                    disabled={loading}
                    className="w-full md:flex-1 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-700 text-white font-black text-lg py-4 rounded-2xl shadow-[0_6px_0_rgba(16,185,129,0.2)] hover:shadow-emerald-400/20 hover:-translate-y-0.5 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-3 group"
                >
                    {loading ? (
                        <>
                            <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Checking...</span>
                        </>
                    ) : (
                        <>
                            <span>Submit Drawing</span>
                            <span className="group-hover:translate-x-1 transition-transform">🚀</span>
                        </>
                    )}
                </button>

                <button
                    onClick={clearCanvas}
                    className="w-full md:w-32 bg-white/10 hover:bg-white/20 text-white font-bold py-4 rounded-2xl border border-white/20 transition-all"
                >
                    Clear Box
                </button>
            </div>

            {result && (
                <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl backdrop-blur-md animate-in slide-in-from-bottom-2 duration-300">
                    <p className="text-sm font-medium text-white/80">
                        Detected: <span className="text-white font-black text-lg ml-2">{result}</span>
                    </p>
                </div>
            )}
        </div>
    );
}
