import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import AppWrapper from "@/components/AppWrapper"; // 👈 Wraps RouteLoader
import RouteLoader from '../components/RouteLoader'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RateMyTA | Review Your TAs",
  description: "Review teaching assistants, browse schools, and leave feedback to help others.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AppWrapper>
          <RouteLoader /> {/* Global spinner */}
          <Navbar />
          {children}
        </AppWrapper>
      </body>
    </html>
  )
}