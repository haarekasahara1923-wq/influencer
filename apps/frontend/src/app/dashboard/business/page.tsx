'use client';

import Navbar from "@/components/Navbar";
import StatusChip from "@/components/StatusChip";
import { fetchWithAuth } from "@/utils/api";
import Link from "next/link";
import { useState, useEffect } from "react";

interface Deal {
  id: string;
  totalAmount: number;
  paymentStatus: string;
  influencerId?: {
    name: string;
    profileImage?: string;
  };
  applicationId?: {
    campaignId?: {
      title: string;
    };
  };
  createdAt: string;
}

export default function BusinessDashboard() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ fundsHeld: 0, totalSpent: 0 });

  const fetchDeals = async () => {
    try {
      const data = await fetchWithAuth('/payments');
      setDeals(data);
      
      const held = data.reduce((acc: number, d: Deal) => d.paymentStatus === 'held' ? acc + Number(d.totalAmount) : acc, 0);
      const spent = data.reduce((acc: number, d: Deal) => d.paymentStatus === 'released' ? acc + Number(d.totalAmount) : acc, 0);
      setStats({ fundsHeld: held, totalSpent: spent });
    } catch (err) {
      console.error("Failed to fetch deals", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  const handleApprove = async (paymentId: string) => {
    if (!confirm("Are you sure you want to approve this work? This will signal the system to release the funds.")) return;
    try {
      await fetchWithAuth(`/payments/approve/${paymentId}`, { method: 'PUT' });
      fetchDeals(); // Refresh
    } catch (err) {
      alert("Approval failed: " + (err as any).message);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50/50 hero-gradient">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <header className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
           <div className="animate-in fade-in slide-in-from-left duration-700">
              <h1 className="text-5xl font-black tracking-tighter text-foreground mb-3 uppercase italic">
                Campaign <span className="text-primary not-italic">Console</span>
              </h1>
              <div className="flex items-center gap-3">
                 <div className="h-[1px] w-12 bg-primary" />
                 <p className="text-zinc-500 font-bold text-sm tracking-wide uppercase">Elite Influence Management</p>
              </div>
           </div>
           
           <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-right duration-700">
              <div className="glass p-6 rounded-[2rem] flex flex-col min-w-[180px] shadow-2xl shadow-primary/5 group hover:-translate-y-1 transition-all duration-300">
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2 block">Escrow Protected</span>
                 <span className="text-3xl font-black text-foreground">₹{stats.fundsHeld.toLocaleString()}</span>
                 <div className="mt-2 w-8 h-1 bg-primary/20 rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-2/3" />
                 </div>
              </div>
              <div className="bg-black text-white p-6 rounded-[2rem] flex flex-col min-w-[180px] shadow-2xl shadow-black/20 group hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-2 block">Network Spend</span>
                 <span className="text-3xl font-black">₹{(stats.totalSpent / 1000).toFixed(1)}K</span>
                 <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors" />
              </div>
           </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
           <div className="lg:col-span-3 space-y-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-black uppercase tracking-[0.25em] flex items-center gap-3 text-zinc-400">
                   <div className="w-2.5 h-2.5 rounded-full bg-primary animate-ping" />
                   Active Escrow Pipeline
                </h2>
                <button 
                  onClick={fetchDeals}
                  className="text-[10px] font-bold uppercase tracking-widest text-primary hover:bg-primary/5 px-4 py-2 rounded-full transition-colors"
                >
                  Refresh Data
                </button>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 gap-6">
                  {[1, 2, 3].map(i => <div key={i} className="h-32 bg-zinc-100 animate-pulse rounded-[2rem]" />)}
                </div>
              ) : deals.length === 0 ? (
                <div className="bg-white/50 border border-dashed rounded-[3rem] p-24 text-center">
                   <div className="text-4xl mb-4">💎</div>
                   <h3 className="font-black text-lg uppercase tracking-tight">No active campaigns yet</h3>
                   <p className="text-zinc-400 text-sm mt-2">Launch your first campaign and hire influencers to see them here.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {deals.map((deal) => (
                    <div key={deal.id} className="bg-white rounded-[2.5rem] p-8 border border-zinc-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-8 hover:shadow-2xl hover:border-primary/20 transition-all duration-500 group relative overflow-hidden">
                       <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                       
                       <div className="flex items-center gap-8 flex-1">
                          <div className="w-20 h-20 rounded-3xl bg-zinc-100 overflow-hidden shrink-0 border-2 border-white shadow-xl relative group-hover:scale-105 transition-transform duration-500">
                             <img 
                                src={deal.influencerId?.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${deal.influencerId?.name || deal.id}`} 
                                alt="" 
                                className="object-cover w-full h-full"
                             />
                          </div>
                          <div>
                             <h3 className="font-black text-xl text-foreground group-hover:text-primary transition-colors">{deal.influencerId?.name || "Premium Influencer"}</h3>
                             <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.15em] mt-1">{deal.applicationId?.campaignId?.title || "Exclusive Partnership"}</p>
                          </div>
                       </div>

                       <div className="flex items-center gap-12 md:gap-16">
                          <div className="text-center md:text-right">
                             <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">Market Value</p>
                             <p className="font-black text-lg text-foreground">₹{Number(deal.totalAmount).toLocaleString()}</p>
                          </div>

                          <div className="text-center md:text-right min-w-[120px]">
                             <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">Escrow Status</p>
                             <StatusChip status={deal.paymentStatus} variant={deal.paymentStatus === 'held' ? 'primary' : deal.paymentStatus === 'approved' ? 'success' : 'neutral'} />
                          </div>

                          <div className="flex gap-2 min-w-[160px] justify-end">
                             {deal.paymentStatus === 'held' ? (
                               <button 
                                 onClick={() => handleApprove(deal.id)}
                                 className="bg-primary text-white font-black text-[10px] uppercase tracking-[0.2em] px-8 py-4 rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 hover:bg-[#ff1f3b] active:scale-95 transition-all duration-300"
                               >
                                  Approve & Release
                               </button>
                             ) : (
                               <button className="border border-zinc-100 bg-zinc-50 text-zinc-400 font-black text-[10px] uppercase tracking-[0.2em] px-8 py-4 rounded-2xl opacity-70 cursor-not-allowed">
                                  {deal.paymentStatus === 'approved' ? 'Awaiting Payout' : 'Released'}
                               </button>
                             )}
                          </div>
                       </div>
                    </div>
                  ))}
                </div>
              )}
           </div>

           <div className="space-y-8">
              <div className="bg-black rounded-[3rem] p-10 text-white overflow-hidden relative group shadow-2xl">
                 <div className="z-10 relative">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-2xl mb-8 group-hover:scale-110 transition-transform">🔒</div>
                    <h2 className="text-2xl font-black tracking-tight mb-4 leading-tight">Zero-Risk <br /><span className="text-primary italic">Collaborations.</span></h2>
                    <p className="text-zinc-400 text-xs mb-10 font-medium leading-relaxed uppercase tracking-wider">Funds only move when you say so. You're in total control of the capital.</p>
                    <button className="w-full bg-white text-black font-black text-[10px] uppercase tracking-[0.2em] py-5 rounded-2xl hover:bg-zinc-200 transition-all duration-300 active:scale-95">Support Center</button>
                 </div>
                 <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-primary/20 rounded-full blur-[80px] group-hover:bg-primary/30 transition-all duration-700" />
              </div>

              <div className="rounded-[3rem] bg-white border border-zinc-100 p-10 flex flex-col items-center justify-center text-center group hover:border-primary/30 transition-all duration-500 shadow-sm">
                 <div className="w-16 h-16 bg-zinc-50 rounded-[1.5rem] flex items-center justify-center text-3xl mb-6 group-hover:rotate-12 transition-transform">🗨️</div>
                 <h3 className="font-black text-xs uppercase tracking-[0.2em] mb-3">Concierge Chat</h3>
                 <p className="text-zinc-400 text-[10px] font-bold leading-relaxed">Direct line to elite campaign strategy and resolution.</p>
                 <Link href="/communication" className="mt-8 text-primary font-black text-[10px] uppercase tracking-widest hover:underline">Open Messages</Link>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

