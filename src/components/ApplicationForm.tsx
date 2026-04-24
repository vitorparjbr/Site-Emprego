
import React, { useState, useContext } from 'react';
import { AppContext } from '../App';
import { Job } from '../types';
import * as fb from '../services/firebaseService';

interface ApplicationFormProps {
  job: Job;
  onCancel: () => void;
  onSuccess: () => void;
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({ job, onCancel, onSuccess }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const context = useContext(AppContext);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      // Limite de 5 MB para o arquivo
      if (file.size > 5 * 1024 * 1024) {
        setError('O arquivo deve ter no máximo 5 MB.');
        return;
      }
      setResumeFile(file);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!context) return;

    // --- Validação com base na preferência do empregador ---
    if (job.resumePreference === 'file' && !resumeFile) {
      setError('Por favor, anexe seu currículo.');
      return;
    }
    if (job.resumePreference === 'text' && !resumeText.trim()) {
      setError('Por favor, cole seu currículo.');
      return;
    }
    if (job.resumePreference === 'both' && !resumeFile && !resumeText.trim()) {
      setError('Por favor, anexe ou cole seu currículo.');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      let resumeFileData: { name: string; type: string; url: string } | undefined = undefined;

      if (resumeFile) {
        if (fb.isEnabled()) {
          // Firebase habilitado: envia para o Storage e salva só a URL
          const url = await fb.uploadResume(resumeFile, job.id);
          resumeFileData = {
            name: resumeFile.name,
            type: resumeFile.type,
            url,
          };
        } else {
          // Modo local (sem Firebase): usa Base64 apenas como fallback
          const base64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(resumeFile);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
          });
          resumeFileData = {
            name: resumeFile.name,
            type: resumeFile.type,
            url: base64, // base64 apenas localmente
          };
        }
      }

      // Monta o objeto de candidatura — sem binários grandes no Firestore
      context.addApplication(job.id, {
        fullName,
        email,
        phone,
        // Mantém compatibilidade: resume com URL (ou base64 local)
        resumeFile: resumeFileData
          ? { name: resumeFileData.name, type: resumeFileData.type, content: resumeFileData.url }
          : undefined,
        resumeText: resumeText || undefined,
      });

      onSuccess();
    } catch (err: any) {
      setError('Erro ao enviar candidatura: ' + (err?.message || 'tente novamente.'));
    } finally {
      setSubmitting(false);
    }
  };

  // Classe padrão para labels — garante legibilidade no modo claro e escuro
  const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300';
  const inputClass =
    'mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Formulário de Inscrição</h3>

      <div>
        <label className={labelClass}>Nome Completo *</label>
        <input
          type="text"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
          required
          className={inputClass}
          placeholder="Seu nome completo"
        />
      </div>

      <div>
        <label className={labelClass}>E-mail *</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className={inputClass}
          placeholder="seu@email.com"
        />
      </div>

      <div>
        <label className={labelClass}>Telefone (Celular) *</label>
        <input
          type="tel"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          required
          className={inputClass}
          placeholder="(00) 90000-0000"
        />
      </div>

      {/* Campo de upload de arquivo */}
      {(job.resumePreference === 'file' || job.resumePreference === 'both') && (
        <div>
          <label className={labelClass}>
            Currículo (PDF, JPG — máx. 5 MB)
            {job.resumePreference === 'file' && ' *'}
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.jpg,.jpeg,.png"
            className="mt-1 block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-600 dark:file:text-blue-300 dark:hover:file:bg-gray-500"
          />
        </div>
      )}

      {/* Campo de texto livre */}
      {(job.resumePreference === 'text' || job.resumePreference === 'both') && (
        <div>
          <label className={labelClass}>
            {job.resumePreference === 'both' ? 'Ou cole seu Currículo' : 'Currículo (texto) *'}
          </label>
          <textarea
            value={resumeText}
            onChange={e => setResumeText(e.target.value)}
            rows={8}
            className={inputClass}
            placeholder="Cole aqui o conteúdo do seu currículo..."
          />
        </div>
      )}

      {error && <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>}

      <div className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
        >
          {submitting && (
            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          )}
          {submitting ? 'Enviando...' : 'Enviar Candidatura'}
        </button>
      </div>
    </form>
  );
};

export default ApplicationForm;
