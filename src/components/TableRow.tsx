import React from 'react';
import { TableData } from '../types';

interface TableRowProps {
  data: TableData[];
  columns: string[];
  onCellChange: (rowIndex: number, column: string, value: string) => void;
  unmappedColumns?: Array<Record<string, string>>;
  columnMappings?: Record<string, string>;
}

export const TableRow: React.FC<TableRowProps> = ({ 
  data, 
  columns, 
  onCellChange, 
  unmappedColumns = [],
  columnMappings = {}
}) => {
  const isUnmappedColumn = (column: string) => {
    return column.startsWith('unmappedColumn');
  };

  const isDefaultColumn = (column: string) => {
    return columnMappings[column] === 'Default';
  };

  return (
    <tbody className="bg-white divide-y divide-gray-200">
      {data.map((row, rowIndex) => (
        <tr key={rowIndex}>
          {columns.map((column) => (
            <td 
              key={column} 
              className={`px-2 py-2 whitespace-nowrap ${
                isUnmappedColumn(column) ? 'bg-gray-700' : 
                isDefaultColumn(column) ? 'bg-gray-700' : ''
              }`}
            >
              <input
                type="text"
                value={row[column]}
                onChange={(e) => onCellChange(rowIndex, column, e.target.value)}
                className={`w-full min-w-[120px] p-2 text-sm border rounded-md
                  ${isUnmappedColumn(column) || isDefaultColumn(column)
                    ? 'bg-gray-100 text-gray-400 border-gray-300' 
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