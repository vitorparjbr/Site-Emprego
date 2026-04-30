
import React, { useState, useContext } from 'react';
import { AppContext } from '../App';
import { Job } from '../types';
import * as fb from '../services/firebaseService';

interface ApplicationFormProps {
  job: Job;
  onCancel: () => void;
  onSuccess: () => void;
}

// Limite para upload no Firebase Storage (regras permitem até 5 MB).
const MAX_FILE_BYTES = 4.5 * 1024 * 1024; // 4,5 MB
const MAX_FILE_LABEL = '4,5 MB';

const ApplicationForm: React.FC<ApplicationFormProps> = ({ job, onCancel, onSuccess }) => {
  const [fullName, setFullName]     = useState('');
  const [email, setEmail]           = useState('');
  const [phone, setPhone]           = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [error, setError]           = useState('');
  const [submitting, setSubmitting] = useState(false);

  const context = useContext(AppContext);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_BYTES) {
      setError(`O arquivo é muito grande. O tamanho máximo permitido é ${MAX_FILE_LABEL}. O seu arquivo tem ${(file.size / 1024).toFixed(0)} KB.`);
      e.target.value = ''; // limpa o input
      setResumeFile(null);
      return;
    }

    setError('');
    setResumeFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!context) return;

    // Validação com base na preferência do empregador
    if (job.resumePreference === 'file' && !resumeFile) {
      setError('Por favor, anexe seu currículo.');
      return;
    }
    if (job.resumePreference === 'text' && !resumeText.trim()) {
      setError('Por favor, cole seu currículo no campo de texto.');
      return;
    }
    if (job.resumePreference === 'both' && !resumeFile && !resumeText.trim()) {
      setError('Por favor, anexe ou cole seu currículo.');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      if (resumeFile) {
        if (fb.isEnabled()) {
          // Upload para Firebase Storage — o currículo não ocupa espaço no Firestore
          const url = await fb.uploadResume(resumeFile, job.id);
          context.addApplication(job.id, {
            fullName,
            email,
            phone,
            resumeFile: { name: resumeFile.name, type: resumeFile.type, url },
            resumeText: resumeText || undefined,
          });
        } else {
          // Modo local sem Firebase: fallback para Base64
          const base64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(resumeFile);
            reader.onload  = () => resolve(reader.result as string);
            reader.onerror = () => reject(new Error('Não foi possível ler o arquivo.'));
          });
          context.addApplication(job.id, {
            fullName,
            email,
            phone,
            resumeFile: { name: resumeFile.name, type: resumeFile.type, content: base64 },
            resumeText: resumeText || undefined,
          });
        }
      } else {
        context.addApplication(job.id, {
          fullName,
          email,
          phone,
          resumeText: resumeText || undefined,
        });
      }

      onSuccess();
    } catch (err: any) {
      setError('Erro ao enviar candidatura: ' + (err?.message ?? 'tente novamente.'));
    } finally {
      setSubmitting(false);
    }
  };

  // Classes padronizadas — garante legibilidade em modo claro e escuro
  const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300';
  const inputClass =
    'mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 ' +
    'focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Formulário de Inscrição</h3>

      {/* Nome */}
      <div>
        <label className={labelClass}>Nome Completo *</label>
        <input
          type="text"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
          required
          placeholder="Seu nome completo"
          className={inputClass}
        />
      </div>

      {/* E-mail */}
      <div>
        <label className={labelClass}>E-mail *</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          placeholder="seu@email.com"
          className={inputClass}
        />
      </div>

      {/* Telefone */}
      <div>
        <label className={labelClass}>Telefone (Celular) *</label>
        <input
          type="tel"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          required
          placeholder="(00) 90000-0000"
          className={inputClass}
        />
      </div>

      {/* Upload de arquivo */}
      {(job.resumePreference === 'file' || job.resumePreference === 'both') && (
        <div>
          <label className={labelClass}>
            Currículo (PDF, JPG){job.resumePreference === 'file' && ' *'}
          </label>

          {/* Aviso de limite de tamanho */}
          <div className="mt-1 flex items-start gap-2 rounded-md bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 px-3 py-2 text-xs text-blue-700 dark:text-blue-300">
            <svg className="h-4 w-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z" />
            </svg>
            <span>
              <strong>Tamanho máximo: {MAX_FILE_LABEL}.</strong>{' '}
              Para currículos maiores, converta para PDF comprimido ou utilize o campo de texto abaixo.
            </span>
          </div>

          <input
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.jpg,.jpeg,.png"
            className="mt-2 block w-full text-sm text-gray-500 dark:text-gray-400
              file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0
              file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100 dark:file:bg-gray-600 dark:file:text-blue-300
              dark:hover:file:bg-gray-500"
          />

          {/* Confirmação do arquivo selecionado */}
          {resumeFile && !error && (
            <p className="mt-1 text-xs text-green-600 dark:text-green-400">
              ✓ {resumeFile.name} ({(resumeFile.size / 1024).toFixed(0)} KB)
            </p>
          )}
        </div>
      )}

      {/* Campo de texto */}
      {(job.resumePreference === 'text' || job.resumePreference === 'both') && (
        <div>
          <label className={labelClass}>
            {job.resumePreference === 'both' ? 'Ou cole seu Currículo (texto)' : 'Currículo (texto) *'}
          </label>
          <textarea
            value={resumeText}
            onChange={e => setResumeText(e.target.value)}
            rows={8}
            placeholder="Cole aqui o conteúdo do seu currículo: nome, formação, experiências, habilidades..."
            className={inputClass}
          />
        </div>
      )}

      {/* Mensagem de erro */}
      {error && (
        <div className="flex items-start gap-2 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-3 py-2 text-sm text-red-700 dark:text-red-300">
          <svg className="h-4 w-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 8v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Botões */}
      <div className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm
            font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700
            disabled:opacity-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium
            text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors
            flex items-center gap-2"
        >
          {submitting && (
            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          )}
          {submitting ? 'Enviando...' : 'Enviar Candidatura'}
        </button>
      </div>
    </form>
  );
};

export default ApplicationForm;
