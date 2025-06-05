import React, { useEffect, useState } from 'react';
import { Habit, HabitCheck } from '../../types/habit';
import { habitService } from '../../services/habitService';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth } from 'date-fns';
import { ru } from 'date-fns/locale';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface HabitOverviewProps {
    date?: Date; // Если не указана дата, используется текущая
}

export const HabitOverview: React.FC<HabitOverviewProps> = ({ date = new Date() }) => {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [checks, setChecks] = useState<Record<string, HabitCheck[]>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [habitsData, checksData] = await Promise.all([
                    habitService.getAllHabits(),
                    habitService.getHabitChecksForPeriod(
                        format(monthStart, 'yyyy-MM-dd'),
                        format(monthEnd, 'yyyy-MM-dd')
                    )
                ]);

                setHabits(habitsData.sort((a, b) => a.order - b.order));
                
                // Группируем проверки по привычкам
                const checksByHabit = habitsData.reduce((acc, habit) => ({
                    ...acc,
                    [habit.id]: checksData.filter(check => check.habitId === habit.id)
                }), {} as Record<string, HabitCheck[]>);
                
                setChecks(checksByHabit);
                setError(null);
            } catch (err) {
                setError('Не удалось загрузить данные');
                console.error('Error loading overview data:', err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [monthStart, monthEnd]);

    const getCheckForDay = (habitId: string, day: Date): HabitCheck | undefined => {
        const dayStr = format(day, 'yyyy-MM-dd');
        return checks[habitId]?.find(check => check.date === dayStr);
    };

    const exportToExcel = async () => {
        try {
            const response = await habitService.exportHabitChecks(
                format(monthStart, 'yyyy-MM-dd'),
                format(monthEnd, 'yyyy-MM-dd')
            );
            
            // Создаем ссылку для скачивания
            const url = window.URL.createObjectURL(new Blob([response]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `habits-${format(date, 'yyyy-MM')}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            setError('Не удалось экспортировать данные');
            console.error('Error exporting data:', err);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                    Обзор привычек за {format(date, 'LLLL yyyy', { locale: ru })}
                </h2>
                <button
                    onClick={exportToExcel}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Экспорт в Excel
                </button>
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

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Привычка
                            </th>
                            {days.map(day => (
                                <th
                                    key={day.toISOString()}
                                    scope="col"
                                    className={`px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider ${
                                        !isSameMonth(day, date) ? 'bg-gray-100' : ''
                                    }`}
                                >
                                    {format(day, 'd')}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {habits.map(habit => (
                            <tr key={habit.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {habit.name}
                                </td>
                                {days.map(day => {
                                    const check = getCheckForDay(habit.id, day);
                                    return (
                                        <td
                                            key={day.toISOString()}
                                            className={`px-2 py-4 whitespace-nowrap text-center ${
                                                !isSameMonth(day, date) ? 'bg-gray-50' : ''
                                            }`}
                                        >
                                            {check ? (
                                                check.completed ? (
                                                    <CheckIcon className="h-5 w-5 text-green-500 mx-auto" />
                                                ) : (
                                                    <XMarkIcon className="h-5 w-5 text-red-500 mx-auto" />
                                                )
                                            ) : (
                                                <span className="text-gray-300">—</span>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}; 