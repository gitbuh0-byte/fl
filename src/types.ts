export interface Project {
  id: string;
  title: string;
  category: 'structural' | 'architectural' | 'laser-cutting' | 'heavy-industrial';
  description: string;
  details: string[];
  specs: {
    material: string;
    tolerance: string;
    weight?: string;
    dimensions?: string;
    imageSpecification?: string;
  };
  image: string;
  tags: string[];
  year: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  avatar: string;
  avatarAlt: string;
}

export interface LeadSubmission {
  name: string;
  email: string;
  company: string;
  projectType: string;
  message: string;
  material: string;
  thickness: string;
  fileAttached?: boolean;
}
