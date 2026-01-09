import type { Metadata } from "next";
import { Geist, Geist_Mono, Monsieur_La_Doulaise } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Import the script font for the name - Monsieur La Doulaise
const monsieurLaDoulaise = Monsieur_La_Doulaise({
  variable: "--font-monsieur",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "jacqueline guo",
  description: "Product Designer completing CS degree at USC. Previously @Apple, landing soon @Persona.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${monsieurLaDoulaise.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
