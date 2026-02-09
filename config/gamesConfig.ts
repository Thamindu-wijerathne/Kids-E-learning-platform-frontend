import { SpellStack  } from '@/components/games/SpellStack';
import WordBuilder from '@/components/games/WordBuilder';  

export type ScoringType = 'session' | 'persistent' | 'highest';

export interface GameConfig {
  scoring?: {
    type: ScoringType;
    enabled: boolean;
  };
  leveling?: {
    enabled: boolean;
    maxLevel?: number;
  };
}

export interface Game {
  id: string;
  name: string;
  description: string;
  emoji: string;
  color: string;
  category: 'handwriting' | 'patterns' | 'letters' | 'memory';
  component: React.ComponentType<any>;
  config: GameConfig;
}

export const gamesList: Game[] = [
  {
    id: 'spellstack',
    name: 'SpellStack',
    description: 'Test your vocabulary and speed as letters stack up in a grid. Create words to survive as the pressure builds.',
    emoji: '📝',
    color: 'bg-emerald-400',
    category: 'handwriting',
    component: SpellStack,
    config: {
      scoring: { type: 'highest', enabled: true },
      leveling: { enabled: false }
    }
  },

  {
    id: 'wordbuilder',
    name: 'Word Builder',
    description: 'Build the word by arranging letters. Watch out for distractors!',
    emoji: '🏗️',
    color: 'bg-orange-400',
    category: 'handwriting',
    component: WordBuilder,
    config: {
      scoring: { type: 'persistent', enabled: true },
      leveling: { enabled: true, maxLevel: 30 }
    }
  },
];