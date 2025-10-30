import type { TodoState } from '../enums/todoState';

export interface TodoItemResponse extends Record<string, unknown> {
  id: number;
  name: string;
  description?: string;
  dueDate: Date;
  state: TodoState;
  createdOn: Date;
  updatedOn?: Date;
}