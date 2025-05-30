import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PlusIcon } from '@heroicons/react/24/outline'
import ZettelCard from '../components/ZettelCard'
import { Zettel } from '../types/zettel'
import api from '../services/api'

export default function Home() {
  const [recentZettels, setRecentZettels] = useState<Zettel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchZettels = async () => {
      try {
        setLoading(true)
        const response = await api.get<Zettel[]>('/notes')
        setRecentZettels(response.data)
        setError(null)
      } catch (err) {
        setError('Не удалось загрузить заметки')
        console.error('Error fetching zettels:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchZettels()
  }, [])

  return (
    <div className="space-y-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Добро пожаловать в External Observer</h1>
          <p className="mt-2 text-sm text-gray-700">
            Ваша персональная система управления жизнью
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            to="/notes/new"
            className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500"
          >
            <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            Новая заметка
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="col-span-full text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-sm text-gray-500">Загрузка...</p>
          </div>
        ) : error ? (
          <div className="col-span-full text-center py-12">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        ) : recentZettels.length > 0 ? (
          recentZettels.map((zettel) => (
            <ZettelCard key={zettel.id} zettel={zettel} />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-sm text-gray-500">Нет недавних заметок</p>
            <Link
              to="/notes/new"
              className="mt-4 inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              Создать первую заметку
              <PlusIcon className="ml-1 h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        )}
      </div>
    </div>
  )
} 