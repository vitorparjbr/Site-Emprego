
export type Page = 'home' | 'employer' | 'news' | 'about' | 'feedback' | 'education';

export type JobType = 'emprego' | 'estagio' | 'jovem-aprendiz' | 'curso';

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
  jobType: JobType;
  title: string;
  companyName?: string;
  area?: string; // Área/Setor
  location: string;
  duration?: string; // Tempo/Duração do contrato (para estágio, jovem aprendiz, curso)
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
  description?: string; // Descrição da Vaga
  courseContact?: string; // Contato do curso (link, telefone, e-mail)
  postedDate: string;
  applications: Application[];
  resumePreference: 'file' | 'text' | 'both' | 'none';
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
