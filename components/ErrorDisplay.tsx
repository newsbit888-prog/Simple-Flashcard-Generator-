
import React from 'react';

interface ErrorDisplayProps {
    error: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
    if (!error) return null;

    return (
        <div className="bg-rose-50 text-rose-800 border border-rose-200 rounded-lg p-4 mb-4" role="alert">
            <p className="font-semibold">An error occurred</p>
            <p className="text-sm">{error}</p>
        </div>
    );
};

export default ErrorDisplay;
