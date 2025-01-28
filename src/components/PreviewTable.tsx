import React, { useState, useRef } from 'react';
import { TableData } from '../types';
import { saveData, saveTemplate } from '../services/api';
import { Modal } from './Modal';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ScrollToTop from './ScrollToTop';
import { SuccessPage, ErrorPage } from './ResultPages';

// Визначаємо типи для пропсів компонента
interface PreviewTableProps {
  data: TableData[];
  setMessage: (message: string) => void;
  setLoading: (loading: boolean) => void;
}

// Визначаємо можливі стани компонента
type Status = 'preview' | 'success' | 'error';

export const PreviewTable: React.FC<PreviewTableProps> = ({ 
  data, 
  setMessage, 
  setLoading 
}) => {
  // Стани компонента
  const [status, setStatus] = useState<Status>('preview');
  const [resultMessage, setResultMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [templateName, setTemplateName] = useState('');
  
  // Функція для отримання зрозумілого повідомлення про помилку
  const getErrorMessage = (error: any): string => {
    // Перевіряємо наявність відповіді від API
    if (error.response) {
      const status = error.response.status;
      
      // Перевіряємо специфічні статуси помилок
      switch (status) {
        case 413:
          return 'The data size is too large. Please reduce the amount of data and try again.';
        case 400:
          return error.response.data?.message || 'Invalid data format. Please check your data and try again.';
        case 401:
          return 'Authentication failed. Please log in again.';
        case 403:
          return 'You don\'t have permission to perform this action.';
        case 404:
          return 'The requested resource was not found.';
        case 500:
          return 'Server error occurred. Please try again later.';
        default:
          return error.response.data?.message || 'An unexpected error occurred.';
      }
    }

    // Якщо помилка не пов'язана з відповіддю API
    return error.message || 'An error occurred while processing your request.';
  };
  // Референція для управління прокруткою таблиці
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // Отримуємо назви колонок з першого рядка даних
  const columns = Object.keys(data[0]);

  // Функція для прокрутки таблиці вліво/вправо
  const scroll = (direction: 'left' | 'right') => {
    if (tableContainerRef.current) {
      const scrollAmount = 300;
      const newScrollLeft = direction === 'left' 
        ? tableContainerRef.current.scrollLeft - scrollAmount
        : tableContainerRef.current.scrollLeft + scrollAmount;
      
      tableContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  // Обробник для збереження даних
  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await saveData(data);
      
      if (response.success) {
        setResultMessage(response.message || 'Data saved successfully');
        setStatus('success');
      } else {
        setResultMessage(response.message || 'Failed to save data');
        setStatus('error');
      }
    } catch (error) {
      console.error('Save error:', error);
      setResultMessage(getErrorMessage(error));
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  // Обробник для збереження шаблону
  const handleSaveTemplate = async () => {
    if (!templateName.trim()) {
      setResultMessage('Please enter template name');
      setStatus('error');
      return;
    }

    try {
      setLoading(true);
      const response = await saveTemplate(data, templateName);
      
      if (response.success) {
        setResultMessage(response.message || 'Template saved successfully');
        setStatus('success');
      } else {
        setResultMessage(response.message || 'Failed to save template');
        setStatus('error');
      }
    } catch (error) {
      console.error('Template save error:', error);
      setResultMessage(getErrorMessage(error));
      setStatus('error');
    } finally {
      setLoading(false);
      setIsModalOpen(false);
      setTemplateName('');
    }
  };

  // Відображаємо сторінку помилки
  if (status === 'error') {
    console.log('Rendering error page:', resultMessage);
    return (
      <ErrorPage 
        error={resultMessage}
        onBack={() => {
          setStatus('preview');
          setResultMessage('');
        }}
      />
    );
  }

  // Відображаємо сторінку успіху
  if (status === 'success') {
    console.log('Rendering success page:', resultMessage);
    return (
      <SuccessPage 
        message={resultMessage}
        onBack={() => {
          setStatus('preview');
          setResultMessage('');
        }}
      />
    );
  }

  // Основний рендер таблиці
  return (
    <div>
      {/* Контейнер таблиці з кнопками прокрутки */}
      <div className="relative mb-6">
        {/* Кнопка прокрутки вліво */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 
            bg-white/90 p-2 rounded-full shadow-lg hover:bg-gray-100 transition-all
            focus:outline-none border border-gray-200"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>

        {/* Таблиця для перегляду даних */}
        <div className="overflow-hidden bg-white rounded-lg shadow">
          <div 
            ref={tableContainerRef}
            className="overflow-x-auto max-h-[70vh]"
          >
            <table className="w-full divide-y divide-gray-200">
              {/* Фіксований заголовок таблиці */}
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
              {/* Тіло таблиці */}
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

        {/* Кнопка прокрутки вправо */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 
            bg-white/90 p-2 rounded-full shadow-lg hover:bg-gray-100 transition-all
            focus:outline-none border border-gray-200"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      {/* Кнопки дій */}
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

      {/* Модальне вікно для збереження шаблону */}
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