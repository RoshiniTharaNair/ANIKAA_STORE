"use client";
// import FooterComponent from "@/components/store-layout/footer/FooterComponent";
import Footer from "@/components/layout/footer/Footer";
import ChatFooter from "@/components/layout/chat-footer/ChatFooter";
import NavBar from "@/components/store-layout/navbar/Navbar";
import React, { Suspense } from 'react';
import LoadingSpinner from "@/components/loader"; // Import your loading spinner component

export default function PageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div>
        <NavBar />
        <div> {/* Adjust marginTop as needed */}
          {children}
        </div>
        <Footer />
        <ChatFooter />
      </div>
    </Suspense>
  );
}
