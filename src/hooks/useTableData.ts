import { useState } from 'react';
import { TableData } from '../types';
import { saveData, saveTemplate } from '../services/api';

export const useTableData = (onSave: () => void) => {
  const [data, setData] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await saveData(data);
      setMessage(response.message || 'Thank you!');
      setTimeout(onSave, 2000);
    } catch (error) {
      setMessage('Error saving data');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTemplate = async () => {
    try {
      setLoading(true);
      const response = await saveTemplate(data);
      setMessage(response.message || 'Thank you, template saved successfully!');
      setTimeout(onSave, 2000);
    } catch (error) {
      setMessage('Error saving template');
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    setData,
    loading,
    message,
    handleSave,
    handleSaveTemplate,
  };
};