import React from 'react';

interface TableData {
  [key: string]: string;
}

interface TargetField {
  name: string;
  validation: string;
}

interface TableRowProps {
  data: TableData[];
  columns: string[];
  onCellChange: (rowIndex: number, column: string, value: string) => void;
  unmappedColumns?: string[];
  columnMappings?: Record<string, string>;
  targetFields: TargetField[];
}

export const TableRow: React.FC<TableRowProps> = ({ 
  data, 
  columns, 
  onCellChange, 
  columnMappings = {},
  targetFields,
  unmappedColumns = []
}) => {
  // Функція для визначення, чи має бути комірка сірою
  const isGrayCell = (column: string) => {
    return unmappedColumns.includes(column) || columnMappings[column] === 'Default';
  };

  // Функція для перевірки значення на відповідність регулярному виразу
  const isValidValue = (column: string, value: string): boolean => {
    // Якщо значення пусте, повертаємо true (не показуємо помилку)
    if (!value) return true;

    const targetField = targetFields.find(field => field.name === column);
    if (!targetField) return true;

    try {
      const regex = new RegExp(targetField.validation);
      return regex.test(value);
    } catch (error) {
      console.error(`Invalid regex for column ${column}:`, error);
      return true;
    }
  };

  // Функція для отримання стилів комірки
  const getCellStyle = (column: string, value: string) => {
    const isGray = isGrayCell(column);
    const isValid = isValidValue(column, value);
    
    return {
      backgroundColor: isGray ? '#F9FAFB' : '#FFFFFF',
      color: isGray ? '#9CA3AF' : '#111827',
      borderColor: !value ? '#D1D5D9' : (isValid ? '#D1D5D9' : '#E31E24'),
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