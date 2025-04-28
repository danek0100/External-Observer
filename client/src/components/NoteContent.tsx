import React from 'react';
import { Note } from '../types/note';

interface NoteContentProps {
  note: Note;
  onNoteClick: (noteId: string) => void;
}

export const NoteContent: React.FC<NoteContentProps> = ({ note, onNoteClick }) => {
  const renderContent = () => {
    const parts = note.content.split(/(\[\[.*?\]\])/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('[[') && part.endsWith(']]')) {
        const noteId = part.slice(2, -2);
        return (
          <span
            key={index}
            className="text-blue-600 hover:underline cursor-pointer"
            onClick={() => onNoteClick(noteId)}
          >
            {part}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="prose max-w-none">
      {renderContent()}
    </div>
  );
}; 