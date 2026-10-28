import { useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Clock3,
  Facebook,
  Instagram,
  Linkedin,
  MapPin,
  Menu,
  Phone,
  X,
} from 'lucide-react';
import logo from './assets/images/logoo1.png';
import img0 from './assets/images/img0.webp';
import img01 from './assets/images/img01.webp';
import img02 from './assets/images/img02.webp';
import img03 from './assets/images/img03.webp';
import customImage from './assets/images/custom.webp';
import industrialImage from './assets/images/industrial.webp';
import architecturalImage from './assets/images/arch.webp';
import laserImage from './assets/images/laser.webp';
import automotiveImage from './assets/images/auto.webp';
import electricalImage from './assets/images/electrical.webp';

const phoneNumber = '0722 210 838';
const phoneLink = 'tel:+254722210838';
const quoteWhatsAppLink = `https://wa.me/254722210838?text=${encodeURIComponent(
  'Hello, I would like to request a quote for a steel fabrication project.',
)}`;

const projects = [
  { image: img03, title: 'Structural Steelwork', category: 'Structural fabrication' },
  { image: img02, title: 'Staircases & Railings', category: 'Architectural metalwork' },
  { image: img0, title: 'Site Installation', category: 'Project delivery' },
  { image: industrialImage, title: 'Industrial Platforms', category: 'Access structures' },
  { image: img01, title: 'Steel Canopy Structures', category: 'Structural fabrication' },
  { image: customImage, title: 'Custom Steel Components', category: 'Precision fabrication' },
];

const services = [
  {
    number: '01',
    title: 'Structural steel',
    description: 'Columns, beams, trusses, mezzanines, platforms, roof structures and verified-tolerance reinforcement.',
    image: img03,
  },
  {
    number: '02',
    title: 'Architectural metalwork',
    description: 'Gates, balustrades, staircases, pergolas, canopies, decorative screens and custom interiors.',
    image: architecturalImage,
  },
  {
    number: '03',
    title: 'Specialized welding',
    description: 'Expert MIG, TIG and arc welding for aluminum, stainless steel, copper, brass, alloys and repairs.',
    image: img01,
  },
  {
    number: '04',
    title: 'Laser cutting',
    description: 'High-precision CNC cutting for mild steel, stainless, specialty components, signage and prototypes.',
    image: laserImage,
  },
  {
    number: '05',
    title: 'Automotive engineering',
    description: 'Custom grills, bull bars, chassis modifications, brackets, utility bodies and exhaust systems.',
    image: automotiveImage,
  },
  {
    number: '06',
    title: 'Electrical fabrication',
    description: 'Trunks, conduits, junction boxes, cable management, equipment frames and power systems.',
    image: electricalImage,
  },
];

const navigation = [
  { label: 'Home', id: 'hero' },
  { label: 'Services', id: 'services' },
  { label: 'Our Work', id: 'projects' },
  { label: 'About Us', id: 'about' },
  { label: 'Contact', id: 'contact' },
];

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <div className="site-shell">
      <header className="site-header" id="header-nav">
        <div className="utility-bar">
          <div className="page-width utility-inner">
            <p>Custom steel fabrication for a stronger tomorrow.</p>
            <div className="utility-details">
              <span><MapPin aria-hidden="true" /><span>Tui Agricultural Engineers, Building 21<small>Industrial Area, Butere Road, Nairobi</small></span></span>
              <span><Clock3 aria-hidden="true" />Mon - Fri: 8:00 - 17:00<small>Sat: 8:00 - 13:00 (By Appointment)</small></span>
            </div>
          </div>
        </div>
        <div className="navigation-bar">
          <div className="page-width nav-inner">
            <button className="brand" onClick={() => go('hero')} aria-label="Forgelinea Engineering home">
              <img src={logo} alt="" />
              <span>FORGELINEA<small>ENGINEERING</small></span>
            </button>
            <nav className={menuOpen ? 'nav-links is-open' : 'nav-links'} aria-label="Main navigation">
              {navigation.map((item) => (
                <button key={item.id} onClick={() => go(item.id)}>{item.label}</button>
              ))}
            </nav>
            <a className="header-phone" href={phoneLink}><Phone aria-hidden="true" />{phoneNumber}</a>
            <button
              className="menu-button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              {menuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>

      <main>
        <section id="hero" className="hero-section" style={{ backgroundImage: `url("${img03}")` }}>
          {import.meta.env.MODE !== 'wordpress' && (
            <video className="hero-video" autoPlay muted loop playsInline poster={img03} aria-hidden="true">
              <source src="/videos/vid1.mp4" type="video/mp4" />
            </video>
          )}
          <div className="hero-shade" />
          <div className="page-width hero-inner">
            <div className="hero-copy">
              <span className="hero-rule" />
              <h1>Precision in <em>every weld.</em></h1>
              <p className="hero-description">
                We deliver high-quality steel fabrication solutions for commercial, industrial and residential projects.
                Built with precision, powered by experience.
              </p>
              <button className="outline-button" onClick={() => go('services')}>
                Our services <ArrowRight aria-hidden="true" />
              </button>
            </div>
            <div className="hero-caption"><span />Crafted with care. Built to endure.</div>
          </div>
        </section>

        <section id="about" className="intro-section">
          <div className="page-width intro-layout">
            <div className="intro-copy">
              <span className="section-rule" />
              <p className="eyebrow">01 · About Forgelinea Engineering</p>
              <h2>Built strong.<br /><em>Built to last.</em></h2>
              <p><strong>Forgelinea Engineering Ltd.</strong> is a precision fabrication and industrial engineering company headquartered in Nairobi, Kenya. We design, fabricate, and install structural steelwork, architectural metalwork, and laser-cut components for commercial, industrial, agricultural, automotive, architectural, and government clients.</p>
              <p>ForgeLinea brings the craft of shaping metal together with the geometry and discipline of modern engineering. Every project passes through precise specification, careful material selection, controlled fabrication, and verified quality before delivery.</p>
            </div>
            <div className="intro-cards">
              <article className="intro-card">
                <img src={img03} alt="Structural steel frame" loading="lazy" />
                <div><h3>Structural Steel Fabrication</h3><p>We fabricate and install structural steel for warehouses, commercial buildings, industrial facilities and more — built to meet your project’s exact needs.</p><button onClick={() => go('services')}>Learn more <ArrowRight aria-hidden="true" /></button></div>
              </article>
              <article className="intro-card">
                <img src={img02} alt="Custom steel staircase" loading="lazy" />
                <div><h3>Custom Metalwork</h3><p>From gates and railings to bespoke steel products, we create custom metalwork that combines strength, functionality and modern design.</p><button onClick={() => go('services')}>Learn more <ArrowRight aria-hidden="true" /></button></div>
              </article>
            </div>
          </div>
        </section>

        <section id="projects" className="projects-section">
          <div className="page-width">
            <div className="section-heading">
              <div><span className="section-rule" /><p className="eyebrow">Selected capabilities</p><h2>Our work in <em>steel.</em></h2><p>Real projects. Lasting results. Here’s a look at some of our recent steel fabrication work.</p></div>
              <button className="light-link" onClick={() => go('services')}>Explore our services <ArrowRight aria-hidden="true" /></button>
            </div>
            <div className="project-grid">
              {projects.map((project) => (
                <article className="project-card" key={project.title}>
                  <img src={project.image} alt={project.title} loading="lazy" />
                  <div className="project-caption"><span>{project.category}</span><h3>{project.title}</h3><ArrowUpRight aria-hidden="true" /></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="services" className="services-section">
          <div className="page-width">
            <div className="section-heading services-heading">
              <div><span className="section-rule" /><p className="eyebrow">05 · What we do</p><h2>Engineering solutions across<br />six core disciplines.</h2></div>
              <p className="section-intro"><strong>Engineered for performance, fabricated for durability.</strong> From early design and material selection through careful fabrication and installation, our team brings every detail together.</p>
            </div>
            <div className="service-grid">
              {services.map((service) => (
                <article className="service-card" key={service.number}>
                  <img src={service.image} alt="" loading="lazy" />
                  <div className="service-content">
                    <span className="service-number">{service.number}</span>
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="company-details-section">
          <div className="page-width details-layout">
            <div className="details-heading"><span className="section-rule" /><p className="eyebrow">02 · Company at a glance</p><h2>Built for accurate work<br />and accountable delivery.</h2></div>
            <div className="glance-grid">
              <div><b>Headquarters</b><span>Tui Agricultural Engineers, Building 21, Industrial Area, Butere Road, Nairobi</span></div>
              <div><b>Markets</b><span>Nairobi and East Africa, with regional growth underway</span></div>
              <div><b>Technology</b><span>CNC laser cutting, MIG/TIG welding, forming and finishing</span></div>
              <div><b>Delivery coverage</b><span>Site installation across Kenya with regional mobilisation</span></div>
            </div>
          </div>
        </section>

        <section className="materials-section">
          <div className="page-width materials-layout">
            <div><span className="section-rule" /><p className="eyebrow">07 · Materials &amp; finishes</p><h2>Engineered materials.<br />Exceptional finishes.</h2></div>
            <div>
              <div className="material-row"><span>Mild steel</span><span>Stainless steel</span><span>Aluminum</span><span>Galvanized steel</span><span>Corten steel</span></div>
              <p className="section-note">Material and finish selection is guided by structural requirements, environmental exposure, durability expectations, and the desired aesthetic. Our treatments include hot-dip galvanizing, powder coating, industrial painting, polishing, brushing and specialist surface treatments.</p>
            </div>
          </div>
        </section>

        <section className="process-section">
          <div className="page-width">
            <div className="center-heading"><span className="section-rule" /><p className="eyebrow">08 · Our project delivery process</p><h2>A structured route from<br />concept to completion.</h2></div>
            <div className="process-row"><span><b>01</b>Consult</span><span><b>02</b>Design</span><span><b>03</b>Proposal</span><span><b>04</b>Fabricate</span><span><b>05</b>Install</span></div>
            <p className="section-note process-note">Site visits, technical consultation, CAD drawings, material selection, itemized proposals, CNC cutting, fabrication, inspection, installation and client handover are coordinated through one accountable team.</p>
          </div>
        </section>

        <section className="industries-section">
          <div className="page-width industries-layout">
            <div><span className="section-rule" /><p className="eyebrow">06 · Industries we serve</p><h2>Tailored solutions for<br />demanding environments.</h2></div>
            <div className="industry-grid"><span>Commercial &amp; real estate</span><span>Industrial &amp; manufacturing</span><span>Government infrastructure</span><span>Agriculture &amp; agribusiness</span><span>Automotive &amp; transport</span><span>Healthcare &amp; medical</span><span>Architecture &amp; interiors</span><span>Energy &amp; utilities</span></div>
          </div>
        </section>

        <section className="quality-section">
          <div className="page-width quality-layout">
            <div><span className="section-rule" /><p className="eyebrow">11 · Quality &amp; HSE</p><h2>Precision.<br />Safety.<br /><em>Reliability.</em></h2></div>
            <p>Quality is engineered into every stage, from material inspection and engineering verification to in-process checks, final inspection, and client approval. We protect people and the environment through PPE, risk assessments, equipment safety, responsible material handling, steel recycling, and continuous improvement.</p>
          </div>
        </section>

        <section id="promise" className="promise-section">
          <div className="page-width promise-layout">
            <div><span className="section-rule" /><p className="eyebrow">18 · The Forgelinea promise</p><h2>Engineering every project with precision, integrity and lasting value.</h2></div>
            <div className="promise-grid"><span>Precision engineering</span><span>Quality without compromise</span><span>Trusted partnerships</span><span>Reliable delivery</span><span>Innovation</span><span>Sustainable growth</span></div>
          </div>
        </section>

        <section id="contact" className="contact-banner">
          <div className="page-width contact-inner">
            <div><span className="section-rule" /><p className="eyebrow">19 · Let’s build together</p><h2>Have a project in mind?</h2><p>Whether you have detailed drawings or are starting with a concept, our engineering team is ready to scope, quote, and deliver.<br />Let’s build something great together.</p></div>
            <a className="outline-button" href={quoteWhatsAppLink} target="_blank" rel="noreferrer">Request a quote <ArrowRight aria-hidden="true" /></a>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="page-width footer-content">
          <div className="footer-brand">
            <button className="brand" onClick={() => go('hero')} aria-label="Forgelinea Engineering home"><img src={logo} alt="" /><span>FORGELINEA<small>ENGINEERING</small></span></button>
            <p>Quality steel. Stronger structures.<br />A more durable future.</p>
            <span className="footer-address">Tui Agricultural Engineers, Building 21<br />Industrial Area, Butere Road, Nairobi</span>
          </div>
          <div className="footer-column"><h3>Fabrication services</h3>{services.map((service) => <button key={service.number} onClick={() => go('services')}>{service.title}</button>)}<button onClick={() => go('services')}>Materials &amp; finishes</button></div>
          <div className="footer-column"><h3>Useful links</h3><button onClick={() => go('about')}>About Us</button><button onClick={() => go('projects')}>Our Work</button><button onClick={() => go('services')}>Services</button><button onClick={() => go('promise')}>Our Promise</button><button onClick={() => go('contact')}>Contact Us</button></div>
          <div className="footer-column footer-social"><h3>Follow us</h3><div>
            <a href="https://facebook.com" aria-label="Facebook" target="_blank" rel="noreferrer"><Facebook /></a>
            <a href="https://instagram.com/forgelinea.engineering" aria-label="Instagram" target="_blank" rel="noreferrer"><Instagram /></a>
            <a href="https://linkedin.com" aria-label="LinkedIn" target="_blank" rel="noreferrer"><Linkedin /></a>
          </div><a className="footer-email" href="mailto:forgelineaeng@gmail.com">forgelineaeng@gmail.com</a><a className="footer-email" href={phoneLink}>{phoneNumber}</a></div>
        </div>
        <div className="page-width footer-bottom"><span>© {new Date().getFullYear()} Forgelinea Engineering. All rights reserved.</span><span>Stronger steel. Brighter futures.</span></div>
      </footer>
    </div>
  );
}
