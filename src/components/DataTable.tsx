import React, { useState } from 'react';
import { TableData } from '../types';
import { TableHeader } from './TableHeader';
import { TableRow } from './TableRow';
import { Message } from './Message';
import { PreviewTable } from './PreviewTable';

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
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [step, setStep] = useState(1);
  const [columnMappings, setColumnMappings] = useState<Record<string, string>>({});

  React.useEffect(() => {
    if (initialData.length > 0) {
      const combinedData = initialData.map((row, index) => ({
        ...row,
        ...unmappedColumns[index]
      }));
      setData(combinedData);
    }
  }, [initialData, unmappedColumns]);

  const handleColumnMapping = (column: string, value: string) => {
    setColumnMappings(prev => {
      const newMappings = { ...prev };
      
      Object.keys(newMappings).forEach(key => {
        if (newMappings[key] === value && key !== column) {
          newMappings[key] = 'Default';
        }
      });
      
      newMappings[column] = value;
      return newMappings;
    });
  };

  const handleNext = () => {
    setLoading(true);
    setTimeout(() => {
      const filteredData = data.map(row => {
        const newRow: Record<string, string> = {};
        Object.entries(row).forEach(([key, value]) => {
          if (
            columnMappings[key] !== 'Default' && 
            !key.startsWith('unmappedColumn')
          ) {
            newRow[key] = value;
          }
        });
        return newRow;
      });
      setData(filteredData);
      setStep(2);
      setLoading(false);
    }, 1000);
  };

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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Step {step}</h2>
        <button
          onClick={step === 1 ? onBack : () => setStep(1)}
          className="px-4 py-2 text-[#E31E24] border border-[#E31E24] rounded-md hover:bg-red-50 transition-colors"
        >
          Back
        </button>
      </div>
      
      {step === 1 ? (
        <>
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="w-full divide-y divide-gray-200">
              <TableHeader 
                columns={columns} 
                emptyFields={['Default', ...emptyFields]} 
                unmappedColumns={unmappedColumns}
                onColumnMapping={handleColumnMapping}
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
              />
            </table>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-[#E31E24] text-white rounded-md hover:bg-[#C41A1F] transition-colors"
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <PreviewTable 
          data={data}
          setMessage={setMessage}
          setLoading={setLoading}
        />
      )}

      {message && <Message message={message} />}
    </div>
  );
};