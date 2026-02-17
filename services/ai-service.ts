import { api } from "../lib/axios";

/**
 * Sends a handwriting image blob to the backend for OCR recognition.
 * @param formData FormData containing the 'file' blob of the handwriting.
 * @returns Recognized text and other metadata.
 */
export const handwritingOcrApi = async (formData: FormData): Promise<{ text: any[] }> => {
    const res = await api.post("/ocr/handwriting-ocr", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data;
};

/**
 * Sends an audio blob to the backend for speech recognition.
 * @param endpoint The relative endpoint path (e.g., "/speech-recognize/speech-recognize-word").
 * @param formData FormData containing the audio 'file'.
 * @returns Recognized text.
 */
export const speechRecognizeApi = async (endpoint: string, formData: FormData): Promise<{ text: string }> => {
    const res = await api.post(endpoint, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data;
};
