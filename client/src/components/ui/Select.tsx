import React, { SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({ label, error, options, className = '', ...props }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem', width: '100%' }}>
      <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
        {label}
      </label>
      <select
        className={`glass-panel ${className}`}
        style={{
          padding: '0.75rem 1rem',
          fontSize: '1rem',
          color: 'var(--text-primary)',
          outline: 'none',
          transition: 'border-color 0.2s',
          border: error ? '1px solid var(--accent)' : '1px solid var(--border)',
          background: 'rgba(19, 19, 26, 0.4)',
          appearance: 'none',
        }}
        {...props}
      >
        <option value="" disabled>Select an option</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} style={{ background: 'var(--surface)', color: 'var(--text-primary)' }}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span style={{ fontSize: '0.75rem', color: 'var(--accent)' }}>{error}</span>}
    </div>
  );
};
