export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface SignupResponse {
  user: User;
  access_token: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export interface GameProgress {
  game: string;
  level: number;
  difficulty: string;
  word?: string;
  isCorrect?: boolean;
  scoreDelta?: number;
  timeSpent?: number;
  timestamp: number;
  [key: string]: any;
}

export interface GameProgressContextType {
  gameProgress: GameProgress | null;
  saveGameProgress: (gameProgress: GameProgress) => void;
  loadGameProgress: () => void;
  isLoading: boolean;
  currentGameId: string | null;
  currentGameName: string | null;
}
