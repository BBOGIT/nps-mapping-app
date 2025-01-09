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
  const [template, setTemplate] = useState<TemplateType>('other');
  const [showTable, setShowTable] = useState(false);
  const [message, setMessage] = useState('');
  const [tableData, setTableData] = useState<ApiResponse>({ data: [] });
  const [isLoading, setLoading] = useState(false);

  const handleTemplateChange = (value: TemplateType) => {
    setTemplate(value);
    if (value !== 'other') {
      setMessage('Функціонал в розробці');
      setTimeout(() => setMessage(''), 3000);
    }
  };

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
      setLoading(true);
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('template', template);

      const response = await processFile(formData);
      setTableData(response);
      setShowTable(true);
    } catch (error) {
      setMessage('Error processing file');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setTemplate('other');
    setShowTable(false);
    setMessage('');
    setTableData({ data: [] });
  };

  if (showTable) {
    return (
      <DataTable
        onBack={handleReset}
        initialData={tableData.data}
        unmappedColumns={tableData.unmappedColumns}
        emptyFields={tableData.emptyFields}
      />
    );
  }

  return (
    <div className='max-w-xl mx-auto p-6 bg-white rounded-lg shadow-lg'>
      <form onSubmit={handleSubmit} className='space-y-6'>
        <div className='space-y-4'>
          <label className='block text-lg font-medium text-gray-700'>
            Select Template
          </label>
          <select
            value={template}
            onChange={(e) =>
              handleTemplateChange(e.target.value as TemplateType)
            }
            className='w-full p-2 border border-gray-300 rounded-md focus:ring-[#E31E24] focus:border-[#E31E24]'>
            <option value='shopify'>Shopify</option>
            <option value='amazon'>Amazon</option>
            <option value='other'>Other</option>
          </select>
        </div>

        <div className='space-y-4'>
          <label className='block text-lg font-medium text-gray-700'>
            Upload File
          </label>
          <div className='flex items-center justify-center w-full'>
            <label className='w-full flex flex-col items-center px-4 py-6 bg-white rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:border-[#E31E24]'>
              <Upload className='w-8 h-8 text-gray-400' />
              <span className='mt-2 text-base text-gray-500'>
                {selectedFile ? selectedFile.name : 'Select Excel or CSV file'}
              </span>
              <input
                type='file'
                className='hidden'
                accept='.xlsx,.csv'
                onChange={handleFileChange}
              />
            </label>
          </div>
        </div>

        {isLoading && (
          <div className='mx-auto flex justify-center items-center w-full'>
            <svg
              aria-hidden='true'
              className='w-8 h-8 text-gray-200 animate-spin dark:text-white fill-red-700'
              viewBox='0 0 100 101'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'>
              <path
                d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                fill='currentColor'
              />
              <path
                d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                fill='currentFill'
              />
            </svg>
            <span className='sr-only'>Loading...</span>
          </div>
        )}

        {message && !isLoading && (
          <div className='p-4 bg-blue-50 text-blue-700 rounded-md'>
            {message}
          </div>
        )}

        <button
          type='submit'
          disabled={!selectedFile || isLoading}
          className='w-full py-2 px-4 bg-[#E31E24] text-white rounded-md hover:bg-[#C41A1F] disabled:bg-gray-400 transition-colors'>
          Process File
        </button>
      </form>
    </div>
  );
};
