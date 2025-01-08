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
  const isGrayedOut = (column: string) => {
    return column.startsWith('unmappedColumn') || columnMappings[column] === 'Default';
  };

  return (
    <tbody className="bg-white divide-y divide-gray-200">
      {data.map((row, rowIndex) => (
        <tr key={rowIndex}>
          {columns.map((column) => {
            const isGrayed = isGrayedOut(column);
            
            return (
              <td key={column} className="px-2 py-2 whitespace-nowrap">
                <input
                  type="text"
                  value={row[column]}
                  onChange={(e) => onCellChange(rowIndex, column, e.target.value)}
                  className={`w-full min-w-[120px] p-2 text-sm border rounded-md
                    ${isGrayed ? 'bg-gray-50 text-gray-400 border-gray-200' : 'border-gray-300'} 
                    focus:ring-[#E31E24] focus:border-[#E31E24]`}
                  disabled={isGrayed}
                />
              </td>
            );
          })}
        </tr>
      ))}
    </tbody>
  );
}