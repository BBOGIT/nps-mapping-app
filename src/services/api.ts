import { TableData } from '../types';

interface ApiResponse {
  data: string;  // base64 string
  filename: string;
  contentType: string;
}

// Timeout duration in milliseconds (e.g., 5 minutes)
const TIMEOUT_DURATION = 5 * 60 * 1000;

// Helper function to create a timeout promise
const timeout = (ms: number) => {
  return new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Request timeout')), ms)
  );
};

const fetchWithTimeout = async (url: string, options: RequestInit) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_DURATION);

  try {
    const response = await Promise.race([
      fetch(url, {
        ...options,
        signal: controller.signal
      }),
      timeout(TIMEOUT_DURATION)
    ]);
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timed out after ' + TIMEOUT_DURATION / 1000 + ' seconds');
    }
    throw error;
  }
};

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
  const response = await fetchWithTimeout(`${import.meta.env.VITE_API_URL}/save`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data }),
  });

  const result: ApiResponse = await response.json();
    
  // Конвертуємо base64 в blob
  const byteCharacters = atob(result.data);
  const byteNumbers = new Array(byteCharacters.length);
  
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: result.contentType });
  
  // Створюємо посилання для завантаження
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = result.filename;
  
  // Завантажуємо файл
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Очищуємо URL
  window.URL.revokeObjectURL(downloadUrl);
  
  return { message: 'File downloaded successfully' };
};

export const saveTemplate = async (data: TableData[], templateName: string): Promise<ApiResponse> => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/save/templates`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      data,
      templateName
    }),
  });

  const result: ApiResponse = await response.json();
    
  // Конвертуємо base64 в blob
  const byteCharacters = atob(result.data);
  const byteNumbers = new Array(byteCharacters.length);
  
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: result.contentType });
  
  // Створюємо посилання для завантаження
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = result.filename;
  
  // Завантажуємо файл
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Очищуємо URL
  window.URL.revokeObjectURL(downloadUrl);
  
  return { message: 'Template saved and file downloaded successfully' };
};