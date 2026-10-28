import React from 'react';
import { testimonialsData } from '../data';
import { Quote, Star } from 'lucide-react';

export default function Testimonials() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-accent-blue/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header for client feedback and partner reviews */}
        <div className="max-w-3xl mb-16">
          <p className="font-mono text-xs text-accent-blue uppercase tracking-widest font-bold">PARTNER REVIEWS</p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-slate-900 tracking-tight mt-2">
            Trusted across engineering, architecture <br />
            and industrial delivery.
          </h2>
          <p className="font-sans text-slate-600 text-sm sm:text-base mt-4 leading-relaxed max-w-xl">
            Hear from structural engineers, architects, and project leaders who rely on our workflow, accountability, and manufacturing precision.
          </p>
        </div>

        {/* Testimonial cards with client feedback and quality ratings */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {testimonialsData.map((test) => (
            <div
              key={test.id}
              className="group bg-white border border-slate-200 p-6 rounded-[3%] flex flex-col justify-between h-[320px] relative overflow-hidden shadow-sm hover:shadow-md hover:border-accent-blue/30 transition-all duration-300"
            >
              {/* Blurred atmospheric gradient background inside card */}
              <div className="absolute -top-12 -left-12 w-32 h-32 bg-accent-blue/5 rounded-full blur-2xl group-hover:bg-accent-blue/10 transition-colors" />

              <div>
                {/* Visual quote icon and stars */}
                <div className="flex items-center justify-between mb-6">
                  <Quote className="w-8 h-8 text-accent-blue/30" />
                  <div className="flex items-center space-x-0.5 text-accent-blue">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>

                {/* Main Client Quote */}
                <p className="font-sans text-slate-700 text-sm sm:text-[14px] leading-relaxed line-clamp-5 italic font-medium">
                  "{test.quote}"
                </p>
              </div>

              {/* Client bio footer */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center space-x-3">
                  <img
                    src={test.avatar}
                    alt={test.avatarAlt}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-[3%] object-cover border border-slate-200"
                  />
                  <div>
                    <h4 className="font-display font-bold text-sm text-slate-900">{test.name}</h4>
                    <p className="font-sans text-[11px] text-slate-500 truncate max-w-[150px] font-semibold">{test.role}</p>
                    <p className="font-mono text-[9px] text-accent-blue tracking-wider truncate max-w-[150px] font-bold">{test.company.toUpperCase()}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
