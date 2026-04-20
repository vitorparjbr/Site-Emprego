
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
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md max-w-2xl mx-auto w-full">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Sua oportunidade está aqui</h1>
        <div className="flex flex-col gap-3">
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
