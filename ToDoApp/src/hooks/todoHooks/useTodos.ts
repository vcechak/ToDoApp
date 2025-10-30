import { useCallback, useEffect, useState } from "react";
import type { TodoItemSummaryResponse } from "../../types";
import { todoApi } from "../../api/todoApi";

export const useTodos = () => {
    const [todos, setTodos] = useState<TodoItemSummaryResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTodos = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await todoApi.fetchTodoItemsSummary();
            setTodos(data);
        } catch (error) {
            setError(error instanceof Error ? error.message : "Failed to fetch todos");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTodos();
    }, [fetchTodos]);

    return { 
        todos, 
        loading, 
        error,
        refetch: fetchTodos
    };
};
