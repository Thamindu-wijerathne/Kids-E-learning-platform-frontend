export interface CustomizationItem {
    id: string;
    name: string;
    value: string;
    threshold: number;
    type: 'avatar' | 'theme' | 'pattern' | 'title';
}

export const AVATARS: CustomizationItem[] = [
    { id: 'cat', name: 'Cool Cat', value: '🐱', threshold: 0, type: 'avatar' },
    { id: 'fox', name: 'Fast Fox', value: '🦊', threshold: 1000, type: 'avatar' },
    { id: 'dragon', name: 'Fire Dragon', value: '🐉', threshold: 5000, type: 'avatar' },
    { id: 'unicorn', name: 'Magic Unicorn', value: '🦄', threshold: 10000, type: 'avatar' },
    { id: 'lion', name: 'Brave Lion', value: '🦁', threshold: 20000, type: 'avatar' },
    { id: 'astronaut', name: 'Space Explorer', value: '👨‍🚀', threshold: 50000, type: 'avatar' },
];

export const THEMES: CustomizationItem[] = [
    { id: 'default', name: 'Sky Blue', value: 'from-primary to-secondary', threshold: 0, type: 'theme' },
    { id: 'sunset', name: 'Sunset Glow', value: 'from-orange-500 to-rose-500', threshold: 2500, type: 'theme' },
    { id: 'forest', name: 'Enchanted Forest', value: 'from-emerald-500 to-teal-700', threshold: 7500, type: 'theme' },
    { id: 'galaxy', name: 'Deep Galaxy', value: 'from-indigo-900 via-purple-900 to-black', threshold: 15000, type: 'theme' },
    { id: 'candy', name: 'Candy Land', value: 'from-pink-400 to-fuchsia-600', threshold: 30000, type: 'theme' },
];

export const PATTERNS: CustomizationItem[] = [
    { id: 'none', name: 'Solid', value: 'none', threshold: 0, type: 'pattern' },
    { id: 'rocket', name: 'Space Adventure', value: '🚀', threshold: 3000, type: 'pattern' },
    { id: 'star', name: 'Shiny Stars', value: '⭐', threshold: 8000, type: 'pattern' },
    { id: 'heart', name: 'Lovely Hearts', value: '❤️', threshold: 15000, type: 'pattern' },
    { id: 'robot', name: 'Robot World', value: '🤖', threshold: 25000, type: 'pattern' },
    { id: 'pizza', name: 'Pizza Party', value: '🍕', threshold: 40000, type: 'pattern' },
];

export const TITLES: CustomizationItem[] = [
    { id: 'explorer', name: 'The Explorer', value: 'The Explorer', threshold: 0, type: 'title' },
    { id: 'seeker', name: 'Skill Seeker', value: 'Skill Seeker', threshold: 2000, type: 'title' },
    { id: 'brainiac', name: 'Brainiac', value: 'Brainiac', threshold: 6000, type: 'title' },
    { id: 'master', name: 'Math Master', value: 'Math Master', threshold: 18000, type: 'title' },
    { id: 'wizard', name: 'Word Wizard', value: 'Word Wizard', threshold: 35000, type: 'title' },
    { id: 'legend', name: 'Bitzify Legend', value: 'Bitzify Legend', threshold: 75000, type: 'title' },
];
