import type { 
    TodoItemSummaryResponse,
    TodoItemResponse,
    TodoItemCreateRequest,
    TodoItemUpdateRequest,
    ODataResponse,
    PagingParams
 } from "../types";
import { fetchWithOData } from "../utils/odataUtils";

const API_BASE = "http://localhost:5208/Todo";

export const todoApi = {

    fetchTodoItemsSummary: async (params?: PagingParams): Promise<ODataResponse<TodoItemSummaryResponse>> => {
        return fetchWithOData<TodoItemSummaryResponse>(API_BASE, '/summary', params, 'Failed to fetch todo items summary');
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
