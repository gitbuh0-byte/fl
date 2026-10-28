import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import logoLight from '../assets/images/logoo.png';
import logoDark from '../assets/images/logoo1.png';

interface HeaderProps {
  onNavClick: (sectionId: string) => void;
  activeSection: string;
}

export default function Header({ onNavClick, activeSection }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Services', id: 'services' },
    { name: 'Portfolio', id: 'gallery' },
    { name: 'Standards', id: 'milestones' },
    { name: 'Contact', id: 'contact' }
  ];

  const handleLinkClick = (id: string) => {
    setIsOpen(false);
    onNavClick(id);
  };

  return (
    <header
      id="header-nav"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-dark-bg/80 backdrop-blur-md border-b border-card-border/60 py-4 shadow-lg' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo / Brand */}
        <div 
          className="flex items-center space-x-3 cursor-pointer group"
          onClick={() => handleLinkClick('hero')}
        >
          <img 
            src={scrolled ? logoLight : logoDark} 
            alt="Forgelinea Logo" 
            referrerPolicy="no-referrer"
            className="w-16 h-16 object-contain"
          />
          <div>
            <span className={`font-display font-bold text-xl tracking-tight ${scrolled ? 'text-slate-900' : 'text-white'}`}>
              forgelinea engineering
            </span>
          </div>
        </div>

        {/* Center - Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.id)}
              className={`font-sans text-sm tracking-wide transition-colors duration-200 relative py-1 cursor-pointer ${
                activeSection === link.id 
                  ? 'text-accent-blue font-semibold' 
                  : scrolled 
                    ? 'text-slate-600 hover:text-slate-900' 
                    : 'text-white hover:text-slate-200'
              }`}
            >
              {link.name}
              {activeSection === link.id && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-accent-blue rounded-full" />
              )}
            </button>
          ))}
        </nav>

        {/* Right - Contact CTA Button */}
        <div className="hidden lg:block">
          <button
            onClick={() => handleLinkClick('contact')}
            className="group relative inline-flex items-center justify-center px-6 py-2.5 rounded-full overflow-hidden font-display text-sm font-semibold tracking-wide text-white bg-slate-900 hover:text-white border border-slate-900 hover:border-accent-blue transition-all duration-300 cursor-pointer shadow-md hover:shadow-accent-blue/20"
          >
            <div className="absolute inset-0 w-0 bg-accent-blue transition-all duration-300 ease-out group-hover:w-full" />
            <span className="relative flex items-center space-x-1.5 z-10">
              <span>Let's Talk</span>
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </button>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`lg:hidden p-2 focus:outline-none transition-colors cursor-pointer ${scrolled ? 'text-slate-600 hover:text-slate-900' : 'text-white hover:text-slate-200'}`}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer menu */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-lg border-b border-slate-200 px-6 py-8 shadow-xl flex flex-col space-y-6">
          <nav className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`text-left font-sans text-base py-2 border-b border-slate-100 transition-colors ${
                  activeSection === link.id 
                    ? 'text-accent-blue font-semibold' 
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                {link.name}
              </button>
            ))}
          </nav>
          
          <button
            onClick={() => handleLinkClick('contact')}
            className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-slate-900 text-white font-display font-semibold tracking-wide hover:bg-accent-blue hover:text-white transition-all cursor-pointer"
          >
            <span>Let's Talk</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </header>
  );
}
