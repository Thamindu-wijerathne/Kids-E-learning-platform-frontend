'use client';

import { useRef, useState } from 'react';

type AudioRecorderRenderProps = {
  isRecording: boolean;
  loading: boolean;
  start: () => Promise<void>;
  stop: () => void;
};

type AudioRecorderProps = {
  endpoint: string;                 // e.g. "http://localhost:8000/..."
  onText: (text: string) => void;   // gets backend result text
  fieldName?: string;              // default "file"
  filename?: string;               // default "recording.webm"
  mimeType?: string;               // default "audio/webm"
  children: (props: AudioRecorderRenderProps) => React.ReactNode;
};

export default function AudioRecorder({
  endpoint,
  onText,
  fieldName = 'file',
  filename = 'recording.webm',
  mimeType = 'audio/webm',
  children,
}: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const sendToBackend = async (blob: Blob) => {
    setLoading(true);

    const formData = new FormData();
    const file = new File([blob], filename, { type: mimeType });
    formData.append(fieldName, file);

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      const recognizedText = data?.text || '';
      onText(recognizedText);
    } catch (err) {
      console.error('Error sending audio to backend:', err);
      onText(''); // return empty on error
    } finally {
      setLoading(false);
    }
  };

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Use an explicit mimeType if supported (more stable in Chrome)
      const preferred = 'audio/webm;codecs=opus';
      const useMime =
        typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(preferred)
          ? preferred
          : mimeType;

      const mediaRecorder = new MediaRecorder(stream, { mimeType: useMime });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: useMime });
        sendToBackend(blob);
      };

      // timeslice helps ensure chunks flush properly
      mediaRecorder.start(250);
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      onText('');
    }
  };

  const stop = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
      setIsRecording(false);
    }
  };

  return <>{children({ isRecording, loading, start, stop })}</>;
}
