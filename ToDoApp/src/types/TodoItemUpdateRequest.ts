import type { TodoState } from '../enums/TodoState';

export interface TodoItemUpdateRequest {
  description?: string;
  dueDate?: Date;
  state?: TodoState;
}