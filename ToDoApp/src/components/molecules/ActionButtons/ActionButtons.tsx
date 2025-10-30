import React from "react";
import { Button } from "primereact/button";
import "./ActionButtons.css";

interface ActionButtonsProps<T = any> {
  rowData: T;
  onView?: (rowData: T) => void;
  onDelete?: (rowData: T) => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ 
  rowData, 
  onView, 
  onDelete 
}) => {
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