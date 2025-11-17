
export type Page = 'home' | 'employer' | 'news' | 'about';

export interface Application {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  resumeFile?: {
    name: string;
    type: string;
    content: string; // base64
  };
  resumeText?: string;
  date: string;
}

export interface Job {
  id: string;
  employerId: string;
  title: string;
  companyName?: string;
  location: string;
  salary?: string;
  benefits?: string;
  workHours?: string;
  workSchedule?: string;
  workScale?: string;
  requirements: {
    education?: string;
    experience?: string;
    profile?: string;
  };
  postedDate: string;
  applications: Application[];
  resumePreference: 'file' | 'text' | 'both';
}

export interface Employer {
  id: string;
  companyName: string;
  email: string;
  password?: string; // Should be hashed in a real app
}

// Novo tipo para estruturar as notícias
export interface NewsArticle {
  title: string;
  description: string;
  link: string;
  source: string;
}
