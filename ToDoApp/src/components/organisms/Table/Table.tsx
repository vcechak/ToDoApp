import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useToast } from "../../../hooks/useToast";
import type { TableProps } from "../../../types/tableTypes";
import "./Table.css";

export const Table = <T extends Record<string, unknown>>({ 
  data, 
  columns,
  loading = false, 
  error,
  showActions = false,
  ActionButtonsComponent
}: TableProps<T>) => {
  const { showError } = useToast();

  React.useEffect(() => {
    if (error) {
      showError(`Failed to load data: ${error}`);
    }
  }, [error, showError]);

  const actionsBodyTemplate = (rowData: T) => {
    if (!ActionButtonsComponent || !Object.values(rowData).some(Boolean)) return null;
    
    return (
      <ActionButtonsComponent 
        rowData={rowData}
      />
    );
  };

  return (
    <div className="table-container">
      <DataTable
        value={data || []}
        loading={loading}
        emptyMessage="No items found"
        filterDisplay="menu"
        globalFilterFields={columns.map(col => col.field)}
        className="data-table"
        scrollable
        scrollHeight="flex"
      >
        {columns.map((column, index) => (
          <Column
            key={index}
            field={column.field}
            header={column.header}
            body={column.body ? column.body : (rowData) => rowData[column.field] || ''}
            sortable={column.sortable}
            filterPlaceholder={column.filterPlaceholder}
            style={column.style}
          />
        ))}
        
        {showActions && ActionButtonsComponent && (
          <Column
            header="Actions"
            body={actionsBodyTemplate}
            exportable={false}
            style={{ width: '160px'}}
            headerClassName="actions-header"
          />
        )}
      </DataTable>
    </div>
  );
};

