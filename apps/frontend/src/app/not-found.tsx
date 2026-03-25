import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-10">
      <div className="text-center">
        <h2 className="text-sm font-black text-primary uppercase tracking-[0.3em] mb-4 overflow-hidden animate-pulse">
           Channel Inactive
        </h2>
        <h1 className="text-6xl font-black mb-8 tracking-tighter uppercase italic leading-none">
          404 <span className="text-primary not-italic">Error</span>
        </h1>
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] mb-12 max-w-xs mx-auto leading-relaxed">
          The requested creator portal or collaboration channel is currently offline or has moved to a private escrow.
        </p>
        <Link 
          href="/" 
          className="bg-primary text-white font-black text-xs uppercase tracking-widest px-12 py-6 rounded-3xl shadow-2xl shadow-primary/20 hover:scale-105 transition-transform inline-block"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
