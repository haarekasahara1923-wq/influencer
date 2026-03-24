'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import StatusChip from '@/components/StatusChip';

export default function AdminPanel() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('campaigns');

  useEffect(() => {
    const savedEmail = sessionStorage.getItem('adminEmail');
    const savedPassword = sessionStorage.getItem('adminPassword');
    if (savedEmail && savedPassword) {
      handleLogin(savedEmail, savedPassword);
    }
  }, []);

  const handleLogin = async (loginEmail = email, loginPassword = password) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/login-data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      if (!response.ok) {
        throw new Error('Invalid Admin Credentials');
      }

      const dashboardData = await response.json();
      setData(dashboardData);
      setIsLoggedIn(true);
      sessionStorage.setItem('adminEmail', loginEmail);
      sessionStorage.setItem('adminPassword', loginPassword);
    } catch (err: any) {
      setError(err.message);
      sessionStorage.removeItem('adminEmail');
      sessionStorage.removeItem('adminPassword');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    sessionStorage.clear();
    setIsLoggedIn(false);
    setData(null);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl w-full max-w-md border border-zinc-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
          <h1 className="text-3xl font-black mb-2 uppercase tracking-tighter">Admin <span className="text-primary italic">Portal</span></h1>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-8">System Access Only</p>
          
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black uppercase text-zinc-500 mb-2 block tracking-widest">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-zinc-50 border-2 border-transparent focus:border-primary/50 rounded-2xl py-4 px-6 text-sm font-medium focus:outline-none transition-all"
                placeholder="admin@inc.wapiflow.site"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-zinc-500 mb-2 block tracking-widest">Master Password</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-zinc-50 border-2 border-transparent focus:border-primary/50 rounded-2xl py-4 px-6 text-sm font-medium focus:outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
            {error && <p className="text-primary text-xs font-bold mt-2 animate-pulse">{error}</p>}
            
            <button 
              onClick={() => handleLogin(email, password)}
              disabled={isLoading}
              className="w-full mt-6 bg-black text-white font-black text-[10px] uppercase tracking-[0.2em] py-5 rounded-2xl hover:scale-[1.02] transition-transform active:scale-95 disabled:opacity-50"
            >
              {isLoading ? 'Authenticating...' : 'Secure Login'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 hero-gradient">
      <Navbar />
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase italic">Control <span className="text-primary not-italic">Center</span></h1>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-2">Live Platform Metrics</p>
          </div>
          <div className="flex gap-4">
            <button onClick={() => handleLogin()} className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm hover:bg-zinc-100 transition-colors">🔄</button>
            <button onClick={logout} className="bg-black text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-colors">Logout</button>
          </div>
        </header>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[{ label: 'Total Users', val: data.users?.length || 0, icon: '👥' },
            { label: 'Active Campaigns', val: data.campaigns?.length || 0, icon: '🎯' },
            { label: 'Escrow Payments', val: data.payments?.length || 0, icon: '💰' },
            { label: 'Total Volume', val: '₹' + (data.payments?.reduce((acc: any, p: any) => acc + Number(p.totalAmount), 0) || 0).toLocaleString(), icon: '📈' }
          ].map((stat, i) => (
             <div key={i} className="bg-white p-8 rounded-[2rem] border border-zinc-100 shadow-sm flex items-center gap-6 group hover:-translate-y-1 transition-transform">
               <div className="w-14 h-14 bg-zinc-50 group-hover:bg-primary/10 rounded-2xl flex items-center justify-center text-2xl transition-colors">{stat.icon}</div>
               <div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">{stat.label}</p>
                 <p className="text-3xl font-black">{stat.val}</p>
               </div>
             </div>
          ))}
        </div>

        {/* TABS */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-4 scrollbar-hide">
          {['campaigns', 'payments', 'users', 'profiles'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white text-zinc-500 hover:bg-zinc-100 border border-zinc-100'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* TABLES */}
        <div className="bg-white rounded-[3rem] p-8 border border-zinc-100 shadow-sm overflow-x-auto min-h-[500px]">
          {activeTab === 'campaigns' && (
            <table className="w-full text-left min-w-[800px]">
              <thead>
                <tr className="border-b-2 border-zinc-100">
                  <th className="py-6 px-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Campaign</th>
                  <th className="py-6 px-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Business</th>
                  <th className="py-6 px-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Budget</th>
                  <th className="py-6 px-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Status</th>
                  <th className="py-6 px-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Created</th>
                </tr>
              </thead>
              <tbody>
                {data.campaigns?.map((c: any) => (
                  <tr key={c.id} className="border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors">
                    <td className="py-6 px-4">
                      <p className="font-bold text-sm">{c.title}</p>
                    </td>
                    <td className="py-6 px-4 text-sm font-medium text-zinc-600">{c.businessId?.name || 'N/A'}</td>
                    <td className="py-6 px-4 font-black">₹{Number(c.totalBudget).toLocaleString()}</td>
                    <td className="py-6 px-4"><StatusChip status={c.status} variant={c.status === 'open' ? 'success' : 'neutral'} /></td>
                    <td className="py-6 px-4 text-xs font-bold text-zinc-400">{new Date(c.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'payments' && (
            <table className="w-full text-left min-w-[800px]">
              <thead>
                <tr className="border-b-2 border-zinc-100">
                  <th className="py-6 px-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">ID</th>
                  <th className="py-6 px-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Amount</th>
                  <th className="py-6 px-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Escrow Status</th>
                  <th className="py-6 px-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Type</th>
                  <th className="py-6 px-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.payments?.map((p: any) => (
                  <tr key={p.id} className="border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors">
                    <td className="py-6 px-4 font-mono text-xs text-zinc-500">{p.id.slice(0, 10)}...</td>
                    <td className="py-6 px-4 font-black">₹{Number(p.totalAmount).toLocaleString()}</td>
                    <td className="py-6 px-4">
                      <StatusChip status={p.paymentStatus} variant={p.paymentStatus === 'released' ? 'success' : p.paymentStatus === 'held' ? 'primary' : 'neutral'} />
                    </td>
                    <td className="py-6 px-4 text-[10px] font-bold uppercase tracking-widest max-w-[100px]">{p.paymentType}</td>
                    <td className="py-6 px-4 text-right">
                      {p.paymentStatus === 'approved' && (
                        <button className="bg-green-500 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-md">Dispatch Payout</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'users' && (
            <table className="w-full text-left min-w-[800px]">
              <thead>
                <tr className="border-b-2 border-zinc-100">
                  <th className="py-6 px-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Email</th>
                  <th className="py-6 px-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Role</th>
                  <th className="py-6 px-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Status</th>
                  <th className="py-6 px-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Joined at</th>
                </tr>
              </thead>
              <tbody>
                {data.users?.map((u: any) => (
                  <tr key={u.id} className="border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors">
                    <td className="py-6 px-4 font-bold text-sm">{u.email}</td>
                    <td className="py-6 px-4"><span className="bg-zinc-100 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{u.role}</span></td>
                    <td className="py-6 px-4">
                      {u.isActive ? <span className="text-green-500 text-xl">●</span> : <span className="text-red-500 text-xl">●</span>}
                    </td>
                    <td className="py-6 px-4 text-xs font-bold text-zinc-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'profiles' && (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {data.profiles?.map((p: any) => (
                 <div key={p.id} className="border border-zinc-100 p-6 rounded-3xl flex items-center justify-between">
                    <div>
                      <p className="font-bold text-sm mb-1">{p.fullName}</p>
                      <p className="text-[10px] font-black text-primary uppercase tracking-widest">{p.niche}</p>
                      <p className="text-xs text-zinc-500 font-medium mt-2">Base: ₹{p.basePrice?.toLocaleString()}</p>
                    </div>
                    <div className="w-12 h-12 bg-zinc-50 rounded-full flex items-center justify-center text-xl">✨</div>
                 </div>
               ))}
             </div>
          )}

          {data[activeTab]?.length === 0 && (
             <div className="text-center py-20 text-zinc-400 text-sm font-medium">No records found for {activeTab}.</div>
          )}
        </div>
      </div>
    </div>
  );
}
