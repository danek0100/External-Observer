import React, { useState } from 'react';
import { DailyChecklist } from '../components/habits/DailyChecklist';
import { HabitOverview } from '../components/habits/HabitOverview';
import { format, addMonths, subMonths } from 'date-fns';
import { ru } from 'date-fns/locale';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export const HabitChecklist: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [viewMode, setViewMode] = useState<'daily' | 'overview'>('daily');

    const handlePrevMonth = () => {
        setCurrentDate(prev => subMonths(prev, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(prev => addMonths(prev, 1));
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={handlePrevMonth}
                        className="p-2 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <ChevronLeftIcon className="h-5 w-5" />
                    </button>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        {format(currentDate, 'LLLL yyyy', { locale: ru })}
                    </h1>
                    <button
                        onClick={handleNextMonth}
                        className="p-2 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <ChevronRightIcon className="h-5 w-5" />
                    </button>
                </div>
                <div className="flex space-x-4">
                    <button
                        onClick={() => setViewMode('daily')}
                        className={`px-4 py-2 rounded-md text-sm font-medium ${
                            viewMode === 'daily'
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        Дневной режим
                    </button>
                    <button
                        onClick={() => setViewMode('overview')}
                        className={`px-4 py-2 rounded-md text-sm font-medium ${
                            viewMode === 'overview'
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        Обзорный режим
                    </button>
                </div>
            </div>

            {viewMode === 'daily' ? (
                <DailyChecklist date={currentDate} />
            ) : (
                <HabitOverview date={currentDate} />
            )}
        </div>
    );
}; 