import { Habit, HabitFormData, HabitSortData, HabitCheck } from '../types/habit';
import api from './api';

export const habitService = {
    // Получение списка всех привычек
    getAllHabits: async (): Promise<Habit[]> => {
        const response = await api.get('/api/habits');
        return response.data;
    },

    // Создание новой привычки
    createHabit: async (habitData: HabitFormData): Promise<Habit> => {
        const response = await api.post('/api/habits', habitData);
        return response.data;
    },

    // Обновление привычки
    updateHabit: async (id: string, habitData: HabitFormData): Promise<Habit> => {
        const response = await api.put(`/api/habits/${id}`, habitData);
        return response.data;
    },

    // Удаление привычки
    deleteHabit: async (id: string): Promise<void> => {
        await api.delete(`/api/habits/${id}`);
    },

    // Обновление порядка привычек
    updateHabitOrder: async (sortData: HabitSortData): Promise<void> => {
        await api.put('/api/habits/order', sortData);
    },

    // Получение чек-листа за день
    getHabitChecks: async (date: string): Promise<HabitCheck[]> => {
        const response = await api.get(`/api/habits/checks`, {
            params: { date }
        });
        return response.data;
    },

    // Получение чек-листов за период
    getHabitChecksForPeriod: async (startDate: string, endDate: string): Promise<HabitCheck[]> => {
        const response = await api.get(`/api/habits/checks/period`, {
            params: { startDate, endDate }
        });
        return response.data;
    },

    // Создание или обновление отметки о выполнении
    createHabitCheck: async (checkData: Omit<HabitCheck, 'id' | 'username'>): Promise<HabitCheck> => {
        const response = await api.post('/api/habits/checks', checkData);
        return response.data;
    },

    // Обновление отметки о выполнении
    updateHabitCheck: async (id: string, checkData: Partial<HabitCheck>): Promise<HabitCheck> => {
        const response = await api.put(`/api/habits/checks/${id}`, checkData);
        return response.data;
    },

    // Экспорт данных в Excel
    exportHabitChecks: async (startDate: string, endDate: string): Promise<Blob> => {
        const response = await api.get(`/api/habits/export`, {
            params: { startDate, endDate },
            responseType: 'blob'
        });
        return response.data;
    }
}; 