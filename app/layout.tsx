import type { Metadata } from "next";
import { Oswald, Overpass } from 'next/font/google';
import "./globals.css";
import Navbar from './Components/Navbar';
import Footer from './Components/Footer'

const oswald = Oswald({
  subsets: ['latin'],
  variable: '--font-oswald',
  weight: ['400', '700'], // Add weights you need
});

// Secondary text font
const overpass = Overpass({
  subsets: ['latin'],
  variable: '--font-overpass',
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  title: "Gym Hack | Fuel Your Body",
  description: "High-quality nutrition for your workouts",
};
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      // 2. These variables now exist and can be used here
      className={`${oswald.variable} ${overpass.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        {children}
        <Footer/>

      </body>
    </html>
  );
}