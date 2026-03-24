'use client';

import { useState } from "react";
import AuthModal from "./AuthModal";
import { motion } from "framer-motion";

export default function Hero() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [initialRole, setInitialRole] = useState<'INFLUENCER' | 'BUSINESS'>('BUSINESS');

  const openAuth = (role: 'INFLUENCER' | 'BUSINESS') => {
    setInitialRole(role);
    setIsAuthModalOpen(true);
  };

  return (
    <>
      <div className="relative overflow-hidden bg-white/5 pb-24 sm:pb-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl pt-24 text-center sm:pt-40">
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8 }}
               className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em] px-6 py-2.5 rounded-full mb-12"
            >
              🚀 Global Influencer Marketplace
            </motion.div>
            <motion.h1 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 1, ease: "easeOut" }}
               className="text-6xl font-[900] tracking-tighter text-foreground sm:text-9xl mb-10 leading-[0.85] bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text"
            >
              Collaborations <br />
              <span className="text-primary italic">Perfected.</span>
            </motion.h1>
            
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.5, duration: 1 }}
               className="relative mt-20 rounded-[3rem] overflow-hidden shadow-2xl shadow-primary/10 border border-white/10 group h-[400px] w-full"
            >
               <img 
                 src="/hero-banner.png" 
                 alt="Influencer Connect" 
                 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[10s]"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-12 text-left">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
                     <div className="max-w-md">
                        <p className="text-white text-2xl font-black tracking-tight leading-tight">
                           Direct access to the world's most <br />
                           <span className="text-primary">Verified Creators.</span>
                        </p>
                     </div>
                     <div className="flex flex-wrap gap-4">
                        <button 
                          onClick={() => openAuth('BUSINESS')}
                          className="bg-white text-black font-black text-xs uppercase tracking-widest px-10 py-5 rounded-2xl hover:bg-white/90 transition-all shadow-xl hover:-translate-y-1 active:scale-95"
                        >
                          I'm a Business
                        </button>
                        <button 
                          onClick={() => openAuth('INFLUENCER')}
                          className="bg-primary text-white font-black text-xs uppercase tracking-widest px-10 py-5 rounded-2xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/40 hover:-translate-y-1 active:scale-95"
                        >
                          I'm an Influencer
                        </button>
                     </div>
                  </div>
               </div>
            </motion.div>
          </div>
        </div>
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        initialMode="register" 
      />
    </>
  );
}


