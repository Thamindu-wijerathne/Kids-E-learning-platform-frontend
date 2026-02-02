"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useRef } from "react";
import { GameProgress, GameProgressContextType } from "../types/auth";
import { saveGameProgressApi } from "../services/game-progress-service";
import { useAuth } from "./auth-context";

const GameProgressContext = createContext<GameProgressContextType | undefined>(undefined);

export const GameProgressProvider = ({ children }: { children: ReactNode }) => {
    const [gameProgress, setGameProgress] = useState<GameProgress | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const { token } = useAuth();
    const isSavingRef = useRef(false); // prevent double save

    useEffect(() => {
        const saved = localStorage.getItem("playlearn_game_progress");
        if (saved) setGameProgress(JSON.parse(saved));
        setIsLoading(false);
    }, []);

    const saveGameProgress = async (progress: GameProgress) => {
        // 1️⃣ update UI immediately
        setGameProgress(progress);
        localStorage.setItem("playlearn_game_progress", JSON.stringify(progress));

        // 2️⃣ avoid duplicate calls
        if (isSavingRef.current) return;
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
            value={{ gameProgress, saveGameProgress, isLoading }}
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
