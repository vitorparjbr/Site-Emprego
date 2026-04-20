# Job Finder Pro

Plataforma gratuita de busca de empregos, estágios, vagas de jovem aprendiz e cursos profissionalizantes para conectar candidatos e empresas em todo o Brasil.

🌐 **Site publicado:** https://vitorparjbr.github.io/Site-Emprego/

---

## Funcionalidades

### Para Candidatos
- Visualização de vagas em tempo real
- Busca por cargo, empresa e localização com autocomplete
- Detalhes completos de cada vaga (salário, benefícios, requisitos, jornada)
- Candidatura com envio de currículo (arquivo PDF/imagem ou texto colado)
- Compartilhamento de vagas via WhatsApp, LinkedIn, X (Twitter) e link direto

### Para Empregadores
- Cadastro e login seguro via Firebase Authentication
- Publicação de vagas com campos detalhados: tipo, área, jornada, benefícios, requisitos e mais
- Suporte a 4 tipos de publicação: **Emprego**, **Estágio**, **Jovem Aprendiz** e **Curso**
- Edição e exclusão de vagas publicadas
- Painel de candidaturas com visualização de dados e download de currículo

---

## Tecnologias

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 19 + TypeScript |
| Estilização | Tailwind CSS (dark mode) |
| Build | Vite 6 |
| Backend / Banco de dados | Firebase Firestore |
| Autenticação | Firebase Authentication |
| Deploy | GitHub Pages (`gh-pages`) |

---

## Estrutura do Projeto

```
src/
├── App.tsx               # Componente raiz, AppContext, roteamento
├── types.ts              # Tipos TypeScript (Job, Employer, Application, Page)
├── constants.ts          # Dados estáticos (conteúdo da página Quem Somos)
├── components/
│   ├── Header.tsx        # Cabeçalho com navegação e botão de busca
│   ├── Footer.tsx        # Rodapé com links legais
│   ├── HomePage.tsx      # Listagem de vagas e modal de busca
│   ├── JobCard.tsx       # Card individual de vaga
│   ├── JobDetailsModal.tsx # Modal de detalhes + candidatura + compartilhamento
│   ├── ApplicationForm.tsx # Formulário de candidatura
│   ├── EmployerPage.tsx  # Painel do empregador
│   ├── EmployerAuth.tsx  # Login e cadastro de empregador
│   ├── PostJobForm.tsx   # Formulário de publicação/edição de vaga
│   ├── AboutPage.tsx     # Página Quem Somos
│   ├── PrivacyPolicyPage.tsx # Política de Privacidade (LGPD)
│   ├── TermsOfUsePage.tsx    # Termos de Uso
│   └── icons/            # Ícones SVG como componentes React
├── services/
│   ├── firebaseService.ts  # Integração com Firebase (Auth + Firestore)
│   └── geminiService.ts    # Integração com Gemini AI (opcional)
scripts/
├── seed_jobs.mjs         # Script para inserir vagas de teste no Firestore
└── delete_seed_jobs.mjs  # Script para remover vagas de teste do Firestore
```

---

## Configuração Local

### Pré-requisitos
- Node.js 18+
- Conta no [Firebase](https://firebase.google.com) com projeto configurado (Firestore + Authentication)

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

O deploy é feito automaticamente para o GitHub Pages via:

```bash
npm run deploy
```

Esse comando executa o build (`vite build`) e envia o conteúdo de `dist/` para a branch `gh-pages`.

---

## Regras de Segurança (Firestore)

- **Vagas:** leitura pública; criação, edição e exclusão exigem autenticação e que o `employerId` corresponda ao `uid` do usuário autenticado
- **Candidaturas:** qualquer pessoa pode criar; leitura restrita ao empregador dono da vaga
- **Empregadores:** leitura pública; criação e atualização restritas ao próprio usuário

---

## Contato

📧 contatosjobfinderpro@gmail.com
