import { TodoState } from '../enums/TodoState';

export interface TodoItemResponse {
  id: number;
  name: string;
  description?: string;
  dueDate: Date;
  state: TodoState;
  createdOn: Date;
  updatedOn?: Date;
}