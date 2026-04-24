import React, { useContext } from 'react';
import { AppContext } from '../App';

const PrivacyPolicyPage: React.FC = () => {
  const context = useContext(AppContext);
  const setPage = context?.setPage;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button
        onClick={() => setPage?.('home')}
        className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
      >
        ← Voltar para o início
      </button>

      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-8 space-y-6 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Política de Privacidade</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Última atualização: abril de 2026</p>
        </div>

        <p>
          A <strong>Vagas Para Todos</strong> valoriza a privacidade de seus usuários e está comprometida com a
          proteção dos dados pessoais coletados nesta plataforma, em conformidade com a{' '}
          <strong>Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018)</strong>.
        </p>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">1. Quem somos</h2>
          <p>
            Responsável pelo tratamento dos dados: <strong>Vagas Para Todos</strong>.<br />
            Contato do encarregado (DPO): <a href="mailto:contatosjobfinderpro@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline">contatosjobfinderpro@gmail.com</a>
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">2. Quais dados coletamos</h2>
          <p><strong>Candidatos</strong> que se candidatam a vagas fornecem:</p>
          <ul className="list-disc list-inside ml-2 space-y-1">
            <li>Nome completo</li>
            <li>Endereço de e-mail</li>
            <li>Número de telefone</li>
            <li>Currículo (arquivo ou texto)</li>
          </ul>
          <p className="mt-2"><strong>Empregadores</strong> que criam uma conta fornecem:</p>
          <ul className="list-disc list-inside ml-2 space-y-1">
            <li>Nome da empresa</li>
            <li>Endereço de e-mail</li>
            <li>Senha (armazenada de forma criptografada pelo Firebase Authentication)</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">3. Para que usamos os dados</h2>
          <ul className="list-disc list-inside ml-2 space-y-1">
            <li>Permitir que candidatos se candidatem a vagas de emprego</li>
            <li>Permitir que empregadores visualizem as candidaturas recebidas</li>
            <li>Autenticar empregadores no sistema</li>
            <li>Garantir o funcionamento e a segurança da plataforma</li>
          </ul>
          <p className="mt-2">
            Não utilizamos seus dados para fins de marketing, publicidade ou venda a terceiros.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">4. Quem tem acesso aos dados</h2>
          <ul className="list-disc list-inside ml-2 space-y-1">
            <li>
              <strong>Empregadores</strong>: têm acesso aos dados dos candidatos que se candidataram às suas vagas.
            </li>
            <li>
              <strong>Firebase (Google)</strong>: os dados são armazenados na plataforma Firebase, sujeita à{' '}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                Política de Privacidade do Google
              </a>.
            </li>
          </ul>
          <p className="mt-2">
            Não compartilhamos seus dados com outras empresas ou pessoas além das citadas acima.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">5. Por quanto tempo armazenamos os dados</h2>
          <p>
            Os dados são armazenados enquanto forem necessários para a finalidade para a qual foram coletados.
            Candidaturas ficam vinculadas à vaga pelo tempo em que ela estiver ativa. Contas de empregadores
            podem ser excluídas mediante solicitação.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">6. Seus direitos (LGPD)</h2>
          <p>Você tem direito a:</p>
          <ul className="list-disc list-inside ml-2 space-y-1">
            <li>Confirmar se tratamos seus dados pessoais</li>
            <li>Acessar os dados que temos sobre você</li>
            <li>Solicitar a correção de dados incompletos ou desatualizados</li>
            <li>Solicitar a exclusão dos seus dados</li>
            <li>Revogar o consentimento a qualquer momento</li>
          </ul>
          <p className="mt-2">
            Para exercer qualquer desses direitos, entre em contato:{' '}
            <a href="mailto:contato@vagasparatodos.com.br" className="text-blue-600 dark:text-blue-400 hover:underline">
              contato@vagasparatodos.com.br
            </a>
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">7. Cookies e armazenamento local</h2>
          <p>
            Utilizamos o <strong>localStorage</strong> do navegador para salvar preferências como vagas favoritas
            e sessão de empregador. Não utilizamos cookies de rastreamento ou publicidade.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">8. Alterações nesta política</h2>
          <p>
            Esta política pode ser atualizada periodicamente. Recomendamos que você a revise regularmente.
            Alterações significativas serão comunicadas na plataforma.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">9. Contato</h2>
          <p>
            Dúvidas sobre esta política:{' '}
            <a href="mailto:contato@vagasparatodos.com.br" className="text-blue-600 dark:text-blue-400 hover:underline">
              contato@vagasparatodos.com.br
            </a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
