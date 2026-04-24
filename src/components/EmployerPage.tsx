
import React, { useContext, useState, useMemo, useEffect } from 'react';
import { AppContext } from '../App';
import { Job, Application } from '../types';
import PostJobForm from './PostJobForm';
import { PencilIcon } from './icons/PencilIcon';
import { XMarkIcon } from './icons/XMarkIcon';
import { BuildingOfficeIcon } from './icons/BuildingOfficeIcon';
import * as fb from '../services/firebaseService';
import { EmployerAuth } from './EmployerAuth';
import { getAuth } from 'firebase/auth';

const EmployerPage: React.FC = () => {
  const context = useContext(AppContext);
  
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedJobApplications, setSelectedJobApplications] = useState<Application[]>([]);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [applicationCounts, setApplicationCounts] = useState<Record<string, number>>({});
  const [companyNameInput, setCompanyNameInput] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);

  if (!context) return <div>Carregando...</div>;

  const { loggedInEmployer, updateEmployerName, jobs, deleteJob } = context;

  // Memoiza a lista de vagas do empregador para otimização
  const employerJobs = useMemo(() => {
    if (!loggedInEmployer) return [];
    return jobs.filter(job => job.employerId === loggedInEmployer.id);
  }, [jobs, loggedInEmployer]);

  // Carrega contagem de aplicações para cada vaga do empregador quando Firebase está habilitado
  useEffect(() => {
    if (!fb.isEnabled() || !loggedInEmployer) return;
    
    const loadApplicationCounts = async () => {
      const counts: Record<string, number> = {};
      for (const job of employerJobs) {
        try {
          const apps = await fb.getApplications(job.id);
          counts[job.id] = apps.length;
        } catch (e) {
          counts[job.id] = 0;
        }
      }
      setApplicationCounts(counts);
    };
    
    loadApplicationCounts();
  }, [employerJobs, loggedInEmployer]);

  // Função para salvar o nome da empresa
  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (companyNameInput.trim()) {
      updateEmployerName(companyNameInput.trim());
    }
    setIsEditingName(false);
  };

  const handleViewCandidates = async (job: Job) => {
    setSelectedJob(job);
    // fetch applications from Firestore if enabled
    if (fb.isEnabled()) {
      try {
        const apps = await fb.getApplications(job.id);
        setSelectedJobApplications(apps as Application[]);
      } catch (e) {
        setSelectedJobApplications([]);
      }
    } else {
      setSelectedJobApplications(job.applications || []);
    }
  };

  if (selectedJob) {
    return (
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
            <button onClick={() => setSelectedJob(null)} className="mb-4 text-blue-600 dark:text-blue-400 hover:underline">
                &larr; Voltar para Vagas
            </button>
            <h2 className="text-2xl font-bold mb-4">Candidatos para: {selectedJob.title}</h2>
            {selectedJobApplications.length > 0 ? (
                <div className="space-y-4">
                    {selectedJobApplications.map(app => (
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

  if (!loggedInEmployer) {
      return <EmployerAuth />;
  }

  // Verifica se o e-mail foi confirmado (somente quando Firebase está ativo)
  const currentUser = fb.isEnabled() ? getAuth().currentUser : null;
  const emailNotVerified = fb.isEnabled() && currentUser && !currentUser.emailVerified;

  // 3. Painel principal
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <h1 className="text-3xl font-bold">Painel do Empregador</h1>
        {fb.isEnabled() && (
          <button 
            onClick={() => fb.signOutUser()}
            className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400 rounded-md transition-colors"
          >
            Sair da Conta
          </button>
        )}
      </div>

      {/* Nome da empresa */}
      {isEditingName ? (
        <form onSubmit={handleSaveName} className="flex items-center gap-2 max-w-sm">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <BuildingOfficeIcon className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={companyNameInput}
              onChange={e => setCompanyNameInput(e.target.value)}
              placeholder="Nome da sua empresa"
              autoFocus
              className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 text-sm"
            />
          </div>
          <button type="submit" className="px-3 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700">Salvar</button>
          <button type="button" onClick={() => setIsEditingName(false)} className="px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500">Cancelar</button>
        </form>
      ) : (
        <div className="flex items-center gap-2">
          {loggedInEmployer.companyName ? (
            <p className="text-xl">Bem-vindo(a), <strong>{loggedInEmployer.companyName}</strong>!</p>
          ) : (
            <p className="text-xl text-gray-500 dark:text-gray-400">Defina o nome da sua empresa para exibi-lo nas vagas.</p>
          )}
          <button
            onClick={() => { setCompanyNameInput(loggedInEmployer.companyName || ''); setIsEditingName(true); }}
            className="p-1 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400"
            title="Editar nome da empresa"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
        </div>
      )}
      {/* Banner: e-mail não verificado */}
      {emailNotVerified && (
        <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 flex items-start gap-3">
          <svg className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              Verifique seu e-mail para publicar vagas.
            </p>
            <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
              Enviamos um link de verificação para <strong>{currentUser?.email}</strong>. Após confirmar, recarregue a página.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Coluna para publicar OU EDITAR uma vaga */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">
            {editingJob ? `Editando Vaga: "${editingJob.title}"` : 'Publicar Nova Vaga'}
          </h2>
          {emailNotVerified ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Verifique seu e-mail antes de publicar vagas.
            </p>
          ) : (
            <PostJobForm
              jobToEdit={editingJob}
              onFinish={() => setEditingJob(null)}
            />
          )}
        </div>
        {/* Coluna para listar vagas já publicadas */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Suas Vagas Publicadas</h2>
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {employerJobs.length > 0 ? employerJobs.map(job => (
              <div key={job.id} className="p-4 border rounded-md dark:border-gray-700 flex justify-between items-center gap-2">
                <div>
                  <h3 className="font-semibold">{job.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{job.location} - {applicationCounts[job.id] ?? job.applications.length} candidato(s)</p>
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
                      onClick={() => {
                        if (window.confirm('Tem certeza que deseja excluir esta vaga?\nEsta ação não poderá ser desfeita.')) {
                          deleteJob(job.id);
                        }
                      }} 
                      className="p-2 text-sm text-white bg-red-600 rounded-full hover:bg-red-700"
                      title="Excluir Vaga"
                    >
                        <XMarkIcon className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleViewCandidates(job)} 
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
