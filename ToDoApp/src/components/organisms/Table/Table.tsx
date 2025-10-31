import React from "react";
import { DataTable } from "primereact/datatable";
import type { DataTableStateEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import { useToast } from "../../../hooks/useToast";
import type { TableProps } from "../../../types/TableTypes";
import "./Table.css";

export const Table = <T extends Record<string, unknown>>({ 
  data, 
  columns,
  loading = false, 
  error,
  showActions = false,
  ActionButtonsComponent,
  pagingInfo,
  onPageChange,
  onSortChange,
  sortField,
  sortOrder,
  paginator = false
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

  const handlePageChange = (event: DataTableStateEvent) => {
    if (onPageChange && event.page !== undefined) {
      onPageChange(event.page, event.rows);
    }
  };

  const handleSortChange = (event: DataTableStateEvent) => {
    if (onSortChange && event.sortField) {
      const order = event.sortOrder === 1 ? 'asc' : event.sortOrder === -1 ? 'desc' : null;
      onSortChange(event.sortField, order);
    }
  };

  return (
    <div className="table-container">
      <DataTable
        value={data || []}
        loading={loading}
        emptyMessage="No items found"
        className="data-table"
        scrollable
        scrollHeight="flex"
        paginator={paginator}
        lazy={paginator}
        first={pagingInfo?.currentPage ? pagingInfo.currentPage * pagingInfo.pageSize : 0}
        rows={pagingInfo?.pageSize || 10}
        totalRecords={pagingInfo?.totalRecords || 0}
        onPage={handlePageChange}
        onSort={handleSortChange}
        sortField={sortField}
        sortOrder={sortOrder === 'asc' ? 1 : sortOrder === 'desc' ? -1 : 0}
        rowsPerPageOptions={[5, 10, 20, 50]}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
      >
        {columns.map((column, index) => (
          <Column
            key={index}
            field={column.field}
            header={column.header}
            body={column.body ? column.body : (rowData) => rowData[column.field] || ''}
            sortable={column.sortable}
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

