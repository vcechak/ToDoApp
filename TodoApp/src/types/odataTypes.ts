/**
 * Standard OData response structure containing data array and optional count
 */
export interface ODataResponse<T> {
    value: T[];
    '@odata.count': number;
}

/**
 * Parameters for OData query operations including pagination, filtering, and sorting
 */
export interface PagingParams {
    skip?: number;
    top?: number;
    count?: boolean;
    filter?: string;
    orderBy?: string;
}

/**
 * Information about current pagination state and total records
 */
export interface PagingInfo {
    currentPage: number;
    pageSize: number;
    totalRecords: number;
    totalPages: number;
}