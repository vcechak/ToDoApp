export interface ODataResponse<T> {
    value: T[];
    '@odata.count': number;
}

export interface PagingParams {
    skip?: number;
    top?: number;
    count?: boolean;
    filter?: string;
    orderBy?: string;
}

export interface PagingInfo {
    currentPage: number;
    pageSize: number;
    totalRecords: number;
    totalPages: number;
}