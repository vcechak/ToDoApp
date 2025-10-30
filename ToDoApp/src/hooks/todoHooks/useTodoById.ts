import { useCallback, useEffect, useState } from "react";
import type { TodoItemResponse } from "../../types";
import { todoApi } from "../../api/todoApi";

export const useTodoById = (id: number | null) => {
    const [todo, setTodo] = useState<TodoItemResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTodo = useCallback(async (todoId: number) => {
        setLoading(true);
        setError(null);
        try {
            const data = await todoApi.fetchTodoItemById(todoId);
            setTodo(data);
        } catch (error) {
            setError(error instanceof Error ? error.message : `Failed to fetch todo with id: ${todoId}`);
            setTodo(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (id !== null) {
            fetchTodo(id);
        } else {
            setTodo(null);
            setError(null);
            setLoading(false);
        }
    }, [id, fetchTodo]);

    return { 
        todo, 
        loading, 
        error,
        refetch: id !== null ? () => fetchTodo(id) : undefined
    };
};
