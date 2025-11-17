
import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../App';
import { Job } from '../types';

// O componente InputField foi movido para fora do PostJobForm para evitar perda de foco.
const InputField: React.FC<{
  label: string, 
  value: string, 
  onChange: (val: string) => void, 
  required?: boolean, 
  placeholder?: string
}> = ({ label, value, onChange, required, placeholder }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}{required && ' *'}</label>
        <input 
            type="text" 
            value={value} 
            onChange={(e) => onChange(e.target.value)} 
            required={required}
            placeholder={placeholder}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"
        />
    </div>
);

// NOVAS PROPS: O formulário agora pode receber uma vaga para editar e uma função para ser chamada ao finalizar.
interface PostJobFormProps {
    jobToEdit?: Job | null;
    onFinish?: () => void;
}

const PostJobForm: React.FC<PostJobFormProps> = ({ jobToEdit, onFinish }) => {
    // Determina se o formulário está em modo de edição.
    const isEditing = !!jobToEdit;

    // Estados para cada campo do formulário de nova vaga
    const [title, setTitle] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [location, setLocation] = useState('');
    const [salary, setSalary] = useState('');
    const [benefits, setBenefits] = useState('');
    const [workHours, setWorkHours] = useState('');
    const [workSchedule, setWorkSchedule] = useState('');
    const [workScale, setWorkScale] = useState('');
    const [education, setEducation] = useState('');
    const [experience, setExperience] = useState('');
    const [profile, setProfile] = useState('');
    const [resumePreference, setResumePreference] = useState<'file' | 'text' | 'both'>('file');

    const context = useContext(AppContext);

    // Função para limpar (resetar) todos os campos do formulário.
    const resetForm = () => {
        setTitle('');
        setCompanyName('');
        setLocation('');
        setSalary('');
        setBenefits('');
        setWorkHours('');
        setWorkSchedule('');
        setWorkScale('');
        setEducation('');
        setExperience('');
        setProfile('');
        setResumePreference('file');
    };

    // useEffect é usado para preencher o formulário com os dados da vaga
    // quando o modo de edição é ativado (ou seja, jobToEdit muda).
    useEffect(() => {
        if (jobToEdit) {
            setTitle(jobToEdit.title);
            setCompanyName(jobToEdit.companyName || '');
            setLocation(jobToEdit.location);
            setSalary(jobToEdit.salary || '');
            setBenefits(jobToEdit.benefits || '');
            setWorkHours(jobToEdit.workHours || '');
            setWorkSchedule(jobToEdit.workSchedule || '');
            setWorkScale(jobToEdit.workScale || '');
            setEducation(jobToEdit.requirements.education || '');
            setExperience(jobToEdit.requirements.experience || '');
            setProfile(jobToEdit.requirements.profile || '');
            setResumePreference(jobToEdit.resumePreference);
        } else {
            // Se sairmos do modo de edição, limpa o formulário.
            resetForm();
        }
    }, [jobToEdit]);


    // Função para lidar com o envio do formulário
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!context) return;
        
        const jobData = {
            title,
            companyName: companyName || undefined,
            location,
            salary: salary || undefined,
            benefits: benefits || undefined,
            workHours: workHours || undefined,
            workSchedule: workSchedule || undefined,
            workScale: workScale || undefined,
            requirements: {
                education: education || undefined,
                experience: experience || undefined,
                profile: profile || undefined,
            },
            resumePreference
        };
        
        // Se estiver em modo de edição, chama a função de atualização.
        if (isEditing) {
            context.updateJob(jobToEdit.id, jobData);
        } else {
            // Caso contrário, chama a função para adicionar uma nova vaga.
            context.addJob(jobData);
        }
        
        resetForm(); // Limpa o formulário após a submissão.
        if (onFinish) {
            onFinish(); // Chama a função onFinish para notificar o componente pai (ex: fechar o modo de edição).
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <InputField label="Título da Vaga" value={title} onChange={setTitle} required placeholder="Ex: Desenvolvedor React Sênior"/>
            <InputField label="Nome da Empresa (Opcional)" value={companyName} onChange={setCompanyName} placeholder="Será 'Confidencial' se deixado em branco"/>
            <InputField label="Região/Localidade" value={location} onChange={setLocation} required placeholder="Ex: São Paulo, SP"/>
            <InputField label="Salário" value={salary} onChange={setSalary} placeholder="Ex: R$ 5.000,00 ou A combinar"/>
            <InputField label="Benefícios" value={benefits} onChange={setBenefits} placeholder="Ex: VT, VR, Plano de Saúde"/>
            <InputField label="Carga Horária" value={workHours} onChange={setWorkHours} placeholder="Ex: 40 horas/semana"/>
            <InputField label="Jornada" value={workSchedule} onChange={setWorkSchedule} placeholder="Ex: Segunda a Sexta, 09h-18h"/>
            <InputField label="Escala de Trabalho" value={workScale} onChange={setWorkScale} placeholder="Ex: Presencial, Híbrido, Remoto"/>
            
            <h3 className="text-lg font-semibold pt-2 border-t dark:border-gray-600">Requisitos</h3>
            <InputField label="Escolaridade" value={education} onChange={setEducation} />
            <InputField label="Experiência" value={experience} onChange={setExperience} />
             <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Perfil Profissional do Candidato</label>
                <textarea
                    value={profile}
                    onChange={(e) => setProfile(e.target.value)}
                    rows={3}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"
                ></textarea>
            </div>
            
            <div>
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Preferência de Currículo</label>
                 <select value={resumePreference} onChange={e => setResumePreference(e.target.value as any)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600">
                    <option value="file">Apenas Arquivo (PDF, JPG)</option>
                    <option value="text">Apenas Texto</option>
                    <option value="both">Ambos (Arquivo ou Texto)</option>
                 </select>
            </div>

            <div className="flex items-center gap-4 pt-2">
                 {/* O botão principal muda de texto e cor dependendo do modo */}
                <button type="submit" className={`w-full py-2 px-4 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${isEditing ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'}`}>
                    {isEditing ? 'Salvar Alterações' : 'Publicar Vaga'}
                </button>
                {/* O botão de cancelar só aparece no modo de edição */}
                {isEditing && (
                    <button type="button" onClick={onFinish} className="w-full py-2 px-4 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-md">
                        Cancelar
                    </button>
                )}
            </div>
        </form>
    );
};

export default PostJobForm;
