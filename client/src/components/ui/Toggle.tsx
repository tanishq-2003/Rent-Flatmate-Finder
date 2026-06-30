import React from 'react';

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
}

export const Toggle: React.FC<ToggleProps> = ({ label, checked, onChange, description }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'rgba(19, 19, 26, 0.4)', borderRadius: '12px', border: '1px solid var(--border)', marginBottom: '1rem' }}>
      <div>
        <div style={{ fontWeight: 500 }}>{label}</div>
        {description && <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{description}</div>}
      </div>
      
      <button
        type="button"
        onClick={() => onChange(!checked)}
        style={{
          width: '48px',
          height: '24px',
          borderRadius: '999px',
          background: checked ? 'var(--primary)' : 'rgba(255, 255, 255, 0.1)',
          border: 'none',
          position: 'relative',
          cursor: 'pointer',
          transition: 'background 0.2s',
        }}
      >
        <div
          style={{
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            background: 'white',
            position: 'absolute',
            top: '3px',
            left: checked ? '27px' : '3px',
            transition: 'left 0.2s',
          }}
        />
      </button>
    </div>
  );
};
