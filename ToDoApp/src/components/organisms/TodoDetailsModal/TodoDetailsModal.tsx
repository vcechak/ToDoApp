import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import type { TodoItemCreateRequest } from '../../../types/todoItemCreateRequest';
import type { TodoItemUpdateRequest } from '../../../types/todoItemUpdateRequest';
import type { TodoItemResponse } from '../../../types/todoItemResponse';
import { TodoState, getTodoStateText } from '../../../enums/todoState';
import './TodoDetailsModal.css';

type TodoModalMode = 
  | { mode: 'create'; data?: never }
  | { mode: 'view'; data: TodoItemResponse }
  | { mode: 'edit'; data: TodoItemResponse };

interface TodoDetailsModalProps {
  visible: boolean;
  onHide: () => void;
  modalConfig: TodoModalMode;
  onSave?: (data: TodoItemCreateRequest | TodoItemUpdateRequest) => Promise<void>;
  onEdit?: () => void; 
  loading?: boolean;
}

const TodoDetailsModal: React.FC<TodoDetailsModalProps> = ({
  visible,
  onHide,
  modalConfig,
  onSave,
  onEdit,
  loading = false
}) => {
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    dueDate: Date | null;
    state: number;
  }>({
    name: '',
    description: '',
    dueDate: null,
    state: TodoState.New
  });

  const [originalData, setOriginalData] = useState<{
    description: string;
    dueDate: Date | null;
    state: number;
  } | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (modalConfig.mode === 'view' || modalConfig.mode === 'edit') {
      const { data } = modalConfig;
      const newFormData = {
        name: data.name,
        description: data.description || '',
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        state: data.state
      };
      setFormData(newFormData);
      
      setOriginalData({
        description: data.description || '',
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        state: data.state
      });
    } else {
      setFormData({
        name: '',
        description: '',
        dueDate: null,
        state: TodoState.New
      });
      setOriginalData(null);
    }
    setErrors({});
  }, [modalConfig, visible]);

  const isReadOnly = modalConfig.mode === 'view';
  const isCreate = modalConfig.mode === 'create';

  const stateOptions = Object.entries(TodoState).map(([, value]) => ({
    label: getTodoStateText(value),
    value: value
  }));

  const datesEqual = (date1: Date | null, date2: Date | null): boolean => {
    if (date1 === null && date2 === null) return true;
    if (date1 === null || date2 === null) return false;
    return date1.getTime() === date2.getTime();
  };

  const getChangedFields = (): Partial<TodoItemUpdateRequest> | null => {
    if (!originalData || modalConfig.mode !== 'edit') return null;

    const changes: Partial<TodoItemUpdateRequest> = {};
    let hasChanges = false;

    if (formData.description !== originalData.description) {
      changes.description = formData.description || undefined;
      hasChanges = true;
    }

    if (!datesEqual(formData.dueDate, originalData.dueDate)) {
      changes.dueDate = formData.dueDate || undefined;
      hasChanges = true;
    }

    if (formData.state !== originalData.state) {
      changes.state = formData.state as TodoState;
      hasChanges = true;
    }

    return hasChanges ? changes : null;
  };

  const hasChanges = (): boolean => {
    return getChangedFields() !== null;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (isCreate) {
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
      } else if (formData.name.length > 50) {
        newErrors.name = 'Name must be 50 characters or less';
      }
    }

    if (formData.description.length > 500) {
      newErrors.description = 'Description must be 500 characters or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm() || !onSave) return;

    try {
      if (isCreate) {
        const createData: TodoItemCreateRequest = {
          name: formData.name.trim(),
          description: formData.description.trim() || undefined,
          dueDate: formData.dueDate || undefined,
          state: formData.state as TodoState
        };
        await onSave(createData);
      } else if (modalConfig.mode === 'edit') {
        const changedFields = getChangedFields();
        if (changedFields) {
          const updateData: TodoItemUpdateRequest = {
            description: formData.description.trim() || undefined,
            dueDate: formData.dueDate || undefined,
            state: formData.state as TodoState
          };
          await onSave(updateData);
        } else {
          onHide();
          return;
        }
      }
      onHide();
    } catch (error) {
      console.error('Error saving todo:', error);
    }
  };

  const getTitle = () => {
    const baseTitle = (() => {
      switch (modalConfig.mode) {
        case 'create': return 'Create New Todo';
        case 'view': return 'Todo Details';
        case 'edit': return 'Edit Todo';
      }
    })();
    
    if (modalConfig.mode === 'edit' && hasChanges()) {
      return `${baseTitle} *`;
    }
    
    return baseTitle;
  };

  const getFooter = () => {
    if (isReadOnly) {
      return (
        <div className="todo-modal-footer">
          <Button 
            label="Close" 
            icon="pi pi-times" 
            onClick={onHide} 
            className="p-button-secondary"
          />
          {modalConfig.mode === 'view' && onEdit && (
            <Button 
              label="Edit" 
              icon="pi pi-pencil" 
              onClick={onEdit} 
              className="p-button-warning"
            />
          )}
        </div>
      );
    }

    return (
      <div className="todo-modal-footer">
        <Button 
          label="Cancel" 
          icon="pi pi-times" 
          onClick={onHide} 
          className="p-button-text"
          disabled={loading}
        />
        <Button 
          label={isCreate ? "Create" : "Update"} 
          icon="pi pi-check" 
          onClick={handleSave}
          disabled={loading || (modalConfig.mode === 'edit' && !hasChanges())}
          loading={loading}
          tooltip={modalConfig.mode === 'edit' && !hasChanges() ? "No changes to save" : undefined}
          tooltipOptions={{ position: 'top' }}
        />
      </div>
    );
  };

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header={getTitle()}
      footer={getFooter()}
      style={{ width: '500px' }}
      modal
      className="todo-details-modal"
    >
      <div className="todo-form">
        <div className="field">
          <label htmlFor="name" className="field-label">
            Name {isCreate && <span className="required">*</span>}
            {modalConfig.mode === 'edit' && <span className="readonly-indicator"> (read-only)</span>}
            {isCreate && <span className="char-count">{formData.name.length}/50</span>}
          </label>
          <InputText
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter todo name"
            disabled={isReadOnly || modalConfig.mode === 'edit'}
            className={errors.name ? 'p-invalid' : ''}
            maxLength={50}
          />
          {errors.name && <Message severity="error" text={errors.name} />}
        </div>

        <div className="field">
          <label htmlFor="description" className="field-label">
            Description
            <span className="char-count">{formData.description.length}/500</span>
          </label>
          <InputTextarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Enter description (optional)"
            disabled={isReadOnly}
            rows={3}
            autoResize
            className={errors.description ? 'p-invalid' : ''}
            maxLength={500}
          />
          {errors.description && <Message severity="error" text={errors.description} />}
        </div>

        <div className="field">
          <label htmlFor="dueDate" className="field-label">Due Date</label>
          <Calendar
            id="dueDate"
            value={formData.dueDate}
            onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.value || null }))}
            placeholder="Select due date (optional)"
            disabled={isReadOnly}
            showIcon
            dateFormat="mm/dd/yy"
            minDate={new Date()}
          />
        </div>

        <div className="field">
          <label htmlFor="state" className="field-label">State</label>
          <Dropdown
            id="state"
            value={formData.state}
            options={stateOptions}
            onChange={(e) => setFormData(prev => ({ ...prev, state: e.value }))}
            placeholder="Select state"
            disabled={isReadOnly || isCreate}
          />
        </div>

        {modalConfig.mode !== 'create' && modalConfig.data && (
          <div className="metadata-section">
            <div className="field">
              <label className="field-label">Created On</label>
              <div className="readonly-value">
                {new Date(modalConfig.data.createdOn).toLocaleString()}
              </div>
            </div>
            {modalConfig.data.updatedOn && (
              <div className="field">
                <label className="field-label">Last Updated</label>
                <div className="readonly-value">
                  {new Date(modalConfig.data.updatedOn).toLocaleString()}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Dialog>
  );
};

export default TodoDetailsModal;