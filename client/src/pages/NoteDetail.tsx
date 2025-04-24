import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import ZettelContent from '../components/ZettelContent'
import { Zettel } from '../types/zettel'
import axios from 'axios'

export default function NoteDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [zettel, setZettel] = useState<Zettel | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchZettel = async () => {
      try {
        setLoading(true)
        const response = await axios.get<Zettel>(`/api/notes/${id}`)
        setZettel(response.data)
        setError(null)
      } catch (err) {
        setError('Не удалось загрузить заметку')
        console.error('Error fetching zettel:', err)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchZettel()
    }
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-lg font-medium text-gray-900">{error}</h2>
        <button
          onClick={() => navigate('/notes')}
          className="mt-4 inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-500"
        >
          <ArrowLeftIcon className="mr-1 h-4 w-4" />
          Вернуться к списку заметок
        </button>
      </div>
    )
  }

  if (!zettel) {
    return (
      <div className="text-center py-12">
        <h2 className="text-lg font-medium text-gray-900">Заметка не найдена</h2>
        <button
          onClick={() => navigate('/notes')}
          className="mt-4 inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-500"
        >
          <ArrowLeftIcon className="mr-1 h-4 w-4" />
          Вернуться к списку заметок
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <button
          onClick={() => navigate('/notes')}
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
        >
          <ArrowLeftIcon className="mr-1 h-4 w-4" />
          Назад
        </button>
      </div>

      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
        <div className="px-4 py-6 sm:p-8">
          <ZettelContent zettel={zettel} />
        </div>
      </div>
    </div>
  )
} 