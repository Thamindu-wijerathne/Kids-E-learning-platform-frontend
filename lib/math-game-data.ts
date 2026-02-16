export interface MathProblem {
    id: string;
    targetEquation: string[]; // e.g. ["2", "+", "3", "=", "5"]
    emoji: string;
    difficulty: 'easy' | 'medium' | 'hard';
}

export const MATH_PROBLEMS: MathProblem[] = [
    // Easy: Level 1-10 (Addition/Subtraction within 10)
    {
        id: 'm1',
        targetEquation: ['2', '+', '3', '=', '5'],
        emoji: '🍎',
        difficulty: 'easy'
    },
    {
        id: 'm2',
        targetEquation: ['4', '-', '3', '=', '1'],
        emoji: '🐶',
        difficulty: 'easy'
    },
    {
        id: 'm3',
        targetEquation: ['6', '+', '2', '=', '8'],
        emoji: '🐱',
        difficulty: 'easy'
    },
    {
        id: 'm4',
        targetEquation: ['3', '+', '4', '=', '7'],
        emoji: '🐸',
        difficulty: 'easy'
    },
    {
        id: 'm5',
        targetEquation: ['5', '-', '2', '=', '3'],
        emoji: '🐭',
        difficulty: 'easy'
    },
    {
        id: 'm6',
        targetEquation: ['1', '+', '1', '=', '2'],
        emoji: '🐥',
        difficulty: 'easy'
    },
    {
        id: 'm7',
        targetEquation: ['3', '+', '6', '=', '9'],
        emoji: '🦋',
        difficulty: 'easy'
    },
    {
        id: 'm8',
        targetEquation: ['9', '-', '5', '=', '4'],
        emoji: '🐞',
        difficulty: 'easy'
    },
    {
        id: 'm9',
        targetEquation: ['0', '+', '5', '=', '5'],
        emoji: '🌸',
        difficulty: 'easy'
    },
    {
        id: 'm10',
        targetEquation: ['7', '-', '7', '=', '0'],
        emoji: '🌈',
        difficulty: 'easy'
    },

    // Medium: Level 11-20 (Numbers up to 20)
    {
        id: 'm11',
        targetEquation: ['12', '+', '3', '=', '15'],
        emoji: '🚗',
        difficulty: 'medium'
    },
    {
        id: 'm12',
        targetEquation: ['20', '-', '10', '=', '10'],
        emoji: '✈️',
        difficulty: 'medium'
    },
    {
        id: 'm13',
        targetEquation: ['8', '+', '8', '=', '16'],
        emoji: '🚢',
        difficulty: 'medium'
    },
    {
        id: 'm14',
        targetEquation: ['15', '-', '5', '=', '10'],
        emoji: '🚲',
        difficulty: 'medium'
    },
    {
        id: 'm15',
        targetEquation: ['12', '+', '6', '=', '18'],
        emoji: '🚁',
        difficulty: 'medium'
    },
    {
        id: 'm16',
        targetEquation: ['11', '+', '4', '=', '15'],
        emoji: '🛸',
        difficulty: 'medium'
    },
    {
        id: 'm17',
        targetEquation: ['19', '-', '8', '=', '11'],
        emoji: '🚀',
        difficulty: 'medium'
    },
    {
        id: 'm18',
        targetEquation: ['10', '+', '10', '=', '20'],
        emoji: '🚠',
        difficulty: 'medium'
    },
    {
        id: 'm19',
        targetEquation: ['25', '-', '5', '=', '20'],
        emoji: '🏰',
        difficulty: 'medium'
    },
    {
        id: 'm20',
        targetEquation: ['20', '+', '10', '=', '30'],
        emoji: '🗼',
        difficulty: 'medium'
    },

    // Hard: Level 21-30 (Multiplication/Division)
    {
        id: 'm21',
        targetEquation: ['5', 'x', '3', '=', '15'],
        emoji: '💎',
        difficulty: 'hard'
    },
    {
        id: 'm22',
        targetEquation: ['20', '/', '4', '=', '5'],
        emoji: '👑',
        difficulty: 'hard'
    },
    {
        id: 'm23',
        targetEquation: ['12', 'x', '2', '=', '24'],
        emoji: '🎲',
        difficulty: 'hard'
    },
    {
        id: 'm24',
        targetEquation: ['50', '/', '2', '=', '25'],
        emoji: '🎯',
        difficulty: 'hard'
    },
    {
        id: 'm25',
        targetEquation: ['3', 'x', '3', '=', '9'],
        emoji: '🎷',
        difficulty: 'hard'
    },
    {
        id: 'm26',
        targetEquation: ['100', '/', '2', '=', '50'],
        emoji: '🎸',
        difficulty: 'hard'
    },
    {
        id: 'm27',
        targetEquation: ['5', 'x', '10', '=', '50'],
        emoji: '🎻',
        difficulty: 'hard'
    },
    {
        id: 'm28',
        targetEquation: ['9', 'x', '9', '=', '81'],
        emoji: '🎹',
        difficulty: 'hard'
    },
    {
        id: 'm29',
        targetEquation: ['75', '/', '3', '=', '25'],
        emoji: '🎬',
        difficulty: 'hard'
    },
    {
        id: 'm30',
        targetEquation: ['6', 'x', '7', '=', '42'],
        emoji: '🎟️',
        difficulty: 'hard'
    }
];
