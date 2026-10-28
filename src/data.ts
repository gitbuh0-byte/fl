import { Project, Testimonial } from './types';
import img01 from './assets/images/img01.jpg';
import img02 from './assets/images/img02.jpg';
import img03 from './assets/images/img03.jpg';
import img0 from './assets/images/img0.jpg';

export const projectsData: Project[] = [
  {
    id: 'proj-01',
    title: 'AeroCrest Cantilever Roof Frame',
    category: 'structural',
    description: 'High-tolerance structural cantilever roof frame for an airport terminal wing, shown with exposed high-tensile welded nodes and precision-fit steel latticework.',
    details: [
      'Engineered with high-tensile ASTM A500 Grade B structural carbon steel to withstand extreme wind shear and cantilever loads.',
      'Image depicts the AeroCrest frame with diagonal bracing, bolted connection plates, and seamless welded gussets along a 24m span.',
      'Achieved strict tolerances of ±1.0mm over the full span using robotic fixture alignment, then fully inspected with ultrasonic NDT for every weld run.'
    ],
    specs: {
      material: 'ASTM A500 Grade B Structural Carbon Steel',
      tolerance: '± 1.0mm span-wide',
      weight: '42,500 kg',
      dimensions: '24m x 12m cantilever',
      imageSpecification: 'High-tensile cantilever roof frame with precision-fit lattice, heavy tubular chord members, welded gusset plates, and exposed aerodynamic profile suitable for terminal canopy applications.'
    },
    image: img01, // Industrial construction / high-tensile cantilever roof frame
    tags: ['Heavy Structural', 'High-Tensile Weld', 'Aeronautical Space'],
    year: '2025'
  },
  {
    id: 'proj-02',
    title: 'The Helix Spiral Steel Facade',
    category: 'architectural',
    description: 'Architectural helical carbon-steel facade wrapping a 12-story high-rise museum, using custom-rolled structural hollow sections.',
    details: [
      'Individually laser-profiled custom steel plates welded seamlessly with custom-rolled heavy tubing.',
      'Coated with multi-layered architectural-grade anti-corrosive marine paint finish.',
      'Integrated hidden architectural lighting channels and seismic joint fasteners.'
    ],
    specs: {
      material: 'ASTM A36 Plate & Rolled Hollow Profiles',
      tolerance: '± 2.0mm curvature offset',
      weight: '118,000 kg',
      dimensions: '45m total spiral height',
      imageSpecification: 'Sculptural helical facade panels with spiral steel ribs, smooth weld joints, and an elegant fluid geometry designed for museum architecture.'
    },
    image: img02, // Architectural helical steel facade
    tags: ['Architectural Steel', 'Helical Rolling', 'Seismic Fastening'],
    year: '2026'
  },
  {
    id: 'proj-03',
    title: 'Precision Structural Beam Assemblies',
    category: 'structural',
    description: 'Fabricated structural beam assemblies designed for high-capacity industrial and commercial construction, combining welded plate girders with precision machined web stiffeners.',
    details: [
      'Built from welded plate girders with CNC-profiled web holes for weight optimization and ease of bolted connection assembly.',
      'Delivered with tight alignment tolerances of ±1.0mm across 8m beam spans, pre-fit for column and truss integration.',
      'Finished with industrial-grade primer and shop-welding of continuous joints to ensure long-term fatigue performance.'
    ],
    specs: {
      material: 'ASTM A572 Grade 50 Structural Steel',
      tolerance: '± 1.0mm span-wide alignment',
      weight: '3,800 kg per assembly',
      dimensions: '8m x 1.2m x 0.6m',
      imageSpecification: 'High-strength structural beams with welded plate girder construction, reinforcing stiffener plates, and precision connection flange details.'
    },
    image: img03, // Structural beam assembly
    tags: ['Structural Beams', 'Plate Girders', 'Industrial Construction'],
    year: '2025'
  },
  {
    id: 'proj-04',
    title: 'Quarrymaster Heavy Chassis Frame',
    category: 'heavy-industrial',
    description: 'Ultra-duty customized steel chassis for a large-scale quarry screening machine, requiring custom heavy bevel prep and multi-pass MIG welding.',
    details: [
      'Built using extreme wear-resistant Hardox steel plates combined with heavy structural I-beams.',
      'Multi-pass heavy-duty MIG welding (FCAW) executed by ASME Section IX certified welders.',
      'Thermally stress-relieved and blast-cleaned to SA 2.5 standards before epoxy primer sealing.'
    ],
    specs: {
      material: 'Hardox 450 Wear Plates & ASTM A572 I-Beams',
      tolerance: '± 1.5mm diagonal alignment',
      weight: '18,600 kg',
      dimensions: '9.2m x 3.1m x 1.8m'
    },
    image: 'https://images.unsplash.com/photo-1516937941344-00b4e0337589?auto=format&fit=crop&q=80&w=1200', // Factory production heavy machinery
    tags: ['Heavy Industrial', 'MIG Multi-Pass', 'Wear-Resistant Steel'],
    year: '2024'
  },
  {
    id: 'proj-04',
    title: 'Quarrymaster Heavy Chassis Frame',
    category: 'heavy-industrial',
    description: 'Ultra-duty customized steel chassis for a large-scale quarry screening machine, requiring custom heavy bevel prep and multi-pass MIG welding.',
    details: [
      'Built using extreme wear-resistant Hardox steel plates combined with heavy structural I-beams.',
      'Multi-pass heavy-duty MIG welding (FCAW) executed by ASME Section IX certified welders.',
      'Thermally stress-relieved and blast-cleaned to SA 2.5 standards before epoxy primer sealing.'
    ],
    specs: {
      material: 'Hardox 450 Wear Plates & ASTM A572 I-Beams',
      tolerance: '± 1.5mm diagonal alignment',
      weight: '18,600 kg',
      dimensions: '9.2m x 3.1m x 1.8m'
    },
    image: 'https://images.unsplash.com/photo-1516937941344-00b4e0337589?auto=format&fit=crop&q=80&w=1200', // Factory production heavy machinery
    tags: ['Heavy Industrial', 'MIG Multi-Pass', 'Wear-Resistant Steel'],
    year: '2024'
  }
];

export const testimonialsData: Testimonial[] = [
  {
    id: 'test-01',
    name: 'Marcus Vialli',
    role: 'Lead Structural Engineer',
    company: 'Vanguard Infrastructure Partners',
    quote: 'The level of structural precision Forgelinea delivered on our airport cantilever terminal was exceptional. Their AWS-certified welders and robotic alignments held tighter tolerances than any other shop in the industry. They are our go-to partner.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    avatarAlt: 'Marcus Vialli'
  },
  {
    id: 'test-02',
    name: 'Jessica James',
    role: 'Principal Architectural Designer',
    company: 'AeroCrest Design Lab',
    quote: 'Our helical museum facade required extreme curved profiles that most shops deemed impossible. Forgelinea worked alongside us in CAD/CAM, delivered gorgeous custom rolled members, and installed them ahead of schedule. Truly flawless visual execution.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    avatarAlt: 'Jessica James'
  },
  {
    id: 'test-03',
    name: 'Dr. Anika Reinhardt',
    role: 'Director of Advanced Robotics',
    company: 'Quantum Tech Systems',
    quote: 'For our semiconductor enclosures, thermal dissipation and EMI shielding were critical. Forgelinea’s 10kW fiber laser produced perfect, oxide-free micro-perforated grids. Their engineering prowess is visible in every single bend and fitment.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    avatarAlt: 'Dr. Anika Reinhardt'
  },
  {
    id: 'test-04',
    name: 'James Okonkwo',
    role: 'Director of Procurement',
    company: 'Heavy-Quarry Mining Corp',
    quote: 'We operate heavy shaker chassis in severe abrasion environments. Forgelinea’s MIG multi-pass welding on Hardox wear plates has proven indestructible. They provided complete ultrasonic and magnetic particle testing records. Complete transparency, unbeatable durability.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    avatarAlt: 'James Okonkwo'
  }
];

export const laserSimulatorPresets = [
  {
    id: 'stainless',
    materialName: 'Stainless Steel 316L',
    maxThickness: '15mm',
    optimalThickness: '6mm',
    laserPower: 10, // kW
    cuttingSpeed: 4.8, // m/min
    gasAssist: 'Nitrogen (High Pressure)',
    nozzleDiameter: '2.5mm',
    difficulty: 'Moderate',
    sparksColor: 'rgba(255, 255, 255, 0.95)', // bright white-blue sparks
    sparksCount: 120,
    accentGlow: 'rgba(46, 139, 192, 0.8)' // electric blue
  },
  {
    id: 'carbon-steel',
    materialName: 'Structural Carbon Steel A36',
    maxThickness: '25mm',
    optimalThickness: '12mm',
    laserPower: 12, // kW
    cuttingSpeed: 2.2, // m/min
    gasAssist: 'Oxygen (Low Pressure)',
    nozzleDiameter: '3.5mm',
    difficulty: 'Low',
    sparksColor: 'rgba(255, 120, 0, 0.95)', // hot orange-yellow sparks
    sparksCount: 180,
    accentGlow: 'rgba(255, 90, 0, 0.8)' // bright hot amber
  },
  {
    id: 'aluminum',
    materialName: 'Aluminum 6061-T6',
    maxThickness: '12mm',
    optimalThickness: '4mm',
    laserPower: 8, // kW
    cuttingSpeed: 6.5, // m/min
    gasAssist: 'Nitrogen / Air Assist',
    nozzleDiameter: '2.0mm',
    difficulty: 'High (Highly Reflective)',
    sparksColor: 'rgba(220, 240, 255, 0.95)', // cool white-cyan sparks
    sparksCount: 90,
    accentGlow: 'rgba(0, 220, 255, 0.7)' // deep cyan
  },
  {
    id: 'titanium',
    materialName: 'Titanium Grade 5 (Ti-6Al-4V)',
    maxThickness: '10mm',
    optimalThickness: '3mm',
    laserPower: 10, // kW
    cuttingSpeed: 3.5, // m/min
    gasAssist: 'Argon (Ultra-Pure Inert)',
    nozzleDiameter: '2.2mm',
    difficulty: 'Extreme (Highly Reactive)',
    sparksColor: 'rgba(255, 255, 180, 0.95)', // brilliant intense white sparks
    sparksCount: 150,
    accentGlow: 'rgba(255, 255, 255, 0.8)' // blinding white-silver
  }
];

export const industriesMarquee = [
  'STRUCTURAL ARCHITECTURE',
  'AEROSPACE DEFENSE',
  'AUTOMOTIVE ASSEMBLY',
  'INFRASTRUCTURE PROJECTS',
  'HEAVY INDUSTRIAL MINING',
  'ENERGY & POWER STATIONS',
  'MARINE ENGINEERING',
  'BESPOKE STEEL SCULPTURES'
];
