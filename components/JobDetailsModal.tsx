
import React, { useState } from 'react';
import { Job } from '../types';
import ApplicationForm from './ApplicationForm';
import { XMarkIcon } from './icons/XMarkIcon';

interface JobDetailsModalProps {
  job: Job;
  onClose: () => void;
}

// Componente auxiliar para exibir um item de detalhe (label e valor)
// Não renderiza nada se o valor não for fornecido.
const DetailItem: React.FC<{ label: string; value?: string }> = ({ label, value }) => {
    if (!value) return null;
    return (
        <div>
            <h4 className="font-semibold text-gray-700 dark:text-gray-300">{label}</h4>
            <p className="text-gray-600 dark:text-gray-400">{value}</p>
        </div>
    );
};

const JobDetailsModal: React.FC<JobDetailsModalProps> = ({ job, onClose }) => {
  // Estado para controlar a exibição do formulário de candidatura dentro do modal
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  // Função chamada quando a candidatura é enviada com sucesso
  const handleApplySuccess = () => {
    setShowApplicationForm(false); // Esconde o formulário
    onClose(); // Fecha o modal
    // Em uma aplicação real, aqui poderia ser exibida uma mensagem de sucesso (toast)
  };

  return (
    // Overlay de fundo
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      {/* Container do Modal */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Cabeçalho do Modal */}
        <div className="p-6 flex justify-between items-center border-b dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{job.title}</h2>
            <p className="text-gray-600 dark:text-gray-400">{job.companyName || 'Confidencial'} - {job.location}</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600" aria-label="Fechar modal">
            <XMarkIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Corpo do Modal (com scroll) */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Renderização condicional: ou exibe o formulário, ou os detalhes da vaga */}
          {showApplicationForm ? (
            <ApplicationForm job={job} onCancel={() => setShowApplicationForm(false)} onSuccess={handleApplySuccess} />
          ) : (
            <>
              {/* Detalhes principais da vaga */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailItem label="Salário" value={job.salary} />
                <DetailItem label="Benefícios" value={job.benefits} />
                <DetailItem label="Carga Horária" value={job.workHours} />
                <DetailItem label="Jornada" value={job.workSchedule} />
                <DetailItem label="Escala de Trabalho" value={job.workScale} />
                <DetailItem label="Data de Publicação" value={new Date(job.postedDate).toLocaleDateString('pt-BR')} />
              </div>
              {/* Requisitos da vaga */}
              <div>
                <h3 className="text-lg font-bold mb-2 text-gray-800 dark:text-gray-200">Requisitos</h3>
                <div className="pl-4 border-l-2 border-blue-500 space-y-2">
                    <DetailItem label="Escolaridade" value={job.requirements.education} />
                    <DetailItem label="Experiência" value={job.requirements.experience} />
                    <DetailItem label="Perfil Profissional" value={job.requirements.profile} />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Rodapé do Modal (só aparece na view de detalhes) */}
        {!showApplicationForm && (
          <div className="p-6 border-t dark:border-gray-700 mt-auto">
            <button
              onClick={() => setShowApplicationForm(true)}
              className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Candidatar-se
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetailsModal;
