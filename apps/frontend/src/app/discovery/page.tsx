import Navbar from "@/components/Navbar";
import DiscoveryCard from "@/components/DiscoveryCard";

const MOCK_INFLUENCERS = [
  { id: 1, name: "Aria Sharma", niche: "Fashion & Lifestyle", reach: "2.4M", engagement: 4.8, price: 25000 },
  { id: 2, name: "Kabir Singh", niche: "Tech & Gadgets", reach: "850k", engagement: 6.2, price: 15000 },
  { id: 3, name: "Meera Patel", niche: "Fitness & Health", reach: "1.1M", engagement: 5.4, price: 18000 },
  { id: 4, name: "Rahul Verma", niche: "Travel & Photo", reach: "500k", engagement: 7.1, price: 12000 },
  { id: 5, name: "Sneha Kapur", niche: "Beauty & Makeup", reach: "3.2M", engagement: 3.9, price: 35000 },
  { id: 6, name: "Ishaan Mehta", niche: "Finance & Stocks", reach: "200k", engagement: 8.5, price: 45000 },
];

export default function DiscoveryPage() {
  return (
    <div className="min-h-screen bg-secondary/30">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <header className="mb-16 text-center">
          <h2 className="text-sm font-black text-primary uppercase tracking-[0.3em] mb-4 overflow-hidden">
             Network Discovery
          </h2>
          <h1 className="text-4xl font-black tracking-tighter text-foreground sm:text-6xl mb-6">
            Find your perfect <span className="text-primary italic">match</span>
          </h1>
          <p className="text-zinc-500 max-w-xl mx-auto font-medium text-lg leading-relaxed">
            Discover verified creators through our AI-driven matching engine. 
            Real-time social metrics and transparent pricing.
          </p>
        </header>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-20 bg-white/50 backdrop-blur-md p-3 rounded-[2rem] border border-border/50 max-w-fit mx-auto shadow-sm">
           <button className="px-6 py-3 rounded-2xl bg-primary text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20">All Categories</button>
           <button className="px-6 py-3 rounded-2xl hover:bg-zinc-100 transition-colors font-black text-xs uppercase tracking-widest text-zinc-500">Fashion</button>
           <button className="px-6 py-3 rounded-2xl hover:bg-zinc-100 transition-colors font-black text-xs uppercase tracking-widest text-zinc-500">Technology</button>
           <button className="px-6 py-3 rounded-2xl hover:bg-zinc-100 transition-colors font-black text-xs uppercase tracking-widest text-zinc-500">Beauty</button>
           <button className="px-6 py-3 rounded-2xl hover:bg-zinc-100 transition-colors font-black text-xs uppercase tracking-widest text-zinc-500">Fitness</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {MOCK_INFLUENCERS.map((influencer) => (
            <DiscoveryCard key={influencer.id} influencer={influencer} />
          ))}
        </div>
        
        <div className="mt-24 text-center">
           <button className="bg-foreground text-background font-black text-xs uppercase tracking-widest px-12 py-5 rounded-3xl hover:bg-[#333] transition-all shadow-2xl shadow-foreground/10 hover:-translate-y-1">
             Load More Creators
           </button>
        </div>
      </main>
    </div>
  );
}
