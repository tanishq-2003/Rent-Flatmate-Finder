"use client";

import React, { useState } from 'react';
import { Input } from '../../../components/ui/Input';
import { useAuth } from '../../../context/AuthContext';
import { Home } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'TENANT' | 'OWNER'>('TENANT');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await register({ email, password, name, role });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to register');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div className="glow glow-top" />
      <div className="glow glow-bottom" />
      
      <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '3rem 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <Link href="/" className="logo">
            <Home className="text-primary" size={32} />
            <span style={{ fontSize: '1.75rem' }}>FlatMatch</span>
          </Link>
        </div>

        <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Create an Account</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Join the premium community of verified renters
        </p>

        {error && (
          <div style={{ background: 'rgba(236, 72, 153, 0.1)', color: 'var(--accent)', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid rgba(236, 72, 153, 0.3)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Role Selection Toggle */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
            <button
              type="button"
              onClick={() => setRole('TENANT')}
              style={{
                flex: 1,
                padding: '1rem',
                borderRadius: '16px',
                border: role === 'TENANT' ? '2px solid var(--primary)' : '1px solid var(--border)',
                background: role === 'TENANT' ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                color: role === 'TENANT' ? 'white' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>I'm a Tenant</div>
              <div style={{ fontSize: '0.75rem' }}>Looking for a room</div>
            </button>
            <button
              type="button"
              onClick={() => setRole('OWNER')}
              style={{
                flex: 1,
                padding: '1rem',
                borderRadius: '16px',
                border: role === 'OWNER' ? '2px solid var(--primary)' : '1px solid var(--border)',
                background: role === 'OWNER' ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                color: role === 'OWNER' ? 'white' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>I'm an Owner</div>
              <div style={{ fontSize: '0.75rem' }}>Have a room to rent</div>
            </button>
          </div>

          <Input 
            label="Full Name" 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            required
          />
          <Input 
            label="Email Address" 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
          <Input 
            label="Password" 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            minLength={6}
          />

          <button 
            type="submit" 
            className="btn-primary" 
            style={{ width: '100%', justifyContent: 'center', marginTop: '1rem', padding: '1rem' }}
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-secondary)' }}>
          Already have an account? <Link href="/login" className="text-gradient" style={{ fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
