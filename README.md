# Job Finder Pro

Plataforma gratuita de busca de empregos, estágios, vagas de jovem aprendiz e cursos profissionalizantes para conectar candidatos e empresas em todo o Brasil.

🌐 **Site publicado:** https://vitorparjbr.github.io/Site-Emprego/

---

## Funcionalidades

### Para Candidatos
- Listagem de vagas com **paginação por cursor** (12 vagas por vez, botão "Carregar mais")
- Busca por cargo, empresa e localização com autocomplete e sugestões dinâmicas
- **Debouncing de 500ms** nos campos de busca — filtro só recalcula após o usuário parar de digitar
- Filtro por tipo de vaga (Emprego, Estágio, Jovem Aprendiz, Curso)
- Detalhes completos de cada vaga (salário, benefícios, requisitos, jornada, escala, sobre a empresa)
- Candidatura com envio de currículo (arquivo PDF/imagem até **4,5 MB** via Firebase Storage, texto colado ou ambos)
- Compartilhamento de vagas via WhatsApp, LinkedIn, X (Twitter) e link direto
- Apenas vagas publicadas há **no máximo 7 dias** são exibidas — vagas expiradas ficam automaticamente ocultas

### Para Empregadores
- Cadastro e login seguro via Firebase Authentication
- Verificação de e-mail obrigatória para publicar vagas
- Redefinição de senha via e-mail
- Publicação de vagas com campos detalhados: tipo, área, jornada, benefícios, requisitos e mais
- Suporte a 4 tipos de publicação: **Emprego**, **Estágio**, **Jovem Aprendiz** e **Curso**
- Edição e exclusão de vagas publicadas com **atualização otimista** (UI atualiza imediatamente, sem aguardar o Firestore)
- Painel de candidaturas com visualização de dados e download de currículo direto do Storage
- **Gestão de vagas expiradas:** vagas com mais de 7 dias aparecem em seção destacada no painel com opções de **Renovar** (reativa por mais 7 dias) ou **Excluir**
- Notificações de ação via toasts (react-hot-toast)

---

## Tecnologias

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 19 + TypeScript |
| Estilização | Tailwind CSS (dark mode nativo) |
| Build | Vite 6 |
| Banco de dados | Firebase Firestore |
| Autenticação | Firebase Authentication |
| Armazenamento | Firebase Storage (currículos PDF) |
| Cache offline | Firebase IndexedDB (`persistentLocalCache`) |
| Notificações | react-hot-toast |
| Deploy | GitHub Pages (`gh-pages`) |

---

## Regras de Negócio

### Validade de vagas
Vagas ficam visíveis para candidatos por **7 dias** a partir da publicação. Após esse prazo:
- Ficam automaticamente **ocultas** na listagem pública
- Continuam visíveis **somente** no painel do empregador, na seção "Vagas Expiradas"
- O empregador pode **Renovar** (reseta o contador para mais 7 dias) ou **Excluir**

### Upload de currículo
O arquivo de currículo (PDF, JPG, PNG — até **4,5 MB**) é enviado para o **Firebase Storage** no caminho `curriculos/{jobId}/{timestamp}_{nomeArquivo}`. Apenas a URL permanente de download é armazenada na subcoleção `applications` do Firestore — o binário **nunca** ocupa espaço no banco de dados.

### Paginação
A listagem de vagas carrega **12 documentos por vez** usando `limit()` + `startAfter()` (cursor). O botão "Carregar mais vagas" só aparece quando há mais vagas disponíveis no Firestore, garantindo que leituras extras ocorram apenas por ação deliberada do usuário.

---

## Otimizações de Performance e Custo (Firebase Spark)

O projeto foi projetado para maximizar o uso das cotas gratuitas do Firebase (50.000 leituras/dia).

| Otimização | Descrição |
|---|---|
| **Leitura única** | Substituído `onSnapshot` (listener em tempo real) por `getDocs` — vagas são carregadas uma vez, sem cobranças a cada atualização do Firestore |
| **Paginação por cursor** | `limit(12)` + `startAfter()` — nunca mais de 12 documentos por requisição |
| **Cache offline (IndexedDB)** | `initializeFirestore` com `persistentLocalCache` — consultas repetidas no mesmo dispositivo são servidas pelo cache local sem tocar o servidor |
| **Debouncing 500ms** | Campos de busca e localização só acionam o filtro após 500ms de inatividade — elimina recálculos durante a digitação |
| **PDFs no Storage** | Currículos binários ficam no Firebase Storage; Firestore armazena apenas a URL (string pequena) — evita documentos de ~1 MB no banco |
| **Atualizações otimistas** | Ações do empregador (publicar, editar, excluir, renovar) atualizam a UI imediatamente, sem depender de um listener de retorno |

---

## Estrutura do Projeto

```
src/
├── App.tsx                   # Componente raiz, AppContext, paginação, estados globais
├── types.ts                  # Tipos TypeScript (Job, Employer, Application, Page)
├── constants.ts              # Dados estáticos (conteúdo da página Quem Somos)
├── components/
│   ├── Header.tsx            # Cabeçalho com navegação e botão de busca
│   ├── Footer.tsx            # Rodapé com links legais
│   ├── HomePage.tsx          # Listagem paginada + debouncing + modal de busca + "Carregar mais"
│   ├── JobCard.tsx           # Card individual de vaga
│   ├── JobDetailsModal.tsx   # Modal de detalhes + candidatura + compartilhamento
│   ├── ApplicationForm.tsx   # Formulário de candidatura (upload para Storage)
│   ├── EmployerPage.tsx      # Painel do empregador (vagas ativas + expiradas + candidatos)
│   ├── EmployerAuth.tsx      # Login, cadastro e redefinição de senha
│   ├── PostJobForm.tsx       # Formulário de publicação/edição de vaga
│   ├── AboutPage.tsx         # Página Quem Somos
│   ├── PrivacyPolicyPage.tsx # Política de Privacidade (LGPD)
│   ├── TermsOfUsePage.tsx    # Termos de Uso
│   └── icons/                # Ícones SVG como componentes React
├── services/
│   ├── firebaseService.ts    # Firebase (Auth + Firestore + Storage + cache offline + paginação)
│   └── geminiService.ts      # Integração com Gemini AI (opcional)
scripts/
├── seed_jobs.mjs             # Script para inserir vagas de teste no Firestore
└── delete_seed_jobs.mjs      # Script para remover vagas de teste do Firestore
```

---

## Estrutura do Firestore

```
Firebase Authentication
  └── employers (usuários autenticados)

Firestore
  ├── employers/{uid}
  │     ├── id
  │     ├── companyName
  │     └── email
  ├── jobs/{jobId}
  │     ├── employerId, jobType, title, companyName, area
  │     ├── location, salary, benefits, workHours, workSchedule, workScale
  │     ├── requirements: { education, experience, profile }
  │     ├── description, aboutCompany, courseContact
  │     ├── resumePreference: 'file' | 'text' | 'both' | 'none'
  │     └── createdAt (Timestamp)
  │
  │     └── applications/{appId}          ← subcoleção
  │           ├── fullName, email, phone, date
  │           ├── resumeFile: { name, type, url }  ← URL do Firebase Storage
  │           └── resumeText (opcional)
  └── feedback/{id}

Firebase Storage
  └── curriculos/{jobId}/{timestamp}_{nomeArquivo}   ← PDFs e imagens
```

---

## Regras de Segurança (Firestore)

- **Vagas:** leitura pública; criação, edição e exclusão exigem autenticação e que o `employerId` corresponda ao `uid` do usuário autenticado
- **Candidaturas:** qualquer pessoa pode criar (com validação de campos obrigatórios); leitura restrita ao empregador dono da vaga; atualização e exclusão bloqueadas para todos
- **Empregadores:** leitura pública; escrita restrita ao próprio usuário

---

## Configuração Local

### Pré-requisitos
- Node.js 18+
- Conta no [Firebase](https://firebase.google.com) com projeto configurado (Firestore + Authentication + Storage)

### Passos

1. Clone o repositório:
   ```bash
   git clone https://github.com/vitorparjbr/Site-Emprego.git
   cd Site-Emprego
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Crie o arquivo `.env.local` na raiz com as credenciais do seu projeto Firebase:
   ```env
   VITE_FIREBASE_API_KEY=sua_api_key
   VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=seu_projeto
   VITE_FIREBASE_STORAGE_BUCKET=seu_projeto.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
   VITE_FIREBASE_APP_ID=seu_app_id
   ```
   > ⚠️ O arquivo `.env.local` está no `.gitignore` e **nunca** deve ser commitado.

4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

---

## Deploy

O deploy é feito para o GitHub Pages via:

```bash
npm run deploy
```

Esse comando executa o build (`vite build`) e envia o conteúdo de `dist/` para a branch `gh-pages`.

---

## Contato

📧 contatosjobfinderpro@gmail.com
