"use client";

import React from "react";
import { ArrowRight, Home, Sparkles, MessageCircle, Search, User } from "lucide-react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export default function HomePage() {
  const { user, logout } = useAuth();

  return (
    <>
      {/* Background Ambient Glows */}
      <div className="glow glow-top" />
      <div className="glow glow-bottom" />

      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="container">
          <Link href="/" className="logo">
            <Home className="text-primary" size={28} />
            <span>FlatMatch</span>
          </Link>
          <div className="nav-links">
            <Link href="#">Find a Room</Link>
            <Link href="#">Find a Flatmate</Link>
            <Link href="#">How it works</Link>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {user ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                  <User size={20} />
                  <span>{user.profile?.name || user.email}</span>
                </div>
                <button className="btn-outline" onClick={logout} style={{ padding: '0.5rem 1rem' }}>Log out</button>
              </>
            ) : (
              <>
                <Link href="/login" className="btn-outline" style={{ display: 'inline-flex', padding: '0.5rem 1rem' }}>Log in</Link>
                <Link href="/register" className="btn-primary" style={{ display: 'inline-flex', padding: '0.5rem 1rem' }}>Sign up</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container">
        <section className="hero">
          <div className="glass-panel" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '999px', marginBottom: '2rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            <Sparkles size={16} color="var(--accent)" />
            <span>AI-Powered Compatibility Matching is now live</span>
          </div>
          
          <h1>
            Find Your Perfect <br />
            <span className="text-gradient">Home & Flatmate</span>
          </h1>
          
          <p>
            Stop scrolling through endless, incompatible listings. 
            FlatMatch uses advanced AI to match your lifestyle, budget, and personality with the perfect flatmates and spaces.
          </p>

          <div className="hero-cta">
            <button className="btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
              <Search size={20} />
              Start Exploring
            </button>
            <button 
              className="btn-outline" 
              style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}
              onClick={async () => {
                try {
                  const res = await fetch('http://localhost:5000/api/health');
                  const data = await res.json();
                  alert('✅ Full Stack Connected! Backend says: ' + data.message);
                } catch (e: any) {
                  alert('❌ Connection failed: ' + e.message);
                }
              }}
            >
              Test Full Stack Connection
            </button>
          </div>
        </section>

        {/* Features Section */}
        <section className="features">
          <h2 style={{ textAlign: 'center', fontSize: '2.5rem' }}>Why choose <span className="text-gradient">FlatMatch?</span></h2>
          
          <div className="features-grid">
            <div className="feature-card glass-panel">
              <div className="feature-icon">
                <Sparkles size={24} />
              </div>
              <h3>AI Compatibility</h3>
              <p>Our intelligent algorithm analyzes lifestyle habits, schedules, and preferences to find your ideal living match.</p>
            </div>

            <div className="feature-card glass-panel">
              <div className="feature-icon">
                <MessageCircle size={24} />
              </div>
              <h3>Secure Messaging</h3>
              <p>Chat instantly and securely with potential flatmates before sharing any personal contact details.</p>
            </div>

            <div className="feature-card glass-panel">
              <div className="feature-icon">
                <Home size={24} />
              </div>
              <h3>Verified Listings</h3>
              <p>Every property and profile goes through a strict verification process to ensure a safe and trustworthy community.</p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
