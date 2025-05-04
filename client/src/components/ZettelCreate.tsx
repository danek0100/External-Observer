import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PlusIcon } from '@heroicons/react/24/outline'
import ZettelForm from './ZettelForm'
import { ZettelRequest } from '../types/zettel'
import api from '../services/api'

export default function ZettelCreate() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (data: ZettelRequest) => {
    try {
      setIsSubmitting(true)
      const response = await api.post<{ id: string }>('/api/notes', data)
      navigate(`/notes/${response.data.id}`)
    } catch (err) {
      setError('Не удалось создать заметку')
      console.error('Error creating zettel:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Новая заметка</h1>
          <p className="mt-2 text-sm text-gray-700">
            Создайте новую заметку в вашей системе
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
        <div className="px-4 py-6 sm:p-8">
          <ZettelForm
            onSubmit={handleSubmit}
            onCancel={() => navigate('/notes')}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  )
} 