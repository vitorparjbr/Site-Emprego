
import React, { useState, useContext, useMemo, useEffect } from 'react';
import { AppContext } from '../App';
import { Job } from '../types';
import JobCard from './JobCard';
import JobDetailsModal from './JobDetailsModal';

// Chave para localStorage
const FAVORITES_KEY = 'favoriteJobs';

const HomePage: React.FC = () => {
  // Estado local para o termo de busca (cargo/empresa)
  const [searchTerm, setSearchTerm] = useState('');
  // Estado local para o filtro de localização
  const [locationFilter, setLocationFilter] = useState('');
  // Estado local para a vaga selecionada (para exibir o modal de detalhes)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  // Estado para favoritos
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem(FAVORITES_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  // Estado para filtrar apenas favoritas
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  
  // Acessa o contexto global da aplicação
  const context = useContext(AppContext);

  // Persistir favoritos no localStorage
  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  // Exibe uma mensagem de carregamento se o contexto ainda não estiver disponível
  if (!context) return <div>Carregando...</div>;

  const { jobs } = context;

  // Função para alternar favorito
  const toggleFavorite = (jobId: string) => {
    setFavorites(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  // useMemo é usado para otimizar o processo de filtragem.
  // A lista de 'filteredJobs' só será recalculada quando 'jobs', 'searchTerm', 'locationFilter' ou filtros de favoritos mudarem.
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      // Verifica se o título ou nome da empresa corresponde ao termo de busca (ignorando maiúsculas/minúsculas)
      const matchesSearchTerm = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              (job.companyName && job.companyName.toLowerCase().includes(searchTerm.toLowerCase()));
      // Verifica se a localização corresponde ao filtro (ignorando maiúsculas/minúsculas)
      const matchesLocation = job.location.toLowerCase().includes(locationFilter.toLowerCase());
      // Verifica se é favorita (se o filtro estiver ativo)
      const matchesFavorites = !showOnlyFavorites || favorites.includes(job.id);
      return matchesSearchTerm && matchesLocation && matchesFavorites;
    });
  }, [jobs, searchTerm, locationFilter, showOnlyFavorites, favorites]);
  
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
      {/* Seção de busca e filtro */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-4">Sua oportunidade está aqui</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Digite o cargo ou empresa"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            aria-label="Buscar por cargo ou empresa"
          />
          <input
            type="text"
            placeholder="Digite a cidade ou estado"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            aria-label="Filtrar por cidade ou estado"
          />
        </div>
        {/* Filtro de favoritas */}
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setShowOnlyFavorites(false)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              !showOnlyFavorites
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Todas as vagas
          </button>
          <button
            onClick={() => setShowOnlyFavorites(true)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
              showOnlyFavorites
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
              <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
            </svg>
            Favoritas ({favorites.length})
          </button>
        </div>
      </div>
      
      {/* Grid para exibir os cards das vagas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.length > 0 ? (
          // Mapeia e renderiza um JobCard para cada vaga filtrada
          filteredJobs.map(job => (
            <JobCard 
              key={job.id} 
              job={job} 
              onJobClick={handleJobClick}
              isFavorite={favorites.includes(job.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))
        ) : (
          // Mensagem exibida quando nenhuma vaga é encontrada
          <div className="col-span-full text-center py-10">
            <p className="text-gray-500 dark:text-gray-400">
              {showOnlyFavorites 
                ? 'Você ainda não tem vagas favoritas. Clique no coração para adicionar!' 
                : 'Nenhuma vaga encontrada. Tente ajustar seus filtros.'}
            </p>
          </div>
        )}
      </div>

      {/* Renderiza o modal de detalhes da vaga se uma vaga estiver selecionada */}
      {selectedJob && (
        <JobDetailsModal 
          job={selectedJob} 
          onClose={handleCloseModal}
          isFavorite={favorites.includes(selectedJob.id)}
          onToggleFavorite={toggleFavorite}
        />
      )}
    </div>
  );
};

export default HomePage;
