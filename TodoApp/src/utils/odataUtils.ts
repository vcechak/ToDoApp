import type { ODataResponse, PagingParams } from "../types";

/**
 * Builds OData query parameters and appends them to the provided URL
 * @param url The URL to append parameters to
 * @param params The paging/OData parameters
 */
export const buildODataQueryParams = (url: URL, params?: PagingParams): void => {
    if (!params) return;
    
    if (params.skip !== undefined) url.searchParams.append('$skip', params.skip.toString());
    if (params.top !== undefined) url.searchParams.append('$top', params.top.toString());
    if (params.count !== undefined) url.searchParams.append('$count', params.count.toString());
    if (params.orderBy) url.searchParams.append('$orderby', params.orderBy);
    if (params.filter) url.searchParams.append('$filter', params.filter);
};

/**
 * Generic function to fetch OData-enabled endpoints with paging support
 * @param baseUrl The base URL for the API
 * @param endpoint The API endpoint (relative to baseUrl)
 * @param params OData query parameters
 * @param errorMessage Custom error message for failed requests
 * @returns Promise resolving to OData response
 */
export const fetchWithOData = async <T>(
    baseUrl: string,
    endpoint: string, 
    params?: PagingParams, 
    errorMessage?: string
): Promise<ODataResponse<T>> => {
    const url = new URL(`${baseUrl}${endpoint}`);
    buildODataQueryParams(url, params);

    const response = await fetch(url.toString());
    if (!response.ok) {
        throw new Error(errorMessage || `Failed to fetch data: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
};