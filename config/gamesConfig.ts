import { TetrisWord } from '@/components/games/TetrisWord';

export interface Game {
  id: string;
  name: string;
  description: string;
  emoji: string;
  color: string;
  category: 'handwriting' | 'patterns' | 'letters' | 'memory';
  component: React.ComponentType;
}

export const GAMES: Game[] = [
  {
    id: 'worddrop',
    name: 'WordDrop',
    description: 'Find words using letters in the grid. Type or handwrite to clear the grid!',
    emoji: '📝',
    color: 'bg-emerald-400',
    category: 'handwriting',
    component: TetrisWord,
  },
];