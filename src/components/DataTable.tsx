import React from 'react';
import { TableData } from '../types';
import { TableHeader } from './TableHeader';
import { TableRow } from './TableRow';
import { ActionButtons } from './ActionButtons';
import { useTableData } from '../hooks/useTableData';
import { Message } from './Message';

interface DataTableProps {
  onSave: () => void;
  initialData: TableData[];
  unmappedColumns?: Array<Record<string, string>>;
  emptyFields?: string[];
}

export const DataTable: React.FC<DataTableProps> = ({ 
  onSave, 
  initialData,
  unmappedColumns = [],
  emptyFields = []
}) => {
  const { data, setData, loading, message, handleSave, handleSaveTemplate } = useTableData(onSave);

  React.useEffect(() => {
    if (initialData.length > 0) {
      // Combine main data with unmapped columns
      const combinedData = initialData.map((row, index) => ({
        ...row,
        ...unmappedColumns[index]
      }));
      setData(combinedData);
    }
  }, [initialData, unmappedColumns, setData]);

  if (loading) {
    return (
      <div className="w-full h-40 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#E31E24] border-t-transparent"></div>
      </div>
    );
  }

  if (!data || data.length === 0) return null;

  const columns = Object.keys(data[0]);

  return (
    <div className="w-full px-4">
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full divide-y divide-gray-200">
          <TableHeader 
            columns={columns} 
            emptyFields={emptyFields} 
            unmappedColumns={unmappedColumns}
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

      {message && <Message message={message} />}

      <ActionButtons 
        onSave={handleSave}
        onSaveTemplate={handleSaveTemplate}
      />
    </div>
  );
};