import { useCallback } from "react";
import type { TodoItemSummaryResponse, PagingParams } from "../../types";
import { todoApi } from "../../api/todoApi";
import { useODataPaging, type UseODataPagingParams } from "../useODataPaging";

/**
 * Custom hook for fetching and managing paginated todo items with OData support
 * @param params - Optional OData paging parameters for filtering, sorting, and pagination
 * @returns Object containing todos data, loading state, error state, paging info, and refetch function
 */
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
