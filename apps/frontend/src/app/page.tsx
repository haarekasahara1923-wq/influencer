import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="flex flex-col">
        <Hero />
        
        {/* Features Section */}
        <section className="py-24 bg-secondary/50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
              Why Choose <span className="text-primary italic">InfluencerConnect</span>?
            </h2>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="p-8 glass rounded-3xl hover:scale-105 transition-all shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <span className="text-primary font-black text-xl">AI</span>
                </div>
                <h3 className="text-xl font-bold mb-4">DNA Pricing</h3>
                <p className="text-sm leading-6 text-zinc-500">
                  Our algorithm analyzes follower quality and engagement to recommend the perfect market price.
                </p>
              </div>
              <div className="p-8 glass rounded-3xl hover:scale-105 transition-all shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <span className="text-primary font-black text-xl">₹</span>
                </div>
                <h3 className="text-xl font-bold mb-4">Escrow Protection</h3>
                <p className="text-sm leading-6 text-zinc-500">
                  Payments are held securely in escrow via Razorpay and released only after content approval.
                </p>
              </div>
              <div className="p-8 glass rounded-3xl hover:scale-105 transition-all shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <span className="text-primary font-black text-xl">✓</span>
                </div>
                <h3 className="text-xl font-bold mb-4">Verified Creators</h3>
                <p className="text-sm leading-6 text-zinc-500">
                  We verify every influencer profile with social media APIs to ensure authentic audience metrics.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="py-12 border-t border-border mt-auto">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-xs font-medium text-zinc-500">
            © 2024 InfluencerConnect. All rights reserved. Built for creators and brands.
          </p>
        </div>
      </footer>
    </div>
  );
}

