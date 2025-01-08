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
  unmappedColumns = [],
  onColumnMapping,
  columnMappings
}) => {
  const isGrayedOut = (column: string) => {
    return column.startsWith('unmappedColumn') || columnMappings[column] === 'Default';
  };

  const handleColumnChange = (column: string, newValue: string) => {
    // If the new value is already used in another column, set that column to Default
    const existingColumn = Object.entries(columnMappings).find(([col, val]) => 
      val === newValue && col !== column && !col.startsWith('unmappedColumn')
    );

    if (existingColumn && newValue !== 'Default') {
      onColumnMapping(existingColumn[0], 'Default');
    }
    
    onColumnMapping(column, newValue);
  };

  return (
    <thead className="bg-gray-50">
      <tr>
        {columns.map((column) => {
          const isGrayed = isGrayedOut(column);
          
          return (
            <th key={column} className="px-2 py-3 text-left text-xs font-medium tracking-wider">
              <div className="flex items-center space-x-2">
                <select 
                  className={`text-xs font-medium uppercase bg-transparent border-none focus:ring-0 cursor-pointer
                    ${isGrayed ? 'text-gray-700' : 'text-gray-500'}`}
                  value={columnMappings[column] || column}
                  onChange={(e) => handleColumnChange(column, e.target.value)}
                >
                  <option value={column}>{column}</option>
                  {emptyFields.map((field) => (
                    <option key={field} value={field}>{field}</option>
                  ))}
                </select>
              </div>
            </th>
          );
        })}
      </tr>
    </thead>
  );
}