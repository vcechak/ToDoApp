import { useCallback, useState } from "react";
import type { TodoItemCreateRequest, TodoItemResponse } from "../../types";
import { todoApi } from "../../api/todoApi";

export const useCreateTodo = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const createTodo = useCallback(async (item: TodoItemCreateRequest): Promise<TodoItemResponse | null> => {
        setLoading(true);
        setError(null);
        try {
            const newTodo = await todoApi.createTodoItem(item);
            return newTodo;
        } catch (error) {
            setError(error instanceof Error ? error.message : "Failed to create todo");
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return { 
        createTodo, 
        loading, 
        error 
    };
};
