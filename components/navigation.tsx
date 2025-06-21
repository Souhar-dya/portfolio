"use client";

import { useState, useEffect } from "react";
import { Menu, X, Home, User, Code, Briefcase, Mail } from "lucide-react";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Update active section based on scroll position
      const sections = ["home", "about", "skills", "projects", "contact"];
      const current = sections.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });
    }
    setIsOpen(false);
  };

  const navItems = [
    { href: "home", label: "Home", icon: Home },
    { href: "about", label: "About", icon: User },
    { href: "skills", label: "Skills", icon: Code },
    { href: "projects", label: "Projects", icon: Briefcase },
    { href: "contact", label: "Contact", icon: Mail },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? "bg-slate-900/80 backdrop-blur-xl border-b border-white/5 shadow-2xl"
            : "bg-transparent"
        }`}
      >
        <div className="container-modern">
          <div className="flex justify-between items-center py-6">
            <div
              className="text-2xl font-bold text-gradient cursor-pointer"
              onClick={() => scrollToSection("home")}
            >
              Souhardya Kundu
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.href}
                    onClick={() => scrollToSection(item.href)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                      activeSection === item.href
                        ? "bg-white/10 text-white shadow-lg"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon size={18} />
                    {item.label}
                  </button>
                );
              })}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div
          className="absolute inset-0 bg-slate-900/90 backdrop-blur-xl"
          onClick={() => setIsOpen(false)}
        />
        <div
          className={`absolute right-4 top-20 card-modern p-6 min-w-[250px] transition-all duration-500 ${
            isOpen ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
          }`}
        >
          {navItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={item.href}
                onClick={() => scrollToSection(item.href)}
                className={`flex items-center gap-3 w-full p-3 rounded-xl font-medium transition-all duration-300 mb-2 ${
                  activeSection === item.href
                    ? "bg-white/10 text-white"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Icon size={20} />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 z-50 bg-slate-800">
        <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300" />
      </div>
    </>
  );
}
