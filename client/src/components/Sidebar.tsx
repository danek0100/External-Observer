import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FolderIcon, ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { Zettel } from '../types/zettel'
import axios from 'axios'

interface Folder {
  path: string;
  name: string;
  children: Folder[];
  count: number;
}

export default function Sidebar() {
  const [folders, setFolders] = useState<Folder[]>([])
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const location = useLocation()

  useEffect(() => {
    const fetchZettels = async () => {
      try {
        setLoading(true)
        const response = await axios.get<Zettel[]>('/api/notes')
        const folderStructure = buildFolderStructure(response.data)
        setFolders(folderStructure)
      } catch (err) {
        console.error('Error fetching zettels:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchZettels()
  }, [])

  const buildFolderStructure = (zettels: Zettel[]): Folder[] => {
    const root: Folder = { path: '', name: 'root', children: [], count: 0 }
    
    zettels.forEach(zettel => {
      if (!zettel.path) return
      
      const parts = zettel.path.split('/').filter(Boolean)
      let current = root
      
      parts.forEach((part, index) => {
        let child = current.children.find(c => c.name === part)
        if (!child) {
          child = {
            path: parts.slice(0, index + 1).join('/'),
            name: part,
            children: [],
            count: 0
          }
          current.children.push(child)
        }
        current = child
      })
      
      current.count++
    })

    return root.children
  }

  const toggleFolder = (path: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev)
      if (next.has(path)) {
        next.delete(path)
      } else {
        next.add(path)
      }
      return next
    })
  }

  const renderFolder = (folder: Folder, level: number = 0) => {
    const isExpanded = expandedFolders.has(folder.path)
    const isActive = location.pathname === `/notes?path=${folder.path}`

    return (
      <div key={folder.path}>
        <div
          className={`flex items-center px-2 py-1 text-sm rounded-md cursor-pointer ${
            isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'
          }`}
          style={{ paddingLeft: `${level * 1.5 + 0.5}rem` }}
        >
          <button
            onClick={() => toggleFolder(folder.path)}
            className="p-1 hover:bg-gray-100 rounded-md"
          >
            {folder.children.length > 0 ? (
              isExpanded ? (
                <ChevronDownIcon className="h-4 w-4" />
              ) : (
                <ChevronRightIcon className="h-4 w-4" />
              )
            ) : (
              <FolderIcon className="h-4 w-4" />
            )}
          </button>
          <Link
            to={`/notes?path=${folder.path}`}
            className="ml-2 flex-1 truncate"
          >
            {folder.name}
          </Link>
          <span className="ml-2 text-xs text-gray-500">
            {folder.count}
          </span>
        </div>
        {isExpanded && folder.children.length > 0 && (
          <div className="mt-1">
            {folder.children.map(child => renderFolder(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Папки</h2>
        <div className="space-y-1">
          {folders.map(folder => renderFolder(folder))}
        </div>
      </div>
    </div>
  )
} 