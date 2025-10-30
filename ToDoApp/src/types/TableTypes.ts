import React from "react";

export interface ColumnConfig<T = Record<string, unknown>> {
  field: string;
  header: string;
  body?: (rowData: T) => React.ReactNode;
  sortable?: boolean;
  filterPlaceholder?: string;
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
}