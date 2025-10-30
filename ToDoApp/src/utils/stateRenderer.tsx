import { Tag } from "primereact/tag";
import { getTodoStateText, getStateSeverity } from "../enums/todoState";
import type { TodoItemSummaryResponse } from "../types/todoItemSummaryResponse";

export const renderStateTag = (rowData: TodoItemSummaryResponse) => {
  if (rowData.state === null || rowData.state === undefined) return '';
  
  return (
    <Tag 
      value={getTodoStateText(rowData.state)} 
      severity={getStateSeverity(rowData.state)}
      style={{ minWidth: '80px', textAlign: 'center' }}
    />
  );
};