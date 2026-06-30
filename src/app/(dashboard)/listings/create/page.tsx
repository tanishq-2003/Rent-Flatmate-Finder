"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '../../../../components/ui/Input';
import { Select } from '../../../../components/ui/Select';
import { Textarea } from '../../../../components/ui/Textarea';
import { Toggle } from '../../../../components/ui/Toggle';
import api from '../../../../lib/api';

export default function CreateListingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    city: '',
    state: '',
    country: '',
    rent: '',
    deposit: '',
    roomType: 'PRIVATE',
    availableDate: '',
    genderPreference: 'ANY',
    smokingAllowed: false,
    petsAllowed: false,
    wifi: false,
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      let uploadedImageUrl = null;
      
      // Upload image first if selected
      if (selectedFile) {
        const formData = new FormData();
        formData.append('image', selectedFile);
        
        const uploadRes = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        uploadedImageUrl = uploadRes.data.data.url;
      }

      const payload = {
        ...formData,
        rent: parseInt(formData.rent),
        deposit: parseInt(formData.deposit),
        availableDate: new Date(formData.availableDate).toISOString(),
        images: uploadedImageUrl ? [uploadedImageUrl] : []
      };

      await api.post('/listings', payload);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create listing');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', padding: '6rem 2rem 2rem', display: 'flex', justifyContent: 'center' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '800px', padding: '3rem 2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Post a Room</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem' }}>
          Fill in the details below to list your property and find the perfect tenant.
        </p>

        {error && (
          <div style={{ background: 'rgba(236, 72, 153, 0.1)', color: 'var(--accent)', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid rgba(236, 72, 153, 0.3)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <Input 
                label="Listing Title" 
                placeholder="e.g. Spacious Master Bedroom in Downtown"
                value={formData.title}
                onChange={e => handleChange('title', e.target.value)}
                required
              />
            </div>

            <Input 
              label="Monthly Rent ($)" 
              type="number"
              value={formData.rent}
              onChange={e => handleChange('rent', e.target.value)}
              required
            />
            <Input 
              label="Security Deposit ($)" 
              type="number"
              value={formData.deposit}
              onChange={e => handleChange('deposit', e.target.value)}
              required
            />

            <Select 
              label="Room Type"
              value={formData.roomType}
              onChange={e => handleChange('roomType', e.target.value)}
              options={[
                { value: 'PRIVATE', label: 'Private Room' },
                { value: 'SHARED', label: 'Shared Room' },
                { value: 'ENTIRE_APARTMENT', label: 'Entire Apartment' }
              ]}
              required
            />
            <Input 
              label="Available From" 
              type="date"
              value={formData.availableDate}
              onChange={e => handleChange('availableDate', e.target.value)}
              required
            />

            <div style={{ gridColumn: '1 / -1' }}>
              <Input 
                label="Street Address / Location" 
                value={formData.location}
                onChange={e => handleChange('location', e.target.value)}
                required
              />
            </div>

            <Input label="City" value={formData.city} onChange={e => handleChange('city', e.target.value)} required />
            <Input label="State" value={formData.state} onChange={e => handleChange('state', e.target.value)} required />
            <Input label="Country" value={formData.country} onChange={e => handleChange('country', e.target.value)} required />

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Upload Room Photo (Optional)</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={handleFileChange}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '1rem',
                  background: 'rgba(19, 19, 26, 0.4)',
                  border: '1px dashed var(--border)',
                  borderRadius: '12px',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <Textarea 
                label="Description" 
                placeholder="Describe the flat, the vibe, and what you're looking for..."
                value={formData.description}
                onChange={e => handleChange('description', e.target.value)}
                required
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <h3 style={{ margin: '2rem 0 1rem' }}>Rules & Amenities</h3>
              <Select 
                label="Gender Preference"
                value={formData.genderPreference}
                onChange={e => handleChange('genderPreference', e.target.value)}
                options={[
                  { value: 'ANY', label: 'Any' },
                  { value: 'MALE', label: 'Male Only' },
                  { value: 'FEMALE', label: 'Female Only' }
                ]}
              />
              <Toggle label="Smoking Allowed" checked={formData.smokingAllowed} onChange={val => handleChange('smokingAllowed', val)} />
              <Toggle label="Pets Allowed" checked={formData.petsAllowed} onChange={val => handleChange('petsAllowed', val)} />
              <Toggle label="High-Speed WiFi included" checked={formData.wifi} onChange={val => handleChange('wifi', val)} />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '3rem' }}>
            <button type="button" className="btn-outline" onClick={() => router.push('/dashboard')}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? 'Posting...' : 'Post Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
