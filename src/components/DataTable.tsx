import React, { useState } from 'react';
import { TableData } from '../types';
import { TableHeader } from './TableHeader';
import { TableRow } from './TableRow';
import StepIndicator from './StepIndicator';

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

  // Отримуємо валідні колонки, ігноруючи числові
  const getValidColumns = (data: TableData[]): string[] => {
    if (data.length === 0) return [];
    const allKeys = Object.keys(data[0]);
    return allKeys.filter(key => isNaN(Number(key)));
  };

  if (!data || data.length === 0) return null;

  const columns = getValidColumns(data);
  const totalSteps = 3; // Загальна кількість кроків у процесі

  return (
    <div className="w-full px-4">
      {/* Індикатор кроків */}
      <StepIndicator steps={totalSteps} currentStep={step} />
      
      <div className="flex justify-end mb-4">
        <button
          onClick={step === 1 ? onBack : () => setStep(prev => prev - 1)}
          className="px-4 py-2 text-[#E31E24] border border-[#E31E24] rounded-md hover:bg-red-50 transition-colors"
        >
          Back
        </button>
      </div>
      
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full divide-y divide-gray-200">
          <TableHeader 
            columns={columns}
            emptyFields={['Default', ...emptyFields]}
            unmappedColumns={unmappedColumns}
            onColumnMapping={(column, value) => {
              setColumnMappings(prev => ({...prev, [column]: value}));
            }}
            columnMappings={columnMappings}
          />
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

      {/* Кнопка Next */}
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
    </div>
  );
};