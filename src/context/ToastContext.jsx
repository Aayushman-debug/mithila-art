import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', ttl = 4000) => {
    const id = Date.now() + Math.random().toString(36).slice(2, 9);
    setToasts((t) => [...t, { id, message, type }]);
    // auto-dismiss
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, ttl);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <div className="fixed right-4 bottom-6 z-50 flex flex-col gap-3">
        {toasts.map((t) => (
          <div key={t.id} className={`max-w-sm w-full px-4 py-3 rounded-xl shadow-lg ring-1 ring-black/5 transform-gpu transition-all duration-200 ${t.type === 'error' ? 'bg-mithila-red/95 text-white' : t.type === 'success' ? 'bg-mithila-green/95 text-white' : 'bg-white text-warm-gray-800'}`}>
            <div className="flex items-start gap-3">
              <div className="flex-1 text-sm break-words">{t.message}</div>
              <button onClick={() => removeToast(t.id)} className="text-xs opacity-80">✕</button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx.showToast;
}

export default ToastContext;
