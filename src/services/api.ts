import { TableData } from '../types';

interface ApiResponse {
  data: TableData[];
  message?: string;
}

export const processFile = async (formData: FormData): Promise<ApiResponse> => {
  const response = await fetch(import.meta.env.VITE_API_URL, {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    throw new Error('Failed to process file');
  }
  
  return response.json();
};

export const saveData = async (data: TableData[]): Promise<ApiResponse> => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/save`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to save data');
  }
  
  return response.json();
};

export const saveTemplate = async (data: TableData[]): Promise<ApiResponse> => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/save/templates`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to save template');
  }
  
  return response.json();
};