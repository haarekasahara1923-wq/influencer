'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import AuthModal from "./AuthModal";

export default function Navbar() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [user, setUser] = useState<{ role: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const role = localStorage.getItem('user_role');
    if (token) {
       setUser({ role: role || 'INFLUENCER' });
    }
  }, []);

  const openAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <>
      <nav className="sticky top-0 z-[60] glass border-b border-primary/10 shadow-sm py-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center gap-3 group transition-transform hover:scale-105">
              <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20 rotate-[-5deg] group-hover:rotate-0 transition-transform">
                <span className="text-white font-black text-2xl italic tracking-tighter">I</span>
              </div>
              <span className="text-2xl font-black tracking-tighter text-foreground">
                Influencer<span className="text-primary italic">Connect</span>
              </span>
            </Link>

            <div className="hidden lg:flex items-center space-x-12 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
               <Link href="/discovery" className="hover:text-primary transition-colors">Elite Search</Link>
               <Link href="/campaigns" className="hover:text-primary transition-colors">Campaigns</Link>
               {user && (
                 <>
                  <Link href="/communication" className="hover:text-primary transition-colors bg-primary/5 px-4 py-2 rounded-full border border-primary/10">Messenger</Link>
                  <Link href={`/dashboard/${user.role.toLowerCase()}`} className="hover:text-primary transition-colors">Terminal</Link>
                 </>
               )}
            </div>

            <div className="flex items-center gap-6">
               {!user ? (
                 <>
                  <button 
                    onClick={() => openAuth('login')}
                    className="text-[10px] font-black uppercase tracking-widest hover:text-primary px-4 py-2 transition-colors"
                  >
                    Enter
                  </button>
                  <button 
                    onClick={() => openAuth('register')}
                    className="bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] h-12 px-10 rounded-2xl hover:bg-zinc-800 transition-all shadow-2xl active:scale-95 border-b-4 border-primary/30"
                  >
                    Join Now
                  </button>
                 </>
               ) : (
                 <button 
                   onClick={handleLogout}
                   className="bg-zinc-100 text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] h-12 px-8 rounded-2xl hover:bg-zinc-200 transition-all active:scale-95 border border-zinc-200"
                 >
                   Sign Out
                 </button>
               )}
            </div>
          </div>
        </div>
      </nav>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        initialMode={authMode} 
      />
    </>
  );
}

