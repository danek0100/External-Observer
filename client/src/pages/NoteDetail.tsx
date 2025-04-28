import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { NoteContent } from '../components/NoteContent'
import { NoteGraph } from '../components/NoteGraph'
import { Note } from '../types/note'
import axios from 'axios'

export default function NoteDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [note, setNote] = useState<Note | null>(null)
  const [allNotes, setAllNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [noteResponse, notesResponse] = await Promise.all([
          axios.get<Note>(`/api/notes/${id}`),
          axios.get<Note[]>('/api/notes')
        ])
        setNote(noteResponse.data)
        setAllNotes(notesResponse.data)
        setError(null)
      } catch (err) {
        setError('Не удалось загрузить заметку')
        console.error('Error fetching data:', err)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchData()
    }
  }, [id])

  const handleNoteClick = (noteId: string) => {
    navigate(`/notes/${noteId}`)
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

  if (!note) {
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
            <div className="px-4 py-6 sm:p-8">
              <h1 className="text-2xl font-semibold mb-4">{note.title}</h1>
              <NoteContent note={note} onNoteClick={handleNoteClick} />
            </div>
          </div>
        </div>
        
        <div className="md:col-span-1">
          <NoteGraph 
            notes={allNotes}
            currentNoteId={note.id}
            onNoteClick={handleNoteClick}
          />
        </div>
      </div>
    </div>
  )
} 