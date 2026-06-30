import React from 'react';
import { MapPin, User, CheckCircle, Flame } from 'lucide-react';

interface ListingProps {
  listing: any;
  compatibilityScore?: number;
}

export const ListingCard: React.FC<ListingProps> = ({ listing, compatibilityScore }) => {
  return (
    <div className="glass-panel" style={{ overflow: 'hidden', transition: 'transform 0.3s ease', cursor: 'pointer' }}>
      {/* Image Placeholder */}
      <div style={{ height: '200px', background: 'var(--surface-hover)', position: 'relative' }}>
        <img 
          src={listing.images?.[0]?.url || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800'} 
          alt="Room" 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {compatibilityScore && (
          <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(10, 10, 15, 0.8)', backdropFilter: 'blur(8px)', padding: '0.25rem 0.75rem', borderRadius: '999px', display: 'flex', alignItems: 'center', gap: '0.25rem', border: '1px solid var(--primary)', color: 'var(--primary)', fontWeight: 600 }}>
            <Flame size={16} />
            {compatibilityScore}% Match
          </div>
        )}
      </div>

      <div style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', margin: 0 }}>{listing.title}</h3>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)' }}>${listing.rent}<span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>/mo</span></div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.875rem' }}>
          <MapPin size={14} />
          {listing.location}, {listing.city}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <span style={{ padding: '0.25rem 0.5rem', background: 'var(--surface-hover)', borderRadius: '6px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            {listing.roomType.replace('_', ' ')}
          </span>
          <span style={{ padding: '0.25rem 0.5rem', background: 'var(--surface-hover)', borderRadius: '6px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            {listing.genderPreference} ONLY
          </span>
          {listing.furnished && (
            <span style={{ padding: '0.25rem 0.5rem', background: 'var(--surface-hover)', borderRadius: '6px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Furnished
            </span>
          )}
        </div>

        <button 
          className="btn-primary" 
          style={{ width: '100%', justifyContent: 'center' }}
          onClick={async (e) => {
            e.stopPropagation();
            try {
              const { default: api } = await import('../lib/api');
              await api.post('/interests', { listingId: listing.id, message: 'Hi! I am very interested in this room.' });
              alert('Interest sent successfully! The owner will be notified.');
            } catch (err: any) {
              alert(err.response?.data?.message || 'Failed to send interest.');
            }
          }}
        >
          Express Interest
        </button>
      </div>
    </div>
  );
};
