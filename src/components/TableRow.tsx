import React from 'react';
import { TableData } from '../types';

// Додаємо інтерфейс для правил валідації
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
  // Додаємо валідаційні правила до пропсів
  targetFields: TargetField[];
}

export const TableRow: React.FC<TableRowProps> = ({ 
  data, 
  columns, 
  onCellChange, 
  columnMappings = {},
  unmappedColumns = [],
  targetFields
}) => {
  // Функція для перевірки значення за регулярним виразом
  const isValidValue = React.useCallback((column: string, value: string): boolean => {
    // Якщо поле пусте, не показуємо помилку
    if (!value) return true;

    // Шукаємо правило валідації для поточного поля
    const targetField = targetFields.find(field => field.name === column);
    if (!targetField) return true;

    try {
      const regex = new RegExp(targetField.validation);
      return regex.test(value);
    } catch (error) {
      console.error(`Помилка валідації для колонки ${column}:`, error);
      return true;
    }
  }, [targetFields]);

  // Функція для визначення сірих комірок (не змінилась)
  const isGrayCell = (column: string) => {
    return unmappedColumns.includes(column) || columnMappings[column] === 'Default';
  };

  // Оновлена функція отримання стилів з урахуванням валідації
  const getCellStyle = (column: string, value: string) => {
    const isGray = isGrayCell(column);
    const isValid = isValidValue(column, value);
    
    return {
      backgroundColor: isGray ? '#F9FAFB' : '#FFFFFF',
      color: isGray ? '#9CA3AF' : '#111827',
      // Змінюємо колір рамки залежно від валідації
      borderColor: !value ? '#D1D5D9' : (isValid ? '#D1D5D9' : '#E31E24'),
      // Робимо товщу рамку для невалідних значень
      borderWidth: !value ? '1px' : (isValid ? '1px' : '2px')
    };
  };

  return (
    <tbody className="bg-white divide-y divide-gray-200">
      {data.map((row, rowIndex) => (
        <tr key={rowIndex} className="hover:bg-gray-50">
          {columns.map((column) => {
            const isGray = isGrayCell(column);
            const value = row[column] || '';
            const cellStyle = getCellStyle(column, value);
            const isValid = isValidValue(column, value);
            
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
                  {/* Додаємо індикатор помилки */}
                  {!isValid && value && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <span className="text-red-500">!</span>
                    </div>
                  )}
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