import React from 'react';
import { TableData } from '../types';

interface TableRowProps {
  data: TableData[];
  columns: string[];
  onCellChange: (rowIndex: number, column: string, value: string) => void;
  unmappedColumns?: Array<Record<string, string>>;
}

export const TableRow: React.FC<TableRowProps> = ({ data, columns, onCellChange, unmappedColumns = [] }) => {
  // Get the unmapped column name
  const unmappedColumnName = Object.keys(unmappedColumns[0] || {})[0];

  return (
    <tbody className="bg-white divide-y divide-gray-200">
      {data.map((row, rowIndex) => (
        <tr key={rowIndex}>
          {columns.map((column) => (
            <td 
              key={column} 
              className={`px-2 py-2 whitespace-nowrap ${column === unmappedColumnName ? 'bg-red-50' : ''}`}
            >
              <input
                type="text"
                value={row[column]}
                onChange={(e) => onCellChange(rowIndex, column, e.target.value)}
                className={`w-full min-w-[120px] p-2 text-sm border rounded-md
                  ${column === unmappedColumnName 
                    ? 'bg-red-50 border-red-300 text-red-900' 
                    : 'border-gray-300'} 
                  focus:ring-[#E31E24] focus:border-[#E31E24]`}
              />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}