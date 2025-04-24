import { Link } from 'react-router-dom'
import { Zettel } from '../types/zettel'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

interface ZettelCardProps {
  zettel: Zettel;
}

export default function ZettelCard({ zettel }: ZettelCardProps) {
  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            <Link to={`/notes/${zettel.id}`} className="hover:text-primary-600">
              {zettel.content.split('\n')[0]}
            </Link>
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {format(new Date(zettel.created), 'd MMMM yyyy', { locale: ru })}
          </p>
        </div>
        <span className="inline-flex items-center rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800">
          {zettel.type}
        </span>
      </div>
      
      {zettel.tags && zettel.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {zettel.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      
      <div className="mt-4 text-sm text-gray-500 line-clamp-3">
        {zettel.content.split('\n').slice(1).join('\n')}
      </div>
    </div>
  )
} 