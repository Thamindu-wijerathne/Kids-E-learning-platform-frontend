"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { getUserProfile } from "@/services/user-service";
import { useAuth } from "./auth-context";

const UserContext = createContext<any>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const { token, isAuthenticated } = useAuth();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) {
            setUser(null);
            setLoading(false);
            return;
        }

        const fetchUser = async () => {
            setLoading(true);
            try {
                const data = await getUserProfile();
                console.log("User profile fetched:", data);
                setUser(data);
            } catch (error) {
                console.error("Failed to fetch user profile", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [token, isAuthenticated]);

    return (
        <UserContext.Provider value={{ user, loading }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within UserProvider");
    }
    return context;
}