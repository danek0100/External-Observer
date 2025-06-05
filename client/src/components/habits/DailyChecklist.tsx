import React, { useEffect, useState } from 'react';
import { Habit, HabitCheck } from '../../types/habit';
import { habitService } from '../../services/habitService';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface DailyChecklistProps {
    date?: Date; // Если не указана дата, используется текущая
}

export const DailyChecklist: React.FC<DailyChecklistProps> = ({ date = new Date() }) => {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [checks, setChecks] = useState<Record<string, HabitCheck>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingComment, setEditingComment] = useState<string | null>(null);

    const formattedDate = format(date, 'yyyy-MM-dd');

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [habitsData, checksData] = await Promise.all([
                    habitService.getAllHabits(),
                    habitService.getHabitChecks(formattedDate)
                ]);

                setHabits(habitsData.sort((a, b) => a.order - b.order));
                
                // Преобразуем массив проверок в объект для быстрого доступа
                const checksMap = checksData.reduce((acc, check) => ({
                    ...acc,
                    [check.habitId]: check
                }), {} as Record<string, HabitCheck>);
                
                setChecks(checksMap);
                setError(null);
            } catch (err) {
                setError('Не удалось загрузить данные');
                console.error('Error loading checklist data:', err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [formattedDate]);

    const handleCheckChange = async (habitId: string, completed: boolean) => {
        try {
            const check = checks[habitId];
            if (check) {
                // Обновляем существующую проверку
                await habitService.updateHabitCheck(check.id, { completed });
                setChecks(prev => ({
                    ...prev,
                    [habitId]: { ...check, completed }
                }));
            } else {
                // Создаем новую проверку
                const newCheck = await habitService.createHabitCheck({
                    habitId,
                    date: formattedDate,
                    completed,
                    comment: ''
                });
                setChecks(prev => ({
                    ...prev,
                    [habitId]: newCheck
                }));
            }
        } catch (err) {
            setError('Не удалось обновить статус');
            console.error('Error updating check:', err);
        }
    };

    const handleCommentChange = async (habitId: string, comment: string) => {
        try {
            const check = checks[habitId];
            if (check) {
                await habitService.updateHabitCheck(check.id, { comment });
                setChecks(prev => ({
                    ...prev,
                    [habitId]: { ...check, comment }
                }));
            } else {
                const newCheck = await habitService.createHabitCheck({
                    habitId,
                    date: formattedDate,
                    completed: false,
                    comment
                });
                setChecks(prev => ({
                    ...prev,
                    [habitId]: newCheck
                }));
            }
            setEditingComment(null);
        } catch (err) {
            setError('Не удалось сохранить комментарий');
            console.error('Error updating comment:', err);
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
                    Чек-лист на {format(date, 'd MMMM yyyy', { locale: ru })}
                </h2>
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

            <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
                {habits.map(habit => {
                    const check = checks[habit.id];
                    const isEditing = editingComment === habit.id;

                    return (
                        <div key={habit.id} className="p-4">
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0">
                                    <input
                                        type="checkbox"
                                        checked={check?.completed || false}
                                        onChange={(e) => handleCheckChange(habit.id, e.target.checked)}
                                        className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-medium text-gray-900">
                                            {habit.name}
                                        </h3>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {habit.description}
                                    </p>
                                    {!isEditing ? (
                                        <div 
                                            className="mt-2 text-sm text-gray-500 cursor-pointer hover:text-gray-700"
                                            onClick={() => setEditingComment(habit.id)}
                                        >
                                            {check?.comment || 'Добавить комментарий...'}
                                        </div>
                                    ) : (
                                        <div className="mt-2">
                                            <textarea
                                                value={check?.comment || ''}
                                                onChange={(e) => handleCommentChange(habit.id, e.target.value)}
                                                onBlur={() => setEditingComment(null)}
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                rows={2}
                                                placeholder="Добавить комментарий..."
                                                autoFocus
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}; 