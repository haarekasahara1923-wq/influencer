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
  businessId?: {
    name: string;
  };
  applicationId?: {
    campaignId?: {
      title: string;
    };
  };
  createdAt: string;
}

export default function InfluencerDashboard() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ locked: 0, received: 0 });

  const fetchDeals = async () => {
    try {
      const data = await fetchWithAuth('/payments');
      setDeals(data);
      
      const locked = data.reduce((acc: number, d: Deal) => (d.paymentStatus === 'held' || d.paymentStatus === 'approved') ? acc + Number(d.totalAmount) : acc, 0);
      const received = data.reduce((acc: number, d: Deal) => d.paymentStatus === 'released' ? acc + Number(d.totalAmount) : acc, 0);
      setStats({ locked, received });
    } catch (err) {
      console.error("Failed to fetch deals", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50/50 hero-gradient">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <header className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
           <div className="animate-in fade-in slide-in-from-left duration-700">
              <h1 className="text-5xl font-black tracking-tighter text-foreground mb-3 uppercase italic">
                Creator <span className="text-primary not-italic">Console</span>
              </h1>
              <div className="flex items-center gap-3">
                 <div className="h-[1px] w-12 bg-primary" />
                 <p className="text-zinc-500 font-bold text-sm tracking-wide uppercase">Monetize Your Influence</p>
              </div>
           </div>
           
           <div className="flex gap-4 animate-in fade-in slide-in-from-right duration-700">
              <div className="bg-white border-2 border-primary/10 p-6 rounded-[2.5rem] flex flex-col min-w-[220px] shadow-2xl shadow-primary/5 hover:-translate-y-1 transition-all duration-300 group">
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2">Locked Earnings</span>
                 <span className="text-3xl font-black text-foreground">₹{stats.locked.toLocaleString()}</span>
                 <div className="mt-4 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    <span className="text-[9px] font-bold text-primary uppercase">Escrow Protected</span>
                 </div>
              </div>
              <div className="bg-black text-white p-6 rounded-[2.5rem] flex flex-col min-w-[220px] shadow-2xl shadow-black/30 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                 <div className="relative z-10">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-2">Total Payouts</span>
                    <span className="text-3xl font-black">₹{stats.received.toLocaleString()}</span>
                    <div className="mt-4 text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Withdrawals Active</div>
                 </div>
                 <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors" />
              </div>
           </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
           <div className="lg:col-span-3 space-y-10">
              <div className="flex justify-between items-center bg-white/50 p-4 rounded-3xl border border-zinc-100">
                 <h2 className="text-xs font-black uppercase tracking-[0.25em] flex items-center gap-3 text-zinc-500 ml-4">
                    <span className="text-primary font-black italic text-base">#</span> Active Collaborations
                 </h2>
                 <div className="flex gap-2">
                    <button className="px-5 py-2 rounded-full text-[10px] font-black uppercase bg-zinc-100/50 text-zinc-400 hover:text-foreground transition-colors">History</button>
                    <button onClick={fetchDeals} className="px-5 py-2 rounded-full text-[10px] font-black uppercase bg-primary text-white shadow-lg shadow-primary/20">Sync</button>
                 </div>
              </div>

              {loading ? (
                <div className="space-y-6">
                   {[1,2,3].map(i => <div key={i} className="h-40 bg-zinc-100/50 animate-pulse rounded-[3rem]" />)}
                </div>
              ) : deals.length === 0 ? (
                <div className="bg-white rounded-[3.5rem] border-2 border-dashed border-zinc-100 p-24 text-center">
                   <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center text-4xl mx-auto mb-8 animate-bounce">🎨</div>
                   <h3 className="font-black text-2xl tracking-tighter uppercase mb-3">No Active Deals Found</h3>
                   <p className="text-zinc-400 text-sm max-w-sm mx-auto font-medium">Head to the discovery page and apply for campaigns to start earning.</p>
                   <Link href="/discovery" className="inline-block mt-8 bg-black text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">Explore Campaigns</Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-8">
                  {deals.map((deal) => (
                    <div key={deal.id} className="bg-white rounded-[3rem] p-10 border border-zinc-50 shadow-sm flex flex-col md:flex-row justify-between items-center gap-12 group hover:shadow-[30px_30px_60px_-15px_rgba(255,63,89,0.08)] transition-all duration-700 relative overflow-hidden">
                       <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                       
                       <div className="flex items-center gap-10 flex-1">
                          <div className="w-16 h-16 rounded-[1.5rem] bg-zinc-50 flex items-center justify-center text-3xl shadow-inner border border-zinc-100/50 group-hover:bg-primary group-hover:text-white transition-all duration-500">💼</div>
                          <div>
                             <h3 className="font-black text-2xl text-foreground tracking-tight group-hover:translate-x-1 transition-transform">{deal.businessId?.name || "Global Brand"}</h3>
                             <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">{deal.applicationId?.campaignId?.title || "Influencer Drive"}</p>
                          </div>
                       </div>

                       <div className="flex items-center gap-12 md:gap-20">
                          <div className="text-center md:text-left">
                             <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">Earnings</p>
                             <p className="font-black text-xl text-foreground">₹{Number(deal.totalAmount).toLocaleString()}</p>
                          </div>

                          <div className="text-center md:text-left min-w-[140px]">
                             <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">Escrow State</p>
                             <StatusChip status={deal.paymentStatus} variant={deal.paymentStatus === 'held' ? 'primary' : deal.paymentStatus === 'released' ? 'success' : 'neutral'} />
                          </div>

                          <button className="bg-foreground text-background font-black text-[10px] uppercase tracking-widest px-10 py-5 rounded-2xl hover:bg-zinc-800 transition-all shadow-xl active:scale-95">
                             Submit Proof
                          </button>
                       </div>
                    </div>
                  ))}
                </div>
              )}
           </div>

           {/* Dashboard Sidebar */}
           <div className="space-y-10 animate-in fade-in slide-in-from-bottom duration-1000">
              <div className="bg-zinc-900 rounded-[3.5rem] p-12 text-white border border-white/5 relative overflow-hidden group shadow-2xl shadow-primary/10">
                 <div className="relative z-10">
                    <h3 className="font-black text-xl tracking-tight mb-10 flex items-center gap-3 italic underline decoration-primary underline-offset-8">
                       TRUST-FLOW
                    </h3>
                    <div className="space-y-10 relative">
                       <div className="absolute left-[5px] top-6 bottom-6 w-[1px] bg-white/10" />
                       
                       <div className="flex gap-8 relative z-10 items-start group/step">
                          <div className="w-2.5 h-2.5 rounded-full bg-primary mt-2 shadow-[0_0_15px_rgba(255,63,89,1)] scale-125 transition-transform group-hover/step:scale-150" />
                          <div>
                             <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-white/90">Funds Secured</p>
                             <p className="text-[11px] text-zinc-500 font-medium leading-relaxed">System has verified Brand capital. It's safe to start content creation.</p>
                          </div>
                       </div>

                       <div className="flex gap-8 relative z-10 items-start group/step">
                          <div className="w-2.5 h-2.5 rounded-full bg-white/20 mt-2 transition-transform group-hover/step:bg-white/40 group-hover/step:scale-150" />
                          <div>
                             <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-white/50">Post & Proof</p>
                             <p className="text-[11px] text-zinc-500 font-medium leading-relaxed">Submit links or assets. Brand has 72 hours to review or it auto-approves.</p>
                          </div>
                       </div>

                       <div className="flex gap-8 relative z-10 items-start group/step">
                          <div className="w-2.5 h-2.5 rounded-full bg-white/20 mt-2 transition-transform group-hover/step:bg-white/40 group-hover/step:scale-150" />
                          <div>
                             <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-white/50">Instant Payout</p>
                             <p className="text-[11px] text-zinc-500 font-medium leading-relaxed">On approval, funds hit your bank instantly via Razorpay X integration.</p>
                          </div>
                       </div>
                    </div>
                 </div>
                 <div className="absolute -top-10 -left-10 w-48 h-48 bg-primary/20 rounded-full blur-[100px] group-hover:bg-primary/30 transition-all duration-700" />
              </div>

              <div className="bg-white rounded-[3.5rem] p-12 border border-zinc-100 flex flex-col items-center text-center shadow-sm">
                 <div className="w-20 h-20 bg-primary/5 rounded-[2rem] flex items-center justify-center text-4xl mb-8">🛡️</div>
                 <h4 className="font-black text-xs uppercase tracking-[0.2em] mb-4">Dispute Vault</h4>
                 <p className="text-zinc-400 text-[10px] font-bold leading-relaxed mb-10">Protected by 24/7 manual mediation for total creator peace of mind.</p>
                 <button className="text-primary font-black text-[10px] uppercase tracking-[0.3em] hover:opacity-70 transition-opacity">Request Support</button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
