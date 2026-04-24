import React, { useContext } from 'react';
import { AppContext } from '../App';

const TermsOfUsePage: React.FC = () => {
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Termos de Uso</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Última atualização: abril de 2026</p>
        </div>

        <p>
          Bem-vindo(a) à <strong>Vagas Para Todos</strong>. Ao utilizar esta plataforma, você concorda com os
          termos e condições descritos abaixo. Leia com atenção antes de utilizar nossos serviços.
        </p>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">1. Sobre a plataforma</h2>
          <p>
            A Vagas Para Todos é uma plataforma gratuita que conecta candidatos a oportunidades de emprego,
            estágio, jovem aprendiz e cursos divulgados por empregadores cadastrados.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">2. Cadastro de empregadores</h2>
          <ul className="list-disc list-inside ml-2 space-y-1">
            <li>Para publicar vagas, é necessário criar uma conta com e-mail e senha.</li>
            <li>O empregador é responsável pela veracidade das informações cadastradas.</li>
            <li>É proibido criar contas falsas ou se passar por outra empresa.</li>
            <li>A Vagas Para Todos reserva o direito de remover contas que violem estes termos.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">3. Publicação de vagas</h2>
          <ul className="list-disc list-inside ml-2 space-y-1">
            <li>O empregador é o único responsável pelo conteúdo das vagas publicadas.</li>
            <li>É proibido publicar vagas falsas, enganosas, ilegais ou discriminatórias.</li>
            <li>
              Não é permitido solicitar pagamento de candidatos em nenhuma etapa do processo seletivo.
            </li>
            <li>
              A Vagas Para Todos pode remover vagas que violem estes termos sem aviso prévio.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">4. Candidaturas</h2>
          <ul className="list-disc list-inside ml-2 space-y-1">
            <li>Ao enviar uma candidatura, o candidato autoriza que seus dados sejam visualizados pelo empregador responsável pela vaga.</li>
            <li>O candidato é responsável pela veracidade dos dados e do currículo enviado.</li>
            <li>A Vagas Para Todos não intervém nem se responsabiliza pelo processo seletivo entre candidato e empregador.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">5. Responsabilidades</h2>
          <p>
            A Vagas Para Todos atua como intermediária e não se responsabiliza por:
          </p>
          <ul className="list-disc list-inside ml-2 space-y-1">
            <li>A veracidade das vagas publicadas pelos empregadores</li>
            <li>O resultado de qualquer processo seletivo</li>
            <li>Danos decorrentes do uso indevido da plataforma por terceiros</li>
            <li>Indisponibilidade temporária do serviço</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">6. Gratuidade e doações</h2>
          <p>
            A plataforma é atualmente gratuita para todos os usuários. Futuramente, poderá disponibilizar
            a opção de doações voluntárias para apoiar a manutenção e o desenvolvimento do serviço.
            Doações são opcionais e não concedem vantagens ou privilégios na plataforma.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">7. Propriedade intelectual</h2>
          <p>
            O design, o código e os conteúdos originais da Vagas Para Todos são de propriedade exclusiva
            da plataforma e não podem ser copiados ou reproduzidos sem autorização.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">8. Alterações nos termos</h2>
          <p>
            Estes termos podem ser atualizados a qualquer momento. O uso continuado da plataforma após
            as alterações implica na aceitação dos novos termos.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">9. Contato</h2>
          <p>
            Dúvidas ou denúncias:{' '}
            <a href="mailto:contato@vagasparatodos.com.br" className="text-blue-600 dark:text-blue-400 hover:underline">
              contato@vagasparatodos.com.br
            </a>
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">10. Lei aplicável</h2>
          <p>
            Estes termos são regidos pelas leis brasileiras. Fica eleito o foro da comarca do responsável
            pela plataforma para dirimir quaisquer controvérsias.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsOfUsePage;
