import React, { useState } from 'react'
import { Zettel, ZettelRequest } from '../types/zettel'

interface ZettelFormProps {
  zettel?: Zettel;
  onSubmit: (data: ZettelRequest) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function ZettelForm({ zettel, onSubmit, onCancel, isSubmitting = false }: ZettelFormProps) {
  const [content, setContent] = useState(zettel?.content || '')
  const [type, setType] = useState(zettel?.type || 'zettel')
  const [tags, setTags] = useState(zettel?.tags?.join(', ') || '')
  const [path, setPath] = useState(zettel?.path || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      type,
      content,
      path: path || undefined,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
          Тип
        </label>
        <select
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        >
          <option value="zettel">Заметка</option>
          <option value="task">Задача</option>
          <option value="event">Событие</option>
          <option value="finance">Финансы</option>
          <option value="health">Здоровье</option>
          <option value="contact">Контакт</option>
          <option value="diary">Дневник</option>
        </select>
      </div>

      <div>
        <label htmlFor="path" className="block text-sm font-medium text-gray-700">
          Путь
        </label>
        <input
          type="text"
          id="path"
          value={path}
          onChange={(e) => setPath(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          placeholder="zettelkasten/thoughts/"
        />
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
          Теги
        </label>
        <input
          type="text"
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          placeholder="life, self-awareness"
        />
        <p className="mt-1 text-sm text-gray-500">
          Разделяйте теги запятыми
        </p>
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
          Содержимое
        </label>
        <textarea
          id="content"
          rows={15}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          placeholder="Первая строка будет использована как заголовок"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          Отмена
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-50"
        >
          {isSubmitting ? 'Сохранение...' : 'Сохранить'}
        </button>
      </div>
    </form>
  )
} 