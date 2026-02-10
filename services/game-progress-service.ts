import { api } from "../lib/axios";
import { GameProgress, SpeechExplorerGameProgress } from "../types/auth";

export const saveGameProgressApi = async (
    progress: GameProgress
): Promise<{ success: boolean }> => {
    const res = await api.post("/game-progress/save-progress", progress);
    return res.data;
};

export const saveWordBuilderProgressApi = async (
    progress: GameProgress
): Promise<{ success: boolean }> => {
    const res = await api.post("/word-builder/save-progress", progress);
    return res.data;
};

export const saveLetterTraceProgressApi = async (
    progress: GameProgress
): Promise<{ success: boolean }> => {
    const res = await api.post("/game-progress/save-progress/letter-trace", progress);
    return res.data;
};

export const saveSpeechExplorerProgressApi = async (
    progress: SpeechExplorerGameProgress
): Promise<{ success: boolean }> => {
    // console.log("Saving Speech Explorer progress: ", progress);
    const res = await api.post("/game-progress/save-progress/speech-explorer", progress);
    return res.data;
};


export const getGameProgressApi = async (gameName: string): Promise<GameProgress> => {
    const res = await api.get(`/game-progress/get-progress/${gameName}`);
    return res.data;
};

export const saveScoreApi = async (
    gameId: string,
    score: number,
    type: 'session' | 'persistent' | 'highest'
): Promise<{ totalScore?: number; highScore?: number; lastScore?: number }> => {
    const res = await api.post(`/game-progress/scores/${gameId}`, { score, type });
    return res.data;
};

export const getScoreApi = async (
    gameId: string
): Promise<{ totalScore: number; highScore: number; lastScore: number }> => {
    const res = await api.get(`/game-progress/scores/${gameId}`);
    return res.data;
};

export const saveLevelApi = async (
    gameId: string,
    level: number
): Promise<{ level: number }> => {
    const res = await api.post(`/game-progress/levels/${gameId}`, { level });
    return res.data;
};

export const getLevelApi = async (
    gameId: string
): Promise<{ level: number }> => {
    const res = await api.get(`/game-progress/levels/${gameId}`);
    return res.data;
};
