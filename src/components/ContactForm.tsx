import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Clock, ArrowUpRight, MessageSquare, CheckCircle2, Send } from 'lucide-react';

interface ContactFormProps {
  initialProjectName?: string;
}

export default function ContactForm({ initialProjectName = '' }: ContactFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Update message when initialProjectName is provided
  useEffect(() => {
    if (initialProjectName) {
      setMessage(`I am interested in getting a quote for the ${initialProjectName}.`);
    }
  }, [initialProjectName]);

  const getWhatsAppUrl = () => {
    const formattedText = `Hello Forgelinea,

My Name: ${name || 'Interested Client'}
Email: ${email || 'N/A'}
Company: ${company || 'N/A'}

Message:
${message || 'I am interested in discussing a custom fabrication project.'}`;

    return `https://wa.me/254722210838?text=${encodeURIComponent(formattedText)}`;
  };

  const getMailtoUrl = () => {
    const subject = 'Forgelinea Enquiry';
    const body = `Hello Forgelinea,%0D%0A%0D%0AMy Name: ${name || 'Interested Client'}%0D%0AEmail: ${email || 'N/A'}%0D%0ACompany: ${company || 'N/A'}%0D%0A%0D%0AMessage:%0D%0A${message || 'I am interested in discussing a custom fabrication project.'}`;

    return `mailto:forgelineaeng@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
  };

  const handleWhatsAppRedirect = () => {
    window.open(getWhatsAppUrl(), '_blank');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    window.location.href = getMailtoUrl();
    setSubmitted(true);
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setCompany('');
    setMessage('');
    setSubmitted(false);
  };

  return (
    <section id="contact" className="py-24 bg-white relative overflow-hidden">

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <p className="font-mono text-xs text-accent-blue uppercase tracking-widest font-bold">CONTACT US</p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-slate-900 tracking-tight mt-2">
            Let’s scope your <br />
            next structural project.
          </h2>
          <p className="font-sans text-slate-600 text-sm sm:text-base mt-4 leading-relaxed max-w-xl">
            Whether you’re preparing shop drawings or need a full fabrication partnership, our team provides a fast, detailed response with engineering clarity.
          </p>
          {initialProjectName && (
            <p className="font-sans text-slate-500 text-sm mt-4 max-w-xl">
              Ready to discuss: <span className="font-semibold text-slate-900">{initialProjectName}</span>
            </p>
          )}
        </div>

        {submitted ? (
          <div className="w-full max-w-2xl mx-auto border border-slate-100 p-8 sm:p-12 rounded-[3%] flex flex-col items-center text-center space-y-6 bg-slate-50">
            <div className="w-16 h-16 rounded-[3%] bg-accent-blue/10 flex items-center justify-center text-accent-blue mb-2">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="font-display font-bold text-2xl text-slate-900">
              Inquiry Submitted Successfully!
            </h3>
            
            <p className="font-sans text-slate-600 text-sm sm:text-base max-w-lg leading-relaxed">
              Thank you for contacting Forgelinea. Your request has been logged, and our structural engineering team will review it and reach back to you shortly. You can also proceed via WhatsApp using the link below.
            </p>

            <div className="flex flex-wrap gap-4 justify-center pt-2">
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 py-3 px-8 rounded-full bg-accent-blue text-white font-display font-bold text-sm hover:bg-accent-blue/90 transition-all shadow-md"
              >
                <span>Continue on WhatsApp</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>

              <button
                onClick={resetForm}
                className="inline-flex items-center space-x-2 py-3 px-8 rounded-full bg-slate-900 text-white font-display font-bold text-sm hover:bg-slate-800 transition-all shadow-md cursor-pointer"
              >
                <span>Submit Another Inquiry</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Column: Office details */}
            <div className="lg:col-span-5 flex flex-col space-y-8">
              <div className="flex flex-col space-y-6">
                <h3 className="font-display font-bold text-xl text-slate-900">
                  forgelinea engineering
                </h3>
                <p className="font-sans text-slate-600 text-sm leading-relaxed">
                  Our state-of-the-art workshop and custom metal foundry are located in Nairobi, providing sub-millimeter precision services globally.
                </p>

                <div className="space-y-6 pt-4 border-t border-slate-100">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-[3%] bg-accent-blue/5 border border-accent-blue/10 flex items-center justify-center text-accent-blue shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-mono text-[10px] text-slate-400 uppercase font-bold tracking-wider">CALL US</p>
                      <p className="font-sans text-sm font-bold text-slate-900 mt-0.5">+254 722 210 838</p>
                      <p className="font-sans text-xs text-slate-500 mt-0.5">Nairobi workshop line</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-[3%] bg-accent-blue/5 border border-accent-blue/10 flex items-center justify-center text-accent-blue shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-mono text-[10px] text-slate-400 uppercase font-bold tracking-wider">EMAIL US</p>
                      <p className="font-sans text-sm font-bold text-slate-900 mt-0.5">forgelineaeng@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-[3%] bg-accent-blue/5 border border-accent-blue/10 flex items-center justify-center text-accent-blue shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-mono text-[10px] text-slate-400 uppercase font-bold tracking-wider">VISIT WORKSHOP</p>
                      <p className="font-sans text-sm font-bold text-slate-900 mt-0.5">
                        Butere Road, Industrial Area
                      </p>
                      <p className="font-sans text-xs text-slate-500 mt-0.5">Nairobi, Kenya</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-[3%] bg-accent-blue/5 border border-accent-blue/10 flex items-center justify-center text-accent-blue shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-mono text-[10px] text-slate-400 uppercase font-bold tracking-wider">WORKSHOP HOURS</p>
                      <p className="font-sans text-sm font-bold text-slate-900 mt-0.5">Mon - Fri: 08:00 - 17:00</p>
                      <p className="font-sans text-xs text-slate-500 mt-0.5">Saturday: 08:00 - 13:00 (Emergency Only)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Clean, Minimalist Contact Form */}
            <form onSubmit={handleSubmit} className="lg:col-span-7 flex flex-col space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Name */}
                <div className="flex flex-col space-y-2">
                  <label htmlFor="user-name" className="font-mono text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                    Full Name *
                  </label>
                  <input
                    id="user-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full bg-slate-50/50 border border-slate-200 focus:border-accent-blue focus:bg-white rounded-xl px-4 py-3.5 font-sans text-sm text-slate-900 focus:outline-none transition-all"
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col space-y-2">
                  <label htmlFor="user-email" className="font-mono text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                    Email Address *
                  </label>
                  <input
                    id="user-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full bg-slate-50/50 border border-slate-200 focus:border-accent-blue focus:bg-white rounded-xl px-4 py-3.5 font-sans text-sm text-slate-900 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Company */}
              <div className="flex flex-col space-y-2">
                <label htmlFor="user-company" className="font-mono text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                  Company Name (Optional)
                </label>
                <input
                  id="user-company"
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Your Company"
                  className="w-full bg-slate-50/50 border border-slate-200 focus:border-accent-blue focus:bg-white rounded-xl px-4 py-3.5 font-sans text-sm text-slate-900 focus:outline-none transition-all"
                />
              </div>

              {/* Message */}
              <div className="flex flex-col space-y-2">
                <label htmlFor="project-message" className="font-mono text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                  Your Message *
                </label>
                <textarea
                  id="project-message"
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your project, material specifications, or general inquiries..."
                  className="w-full bg-slate-50/50 border border-slate-200 focus:border-accent-blue focus:bg-white rounded-xl px-4 py-3.5 font-sans text-sm text-slate-900 focus:outline-none transition-all resize-none"
                />
              </div>

              {/* Form Actions: 2 Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* Submit Form Button */}
                <button
                  type="submit"
                  className="group relative inline-flex items-center justify-center py-4 px-6 rounded-xl overflow-hidden font-display text-xs font-bold uppercase tracking-widest text-white bg-slate-900 hover:bg-slate-800 transition-all duration-300 cursor-pointer shadow-md"
                >
                  <span className="relative flex items-center justify-center space-x-2 z-10 w-full text-center font-semibold">
                    <Send className="w-4 h-4 shrink-0 text-slate-300" />
                    <span>Submit Inquiry</span>
                  </span>
                </button>

                {/* Direct WhatsApp Button */}
                <button
                  type="button"
                  onClick={handleWhatsAppRedirect}
                  className="group relative inline-flex items-center justify-center py-4 px-6 rounded-xl overflow-hidden font-display text-xs font-bold uppercase tracking-widest text-slate-900 bg-white border border-slate-200 hover:border-accent-blue hover:text-accent-blue transition-all duration-300 cursor-pointer shadow-sm"
                >
                  <span className="relative flex items-center justify-center space-x-2 z-10 w-full text-center font-semibold">
                    <MessageSquare className="w-4 h-4 shrink-0 text-accent-blue" />
                    <span>Chat on WhatsApp</span>
                    <ArrowUpRight className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </button>
              </div>

            </form>

          </div>
        )}

      </div>
    </section>
  );
}
