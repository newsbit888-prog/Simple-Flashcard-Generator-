
import React from 'react';

interface PairsModeFormProps {
    pairsText: string;
    setPairsText: (value: string) => void;
}

const PairsModeForm: React.FC<PairsModeFormProps> = ({ pairsText, setPairsText }) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm p-5 mb-4">
            <label htmlFor="pairs" className="block text-sm font-medium text-slate-700 mb-1">
                Paste Term : Definition (one per line)
            </label>
            <textarea
                id="pairs"
                className="w-full min-h-[200px] rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-mono"
                placeholder={`Derivative : The instantaneous rate of change\nIntegral - The accumulation of quantities\nTCP,Transmission Control Protocol`}
                value={pairsText}
                onChange={(e) => setPairsText(e.target.value)}
            />
            <p className="text-xs text-slate-500 mt-2">
                Delimiters supported: ":", "-", or ",". Lines without a definition will be auto-filled by the model.
            </p>
        </div>
    );
};

export default PairsModeForm;
