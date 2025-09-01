
import React from 'react';
import { Flashcard, Mode } from '../types';
import Spinner from './Spinner';

interface ActionButtonsProps {
    onGenerate: () => void;
    cards: Flashcard[];
    canGenerate: boolean;
    loading: boolean;
    mode: Mode;
    fileNameSlug: string;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onGenerate, cards, canGenerate, loading, mode, fileNameSlug }) => {

    const csvEscape = (val: any): string => {
        if (val == null) return "";
        const s = String(val);
        if (/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
        return s;
    };

    const toCSV = (rows: Flashcard[]): string => {
        const header = ["term", "definition", "hint", "example", "difficulty"];
        const body = rows.map((r) => header.map((h) => csvEscape(r[h as keyof Flashcard])).join(",")).join("\n");
        return header.join(",") + "\n" + body;
    };

    const toTSVForAnki = (rows: Flashcard[]): string => {
        return rows.map(r => `${(r.term || "").replace(/\t/g, " ")}\t${(r.definition || "").replace(/\t/g, " ")}`).join("\n");
    };

    const download = (filename: string, content: string, type: string) => {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleCopyJSON = () => {
        navigator.clipboard.writeText(JSON.stringify(cards, null, 2));
    };

    const handleDownloadCSV = () => {
        download(`flashcards_${fileNameSlug}.csv`, toCSV(cards), "text/csv;charset=utf-8");
    };

    const handleDownloadTSV = () => {
        download(`flashcards_${fileNameSlug}_anki.tsv`, toTSVForAnki(cards), "text/tab-separated-values;charset=utf-8");
    };

    const baseButton = "px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2";
    const primaryButton = `flex items-center justify-center gap-2 ${baseButton} text-white ${canGenerate ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-slate-400 cursor-not-allowed'} focus:ring-indigo-500`;
    const secondaryButton = `${baseButton} ${cards.length > 0 ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-slate-200 text-slate-400 cursor-not-allowed'} focus:ring-slate-500`;

    return (
        <div className="flex flex-wrap items-center gap-3 mb-6">
            <button onClick={onGenerate} disabled={!canGenerate} className={primaryButton}>
                {loading ? <><Spinner /> Generating...</> : mode === 'topic' ? 'Generate from Topic' : 'Normalize & Complete Pairs'}
            </button>
            <div className="flex-grow" />
            <button onClick={handleCopyJSON} disabled={!cards.length} className={secondaryButton}>Copy JSON</button>
            <button onClick={handleDownloadCSV} disabled={!cards.length} className={secondaryButton}>Download CSV</button>
            <button onClick={handleDownloadTSV} disabled={!cards.length} className={secondaryButton}>Download TSV (Anki)</button>
        </div>
    );
};

export default ActionButtons;
