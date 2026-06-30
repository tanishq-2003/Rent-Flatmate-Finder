"use client";

import React, { useState } from 'react';
import { Input } from '../../../components/ui/Input';
import { useAuth } from '../../../context/AuthContext';
import { Home } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login({ email, password });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div className="glow glow-top" />
      <div className="glow glow-bottom" />
      
      <div className="glass-panel" style={{ width: '100%', maxWidth: '450px', padding: '3rem 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <Link href="/" className="logo">
            <Home className="text-primary" size={32} />
            <span style={{ fontSize: '1.75rem' }}>FlatMatch</span>
          </Link>
        </div>

        <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Welcome Back</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Sign in to find your perfect flatmate
        </p>

        {error && (
          <div style={{ background: 'rgba(236, 72, 153, 0.1)', color: 'var(--accent)', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid rgba(236, 72, 153, 0.3)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
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
          />

          <button 
            type="submit" 
            className="btn-primary" 
            style={{ width: '100%', justifyContent: 'center', marginTop: '1rem', padding: '1rem' }}
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-secondary)' }}>
          Don't have an account? <Link href="/register" className="text-gradient" style={{ fontWeight: 600 }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
}
