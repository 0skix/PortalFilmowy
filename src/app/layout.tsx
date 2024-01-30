'use client'
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/UI/Navbar";
import Footer from "@/components/Footer";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function RootLayout({
  children, session
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  return (
    <html data-theme="cupcake">
      <SessionProvider session={session}>
        <body className="bg-primary">
          <Navbar />
          {children}
          <Footer />
          <ToastContainer position="bottom-right" theme="dark" />
        </body>
      </SessionProvider>
    </html >
  );
}
