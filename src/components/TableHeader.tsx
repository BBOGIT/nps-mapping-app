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
  const unmappedColumnName = Object.keys(unmappedColumns[0] || {})[0];

  return (
    <thead className="bg-gray-50">
      <tr>
        {columns.map((column) => (
          <th 
            key={column} 
            className={`px-2 py-3 text-left text-xs font-medium tracking-wider ${
              column === unmappedColumnName ? 'bg-gray-700' : ''
            }`}
          >
            <div className="flex items-center space-x-2">
              <select 
                className={`text-xs font-medium uppercase bg-transparent border-none focus:ring-0 cursor-pointer ${
                  column === unmappedColumnName ? 'text-white' : 'text-gray-500'
                }`}
                value={columnMappings[column] || column}
                onChange={(e) => onColumnMapping(column, e.target.value)}
              >
                <option value={column}>{column}</option>
                {emptyFields.map((field) => (
                  <option key={field} value={field}>{field}</option>
                ))}
              </select>
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
}