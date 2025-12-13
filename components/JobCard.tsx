
import React from 'react';
import { Job } from '../types';
import { MapPinIcon } from './icons/MapPinIcon';
import { ClockIcon } from './icons/ClockIcon';
import { BuildingOfficeIcon } from './icons/BuildingOfficeIcon';
import { HeartIcon } from './icons/HeartIcon';

interface JobCardProps {
  job: Job;
  onJobClick: (job: Job) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (jobId: string) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onJobClick, isFavorite = false, onToggleFavorite }) => {
  const timeSince = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return `há ${Math.floor(interval)} anos`;
    interval = seconds / 2592000;
    if (interval > 1) return `há ${Math.floor(interval)} meses`;
    interval = seconds / 86400;
    if (interval > 1) return `há ${Math.floor(interval)} dias`;
    interval = seconds / 3600;
    if (interval > 1) return `há ${Math.floor(interval)} horas`;
    interval = seconds / 60;
    if (interval > 1) return `há ${Math.floor(interval)} minutos`;
    return 'agora mesmo';
  };

  return (
    <div 
        onClick={() => onJobClick(job)}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col justify-between cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300 relative"
    >
        {/* Botão de favoritar */}
        {onToggleFavorite && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(job.id);
            }}
            className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-200 ${
              isFavorite 
                ? 'text-blue-500 hover:text-blue-600 bg-blue-50 dark:bg-blue-900/20' 
                : 'text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
            }`}
            aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          >
            <HeartIcon className="h-5 w-5" filled={isFavorite} />
          </button>
        )}
        <div>
            {/* Badge do tipo de vaga */}
            {job.jobType && (
              <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium mb-2 ${
                job.jobType === 'emprego' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                job.jobType === 'estagio' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                job.jobType === 'jovem-aprendiz' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
              }`}>
                {job.jobType === 'emprego' ? 'Emprego' :
                 job.jobType === 'estagio' ? 'Estágio' :
                 job.jobType === 'jovem-aprendiz' ? 'Jovem Aprendiz' : 'Curso'}
              </span>
            )}
            {job.companyName && (
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                    <BuildingOfficeIcon className="h-4 w-4 mr-2" />
                    <span>{job.companyName}</span>
                </div>
            )}
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{job.title}</h3>
            <div className="flex items-center text-gray-600 dark:text-gray-300 mt-2">
                <MapPinIcon className="h-5 w-5 mr-2"/>
                <span>{job.location}</span>
            </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <ClockIcon className="h-4 w-4 mr-2"/>
                <span>{timeSince(job.postedDate)}</span>
            </div>
             <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold">
                Ver Detalhes
             </div>
        </div>
    </div>
  );
};

export default JobCard;
