import React, { useRef } from 'react';
import axios from 'axios';
import { ArrowDownTrayIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';

export const FileOperations: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('files', file);
    });

    try {
      await axios.post('/api/files/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      window.location.reload();
    } catch (error) {
      console.error('Error importing files:', error);
    }
  };

  const handleExport = async () => {
    try {
      const response = await axios.get('/api/files/export', {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'notes.zip');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting files:', error);
    }
  };

  return (
    <div className="flex space-x-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImport}
        accept=".md"
        multiple
        className="hidden"
      />
      
      <button
        onClick={() => fileInputRef.current?.click()}
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
      >
        <ArrowUpTrayIcon className="h-5 w-5 mr-2" />
        Импорт .md
      </button>

      <button
        onClick={handleExport}
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
      >
        <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
        Экспорт ZIP
      </button>
    </div>
  );
}; 