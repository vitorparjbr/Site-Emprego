
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

// Componente de botões de compartilhamento
const ShareButtons: React.FC<{ job: Job }> = ({ job }) => {
  const [copied, setCopied] = useState(false);
  
  // Gerar texto e URL para compartilhamento
  const shareText = `Vaga de ${job.title} em ${job.location}${job.salary ? ` - ${job.salary}` : ''}`;
  const shareUrl = window.location.href;
  
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  };
  
  const shareWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`;
    window.open(url, '_blank');
  };
  
  const shareLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank');
  };
  
  const shareTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500 dark:text-gray-400">Compartilhar:</span>
      <button
        onClick={shareWhatsApp}
        className="p-2 rounded-full bg-green-500 hover:bg-green-600 text-white transition-colors"
        title="Compartilhar no WhatsApp"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </button>
      <button
        onClick={shareLinkedIn}
        className="p-2 rounded-full bg-blue-700 hover:bg-blue-800 text-white transition-colors"
        title="Compartilhar no LinkedIn"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      </button>
      <button
        onClick={shareTwitter}
        className="p-2 rounded-full bg-black hover:bg-gray-800 text-white transition-colors"
        title="Compartilhar no X (Twitter)"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      </button>
      <button
        onClick={handleCopyLink}
        className={`p-2 rounded-full transition-colors ${copied ? 'bg-green-500 text-white' : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200'}`}
        title={copied ? 'Copiado!' : 'Copiar link'}
      >
        {copied ? (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        )}
      </button>
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
          <div className="p-6 border-t dark:border-gray-700 mt-auto space-y-4">
            <ShareButtons job={job} />
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
