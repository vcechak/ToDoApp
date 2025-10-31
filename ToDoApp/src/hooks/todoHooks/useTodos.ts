import { useCallback } from "react";
import type { TodoItemSummaryResponse, PagingParams } from "../../types";
import { todoApi } from "../../api/todoApi";
import { useODataPaging, type UseODataPagingParams } from "../useODataPaging";

export const useTodos = (params?: UseODataPagingParams) => {
    // Create a stable reference to the fetch function
    const fetchTodos = useCallback(
        (pagingParams: PagingParams) => todoApi.fetchTodoItemsSummary(pagingParams),
        []
    );

    const result = useODataPaging<TodoItemSummaryResponse>(fetchTodos, params);

    return {
        todos: result.data,
        loading: result.loading,
        error: result.error,
        pagingInfo: result.pagingInfo,
        refetch: result.refetch
    };
};
