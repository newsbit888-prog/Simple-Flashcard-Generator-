
import React from 'react';
import { Flashcard } from '../types';
import Card from './Card';
import Spinner from './Spinner';

interface CardGridProps {
    loading: boolean;
    cards: Flashcard[];
}

const CardGrid: React.FC<CardGridProps> = ({ loading, cards }) => {
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center text-center p-10 bg-white rounded-2xl shadow-sm h-64">
                <Spinner />
                <p className="text-slate-600 mt-4">Generating your flashcards...</p>
                <p className="text-sm text-slate-500">This may take a moment.</p>
            </div>
        );
    }
    
    if (cards.length === 0) {
        return (
            <div className="text-center p-10 bg-white rounded-2xl shadow-sm">
                <p className="text-slate-500">Your generated flashcards will appear here.</p>
            </div>
        );
    }

    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cards.map((card) => (
                <Card key={card.id} card={card} />
            ))}
        </div>
    );
};

export default CardGrid;
