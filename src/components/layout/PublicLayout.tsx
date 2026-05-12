import Navbar from "../organisms/Navbar";
import Footer from "../organisms/Footer";
import React from "react";
import { ThemeToggle } from "../atoms/ThemeButton";
interface Props {
  children: React.ReactNode;
}
export default function PublicLayout({ children }: Props) {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
      <ThemeToggle />
      <Footer />
    </div>
  );
}
