
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
  // Отримуємо значення колонки, враховуючи як маппінг, так і початкове значення
  const getCurrentValue = (column: string) => {
    return columnMappings[column] || column;
  };

  // Функція для перевірки, чи використовується значення в інших колонках
  const isValueUsedInOtherColumns = (value: string, currentColumn: string) => {
    // Перевіряємо як маппінги, так і початкові значення колонок
    return columns.some(col => {
      const colValue = getCurrentValue(col);
      return colValue === value && col !== currentColumn;
    });
  };

  // Оновлена функція обробки зміни значення
  const handleColumnChange = (changedColumn: string, newValue: string) => {
    // Створюємо нову копію маппінгу для оновлення
    const updatedMappings = { ...columnMappings };

    if (newValue !== 'Default') {
      // Перевіряємо всі колонки (не тільки ті, що в маппінгу)
      columns.forEach(column => {
        const currentValue = getCurrentValue(column);
        
        // Якщо знаходимо співпадіння значення в іншій колонці
        if (currentValue === newValue && column !== changedColumn) {
          // Встановлюємо Default для цієї колонки
          updatedMappings[column] = 'Default';
        }
      });
    }

    // Встановлюємо нове значення для зміненої колонки
    updatedMappings[changedColumn] = newValue;

    // Застосовуємо всі зміни
    Object.entries(updatedMappings).forEach(([column, value]) => {
      onColumnMapping(column, value);
    });
  };

  const getHeaderStyle = (column: string) => {
    const currentValue = getCurrentValue(column);
    const isSpecialColumn = column.startsWith('unmappedColumn') || currentValue === 'Default';
    
    return `text-xs font-medium uppercase bg-transparent border-none focus:ring-0 cursor-pointer
      ${isSpecialColumn ? 'text-gray-700' : 'text-gray-500'}`;
  };

  return (
    <thead className="bg-gray-50">
      <tr>
        {columns.map((column) => {
          const currentValue = getCurrentValue(column);
          
          return (
            <th key={column} className="px-2 py-3 text-left">
              <select 
                className={getHeaderStyle(column)}
                value={currentValue}
                onChange={(e) => handleColumnChange(column, e.target.value)}
              >
                <option value={column}>{column}</option>
                {emptyFields.map((field) => (
                  <option key={field} value={field}>{field}</option>
                ))}
              </select>
            </th>
          );
        })}
      </tr>
    </thead>
  );
};