import React from 'react';

interface TableHeaderProps {
  columns: string[];
  emptyFields: string[];
  unmappedColumns?: Array<Record<string, string>>;
}

export const TableHeader: React.FC<TableHeaderProps> = ({ columns, emptyFields, unmappedColumns = [] }) => {
  // Get the first unmapped column name since they're all the same
  const unmappedColumnName = Object.keys(unmappedColumns[0] || {})[0];

  return (
    <thead className="bg-gray-50">
      <tr>
        {columns.map((column) => (
          <th key={column} className="px-2 py-3 text-left text-xs font-medium tracking-wider">
            <div className="flex items-center space-x-2">
              {column === unmappedColumnName ? (
                <select 
                  className="text-xs font-medium text-red-600 uppercase bg-transparent border-none focus:ring-0 cursor-pointer"
                  defaultValue={column}
                >
                  <option value={column}>{column}</option>
                  {emptyFields.map((field) => (
                    <option key={field} value={field}>{field}</option>
                  ))}
                </select>
              ) : (
                <span className="text-gray-500 uppercase">{column}</span>
              )}
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
}