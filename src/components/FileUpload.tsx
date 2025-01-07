import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { TemplateType } from '../types';
import { DataTable } from './DataTable';
import { processFile } from '../services/api';

interface ApiResponse {
  data: any[];
  unmappedColumns?: Array<Record<string, string>>;
  emptyFields?: string[];
}

export const FileUpload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [template, setTemplate] = useState<TemplateType>('shopify');
  const [showTable, setShowTable] = useState(false);
  const [message, setMessage] = useState('');
  const [tableData, setTableData] = useState<ApiResponse>({ data: [] });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      if (fileExt === 'xlsx' || fileExt === 'csv') {
        setSelectedFile(file);
        setMessage('');
      } else {
        setMessage('Please upload only Excel or CSV files');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('template', template);
      
      const response = await processFile(formData);
      setTableData(response);
      setShowTable(true);
    } catch (error) {
      setMessage('Error processing file');
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setTemplate('shopify');
    setShowTable(false);
    setMessage('');
    setTableData({ data: [] });
  };

  if (showTable) {
    return (
      <DataTable 
        onSave={handleReset} 
        initialData={tableData.data}
        unmappedColumns={tableData.unmappedColumns}
        emptyFields={tableData.emptyFields}
      />
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <label className="block text-lg font-medium text-gray-700">
            Select Template
          </label>
          <select
            value={template}
            onChange={(e) => setTemplate(e.target.value as TemplateType)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#E31E24] focus:border-[#E31E24]"
          >
            <option value="shopify">Shopify</option>
            <option value="amazon">Amazon</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="space-y-4">
          <label className="block text-lg font-medium text-gray-700">
            Upload File
          </label>
          <div className="flex items-center justify-center w-full">
            <label className="w-full flex flex-col items-center px-4 py-6 bg-white rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:border-[#E31E24]">
              <Upload className="w-8 h-8 text-gray-400" />
              <span className="mt-2 text-base text-gray-500">
                {selectedFile ? selectedFile.name : 'Select Excel or CSV file'}
              </span>
              <input
                type="file"
                className="hidden"
                accept=".xlsx,.csv"
                onChange={handleFileChange}
              />
            </label>
          </div>
        </div>

        {message && (
          <div className="p-4 bg-blue-50 text-blue-700 rounded-md">
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={!selectedFile}
          className="w-full py-2 px-4 bg-[#E31E24] text-white rounded-md hover:bg-[#C41A1F] disabled:bg-gray-400 transition-colors"
        >
          Process File
        </button>
      </form>
    </div>
  );
};