
export type Difficulty = 'easy' | 'medium' | 'hard';

export type Mode = 'topic' | 'pairs';

export interface Flashcard {
    id: number;
    term: string;
    definition: string;
    hint?: string;
    example?: string;
    difficulty: Difficulty;
}

export interface DifficultyMix {
    easy: number;
    medium: number;
    hard: number;
}

export enum Language {
    English = 'English',
    Hindi = 'Hindi',
    Hinglish = 'Hinglish',
    Spanish = 'Spanish',
    French = 'French',
    German = 'German',
}

export enum BloomLevel {
    Remember = 'Remember',
    Understand = 'Understand',
    Apply = 'Apply',
    Analyze = 'Analyze',
    Evaluate = 'Evaluate',
    Create = 'Create',
}
