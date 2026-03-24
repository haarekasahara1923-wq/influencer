'use client';

import { useState } from 'react';
import ProfileModal from './ProfileModal';

export default function DiscoveryCard({ influencer }: { influencer: any }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div 
        onClick={() => setIsModalOpen(true)}
        className="group rounded-[3rem] overflow-hidden glass border-border/50 hover:border-primary/50 transition-all duration-700 hover:-translate-y-4 cursor-pointer shadow-sm hover:shadow-2xl hover:shadow-primary/5 relative"
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-zinc-100">
          <img 
            src={influencer.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${influencer.name}`} 
            alt={influencer.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[10s]"
          />
          <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-primary shadow-sm">
            Top Tier
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex flex-col justify-end p-10">
             <div className="flex justify-between items-center text-white mb-6">
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Authenticity Score</p>
                   <p className="text-2xl font-black">94% <span className="text-xs font-medium text-white/60">Verified</span></p>
                </div>
                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                   🚀
                </div>
             </div>
             <button className="w-full bg-white text-black font-black text-[10px] uppercase tracking-widest py-4 rounded-2xl shadow-xl hover:bg-zinc-100 transition-colors">
               View DNA Report
             </button>
          </div>
        </div>
        <div className="p-10 pt-8 bg-white/50 backdrop-blur-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-black text-xl text-foreground tracking-tight leading-tight">{influencer.name}</h3>
              <p className="text-primary text-[10px] font-black uppercase tracking-[0.2em] mt-2 mb-1">{influencer.niche}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Base Rate</p>
              <p className="font-black text-lg text-foreground">₹{influencer.price.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-border/50 grid grid-cols-2 gap-8">
             <div>
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1.5 opacity-60">Avg Reach</p>
                <p className="text-sm font-black text-foreground">{influencer.reach}</p>
             </div>
             <div>
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1.5 opacity-60">Engagement</p>
                <p className="text-sm font-black text-primary">{influencer.engagement}%</p>
             </div>
          </div>
        </div>
      </div>

      <ProfileModal 
        influencer={influencer} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}

