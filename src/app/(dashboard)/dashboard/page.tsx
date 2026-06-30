"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { ListingCard } from '../../../components/ListingCard';
import api from '../../../lib/api';
import Link from 'next/link';
import { Plus, Search, SlidersHorizontal } from 'lucide-react';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [listings, setListings] = useState([]);
  const [isLoadingListings, setIsLoadingListings] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await api.get('/listings');
        setListings(res.data.data);
      } catch (err) {
        console.error('Failed to fetch listings:', err);
      } finally {
        setIsLoadingListings(false);
      }
    };

    fetchListings();
  }, []);

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;

  return (
    <div style={{ minHeight: '100vh', padding: '6rem 2rem 2rem' }}>
      <div className="glow glow-top" style={{ opacity: 0.1 }} />
      
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
              Welcome back, <span className="text-gradient">{user?.profile?.name?.split(' ')[0] || 'Friend'}</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              {user?.role === 'OWNER' 
                ? 'Manage your properties and find the perfect tenants.' 
                : 'Here are the best rooms matching your lifestyle.'}
            </p>
          </div>

          {user?.role === 'OWNER' && (
            <Link href="/listings/create" className="btn-primary">
              <Plus size={20} />
              Post a Room
            </Link>
          )}
        </div>

        {/* Filters Bar */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
          <div className="glass-panel" style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0.5rem 1rem', borderRadius: '999px' }}>
            <Search size={20} color="var(--text-secondary)" style={{ marginRight: '0.5rem' }} />
            <input 
              type="text" 
              placeholder="Search by city, neighborhood, or keywords..." 
              style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none' }}
            />
          </div>
          <button className="btn-outline" style={{ borderRadius: '999px' }}>
            <SlidersHorizontal size={20} />
            Filters
          </button>
        </div>

        {/* Feed */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
          {isLoadingListings ? (
            <div style={{ color: 'var(--text-secondary)' }}>Loading rooms...</div>
          ) : listings.length > 0 ? (
            listings.map((listing: any) => (
              <ListingCard 
                key={listing.id} 
                listing={listing} 
                compatibilityScore={listing.compatibilityScore}
              />
            ))
          ) : (
            <div style={{ color: 'var(--text-secondary)', gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', background: 'var(--surface)', borderRadius: '24px', border: '1px solid var(--border)' }}>
              <h3 style={{ marginBottom: '0.5rem' }}>No rooms found</h3>
              <p>Try adjusting your filters or checking back later.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
