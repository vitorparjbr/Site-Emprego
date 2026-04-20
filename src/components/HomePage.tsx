
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

  // Exibe uma mensagem de carregamento se o contexto ainda não estiver disponível
  if (!context) return <div>Carregando...</div>;

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
    return [...new Set(jobs.map(j => j.location).filter(Boolean))]
      .filter(s => s.toLowerCase().includes(lower) && s.toLowerCase() !== lower)
      .slice(0, 6);
  }, [jobs, locationFilter]);

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchesSearchTerm = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              (job.companyName && job.companyName.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesLocation = job.location.toLowerCase().includes(locationFilter.toLowerCase());
      return matchesSearchTerm && matchesLocation;
    });
  }, [jobs, searchTerm, locationFilter]);
  
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
        ) : (
          // Mensagem exibida quando nenhuma vaga é encontrada
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
