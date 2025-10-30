import { useCallback, useState } from "react";
import { todoApi } from "../../api/todoApi";

export const useDeleteTodo = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const deleteTodo = useCallback(async (id: number): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            await todoApi.deleteTodoItem(id);
            return true;
        } catch (error) {
            setError(error instanceof Error ? error.message : "Failed to delete todo");
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    return { 
        deleteTodo, 
        loading, 
        error 
    };
};
