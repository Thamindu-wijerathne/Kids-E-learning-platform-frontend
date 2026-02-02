import { api } from "../lib/axios";
import { GameProgress } from "../types/auth";

export const saveGameProgressApi = async (
    progress: GameProgress
): Promise<{ success: boolean }> => {
    const res = await api.post("/game-progress/save-progress", progress);
    return res.data;
};
