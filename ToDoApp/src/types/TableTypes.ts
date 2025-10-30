import React from "react";

export interface ColumnConfig {
  field: string;
  header: string;
  body?: (rowData: any) => React.ReactNode;
  sortable?: boolean;
  filterPlaceholder?: string;
  style?: React.CSSProperties;
}

export interface TableProps {
  data: any[];
  columns: ColumnConfig[];
  loading?: boolean;
  error?: string | null;
  showActions?: boolean;
  ActionButtonsComponent?: React.ComponentType<{
    rowData: any;
  }>;
}