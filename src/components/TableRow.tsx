import React from 'react';
import { TableData } from '../types';

interface TargetField {
  name: string;
  validation: string;
}

interface TableRowProps {
  data: TableData[];
  columns: string[];
  onCellChange: (rowIndex: number, column: string, value: string) => void;
  unmappedColumns?: Array<Record<string, string>>;
  columnMappings?: Record<string, string>;
  targetFields: TargetField[];
}

export const TableRow: React.FC<TableRowProps> = ({ 
  data, 
  columns, 
  onCellChange, 
  columnMappings = {},
  targetFields
}) => {
  // Функція для визначення, чи має бути комірка сірою
  const isGrayCell = (column: string) => {
    return column.startsWith('unmappedColumn') || columnMappings[column] === 'Default';
  };

  // Функція для перевірки значення на відповідність регулярному виразу
  const isValidValue = (column: string, value: string): boolean => {
    const targetField = targetFields.find(field => field.name === column);
    if (!targetField) return true; // Якщо поле не знайдено в targetFields, вважаємо його валідним

    const regex = new RegExp(targetField.validation);
    return regex.test(value);
  };

  // Функція для отримання стилів комірки
  const getCellStyle = (column: string, value: string) => {
    const isGray = isGrayCell(column);
    const isValid = isValidValue(column, value);
    
    return {
      backgroundColor: isGray ? '#F9FAFB' : '#FFFFFF',
      color: isGray ? '#9CA3AF' : '#111827',
      borderColor: isGray ? '#E5E7EB' : isValid ? '#D1D5D9' : '#E31E24'
    };
  };

  return (
    <tbody className="bg-white divide-y divide-gray-200">
      {data.map((row, rowIndex) => (
        <tr key={rowIndex}>
          {columns.map((column) => {
            const isGray = isGrayCell(column);
            const value = row[column] || '';
            const cellStyle = getCellStyle(column, value);
            const isValid = isValidValue(column, value);
            
            return (
              <td key={column} className="px-2 py-2 whitespace-nowrap">
                <input
                  type="text"
                  value={value}
                  onChange={(e) => onCellChange(rowIndex, column, e.target.value)}
                  style={cellStyle}
                  className={`w-full min-w-[120px] p-2 text-sm border rounded-md
                    ${isGray ? 'bg-gray-50' : 'bg-white'}
                    ${!isValid ? 'border-[#E31E24]' : ''}
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