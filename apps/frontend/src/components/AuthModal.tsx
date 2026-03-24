'use client';

import { useState } from 'react';

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }: { 
  isOpen: boolean; 
  onClose: () => void; 
  initialMode?: 'login' | 'register' 
}) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [role, setRole] = useState<'INFLUENCER' | 'BUSINESS'>('INFLUENCER');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-[2rem] overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-300">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-zinc-400 hover:text-black transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        <div className="p-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black mb-2">
              {mode === 'login' ? 'Welcome Back' : 'Join the Network'}
            </h2>
            <p className="text-zinc-500 text-sm">
              {mode === 'login' ? "Enter your email to sign in" : "Choose your role and start growing"}
            </p>
          </div>

          {mode === 'register' && (
            <div className="flex p-1 bg-secondary rounded-2xl mb-8">
              <button 
                onClick={() => setRole('INFLUENCER')}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all ${role === 'INFLUENCER' ? 'bg-white shadow-sm text-primary' : 'text-zinc-500'}`}
              >
                Influencer
              </button>
              <button 
                onClick={() => setRole('BUSINESS')}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all ${role === 'BUSINESS' ? 'bg-white shadow-sm text-primary' : 'text-zinc-500'}`}
              >
                Business
              </button>
            </div>
          )}

          <form className="space-y-4" onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const data = Object.fromEntries(formData.entries());
            
            try {
              const endpoint = mode === 'register' ? '/auth/register' : '/auth/login';
              const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...data, role }),
              });

              if (!response.ok) throw new Error('Authentication failed');
              
              const result = await response.json();
              localStorage.setItem('access_token', result.accessToken);
              localStorage.setItem('user_role', result.user.role);
              window.location.href = `/dashboard/${result.user.role.toLowerCase()}`;
            } catch (err) {
              alert(err instanceof Error ? err.message : 'Something went wrong');
            }
          }}>
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2 ml-1">Full Name</label>
                  <input 
                    name="firstName"
                    type="text" 
                    required
                    placeholder="Enter your name"
                    className="w-full bg-secondary border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2 ml-1">Mobile No.</label>
                  <input 
                    name="mobileNumber"
                    type="tel" 
                    required
                    placeholder="+91 00000 00000"
                    className="w-full bg-secondary border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2 ml-1">Email Address</label>
              <input 
                name="email"
                type="email" 
                required
                placeholder="name@example.com"
                className="w-full bg-secondary border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2 ml-1">Password</label>
              <input 
                name="password"
                type="password" 
                required
                placeholder="••••••••"
                className="w-full bg-secondary border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              />
            </div>
            
            <button type="submit" className="w-full bg-primary text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95">
              {mode === 'login' ? 'Login' : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm">
            <span className="text-zinc-500">
              {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
            </span>
            <button 
              type="button"
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="ml-2 text-primary font-bold hover:underline"
            >
              {mode === 'login' ? 'Sign Up' : 'Log In'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
