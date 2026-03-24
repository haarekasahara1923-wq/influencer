'use client';

import { motion, AnimatePresence } from 'framer-motion';

export default function ProfileModal({ influencer, isOpen, onClose }: { influencer: any, isOpen: boolean, onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-white w-full max-w-5xl rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row h-[90vh] md:h-auto"
        >
          {/* Left: Image & Quick Stats */}
          <div className="w-full md:w-2/5 relative bg-zinc-100 h-64 md:h-auto overflow-hidden group">
            <img 
              src={influencer.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${influencer.name}`} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[10s]"
              alt=""
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-10 text-white">
               <h2 className="text-4xl font-[900] tracking-tighter mb-1">{influencer.name}</h2>
               <p className="text-primary text-xs font-black uppercase tracking-[0.2em]">{influencer.niche}</p>
            </div>
          </div>

          {/* Right: DNA Report */}
          <div className="flex-1 p-10 md:p-16 overflow-y-auto">
             <div className="flex justify-between items-start mb-12">
                <div>
                   <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-400 mb-2">Platform DNA Report</h3>
                   <p className="text-2xl font-black text-foreground">Verified Creator Metrics</p>
                </div>
                <button 
                  onClick={onClose}
                  className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-zinc-100 transition-colors"
                >
                   ✕
                </button>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 mb-16">
                <div className="bg-primary/5 p-8 rounded-[2rem] border border-primary/10">
                   <div className="flex justify-between items-center mb-6">
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary">DNA Score</span>
                      <span className="text-2xl font-black text-primary">94/100</span>
                   </div>
                   <div className="h-3 w-full bg-primary/10 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: '94%' }} transition={{ duration: 1.5, delay: 0.2 }} className="h-full bg-primary" />
                   </div>
                   <p className="mt-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-relaxed">
                      AI analysis shows deep audience loyalty and 100% genuine follower base.
                   </p>
                </div>

                <div className="bg-zinc-50 p-8 rounded-[2rem] border border-border/50">
                   <div className="flex justify-between items-center mb-6">
                      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Collaboration Fee</span>
                      <span className="text-2xl font-black text-foreground">₹{influencer.price.toLocaleString()}</span>
                   </div>
                   <button className="w-full bg-foreground text-background font-black text-xs uppercase tracking-widest py-4 rounded-2xl hover:bg-zinc-800 transition-colors shadow-xl">
                      Proceed to Escrow
                   </button>
                </div>
             </div>

             {/* Detailed Metrics */}
             <div className="space-y-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                   <div>
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Followers</p>
                      <p className="text-xl font-black text-foreground">{influencer.reach}</p>
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Avg Tags/Day</p>
                      <p className="text-xl font-black text-foreground">12.4</p>
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Engagement</p>
                      <p className="text-xl font-black text-primary">{influencer.engagement}%</p>
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Last Deal</p>
                      <p className="text-xl font-black text-foreground">Pending</p>
                   </div>
                </div>

                <div className="pt-10 border-t">
                   <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-6">Engagement Quality</h4>
                   <div className="grid grid-cols-3 gap-6">
                      <div className="h-24 bg-zinc-50 rounded-2xl border flex flex-col items-center justify-center p-4">
                         <span className="text-lg font-black text-foreground">88%</span>
                         <span className="text-[8px] font-black uppercase text-zinc-400 tracking-widest mt-1">Authenticity</span>
                      </div>
                      <div className="h-24 bg-zinc-50 rounded-2xl border flex flex-col items-center justify-center p-4">
                         <span className="text-lg font-black text-foreground">Tier 1</span>
                         <span className="text-[8px] font-black uppercase text-zinc-400 tracking-widest mt-1">Audience</span>
                      </div>
                      <div className="h-24 bg-zinc-50 rounded-2xl border flex flex-col items-center justify-center p-4">
                         <span className="text-lg font-black text-foreground">Daily</span>
                         <span className="text-[8px] font-black uppercase text-zinc-400 tracking-widest mt-1">Activity</span>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
