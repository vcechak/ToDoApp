import { useCallback, useState } from "react";
import { todoApi } from "../../api/todoApi";

type DeleteResult = {
    success: boolean;
    cancelled: boolean;
};

export const useDeleteTodo = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const deleteTodo = useCallback(async (
        id: number, 
        confirmFunction?: () => Promise<boolean>
    ): Promise<DeleteResult> => {
        if (confirmFunction) {
            const confirmed = await confirmFunction();
            if (!confirmed) {
                return { success: false, cancelled: true };
            }
        }

        setLoading(true);
        setError(null);
        try {
            await todoApi.deleteTodoItem(id);
            return { success: true, cancelled: false };
        } catch (error) {
            setError(error instanceof Error ? error.message : "Failed to delete todo");
            return { success: false, cancelled: false };
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
