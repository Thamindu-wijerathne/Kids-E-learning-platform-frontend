import { SpellStack  } from '@/components/games/SpellStack';
import WordBuilder from '@/components/games/WordBuilder';  

export interface Game {
  id: string;
  name: string;
  description: string;
  emoji: string;
  color: string;
  category: 'handwriting' | 'patterns' | 'letters' | 'memory';
  component: React.ComponentType<any>;
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
  },

  {
    id: 'wordbuilder',
    name: 'Word Builder',
    description: 'Build the word by arranging letters. Watch out for distractors!',
    emoji: '🏗️',
    color: 'bg-orange-400',
    category: 'handwriting',
    component: WordBuilder,
  },
];