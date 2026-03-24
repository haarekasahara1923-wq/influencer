'use client';

import { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import { fetchWithAuth } from "@/utils/api";

interface SocialPlatform {
  platform: string;
  handle: string;
  followerCount: number;
  views: number;
  likes: number;
  comments: number;
  profileUrl: string;
}

interface Creative {
  type: 'video' | 'image';
  url: string;
  brandName: string;
}

export default function InfluencerDashboard() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [rawBio, setRawBio] = useState('');
  const [aiBios, setAiBios] = useState<string[]>([]);
  const [stats, setStats] = useState({ locked: 0, received: 0 });

  // Form State
  const [profileData, setProfileData] = useState({
    niche: '',
    address: '',
    contactEmail: '',
    contactNo: '',
    whatsappNo: '',
    bio: '',
    socialPlatforms: [] as SocialPlatform[],
    creatives: [] as Creative[],
  });

  const fetchProfile = async () => {
    try {
      const data = await fetchWithAuth('/profiles/me');
      setProfile(data);
      setProfileData({
        niche: data.niche || '',
        address: data.address || '',
        contactEmail: data.contactEmail || '',
        contactNo: data.contactNo || '',
        whatsappNo: data.whatsappNo || '',
        bio: data.bio || '',
        socialPlatforms: data.socialPlatforms || [],
        creatives: data.creatives || [],
      });
      if (data.dnaData?.generatedBios) {
        setAiBios(data.dnaData.generatedBios);
      }
    } catch (err) {
      console.log("No profile found yet, showing form");
      setEditMode(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
     try {
       const data = await fetchWithAuth('/payments');
       const locked = data.reduce((acc: number, d: any) => (d.paymentStatus === 'held' || d.paymentStatus === 'approved') ? acc + Number(d.totalAmount) : acc, 0);
       const received = data.reduce((acc: number, d: any) => d.paymentStatus === 'released' ? acc + Number(d.totalAmount) : acc, 0);
       setStats({ locked, received });
     } catch (err) {
       console.error("Failed to fetch stats");
     }
  };

  useEffect(() => {
    fetchProfile();
    fetchStats();
  }, []);

  const handleAddPlatform = () => {
    setprofileData({
      ...profileData,
      socialPlatforms: [...profileData.socialPlatforms, { platform: '', handle: '', followerCount: 0, views: 0, likes: 0, comments: 0, profileUrl: '' }]
    });
  };

  const handlePlatformChange = (index: number, field: keyof SocialPlatform, value: any) => {
    const newPlatforms = [...profileData.socialPlatforms];
    newPlatforms[index] = { ...newPlatforms[index], [field]: value };
    setprofileData({ ...profileData, socialPlatforms: newPlatforms });
  };

  const handleAddCreative = (type: 'video' | 'image') => {
    setprofileData({
      ...profileData,
      creatives: [...profileData.creatives, { type, url: 'https://via.placeholder.com/300', brandName: '' }]
    });
  };

  const handleCreativeChange = (index: number, field: keyof Creative, value: string) => {
    const newCreatives = [...profileData.creatives];
    newCreatives[index] = { ...newCreatives[index], [field]: value };
    setprofileData({ ...profileData, creatives: newCreatives });
  };

  const generateAIBio = async () => {
    if (!rawBio) return alert("Please write a short prompt for AI");
    try {
      const bios = await fetchWithAuth('/profiles/ai/generate-bio', {
        method: 'POST',
        body: JSON.stringify({ rawBio }),
      });
      setAiBios(bios);
    } catch (err) {
      alert("AI Generation failed");
    }
  };

  const saveProfile = async () => {
    try {
      await fetchWithAuth('/profiles/influencer', {
        method: 'POST',
        body: JSON.stringify(profileData),
      });
      setEditMode(false);
      fetchProfile();
      alert("Profile Saved Successfully!");
    } catch (err) {
      alert("Failed to save profile");
    }
  };

  const handleFileUpload = async (file: File, type: 'avatar' | 'creative', index?: number) => {
    const profileData = new profileData();
    profileData.append('file', file);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/profiles/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: profileData,
      });

      if (!response.ok) throw new Error('Upload failed');
      const data = await response.json();
      
      if (type === 'avatar') {
        setProfile({ ...profile, avatarUrl: data.url });
      } else if (type === 'creative' && index !== undefined) {
        const newCreatives = [...profileData.creatives];
        newCreatives[index].url = data.url;
        setProfileData({ ...profileData, creatives: newCreatives });
      }
      alert("Upload Successful!");
    } catch (err) {
      alert("Upload failed");
    }
  };

  if (loading) return <div className="p-20 text-center font-black uppercase tracking-widest animate-pulse">Initializing Dashboard...</div>;

  return (
    <div className="min-h-screen bg-zinc-50/50 hero-gradient">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <header className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
           <div className="animate-in fade-in slide-in-from-left duration-700">
              <h1 className="text-5xl font-black tracking-tighter text-foreground mb-3 uppercase italic">
                Creator <span className="text-primary not-italic">Console</span>
              </h1>
              <div className="flex items-center gap-3">
                 <div className="h-[1px] w-12 bg-primary" />
                 <p className="text-zinc-500 font-bold text-sm tracking-wide uppercase">Profile & Earnings Management</p>
              </div>
           </div>
           
           <div className="flex gap-4">
              <div className="bg-white border-2 border-primary/10 p-6 rounded-[2.5rem] flex flex-col min-w-[200px] shadow-sm">
                 <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Escrow Locked</span>
                 <span className="text-3xl font-black text-foreground">₹{stats.locked.toLocaleString()}</span>
              </div>
              <div className="bg-black text-white p-6 rounded-[2.5rem] flex flex-col min-w-[200px]">
                 <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Total Earnings</span>
                 <span className="text-3xl font-black">₹{stats.received.toLocaleString()}</span>
              </div>
           </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-zinc-100 overflow-hidden relative">
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-6">
                  <div className="relative group cursor-pointer" onClick={() => document.getElementById('avatar-upload')?.click()}>
                    <div className="w-20 h-20 rounded-full bg-secondary overflow-hidden border-2 border-primary/10 group-hover:border-primary transition-all">
                      {profile?.avatarUrl ? (
                        <img src={profile.avatarUrl} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">📸</div>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-black uppercase transition-opacity">Upload</div>
                    <input id="avatar-upload" type="file" hidden onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'avatar')} />
                  </div>
                  <h2 className="text-2xl font-black uppercase italic tracking-tighter">Influencer Data Form</h2>
                </div>
                {!editMode ? (
                  <button onClick={() => setEditMode(true)} className="bg-primary text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all">Edit Profile</button>
                ) : (
                  <button onClick={saveProfile} className="bg-green-500 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all">Save Changes</button>
                )}
              </div>

              {editMode ? (
                <div className="space-y-8">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] font-black uppercase text-zinc-400 ml-4 mb-2 block">Your Niche</label>
                      <input value={profileData.niche} onChange={e => setprofileData({...profileData, niche: e.target.value})} placeholder="Fashion, Tech, Food..." className="w-full bg-zinc-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-zinc-400 ml-4 mb-2 block">Address</label>
                      <input value={profileData.address} onChange={e => setprofileData({...profileData, address: e.target.value})} placeholder="City, Country" className="w-full bg-zinc-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-zinc-400 ml-4 mb-2 block">Public Contact Email</label>
                      <input value={profileData.contactEmail} onChange={e => setprofileData({...profileData, contactEmail: e.target.value})} placeholder="business@you.com" className="w-full bg-zinc-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-zinc-400 ml-4 mb-2 block">Contact No.</label>
                      <input value={profileData.contactNo} onChange={e => setprofileData({...profileData, contactNo: e.target.value})} placeholder="+91 ..." className="w-full bg-zinc-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-zinc-400 ml-4 mb-2 block">WhatsApp No.</label>
                      <input value={profileData.whatsappNo} onChange={e => setprofileData({...profileData, whatsappNo: e.target.value})} placeholder="+91 ..." className="w-full bg-zinc-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
                    </div>
                  </div>

                  {/* Bio & AI Section */}
                  <div className="bg-zinc-900 rounded-[2.5rem] p-8 text-white">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-6 text-primary">AI Bio Generator</h3>
                    <textarea 
                      value={rawBio} 
                      onChange={e => setRawBio(e.target.value)}
                      placeholder="Write a few lines about what you do..." 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm outline-none focus:border-primary/50 mb-4 h-24"
                    />
                    <button onClick={generateAIBio} className="w-full bg-white text-black font-black uppercase text-[10px] py-4 rounded-2xl hover:bg-primary hover:text-white transition-all">Submit to AI for Generation</button>
                    
                    {aiBios.length > 0 && (
                      <div className="mt-8 space-y-4">
                        <p className="text-[10px] font-bold text-zinc-500 uppercase">Click to select a bio:</p>
                        {aiBios.map((bio, i) => (
                          <div 
                            key={i} 
                            onClick={() => setprofileData({...profileData, bio})}
                            className={`p-4 rounded-xl border-2 transition-all cursor-pointer text-sm leading-relaxed ${profileData.bio === bio ? 'border-primary bg-primary/5' : 'border-white/5 hover:border-white/20'}`}
                          >
                            {bio}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Social Media Boxes */}
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="font-black text-sm uppercase tracking-widest">Social Media Platforms</h3>
                      <button onClick={handleAddPlatform} className="text-primary font-black text-[10px] uppercase border-b border-primary">Add Platform</button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       {profileData.socialPlatforms.map((sp, idx) => (
                         <div key={idx} className="bg-secondary p-8 rounded-[2rem] space-y-4 border border-zinc-200/50">
                            <select 
                              value={sp.platform} 
                              onChange={e => handlePlatformChange(idx, 'platform', e.target.value)}
                              className="w-full bg-white border-none rounded-xl px-4 py-3 text-xs font-bold uppercase outline-none"
                            >
                              <option value="">Select Platform</option>
                              <option value="Instagram">Instagram</option>
                              <option value="YouTube">YouTube</option>
                              <option value="Facebook">Facebook</option>
                              <option value="Snapchat">Snapchat</option>
                              <option value="Telegram">Telegram</option>
                              <option value="WhatsApp Channel">WhatsApp Channel</option>
                            </select>
                            <input placeholder="Profile Link" value={sp.profileUrl} onChange={e => handlePlatformChange(idx, 'profileUrl', e.target.value)} className="w-full bg-white rounded-xl px-4 py-3 text-xs outline-none" />
                            <div className="grid grid-cols-2 gap-3">
                               <div className="bg-white p-3 rounded-xl">
                                  <label className="text-[8px] font-black text-zinc-400 block mb-1">Followers</label>
                                  <input type="number" value={sp.followerCount} onChange={e => handlePlatformChange(idx, 'followerCount', Number(e.target.value))} className="w-full text-xs font-black outline-none" />
                               </div>
                               <div className="bg-white p-3 rounded-xl">
                                  <label className="text-[8px] font-black text-zinc-400 block mb-1">Views</label>
                                  <input type="number" value={sp.views} onChange={e => handlePlatformChange(idx, 'views', Number(e.target.value))} className="w-full text-xs font-black outline-none" />
                               </div>
                               <div className="bg-white p-3 rounded-xl">
                                  <label className="text-[8px] font-black text-zinc-400 block mb-1">Likes</label>
                                  <input type="number" value={sp.likes} onChange={e => handlePlatformChange(idx, 'likes', Number(e.target.value))} className="w-full text-xs font-black outline-none" />
                               </div>
                               <div className="bg-white p-3 rounded-xl">
                                  <label className="text-[8px] font-black text-zinc-400 block mb-1">Comments</label>
                                  <input type="number" value={sp.comments} onChange={e => handlePlatformChange(idx, 'comments', Number(e.target.value))} className="w-full text-xs font-black outline-none" />
                               </div>
                            </div>
                         </div>
                       ))}
                    </div>
                  </div>

                  {/* Creatives Section */}
                  <div className="space-y-6">
                    <h3 className="font-black text-sm uppercase tracking-widest">Brand Creatives</h3>
                    <div className="flex gap-4">
                      <button onClick={() => handleAddCreative('video')} className="bg-zinc-100 px-6 py-3 rounded-xl text-[10px] font-black uppercase">Add Video Creative</button>
                      <button onClick={() => handleAddCreative('image')} className="bg-zinc-100 px-6 py-3 rounded-xl text-[10px] font-black uppercase">Add Image Creative</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {profileData.creatives.map((c, idx) => (
                        <div key={idx} className="bg-white border border-zinc-100 p-6 rounded-[2rem] flex items-center gap-6">
                          <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center text-2xl">{c.type === 'video' ? '🎬' : '🖼️'}</div>
                          <div className="flex-1 space-y-2">
                            <input placeholder="Brand Name" value={c.brandName} onChange={e => handleCreativeChange(idx, 'brandName', e.target.value)} className="w-full text-xs font-black outline-none" />
                            <input placeholder="URL" value={c.url} onChange={e => handleCreativeChange(idx, 'url', e.target.value)} className="w-full text-[10px] text-zinc-400 outline-none" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-12 animate-in fade-in duration-500">
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-4xl">✨</div>
                    <div>
                      <h2 className="text-3xl font-black">{profile.firstName || 'Creator'}</h2>
                      <p className="text-primary font-black uppercase tracking-widest text-xs mt-1">{profile.niche || 'Digital Influencer'}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                     <div className="bg-secondary p-6 rounded-3xl">
                        <p className="text-[10px] font-black text-zinc-400 uppercase mb-2">Location</p>
                        <p className="text-sm font-bold">{profile.address || 'Global'}</p>
                     </div>
                     <div className="bg-secondary p-6 rounded-3xl">
                        <p className="text-[10px] font-black text-zinc-400 uppercase mb-2">Reach Score</p>
                        <p className="text-sm font-bold">{profile.dnaData?.score || 0}/100</p>
                     </div>
                     <div className="bg-secondary p-6 rounded-3xl">
                        <p className="text-[10px] font-black text-zinc-400 uppercase mb-2">Base Price</p>
                        <p className="text-sm font-bold text-primary">₹{Number(profile.basePrice || 0).toLocaleString()}</p>
                     </div>
                     <div className="bg-secondary p-6 rounded-3xl">
                        <p className="text-[10px] font-black text-zinc-400 uppercase mb-2">Contact</p>
                        <p className="text-sm font-bold">{profile.whatsappNo || 'Not Set'}</p>
                     </div>
                  </div>

                  <div className="bg-zinc-50 p-8 rounded-[2.5rem] border border-zinc-100">
                    <h3 className="text-[10px] font-black uppercase text-zinc-400 mb-4 tracking-widest">Public Bio</h3>
                    <p className="text-zinc-600 leading-relaxed italic">"{profile.bio}"</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {profile.socialPlatforms?.map((sp: any, i: number) => (
                      <div key={i} className="bg-white border border-zinc-100 p-8 rounded-[2.5rem] shadow-sm flex justify-between items-center">
                        <div>
                          <p className="text-[10px] font-black text-primary uppercase mb-1">{sp.platform}</p>
                          <p className="text-lg font-black tracking-tight">{sp.followerCount.toLocaleString()} <span className="text-[10px] text-zinc-400">FOLLOWERS</span></p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black text-zinc-300 uppercase mb-1">Engagement</p>
                          <p className="text-sm font-black text-zinc-500">{(sp.likes / 100).toFixed(1)}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-black text-white p-10 rounded-[3rem] relative overflow-hidden group">
               <div className="relative z-10">
                  <h3 className="text-xl font-black italic mb-6 underline decoration-primary underline-offset-8">DNA ANALYSIS</h3>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-[10px] font-black uppercase mb-2">
                        <span>Profile Quality</span>
                        <span>{profile?.dnaData?.score || 0}%</span>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${profile?.dnaData?.score || 0}%` }} />
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-zinc-500 uppercase mb-2">AI Insights</p>
                      <p className="text-xs leading-relaxed text-zinc-400">{profile?.dnaData?.aiAnalysis || 'Complete your profile to trigger AI assessment.'}</p>
                    </div>
                  </div>
               </div>
               <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-[80px]" />
            </div>

            <div className="bg-primary/5 border border-primary/10 p-10 rounded-[3.5rem] text-center">
               <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">🛡️</div>
               <h4 className="font-black text-xs uppercase tracking-widest mb-2">Escrow Protected</h4>
               <p className="text-zinc-500 text-[10px] leading-relaxed mb-6">Your earnings are secured automatically as you collaborate.</p>
               <button className="text-primary font-black text-[10px] uppercase tracking-widest border-b-2 border-primary pb-1">Learn More</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
