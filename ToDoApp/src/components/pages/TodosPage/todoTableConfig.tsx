import type { TodoItemSummaryResponse } from "../../../types/todoItemSummaryResponse";
import type { ColumnConfig } from "../../../types/TableTypes";
import { TodoState } from "../../../enums/todoState";
import { renderStateTag } from "../../../utils/StateRenderer";

/**
 * Renders the due date for todo items with overdue styling
 * @param rowData - The todo item summary containing the due date
 * @returns JSX element with formatted date or null if no due date
 */
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

/**
 * Configuration for todo table columns including field mappings, headers, and rendering functions
 */
export const todoTableColumns: ColumnConfig<TodoItemSummaryResponse>[] = [
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