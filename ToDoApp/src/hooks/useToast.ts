import { useContext } from 'react';
import { ToastContext } from '../contexts/toastContextDefinition';

/**
 * Custom hook for accessing toast notifications functionality
 * @returns Toast context methods for showing different types of notifications
 * @throws Error if used outside of ToastProvider
 */
export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};