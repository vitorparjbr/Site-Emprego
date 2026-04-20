// Script temporário para inserir vagas fictícias no Firestore
// Execute com: node scripts/seed_jobs.mjs

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp, setDoc, doc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBqlUA3O-hVbBUHwrr_7-QYCPYrqYeYaLQ',
  authDomain: 'site-de-empregos-3e981.firebaseapp.com',
  projectId: 'site-de-empregos-3e981',
  storageBucket: 'site-de-empregos-3e981.firebasestorage.app',
  messagingSenderId: '500171034656',
  appId: '1:500171034656:web:76a7cf36c1922719dcac45',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const SEED_EMAIL = 'demo.vagas@jobfinderpro.seed';
const SEED_PASSWORD = 'SeedDemo@2026!';

const jobs = [
  {
    jobType: 'emprego',
    title: 'Desenvolvedor(a) Full Stack Sênior',
    companyName: 'TechNova Soluções',
    area: 'Tecnologia da Informação',
    location: 'São Paulo, SP',
    salary: 'R$ 12.000 – R$ 16.000',
    benefits: 'Vale Refeição, Plano de Saúde Bradesco, Plano Odontológico, PLR, Home Office 3x/semana, Gympass',
    workHours: '40h semanais',
    workSchedule: 'Segunda a Sexta, 09h–18h',
    workScale: 'Presencial / Híbrido',
    requirements: {
      education: 'Graduação em Ciência da Computação, Sistemas de Informação ou área correlata',
      experience: 'Mínimo 5 anos com React, Node.js e bancos de dados relacionais e não relacionais',
      profile: 'Proativo, boa comunicação, capacidade de liderança técnica e trabalho em equipe',
    },
    description: 'Desenvolvimento e manutenção de aplicações web escaláveis. Participação em decisões de arquitetura de software. Code review e mentoria de desenvolvedores júnior. Integração com APIs REST e GraphQL. Contribuição com melhorias de desempenho e segurança.',
    aboutCompany: 'A TechNova Soluções é uma empresa de tecnologia fundada em 2015, especializada em desenvolvimento de software sob medida para médias e grandes empresas. Atendemos clientes em todo o Brasil e na América Latina, com foco em inovação e excelência técnica.',
    resumePreference: 'both',
    postedDate: '2026-04-18',
    applications: [],
  },
  {
    jobType: 'emprego',
    title: 'Analista de Marketing Digital',
    companyName: 'Grupo Conecta Varejo',
    area: 'Marketing e Publicidade',
    location: 'Rio de Janeiro, RJ',
    salary: 'R$ 4.500 – R$ 6.000',
    benefits: 'Vale Transporte, Vale Refeição R$ 45/dia, Plano de Saúde SulAmérica, Participação nos Lucros',
    workHours: '44h semanais',
    workSchedule: 'Segunda a Sexta, 08h–17h48',
    workScale: 'Presencial',
    requirements: {
      education: 'Graduação em Marketing, Comunicação, Publicidade ou Administração',
      experience: 'Experiência com Google Ads, Meta Ads, SEO/SEM e análise de métricas (Google Analytics, Data Studio)',
      profile: 'Criativo(a), analítico(a), com boa escrita e interesse por tendências digitais',
    },
    description: 'Planejamento e execução de campanhas de marketing digital. Gestão de redes sociais e criação de conteúdo. Análise de KPIs e elaboração de relatórios mensais. Gestão de verba de mídia paga (Google Ads, Meta Ads). A/B testing e otimização de landing pages.',
    aboutCompany: 'O Grupo Conecta Varejo atua no segmento de varejo omnichannel há 20 anos, com mais de 80 lojas físicas e e-commerce consolidado. Nosso foco é conectar marcas ao consumidor final de forma inteligente e personalizada.',
    resumePreference: 'file',
    postedDate: '2026-04-17',
    applications: [],
  },
  {
    jobType: 'emprego',
    title: 'Enfermeira(o) Assistencial – UTI Adulto',
    companyName: 'Hospital São Lucas Premium',
    area: 'Saúde e Bem-Estar',
    location: 'Curitiba, PR',
    salary: 'R$ 5.800 – R$ 7.200',
    benefits: 'Vale Alimentação, Plano de Saúde e Odontológico extensivo a dependentes, Seguro de Vida, Refeitório no local, Estacionamento gratuito',
    workHours: '36h semanais',
    workSchedule: 'Escala 12x36',
    workScale: 'Presencial',
    requirements: {
      education: 'Graduação em Enfermagem com COREN ativo',
      experience: 'Mínimo 2 anos em UTI Adulto. Desejável especialização em terapia intensiva',
      profile: 'Atenção a detalhes, resiliência emocional, trabalho em equipe multidisciplinar, agilidade em situações de emergência',
    },
    description: 'Assistência de enfermagem a pacientes em estado crítico internados na UTI Adulto. Administração de medicamentos e controle de infusões. Monitoramento contínuo de sinais vitais e parâmetros hemodinâmicos. Comunicação com equipe médica e familiares. Registros em prontuário eletrônico (sistema Tasy).',
    aboutCompany: 'O Hospital São Lucas Premium é referência em alta complexidade na região Sul do Brasil, com mais de 30 anos de atuação e certificação de excelência hospitalar pela ONA (nível 3). Conta com 420 leitos, incluindo UTI cardiológica, neurológica e pediátrica.',
    resumePreference: 'both',
    postedDate: '2026-04-16',
    applications: [],
  },
  {
    jobType: 'estagio',
    title: 'Estagiário(a) de Recursos Humanos',
    companyName: 'Construtora Alvorada',
    area: 'Recursos Humanos',
    location: 'Belo Horizonte, MG',
    duration: '12 meses (com possibilidade de efetivação)',
    salary: 'R$ 1.400',
    benefits: 'Vale Transporte, Auxílio Refeição R$ 25/dia, Plano de Saúde, Bolsa Auxílio',
    workHours: '30h semanais',
    workSchedule: 'Segunda a Sexta, 08h–14h',
    workScale: 'Presencial',
    requirements: {
      education: 'Cursando Psicologia, Administração, Gestão de RH ou áreas afins – a partir do 3º semestre',
      experience: 'Não é necessária experiência prévia. Conhecimentos básicos em Excel são diferenciais',
      profile: 'Comunicativo(a), organizado(a), proativo(a), interesse em desenvolvimento humano e gestão de pessoas',
    },
    description: 'Apoio aos processos de recrutamento e seleção (triagem de currículos, agendamento de entrevistas). Auxílio no onboarding de novos colaboradores. Suporte na organização de treinamentos e eventos internos. Atualização de cadastros e controle de documentos. Acompanhamento de indicadores de RH.',
    aboutCompany: 'A Construtora Alvorada tem 15 anos de atuação no mercado imobiliário de Minas Gerais, com mais de 3.000 unidades entregues em residenciais e comerciais. Acreditamos que pessoas são nosso ativo mais importante.',
    resumePreference: 'both',
    postedDate: '2026-04-15',
    applications: [],
  },
  {
    jobType: 'emprego',
    title: 'Motorista de Caminhão – Rota Regional',
    companyName: 'TransBrasil Logística',
    area: 'Logística e Transporte',
    location: 'Campinas, SP',
    salary: 'R$ 3.800 – R$ 4.800',
    benefits: 'Vale Alimentação R$ 50/dia viagem, Diárias, Plano de Saúde, Seguro de Vida, Adiantamento quinzenal',
    workHours: 'Conforme rota (limite legal)',
    workSchedule: 'Segunda a Sábado, escala por demanda',
    workScale: 'Externo / Campo',
    requirements: {
      education: 'Ensino Médio completo',
      experience: 'Mínimo 3 anos como motorista de caminhão (truck/carreta). CNH categoria E ativa e dentro do prazo de validade',
      profile: 'Responsável, pontual, boa conduta no trânsito, conhecimento das rotas SP/MG/RJ/PR',
    },
    description: 'Transporte de cargas fracionadas e lotação em rotas regionais. Entrega e coleta em clientes conforme programação. Verificação e manutenção preventiva do veículo. Preenchimento de relatórios de viagem e comprovantes de entrega. Cumprimento das normas de segurança no trânsito e da legislação de transporte.',
    aboutCompany: 'A TransBrasil Logística opera há 25 anos no transporte rodoviário de cargas, com frota própria de 200 veículos e cobertura em 15 estados brasileiros. Nossa missão é garantir entregas seguras, pontuais e eficientes.',
    resumePreference: 'text',
    postedDate: '2026-04-14',
    applications: [],
  },
  {
    jobType: 'emprego',
    title: 'Gerente de Loja – Rede de Farmácias',
    companyName: 'FarmaVida Rede de Farmácias',
    area: 'Varejo e Comércio',
    location: 'Salvador, BA',
    salary: 'R$ 5.000 – R$ 6.500',
    benefits: 'Comissão sobre resultados da loja, Plano de Saúde, Vale Alimentação, Desconto em medicamentos, Cesta básica',
    workHours: '44h semanais',
    workSchedule: 'Escala 6x1, inclusive fins de semana',
    workScale: 'Presencial',
    requirements: {
      education: 'Graduação em Farmácia, Administração, Gestão Comercial ou área afins. CRF ativo é diferencial',
      experience: 'Mínimo 3 anos em gestão de equipes no varejo, preferencialmente em farmácias ou drogarias',
      profile: 'Liderança, foco em resultados, habilidade interpessoal, capacidade de resolução de conflitos e gestão de estoque',
    },
    description: 'Gestão completa da unidade: equipe, estoque, caixa e atendimento ao cliente. Acompanhamento de metas de vendas e indicadores de performance. Treinamento e desenvolvimento da equipe. Relacionamento com fornecedores e gestão de pedidos. Garantia do cumprimento de normas sanitárias e procedimentos da rede.',
    aboutCompany: 'A FarmaVida é uma das maiores redes de farmácias da Bahia, com mais de 60 unidades distribuídas no estado. Com foco no atendimento humanizado e na saúde da população, nossa rede cresce consistentemente há 18 anos.',
    resumePreference: 'both',
    postedDate: '2026-04-13',
    applications: [],
  },
  {
    jobType: 'jovem-aprendiz',
    title: 'Jovem Aprendiz – Área Administrativa',
    companyName: 'Banco Meridional S.A.',
    area: 'Financeiro e Bancário',
    location: 'Porto Alegre, RS',
    duration: '24 meses',
    salary: 'R$ 954,00 (salário mínimo proporcional)',
    benefits: 'Vale Transporte, Auxílio Alimentação, Plano de Saúde, Bolsa de Estudos parcial, Certificado de conclusão',
    workHours: '20h semanais',
    workSchedule: 'Segunda a Sexta, 08h–12h',
    workScale: 'Presencial',
    requirements: {
      education: 'Cursando Ensino Médio ou recém-formado (até 24 anos)',
      experience: 'Nenhuma experiência necessária. Boa digitação e interesse na área bancária são diferenciais',
      profile: 'Responsável, pontual, curioso(a), vontade de aprender e desenvolver habilidades profissionais',
    },
    description: 'Apoio nas atividades administrativas da agência. Organização de documentos e arquivos físicos e digitais. Atendimento interno e encaminhamento de demandas. Participação em cursos de formação profissional do programa de aprendizagem. Suporte às equipes de atendimento e backoffice.',
    aboutCompany: 'O Banco Meridional S.A. é uma instituição financeira com 40 anos de mercado, atuando em todo o Sul do Brasil com foco em crédito para pessoas físicas e jurídicas. Valorizamos o desenvolvimento de jovens talentos por meio do nosso programa de aprendizagem.',
    resumePreference: 'none',
    postedDate: '2026-04-12',
    applications: [],
  },
  {
    jobType: 'emprego',
    title: 'Designer de UX/UI',
    companyName: 'Agência Pixel & Co.',
    area: 'Design e Criação',
    location: 'Florianópolis, SC',
    salary: 'R$ 6.000 – R$ 8.000',
    benefits: 'Vale Refeição, Plano de Saúde Amil, Gympass, Home Office 2x/semana, Budget de cursos R$ 2.400/ano',
    workHours: '40h semanais',
    workSchedule: 'Segunda a Sexta, horário flexível',
    workScale: 'Híbrido',
    requirements: {
      education: 'Graduação em Design Gráfico, Design de Produto, Sistemas de Informação ou área correlata',
      experience: 'Portfólio com projetos de UX/UI. Domínio de Figma, conhecimento em prototipagem, pesquisa com usuários e Design System',
      profile: 'Criativo(a), empático(a), pensamento analítico, boa comunicação para apresentar ideias e justificar decisões de design',
    },
    description: 'Criação de wireframes, protótipos e interfaces de alta fidelidade. Condução de pesquisas com usuários (entrevistas, testes de usabilidade). Colaboração próxima com desenvolvedores front-end. Manutenção e evolução do Design System da empresa. Análise de métricas de usabilidade e proposta de melhorias.',
    aboutCompany: 'A Agência Pixel & Co. é uma boutique criativa especializada em branding, design digital e experiências de usuário. Fundada em 2018, já entregamos projetos para mais de 150 clientes em 7 países, sempre com foco em design centrado no ser humano.',
    resumePreference: 'file',
    postedDate: '2026-04-11',
    applications: [],
  },
  {
    jobType: 'emprego',
    title: 'Contador(a) Sênior – Fiscal e Tributário',
    companyName: 'Metálica Industrias do Norte',
    area: 'Contabilidade e Finanças',
    location: 'Manaus, AM',
    salary: 'R$ 7.500 – R$ 9.500',
    benefits: 'Vale Alimentação R$ 800/mês, Plano de Saúde Unimed, Odontológico, Seguro de Vida, PLR anual, Fretado',
    workHours: '44h semanais',
    workSchedule: 'Segunda a Sexta, 07h30–17h18 / Sábado 07h30–11h30',
    workScale: 'Presencial',
    requirements: {
      education: 'Graduação em Ciências Contábeis. CRC ativo obrigatório. Pós-graduação em Direito Tributário é diferencial',
      experience: 'Mínimo 5 anos em contabilidade tributária. Experiência com SPED Fiscal, EFD Contribuições, ICMS e IPI para indústria da Zona Franca de Manaus',
      profile: 'Analítico(a), organizado(a), ética profissional, atualização constante com legislação tributária e capacidade de trabalhar sob pressão',
    },
    description: 'Apuração e revisão de tributos federais, estaduais e municipais. Entrega das obrigações acessórias (SPED Fiscal, EFD, DCTF, ECD). Análise de incentivos fiscais da ZFM e planejamento tributário. Atendimento a fiscalizações e elaboração de defesas administrativas. Orientação às demais áreas sobre impactos tributários.',
    aboutCompany: 'A Metálica Indústrias do Norte é uma das maiores fabricantes de componentes metálicos da Zona Franca de Manaus, com 35 anos de mercado e exportações para 12 países. Operamos com certificações ISO 9001 e ISO 14001.',
    resumePreference: 'both',
    postedDate: '2026-04-10',
    applications: [],
  },
  {
    jobType: 'emprego',
    title: 'Professor(a) de Educação Física',
    companyName: 'Colégio Estadual Dom Pedro II',
    area: 'Educação',
    location: 'Goiânia, GO',
    salary: 'R$ 3.200 – R$ 4.100',
    benefits: 'Plano de Saúde, Vale Transporte, 30 dias de férias remuneradas, Licença Maternidade/Paternidade estendida',
    workHours: '40h semanais',
    workSchedule: 'Segunda a Sexta, 07h–11h e 13h–17h (turnos a definir)',
    workScale: 'Presencial',
    requirements: {
      education: 'Licenciatura em Educação Física. Registro no CREF obrigatório',
      experience: 'Experiência em ensino fundamental e médio. Conhecimento em pedagogia do esporte e inclusão escolar é diferencial',
      profile: 'Dinâmico(a), paciente, capacidade de engajar alunos de diferentes faixas etárias, comprometido(a) com o desenvolvimento integral dos estudantes',
    },
    description: 'Ministrar aulas de Educação Física para turmas do ensino fundamental II e médio. Planejamento de atividades pedagógicas conforme BNCC. Organização e arbitragem de jogos escolares. Avaliação do desempenho dos alunos. Participação em reuniões pedagógicas e eventos da escola.',
    aboutCompany: 'O Colégio Estadual Dom Pedro II é uma instituição de ensino público com mais de 50 anos de história em Goiânia, atendendo cerca de 1.800 alunos do ensino fundamental ao médio. Buscamos profissionais comprometidos com a transformação social pela educação.',
    resumePreference: 'both',
    postedDate: '2026-04-09',
    applications: [],
  },
  {
    jobType: 'emprego',
    title: 'Analista de Dados – Business Intelligence',
    companyName: 'Agro Smart Brasil',
    area: 'Agronegócio / Tecnologia',
    location: 'Ribeirão Preto, SP',
    salary: 'R$ 8.000 – R$ 11.000',
    benefits: 'Vale Refeição, Plano de Saúde, Odontológico, PLR, Home Office 4x/semana, Subsídio pós-graduação',
    workHours: '40h semanais',
    workSchedule: 'Segunda a Sexta, horário flexível',
    workScale: 'Híbrido',
    requirements: {
      education: 'Graduação em Estatística, Ciência de Dados, Engenharia, Administração ou áreas correlatas',
      experience: 'Experiência com SQL avançado, Python (Pandas, NumPy), ferramentas de BI (Power BI ou Tableau) e modelagem de dados',
      profile: 'Curioso(a), visão sistêmica, comunicação assertiva para traduzir dados em insights para áreas de negócio',
    },
    description: 'Desenvolvimento e manutenção de dashboards e relatórios em Power BI. Extração, transformação e carga de dados (ETL). Análise exploratória de dados de produção agrícola e logística. Apoio à tomada de decisão estratégica por meio de modelos analíticos. Documentação de processos e dicionário de dados.',
    aboutCompany: 'A Agro Smart Brasil é uma agtech focada em inteligência de dados para o agronegócio, atendendo cooperativas e grandes produtores rurais. Combinamos tecnologia de ponta com profundo conhecimento do campo para aumentar a eficiência produtiva do setor.',
    resumePreference: 'both',
    postedDate: '2026-04-08',
    applications: [],
  },
  {
    jobType: 'curso',
    title: 'Curso Técnico em Eletricidade Industrial',
    companyName: 'SENAI – Serviço Nacional de Aprendizagem Industrial',
    area: 'Indústria e Manutenção',
    location: 'Recife, PE',
    duration: '18 meses',
    salary: 'Gratuito (para trabalhadores da indústria)',
    benefits: 'Material didático incluso, Certificado SENAI reconhecido nacionalmente, Laboratórios modernos',
    workHours: '20h semanais',
    workSchedule: 'Segunda, Quarta e Sexta, 18h–22h',
    workScale: 'Presencial',
    requirements: {
      education: 'Ensino Médio completo',
      experience: 'Não é necessária experiência prévia na área',
      profile: 'Interesse por instalações elétricas industriais, atenção às normas de segurança (NR-10), disposição para atividades práticas em laboratório',
    },
    description: 'Formação técnica completa em instalações elétricas industriais. Conteúdo: circuitos elétricos, motores elétricos, CLPs, inversores de frequência, NR-10 e NR-33. Aulas teóricas aliadas a práticas em laboratório equipado com máquinas industriais reais. Ao final, o aluno estará apto a atuar em manutenção elétrica preventiva e corretiva em plantas industriais.',
    aboutCompany: 'O SENAI é a maior rede de educação profissional e tecnológica da América Latina. Com mais de 80 anos de história, oferece cursos técnicos, tecnológicos e de aperfeiçoamento em todo o Brasil, formando profissionais prontos para o mercado de trabalho industrial.',
    courseContact: 'senai.pe@senai.br | (81) 3184-9000 | senai.br/pe',
    resumePreference: 'none',
    postedDate: '2026-04-07',
    applications: [],
  },
];

async function seed() {
  // Tentar login; se não existir, criar a conta de demonstração
  let uid;
  try {
    const cred = await signInWithEmailAndPassword(auth, SEED_EMAIL, SEED_PASSWORD);
    uid = cred.user.uid;
    console.log(`Login realizado com conta existente (uid: ${uid})`);
  } catch {
    const cred = await createUserWithEmailAndPassword(auth, SEED_EMAIL, SEED_PASSWORD);
    uid = cred.user.uid;
    await setDoc(doc(db, 'employers', uid), {
      id: uid,
      companyName: 'Vagas Demo',
      email: SEED_EMAIL,
    });
    console.log(`Conta de demonstração criada (uid: ${uid})`);
  }

  console.log(`\nInserindo ${jobs.length} vagas fictícias no Firestore...`);
  for (const job of jobs) {
    const docRef = await addDoc(collection(db, 'jobs'), {
      ...job,
      employerId: uid,
      createdAt: serverTimestamp(),
    });
    console.log(`✓ "${job.title}" → ${docRef.id}`);
  }
  console.log('\nPronto! Todas as vagas foram inseridas.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Erro ao inserir vagas:', err);
  process.exit(1);
});
