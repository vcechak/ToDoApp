export const TodoState = {
  New: 0,
  InProgress: 1,
  Completed: 2,
  Cancelled: 3
} as const;

export type TodoState = typeof TodoState[keyof typeof TodoState];

export const getTodoStateText = (state: number): string => {
  switch (state) {
    case TodoState.New:
      return 'New';
    case TodoState.InProgress:
      return 'In Progress';
    case TodoState.Completed:
      return 'Completed';
    case TodoState.Cancelled:
      return 'Cancelled';
    default:
      return 'Unknown';
  }
};

export const getStateSeverity = (state: number) => {
      switch (state) {
        case TodoState.New:
          return 'info';
        case TodoState.InProgress:
          return 'warning';
        case TodoState.Completed:
          return 'success';
        case TodoState.Cancelled:
          return 'secondary';
        default:
          return 'secondary';
      }
    };
