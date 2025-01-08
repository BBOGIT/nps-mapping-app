import React from 'react';
import { TableData } from '../types';
import { saveData, saveTemplate } from '../services/api';

interface PreviewTableProps {
  data: TableData[];
  setMessage: (message: string) => void;
  setLoading: (loading: boolean) => void;
}

export const PreviewTable: React.FC<PreviewTableProps> = ({ data, setMessage, setLoading }) => {
  const columns = Object.keys(data[0]);

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await saveData(data);
      setMessage(response.message || 'Data saved successfully!');
    } catch (error) {
      setMessage('Error saving data');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTemplate = async () => {
    try {
      setLoading(true);
      const response = await saveTemplate(data);
      setMessage(response.message || 'Template saved successfully!');
    } catch (error) {
      setMessage('Error saving template');
    } finally {
      setLoading(false);
    }
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
          onClick={handleSaveTemplate}
          className="px-4 py-2 bg-[#E31E24] text-white rounded-md hover:bg-[#C41A1F] transition-colors"
        >
          Save as Template
        </button>
      </div>
    </div>
  );
};