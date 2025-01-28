import React from 'react';
import { TableData } from '../types';

interface TableRowProps {
  data: TableData[];
  columns: string[];
  onCellChange: (rowIndex: number, column: string, value: string) => void;
  unmappedColumns?: Array<Record<string, string>>;
  columnMappings?: Record<string, string>;
}

export const TableRow: React.FC<TableRowProps> = ({ 
  data, 
  columns, 
  onCellChange, 
  columnMappings = {},
  unmappedColumns = []
}) => {
  // Перевіряємо, чи має бути комірка сірою
  const isGrayCell = (column: string) => {
    return unmappedColumns.includes(column) || columnMappings[column] === 'Default';
  };

  // Отримуємо стилі для комірки
  const getCellStyle = (column: string) => {
    const isGray = isGrayCell(column);
    
    return {
      backgroundColor: isGray ? '#F9FAFB' : '#FFFFFF',
      color: isGray ? '#9CA3AF' : '#111827',
      borderColor: '#D1D5D9'
    };
  };

  return (
    <tbody className="bg-white divide-y divide-gray-200">
      {data.map((row, rowIndex) => (
        <tr key={rowIndex} className="hover:bg-gray-50">
          {columns.map((column) => {
            const isGray = isGrayCell(column);
            const value = row[column] || '';
            const cellStyle = getCellStyle(column);
            
            return (
              <td key={column} className="px-2 py-2 whitespace-nowrap">
                <div className="relative">
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => onCellChange(rowIndex, column, e.target.value)}
                    style={cellStyle}
                    className={`w-full min-w-[120px] p-2 text-sm border rounded-md
                      ${isGray ? 'bg-gray-50' : 'bg-white'}
                      focus:ring-[#E31E24] focus:border-[#E31E24] focus:outline-none
                      transition-colors duration-200`}
                    disabled={isGray}
                  />
                </div>
              </td>
            );
          })}
        </tr>
      ))}
    </tbody>
  );
};

export default TableRow;