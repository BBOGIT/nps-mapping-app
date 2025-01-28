import React, { useState, useRef } from 'react';
import { TableData } from '../types';
import { TableHeader } from './TableHeader';
import { TableRow } from './TableRow';
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
  const [data, setData] = useState<TableData[]>(initialData);
  const [step, setStep] = useState(1);
  const [columnMappings, setColumnMappings] = useState<Record<string, string>>({});
  
  // Посилання на контейнер таблиці для горизонтальної прокрутки
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // Функція для прокрутки таблиці вліво/вправо
  const scroll = (direction: 'left' | 'right') => {
    if (tableContainerRef.current) {
      const scrollAmount = 300; // Кількість пікселів для прокрутки
      const newScrollLeft = direction === 'left' 
        ? tableContainerRef.current.scrollLeft - scrollAmount
        : tableContainerRef.current.scrollLeft + scrollAmount;
      
      tableContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  const getValidColumns = (data: TableData[]): string[] => {
    if (data.length === 0) return [];
    const allKeys = Object.keys(data[0]);
    return allKeys.filter(key => isNaN(Number(key)));
  };

  if (!data || data.length === 0) return null;

  const columns = getValidColumns(data);
  const totalSteps = 3;

  return (
    <div className="w-full px-4">
      <StepIndicator steps={totalSteps} currentStep={step} />
      
      <div className="flex justify-end mb-4">
        <button
          onClick={step === 1 ? onBack : () => setStep(prev => prev - 1)}
          className="px-4 py-2 text-[#E31E24] border border-[#E31E24] rounded-md hover:bg-red-50 transition-colors"
        >
          Back
        </button>
      </div>

      {/* Контейнер для таблиці з кнопками прокрутки */}
      <div className="relative">
        {/* Кнопка прокрутки вліво */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 
            bg-white/90 p-2 rounded-full shadow-lg hover:bg-gray-100 transition-all
            focus:outline-none border border-gray-200"
          aria-label="Прокрутити вліво"
        >
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>

        {/* Контейнер з фіксованими заголовками та прокруткою */}
        <div className="relative overflow-x-auto bg-white rounded-lg shadow">
          <div 
            ref={tableContainerRef}
            className="overflow-x-auto max-h-[70vh] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
          >
            <table className="w-full divide-y divide-gray-200">
              {/* Фіксований заголовок */}
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  {columns.map(column => (
                    <th
                      key={column}
                      className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>

              <TableRow 
                data={data}
                columns={columns}
                onCellChange={(rowIndex, column, value) => {
                  const newData = [...data];
                  newData[rowIndex] = { ...newData[rowIndex], [column]: value };
                  setData(newData);
                }}
                unmappedColumns={unmappedColumns}
                columnMappings={columnMappings}
                targetFields={targetFields}
              />
            </table>
          </div>
        </div>

        {/* Кнопка прокрутки вправо */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 
            bg-white/90 p-2 rounded-full shadow-lg hover:bg-gray-100 transition-all
            focus:outline-none border border-gray-200"
          aria-label="Прокрутити вправо"
        >
          <ChevronRight className="w-6 h-6 text-gray-600" />
        </button>
      </div>

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

      {/* Кнопка прокрутки вгору */}
      <ScrollToTop />
    </div>
  );
};

export default DataTable;