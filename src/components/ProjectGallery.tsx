import React, { useState, useEffect } from 'react';
import { projectsData } from '../data';
import { Project } from '../types';
import { ArrowUpRight, Info, ShieldCheck, Scale, Ruler, X } from 'lucide-react';
import { motion } from 'motion/react';

const titleVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7
    }
  }
};

const filterVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6
    }
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.75
    }
  }
};

interface ProjectGalleryProps {
  onSelectProjectForQuote: (projectName: string) => void;
}

export default function ProjectGallery({ onSelectProjectForQuote }: ProjectGalleryProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [headerOffset, setHeaderOffset] = useState<number>(0);

  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedProject]);

  useEffect(() => {
    const computeHeader = () => {
      const header = document.getElementById('header-nav');
      const h = header ? header.getBoundingClientRect().height : 0;
      setHeaderOffset(h + 8); // small gap below header
    };

    computeHeader();
    window.addEventListener('resize', computeHeader);
    window.addEventListener('scroll', computeHeader);
    window.addEventListener('load', computeHeader);
    return () => {
      window.removeEventListener('resize', computeHeader);
      window.removeEventListener('scroll', computeHeader);
      window.removeEventListener('load', computeHeader);
    };
  }, []);

  const categories = [
    { label: 'All Projects', id: 'all' },
    { label: 'Heavy Structural', id: 'structural' },
    { label: 'Architectural Steel', id: 'architectural' },
    { label: 'Precision Laser', id: 'laser-cutting' },
    { label: 'Heavy Industrial', id: 'heavy-industrial' }
  ];

  const filteredProjects = (activeCategory === 'all'
    ? projectsData
    : projectsData.filter(p => p.category === activeCategory)
  ).slice(0, 3);

  return (
    <section id="gallery" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-accent-blue/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header for the Forgelinea project portfolio */}
        <motion.div 
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={titleVariants}
        >
          <div>
            <p className="font-mono text-xs text-accent-blue uppercase tracking-widest font-bold">PORTFOLIO</p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-[#0D1F33] tracking-tight mt-2">
              Forgelinea project showcase <br />
              for precision steel systems
            </h2>
          </div>
        </motion.div>

        {/* Category Filters Tab Row */}
        <motion.div 
          className="flex flex-wrap gap-2.5 mb-10 pb-2 border-b border-slate-100"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={filterVariants}
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`py-2.5 px-5 font-display text-sm font-semibold tracking-wide rounded-full transition-all duration-300 border cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-accent-blue border-accent-blue text-white shadow-md shadow-accent-blue/15'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* Staggered project cards for featured fabrication work */}
        <motion.div 
          key={activeCategory} // Seamless entrance transition triggered on filter select too!
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={containerVariants}
        >
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              onClick={() => setSelectedProject(project)}
              variants={itemVariants}
              className="group bg-[#0D1F33] border border-[#13476B]/40 custom-dark-card rounded-[3%] overflow-hidden cursor-pointer flex flex-col h-full relative shadow-sm hover:shadow-md hover:border-blue-400/40 transition-all duration-300"
            >
              {/* Image box with transition */}
              <div className="relative h-56 w-full overflow-hidden bg-slate-950/20 rounded-[3%]">
                <img
                   src={project.image}
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95 rounded-[3%]"
                />
                {/* Year indicator tag */}
                <div className="absolute top-4 right-4 bg-[#0D1F33]/95 backdrop-blur-sm border border-[#13476B]/50 px-2.5 py-1 rounded font-mono text-[10px] text-[#2E8BC0] font-bold uppercase tracking-wider shadow-sm">
                  {project.year}
                </div>
              </div>

              {/* Card info body */}
              <div className="p-6 flex flex-col flex-grow justify-between bg-[#0D1F33]">
                <div>
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.tags.slice(0, 2).map((tag, i) => (
                      <span key={i} className="bg-[#13476B]/30 text-[#2E8BC0] font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded font-bold border border-[#13476B]/20">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Title & Arrow */}
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-display font-bold text-lg text-[#fff] group-hover:text-[#2E8BC0] transition-colors duration-200 leading-snug">
                      {project.title}
                    </h3>
                    <div className="w-8 h-8 rounded-full border border-[#13476B]/50 flex items-center justify-center text-[#2E8BC0] group-hover:text-[#fff] group-hover:border-[#2E8BC0] group-hover:bg-[#13476B]/30 transition-all duration-300 ml-2 shrink-0">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Short Description */}
                  <p className="font-sans text-slate-300 text-sm line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Specs quick view footer */}
                <div className="grid grid-cols-2 gap-2 mt-6 pt-4 border-t border-[#13476B]/30">
                  <div className="flex items-center space-x-1.5">
                    <Ruler className="w-3.5 h-3.5 text-[#2E8BC0]" />
                    <span className="font-mono text-[10px] text-[#2E8BC0] font-semibold truncate">{project.specs.tolerance}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Scale className="w-3.5 h-3.5 text-[#2E8BC0]" />
                    <span className="font-mono text-[10px] text-[#2E8BC0] font-semibold truncate">{project.specs.weight || 'Precision Part'}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>

      {/* Dynamic Project Details Modal Overlay */}
      {selectedProject && (
        <div
          className="fixed left-0 right-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-md overflow-y-auto"
          style={{ top: headerOffset + 140, bottom: 20, paddingLeft: 20, paddingRight: 20 }}
        >
          <div
            className="bg-white border border-slate-200 w-full max-w-[1120px] rounded-[24px] shadow-2xl overflow-hidden relative flex flex-col md:flex-row"
            style={{ maxHeight: `calc(100vh - ${headerOffset + 80}px)` }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-3 sm:top-4 right-3 sm:right-4 p-2 sm:p-2.5 rounded-full bg-white/95 border border-slate-200 hover:border-accent-blue text-slate-500 hover:text-slate-800 transition-colors z-20 cursor-pointer shadow-sm"
              aria-label="Close modal"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Left Column (Image) - full height on md+, fixed height on mobile */}
            <div className="w-full md:w-[35%] h-36 sm:h-48 md:h-full relative overflow-hidden bg-slate-900 shrink-0">
              <img
                src={selectedProject.image}
                alt={selectedProject.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D1F33]/80 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#0D1F33]/20" />
              
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4">
                <span className="bg-accent-blue text-white font-mono text-[9px] sm:text-[10px] uppercase tracking-wider px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded font-bold shadow-sm">
                  {selectedProject.category.replace('-', ' ')}
                </span>
              </div>
            </div>

            {/* Right Column (Content) */}
            <div className="w-full md:w-[65%] p-5 sm:p-6 flex flex-col justify-between overflow-y-auto h-full">
              <div className="flex flex-col space-y-3 sm:space-y-4">
                <div>
                  <h3 className="font-display font-bold text-lg sm:text-xl md:text-2xl text-[#0D1F33] tracking-tight leading-snug">
                    {selectedProject.title}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                  {/* Left Sub-column: Description & Challenges */}
                  <div className="md:col-span-7 flex flex-col space-y-3 sm:space-y-4">
                    <div>
                      <h4 className="font-mono text-[9px] sm:text-[10px] text-accent-blue uppercase tracking-wider font-bold mb-1 flex items-center space-x-1">
                        <Info className="w-3.5 h-3.5" />
                        <span>Project Overview</span>
                      </h4>
                      <p className="font-sans text-slate-600 text-xs sm:text-sm leading-relaxed">
                        {selectedProject.description}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-mono text-[9px] sm:text-[10px] text-accent-blue uppercase tracking-wider font-bold mb-1.5 flex items-center space-x-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Technical Challenges Met</span>
                      </h4>
                      <ul className="space-y-1">
                        {selectedProject.details.slice(0, 2).map((detail, index) => (
                          <li key={index} className="flex items-start space-x-2 text-slate-600 text-xs sm:text-[13px] leading-relaxed">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent-blue shrink-0 mt-1.5" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Right Sub-column: Fabrication Specs */}
                  <div className="md:col-span-5">
                    <div className="bg-slate-50 border border-slate-100 p-3 sm:p-4 rounded-xl flex flex-col space-y-2 sm:space-y-3">
                      <h4 className="font-mono text-[8px] sm:text-[9px] text-slate-500 uppercase tracking-wider font-bold border-b border-slate-100 pb-1">
                        SPECIFICATIONS
                      </h4>
                      
                      <div className="grid grid-cols-2 md:grid-cols-1 gap-x-3 gap-y-1.5 sm:gap-y-2">
                        <div>
                          <p className="font-mono text-[7px] sm:text-[8px] text-slate-400 uppercase font-bold">Material</p>
                          <p className="font-sans text-xs font-semibold text-slate-800 truncate">{selectedProject.specs.material}</p>
                        </div>

                        <div>
                          <p className="font-mono text-[7px] sm:text-[8px] text-slate-400 uppercase font-bold">Tolerance</p>
                          <p className="font-sans text-xs font-semibold text-slate-800 truncate">{selectedProject.specs.tolerance}</p>
                        </div>

                        {selectedProject.specs.weight && (
                          <div>
                            <p className="font-mono text-[7px] sm:text-[8px] text-slate-400 uppercase font-bold">Weight</p>
                            <p className="font-sans text-xs font-semibold text-slate-800 truncate">{selectedProject.specs.weight}</p>
                          </div>
                        )}

                        {selectedProject.specs.dimensions && (
                          <div>
                            <p className="font-mono text-[7px] sm:text-[8px] text-slate-400 uppercase font-bold">Dimensions</p>
                            <p className="font-sans text-xs font-semibold text-slate-800 truncate">{selectedProject.specs.dimensions}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-slate-100">
                <button
                  onClick={() => {
                    onSelectProjectForQuote(selectedProject.title);
                    setSelectedProject(null);
                  }}
                  className="w-full py-2.5 sm:py-3 rounded-xl bg-slate-900 hover:bg-accent-blue text-white font-display font-bold text-sm tracking-wide transition-all duration-300 cursor-pointer shadow-md text-center"
                >
                  Contact us for more info
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </section>
  );
}
