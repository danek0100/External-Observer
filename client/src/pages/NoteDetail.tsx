import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { NoteContent } from '../components/NoteContent'
import { NoteGraph } from '../components/NoteGraph'
import { Note } from '../types/note'
import api from '../services/api'

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
          api.get<Note>(`/notes/${id}`),
          api.get<Note[]>('/notes')
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
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">{error}</h3>
          </div>
        </div>
      </div>
    )
  }

  if (!note) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-gray-500">Заметка не найдена</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{note.title}</h1>
          <p className="mt-2 text-sm text-gray-700">
            {note.path}
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => navigate(`/notes/${id}/edit`)}
            className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500"
          >
            Редактировать
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <NoteContent note={note} />
        </div>
        <div>
          <NoteGraph notes={allNotes} currentNoteId={note.id} onNoteClick={handleNoteClick} />
        </div>
      </div>
    </div>
  )
} 