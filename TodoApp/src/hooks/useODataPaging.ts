import { useCallback, useEffect, useState } from "react";
import type { ODataResponse, PagingParams, PagingInfo } from "../types";

export interface UseODataPagingParams {
    pageSize?: number;
    page?: number;
    sortField?: string;
    sortOrder?: 'asc' | 'desc' | null;
    filters?: Record<string, string | number | boolean | null>;
}

export interface UseODataPagingResult<T> {
    data: T[];
    loading: boolean;
    error: string | null;
    pagingInfo: PagingInfo;
    refetch: () => void;
}

/**
 * Converts UseODataPagingParams to OData PagingParams
 */
const buildODataParams = (params?: UseODataPagingParams): PagingParams => {
    if (!params) {
        return { count: true, top: 10, skip: 0 };
    }

    return {
        count: true,
        top: params.pageSize || 10,
        skip: ((params.page || 0) * (params.pageSize || 10)),
        orderBy: params.sortField && params.sortOrder 
            ? `${params.sortField} ${params.sortOrder}` 
            : undefined,
    };
};

/**
 * Generic reusable hook for OData paging functionality
 * @param fetchFunction Function that takes PagingParams and returns ODataResponse
 * @param params Paging parameters
 * @returns Data, loading state, error, paging info, and refetch function
 */
export const useODataPaging = <T>(
    fetchFunction: (params: PagingParams) => Promise<ODataResponse<T>>,
    params?: UseODataPagingParams
): UseODataPagingResult<T> => {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [pagingInfo, setPagingInfo] = useState<PagingInfo>({
        currentPage: 0,
        pageSize: params?.pageSize || 10,
        totalRecords: 0,
        totalPages: 0
    });

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            const queryParams = buildODataParams(params);
            const response = await fetchFunction(queryParams);
            
            setData(response.value);
            
            // Update pagination info with total count from server
            const totalRecords = response['@odata.count'] || 0;
            const pageSize = params?.pageSize || 10;
            setPagingInfo({
                currentPage: params?.page || 0,
                pageSize,
                totalRecords,
                totalPages: Math.ceil(totalRecords / pageSize)
            });
        } catch (error) {
            setError(error instanceof Error ? error.message : "Failed to fetch data");
        } finally {
            setLoading(false);
        }
    }, [fetchFunction, params?.pageSize, params?.page, params?.sortField, params?.sortOrder, params?.filters]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { 
        data, 
        loading, 
        error,
        pagingInfo,
        refetch: fetchData
    };
};