import { Tag } from "primereact/tag";
import { getTodoStateText, getStateSeverity } from "../enums/TodoState";
import type { TodoItemSummaryResponse } from "../types/TodoItemSummaryResponse";

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