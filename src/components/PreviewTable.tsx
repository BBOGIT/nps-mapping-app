// components/PreviewTable.tsx
import React, { useState } from 'react';
import { TableData } from '../types';
import { saveData, saveTemplate } from '../services/api';
import { Modal } from './Modal';

interface PreviewTableProps {
  data: TableData[];
  setMessage: (message: string) => void;
  setLoading: (loading: boolean) => void;
}

export const PreviewTable: React.FC<PreviewTableProps> = ({ 
  data, 
  setMessage, 
  setLoading 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const columns = Object.keys(data[0]);

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await saveData(data);
      setMessage(response.message);
    } catch (error) {
      setMessage('Error saving data');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTemplate = async () => {
    if (!templateName.trim()) {
      setMessage('Please enter template name');
      return;
    }

    try {
      setLoading(true);
      const response = await saveTemplate(data, templateName);
      setMessage(response.message);
      setIsModalOpen(false);
      setTemplateName('');
    } catch (error) {
      setMessage('Error saving template');
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setTemplateName('');
  };

  return (
    <div>
      <div className="overflow-x-auto bg-white rounded-lg shadow mb-6">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th key={column} className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column) => (
                  <td key={column} className="px-2 py-2 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{row[column]}</div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-[#E31E24] text-white rounded-md hover:bg-[#C41A1F] transition-colors"
        >
          Save
        </button>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-[#E31E24] text-white rounded-md hover:bg-[#C41A1F] transition-colors"
        >
          Save as Template
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleModalClose}>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Save as Template
          </h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Template Name
            </label>
            <input
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#E31E24] focus:border-[#E31E24]"
              placeholder="Enter template name"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              onClick={handleSaveTemplate}
              className="flex-1 px-4 py-2 bg-[#E31E24] text-white rounded-md hover:bg-[#C41A1F] transition-colors"
            >
              Save
            </button>
            <button
              onClick={handleModalClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};