'use client';

import Navbar from "@/components/Navbar";
import { fetchWithAuth } from "@/utils/api";
import { useState, useEffect } from "react";

export default function CommunicationPage() {
  const [token, setToken] = useState<string | null>(null);
  const [appId, setAppId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getZegoToken = async () => {
      try {
        const roomId = "room_default";
        const data = await fetchWithAuth(`/communication/token/${roomId}`, { method: 'POST' });
        setToken(data.token);
        setAppId(data.appId);
      } catch (err) {
        console.error("Failed to fetch Zego token", err);
      } finally {
        setLoading(false);
      }
    };
    getZegoToken();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-12 h-[calc(100vh-80px)]">
         <div className="grid grid-cols-1 lg:grid-cols-4 h-full gap-8">
            {/* Sidebar - Active Chats */}
            <div className="hidden lg:flex flex-col bg-zinc-900/50 rounded-[2.5rem] border border-white/5 p-6 h-full">
               <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-8 text-zinc-500 px-4">Direct Channels</h3>
               <div className="space-y-4">
                  {[
                    { name: 'Pepsi Co.', status: 'active', avatar: '🥤' },
                    { name: 'Aria Sharma', status: 'away', avatar: '💃' },
                    { name: 'Admin Support', status: 'active', avatar: '🛡️' }
                  ].map((chat, i) => (
                    <div key={i} className={`flex items-center gap-4 p-4 rounded-3xl cursor-pointer transition-all ${i===0 ? 'bg-primary/10 border border-primary/20' : 'hover:bg-white/5'}`}>
                       <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-xl">{chat.avatar}</div>
                       <div>
                          <p className="font-black text-sm">{chat.name}</p>
                          <p className={`text-[10px] font-bold uppercase tracking-widest ${chat.status==='active' ? 'text-green-500' : 'text-zinc-500'}`}>{chat.status}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* Main Chat Area */}
            <div className="lg:col-span-3 flex flex-col bg-zinc-900 rounded-[3rem] border border-white/10 relative overflow-hidden h-full shadow-2xl">
               {/* Chat Header */}
               <div className="p-8 border-b border-white/5 flex justify-between items-center bg-zinc-900/80 backdrop-blur-md sticky top-0 z-10">
                  <div className="flex items-center gap-6">
                     <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-2xl shadow-lg shadow-primary/20 animate-pulse">🥤</div>
                     <div>
                        <h2 className="text-xl font-black tracking-tight">Pepsi Co. <span className="text-xs text-primary font-bold ml-2 italic">CAMPAIGN ACTIVE</span></h2>
                        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">Private Escrow Channel</p>
                     </div>
                  </div>
                  <div className="flex gap-4">
                     <button className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-xl hover:bg-white/5 transition-all">📞</button>
                     <button className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center text-xl hover:bg-zinc-200 transition-all font-bold">📹</button>
                  </div>
               </div>

               {/* Messages Area */}
               <div className="flex-1 overflow-y-auto p-10 space-y-8 scrollbar-hide">
                  <div className="flex justify-center mb-12">
                     <span className="bg-zinc-800/50 text-zinc-500 text-[9px] font-black uppercase tracking-[0.3em] px-6 py-2 rounded-full">Encrypted Connection Established</span>
                  </div>

                  {/* Incoming */}
                  <div className="flex flex-col items-start gap-4">
                     <div className="max-w-[70%] bg-zinc-800 p-6 rounded-[2rem] rounded-tl-none border border-white/5">
                        <p className="text-sm font-medium leading-relaxed">Hey! We've just reviewed the draft you sent over. The lighting in the second frame is absolutely perfect. Could we get a similar vibe for the outro as well?</p>
                     </div>
                     <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest ml-1">10:42 AM</span>
                  </div>

                  {/* Outgoing */}
                  <div className="flex flex-col items-end gap-4 font-black">
                     <div className="max-w-[70%] bg-primary p-6 rounded-[2rem] rounded-tr-none shadow-xl shadow-primary/20">
                        <p className="text-sm font-medium leading-relaxed text-white">Absolutely! I'll re-shoot the outro tags with that warmth. Should have the final version for escrow approval by tonight.</p>
                     </div>
                     <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mr-1">10:45 AM</span>
                  </div>

                  {loading && (
                    <div className="flex justify-center italic text-zinc-500 text-xs animate-pulse">Initializing Secure SDK...</div>
                  )}
               </div>

               {/* Input Area */}
               <div className="p-8 bg-zinc-900/50 border-t border-white/5">
                  <div className="relative group">
                     <input 
                        type="text" 
                        placeholder="Type a secure message..." 
                        className="w-full bg-zinc-800 border-2 border-transparent focus:border-primary/50 rounded-3xl py-6 px-10 text-sm font-medium focus:outline-none transition-all placeholder:text-zinc-600"
                     />
                     <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-4">
                        <button className="text-xl hover:scale-110 transition-transform">📎</button>
                        <button className="bg-primary px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#ff1f3b] shadow-lg shadow-primary/10">Send</button>
                     </div>
                  </div>
               </div>
               
               {/* SDK Overlay Mock (ZegoCloud) */}
               {token && (
                 <div className="absolute bottom-4 left-4 right-4 p-2 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-between animate-in slide-in-from-bottom duration-1000">
                    <div className="flex items-center gap-3">
                       <div className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-primary">Zego Engine Active</span>
                    </div>
                    <span className="text-[8px] font-mono text-zinc-500 overflow-hidden text-ellipsis whitespace-nowrap max-w-[200px]">{token}</span>
                 </div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
}
