export interface GameMetadata {
    id: number;
    name: string;
    description: string;
    emoji: string;
    color: string;
    category: string;
    difficulty?: string;
    duration?: string;
    instructions?: string;
}

export const gamesData: Record<number, GameMetadata> = {
    1: {
        id: 1,
        name: 'Letter Trace',
        description: 'Learn to write letters beautifully with guided exercises',
        emoji: '✏️',
        color: 'bg-primary/40',
        category: 'handwriting',
        difficulty: 'Easy',
        duration: '10 min',
        instructions: 'Follow the dotted lines to trace letters. Be as smooth as possible!',
    },
    2: {
        id: 2,
        name: 'Shape Match',
        description: 'Match shapes and patterns to complete puzzles',
        emoji: '🟠',
        color: 'bg-secondary/60',
        category: 'patterns',
        difficulty: 'Medium',
        duration: '15 min',
        instructions: 'Drag and drop shapes to match the pattern shown at the top.',
    },
    3: {
        id: 3,
        name: 'Number Quest',
        description: 'Count and solve exciting math puzzles',
        emoji: '🔢',
        color: 'bg-accent/40',
        category: 'math',
        difficulty: 'Medium',
        duration: '12 min',
        instructions: 'Count the objects and click the correct number.',
    },
    4: {
        id: 4,
        name: 'Color Explorer',
        description: 'Learn colors by sorting and matching items',
        emoji: '🎨',
        color: 'bg-primary/60',
        category: 'colors',
        difficulty: 'Easy',
        duration: '10 min',
        instructions: 'Sort items by color and learn color names.',
    },
    5: {
        id: 5,
        name: 'Alphabet Adventure',
        description: 'Journey through letters and word building',
        emoji: '📚',
        color: 'bg-secondary/40',
        category: 'letters',
        difficulty: 'Medium',
        duration: '15 min',
        instructions: 'Find the correct letters to spell words.',
    },
    6: {
        id: 6,
        name: 'Memory Master',
        description: 'Test your memory with fun card matching games',
        emoji: '🧠',
        color: 'bg-accent/60',
        category: 'memory',
        difficulty: 'Medium',
        duration: '12 min',
        instructions: 'Flip cards to find matching pairs.',
    },
    7: {
        id: 7,
        name: 'Puzzle Pal',
        description: 'Solve logic puzzles and brain teasers',
        emoji: '🧩',
        color: 'bg-primary/20',
        category: 'puzzles',
        difficulty: 'Hard',
        duration: '20 min',
        instructions: 'Use logic to solve the puzzles step by step.',
    },
    8: {
        id: 8,
        name: 'Sound Safari',
        description: 'Discover animals and learn their sounds',
        emoji: '🦁',
        color: 'bg-secondary/80',
        category: 'sounds',
        difficulty: 'Easy',
        duration: '10 min',
        instructions: 'Click animals to hear their sounds and learn about them.',
    },
    9: {
        id: 9,
        name: 'Match the Word',
        description: 'Match words with their corresponding pictures and emojis',
        emoji: '🖼️',
        color: 'bg-primary/40',
        category: 'letters',
        difficulty: 'Easy',
        duration: '10 min',
        instructions: 'Look at the image and find the matching word from the options!',
    },
    10: {
        id: 10,
        name: 'Tetris Word',
        description: 'Form words from falling letter blocks to clear the grid',
        emoji: '🧱',
        color: 'bg-emerald-400',
        category: 'letters',
        difficulty: 'Hard',
        duration: '20 min',
        instructions: 'Type or draw words using the letters in the grid. Longer words score more points!',
    },
    11: {
        id: 11,
        name: 'Word Builder',
        description: 'Construct the word using the provided letter pool. Watch out for extra letters!',
        emoji: '🏗️',
        color: 'bg-orange-400',
        category: 'letters',
        difficulty: 'Medium',
        duration: '12 min',
        instructions: 'Click the letters in the correct order to build the word. Some letters are just for distraction!',
    }
};

export const gamesList = Object.values(gamesData);
