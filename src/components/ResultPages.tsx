// ResultPages.tsx
import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface SuccessPageProps {
  message: string;
  onBack: () => void;
}

export const SuccessPage: React.FC<SuccessPageProps> = ({ message, onBack }) => {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow">
      <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Success!</h2>
      <p className="text-gray-600 text-center mb-8">{message}</p>
      <button
        onClick={onBack}
        className="px-6 py-2 bg-[#E31E24] text-white rounded-md hover:bg-[#C41A1F] transition-colors"
      >
        Back to Table
      </button>
    </div>
  );
};

interface ErrorPageProps {
  error: string;
  onBack: () => void;
}

export const ErrorPage: React.FC<ErrorPageProps> = ({ error, onBack }) => {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow">
      <AlertCircle className="w-16 h-16 text-[#E31E24] mb-4" />
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Error Occurred</h2>
      <div className="bg-red-50 p-4 rounded-md mb-8 w-full max-w-lg">
        <p className="text-red-700 whitespace-pre-wrap">{error}</p>
      </div>
      <button
        onClick={onBack}
        className="px-6 py-2 bg-[#E31E24] text-white rounded-md hover:bg-[#C41A1F] transition-colors"
      >
        Try Again
      </button>
    </div>
  );
};