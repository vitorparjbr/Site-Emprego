
import React, { useContext, useState, useMemo } from 'react';
import { AppContext } from '../App';
import { Job, Application } from '../types';
import PostJobForm from './PostJobForm';
import { UserIcon } from './icons/UserIcon';
import { LockClosedIcon } from './icons/LockClosedIcon';
import { BuildingOfficeIcon } from './icons/BuildingOfficeIcon';
import { PencilIcon } from './icons/PencilIcon';

const EmployerPage: React.FC = () => {
  const context = useContext(AppContext);
  
  // --- ESTADOS LOCAIS DO COMPONENTE ---
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [error, setError] = useState('');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  // NOVO: Estado para controlar qual vaga está em modo de edição.
  // Se for null, o formulário é para criar uma nova vaga.
  // Se contiver uma vaga, o formulário é para editar essa vaga.
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  if (!context) return <div>Carregando...</div>;

  const { loggedInEmployer, login, logout, register, jobs } = context;

  // Memoiza a lista de vagas do empregador logado para otimização
  const employerJobs = useMemo(() => {
    if (!loggedInEmployer) return [];
    return jobs.filter(job => job.employerId === loggedInEmployer.id);
  }, [jobs, loggedInEmployer]);

  // Função para tratar o submit do formulário de login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!login(email, password)) {
      setError('E-mail ou senha inválidos.');
    } else {
      setError('');
    }
  };
  
  // Função para tratar o submit do formulário de registro
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!register(companyName, email, password)) {
      setError('Este e-mail já está em uso.');
    } else {
      setError('');
    }
  };

  // --- RENDERIZAÇÃO CONDICIONAL ---

  // 1. Se não há empregador logado, exibe o formulário de login/cadastro
  if (!loggedInEmployer) {
    return (
      <div className="max-w-md mx-auto mt-10">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
          <div className="flex justify-center mb-6">
            <button onClick={() => setIsLoginView(true)} className={`px-4 py-2 font-semibold ${isLoginView ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>Login</button>
            <button onClick={() => setIsLoginView(false)} className={`px-4 py-2 font-semibold ${!isLoginView ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>Cadastro</button>
          </div>
          <form onSubmit={isLoginView ? handleLogin : handleRegister} className="space-y-6">
            <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">{isLoginView ? 'Acesso do Empregador' : 'Cadastre sua Empresa'}</h2>
            {!isLoginView && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome da Empresa</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                       <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
                   </div>
                   <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} required className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600" />
                </div>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">E-mail</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                       <UserIcon className="h-5 w-5 text-gray-400" />
                   </div>
                   <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Senha</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                       <LockClosedIcon className="h-5 w-5 text-gray-400" />
                   </div>
                   <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600" />
              </div>
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              {isLoginView ? 'Entrar' : 'Cadastrar'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 2. Se uma vaga foi selecionada, exibe a lista de candidatos para essa vaga
  if (selectedJob) {
    return (
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
            <button onClick={() => setSelectedJob(null)} className="mb-4 text-blue-600 dark:text-blue-400 hover:underline">
                &larr; Voltar para Vagas
            </button>
            <h2 className="text-2xl font-bold mb-4">Candidatos para: {selectedJob.title}</h2>
            {selectedJob.applications.length > 0 ? (
                <div className="space-y-4">
                    {selectedJob.applications.map(app => (
                        <div key={app.id} className="p-4 border rounded-md dark:border-gray-700">
                            <p><strong>Nome:</strong> {app.fullName}</p>
                            <p><strong>Email:</strong> <a href={`mailto:${app.email}`} className="text-blue-500 hover:underline">{app.email}</a></p>
                            <p><strong>Telefone:</strong> <a href={`tel:${app.phone}`} className="text-blue-500 hover:underline">{app.phone}</a></p>
                             {app.resumeFile && (
                                <p>
                                  <strong>Currículo (Arquivo):</strong>{' '}
                                  <a href={app.resumeFile.content} download={app.resumeFile.name} className="text-blue-500 hover:underline">
                                    {app.resumeFile.name}
                                  </a>
                                </p>
                              )}
                             {app.resumeText && <div className="mt-2"><strong>Currículo (Texto):</strong><pre className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded whitespace-pre-wrap font-sans">{app.resumeText}</pre></div>}
                        </div>
                    ))}
                </div>
            ) : <p>Nenhum candidato ainda.</p>}
        </div>
    );
  }

  // 3. Se o empregador está logado e nenhuma vaga específica foi selecionada, exibe o painel principal
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Painel do Empregador</h1>
        <button onClick={logout} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">Sair</button>
      </div>
      <p className="text-xl">Bem-vindo(a), {loggedInEmployer.companyName}!</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Coluna para publicar OU EDITAR uma vaga */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">
            {/* O título muda dinamicamente se estamos editando ou criando */}
            {editingJob ? `Editando Vaga: "${editingJob.title}"` : 'Publicar Nova Vaga'}
          </h2>
          <PostJobForm 
            jobToEdit={editingJob} 
            // Passa uma função para limpar o estado de edição quando o formulário for concluído
            onFinish={() => setEditingJob(null)}
          />
        </div>
        {/* Coluna para listar vagas já publicadas */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Suas Vagas Publicadas</h2>
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {employerJobs.length > 0 ? employerJobs.map(job => (
              <div key={job.id} className="p-4 border rounded-md dark:border-gray-700 flex justify-between items-center gap-2">
                <div>
                  <h3 className="font-semibold">{job.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{job.location} - {job.applications.length} candidato(s)</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    {/* NOVO: Botão para colocar a vaga em modo de edição */}
                    <button 
                      onClick={() => setEditingJob(job)} 
                      className="p-2 text-sm text-white bg-yellow-500 rounded-full hover:bg-yellow-600"
                      title="Editar Vaga"
                    >
                        <PencilIcon className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => setSelectedJob(job)} 
                      className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                    >
                        Ver Candidatos
                    </button>
                </div>
              </div>
            )) : <p>Você ainda não publicou nenhuma vaga.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerPage;
