import React from "react";
import type { PagingInfo } from "./odataTypes";

export interface ColumnConfig<T = Record<string, unknown>> {
  field: string;
  header: string;
  body?: (rowData: T) => React.ReactNode;
  sortable?: boolean;
  style?: React.CSSProperties;
}

export interface TableProps<T = Record<string, unknown>> {
  data: T[];
  columns: ColumnConfig<T>[];
  loading?: boolean;
  error?: string | null;
  showActions?: boolean;
  ActionButtonsComponent?: React.ComponentType<{
    rowData: T;
  }>;
  pagingInfo?: PagingInfo;
  onPageChange?: (page: number, pageSize: number) => void;
  onSortChange?: (field: string, order: 'asc' | 'desc' | null) => void;
  sortField?: string;
  sortOrder?: 'asc' | 'desc' | null;
  paginator?: boolean;
}