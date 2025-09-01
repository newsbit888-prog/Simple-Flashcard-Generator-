
import { GoogleGenAI, Type } from "@google/genai";
import { Flashcard, Language, BloomLevel, DifficultyMix } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface GenerateOptions {
    topic: string;
    count: number;
    lang: Language;
    includeHint: boolean;
    includeExample: boolean;
    bloomLevel: BloomLevel;
    difficultyMix: DifficultyMix;
    temperature: number;
}

export const generateFlashcardsFromTopic = async (options: GenerateOptions): Promise<Omit<Flashcard, 'id'>[]> => {
    const { topic, count, lang, includeHint, includeExample, bloomLevel, difficultyMix, temperature } = options;

    const properties: { [key: string]: any } = {
        term: { type: Type.STRING, description: 'The key term or concept.' },
        definition: { type: Type.STRING, description: 'A clear and concise definition of the term (under 40 words).' },
        difficulty: { type: Type.STRING, enum: ['easy', 'medium', 'hard'] },
    };

    if (includeHint) {
        properties.hint = { type: Type.STRING, description: 'A helpful hint to remember the term.' };
    }
    if (includeExample) {
        properties.example = { type: Type.STRING, description: 'A simple example illustrating the term in context.' };
    }
    
    const responseSchema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties,
            required: ['term', 'definition', 'difficulty'],
        },
    };

    const prompt = `You are an expert flashcard generator.
    Topic: ${topic}
    Language: ${lang}
    Number of cards: ${count}
    Bloom's Taxonomy Level: Focus on '${bloomLevel}'.
    Difficulty Mix: Approximately easy ${difficultyMix.easy}%, medium ${difficultyMix.medium}%, hard ${difficultyMix.hard}%.
    
    Instructions:
    - Create ${count} high-quality flashcards based on the topic.
    - Definitions should be clear, concise, and ideally under 40 words.
    - Ensure the generated JSON strictly adheres to the provided schema. Do not include any extra text, commentary, or markdown fences.
    - Generate hints and examples if requested. If not requested, omit those fields.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature,
                responseMimeType: 'application/json',
                responseSchema,
            },
        });

        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);

        if (!Array.isArray(result)) {
            throw new Error('API did not return an array.');
        }

        return result.filter(
            (card: any): card is Omit<Flashcard, 'id'> =>
                card && typeof card.term === 'string' && typeof card.definition === 'string'
        );

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to generate flashcards. The model may be unavailable or the request could be invalid.");
    }
};

export const defineTerms = async (terms: string[], lang: Language): Promise<{ term: string, definition: string }[]> => {
    
    const responseSchema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                term: { type: Type.STRING },
                definition: { type: Type.STRING, description: 'A one-sentence definition (max 25 words).' }
            },
            required: ['term', 'definition'],
        }
    };

    const prompt = `For each of the following terms, provide a one-sentence definition in ${lang} (maximum 25 words).
    Terms: ${terms.join(', ')}
    
    Return the result as a JSON array of objects, where each object has a "term" and "definition" key. Do not include any extra text, commentary, or markdown fences.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.3,
                responseMimeType: 'application/json',
                responseSchema
            },
        });

        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);
        
        if (!Array.isArray(result)) {
            throw new Error('API did not return an array of definitions.');
        }

        return result;

    } catch (error) {
        console.error("Error defining terms with Gemini API:", error);
        throw new Error("Failed to auto-fill definitions.");
    }
};
