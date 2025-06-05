import React, { useEffect, useState } from 'react';
import { Habit, HabitFormData } from '../types/habit';
import { habitService } from '../services/habitService';
import { HabitForm } from '../components/habits/HabitForm';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

export const Habits: React.FC = () => {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadHabits = async () => {
        try {
            setIsLoading(true);
            const data = await habitService.getAllHabits();
            setHabits(data.sort((a, b) => a.order - b.order));
            setError(null);
        } catch (err) {
            setError('Не удалось загрузить список привычек');
            console.error('Error loading habits:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadHabits();
    }, []);

    const handleCreateHabit = async (data: HabitFormData) => {
        try {
            await habitService.createHabit(data);
            setIsFormOpen(false);
            loadHabits();
        } catch (err) {
            setError('Не удалось создать привычку');
            console.error('Error creating habit:', err);
        }
    };

    const handleUpdateHabit = async (data: HabitFormData) => {
        if (!editingHabit) return;
        try {
            await habitService.updateHabit(editingHabit.id, data);
            setEditingHabit(null);
            loadHabits();
        } catch (err) {
            setError('Не удалось обновить привычку');
            console.error('Error updating habit:', err);
        }
    };

    const handleDeleteHabit = async (id: string) => {
        if (!window.confirm('Вы уверены, что хотите удалить эту привычку?')) return;
        try {
            await habitService.deleteHabit(id);
            loadHabits();
        } catch (err) {
            setError('Не удалось удалить привычку');
            console.error('Error deleting habit:', err);
        }
    };

    const handleDragEnd = async (result: any) => {
        if (!result.destination) return;

        const items = Array.from(habits);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        // Обновляем порядок в UI
        setHabits(items.map((item, index) => ({ ...item, order: index })));

        // Отправляем новый порядок на сервер
        try {
            await habitService.updateHabitOrder({
                habitId: reorderedItem.id,
                newOrder: result.destination.index
            });
        } catch (err) {
            setError('Не удалось обновить порядок привычек');
            console.error('Error updating habit order:', err);
            loadHabits(); // Перезагружаем список в случае ошибки
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">Управление привычками</h1>
                <button
                    onClick={() => setIsFormOpen(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Добавить привычку
                </button>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{error}</p>
                </div>
            )}

            {isFormOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 max-w-lg w-full">
                        <h2 className="text-lg font-medium mb-4">Новая привычка</h2>
                        <HabitForm
                            onSubmit={handleCreateHabit}
                            onCancel={() => setIsFormOpen(false)}
                        />
                    </div>
                </div>
            )}

            {editingHabit && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 max-w-lg w-full">
                        <h2 className="text-lg font-medium mb-4">Редактирование привычки</h2>
                        <HabitForm
                            initialData={editingHabit}
                            onSubmit={handleUpdateHabit}
                            onCancel={() => setEditingHabit(null)}
                        />
                    </div>
                </div>
            )}

            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="habits">
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="space-y-4"
                        >
                            {habits.map((habit, index) => (
                                <Draggable key={habit.id} draggableId={habit.id} index={index}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className="bg-white shadow rounded-lg p-4"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-lg font-medium text-gray-900">
                                                        {habit.name}
                                                    </h3>
                                                    {habit.description && (
                                                        <p className="mt-1 text-sm text-gray-500">
                                                            {habit.description}
                                                        </p>
                                                    )}
                                                    {habit.purpose && (
                                                        <p className="mt-2 text-sm text-indigo-600">
                                                            Зачем: {habit.purpose}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => setEditingHabit(habit)}
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        Редактировать
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteHabit(habit.id)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Удалить
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
}; 