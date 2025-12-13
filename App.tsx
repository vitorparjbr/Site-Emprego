
import React, { useState, useCallback, useMemo, useEffect } from 'react';
// Importa os tipos de dados usados na aplicação (Page, Job, Employer, Application, NewsArticle)
import { Page, Job, Employer, Application, NewsArticle } from './types';
// Importa os dados mocados (simulados) para o funcionamento inicial da aplicação
import { MOCK_JOBS, MOCK_EMPLOYERS, MOCK_NEWS, MOCK_ABOUT_US } from './constants';
// Importa os componentes principais da interface
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import EmployerPage from './components/EmployerPage';
import NewsPage from './components/NewsPage';
import AboutPage from './components/AboutPage';
import FeedbackPage from './components/FeedbackPage';
import EducationPage from './components/EducationPage';
import * as fb from './services/firebaseService';

// Criação do Contexto da Aplicação (AppContext)
// O Contexto permite compartilhar o estado e as funções globalmente entre os componentes,
// evitando a necessidade de passar props manualmente através de múltiplos níveis (prop drilling).
export const AppContext = React.createContext<{
  jobs: Job[];
  employers: Employer[];
  loggedInEmployer: Employer | null;
  newsContent: NewsArticle[]; 
  aboutContent: string;
  setPage: (page: Page) => void;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  register: (companyName: string, email: string, pass: string) => Promise<boolean>;
  addJob: (job: Omit<Job, 'id' | 'postedDate' | 'employerId' | 'applications'>) => void;
  updateJob: (jobId: string, jobData: Omit<Job, 'id' | 'postedDate' | 'employerId' | 'applications'>) => void;
  addApplication: (jobId: string, application: Omit<Application, 'id' | 'date'>) => void;
  deleteJob: (jobId: string) => void;
} | null>(null);

// Componente principal da aplicação
const App: React.FC = () => {
  // --- ESTADOS GLOBAIS DA APLICAÇÃO ---
  // useState gerencia o estado interno dos componentes. Quando um estado muda, o componente re-renderiza.
  const [page, setPage] = useState<Page>('home'); // Estado para controlar a página atual
  const [jobs, setJobs] = useState<Job[]>(() => {
    try {
      const raw = localStorage.getItem('jobs');
      return raw ? JSON.parse(raw) as Job[] : MOCK_JOBS;
    } catch (e) {
      return MOCK_JOBS;
    }
  }); // Estado para a lista de vagas (carregado do localStorage quando disponível)

  const [employers, setEmployers] = useState<Employer[]>(() => {
    try {
      const raw = localStorage.getItem('employers');
      return raw ? JSON.parse(raw) as Employer[] : MOCK_EMPLOYERS;
    } catch (e) {
      return MOCK_EMPLOYERS;
    }
  }); // Estado para a lista de empregadores (carregado do localStorage quando disponível)

  const [loggedInEmployer, setLoggedInEmployer] = useState<Employer | null>(() => {
    try {
      const raw = localStorage.getItem('loggedInEmployer');
      return raw ? JSON.parse(raw) as Employer : null;
    } catch (e) {
      return null;
    }
  }); // Estado para o empregador logado (carregado do localStorage quando disponível)

  // --- FUNÇÕES DE LÓGICA DE NEGÓCIO ---
  // useCallback é usado para memoizar (guardar) a definição da função,
  // evitando que ela seja recriada a cada renderização. Isso otimiza a performance.

  // Função para realizar o login do empregador
  const login = useCallback(async (email: string, pass: string): Promise<boolean> => {
    if (fb.isEnabled()) {
      try {
        await fb.signIn(email, pass);
        setPage('employer');
        return true;
      } catch (e) {
        return false;
      }
    }
    const employer = employers.find(e => e.email === email && e.password === pass);
    if (employer) {
      setLoggedInEmployer(employer);
      setPage('employer'); // Redireciona para a página do empregador após o login
      return true;
    }
    return false;
  }, [employers]); // A função só será recriada se o array 'employers' mudar.

  // Função para realizar o logout
  const logout = useCallback(() => {
    if (fb.isEnabled()) {
      fb.signOutUser().catch(() => {});
    }
    setLoggedInEmployer(null);
  }, []);

  // Se o Firebase estiver habilitado, sincroniza com Firestore (jobs + auth)
  useEffect(() => {
    if (!fb.isEnabled()) return;
    const unsubJobs = fb.listenJobs((fbJobs) => {
      // Normaliza campos: createdAt -> postedDate (ISO string)
      const normalized = fbJobs.map(j => {
        // Converte createdAt (Timestamp do Firebase) para ISO string
        let postedDate = new Date().toISOString();
        if (j.createdAt) {
          if (typeof j.createdAt === 'string') {
            postedDate = j.createdAt; // já é string
          } else if (typeof j.createdAt === 'object' && j.createdAt.toDate) {
            postedDate = j.createdAt.toDate().toISOString(); // Firestore Timestamp
          } else if (j.createdAt instanceof Date) {
            postedDate = j.createdAt.toISOString(); // Date object
          }
        }
        return {
          id: j.id,
          employerId: j.employerId,
          title: j.title,
          companyName: j.companyName,
          location: j.location,
          salary: j.salary,
          benefits: j.benefits,
          workHours: j.workHours,
          workSchedule: j.workSchedule,
          workScale: j.workScale,
          requirements: j.requirements || { },
          postedDate,
          applications: j.applications || [],
          resumePreference: j.resumePreference || 'file'
        };
      });
      setJobs(normalized as Job[]);
      // Também sincroniza com localStorage como fallback
      try {
        localStorage.setItem('jobs', JSON.stringify(normalized));
      } catch (e) {
        // ignorar erro de storage
      }
    });

    const unsubAuth = fb.onAuthChanged(async (user) => {
      if (!user) {
        setLoggedInEmployer(null);
        return;
      }
      try {
        const emp = await fb.getEmployer(user.uid);
        if (emp) setLoggedInEmployer(emp as Employer);
      } catch (e) {
        // ignore
      }
    });

    return () => {
      try { unsubJobs(); } catch (e) {}
      try { unsubAuth(); } catch (e) {}
    };
  }, []);
  
  // Função para registrar um novo empregador
  const register = useCallback(async (companyName: string, email: string, pass: string): Promise<boolean> => {
    if (fb.isEnabled()) {
      try {
        const emp = await fb.signUp(companyName, email, pass);
        setLoggedInEmployer(emp as Employer);
        setPage('employer');
        return true;
      } catch (e) {
        return false;
      }
    }
    // Verifica se o e-mail já existe para evitar duplicatas
    if (employers.some(e => e.email === email)) {
        return false;
    }
    const newEmployer: Employer = {
        id: `emp-${Date.now()}`,
        companyName,
        email,
        password: pass,
    };
    setEmployers(prev => [...prev, newEmployer]);
    setLoggedInEmployer(newEmployer);
    setPage('employer');
    return true;
  }, [employers]);

  // Função para adicionar uma nova vaga de emprego
  const addJob = useCallback((jobData: Omit<Job, 'id' | 'postedDate' | 'employerId' | 'applications'>) => {
    if (fb.isEnabled()) {
      if (!loggedInEmployer) {
        // Usuário não está logado — informar ao usuário para evitar operação silenciosa
        try { window.alert('Você precisa estar logado como empregador para publicar vagas.'); } catch (e) {}
        return;
      }
      // Envia para Firestore; o listener sincronizará o estado local
      fb.addJob(jobData, loggedInEmployer.id).catch((err) => {
        // Mostra erro para o empregador (ajuda a debugar rules/erros de rede)
        try { window.alert('Falha ao publicar a vaga: ' + (err?.message || String(err))); } catch (e) {}
      });
      return;
    }
    if (!loggedInEmployer) {
      try { window.alert('Você precisa estar logado como empregador para publicar vagas.'); } catch (e) {}
      return;
    }
    const newJob: Job = {
      ...jobData,
      id: `job-${Date.now()}`,
      postedDate: new Date().toISOString(),
      employerId: loggedInEmployer.id,
      applications: [],
    };
    setJobs(prev => [newJob, ...prev]); // Adiciona a nova vaga no início da lista
  }, [loggedInEmployer]);

  // NOVO: Função para atualizar os dados de uma vaga existente.
  const updateJob = useCallback((jobId: string, jobData: Omit<Job, 'id' | 'postedDate' | 'employerId' | 'applications'>) => {
    if (fb.isEnabled()) {
      fb.updateJob(jobId, jobData).catch(() => {});
      return;
    }
    setJobs(prevJobs => prevJobs.map(job => {
      // Se o ID da vaga for o mesmo que estamos atualizando...
      if (job.id === jobId) {
        // ...retorna um novo objeto com os dados da vaga preservados (como id, data, etc.)
        // mas com as informações do formulário de edição aplicadas.
        return {
          ...job, // Mantém id, postedDate, employerId, applications
          ...jobData, // Aplica as novas informações (title, location, etc.)
        };
      }
      // Se não for a vaga que queremos editar, retorna a vaga sem modificação.
      return job;
    }));
  }, []);

  // NOVO: Função para excluir uma vaga existente.
  const deleteJob = useCallback((jobId: string) => {
    if (fb.isEnabled()) {
      fb.deleteJob(jobId).catch(() => {});
      return;
    }
    setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
  }, []);

  // Função para adicionar uma nova candidatura a uma vaga
  const addApplication = useCallback((jobId: string, applicationData: Omit<Application, 'id' | 'date'>) => {
    if (fb.isEnabled()) {
      fb.addApplication(jobId, applicationData).catch(() => {});
      return;
    }
    const newApplication: Application = {
        ...applicationData,
        id: `app-${Date.now()}`,
        date: new Date().toISOString(),
    };
    // Atualiza o estado das vagas, adicionando a nova candidatura à vaga correta
    setJobs(prevJobs => prevJobs.map(job => 
        job.id === jobId 
            ? { ...job, applications: [...job.applications, newApplication] } 
            : job
    ));
  }, []);

  // Sincroniza mudanças importantes com o localStorage para persistência entre reloads
  // (apenas quando Firebase está desabilitado; quando habilitado, o listener já sincroniza)
  useEffect(() => {
    if (fb.isEnabled()) return; // Firebase já sincroniza com localStorage no listener
    try {
      localStorage.setItem('jobs', JSON.stringify(jobs));
    } catch (e) {
      // falha em gravar no localStorage não bloqueia a aplicação
    }
  }, [jobs]);

  useEffect(() => {
    if (fb.isEnabled()) return;
    try {
      localStorage.setItem('employers', JSON.stringify(employers));
    } catch (e) {
      // falha silenciosa
    }
  }, [employers]);

  useEffect(() => {
    if (fb.isEnabled()) return;
    try {
      if (loggedInEmployer) {
        localStorage.setItem('loggedInEmployer', JSON.stringify(loggedInEmployer));
      } else {
        localStorage.removeItem('loggedInEmployer');
      }
    } catch (e) {
      // falha silenciosa
    }
  }, [loggedInEmployer]);

  // Função para renderizar a página correta com base no estado 'page'
  const renderPage = () => {
    switch (page) {
      case 'home':
        return <HomePage />;
      case 'employer':
        return <EmployerPage />;
      case 'news':
        return <NewsPage />;
      case 'about':
        return <AboutPage />;
      case 'feedback':
        return <FeedbackPage />;
      case 'education':
        return <EducationPage />;
      default:
        return <HomePage />;
    }
  };

  // useMemo memoiza o valor do contexto. Ele só será recalculado se uma de suas dependências mudar.
  // Isso evita que todos os componentes que consomem o contexto re-renderizem desnecessariamente.
  const contextValue = useMemo(() => ({
    jobs,
    employers,
    loggedInEmployer,
    newsContent: MOCK_NEWS,
    aboutContent: MOCK_ABOUT_US,
    setPage,
    login,
    logout,
    register,
    addJob,
    updateJob, // Disponibiliza a nova função no contexto
    deleteJob, // Disponibiliza a nova função de exclusão no contexto
    addApplication,
  }), [jobs, employers, loggedInEmployer, login, logout, register, addJob, updateJob, addApplication]);

  // O Provider do AppContext envolve a aplicação, disponibilizando o 'contextValue'
  // para todos os componentes filhos que precisarem dele.
  return (
    <AppContext.Provider value={contextValue}>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
        <Header />
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderPage()}
        </main>
        <Footer />
      </div>
    </AppContext.Provider>
  );
};

export default App;
