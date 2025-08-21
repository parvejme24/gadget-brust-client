import React from "react";
import Navbar from "@/components/Shared/Navbar/Navbar";
import Footer from "@/components/Shared/Footer/Footer";
import TopNav from "@/components/Shared/TopNav/TopNav";
import NavItemsBar from "@/components/Shared/NavItemsBar/NavItemsBar";

export default function Layout({ children }) {
  return (
    <div>
      <TopNav />
      <div className="sticky top-0 z-50">
        <Navbar />
        <NavItemsBar />
      </div>
      {children}
      <Footer />
    </div>
  );
}
