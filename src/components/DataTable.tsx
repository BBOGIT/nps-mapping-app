import React, { useState, useRef } from 'react';
import { TableData } from '../types';
import { TableHeader } from './TableHeader';
import { TableRow } from './TableRow';
import { PreviewTable } from './PreviewTable';
import StepIndicator from './StepIndicator';
import ScrollToTop from './ScrollToTop';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DataTableProps {
  initialData: TableData[];
  unmappedColumns?: Array<Record<string, string>>;
  emptyFields?: string[];
  onBack: () => void;
  targetFields: Array<{
    name: string;
    validation: string;
  }>;
}

export const DataTable: React.FC<DataTableProps> = ({ 
  initialData,
  unmappedColumns = [],
  emptyFields = [],
  onBack,
  targetFields
}) => {
  // Стан для керування даними та кроками
  const [data, setData] = useState<TableData[]>(initialData);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [columnMappings, setColumnMappings] = useState<Record<string, string>>({});

  // Референція для прокрутки таблиці
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // Функція для горизонтальної прокрутки
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

  // Отримуємо валідні колонки
  const getValidColumns = (data: TableData[]): string[] => {
    if (data.length === 0) return [];
    const allKeys = Object.keys(data[0]);
    return allKeys.filter(key => isNaN(Number(key)));
  };

  // Перевірка наявності даних
  if (!data || data.length === 0) return null;

  const columns = getValidColumns(data);
  const totalSteps = 2; // Всього у нас 2 кроки: редагування та перегляд

  // Рендеримо різний контент в залежності від поточного кроку
  const renderStepContent = () => {
    switch (step) {
      case 1:
        // Крок 1: Таблиця для редагування
        return (
          <div className="relative">
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 
                bg-white/90 p-2 rounded-full shadow-lg hover:bg-gray-100 transition-all
                focus:outline-none border border-gray-200"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>

            <div className="overflow-hidden bg-white rounded-lg shadow">
              <div 
                ref={tableContainerRef}
                className="overflow-auto max-h-[70vh] relative"
                style={{ 
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#E5E7EB transparent'
                }}
              >
                <table className="w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0 z-50">
                    <tr>
                      {columns.map((column) => (
                        <th 
                          key={column}
                          className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap bg-gray-50"
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
                            <input
                              type="text"
                              value={row[column] || ''}
                              onChange={(e) => {
                                const newData = [...data];
                                newData[rowIndex] = { 
                                  ...newData[rowIndex], 
                                  [column]: e.target.value 
                                };
                                setData(newData);
                              }}
                              className="w-full p-2 text-sm border rounded-md focus:ring-[#E31E24] focus:border-[#E31E24]"
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 
                bg-white/90 p-2 rounded-full shadow-lg hover:bg-gray-100 transition-all
                focus:outline-none border border-gray-200"
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        );

      case 2:
        // Крок 2: Таблиця перегляду
        return (
          <PreviewTable 
            data={data}
            setMessage={setMessage}
            setLoading={setLoading}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full px-4">
      {/* Індикатор кроків */}
      <StepIndicator steps={totalSteps} currentStep={step} />
      
      {/* Кнопка "Назад" */}
      <div className="flex justify-end mb-4">
        <button
          onClick={step === 1 ? onBack : () => setStep(prev => prev - 1)}
          className="px-4 py-2 text-[#E31E24] border border-[#E31E24] rounded-md hover:bg-red-50 transition-colors"
        >
          Back
        </button>
      </div>

      {/* Контент поточного кроку */}
      {renderStepContent()}

      {/* Кнопка "Далі" */}
      <div className="mt-6 flex justify-end">
        {step < totalSteps && (
          <button
            onClick={() => setStep(prev => prev + 1)}
            className="px-4 py-2 bg-[#E31E24] text-white rounded-md hover:bg-[#C41A1F] transition-colors"
          >
            Next
          </button>
        )}
      </div>

      {/* Повідомлення */}
      {message && (
        <div className="mt-4 p-4 bg-blue-50 text-blue-700 rounded-md">
          {message}
        </div>
      )}

      {/* Кнопка прокрутки вгору */}
      <ScrollToTop />
    </div>
  );
};

export default DataTable;