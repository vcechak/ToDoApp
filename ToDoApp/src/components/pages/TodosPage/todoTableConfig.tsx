import type { TodoItemSummaryResponse } from "../../../types/TodoItemSummaryResponse";
import type { ColumnConfig } from "../../../types/TableTypes";
import { TodoState } from "../../../enums/TodoState";
import { renderStateTag } from "../../../utils/stateRenderer";

export const renderDueDate = (rowData: TodoItemSummaryResponse) => {
  if (!rowData.dueDate || rowData.dueDate === null) {
    return null;
  }
  
  const isOverdue = new Date(rowData.dueDate) < new Date() && rowData.state !== TodoState.Completed;
  return (
    <span className={isOverdue ? 'overdue-date' : ''}>
      {new Date(rowData.dueDate).toLocaleDateString()}
    </span>
  );
};

export const todoTableColumns: ColumnConfig[] = [
  {
    field: "name",
    header: "Task Name",
    body: (rowData: TodoItemSummaryResponse) => rowData.name || '',
    sortable: true,
    style: { minWidth: '200px' }
  },
  {
    field: "dueDate",
    header: "Due Date",
    body: renderDueDate,
    sortable: true,
    style: { width: '150px' }
  },
  {
    field: "state",
    header: "Status",
    body: renderStateTag,
    sortable: true,
    style: { width: '120px' }
  }
];