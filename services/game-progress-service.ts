import { api } from "../lib/axios";
import { GameProgress } from "../types/auth";

export const saveGameProgressApi = async (
    progress: GameProgress
): Promise<{ success: boolean }> => {
    const res = await api.post("/game-progress/save-progress", progress);
    return res.data;
};

export const saveWordBuilderProgressApi = async (
    progress: GameProgress
): Promise<{ success: boolean }> => {
    const res = await api.post("/game-progress/save-progress/word-builder", progress);
    return res.data;
};

export const saveLetterTraceProgressApi = async (
    progress: GameProgress
): Promise<{ success: boolean }> => {
    const res = await api.post("/game-progress/save-progress/letter-trace", progress);
    return res.data;
};

export const getGameProgressApi = async (gameName: string): Promise<GameProgress> => {
    const res = await api.get(`/game-progress/get-progress/${gameName}`);
    return res.data;
};
