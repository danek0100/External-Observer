import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import ZettelForm from '../components/ZettelForm'
import { Zettel, ZettelRequest } from '../types/zettel'
import api from '../services/api'

export default function NoteEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [zettel, setZettel] = useState<Zettel | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchZettel = async () => {
      try {
        setLoading(true)
        const response = await api.get<Zettel>(`/notes/${id}`)
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

  const handleSubmit = async (data: ZettelRequest) => {
    try {
      setIsSubmitting(true)
      if (id) {
        await api.put(`/notes/${id}`, data)
      } else {
        await api.post('/notes', data)
      }
      navigate(`/notes/${id}`)
    } catch (err) {
      setError('Не удалось сохранить заметку')
      console.error('Error saving zettel:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

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

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <button
          onClick={() => navigate(`/notes/${id}`)}
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
        >
          <ArrowLeftIcon className="mr-1 h-4 w-4" />
          Назад
        </button>
      </div>

      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
        <div className="px-4 py-6 sm:p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            {id ? 'Редактирование заметки' : 'Новая заметка'}
          </h1>
          <ZettelForm
            zettel={zettel || undefined}
            onSubmit={handleSubmit}
            onCancel={() => navigate(`/notes/${id}`)}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  )
} 