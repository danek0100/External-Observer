import React from 'react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { Zettel } from '../types/zettel'
import { Link } from 'react-router-dom'

interface ZettelContentProps {
  zettel: Zettel;
}

export default function ZettelContent({ zettel }: ZettelContentProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {zettel.content.split('\n')[0]}
          </h1>
          <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
            <time dateTime={zettel.created}>
              {format(new Date(zettel.created), 'd MMMM yyyy', { locale: ru })}
            </time>
            {zettel.updated && (
              <time dateTime={zettel.updated}>
                Обновлено: {format(new Date(zettel.updated), 'd MMMM yyyy', { locale: ru })}
              </time>
            )}
            <span className="inline-flex items-center rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800">
              {zettel.type}
            </span>
          </div>
        </div>
        <Link
          to={`/notes/${zettel.id}/edit`}
          className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          Редактировать
        </Link>
      </div>

      {zettel.tags && zettel.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {zettel.tags.map((tag) => (
            <Link
              key={tag}
              to={`/notes?tag=${tag}`}
              className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 hover:bg-gray-200"
            >
              {tag}
            </Link>
          ))}
        </div>
      )}

      <div className="prose prose-lg max-w-none">
        {zettel.content.split('\n').slice(1).map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>

      {zettel.links && zettel.links.length > 0 && (
        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-lg font-medium text-gray-900">Связанные заметки</h2>
          <ul className="mt-4 space-y-2">
            {zettel.links.map((linkId) => (
              <li key={linkId}>
                <Link
                  to={`/notes/${linkId}`}
                  className="text-primary-600 hover:text-primary-500"
                >
                  {linkId}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {zettel.metadata && Object.keys(zettel.metadata).length > 0 && (
        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-lg font-medium text-gray-900">Метаданные</h2>
          <dl className="mt-4 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            {Object.entries(zettel.metadata).map(([key, value]) => (
              <div key={key}>
                <dt className="text-sm font-medium text-gray-500">{key}</dt>
                <dd className="mt-1 text-sm text-gray-900">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  )
} 