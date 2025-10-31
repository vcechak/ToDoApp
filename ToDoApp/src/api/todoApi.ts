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

    /**
     * Fetches a paginated summary of todo items with OData query support
     * @param params - Optional OData query parameters for filtering, sorting, and paging
     * @returns Promise resolving to an OData response containing todo item summaries
     */
    fetchTodoItemsSummary: async (params?: PagingParams): Promise<ODataResponse<TodoItemSummaryResponse>> => {
        return fetchWithOData<TodoItemSummaryResponse>(API_BASE, '/summary', params, 'Failed to fetch todo items summary');
    },

    /**
     * Fetches a specific todo item by its ID
     * @param id - The unique identifier of the todo item
     * @returns Promise resolving to the todo item details
     */
    fetchTodoItemById: async (id: number): Promise<TodoItemResponse> => {
        const response = await fetch(`${API_BASE}/${id}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch todo item with id: ${id}`);
        }
        return response.json();
    },

    /**
     * Creates a new todo item
     * @param item - The todo item data (without ID)
     * @returns Promise resolving to the created todo item
     */
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

    /**
     * Updates an existing todo item
     * @param item - The updated todo item data
     * @param id - The unique identifier of the todo item to update
     * @returns Promise resolving to the updated todo item
     */
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

    /**
     * Deletes a todo item by its ID
     * @param id - The unique identifier of the todo item to delete
     * @returns Promise that resolves when the deletion is complete
     */
    deleteTodoItem: async (id: number): Promise<void> => {
        const response = await fetch(`${API_BASE}/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`Failed to delete todo item with id: ${id}`);
        }
    },
};
