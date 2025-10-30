import type { TodoState } from '../enums/todoState';

export interface TodoItemSummaryResponse extends Record<string, unknown> {
  id: number;
  name: string;
  dueDate: string | null;
  state: TodoState;
}