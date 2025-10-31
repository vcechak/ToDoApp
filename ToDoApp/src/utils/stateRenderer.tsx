import { Tag } from "primereact/tag";
import { getTodoStateText, getStateSeverity } from "../enums/todoState";
import type { TodoItemSummaryResponse } from "../types/todoItemSummaryResponse";

/**
 * Renders a styled tag component for displaying todo item state
 * @param rowData - The todo item summary data containing the state
 * @returns JSX element representing the state as a colored tag
 */
export const renderStateTag = (rowData: TodoItemSummaryResponse) => {
  return (
    <Tag 
      value={getTodoStateText(rowData.state)} 
      severity={getStateSeverity(rowData.state)}
      style={{ minWidth: '80px', textAlign: 'center' }}
    />
  );
};