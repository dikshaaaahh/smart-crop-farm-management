import React from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function Toast({ toasts, onClose }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((t) => {
        const isError = t.type === 'error';
        return (
          <div key={t.id} className={`toast ${isError ? 'toast-error' : ''}`}>
            {isError ? (
              <AlertCircle size={20} color="#ef4444" />
            ) : (
              <CheckCircle2 size={20} color="#16a34a" />
            )}
            <div style={{ flex: 1, fontSize: '0.88rem' }}>{t.message}</div>
            <button
              onClick={() => onClose(t.id)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
