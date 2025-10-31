import { useRef } from 'react';
import type { ReactNode } from 'react';
import { Toast } from 'primereact/toast';
import type { ToastMessage } from 'primereact/toast';
import { ToastContext } from './toastContextDefinition';

/**
 * Provider component that manages toast notifications throughout the application
 * @param children - React child components that will have access to toast functionality
 */
export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const toast = useRef<Toast>(null);

    const showToast = (message: ToastMessage) => {
        toast.current?.show(message);
    };

    const showError = (detail: string, summary: string = 'Error') => {
        toast.current?.show({
            severity: 'error',
            summary,
            detail,
            life: 5000
        });
    };

    const showSuccess = (detail: string, summary: string = 'Success') => {
        toast.current?.show({
            severity: 'success',
            summary,
            detail,
            life: 3000
        });
    };

    const showInfo = (detail: string, summary: string = 'Info') => {
        toast.current?.show({
            severity: 'info',
            summary,
            detail,
            life: 3000
        });
    };

    const showWarn = (detail: string, summary: string = 'Warning') => {
        toast.current?.show({
            severity: 'warn',
            summary,
            detail,
            life: 4000
        });
    };

    return (
        <ToastContext.Provider value={{ showToast, showError, showSuccess, showInfo, showWarn }}>
            <Toast ref={toast} />
            {children}
        </ToastContext.Provider>
    );
};
