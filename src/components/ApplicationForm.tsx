
import React, { useState, useContext } from 'react';
import { AppContext } from '../App';
import { Job } from '../types';

interface ApplicationFormProps {
  job: Job;
  onCancel: () => void;
  onSuccess: () => void;
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({ job, onCancel, onSuccess }) => {
  // Estados para os campos do formulário
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [error, setError] = useState('');
  
  const context = useContext(AppContext);

  // Função para lidar com a seleção de arquivo do currículo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setResumeFile(e.target.files[0]);
    }
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Impede o recarregamento da página
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

    setError(''); // Limpa erros anteriores
    
    let fileContent: { name: string; type: string; content: string; } | undefined = undefined;
    
    // Se um arquivo foi anexado, ele precisa ser lido
    if (resumeFile) {
        // FileReader é uma API do navegador para ler o conteúdo de arquivos
        const reader = new FileReader();
        // Converte o arquivo para uma Data URL (string base64)
        reader.readAsDataURL(resumeFile);

        // Quando a leitura for concluída com sucesso
        reader.onload = () => {
             fileContent = {
                name: resumeFile.name,
                type: resumeFile.type,
                content: reader.result as string, // O resultado é a string base64
            };
            // Chama a função global para adicionar a candidatura com os dados do arquivo
            context.addApplication(job.id, { fullName, email, phone, resumeFile: fileContent, resumeText });
            onSuccess(); // Sinaliza sucesso para o componente pai
        };

        // Em caso de erro na leitura do arquivo
        reader.onerror = () => {
            setError("Erro ao ler o arquivo.");
        }
    } else {
         // Se não houver arquivo, adiciona a candidatura apenas com os outros dados
         context.addApplication(job.id, { fullName, email, phone, resumeText });
         onSuccess();
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-bold">Formulário de Inscrição</h3>
      <div>
        <label className="block text-sm font-medium">Nome Completo</label>
        <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600" />
      </div>
      <div>
        <label className="block text-sm font-medium">E-mail</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600" />
      </div>
      <div>
        <label className="block text-sm font-medium">Telefone (Celular)</label>
        <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600" />
      </div>
      
      {/* Exibe o campo de upload se o empregador permitir */}
      {(job.resumePreference === 'file' || job.resumePreference === 'both') && (
        <div>
          <label className="block text-sm font-medium">Currículo (PDF, JPG)</label>
          <input type="file" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-600 dark:file:text-blue-300 dark:hover:file:bg-gray-500" />
        </div>
      )}
      
      {/* Exibe o campo de texto se o empregador permitir */}
      {(job.resumePreference === 'text' || job.resumePreference === 'both') && (
        <div>
          <label className="block text-sm font-medium">Ou Cole seu Currículo</label>
          <textarea value={resumeText} onChange={e => setResumeText(e.target.value)} rows={8} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"></textarea>
        </div>
      )}
      
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex justify-end gap-4 pt-4">
        <button type="button" onClick={onCancel} className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700">Cancelar</button>
        <button type="submit" className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">Enviar Candidatura</button>
      </div>
    </form>
  );
};

export default ApplicationForm;
