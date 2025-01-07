import React from 'react';

interface ActionButtonsProps {
  onSave: () => void;
  onSaveTemplate: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ onSave, onSaveTemplate }) => (
  <div className="mt-6 flex space-x-4">
    <button
      onClick={onSave}
      className="px-4 py-2 bg-[#E31E24] text-white rounded-md hover:bg-[#C41A1F] transition-colors"
    >
      Save
    </button>
    <button
      onClick={onSaveTemplate}
      className="px-4 py-2 bg-[#E31E24] text-white rounded-md hover:bg-[#C41A1F] transition-colors"
    >
      Save as Template
    </button>
  </div>
);