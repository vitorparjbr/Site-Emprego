
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
  login: (email: string, pass: string) => boolean;
  logout: () => void;
  register: (companyName: string, email: string, pass: string) => boolean;
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
  const login = useCallback((email: string, pass: string): boolean => {
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
    setLoggedInEmployer(null);
  }, []);
  
  // Função para registrar um novo empregador
  const register = useCallback((companyName: string, email: string, pass: string): boolean => {
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
    if (!loggedInEmployer) return;
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
    setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
  }, []);

  // Função para adicionar uma nova candidatura a uma vaga
  const addApplication = useCallback((jobId: string, applicationData: Omit<Application, 'id' | 'date'>) => {
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
  useEffect(() => {
    try {
      localStorage.setItem('jobs', JSON.stringify(jobs));
    } catch (e) {
      // falha em gravar no localStorage não bloqueia a aplicação
    }
  }, [jobs]);

  useEffect(() => {
    try {
      localStorage.setItem('employers', JSON.stringify(employers));
    } catch (e) {
      // falha silenciosa
    }
  }, [employers]);

  useEffect(() => {
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
