import React, { useState, useEffect } from 'react';
import { PencilIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function MarkdownEditor({
  value,
  onChange,
  placeholder = 'Начните писать...',
  className = ''
}: MarkdownEditorProps) {
  const [isPreview, setIsPreview] = useState(false);
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onChange(newValue);
  };

  // Простой предпросмотр Markdown (в будущем можно заменить на полноценный рендеринг)
  const renderPreview = () => {
    return (
      <div className="prose prose-sm max-w-none p-4">
        {localValue.split('\n').map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>
    );
  };

  return (
    <div className={`border border-gray-300 rounded-lg overflow-hidden ${className}`}>
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-300">
        <div className="flex items-center space-x-2">
          <DocumentTextIcon className="h-5 w-5 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Редактор</span>
        </div>
        <button
          onClick={() => setIsPreview(!isPreview)}
          className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900"
        >
          <PencilIcon className="h-4 w-4" />
          <span>{isPreview ? 'Редактировать' : 'Предпросмотр'}</span>
        </button>
      </div>

      {isPreview ? (
        renderPreview()
      ) : (
        <textarea
          value={localValue}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full h-64 p-4 text-gray-900 placeholder-gray-500 focus:outline-none resize-none"
          style={{ minHeight: '16rem' }}
        />
      )}

      <div className="px-4 py-2 bg-gray-50 border-t border-gray-300 text-xs text-gray-500">
        <div className="flex items-center justify-between">
          <span>Поддерживается Markdown</span>
          <span>{localValue.length} символов</span>
        </div>
      </div>
    </div>
  );
} 