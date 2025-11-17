
import { Job, Employer, NewsArticle } from './types';

export const MOCK_JOBS: Job[] = [
  {
    id: 'job-1',
    employerId: 'emp-1',
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
        email: 'contato@techsolutions.com',
        password: 'password123'
    },
    {
        id: 'emp-2',
        companyName: 'Indústria Metalúrgica Brasil',
        email: 'rh@industriametal.com.br',
        password: 'password123'
    }
];

// MOCK_NEWS foi reestruturado para ser um array de objetos, permitindo links e melhor manipulação dos dados.
export const MOCK_NEWS: NewsArticle[] = [
  {
    title: "Cursos Gratuitos de Tecnologia Abrem Inscrições",
    description: "A plataforma 'Futuro Digital' anunciou a abertura de 5.000 vagas para cursos online gratuitos nas áreas de programação, análise de dados e inteligência artificial. As inscrições vão até o final do mês e são abertas para todo o Brasil.",
    link: "https://example.com/cursos-tecnologia",
    source: "Futuro Digital News"
  },
  {
    title: "Concurso Nacional Anuncia Edital com Salários de até R$ 15 mil",
    description: "Foi publicado o edital para o concurso do Tribunal de Contas Nacional, com vagas para níveis médio e superior em diversas áreas. As provas estão previstas para novembro e as inscrições começam na próxima semana.",
    link: "https://example.com/concurso-nacional",
    source: "Diário Oficial"
  },
  {
    title: "Programa de Bolsas de Estudo para Universidades no Exterior",
    description: "O programa 'Mundo afora' está com inscrições abertas para bolsas de estudo integrais para cursos de graduação e pós-graduação em universidades na Europa e América do Norte. O prazo final para candidatura é 30 de setembro.",
    link: "https://example.com/bolsas-exterior",
    source: "Educação Internacional"
  },
  {
    title: "Vestibulares de Inverno: Fique Atento aos Prazos",
    description: "As principais universidades estaduais e federais divulgaram os calendários de seus vestibulares de inverno. Candidatos devem ficar atentos aos prazos de isenção de taxa e inscrição para não perderem a oportunidade.",
    link: "https://example.com/vestibulares-inverno",
    source: "Guia do Estudante"
  }
];


export const MOCK_ABOUT_US = `
<h2 class="text-2xl font-bold mb-4 text-blue-500 dark:text-blue-400">Quem Somos</h2>
<p class="mb-4 text-gray-700 dark:text-gray-300">A Job Finder Pro nasceu com a missão de simplificar e humanizar o processo de recrutamento e seleção. Acreditamos que conectar o talento certo à oportunidade certa pode transformar vidas e impulsionar negócios. Nossa plataforma foi desenhada para ser intuitiva, eficiente e acessível tanto para candidatos em busca de novos desafios quanto para empresas que procuram os melhores profissionais.</p>
<h3 class="text-xl font-semibold mb-2">Nossos Serviços</h3>
<ul class="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
  <li><strong>Para Candidatos:</strong> Oferecemos uma vasta gama de vagas em todo o Brasil, com filtros de busca avançados, alertas de vagas personalizadas e um processo de candidatura simplificado. Tudo de forma 100% gratuita.</li>
  <li><strong>Para Empregadores:</strong> Disponibilizamos uma plataforma robusta para publicação e gerenciamento de vagas, com um painel de controle exclusivo para acompanhar candidaturas, visualizar currículos e entrar em contato com os talentos mais promissores do mercado.</li>
</ul>
<p class="mt-4 text-gray-700 dark:text-gray-300">Nosso compromisso é com a transparência, a inovação e o sucesso de nossos usuários. Junte-se a nós e encontre hoje mesmo o seu próximo passo profissional ou o candidato ideal para sua equipe!</p>
`;
