import type { TodoState } from '../enums/todoState';

export interface TodoItemResponse {
  id: number;
  name: string;
  description?: string;
  dueDate: Date;
  state: TodoState;
  createdOn: Date;
  updatedOn?: Date;
}