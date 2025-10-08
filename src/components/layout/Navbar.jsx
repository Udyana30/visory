"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Menu, X } from "lucide-react";

const AuthenticatedNav = ({ user, isDark }) => (
  <Link 
    href="/home" 
    className={`flex items-center gap-3 transition-all duration-300 px-4 py-2 rounded-lg ${
      isDark 
        ? "bg-white/10 hover:bg-white/20 backdrop-blur-sm" 
        : "bg-black/10 hover:bg-black/20 backdrop-blur-sm"
    }`}
  >
    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
      isDark ? "bg-white text-[#252525]" : "bg-[#252525] text-white"
    }`}>
      {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
    </div>
    <span className={`text-sm font-medium hidden sm:block ${
      isDark ? "text-white" : "text-[#252525]"
    }`}>
      Go to Dashboard
    </span>
  </Link>
);

const GuestNav = ({ isDark }) => (
  <Link href="/login">
    <button className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
      isDark 
        ? "bg-white text-[#252525] hover:bg-gray-200" 
        : "bg-[#252525] text-white hover:bg-[#353535]"
    }`}>
      Get Started
    </button>
  </Link>
);

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const { isAuthenticated, user } = useAuth();
  
  const navLinks = ["FEATURES", "STUDIOS", "RESOURCES", "PRICING"];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      
      // Check if scrolled past hero section
      setScrolled(scrollPosition > 50);
      
      // Detect background color at navbar position
      const navbar = document.querySelector('nav');
      if (navbar) {
        const rect = navbar.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        
        // Get element behind navbar
        navbar.style.pointerEvents = 'none';
        const elementBehind = document.elementFromPoint(x, y);
        navbar.style.pointerEvents = 'auto';
        
        if (elementBehind) {
          const bgColor = window.getComputedStyle(elementBehind).backgroundColor;
          const rgb = bgColor.match(/\d+/g);
          
          if (rgb) {
            // Calculate luminance
            const luminance = (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;
            setIsDark(luminance < 0.5);
          }
        }
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    scrolled 
      ? isDark 
        ? "bg-[#252525]/80 backdrop-blur-md shadow-lg" 
        : "bg-white/80 backdrop-blur-md shadow-lg"
      : "bg-transparent"
  }`;

  const textColor = isDark ? "text-white" : "text-[#252525]";
  const hoverColor = isDark ? "hover:text-gray-300" : "hover:text-gray-600";
  const borderColor = isDark ? "border-white/20" : "border-gray-200";

  return (
    <nav className={navClasses}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          <Link href="/" className={`text-2xl font-bold transition-colors duration-300 ${textColor}`}>
            visory
          </Link>

          {/* === Desktop Menu === */}
          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                className={`text-sm font-medium transition-colors duration-300 ${textColor} ${hoverColor}`}
              >
                {item}
              </a>
            ))}
          </div>

          {/* === Desktop Auth Section === */}
          <div className="hidden md:flex">
            {isAuthenticated ? (
              <AuthenticatedNav user={user} isDark={isDark} />
            ) : (
              <GuestNav isDark={isDark} />
            )}
          </div>

          {/* === Mobile Menu Button === */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden transition-colors duration-300 focus:outline-none ${textColor} ${hoverColor}`}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* === Mobile Menu === */}
      {isMenuOpen && (
        <div className={`md:hidden border-t transition-colors duration-300 ${
          isDark ? "bg-[#252525]/95 backdrop-blur-md" : "bg-white/95 backdrop-blur-md"
        } ${borderColor}`}>
          <div className="px-4 pt-4 pb-3 space-y-3">
            {navLinks.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className={`block text-base font-medium transition-colors duration-300 ${textColor} ${hoverColor}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            <div className={`pt-4 border-t ${borderColor}`}>
              {isAuthenticated ? (
                <AuthenticatedNav user={user} isDark={isDark} />
              ) : (
                <GuestNav isDark={isDark} />
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}