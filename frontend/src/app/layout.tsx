import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Event Manager | Dashboard",
  description: "Minimalist Event Manager Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} antialiased bg-white text-black min-h-screen flex flex-col`}
      >
        <header className="border-b border-gray-200 py-6 px-8">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-serif font-bold tracking-tight">EVENT MANAGER.</h1>
            <nav className="text-sm uppercase tracking-widest font-medium">
              <a href="/" className="hover:text-accent transition-colors">Dashboard</a>
            </nav>
          </div>
        </header>
        <main className="flex-1 w-full max-w-6xl mx-auto p-8">
          {children}
        </main>
        <footer className="border-t border-gray-200 py-8 text-center text-sm text-gray-500 uppercase tracking-widest">
          &copy; {new Date().getFullYear()} Event Manager
        </footer>
      </body>
    </html>
  );
}
