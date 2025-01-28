import React, { useState } from 'react';
import { TableData } from '../types';
import { TableHeader } from './TableHeader';
import { TableRow } from './TableRow';

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
  const [columnMappings, setColumnMappings] = useState<Record<string, string>>({});

  // Отримуємо валідні колонки, ігноруючи числові
  const getValidColumns = (data: TableData[]): string[] => {
    if (data.length === 0) return [];
    const allKeys = Object.keys(data[0]);
    return allKeys.filter(key => isNaN(Number(key)));
  };

  // Додаємо логування для відстеження стану
  React.useEffect(() => {
    console.log('DataTable mounted with:', {
      dataLength: data.length,
      targetFieldsLength: targetFields?.length,
      columns: getValidColumns(data)
    });
  }, [data, targetFields]);

  if (!data || data.length === 0) return null;

  const columns = getValidColumns(data);

  return (
    <div className="w-full px-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Step 1</h2>
        <button
          onClick={onBack}
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
    </div>
  );
};