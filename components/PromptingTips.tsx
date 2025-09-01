
import React from 'react';

const Tip: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <li><span className="font-semibold text-slate-800">{title}:</span> {children}</li>
);

const PromptingTips: React.FC = () => {
    return (
        <details className="mt-8 bg-white rounded-2xl shadow-sm p-4 group">
            <summary className="cursor-pointer select-none font-medium text-slate-800 list-none group-open:mb-3">
                <div className="flex items-center justify-between">
                    <span>Prompting Best Practices</span>
                     <svg className="w-5 h-5 transition-transform duration-200 transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
            </summary>
            <ul className="list-disc pl-5 text-sm text-slate-600 space-y-2">
                <Tip title="Clear Schema">
                    Use JSON Schema mode to get reliable, structured output. This is the most important step for data-driven apps.
                </Tip>
                <Tip title="Role-Playing">
                    Start your prompt with a role, like "You are an expert flashcard generator." This primes the model for the task.
                </Tip>
                <Tip title="Be Specific">
                    Instead of "make flashcards", specify the count, language, difficulty mix, and constraints like "definitions under 40 words".
                </Tip>
                <Tip title="Adjust Temperature">
                    Lower temperature (e.g., 0.2-0.5) for more deterministic, factual cards. Higher temperature (e.g., 0.7-1.0) for more creative or varied examples.
                </Tip>
            </ul>
        </details>
    );
};

export default PromptingTips;
