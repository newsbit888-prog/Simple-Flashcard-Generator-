
import React from 'react';
import { Mode } from '../types';

interface ModeSwitcherProps {
    mode: Mode;
    setMode: (mode: Mode) => void;
}

const ModeSwitcher: React.FC<ModeSwitcherProps> = ({ mode, setMode }) => {
    const baseClasses = 'px-4 py-2 rounded-lg text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500';
    const activeClasses = 'bg-indigo-600 text-white shadow-md';
    const inactiveClasses = 'bg-slate-100 text-slate-700 hover:bg-slate-200';

    return (
        <div className="flex items-center justify-center gap-3 bg-slate-200/50 p-1 rounded-xl">
            <button
                className={`${baseClasses} ${mode === 'topic' ? activeClasses : inactiveClasses}`}
                onClick={() => setMode('topic')}
            >
                Generate from Topic
            </button>
            <button
                className={`${baseClasses} ${mode === 'pairs' ? activeClasses : inactiveClasses}`}
                onClick={() => setMode('pairs')}
            >
                Paste Term-Definition Pairs
            </button>
        </div>
    );
};

export default ModeSwitcher;
