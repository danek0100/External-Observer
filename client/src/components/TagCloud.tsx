import React from 'react';
import { Link } from 'react-router-dom';

interface Tag {
  name: string;
  count: number;
}

interface TagCloudProps {
  tags: Tag[];
  maxFontSize?: number;
  minFontSize?: number;
}

export default function TagCloud({ 
  tags, 
  maxFontSize = 24, 
  minFontSize = 12 
}: TagCloudProps) {
  if (!tags.length) {
    return (
      <div className="text-center text-gray-500 py-4">
        Нет доступных тегов
      </div>
    );
  }

  // Находим максимальное и минимальное количество тегов
  const maxCount = Math.max(...tags.map(tag => tag.count));
  const minCount = Math.min(...tags.map(tag => tag.count));

  // Функция для расчета размера шрифта
  const getFontSize = (count: number) => {
    if (maxCount === minCount) return (maxFontSize + minFontSize) / 2;
    
    const scale = (count - minCount) / (maxCount - minCount);
    return minFontSize + (maxFontSize - minFontSize) * scale;
  };

  return (
    <div className="flex flex-wrap gap-2 p-4">
      {tags.map((tag) => (
        <Link
          key={tag.name}
          to={`/notes?tag=${encodeURIComponent(tag.name)}`}
          className="inline-block px-3 py-1 rounded-full bg-primary-50 text-primary-700 hover:bg-primary-100 transition-colors"
          style={{ fontSize: `${getFontSize(tag.count)}px` }}
        >
          {tag.name}
          <span className="ml-1 text-xs text-primary-500">
            ({tag.count})
          </span>
        </Link>
      ))}
    </div>
  );
} 