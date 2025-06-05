export interface Habit {
    id: string;
    name: string;
    description: string;
    purpose: string;
    username: string;
    createdAt: string;
    updatedAt: string;
    order: number;
}

export interface HabitCheck {
    id: string;
    habitId: string;
    date: string;
    completed: boolean;
    comment: string;
    username: string;
}

export interface ActiveHabit {
    id: string;
    habitId: string;
    username: string;
    order: number;
    activeFrom: string;
    activeTo: string | null;
}

export interface HabitFormData {
    name: string;
    description: string;
    purpose: string;
}

export interface HabitSortData {
    habitId: string;
    newOrder: number;
} 