'use client'
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/UI/Navbar";
import Footer from "@/components/Footer";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";


export default function RootLayout({
  children, session
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  return (
    <html lang="en">
      <SessionProvider session={session}>
        <body>
          <Navbar />
          {children}
          <Footer />
        </body>
      </SessionProvider>
    </html>
  );
}
