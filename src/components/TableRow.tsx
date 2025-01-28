import React from 'react';
import { TableData } from '../types';

// Визначаємо інтерфейс для правил валідації
interface ValidationRule {
  name: string;
  validation: string;
}

interface TableRowProps {
  data: TableData[];
  columns: string[];
  onCellChange: (rowIndex: number, column: string, value: string) => void;
  unmappedColumns?: Array<Record<string, string>>;
  columnMappings?: Record<string, string>;
  targetFields: ValidationRule[];  // Масив правил валідації
}

export const TableRow: React.FC<TableRowProps> = ({ 
  data, 
  columns, 
  onCellChange, 
  columnMappings = {},
  unmappedColumns = [],
  targetFields = []
}) => {
  // Функція для визначення, чи має бути комірка сірою
  const isGrayCell = React.useCallback((column: string) => {
    return unmappedColumns.includes(column) || columnMappings[column] === 'Default';
  }, [unmappedColumns, columnMappings]);

  // Функція для валідації значення за регулярним виразом
  const isValidValue = React.useCallback((column: string, value: string): boolean => {
    // Якщо значення пусте, вважаємо його валідним
    if (!value) return true;

    // Знаходимо правило валідації для поточного поля
    const rule = targetFields.find(field => field.name === column);
    if (!rule) {
      // Якщо правило не знайдено, вважаємо значення валідним
      console.log(`No validation rule found for column: ${column}`);
      return true;
    }

    try {
      const regex = new RegExp(rule.validation);
      const isValid = regex.test(value);
      
      // Логуємо результат валідації для відлагодження
      console.log(`Validating ${column}: "${value}" against ${rule.validation} -> ${isValid}`);
      
      return isValid;
    } catch (error) {
      // У випадку помилки в регулярному виразі, логуємо її та вважаємо значення валідним
      console.error(`Validation error for ${column}:`, error);
      return true;
    }
  }, [targetFields]);

  // Функція для отримання стилів комірки
  const getCellStyle = React.useCallback((column: string, value: string) => {
    const isGray = isGrayCell(column);
    const isValid = isValidValue(column, value);

    return {
      backgroundColor: isGray ? '#F9FAFB' : '#FFFFFF',
      color: isGray ? '#9CA3AF' : '#111827',
      borderColor: !value ? '#D1D5D9' : (isValid ? '#D1D5D9' : '#E31E24'),
      borderWidth: !value ? '1px' : (isValid ? '1px' : '2px')
    };
  }, [isGrayCell, isValidValue]);

  return (
    <tbody className="bg-white divide-y divide-gray-200">
      {data.map((row, rowIndex) => (
        <tr key={rowIndex} className="hover:bg-gray-50">
          {columns.map((column) => {
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
                      ${isGrayCell(column) ? 'bg-gray-50' : 'bg-white'}
                      focus:ring-[#E31E24] focus:border-[#E31E24] focus:outline-none
                      transition-colors duration-200`}
                    disabled={isGrayCell(column)}
                  />
                  {/* Показуємо індикатор помилки, якщо значення невалідне */}
                  {!isValid && value && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <span className="text-red-500 text-lg" title="Невалідне значення">!</span>
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