import type { TodoState } from '../enums/TodoState';

export interface TodoItemCreateRequest {
  name: string;
  description?: string;
  dueDate?: Date;
  state: TodoState;
}