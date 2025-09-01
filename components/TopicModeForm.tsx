
import React from 'react';
import { Language, BloomLevel, DifficultyMix } from '../types';

interface TopicModeFormProps {
    topic: string;
    setTopic: (value: string) => void;
    count: number;
    setCount: (value: number) => void;
    lang: Language;
    setLang: (value: Language) => void;
    bloomLevel: BloomLevel;
    setBloomLevel: (value: BloomLevel) => void;
    includeHint: boolean;
    setIncludeHint: (value: boolean) => void;
    includeExample: boolean;
    setIncludeExample: (value: boolean) => void;
    temperature: number;
    setTemperature: (value: number) => void;
    difficultyMix: DifficultyMix;
    setDifficultyMix: (value: DifficultyMix) => void;
    isMixWarning: boolean;
}

const Label: React.FC<{ htmlFor?: string; children: React.ReactNode }> = ({ htmlFor, children }) => (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-700 mb-1">{children}</label>
);

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
    <input {...props} className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
);

const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (props) => (
    <select {...props} className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
);

const TopicModeForm: React.FC<TopicModeFormProps> = ({
    topic, setTopic, count, setCount, lang, setLang, bloomLevel, setBloomLevel, includeHint, setIncludeHint, includeExample, setIncludeExample, temperature, setTemperature, difficultyMix, setDifficultyMix, isMixWarning
}) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm p-5 mb-4">
            <div className="mb-4">
                <Label htmlFor="topic">Topic</Label>
                <Input
                    id="topic"
                    type="text"
                    placeholder="e.g., The basics of Quantum Computing"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                    <Label htmlFor="count">Number of Cards</Label>
                    <Input id="count" type="number" min={3} max={50} value={count} onChange={(e) => setCount(parseInt(e.target.value || '3'))} />
                </div>
                <div>
                    <Label htmlFor="lang">Language</Label>
                    <Select id="lang" value={lang} onChange={(e) => setLang(e.target.value as Language)}>
                        {Object.values(Language).map(l => <option key={l} value={l}>{l}</option>)}
                    </Select>
                </div>
                <div>
                    <Label htmlFor="bloom">Bloom's Level</Label>
                    <Select id="bloom" value={bloomLevel} onChange={(e) => setBloomLevel(e.target.value as BloomLevel)}>
                        {Object.values(BloomLevel).map(l => <option key={l} value={l}>{l}</option>)}
                    </Select>
                </div>
            </div>

            <div className="border-t border-slate-200 pt-4">
                <h3 className="text-base font-medium text-slate-800 mb-2">Advanced Options</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Checkboxes */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <input id="hint" type="checkbox" checked={includeHint} onChange={(e) => setIncludeHint(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                            <label htmlFor="hint" className="text-sm font-medium text-slate-700">Include Hints</label>
                        </div>
                        <div className="flex items-center gap-2">
                            <input id="example" type="checkbox" checked={includeExample} onChange={(e) => setIncludeExample(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                            <label htmlFor="example" className="text-sm font-medium text-slate-700">Include Examples</label>
                        </div>
                    </div>
                    {/* Temperature */}
                    <div className="flex flex-col">
                        <Label>Creativity (Temperature)</Label>
                        <div className="flex items-center gap-3">
                             <input type="range" min={0} max={1} step={0.05} value={temperature} onChange={(e) => setTemperature(parseFloat(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                            <span className="text-sm font-mono w-10 text-right text-slate-600">{temperature.toFixed(2)}</span>
                        </div>
                    </div>
                    {/* Difficulty Mix */}
                    <div>
                         <Label>Difficulty Mix (%)</Label>
                         <div className="flex gap-2 items-center">
                            <span className="text-xs w-12 text-slate-500">Easy</span>
                            <Input type="number" className="w-full" value={difficultyMix.easy} onChange={(e) => setDifficultyMix({ ...difficultyMix, easy: parseInt(e.target.value || "0") })} />
                             <span className="text-xs w-12 text-slate-500">Med</span>
                            <Input type="number" className="w-full" value={difficultyMix.medium} onChange={(e) => setDifficultyMix({ ...difficultyMix, medium: parseInt(e.target.value || "0") })} />
                             <span className="text-xs w-12 text-slate-500">Hard</span>
                            <Input type="number" className="w-full" value={difficultyMix.hard} onChange={(e) => setDifficultyMix({ ...difficultyMix, hard: parseInt(e.target.value || "0") })} />
                         </div>
                         {isMixWarning && <p className="text-xs text-amber-600 mt-1">Sum should be 100%. A default mix will be used.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopicModeForm;
