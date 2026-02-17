"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useRef, useCallback } from "react";
import { getGameProgressApi, saveGameProgressApi, saveWordBuilderProgressApi, saveLetterTraceProgressApi } from "../services/game-progress-service";
import { useAuth } from "./auth-context";
import { GameProgress, GameProgressContextType } from "../types/auth";
import { useParams } from "next/navigation";
import { gamesList } from "@/lib/gamesConfig";
import { api } from "@/lib/axios";

const GameProgressContext = createContext<GameProgressContextType | undefined>(undefined);

export const GameProgressProvider = ({ children }: { children: ReactNode }) => {
    const params = useParams();
    const currentGameId = params?.id ? (params.id as string) : null;
    const currentGameName = currentGameId ? (gamesList.find(g => g.id === currentGameId)?.id || null) : null;

    const [gameProgress, setGameProgress] = useState<GameProgress | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [startTime, setStartTime] = useState<number | null>(null);

    const calculateTime = async (state: boolean) => {
        if (state) {
            setStartTime(Date.now());
            console.log("Game started, startTime set.");
        } else {
            if (!startTime) {
                console.warn("calculateTime(false) called but startTime is null.");
                return;
            }
            const timeDiff = Date.now() - startTime;
            console.log(`Saving progress for ${currentGameName}: ${timeDiff}ms`);

            try {
                await api.post("/game-progress/time", {
                    game: currentGameName,
                    timeSpent: timeDiff,
                });
                console.log("Time spent saved successfully.");
            } catch (err) {
                console.error("Failed to save time spent:", err);
            }

            const minutes = Math.floor(timeDiff / 60000);
            const seconds = Math.floor((timeDiff % 60000) / 1000);
            setStartTime(null);
            return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        }
    };


    return (
        <GameProgressContext.Provider
            value={{ gameProgress, isLoading, currentGameId, currentGameName, startTime, calculateTime }}
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
