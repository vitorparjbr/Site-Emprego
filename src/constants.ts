
import { Job, Employer } from './types';

export const MOCK_JOBS: Job[] = [
  {
    id: 'job-1',
    employerId: 'emp-1',
    jobType: 'emprego',
    title: 'Auxiliar Administrativo',
    companyName: 'Tech Solutions Ltda.',
    location: 'São Paulo, SP',
    salary: 'R$ 2.500,00',
    benefits: 'Vale Transporte, Vale Refeição, Plano de Saúde',
    workHours: '40 horas/semana',
    workSchedule: 'Segunda a Sexta, 09h-18h',
    workScale: 'Presencial',
    requirements: {
      education: 'Ensino Médio Completo',
      experience: 'Mínimo de 1 ano na área',
      profile: 'Organizado, proativo e com boa comunicação.'
    },
    postedDate: '2024-07-20',
    applications: [],
    resumePreference: 'file'
  },
  {
    id: 'job-2',
    employerId: 'emp-2',
    jobType: 'emprego',
    title: 'Mecânico de Manutenção',
    companyName: 'Indústria Metalúrgica Brasil',
    location: 'Rio de Janeiro, RJ',
    salary: 'R$ 3.800,00',
    benefits: 'Vale Transporte, Vale Alimentação, Periculosidade',
    workHours: '44 horas/semana',
    workSchedule: 'Turnos rotativos',
    workScale: '6x1',
    requirements: {
      education: 'Curso Técnico em Mecânica',
      experience: '3 anos de experiência com maquinário pesado',
      profile: 'Atenção aos detalhes, capacidade de trabalhar em equipe.'
    },
    postedDate: '2024-07-19',
    applications: [],
    resumePreference: 'both'
  },
  {
    id: 'job-3',
    employerId: 'emp-1',
    jobType: 'estagio',
    title: 'Estágio em Marketing Digital',
    location: 'Belo Horizonte, MG',
    salary: 'R$ 1.200,00 (Bolsa auxílio)',
    benefits: 'Vale Transporte',
    workHours: '30 horas/semana',
    workSchedule: 'Flexível',
    workScale: 'Híbrido',
    requirements: {
      education: 'Cursando Superior em Marketing, Publicidade ou áreas correlatas',
      profile: 'Criativo, com conhecimento em redes sociais e vontade de aprender.'
    },
    postedDate: '2024-07-18',
    applications: [],
    resumePreference: 'text'
  },
  {
    id: 'job-4',
    employerId: 'emp-2',
    jobType: 'jovem-aprendiz',
    title: 'Jovem Aprendiz - Logística',
    companyName: 'Log Express',
    location: 'Curitiba, PR',
    salary: 'Salário Mínimo-hora',
    benefits: 'Vale Transporte, Curso de Capacitação',
    workHours: '20 horas/semana',
    workSchedule: 'Segunda a Sexta, 13h-17h',
    workScale: 'Presencial',
    requirements: {
      education: 'Ensino Médio Cursando ou Completo',
      profile: 'Vontade de aprender e se desenvolver na área de logística.'
    },
    postedDate: '2024-07-21',
    applications: [],
    resumePreference: 'file'
  }
];

export const MOCK_EMPLOYERS: Employer[] = [
    {
        id: 'emp-1',
        companyName: 'Tech Solutions Ltda.',
        email: 'contato@techsolutions.com'
        // Senha gerenciada pelo Firebase Authentication
    },
    {
        id: 'emp-2',
        companyName: 'Indústria Metalúrgica Brasil',
        email: 'rh@industriametal.com.br'
        // Senha gerenciada pelo Firebase Authentication
    }
];

export const MOCK_ABOUT_US = `
<h2 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Quem Somos</h2>
<p class="mb-4 text-gray-700 dark:text-gray-300">A <strong>Vagas Para Todos</strong> nasceu com a missão de democratizar o acesso às oportunidades no Brasil. Acreditamos que conectar o talento certo à oportunidade certa pode transformar vidas e impulsionar negócios. Nossa plataforma foi desenhada para ser intuitiva, eficiente e acessível tanto para quem busca o primeiro emprego quanto para profissionais experientes e empresas que procuram os melhores talentos.</p>
<h3 class="text-xl font-semibold mb-2">Nossos Serviços</h3>
<ul class="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
  <li><strong>Para Candidatos:</strong> Oferecemos uma vasta gama de vagas em todo o Brasil (Emprego, Estágio e Jovem Aprendiz), com filtros de busca avançados e um processo de candidatura direto. Tudo de forma 100% gratuita.</li>
  <li><strong>Para Empregadores:</strong> Disponibilizamos uma plataforma robusta para publicação e gerenciamento de vagas, com um painel exclusivo para acompanhar candidaturas e visualizar currículos dos talentos mais promissores do mercado.</li>
</ul>
<p class="mt-4 text-gray-700 dark:text-gray-300">Nosso compromisso é com a transparência, a inovação e o sucesso de nossos usuários. Junte-se a nós e encontre hoje mesmo o seu próximo passo profissional ou o candidato ideal para sua equipe!</p>
`;
