import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "InfluencerConnect – Global Influencer Marketplace",
  description: "Connect brands with verified influencers via AI-powered pricing and escrow-protected campaigns.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased">
      <body className={`${inter.className} min-h-screen bg-white text-foreground`}>
        {children}
      </body>
    </html>
  );
}
