"use client";

import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Textarea } from '../../../components/ui/Textarea';
import { Toggle } from '../../../components/ui/Toggle';
import api from '../../../lib/api';

export default function OnboardingPage() {
  const { user, login } = useAuth(); // We'll mock a user refresh via Context if needed
  const router = useRouter();
  
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    occupation: '',
    budgetMin: '',
    budgetMax: '',
    smoking: false,
    pets: false,
    bio: '',
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleSubmit = async () => {
    setError('');
    setIsLoading(true);
    try {
      // Clean data for the backend API
      const payload = {
        ...formData,
        age: formData.age ? parseInt(formData.age) : undefined,
        budgetMin: formData.budgetMin ? parseInt(formData.budgetMin) : undefined,
        budgetMax: formData.budgetMax ? parseInt(formData.budgetMax) : undefined,
      };

      await api.put('/profiles/me', payload);
      
      // Navigate to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div className="glow glow-top" />
      <div className="glow glow-bottom" />
      
      <div className="glass-panel" style={{ width: '100%', maxWidth: '600px', padding: '3rem 2rem' }}>
        <h2 style={{ marginBottom: '0.5rem', textAlign: 'center' }}>Complete your profile</h2>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '2rem' }}>
          Step {step} of 3
        </p>

        {/* Progress Bar */}
        <div style={{ width: '100%', height: '6px', background: 'var(--border)', borderRadius: '3px', marginBottom: '2rem', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${(step / 3) * 100}%`, background: 'var(--primary)', transition: 'width 0.3s ease' }} />
        </div>

        {error && (
          <div style={{ background: 'rgba(236, 72, 153, 0.1)', color: 'var(--accent)', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid rgba(236, 72, 153, 0.3)' }}>
            {error}
          </div>
        )}

        {/* Step 1: Personal Details */}
        {step === 1 && (
          <div style={{ animation: 'float 0.5s ease-out' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Personal Details</h3>
            <Input 
              label="Age" 
              type="number" 
              placeholder="e.g. 24" 
              value={formData.age}
              onChange={e => handleChange('age', e.target.value)}
            />
            <Select 
              label="Gender"
              value={formData.gender}
              onChange={e => handleChange('gender', e.target.value)}
              options={[
                { value: 'MALE', label: 'Male' },
                { value: 'FEMALE', label: 'Female' },
                { value: 'ANY', label: 'Prefer not to say / Any' }
              ]}
            />
            <Input 
              label="Occupation" 
              type="text" 
              placeholder="e.g. Software Engineer" 
              value={formData.occupation}
              onChange={e => handleChange('occupation', e.target.value)}
            />
          </div>
        )}

        {/* Step 2: Preferences */}
        {step === 2 && (
          <div>
            <h3 style={{ marginBottom: '1.5rem' }}>Financial & Lifestyle</h3>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Input 
                label="Min Budget ($)" 
                type="number" 
                placeholder="0" 
                value={formData.budgetMin}
                onChange={e => handleChange('budgetMin', e.target.value)}
              />
              <Input 
                label="Max Budget ($)" 
                type="number" 
                placeholder="2000" 
                value={formData.budgetMax}
                onChange={e => handleChange('budgetMax', e.target.value)}
              />
            </div>
            
            <Toggle 
              label="Smoking" 
              description="Are you a smoker?"
              checked={formData.smoking}
              onChange={val => handleChange('smoking', val)}
            />
            
            <Toggle 
              label="Pets" 
              description="Do you have any pets?"
              checked={formData.pets}
              onChange={val => handleChange('pets', val)}
            />
          </div>
        )}

        {/* Step 3: Bio */}
        {step === 3 && (
          <div>
            <h3 style={{ marginBottom: '1.5rem' }}>About You</h3>
            <Textarea 
              label="Bio"
              placeholder="Tell potential flatmates a bit about yourself! What are your hobbies? Are you an early bird or night owl?"
              value={formData.bio}
              onChange={e => handleChange('bio', e.target.value)}
            />
          </div>
        )}

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
          <button 
            className="btn-outline" 
            onClick={() => setStep(step - 1)} 
            disabled={step === 1 || isLoading}
            style={{ opacity: step === 1 ? 0 : 1 }}
          >
            Back
          </button>
          
          {step < 3 ? (
            <button className="btn-primary" onClick={handleNext}>
              Next Step
            </button>
          ) : (
            <button className="btn-primary" onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Finish Profile'}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
