export interface Profile {
  name: string;
  title: string;
  location: string;
  email: string;
  phone: string;
  linkedin: string;
  bio: string;
  education: {
    degree: string;
    institution: string;
    location: string;
    period: string;
    focus: string;
  };
}

export interface Experience {
  title: string;
  company: string;
  period: string;
  description: string[];
  reference?: string;
}

export interface Project {
  title: string;
  description: string;
  technologies: string[];
  githubUrl: string | null;
  liveUrl: string | null;
  reference?: string;
  featured: boolean;
  githubStats?: {
    stars: number;
    lastUpdate: string;
  };
}

export interface Skills {
  [category: string]: string[];
}

export interface Certification {
  name: string;
  items: string[];
}

export interface GitHubRepo {
  name: string;
  stargazers_count: number;
  updated_at: string;
}

export interface Service {
  id: string;
  title: string;
  icon: string;
  description: string;
  features: string[];
  ctaText: string;
}