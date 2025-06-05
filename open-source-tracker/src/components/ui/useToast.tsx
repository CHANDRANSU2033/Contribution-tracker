'use client'
import React, { createContext, useContext, useState, ReactNode } from 'react';

type ToastVariant = 'default' | 'destructive' | 'success';

type ToastProps = {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
};

type Toast = {
  id: number;
  title: string;
  description?: string;
  variant: ToastVariant;
};

type ToastContextType = {
  toasts: Toast[];
  toast: (props: ToastProps) => void;
  dismiss: (id: number) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = ({ title, description, variant = 'default', duration = 3000 }: ToastProps) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, title, description, variant }]);
    setTimeout(() => dismiss(id), duration);
  };

  const dismiss = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999 }}>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            style={{
              marginBottom: 8,
              padding: '12px 20px',
              borderRadius: 4,
              background: toast.variant === 'destructive' ? '#f87171' : toast.variant === 'success' ? '#4ade80' : '#60a5fa',
              color: '#fff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              minWidth: 300,
            }}
          >
            <div style={{ fontWeight: 600 }}>{toast.title}</div>
            {toast.description && <div style={{ marginTop: 2 }}>{toast.description}</div>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};