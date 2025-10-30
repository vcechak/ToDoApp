import { createContext } from 'react';
import type { ToastMessage } from 'primereact/toast';

export interface ToastContextType {
    showToast: (message: ToastMessage) => void;
    showError: (detail: string, summary?: string) => void;
    showSuccess: (detail: string, summary?: string) => void;
    showInfo: (detail: string, summary?: string) => void;
    showWarn: (detail: string, summary?: string) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);