import React from 'react';
import { Note } from '../types/note';

interface NoteGraphProps {
  notes: Note[];
  currentNoteId: string;
  onNoteClick: (noteId: string) => void;
}

export const NoteGraph: React.FC<NoteGraphProps> = ({ notes, currentNoteId, onNoteClick }) => {
  const getConnectedNotes = (noteId: string) => {
    const note = notes.find(n => n.id === noteId);
    if (!note) return [];
    
    // Находим все заметки, на которые есть ссылки в текущей заметке
    const linkedNotes = notes.filter(n => 
      note.content.includes(`[[${n.id}]]`)
    );
    
    // Находим все заметки, которые ссылаются на текущую
    const referencingNotes = notes.filter(n => 
      n.content.includes(`[[${noteId}]]`)
    );
    
    return [...new Set([...linkedNotes, ...referencingNotes])];
  };

  const connectedNotes = getConnectedNotes(currentNoteId);

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Связанные заметки</h3>
      <div className="space-y-2">
        {connectedNotes.map(note => (
          <div
            key={note.id}
            className="p-2 hover:bg-gray-100 rounded cursor-pointer"
            onClick={() => onNoteClick(note.id)}
          >
            {note.title}
          </div>
        ))}
        {connectedNotes.length === 0 && (
          <p className="text-gray-500">Нет связанных заметок</p>
        )}
      </div>
    </div>
  );
}; 