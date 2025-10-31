import { Button } from "primereact/button";
import "./ActionButtons.css";

interface ActionButtonsProps<T extends { id: number }> {
  rowData: T;
  onView?: (rowData: T) => void;
  onDelete?: (rowData: T) => void;
}

/**
 * Reusable action buttons component for table rows providing view and delete functionality
 * @param rowData - The data object for the current row (must have an id property)
 * @param onView - Optional callback function for view action
 * @param onDelete - Optional callback function for delete action
 * @returns JSX element containing action buttons or null if no valid id
 */
export const ActionButtons = <T extends { id: number }>({ 
  rowData, 
  onView, 
  onDelete 
}: ActionButtonsProps<T>) => {
  const hasId = rowData && typeof rowData === 'object' && 'id' in rowData;
  if (hasId && !rowData.id) return null;
  
  return (
    <div className="action-buttons">
      {onView && (
        <Button
          icon="pi pi-eye"
          rounded
          outlined
          className="p-button-info"
          onClick={() => onView(rowData)}
          tooltip="View"
          tooltipOptions={{ position: 'top' }}
          size="small"
        />
      )}
      {onDelete && (
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          className="p-button-danger"
          onClick={() => onDelete(rowData)}
          tooltip="Delete"
          tooltipOptions={{ position: 'top' }}
          size="small"
        />
      )}
    </div>
  );
};