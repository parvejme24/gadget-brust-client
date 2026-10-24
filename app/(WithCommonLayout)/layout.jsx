import React from "react";
import Header from "@/components/Shared/Header/Header";
import Footer from "@/components/Shared/Footer/Footer";

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
