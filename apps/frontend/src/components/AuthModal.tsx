'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }: { 
  isOpen: boolean; 
  onClose: () => void; 
  initialMode?: 'login' | 'register' 
}) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [authMethod, setAuthMethod] = useState<'email' | 'mobile'>('mobile');
  const [role, setRole] = useState<'INFLUENCER' | 'BUSINESS'>('INFLUENCER');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorInfo, setErrorInfo] = useState('');
  
  const router = useRouter();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorInfo('');
    
    // Mock OTP flow if mobile is selected
    if (authMethod === 'mobile' && !otpSent) {
      setTimeout(() => {
        setOtpSent(true);
        setLoading(false);
      }, 1000);
      return;
    }

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    // Fallback Mock email/password if OTP was submitted
    if (authMethod === 'mobile' && otpSent) {
        data.email = data.mobileNumber + '@mock.com';
        data.password = 'mockpassword';
    }
    
    try {
      const endpoint = mode === 'register' ? '/auth/register' : '/auth/login';
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, role }),
      });

      if (!response.ok) {
         const errData = await response.json().catch(() => ({}));
         throw new Error(errData.message || 'Authentication failed. Incorrect credentials.');
      }
      
      const result = await response.json();
      localStorage.setItem('access_token', result.accessToken);
      localStorage.setItem('user_role', result.user.role);
      
      onClose(); // Close modal instantly for good UX
      
      // Force redirect to dashboard
      const dashboardPath = `/dashboard/${result.user.role.toLowerCase()}`;
      window.location.href = dashboardPath;
      
    } catch (err) {
      setErrorInfo(err instanceof Error ? err.message : 'Something went wrong');
      setOtpSent(false); // Reset OTP state if login fails
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex min-h-full items-center justify-center p-4 sm:p-6 overflow-y-auto overflow-x-hidden">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      
      <div className="bg-white w-full max-w-4xl rounded-[2.5rem] overflow-hidden shadow-2xl relative flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-400 z-10 min-h-[600px] my-auto">
        {/* Left Side: Branding / Image */}
        <div className="hidden md:flex md:w-5/12 bg-primary relative p-10 flex-col justify-between overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
           {/* Abstract shapes or image could go here */}
           <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3" />
           <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-black/20 rounded-full blur-[60px] translate-y-1/3 -translate-x-1/4" />
           
           <div className="relative z-20">
             <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-2xl rotate-[-5deg] mb-6">
                <span className="text-primary font-black text-3xl italic tracking-tighter">I</span>
             </div>
           </div>
           
           <div className="relative z-20 space-y-4">
              <h2 className="text-4xl font-black italic text-white leading-tight uppercase tracking-tighter">
                {mode === 'login' ? 'Welcome Back To The Elite Network' : 'Join India\'s Largest Creator Connect'}
              </h2>
              <p className="text-white/80 font-bold text-sm leading-relaxed">
                Connect with premium brands, secure your payments via Escrow, and skyrocket your digital reach.
              </p>
           </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-7/12 p-8 sm:p-12 bg-zinc-50/50 relative">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 bg-white rounded-full flex items-center justify-center text-zinc-400 hover:text-black hover:bg-zinc-100 transition-all shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>

          <div className="max-w-md mx-auto h-full flex flex-col justify-center pt-8">
            <div className="mb-8">
              <h2 className="text-3xl font-black mb-2 text-foreground tracking-tight">
                {mode === 'login' ? 'Sign In' : 'Create Account'}
              </h2>
              <p className="text-zinc-500 text-sm font-medium">
                {mode === 'login' ? 'Enter your details to access your dashboard.' : 'Start your journey with us today.'}
              </p>
            </div>

            {mode === 'register' && (
              <div className="flex p-1 bg-zinc-200/50 rounded-2xl mb-8 border border-zinc-200">
                <button 
                  onClick={() => setRole('INFLUENCER')}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${role === 'INFLUENCER' ? 'bg-white shadow-sm text-primary' : 'text-zinc-500 hover:text-zinc-700'}`}
                >
                  Influencer
                </button>
                <button 
                  onClick={() => setRole('BUSINESS')}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${role === 'BUSINESS' ? 'bg-white shadow-sm text-primary' : 'text-zinc-500 hover:text-zinc-700'}`}
                >
                  Business
                </button>
              </div>
            )}

            <div className="flex gap-4 mb-8">
               <button 
                 onClick={() => { setAuthMethod('mobile'); setOtpSent(false); }}
                 className={`flex-1 pb-3 text-xs font-black uppercase tracking-widest border-b-2 transition-all ${authMethod === 'mobile' ? 'border-primary text-primary' : 'border-transparent text-zinc-400 hover:text-zinc-600'}`}
               >
                 Mobile OTP
               </button>
               <button 
                 onClick={() => setAuthMethod('email')}
                 className={`flex-1 pb-3 text-xs font-black uppercase tracking-widest border-b-2 transition-all ${authMethod === 'email' ? 'border-primary text-primary' : 'border-transparent text-zinc-400 hover:text-zinc-600'}`}
               >
                 Email ID
               </button>
            </div>

            {errorInfo && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold border border-red-100 flex items-center gap-3">
                 <span>⚠️</span> {errorInfo}
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              {mode === 'register' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 ml-2">Full Name</label>
                  <input 
                    name="firstName"
                    type="text" 
                    required={mode === 'register'}
                    placeholder="Enter your full name"
                    className="w-full bg-white border border-zinc-200 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  />
                </div>
              )}

              {authMethod === 'mobile' ? (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                   <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 ml-2">Mobile Number</label>
                   <div className="flex gap-3">
                     <div className="bg-zinc-100 border border-zinc-200 rounded-2xl px-4 py-4 text-sm font-bold text-zinc-500 flex items-center justify-center">
                        +91
                     </div>
                     <input 
                        name="mobileNumber"
                        type="tel" 
                        required
                        placeholder="00000 00000"
                        className="flex-1 bg-white border border-zinc-200 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                     />
                   </div>
                   {otpSent && (
                     <div className="mt-5 animate-in fade-in slide-in-from-top-2 duration-300">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 ml-2">Enter OTP</label>
                        <input 
                          name="otp"
                          type="text" 
                          required
                          placeholder="4-digit OTP"
                          className="w-full bg-white border border-zinc-200 rounded-2xl px-6 py-4 pl-6 text-2xl tracking-[1em] focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none font-black text-center"
                        />
                     </div>
                   )}
                </div>
              ) : (
                <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 ml-2">Email Address</label>
                    <input 
                      name="email"
                      type="email" 
                      required
                      placeholder="name@example.com"
                      className="w-full bg-white border border-zinc-200 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 ml-2">Password</label>
                    <input 
                      name="password"
                      type="password" 
                      required
                      placeholder="••••••••"
                      className="w-full bg-white border border-zinc-200 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                    />
                  </div>
                </div>
              )}
              
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-primary text-white font-black uppercase text-xs tracking-widest py-4 rounded-xl shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100 flex justify-center items-center gap-2 mt-4"
              >
                {loading ? (
                   <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                   authMethod === 'mobile' && !otpSent ? 'Send OTP' : (mode === 'login' ? 'Login Securely' : 'Create Account')
                )}
              </button>
            </form>

            <div className="relative my-8">
               <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-200"></div></div>
               <div className="relative flex justify-center text-sm"><span className="px-4 bg-zinc-50 text-[10px] font-black uppercase tracking-widest text-zinc-400">Or continue with</span></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <button type="button" className="flex items-center justify-center gap-3 bg-white border border-zinc-200 py-3 rounded-xl hover:bg-zinc-50 transition-colors shadow-sm active:scale-95">
                  <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Facebook</span>
               </button>
               <button type="button" className="flex items-center justify-center gap-3 bg-white border border-zinc-200 py-3 rounded-xl hover:bg-zinc-50 transition-colors shadow-sm active:scale-95">
                  <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.43.916 3.96.948 1.637.026 2.62-1.453 3.608-2.918 1.15-1.68 1.625-3.32 1.644-3.41-.035-.015-3.193-1.22-3.23-4.852-.031-3.036 2.478-4.498 2.593-4.57-1.436-2.103-3.665-2.39-4.502-2.434-.038-.002-.075-.008-.112-.014-.15-.02-.303-.04-.458-.04zm1.7-4.116c.801-.97 1.34-2.319 1.196-3.665-1.159.046-2.583.77-3.418 1.73-.75.814-1.396 2.18-1.218 3.504 1.282.1 2.614-.627 3.44-1.569z" /></svg>
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Apple</span>
               </button>
            </div>

            <div className="mt-8 text-center text-sm font-medium">
              <span className="text-zinc-500">
                {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
              </span>
              <button 
                type="button"
                onClick={() => {
                  setMode(mode === 'login' ? 'register' : 'login');
                  setErrorInfo('');
                }}
                className="ml-2 text-primary font-black uppercase tracking-widest text-[10px] hover:underline"
              >
                {mode === 'login' ? 'Sign Up' : 'Log In'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
