"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useRef, useCallback } from "react";
import { getGameProgressApi, saveGameProgressApi, saveWordBuilderProgressApi, saveLetterTraceProgressApi } from "../services/game-progress-service";
import { useAuth } from "./auth-context";
import { GameProgress, GameProgressContextType } from "../types/auth";
import { useParams } from "next/navigation";
import { gamesList } from "@/lib/gamesConfig";

const GameProgressContext = createContext<GameProgressContextType | undefined>(undefined);

export const GameProgressProvider = ({ children }: { children: ReactNode }) => {
    const params = useParams();
    const currentGameId = params?.id ? (params.id as string) : null;
    const currentGameName = currentGameId ? (gamesList.find(g => g.id === currentGameId)?.name || null) : null;

    const [gameProgress, setGameProgress] = useState<GameProgress | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [startTime, setStartTime] = useState<number | null>(null);
    const isSavingRef = useRef(false); // prevent double save


    const loadGameProgress = useCallback(async () => {
        if (!currentGameName) return;

        // Always set a start time when we attempt to load a game
        setStartTime(Date.now());

        try {
            const progress = await getGameProgressApi(currentGameName);
            console.log("Game progress loaded:", progress);
            setGameProgress(progress);
        } catch (err) {
            console.error("Game progress load failed:", err);
            // Even if it fails, we have startTime set now so saving will work later
        }
    }, [currentGameName]);

    useEffect(() => {
        const saved = localStorage.getItem("playlearn_game_progress");
        if (saved) {
            setGameProgress(JSON.parse(saved));
            // Also set a start time if we are resuming from local storage
            if (currentGameName) setStartTime(Date.now());
        }
        setIsLoading(false);
    }, [currentGameName]);

    useEffect(() => {
        loadGameProgress();
    }, [loadGameProgress]);

    const saveGameProgress = async (progress: GameProgress) => {
        console.log("Game progress saved before timeSpent:", progress);
        if (!startTime) return;

        const now = Date.now();
        const duration = Math.floor((now - startTime) / 1000);

        // 1️⃣ update UI immediately
        // We set the timeSpent for this specific segment
        progress.timeSpent = duration;

        console.log("Game progress saved after timeSpent:", progress);
        setGameProgress(progress);
        localStorage.setItem("playlearn_game_progress", JSON.stringify(progress));

        // 2️⃣ avoid duplicate calls
        if (isSavingRef.current) return;

        // Only reset the anchor after we've committed to a sync
        setStartTime(now);
        isSavingRef.current = true;

        try {
            // 3️⃣ sync to backend - Dispatch based on game name
            switch (currentGameName) {
                case "Word Builder":
                    await saveWordBuilderProgressApi(progress);
                    break;
                default:
                    await saveGameProgressApi(progress);
                    break;
            }
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
