import React from 'react';
import { Award, Briefcase, Settings, Landmark, ShieldCheck } from 'lucide-react';

export default function LegacyTimeline() {
  const milestones = [
    {
      period: '2025',
      title: 'Forgelinea Engineering Founded',
      category: 'Foundations',
      bullets: [
        'Established in Nairobi as a precision structural steel and architectural metalwork workshop.',
        'Opened with CNC laser cutting, robotic welding cells, and dedicated fabrication bays.',
        'Delivered first structural steel, balustrade, gate, and metalwork projects for commercial development clients.'
      ]
    },
    {
      period: '2025 - 2026',
      title: 'Commercial, Industrial & Public Projects',
      category: 'Project Delivery',
      bullets: [
        'Built structural platforms, support systems, and factory equipment structures for industrial clients.',
        'Delivered tender-ready metalwork packages for public infrastructure, institutional buildings, and civic projects.',
        'Completed agricultural storage structures, fencing systems, and custom automotive fabrication components.'
      ]
    },
    {
      period: '2026',
      title: 'Quality, Compliance & Design Collaboration',
      category: 'Standards',
      bullets: [
        'Began formal registration pathways with EBK, IEK, and NCA for engineering and construction compliance.',
        'Maintained active OSHA-aligned health and safety practices throughout the workshop.',
        'Collaborated with architects and designers to fabricate bespoke metalwork from concept and detail drawings.'
      ]
    }
  ];

  const industryFocus = [
    {
      label: 'Commercial & Real Estate',
      description: 'Structural steel, balustrades, gates, and architectural metalwork for developments and commercial buildings.'
    },
    {
      label: 'Industrial',
      description: 'Structural fabrication, platforms, and equipment support structures for factories and warehouses.'
    },
    {
      label: 'Government & Public Sector',
      description: 'Tender-ready capability for public infrastructure, institutional buildings, and civic projects.'
    },
    {
      label: 'Agriculture',
      description: 'Steel-frame storage structures, fencing, and equipment fabrication for agribusiness clients.'
    },
    {
      label: 'Automotive',
      description: 'Custom fabrication, brackets, and structural components for automotive and workshop applications.'
    },
    {
      label: 'Architecture & Design',
      description: 'Collaboration with architects and designers to fabricate bespoke metalwork from concept drawings.'
    }
  ];

  const certifications = [
    { title: 'Engineers Board of Kenya (EBK)', status: 'In Progress', target: '2026' },
    { title: 'Institution of Engineers of Kenya (IEK)', status: 'In Progress', target: '2026' },
    { title: 'National Construction Authority (NCA)', status: 'In Progress', target: '2026' },
    { title: 'ISO 9001 Quality Management', status: 'Planned', target: '2027' },
    { title: 'OSHA-aligned Safety Practice', status: 'Active', target: 'Ongoing' }
  ];

  return (
    <section id="milestones" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-accent-blue/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 mx-auto text-center">
          <p className="font-mono text-xs text-accent-blue uppercase tracking-widest font-bold">CORPORATE EVOLUTION</p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-slate-900 tracking-tight mt-2">
            Professional Milestones <br />
            & Standards Achieved
          </h2>
        </div>

        <div className="grid gap-12 lg:grid-cols-[minmax(360px,1fr)_minmax(300px,380px)] mb-14">
          <div className="grid gap-6 md:grid-cols-2">
            {industryFocus.map((item) => (
              <div key={item.label} className="rounded-[28px] border border-slate-200 bg-slate-50 p-6">
                <h3 className="font-display text-sm font-bold uppercase tracking-[0.35em] text-accent-blue">{item.label}</h3>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="font-display text-base font-bold text-slate-900 mb-4">Certification & Compliance</h3>
            <div className="space-y-3">
              {certifications.map((cert) => (
                <div key={cert.title} className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 p-4">
                  <div>
                    <p className="font-semibold text-slate-900">{cert.title}</p>
                    <p className="text-xs text-slate-500">{cert.status}</p>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500">{cert.target}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-16">
          {milestones.map((milestone, idx) => (
            <div key={idx} className="flex flex-col space-y-3.5">
              <div className="flex items-center space-x-3.5">
                <span className="font-mono text-xs text-accent-blue font-bold uppercase tracking-widest">
                  {milestone.category}
                </span>
                <span className="text-slate-300 text-xs">|</span>
                <span className="font-mono text-xs text-slate-500 font-semibold">
                  {milestone.period}
                </span>
              </div>

              <h3 className="font-display font-bold text-lg sm:text-xl text-slate-900 leading-snug">
                {milestone.title}
              </h3>

              <ul className="space-y-2.5 pt-1">
                {milestone.bullets.map((bullet, bulletIdx) => (
                  <li key={bulletIdx} className="flex items-start space-x-2.5 text-slate-600 text-sm leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-blue/50 shrink-0 mt-2" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
