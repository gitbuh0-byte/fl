import React from 'react';
import { Instagram, Linkedin, Facebook } from 'lucide-react';
import logoDark from '../assets/images/logoo1.png';

interface FooterProps {
  onNavClick: (sectionId: string) => void;
}

export default function Footer({ onNavClick }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const handleLinkClick = (id: string) => {
    onNavClick(id);
  };

  const footerLinks = [
    { name: 'Services', id: 'services' },
    { name: 'Portfolio', id: 'gallery' },
    { name: 'Standards', id: 'milestones' },
    { name: 'Contact', id: 'contact' }
  ];

  return (
    <footer className="bg-slate-900 border-t border-slate-800 pt-20 pb-12 relative overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-accent-blue/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 flex flex-col space-y-16">
        
        {/* Top footer row: Logo on left, navigation lists on right */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          
          {/* Logo brand and legal status */}
          <div className="md:col-span-5 flex flex-col space-y-4">
            <div 
              className="flex items-center space-x-3 cursor-pointer group w-fit"
              onClick={() => handleLinkClick('hero')}
            >
              <img 
                src={logoDark} 
                alt="Forgelinea Logo" 
                referrerPolicy="no-referrer"
                className="w-16 h-16 object-contain"
              />
              <span className="font-display font-bold text-white text-xl tracking-tight">
                forgelinea engineering
              </span>
            </div>
            
            <div className="flex items-center space-x-4 pt-2">
              <a 
                href="https://instagram.com/forgelinea.engineering" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-slate-300 hover:text-white transition-colors p-1"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-slate-300 hover:text-white transition-colors p-1"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-slate-300 hover:text-white transition-colors p-1"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick links and services segments */}
          <div className="md:col-span-7 grid grid-cols-2 gap-8">
            
            {/* Nav Links column */}
            <div className="flex flex-col space-y-4">
              <h4 className="font-mono text-[10px] text-white uppercase tracking-widest font-bold">COMPANY NAVIGATION</h4>
              <ul className="flex flex-col space-y-2 text-xs text-slate-300">
                {footerLinks.map((link) => (
                  <li key={link.id}>
                    <button
                      onClick={() => handleLinkClick(link.id)}
                      className="text-slate-300 hover:text-white transition-colors duration-200 cursor-pointer text-left font-medium"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services Segment Column */}
            <div className="flex flex-col space-y-4">
              <h4 className="font-mono text-[10px] text-white uppercase tracking-widest font-bold">CORE SERVICES</h4>
              <ul className="flex flex-col space-y-2 text-xs text-slate-300">
                <li><button onClick={() => handleLinkClick('services')} className="text-slate-300 hover:text-white transition-colors cursor-pointer text-left font-medium">Structural Steel Engineering</button></li>
                <li><button onClick={() => handleLinkClick('services')} className="text-slate-300 hover:text-white transition-colors cursor-pointer text-left font-medium">Architectural Metalwork</button></li>
                <li><button onClick={() => handleLinkClick('services')} className="text-slate-300 hover:text-white transition-colors cursor-pointer text-left font-medium">Laser Cutting & Fabrication</button></li>
                <li><button onClick={() => handleLinkClick('services')} className="text-slate-300 hover:text-white transition-colors cursor-pointer text-left font-medium">Quality Assurance & Testing</button></li>
                <li><button onClick={() => handleLinkClick('services')} className="text-slate-300 hover:text-white transition-colors cursor-pointer text-left font-medium">Engineering Delivery</button></li>
              </ul>
            </div>

          </div>
        </div>

        {/* Legal Row and Copyright details */}
        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-300 font-medium font-sans">
          <div>
            <p className="text-slate-300">© {currentYear} forgelinea engineering. All rights reserved.</p>
          </div>
          <div className="flex items-center space-x-6 font-medium">
            <a href="#services" className="text-slate-300 hover:text-white transition-colors">Services</a>
            <a href="#gallery" className="text-slate-300 hover:text-white transition-colors">Portfolio</a>
            <a href="#contact" className="text-slate-300 hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
