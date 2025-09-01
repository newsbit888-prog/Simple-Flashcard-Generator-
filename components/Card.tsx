
import React from 'react';
import { Flashcard, Difficulty } from '../types';

interface CardProps {
    card: Flashcard;
}

const difficultyStyles: { [key in Difficulty]: { badge: string, border: string } } = {
    easy: { badge: 'bg-emerald-100 text-emerald-800', border: 'border-emerald-300' },
    medium: { badge: 'bg-amber-100 text-amber-800', border: 'border-amber-300' },
    hard: { badge: 'bg-rose-100 text-rose-800', border: 'border-rose-300' },
};


const Card: React.FC<CardProps> = ({ card }) => {
    const styles = difficultyStyles[card.difficulty] || difficultyStyles.medium;

    return (
        <div className={`bg-white rounded-xl shadow-sm border-l-4 ${styles.border} p-4 flex flex-col`}>
            <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-lg text-slate-800">{card.term}</h3>
                <span className={`text-xs capitalize font-medium px-2 py-0.5 rounded-full ${styles.badge}`}>{card.difficulty}</span>
            </div>
            <p className="text-sm text-slate-700 mb-3 flex-grow">{card.definition}</p>
            
            {(card.hint || card.example) && (
                 <div className="border-t border-slate-200 pt-2 space-y-1">
                    {card.hint && (
                        <p className="text-xs text-slate-500">
                            <span className="font-medium text-slate-600">Hint:</span> {card.hint}
                        </p>
                    )}
                    {card.example && (
                        <p className="text-xs text-slate-500">
                            <span className="font-medium text-slate-600">Example:</span> <em className="italic">{card.example}</em>
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Card;
