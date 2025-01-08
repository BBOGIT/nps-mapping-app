
import React from 'react';

interface TableHeaderProps {
  columns: string[];
  emptyFields: string[];
  unmappedColumns?: Array<Record<string, string>>;
  onColumnMapping: (column: string, value: string) => void;
  columnMappings: Record<string, string>;
}

export const TableHeader: React.FC<TableHeaderProps> = ({ 
  columns, 
  emptyFields, 
  onColumnMapping,
  columnMappings
}) => {
  // Отримуємо поточне значення для колонки
  const getCurrentValue = (column: string) => {
    return columnMappings[column] || column;
  };

  // Функція для отримання списку опцій для селектора
  const getSelectOptions = (currentColumn: string) => {
    const currentValue = getCurrentValue(currentColumn);
    
    // Створюємо список опцій, виключаючи поточне значення
    const options = [
      // Додаємо оригінальну назву колонки, тільки якщо вона не є поточним значенням
      ...(currentColumn !== currentValue ? [currentColumn] : []),
      // Завжди додаємо Default
      'Default',
      // Додаємо всі інші опції з emptyFields, крім поточного значення
      ...emptyFields.filter(field => field !== currentValue)
    ];

    // Видаляємо можливі дублікати
    return Array.from(new Set(options));
  };

  const getHeaderStyle = (column: string) => {
    const currentValue = getCurrentValue(column);
    const isSpecialColumn = column.startsWith('unmappedColumn') || currentValue === 'Default';
    
    return `text-xs font-medium uppercase bg-transparent border-none focus:ring-0 cursor-pointer
      ${isSpecialColumn ? 'text-gray-700' : 'text-gray-500'}`;
  };

  const handleColumnChange = (changedColumn: string, newValue: string) => {
    const updatedMappings = { ...columnMappings };

    if (newValue !== 'Default') {
      columns.forEach(column => {
        const currentValue = getCurrentValue(column);
        if (currentValue === newValue && column !== changedColumn) {
          updatedMappings[column] = 'Default';
        }
      });
    }

    updatedMappings[changedColumn] = newValue;
    
    Object.entries(updatedMappings).forEach(([column, value]) => {
      onColumnMapping(column, value);
    });
  };

  return (
    <thead className="bg-gray-50">
      <tr>
        {columns.map((column) => {
          const currentValue = getCurrentValue(column);
          const options = getSelectOptions(column);
          
          return (
            <th key={column} className="px-2 py-3 text-left">
              <select 
                className={getHeaderStyle(column)}
                value={currentValue}
                onChange={(e) => handleColumnChange(column, e.target.value)}
              >
                {/* Показуємо поточне значення першим */}
                <option value={currentValue}>{currentValue}</option>
                {/* Показуємо інші доступні опції */}
                {options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </th>
          );
        })}
      </tr>
    </thead>
  );
};