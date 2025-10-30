import React, { useState } from 'react';
import { Table } from '../../organisms/Table/Table';
import { Button } from "primereact/button";
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { useToast } from "../../../hooks/useToast";
import { useTodos } from "../../../hooks/todoHooks/useTodos";
import { useCreateTodo } from "../../../hooks/todoHooks/useCreateTodo";
import { useUpdateTodo } from "../../../hooks/todoHooks/useUpdateTodo";
import { useTodoById } from "../../../hooks/todoHooks/useTodoById";
import type { TodoItemSummaryResponse } from "../../../types/todoItemSummaryResponse";
import type { TodoItemCreateRequest } from "../../../types/todoItemCreateRequest";
import type { TodoItemUpdateRequest } from "../../../types/todoItemUpdateRequest";
import { ActionButtons } from "../../molecules/ActionButtons/ActionButtons";
import { todoTableColumns } from "./TodoTableConfig";
import TodoDetailsModal from "../../organisms/TodoDetailsModal/TodoDetailsModal";
import "./TodosPage.css";
import { useDeleteTodo } from '../../../hooks';

const TodosPage: React.FC = () => {
    const { showSuccess, showError } = useToast();
    const { todos, loading, error, refetch } = useTodos();
    const { deleteTodo } = useDeleteTodo();
    const { createTodo, loading: createLoading } = useCreateTodo();
    const { updateTodo, loading: updateLoading } = useUpdateTodo();
    
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'view' | 'edit'>('create');
    const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);
    
    const { todo: selectedTodo, loading: todoLoading } = useTodoById(selectedTodoId);

    const handleCreateNew = () => {
        setModalMode('create');
        setSelectedTodoId(null);
        setModalVisible(true);
    };

    const handleView = (rowData: TodoItemSummaryResponse) => {
        if (!rowData.id) return;
        setModalMode('view');
        setSelectedTodoId(rowData.id);
        setModalVisible(true);
    };

    const handleEditFromView = () => {
        setModalMode('edit');
    };

    const handleDelete = async (rowData: TodoItemSummaryResponse) => {
        if (!rowData.id) return;
        
        const confirmDelete = (): Promise<boolean> => {
            return new Promise((resolve) => {
                confirmDialog({
                    message: `Are you sure you want to delete todo "${rowData.name}"?`,
                    header: 'Delete Confirmation',
                    icon: 'pi pi-exclamation-triangle',
                    defaultFocus: 'reject',
                    acceptClassName: 'p-button-danger',
                    accept: () => resolve(true),
                    reject: () => resolve(false)
                });
            });
        };
        
        try {
            const result = await deleteTodo(rowData.id, confirmDelete);
            if (result.success) {
                showSuccess(`Todo "${rowData.name}" deleted successfully`);
                refetch();
            } else if (!result.cancelled) {
                showError(`Failed to delete todo "${rowData.name}"`);
            }
        } catch (error) {
            showError(`Error deleting todo: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    const handleModalSave = async (data: TodoItemCreateRequest | TodoItemUpdateRequest) => {
        try {
            if (modalMode === 'create') {
                const result = await createTodo(data as TodoItemCreateRequest);
                if (result) {
                    showSuccess("Todo created successfully");
                    refetch();
                } else {
                    showError("Failed to create todo");
                }
            } else if (modalMode === 'edit' && selectedTodoId) {
                const result = await updateTodo(selectedTodoId, data as TodoItemUpdateRequest);
                if (result) {
                    showSuccess("Todo updated successfully");
                    refetch();
                } else {
                    showError("Failed to update todo");
                }
            }
        } catch (error) {
            showError(`Error saving todo: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    const handleModalHide = () => {
        setModalVisible(false);
        setSelectedTodoId(null);
    };

    const getModalConfig = () => {
        if (modalMode === 'create') {
            return { mode: 'create' as const };
        }
        if (selectedTodo) {
            return { 
                mode: modalMode as 'view' | 'edit', 
                data: selectedTodo 
            };
        }
        return { mode: 'create' as const };
    };

    const ConfiguredActionButtons = (props: { rowData: TodoItemSummaryResponse }) => (
        <ActionButtons 
            {...props} 
            onView={handleView}
            onDelete={handleDelete} 
        />
    );

    return (
        <div className="todos-page">
            <div className="page-header">
                <h1>Todo list</h1>
                <Button
                    label="Create New Todo"
                    icon="pi pi-plus"
                    className="p-button-success"
                    onClick={handleCreateNew}
                />
            </div>
                        
            <Table<TodoItemSummaryResponse>
                data={todos}
                columns={todoTableColumns}
                loading={loading}
                error={error}
                showActions={true}
                ActionButtonsComponent={ConfiguredActionButtons}
            />

            <TodoDetailsModal
                visible={modalVisible}
                onHide={handleModalHide}
                modalConfig={getModalConfig()}
                onSave={handleModalSave}
                onEdit={handleEditFromView}
                loading={createLoading || updateLoading || todoLoading}
            />
            <ConfirmDialog />
        </div>
    );
};

export default TodosPage;
