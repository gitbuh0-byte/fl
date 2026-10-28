import React from 'react';
import { industriesMarquee } from '../data';

export default function IndustriesRow() {
  const marqueeItems = ['Commercial', 'Industrial', 'Agricultural', 'Automotive', 'Architectural', 'Government'];

  return (
    <section className="relative overflow-hidden bg-slate-950 text-slate-100">
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-slate-950/90 to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-accent-blue font-semibold">Industries Served</p>
            <h2 className="mt-3 text-2xl sm:text-3xl font-display font-bold tracking-tight text-white">
              Serving Nairobi and East Africa with precision steel solutions.
            </h2>
          </div>
          <p className="max-w-2xl text-sm text-slate-300 leading-relaxed">
            ForgeLinea delivers structural steel, architectural metalwork and laser cutting for commercial, industrial, agricultural, automotive, architectural and government projects.
          </p>
        </div>

        <div className="mt-10 relative overflow-hidden">
          <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-slate-950 to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-slate-950 to-transparent pointer-events-none" />

          <div className="flex items-center gap-10 whitespace-nowrap animate-marquee">
            {marqueeItems.concat(marqueeItems).map((item, index) => (
              <div key={`marq-${index}`} className="flex items-center gap-4">
                <span className="inline-flex h-3 w-3 rounded-full bg-accent-blue" />
                <span className="font-display text-xs tracking-[0.45em] uppercase text-slate-200">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
