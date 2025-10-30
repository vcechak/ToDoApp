import type { TodoState } from '../enums/todoState';

export interface TodoItemCreateRequest {
  name: string;
  description?: string;
  dueDate?: Date;
  state: TodoState;
}