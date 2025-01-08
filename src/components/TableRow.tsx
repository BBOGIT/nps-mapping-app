// TableRow.tsx
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
  columnMappings = {}
}) => {
  // Функція для визначення, чи має бути комірка сірою
  const isGrayCell = (column: string) => {
    return column.startsWith('unmappedColumn') || columnMappings[column] === 'Default';
  };

  // Функція для отримання стилів комірки
  const getCellStyle = (column: string) => {
    const isGray = isGrayCell(column);
    
    return {
      backgroundColor: isGray ? '#F9FAFB' : '#FFFFFF',
      color: isGray ? '#9CA3AF' : '#111827',
      borderColor: isGray ? '#E5E7EB' : '#D1D5D9'
    };
  };

  return (
    <tbody className="bg-white divide-y divide-gray-200">
      {data.map((row, rowIndex) => (
        <tr key={rowIndex}>
          {columns.map((column) => {
            const isGray = isGrayCell(column);
            const cellStyle = getCellStyle(column);
            
            return (
              <td key={column} className="px-2 py-2 whitespace-nowrap">
                <input
                  type="text"
                  value={row[column] || ''}
                  onChange={(e) => onCellChange(rowIndex, column, e.target.value)}
                  style={cellStyle}
                  className={`w-full min-w-[120px] p-2 text-sm border rounded-md
                    ${isGray ? 'bg-gray-50' : 'bg-white'}
                    focus:ring-[#E31E24] focus:border-[#E31E24]`}
                  disabled={isGray}
                />
              </td>
            );
          })}
        </tr>
      ))}
    </tbody>
  );
};