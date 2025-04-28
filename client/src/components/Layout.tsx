import { Outlet } from 'react-router-dom'
import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Sidebar from './Sidebar'
import { FileOperations } from './FileOperations'

const navigation = [
  { name: 'Главная', href: '/' },
  { name: 'Заметки', href: '/notes' },
  { name: 'Задачи', href: '/tasks' },
  { name: 'События', href: '/events' },
  { name: 'Финансы', href: '/finance' },
  { name: 'Здоровье', href: '/health' },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">External Observer</h1>
            <FileOperations />
          </div>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
} 