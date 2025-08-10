import { useState } from "react";
import Sidebar from "./sidebar";
import Header from "./header";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 to-blue-50 animate-fade-in">
      <Sidebar 
        isMobileMenuOpen={isMobileMenuOpen} 
        setIsMobileMenuOpen={setIsMobileMenuOpen} 
      />
      
      <Header onMobileMenuToggle={toggleMobileMenu} />
      
      <main className="flex-1 flex flex-col pt-16">
        <div className="flex-1 overflow-auto p-6">
          <div className="animate-slide-up">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}