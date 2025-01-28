import React, { useState, useRef } from 'react';
import { TableData } from '../types';
import { saveData, saveTemplate } from '../services/api';
import { Modal } from './Modal';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ScrollToTop from './ScrollToTop';

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
  // Стани для управління модальним вікном і назвою шаблону
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [templateName, setTemplateName] = useState('');
  
  // Референція для контейнера таблиці, щоб керувати горизонтальною прокруткою
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // Отримуємо колонки з першого рядка даних
  const columns = Object.keys(data[0]);

  // Функція для горизонтальної прокрутки таблиці
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
      setMessage(response.message);
    } catch (error) {
      setMessage('Error saving data');
    } finally {
      setLoading(false);
    }
  };

  // Обробник для збереження шаблону
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

  // Обробник для закриття модального вікна
  const handleModalClose = () => {
    setIsModalOpen(false);
    setTemplateName('');
  };

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

        {/* Контейнер таблиці з фіксованим заголовком */}
        <div className="overflow-hidden bg-white rounded-lg shadow">
          <div 
            ref={tableContainerRef}
            className="overflow-x-auto max-h-[70vh] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
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

      {/* Кнопка прокрутки вгору */}
      <ScrollToTop />
    </div>
  );
};