"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../lib/api';
import Link from 'next/link';
import { User, Check, X, MessageCircle } from 'lucide-react';

export default function ConnectionsPage() {
  const { user } = useAuth();
  const [interests, setInterests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchInterests = async () => {
    try {
      const res = await api.get('/interests/me');
      setInterests(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInterests();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/interests/${id}/status`, { status });
      fetchInterests(); // Refresh
    } catch (err) {
      alert('Failed to update status');
    }
  };

  return (
    <div style={{ minHeight: '100vh', padding: '6rem 2rem 2rem' }}>
      <div className="container">
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Your Connections</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem' }}>
          {user?.role === 'OWNER' ? 'Manage requests from potential tenants.' : 'Track the status of your apartment applications.'}
        </p>

        <div style={{ display: 'grid', gap: '1rem' }}>
          {isLoading ? (
            <div>Loading connections...</div>
          ) : interests.length > 0 ? (
            interests.map((interest: any) => (
              <div key={interest.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--surface-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={24} color="var(--primary)" />
                  </div>
                  <div>
                    <h3 style={{ margin: 0 }}>
                      {user?.role === 'OWNER' ? interest.tenant.profile?.name : interest.listing.title}
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', margin: '0.25rem 0 0', fontSize: '0.875rem' }}>
                      Status: <span style={{ color: interest.status === 'ACCEPTED' ? 'var(--primary)' : interest.status === 'REJECTED' ? 'var(--accent)' : 'orange' }}>{interest.status}</span>
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {user?.role === 'OWNER' && interest.status === 'PENDING' && (
                    <>
                      <button className="btn-outline" onClick={() => handleUpdateStatus(interest.id, 'REJECTED')} style={{ padding: '0.5rem', borderColor: 'var(--accent)', color: 'var(--accent)' }}>
                        <X size={20} />
                      </button>
                      <button className="btn-primary" onClick={() => handleUpdateStatus(interest.id, 'ACCEPTED')} style={{ padding: '0.5rem' }}>
                        <Check size={20} />
                      </button>
                    </>
                  )}

                  {interest.status === 'ACCEPTED' && interest.chatId && (
                    <Link href={`/chat/${interest.chatId}`} className="btn-primary" style={{ padding: '0.5rem 1rem' }}>
                      <MessageCircle size={18} />
                      Open Chat
                    </Link>
                  )}
                </div>

              </div>
            ))
          ) : (
            <div style={{ padding: '4rem', textAlign: 'center', background: 'var(--surface)', borderRadius: '24px', color: 'var(--text-secondary)' }}>
              No connections found yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
