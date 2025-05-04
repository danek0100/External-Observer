import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Zettel } from '../types/zettel';
import api from '../services/api';

interface SearchResult {
  id: string;
  title: string;
  preview: string;
  path?: string;
}

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchZettels = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await api.get<SearchResult[]>('/search', {
          params: { q: query }
        });
        setResults(response.data);
      } catch (error) {
        console.error('Ошибка поиска:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchZettels, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleResultClick = (result: SearchResult) => {
    setQuery('');
    setShowResults(false);
    navigate(`/notes/${result.id}`);
  };

  return (
    <div ref={searchRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowResults(true)}
          placeholder="Поиск заметок..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-500"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        )}
      </div>

      {showResults && (query || isLoading) && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-96 overflow-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">Поиск...</div>
          ) : results.length > 0 ? (
            <ul>
              {results.map((result) => (
                <li
                  key={result.id}
                  onClick={() => handleResultClick(result)}
                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
                >
                  <div className="font-medium">{result.title}</div>
                  {result.path && (
                    <div className="text-sm text-gray-500">{result.path}</div>
                  )}
                  <div className="text-sm text-gray-600 mt-1">{result.preview}</div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-gray-500">Ничего не найдено</div>
          )}
        </div>
      )}
    </div>
  );
} 