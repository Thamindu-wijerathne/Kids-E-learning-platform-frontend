"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useRef, useCallback } from "react";
import { getGameProgressApi, saveGameProgressApi } from "../services/game-progress-service";
import { useAuth } from "./auth-context";
import { GameProgress, GameProgressContextType } from "../types/auth";
import { useParams } from "next/navigation";
import { gamesData } from "@/lib/games";



const GameProgressContext = createContext<GameProgressContextType | undefined>(undefined);

export const GameProgressProvider = ({ children }: { children: ReactNode }) => {
    const params = useParams();
    const currentGameId = params?.id ? parseInt(params.id as string) : null;
    const currentGameName = currentGameId ? gamesData[currentGameId]?.name : null;

    const [gameProgress, setGameProgress] = useState<GameProgress | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [startTime, setStartTime] = useState<number | null>(null);

    const { token } = useAuth();
    const isSavingRef = useRef(false); // prevent double save


    const loadGameProgress = useCallback(async () => {
        if (!currentGameName) return;
        try {
            const progress = await getGameProgressApi(currentGameName);
            setStartTime(Date.now());
            console.log("Game progress loaded:", progress);
            setGameProgress(progress);
        } catch (err) {
            console.error("Game progress load failed:", err);
        }
    }, [currentGameName]);

    useEffect(() => {
        const saved = localStorage.getItem("playlearn_game_progress");
        if (saved) setGameProgress(JSON.parse(saved));
        setIsLoading(false);
    }, []);

    useEffect(() => {
        loadGameProgress();
    }, [loadGameProgress]);

    const saveGameProgress = async (progress: GameProgress) => {
        if (!startTime) return;

        const now = Date.now();
        const duration = Math.floor((now - startTime) / 1000);

        // 1️⃣ update UI immediately
        // We set the timeSpent for this specific segment
        progress.timeSpent = duration;

        console.log("Game progress saved:", progress);
        setGameProgress(progress);
        localStorage.setItem("playlearn_game_progress", JSON.stringify(progress));

        // 2️⃣ avoid duplicate calls
        if (isSavingRef.current) return;

        // Only reset the anchor after we've committed to a sync
        setStartTime(now);
        isSavingRef.current = true;

        try {
            // 3️⃣ sync to backend
            await saveGameProgressApi(progress);
        } catch (err) {
            console.error("Game progress sync failed:", err);
        } finally {
            isSavingRef.current = false;
        }
    };



    return (
        <GameProgressContext.Provider
            value={{ gameProgress, saveGameProgress, loadGameProgress, isLoading, currentGameId, currentGameName }}
        >
            {children}
        </GameProgressContext.Provider>
    );
};

export const useGameProgress = () => {
    const context = useContext(GameProgressContext);
    if (!context) {
        throw new Error("useGameProgress must be used within GameProgressProvider");
    }
    return context;
};
