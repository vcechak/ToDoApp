export const TodoState = {
  New: 0,
  InProgress: 1,
  Completed: 2,
  Cancelled: 3
} as const;

export type TodoState = typeof TodoState[keyof typeof TodoState];

/**
 * Converts a numeric todo state to its human-readable text representation
 * @param state - The numeric todo state value
 * @returns The text representation of the todo state
 */
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

/**
 * Maps a numeric todo state to its corresponding UI severity level for styling
 * @param state - The numeric todo state value
 * @returns The severity string used for component styling
 */
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
