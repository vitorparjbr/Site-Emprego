
import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../App';
import { Job, JobType } from '../types';

// Componente InputField reutilizável
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

// Componente TextAreaField reutilizável
const TextAreaField: React.FC<{
  label: string, 
  value: string, 
  onChange: (val: string) => void, 
  required?: boolean, 
  placeholder?: string,
  rows?: number
}> = ({ label, value, onChange, required, placeholder, rows = 3 }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}{required && ' *'}</label>
        <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={required}
            placeholder={placeholder}
            rows={rows}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"
        />
    </div>
);

interface PostJobFormProps {
    jobToEdit?: Job | null;
    onFinish?: () => void;
}

const PostJobForm: React.FC<PostJobFormProps> = ({ jobToEdit, onFinish }) => {
    const isEditing = !!jobToEdit;

    // Estados do formulário
    const [jobType, setJobType] = useState<JobType>('emprego');
    const [title, setTitle] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [area, setArea] = useState('');
    const [location, setLocation] = useState('');
    const [duration, setDuration] = useState('');
    const [salary, setSalary] = useState('');
    const [benefits, setBenefits] = useState('');
    const [workHours, setWorkHours] = useState('');
    const [workSchedule, setWorkSchedule] = useState('');
    const [workScale, setWorkScale] = useState('');
    const [education, setEducation] = useState('');
    const [experience, setExperience] = useState('');
    const [profile, setProfile] = useState('');
    const [description, setDescription] = useState('');
    const [courseContact, setCourseContact] = useState('');
    const [resumePreference, setResumePreference] = useState<'file' | 'text' | 'both' | 'none'>('file');

    const context = useContext(AppContext);

    const resetForm = () => {
        setJobType('emprego');
        setTitle('');
        setCompanyName('');
        setArea('');
        setLocation('');
        setDuration('');
        setSalary('');
        setBenefits('');
        setWorkHours('');
        setWorkSchedule('');
        setWorkScale('');
        setEducation('');
        setExperience('');
        setProfile('');
        setDescription('');
        setCourseContact('');
        setResumePreference('file');
    };

    useEffect(() => {
        if (jobToEdit) {
            setJobType(jobToEdit.jobType || 'emprego');
            setTitle(jobToEdit.title);
            setCompanyName(jobToEdit.companyName || '');
            setArea(jobToEdit.area || '');
            setLocation(jobToEdit.location);
            setDuration(jobToEdit.duration || '');
            setSalary(jobToEdit.salary || '');
            setBenefits(jobToEdit.benefits || '');
            setWorkHours(jobToEdit.workHours || '');
            setWorkSchedule(jobToEdit.workSchedule || '');
            setWorkScale(jobToEdit.workScale || '');
            setEducation(jobToEdit.requirements.education || '');
            setExperience(jobToEdit.requirements.experience || '');
            setProfile(jobToEdit.requirements.profile || '');
            setDescription(jobToEdit.description || '');
            setCourseContact(jobToEdit.courseContact || '');
            setResumePreference(jobToEdit.resumePreference || 'file');
        } else {
            resetForm();
        }
    }, [jobToEdit]);

    // Atualiza preferência de currículo quando muda o tipo de vaga
    useEffect(() => {
        if (jobType === 'curso' || jobType === 'jovem-aprendiz') {
            setResumePreference('none');
        } else if (resumePreference === 'none') {
            setResumePreference('file');
        }
    }, [jobType]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!context) return;
        
        const jobData = {
            jobType,
            title,
            companyName: companyName || undefined,
            area: area || undefined,
            location,
            duration: duration || undefined,
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
            description: description || undefined,
            courseContact: courseContact || undefined,
            resumePreference
        };
        
        if (isEditing) {
            context.updateJob(jobToEdit.id, jobData);
        } else {
            context.addJob(jobData);
        }
        
        resetForm();
        if (onFinish) {
            onFinish();
        }
    };

    // Labels dinâmicos baseados no tipo de vaga
    const getCompanyLabel = () => {
        switch (jobType) {
            case 'curso':
                return 'Nome da Empresa/Instituição';
            default:
                return 'Nome da Empresa';
        }
    };

    const getTitleLabel = () => {
        switch (jobType) {
            case 'curso':
                return 'Nome do Curso';
            default:
                return 'Título da Vaga';
        }
    };

    const getTitlePlaceholder = () => {
        switch (jobType) {
            case 'emprego':
                return 'Ex: Desenvolvedor React Sênior';
            case 'estagio':
                return 'Ex: Estágio em Marketing Digital';
            case 'jovem-aprendiz':
                return 'Ex: Jovem Aprendiz Administrativo';
            case 'curso':
                return 'Ex: Curso de Informática Básica';
        }
    };

    const getDurationPlaceholder = () => {
        switch (jobType) {
            case 'curso':
                return 'Ex: 01/02/2025 a 30/06/2025';
            default:
                return 'Ex: 6 meses, 1 ano, 2 anos';
        }
    };

    const getRequirementsPlaceholder = () => {
        switch (jobType) {
            case 'estagio':
                return 'Ex: Cursando ou ter concluído curso superior/técnico em Administração, Marketing ou áreas afins';
            case 'jovem-aprendiz':
                return 'Ex: Idade entre 14 e 24 anos, cursando ou ter concluído ensino médio';
            case 'curso':
                return 'Ex: Idade mínima 16 anos, ensino fundamental completo';
            default:
                return 'Ex: Ensino superior completo';
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Seletor de Tipo de Vaga */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipo de Vaga *</label>
                <select 
                    value={jobType} 
                    onChange={e => setJobType(e.target.value as JobType)} 
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"
                >
                    <option value="emprego">Emprego</option>
                    <option value="estagio">Estágio</option>
                    <option value="jovem-aprendiz">Jovem Aprendiz</option>
                    <option value="curso">Curso</option>
                </select>
            </div>

            {/* Campos comuns a todos os tipos */}
            <InputField 
                label={getTitleLabel()} 
                value={title} 
                onChange={setTitle} 
                required 
                placeholder={getTitlePlaceholder()}
            />
            
            <InputField 
                label={getCompanyLabel()} 
                value={companyName} 
                onChange={setCompanyName} 
                required={jobType !== 'emprego'}
                placeholder={jobType === 'emprego' ? "Será 'Confidencial' se deixado em branco" : "Ex: Empresa XYZ"}
            />

            {/* Área/Setor - para Emprego, Estágio e Jovem Aprendiz */}
            {jobType !== 'curso' && (
                <InputField 
                    label="Área/Setor" 
                    value={area} 
                    onChange={setArea} 
                    placeholder="Ex: Tecnologia, Recursos Humanos, Financeiro"
                />
            )}

            <InputField 
                label="Região/Localidade" 
                value={location} 
                onChange={setLocation} 
                required 
                placeholder="Ex: São Paulo, SP"
            />

            {/* Duração - para Estágio, Jovem Aprendiz e Curso */}
            {(jobType === 'estagio' || jobType === 'jovem-aprendiz' || jobType === 'curso') && (
                <InputField 
                    label={jobType === 'curso' ? 'Duração (Início e Fim)' : 'Tempo/Duração do Contrato'} 
                    value={duration} 
                    onChange={setDuration} 
                    required
                    placeholder={getDurationPlaceholder()}
                />
            )}

            {/* Campos de trabalho - não aparecem para Curso */}
            {jobType !== 'curso' && (
                <>
                    <InputField 
                        label="Salário" 
                        value={salary} 
                        onChange={setSalary} 
                        required
                        placeholder="Ex: R$ 5.000,00 ou A combinar"
                    />
                    <InputField 
                        label="Benefícios" 
                        value={benefits} 
                        onChange={setBenefits} 
                        required
                        placeholder="Ex: VT, VR, Plano de Saúde, Vale Alimentação"
                    />
                    <InputField 
                        label="Carga Horária" 
                        value={workHours} 
                        onChange={setWorkHours} 
                        required
                        placeholder={jobType === 'jovem-aprendiz' ? 'Ex: 20 horas/semana' : 'Ex: 40 horas/semana'}
                    />
                    <InputField 
                        label="Jornada" 
                        value={workSchedule} 
                        onChange={setWorkSchedule} 
                        required
                        placeholder="Ex: Segunda a Sexta, 09h-18h"
                    />
                    <InputField 
                        label="Escala de Trabalho" 
                        value={workScale} 
                        onChange={setWorkScale} 
                        required
                        placeholder="Ex: Presencial, Híbrido, Remoto"
                    />
                </>
            )}
            
            {/* Seção de Requisitos */}
            <h3 className="text-lg font-semibold pt-2 border-t dark:border-gray-600">Requisitos</h3>
            
            {/* Para Emprego - campos de requisitos detalhados */}
            {jobType === 'emprego' && (
                <>
                    <InputField 
                        label="Escolaridade" 
                        value={education} 
                        onChange={setEducation}
                        placeholder="Ex: Ensino superior completo em TI"
                    />
                    <InputField 
                        label="Experiência" 
                        value={experience} 
                        onChange={setExperience}
                        placeholder="Ex: 2 anos de experiência na área"
                    />
                    <TextAreaField 
                        label="Perfil Profissional do Candidato" 
                        value={profile} 
                        onChange={setProfile}
                        placeholder="Ex: Proativo, trabalho em equipe, boa comunicação"
                    />
                </>
            )}

            {/* Para Estágio, Jovem Aprendiz e Curso - campo único de requisitos sem label */}
            {(jobType === 'estagio' || jobType === 'jovem-aprendiz' || jobType === 'curso') && (
                <TextAreaField 
                    label="" 
                    value={education} 
                    onChange={setEducation}
                    required
                    placeholder={getRequirementsPlaceholder()}
                    rows={3}
                />
            )}

            {/* Descrição da Vaga - apenas para Emprego */}
            {jobType === 'emprego' && (
                <TextAreaField 
                    label="Descrição da Vaga" 
                    value={description} 
                    onChange={setDescription}
                    placeholder="Descreva sobre a empresa (localização, atividade, tempo de existência), o que o candidato irá fazer, responsabilidades do cargo, etc."
                    rows={4}
                />
            )}

            {/* Contato do Curso - apenas para Curso */}
            {jobType === 'curso' && (
                <TextAreaField 
                    label="Contato do Curso" 
                    value={courseContact} 
                    onChange={setCourseContact}
                    required
                    placeholder="Informe link de inscrição, telefone, e-mail ou outras formas de contato"
                    rows={2}
                />
            )}

            {/* Preferência de Currículo - não aparece para Curso e Jovem Aprendiz */}
            {jobType !== 'curso' && jobType !== 'jovem-aprendiz' && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Preferência de Currículo</label>
                    <select 
                        value={resumePreference} 
                        onChange={e => setResumePreference(e.target.value as any)} 
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"
                    >
                        <option value="file">Apenas Arquivo (PDF, JPG)</option>
                        <option value="text">Apenas Texto</option>
                        <option value="both">Ambos (Arquivo ou Texto)</option>
                    </select>
                </div>
            )}

            <div className="flex items-center gap-4 pt-2">
                <button 
                    type="submit" 
                    className={`w-full py-2 px-4 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${isEditing ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'}`}
                >
                    {isEditing ? 'Salvar Alterações' : 'Publicar Vaga'}
                </button>
                {isEditing && (
                    <button 
                        type="button" 
                        onClick={onFinish} 
                        className="w-full py-2 px-4 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-md"
                    >
                        Cancelar
                    </button>
                )}
            </div>
        </form>
    );
};

export default PostJobForm;
