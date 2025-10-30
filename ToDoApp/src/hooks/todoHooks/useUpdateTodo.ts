import { useCallback, useState } from "react";
import type { TodoItemUpdateRequest, TodoItemResponse } from "../../types";
import { todoApi }  from "../../api/todoApi";

export const useUpdateTodo = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const updateTodo = useCallback(async (id: number, item: TodoItemUpdateRequest): Promise<TodoItemResponse | null> => {
        setLoading(true);
        setError(null);
        try {
            const updatedTodo = await todoApi.updateTodoItem(item, id);
            return updatedTodo;
        } catch (error) {
            setError(error instanceof Error ? error.message : "Failed to update todo");
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return { 
        updateTodo, 
        loading, 
        error 
    };
};
