import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem', width: '100%' }}>
      <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
        {label}
      </label>
      <input
        className={`glass-panel ${className}`}
        style={{
          padding: '0.75rem 1rem',
          fontSize: '1rem',
          color: 'var(--text-primary)',
          outline: 'none',
          transition: 'border-color 0.2s',
          border: error ? '1px solid var(--accent)' : '1px solid var(--border)',
          background: 'rgba(19, 19, 26, 0.4)',
        }}
        {...props}
      />
      {error && <span style={{ fontSize: '0.75rem', color: 'var(--accent)' }}>{error}</span>}
    </div>
  );
};
