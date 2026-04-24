
import React, { useState, useContext, useMemo, useEffect, useRef } from 'react';
import { AppContext } from '../App';
import { Job } from '../types';
import JobCard from './JobCard';
import JobDetailsModal from './JobDetailsModal';
import { XMarkIcon } from './icons/XMarkIcon';

function highlight(text: string, query: string) {
  if (!query) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <span className="font-bold text-blue-600 dark:text-blue-400">{text.slice(idx, idx + query.length)}</span>
      {text.slice(idx + query.length)}
    </>
  );
}

const HomePage: React.FC = () => {
  // Estado local para o termo de busca (cargo/empresa)
  const [searchTerm, setSearchTerm] = useState('');
  // Estado local para o filtro de localização
  const [locationFilter, setLocationFilter] = useState('');
  // Estado local para o filtro de tipo de vaga
  const [jobTypeFilter, setJobTypeFilter] = useState('');
  // Estado local para a vaga selecionada (para exibir o modal de detalhes)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  // Controle de foco dos dropdowns
  const [searchFocused, setSearchFocused] = useState(false);
  const [locationFocused, setLocationFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);

  // Acessa o contexto global da aplicação
  const context = useContext(AppContext);

  // Limpa os filtros sempre que o usuário navegar para "Início" ou clicar no logo
  const homeResetKey = context?.homeResetKey ?? 0;
  useEffect(() => {
    setSearchTerm('');
    setLocationFilter('');
    setJobTypeFilter('');
    setSelectedJob(null);
  }, [homeResetKey]);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
      if (locationRef.current && !locationRef.current.contains(e.target as Node)) {
        setLocationFocused(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Exibe spinner enquanto o contexto não estiver disponível
  if (!context) return (
    <div className="flex justify-center items-center py-20">
      <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
  );

  const { jobs, searchModalOpen, setSearchModalOpen } = context;

  const closeSearchModal = () => {
    setSearchModalOpen(false);
    setSearchFocused(false);
    setLocationFocused(false);
  };

  // Sugestões únicas para os dropdowns
  const searchSuggestions = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const lower = searchTerm.toLowerCase();
    const titles = jobs.map(j => j.title).filter(Boolean);
    const companies = jobs.map(j => j.companyName).filter(Boolean) as string[];
    return [...new Set([...titles, ...companies])]
      .filter(s => s.toLowerCase().includes(lower) && s.toLowerCase() !== lower)
      .slice(0, 6);
  }, [jobs, searchTerm]);

  const locationSuggestions = useMemo(() => {
    if (!locationFilter.trim()) return [];
    const lower = locationFilter.toLowerCase();
    return [...new Set(jobs.map(j => j.location).filter(Boolean) as string[])]
      .filter(s => s.toLowerCase().includes(lower) && s.toLowerCase() !== lower)
      .slice(0, 6);
  }, [jobs, locationFilter]);

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchesSearchTerm = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              (job.companyName && job.companyName.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesLocation = job.location.toLowerCase().includes(locationFilter.toLowerCase());
      const matchesJobType = jobTypeFilter ? job.jobType === jobTypeFilter : true;
      
      return matchesSearchTerm && matchesLocation && matchesJobType;
    });
  }, [jobs, searchTerm, locationFilter, jobTypeFilter]);
  
  // Função para abrir o modal de detalhes da vaga
  const handleJobClick = (job: Job) => {
    setSelectedJob(job);
  };
  
  // Função para fechar o modal
  const handleCloseModal = () => {
    setSelectedJob(null);
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 md:p-12 text-center text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Sua próxima oportunidade está aqui
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
            Vagas de emprego, estágio e jovem aprendiz em todo o Brasil. Conectamos você às melhores empresas.
          </p>
          <div className="pt-4">
            <button
              onClick={() => setSearchModalOpen(true)}
              className="bg-white text-blue-700 font-bold py-3 px-8 rounded-full shadow-md hover:bg-blue-50 hover:scale-105 transition-all duration-300 text-lg"
            >
              🔍 Buscar Vagas
            </button>
          </div>
        </div>
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <svg className="absolute w-64 h-64 -top-10 -left-10 text-white" fill="currentColor" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50"/></svg>
          <svg className="absolute w-96 h-96 -bottom-20 -right-20 text-white" fill="currentColor" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50"/></svg>
        </div>
      </div>

      {/* Modal de busca flutuante */}
      {searchModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4"
          onMouseDown={(e) => { if (e.target === e.currentTarget) closeSearchModal(); }}
        >
          {/* Overlay escuro */}
          <div className="absolute inset-0 bg-black/40" />
          {/* Caixa do modal */}
          <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-lg p-6 z-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Sua oportunidade está aqui</h2>
              <button
                onClick={closeSearchModal}
                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                aria-label="Fechar busca"
              >
                <XMarkIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {/* Campo: cargo ou empresa */}
              <div className="relative" ref={searchRef}>
                <input
                  type="text"
                  placeholder="Digite o cargo ou empresa"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  aria-label="Buscar por cargo ou empresa"
                  autoComplete="off"
                  autoFocus
                />
                {searchFocused && searchSuggestions.length > 0 && (
                  <ul className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg overflow-hidden">
                    {searchSuggestions.map((s) => (
                      <li
                        key={s}
                        onMouseDown={() => { setSearchTerm(s); setSearchFocused(false); }}
                        className="px-4 py-2 cursor-pointer text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700"
                      >
                        {highlight(s, searchTerm)}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {/* Campo: cidade ou estado */}
              <div className="relative" ref={locationRef}>
                <input
                  type="text"
                  placeholder="Digite a cidade ou estado"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  onFocus={() => setLocationFocused(true)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  aria-label="Filtrar por cidade ou estado"
                  autoComplete="off"
                />
                {locationFocused && locationSuggestions.length > 0 && (
                  <ul className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg overflow-hidden">
                    {locationSuggestions.map((s) => (
                      <li
                        key={s}
                        onMouseDown={() => { setLocationFilter(s); setLocationFocused(false); }}
                        className="px-4 py-2 cursor-pointer text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700"
                      >
                        {highlight(s, locationFilter)}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              
              {/* Campo: Tipo de Vaga */}
              <div>
                <select
                  value={jobTypeFilter}
                  onChange={(e) => setJobTypeFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  aria-label="Filtrar por tipo de vaga"
                >
                  <option value="">Todos os tipos de vaga</option>
                  <option value="emprego">Emprego</option>
                  <option value="estagio">Estágio</option>
                  <option value="jovem-aprendiz">Jovem Aprendiz</option>
                  <option value="curso">Curso / Treinamento</option>
                </select>
              </div>
              <button
                onClick={closeSearchModal}
                className="mt-1 w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
              >
                Ver resultados
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Grid para exibir os cards das vagas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.length > 0 ? (
          // Mapeia e renderiza um JobCard para cada vaga filtrada
          filteredJobs.map(job => (
            <JobCard 
              key={job.id} 
              job={job} 
              onJobClick={handleJobClick}
            />
          ))
        ) : jobs.length === 0 ? (
          // Tela de boas-vindas quando ainda não há nenhuma vaga publicada
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-center gap-4">
            <svg className="h-16 w-16 text-blue-200 dark:text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0H4m8-6v6m0 0l-3-3m3 3l3-3" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200">Nenhuma vaga disponível no momento</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-md">
              Ainda não há vagas publicadas. Se você é uma empresa, clique em <strong>Publicar Vagas</strong> no menu e comece a encontrar os melhores talentos do Brasil!
            </p>
            <button
              onClick={() => context.setPage('employer')}
              className="mt-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
            >
              Publicar uma vaga agora
            </button>
          </div>
        ) : (
          // Mensagem exibida quando a busca não retorna resultados
          <div className="col-span-full text-center py-10">
            <p className="text-gray-500 dark:text-gray-400">Nenhuma vaga encontrada. Tente ajustar seus filtros.</p>
          </div>
        )}
      </div>

      {/* Renderiza o modal de detalhes da vaga se uma vaga estiver selecionada */}
      {selectedJob && (
        <JobDetailsModal 
          job={selectedJob} 
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default HomePage;
