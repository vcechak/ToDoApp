import type { TodoState } from '../enums/todoState';

export interface TodoItemUpdateRequest {
  description?: string;
  dueDate?: Date;
  state?: TodoState;
}