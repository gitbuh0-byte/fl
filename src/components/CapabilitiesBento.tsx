import React from 'react';
import { ShieldCheck, Cpu, Activity, Crosshair } from 'lucide-react';
import img0 from '../assets/images/img0.jpg';

export default function CapabilitiesBento() {
  const serviceCards = [
    {
      title: 'Structural Steel Engineering',
      description: 'Columns, beams, trusses, mezzanines and load-bearing steel structures engineered to specification and fabricated to verified tolerances.',
      icon: ShieldCheck
    },
    {
      title: 'Architectural Metalwork',
      description: 'Gates, balustrades, staircases, pergolas, screens and façade elements that blend structural integrity with design intent.',
      icon: Crosshair
    },
    {
      title: 'Laser Cutting & Precision Components',
      description: 'High-precision CNC laser cutting for mild steel, stainless steel and specialty metals used in signage, brackets and custom assemblies.',
      icon: Cpu
    },
    {
      title: 'Engineering Delivery',
      description: 'Project-ready drawings, fabrication workflows and site installation delivered through a controlled, quality-driven process.',
      icon: Activity
    }
  ];

  return (
    <section className="py-24 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid items-center gap-8 lg:grid-cols-[567px_minmax(0,1fr)]">
          <div className="rounded-[32px] overflow-hidden shadow-lg">
            <img src={img0} alt="ForgeLinea Engineering" className="w-full h-full object-cover" />
          </div>

          <div className="max-w-3xl mx-auto lg:mx-0 lg:text-right">
            <p className="text-xs uppercase tracking-[0.35em] text-accent-blue font-semibold">About ForgeLinea Engineering</p>
            <h2 className="mt-4 text-4xl sm:text-5xl font-display font-bold text-slate-950 tracking-tight">
              Where engineering precision meets industrial craft.
            </h2>
            <p className="mt-5 text-base text-slate-600 leading-relaxed max-w-2xl ml-auto">
              ForgeLinea Engineering Ltd. is a precision fabrication and industrial engineering company headquartered in Nairobi. We design, fabricate, and install structural steelwork, architectural metalwork, and laser-cut components for commercial, industrial, agricultural, automotive, architectural and government clients.
            </p>
          </div>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          {serviceCards.map((service) => {
            const Icon = service.icon;
            return (
              <article key={service.title} className="group rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm transition hover:shadow-lg">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-3xl bg-accent-blue/10 text-accent-blue">
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="font-display text-2xl font-bold text-slate-950 mb-4">{service.title}</h3>
                <p className="text-slate-600 leading-relaxed">{service.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
