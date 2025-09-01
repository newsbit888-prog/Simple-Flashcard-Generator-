
import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="mb-6 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-slate-800 sm:text-5xl">
                Gemini Flashcard Generator
            </h1>
            <p className="mt-3 text-lg text-slate-600">
                Enter a topic or paste term-definition pairs to create your study set instantly.
            </p>
        </header>
    );
};

export default Header;
