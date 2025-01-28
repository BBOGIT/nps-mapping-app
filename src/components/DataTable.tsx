// DataTable.tsx
import React, { useState } from 'react';
import { TableData } from '../types';
import { TableHeader } from './TableHeader';
import { TableRow } from './TableRow';

interface DataTableProps {
  initialData: TableData[];
  unmappedColumns?: Array<Record<string, string>>;
  emptyFields?: string[];
  onBack: () => void;
}

export const DataTable: React.FC<DataTableProps> = ({ 
  initialData,
  unmappedColumns = [],
  emptyFields = [],
  onBack
}) => {
  const [data, setData] = useState<TableData[]>(initialData);
  
  // Додаємо логування для відстеження трансформації даних
  React.useEffect(() => {
    console.log('Initial data:', initialData);
    if (initialData.length > 0) {
      const sample = initialData[0];
      console.log('Sample row keys:', Object.keys(sample));
      
      // Перевіряємо, чи є числові ключі
      const hasNumericKeys = Object.keys(sample).some(key => !isNaN(Number(key)));
      console.log('Has numeric keys:', hasNumericKeys);
    }
  }, [initialData]);

  // Отримуємо колонки, ігноруючи числові ключі
  const getValidColumns = (data: TableData[]): string[] => {
    if (data.length === 0) return [];
    
    const allKeys = Object.keys(data[0]);
    // Фільтруємо числові ключі та сортуємо за порядком в API
    const validKeys = allKeys
      .filter(key => isNaN(Number(key)))
      .sort((a, b) => {
        const order = [
          "IEW number",
          "Sender type",
          "Sender full name",
          // ... додайте інші поля в потрібному порядку
        ];
        return order.indexOf(a) - order.indexOf(b);
      });
      
    console.log('Filtered columns:', validKeys);
    return validKeys;
  };

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
            onColumnMapping={() => {}}
            columnMappings={{}}
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
          />
        </table>
      </div>
    </div>
  );
};