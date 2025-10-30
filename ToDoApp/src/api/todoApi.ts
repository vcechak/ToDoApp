import type { 
    TodoItemSummaryResponse,
    TodoItemResponse,
    TodoItemCreateRequest,
    TodoItemUpdateRequest
 } from "../types";

const API_BASE = "http://localhost:5208/Todo";

export const todoApi =  {
    fetchTodoItemsSummary: async (): Promise<TodoItemSummaryResponse[]> => {
        const response = await fetch(`${API_BASE}/summary`);
        if (!response.ok) {
            throw new Error("Failed to fetch todo items");
        }
        return response.json();
    },

    fetchTodoItemById: async (id: number): Promise<TodoItemResponse> => {
        const response = await fetch(`${API_BASE}/${id}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch todo item with id: ${id}`);
        }
        return response.json();
    },

    createTodoItem: async (item: Omit<TodoItemCreateRequest, 'id'>): Promise<TodoItemResponse> => {
        const response = await fetch(`${API_BASE}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(item),
        });
        if (!response.ok) {
            throw new Error("Failed to create todo item");
        }
        return response.json();
    },

    updateTodoItem: async (item: TodoItemUpdateRequest, id: number): Promise<TodoItemResponse> => {
        const response = await fetch(`${API_BASE}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(item),
        });
        if (!response.ok) {
            throw new Error(`Failed to update todo item with id: ${id}`);
        }
        return response.json();
    },

    deleteTodoItem: async (id: number): Promise<void> => {
        const response = await fetch(`${API_BASE}/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`Failed to delete todo item with id: ${id}`);
        }
    },
};
