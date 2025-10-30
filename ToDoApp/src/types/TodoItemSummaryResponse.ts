import type { TodoState } from '../enums/TodoState';

export interface TodoItemSummaryResponse {
  id: number;
  name: string;
  dueDate: string | null;
  state: TodoState;
}