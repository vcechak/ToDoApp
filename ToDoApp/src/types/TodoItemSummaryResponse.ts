import type { TodoState } from '../enums/todoState';

export interface TodoItemSummaryResponse {
  id: number;
  name: string;
  dueDate: string | null;
  state: TodoState;
}