
import React from 'react';
import { Job } from '../types';
import { MapPinIcon } from './icons/MapPinIcon';
import { ClockIcon } from './icons/ClockIcon';
import { BuildingOfficeIcon } from './icons/BuildingOfficeIcon';
import { ArrowRightIcon } from './icons/ArrowRightIcon';

interface JobCardProps {
  job: Job;
  onJobClick: (job: Job) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onJobClick }) => {
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
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col justify-between cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300"
    >
        <div>
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
                Ver Detalhes <ArrowRightIcon className="h-4 w-4 ml-1" />
             </div>
        </div>
    </div>
  );
};

export default JobCard;
