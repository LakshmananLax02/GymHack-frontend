import type { Metadata } from "next";
import { Oswald, Overpass } from 'next/font/google';
import "./globals.css";
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import { AuthProvider } from './context/AuthContext'; // 1. Import your AuthProvider
import Script from 'next/script'; // 2. Import Script for Razorpay

const oswald = Oswald({
  subsets: ['latin'],
  variable: '--font-oswald',
  weight: ['400', '700'],
});

const overpass = Overpass({
  subsets: ['latin'],
  variable: '--font-overpass',
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  title: "Gym Hack | Fuel Your Body",
  description: "High-quality nutrition for your workouts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${oswald.variable} ${overpass.variable} h-full antialiased`}
    >
      <head>
        {/* Standard Way to add Razorpay in Next.js */}
        <Script 
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className="min-h-full flex flex-col">
        {/* 3. Wrap everything in AuthProvider so Signup/Login/Cart can work */}
        <AuthProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}