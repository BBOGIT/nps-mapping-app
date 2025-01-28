import React, { useState, useRef } from 'react';
import { TableData } from '../types';
import { saveData, saveTemplate } from '../services/api';
import { Modal } from './Modal';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ScrollToTop from './ScrollToTop';
import { SuccessPage, ErrorPage } from './ResultPages';

interface PreviewTableProps {
  data: TableData[];
  setMessage: (message: string) => void;
  setLoading: (loading: boolean) => void;
}

type Status = 'preview' | 'success' | 'error';

export const PreviewTable: React.FC<PreviewTableProps> = ({ 
  data, 
  setMessage, 
  setLoading 
}) => {
  const [status, setStatus] = useState<Status>('preview');
  const [resultMessage, setResultMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const columns = Object.keys(data[0]);

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await saveData(data);
      setResultMessage(response.message);
      setStatus('success');
    } catch (error) {
      // Припускаємо, що API повертає об'єкт помилки з деталями
      const errorMessage = error.response?.data?.message || 'Error saving data';
      setResultMessage(errorMessage);
      setStatus('error');
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
      setResultMessage(response.message);
      setStatus('success');
      setIsModalOpen(false);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error saving template';
      setResultMessage(errorMessage);
      setStatus('error');
      setIsModalOpen(false);
    } finally {
      setLoading(false);
      setTemplateName('');
    }
  };

  // Відображення різних станів компонента
  if (status === 'success') {
    return (
      <SuccessPage 
        message={resultMessage} 
        onBack={() => setStatus('preview')} 
      />
    );
  }

  if (status === 'error') {
    return (
      <ErrorPage 
        error={resultMessage} 
        onBack={() => setStatus('preview')} 
      />
    );
  }

  // Основний вміст таблиці перегляду
  return (
    <div>
      <div className="relative mb-6">
        <button
          onClick={() => {
            if (tableContainerRef.current) {
              tableContainerRef.current.scrollLeft -= 300;
            }
          }}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 
            bg-white/90 p-2 rounded-full shadow-lg hover:bg-gray-100 transition-all
            focus:outline-none border border-gray-200"
        >
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>

        <div className="overflow-hidden bg-white rounded-lg shadow">
          <div 
            ref={tableContainerRef}
            className="overflow-x-auto max-h-[70vh]"
          >
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  {columns.map((column) => (
                    <th 
                      key={column} 
                      className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-gray-50">
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
        </div>

        <button
          onClick={() => {
            if (tableContainerRef.current) {
              tableContainerRef.current.scrollLeft += 300;
            }
          }}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 
            bg-white/90 p-2 rounded-full shadow-lg hover:bg-gray-100 transition-all
            focus:outline-none border border-gray-200"
        >
          <ChevronRight className="w-6 h-6 text-gray-600" />
        </button>
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
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
              onClick={() => setIsModalOpen(false)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      <ScrollToTop />
    </div>
  );
};