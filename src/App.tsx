
import React, { useState, useCallback, useMemo, useEffect } from 'react';
// Importa os tipos de dados usados na aplicação (Page, Job, Employer, Application)
import { Page, Job, Employer, Application } from './types';
// Importa os dados mocados (simulados) para o funcionamento inicial da aplicação
import { MOCK_JOBS, MOCK_ABOUT_US } from './constants';
// Importa os componentes principais da interface
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import EmployerPage from './components/EmployerPage';
import AboutPage from './components/AboutPage';
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import TermsOfUsePage from './components/TermsOfUsePage';
import * as fb from './services/firebaseService';
import { Toaster, toast } from 'react-hot-toast';

// Criação do Contexto da Aplicação (AppContext)
// O Contexto permite compartilhar o estado e as funções globalmente entre os componentes,
// evitando a necessidade de passar props manualmente através de múltiplos níveis (prop drilling).
export const AppContext = React.createContext<{
  jobs: Job[];
  loggedInEmployer: Employer | null;
  aboutContent: string;
  setPage: (page: Page) => void;
  updateEmployerName: (name: string) => void;
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

  const [loggedInEmployer, setLoggedInEmployer] = useState<Employer | null>(() => {
    if (fb.isEnabled()) return null;
    try {
      const raw = localStorage.getItem('loggedInEmployer');
      if (raw) return JSON.parse(raw) as Employer;
    } catch (e) {}
    const anon: Employer = { id: `emp-${Date.now()}`, companyName: '' };
    try { localStorage.setItem('loggedInEmployer', JSON.stringify(anon)); } catch (e) {}
    return anon;
  }); // O Firebase substituirá isso pelo Auth
  
  const [authInitialized, setAuthInitialized] = useState(!fb.isEnabled());

  // Conecta ao observador de contas do Firebase
  useEffect(() => {
    if (!fb.isEnabled()) return;
    const unsub = fb.onAuthChanged(async (user) => {
      if (user) {
        try {
          const empData = await fb.getEmployer(user.uid);
          if (empData) {
            setLoggedInEmployer(empData as Employer);
          } else {
            setLoggedInEmployer({ id: user.uid, companyName: '', email: user.email || '' });
          }
        } catch (e) {}
      } else {
        setLoggedInEmployer(null);
      }
      setAuthInitialized(true);
    });
    return () => unsub();
  }, []);

  // --- FUNÇÕES DE LÓGICA DE NEGÓCIO ---
  // useCallback é usado para memoizar (guardar) a definição da função,
  // evitando que ela seja recriada a cada renderização. Isso otimiza a performance.

  // Função para atualizar o nome da empresa do empregador
  const updateEmployerName = useCallback((name: string) => {
    setLoggedInEmployer(prev => prev ? { ...prev, companyName: name } : null);
  }, []);

  // Se o Firebase estiver habilitado, sincroniza com Firestore (jobs)
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
          ...j,
          requirements: j.requirements || {},
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

    return () => {
      try { unsubJobs(); } catch (e) {}
    };
  }, []);

  // Função para adicionar uma nova vaga de emprego
  const addJob = useCallback((jobData: Omit<Job, 'id' | 'postedDate' | 'employerId' | 'applications'>) => {
    if (!loggedInEmployer) {
      toast.error('Você precisa estar logado para publicar!');
      return;
    }
    if (fb.isEnabled()) {
      // Envia para Firestore; o listener sincronizará o estado local
      fb.addJob(jobData, loggedInEmployer.id).catch((err) => {
        try { toast.error('Falha ao publicar a vaga: ' + (err?.message || String(err))); } catch (e) {}
      });
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
    try {
      localStorage.setItem('loggedInEmployer', JSON.stringify(loggedInEmployer));
    } catch (e) {
      // falha silenciosa
    }
  }, [loggedInEmployer]);

  // Função para renderizar a página correta com base no estado 'page'
  const renderPage = () => {
    if (!authInitialized) {
      return (
        <div className="flex justify-center items-center py-20">
            <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        </div>
      );
    }

    switch (page) {
      case 'home':
        return <HomePage />;
      case 'employer':
        return <EmployerPage />;
      case 'about':
        return <AboutPage />;
      case 'privacy':
        return <PrivacyPolicyPage />;
      case 'terms':
        return <TermsOfUsePage />;
      default:
        return <HomePage />;
    }
  };

  // useMemo memoiza o valor do contexto. Ele só será recalculado se uma de suas dependências mudar.
  // Isso evita que todos os componentes que consomem o contexto re-renderizem desnecessariamente.
  const contextValue = useMemo(() => ({
    jobs,
    loggedInEmployer,
    aboutContent: MOCK_ABOUT_US,
    setPage,
    updateEmployerName,
    addJob,
    updateJob,
    deleteJob,
    addApplication,
  }), [jobs, loggedInEmployer, updateEmployerName, addJob, updateJob, addApplication]);

  // O Provider do AppContext envolve a aplicação, disponibilizando o 'contextValue'
  // para todos os componentes filhos que precisarem dele.
  return (
    <AppContext.Provider value={contextValue}>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
        <Toaster position="top-right" />
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
