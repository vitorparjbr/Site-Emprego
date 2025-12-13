import React from 'react';

const EducationPage: React.FC = () => {
  return (
    <div className="space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Educação</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Aprimore suas habilidades e prepare-se para o mercado de trabalho
        </p>
      </div>

      {/* Seção: Educação Financeira */}
      <section className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Educação Financeira e Econômica</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Gestão de Orçamento Pessoal</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li><strong>Controle seus gastos:</strong> Registre todas as despesas mensais (fixas e variáveis)</li>
              <li><strong>Regra 50-30-20:</strong> 50% necessidades, 30% desejos, 20% poupança/investimentos</li>
              <li><strong>Fundo de emergência:</strong> Reserve de 3 a 6 meses de despesas em uma conta de fácil acesso</li>
              <li><strong>Evite dívidas:</strong> Priorize pagamentos à vista e evite juros de cartão de crédito</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Planejamento Financeiro</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li><strong>Defina metas:</strong> Curto prazo (férias), médio prazo (carro), longo prazo (aposentadoria)</li>
              <li><strong>Invista em conhecimento:</strong> Cursos gratuitos sobre finanças pessoais e investimentos</li>
              <li><strong>Diversifique:</strong> Não coloque todos os recursos em um único investimento</li>
              <li><strong>Previdência privada:</strong> Considere opções de aposentadoria complementar</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Noções de Economia</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li><strong>Inflação:</strong> Perda do poder de compra ao longo do tempo — invista para proteger seu dinheiro</li>
              <li><strong>Taxa Selic:</strong> Taxa básica de juros do Brasil — afeta financiamentos e rendimentos</li>
              <li><strong>Juros compostos:</strong> "Dinheiro gera dinheiro" — quanto antes investir, melhor</li>
              <li><strong>Consumo consciente:</strong> Avalie necessidade vs. desejo antes de comprar</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Seção: Currículo */}
      <section className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Preparo e Melhoria de Currículo</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Estrutura Básica</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li><strong>Dados pessoais:</strong> Nome completo, telefone, e-mail profissional, cidade/estado, LinkedIn</li>
              <li><strong>Objetivo profissional:</strong> 2-3 linhas sobre a vaga desejada (personalize para cada empresa)</li>
              <li><strong>Formação acadêmica:</strong> Do mais recente ao mais antigo (curso, instituição, período)</li>
              <li><strong>Experiência profissional:</strong> Empresa, cargo, período, principais atividades e resultados</li>
              <li><strong>Cursos e certificações:</strong> Cursos relevantes para a vaga (idiomas, técnicos, etc.)</li>
              <li><strong>Habilidades:</strong> Competências técnicas (software, ferramentas) e comportamentais (liderança, comunicação)</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Dicas de Ouro</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li><strong>Seja objetivo:</strong> Máximo de 2 páginas (profissionais juniores: 1 página)</li>
              <li><strong>Use verbos de ação:</strong> "Desenvolvi", "Gerenciei", "Implementei", "Analisei"</li>
              <li><strong>Quantifique resultados:</strong> "Aumentei vendas em 30%" em vez de "Melhorei vendas"</li>
              <li><strong>Revise ortografia:</strong> Erros podem eliminar sua candidatura — peça para alguém revisar</li>
              <li><strong>Design limpo:</strong> Fonte legível (Arial, Calibri), espaçamento adequado, evite cores excessivas</li>
              <li><strong>Sem informações pessoais demais:</strong> Não inclua RG, CPF, foto (a menos que solicitado)</li>
              <li><strong>Atualize sempre:</strong> Adicione novos cursos, projetos e experiências regularmente</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">O Que Evitar</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>❌ Mentir sobre experiências ou habilidades</li>
              <li>❌ Usar e-mail pouco profissional (ex.: gatinha123@...)</li>
              <li>❌ Incluir informações irrelevantes (hobbies que não agregam)</li>
              <li>❌ Salvar em formato incompatível (sempre envie PDF)</li>
              <li>❌ Curriculo genérico — personalize para cada vaga</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Seção: Entrevista de Emprego */}
      <section className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Como se Preparar para Entrevistas</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Antes da Entrevista</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li><strong>Pesquise a empresa:</strong> Missão, valores, produtos/serviços, cultura organizacional</li>
              <li><strong>Releia a vaga:</strong> Anote os requisitos principais e prepare exemplos de como você os atende</li>
              <li><strong>Prepare respostas:</strong> "Fale sobre você", "Pontos fortes/fracos", "Por que quer trabalhar aqui?"</li>
              <li><strong>Tenha perguntas prontas:</strong> "Como é o dia a dia?", "Quais os desafios da função?"</li>
              <li><strong>Vista-se adequadamente:</strong> Traje formal ou business casual (dependendo da empresa)</li>
              <li><strong>Chegue com antecedência:</strong> 10-15 minutos antes (online: teste equipamento com 30 min de antecedência)</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Durante a Entrevista</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li><strong>Cumprimente com confiança:</strong> Aperto de mão firme, olhar nos olhos, sorria naturalmente</li>
              <li><strong>Linguagem corporal:</strong> Postura ereta, evite cruzar braços, demonstre interesse</li>
              <li><strong>Ouça atentamente:</strong> Espere o recrutador terminar antes de responder</li>
              <li><strong>Seja honesto:</strong> Não invente experiências — foque no que realmente sabe fazer</li>
              <li><strong>Use método STAR:</strong> Situação, Tarefa, Ação, Resultado ao contar experiências</li>
              <li><strong>Mostre entusiasmo:</strong> Demonstre interesse genuíno pela vaga e pela empresa</li>
              <li><strong>Evite falar mal:</strong> Nunca critique ex-empregadores ou colegas</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Perguntas Comuns e Como Responder</h3>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <div>
                <p className="font-semibold">❓ "Fale sobre você"</p>
                <p className="ml-4">✅ Resuma sua trajetória profissional focando no que é relevante para a vaga (2-3 minutos)</p>
              </div>
              <div>
                <p className="font-semibold">❓ "Qual seu maior defeito?"</p>
                <p className="ml-4">✅ Cite algo real, mas mostre como está trabalhando para melhorar</p>
                <p className="ml-4 text-sm italic">Ex: "Às vezes sou perfeccionista demais, mas aprendi a priorizar prazos"</p>
              </div>
              <div>
                <p className="font-semibold">❓ "Por que devemos contratar você?"</p>
                <p className="ml-4">✅ Destaque suas habilidades + resultados passados + alinhamento com a vaga</p>
              </div>
              <div>
                <p className="font-semibold">❓ "Onde você se vê daqui a 5 anos?"</p>
                <p className="ml-4">✅ Mostre ambição alinhada com crescimento na empresa</p>
              </div>
              <div>
                <p className="font-semibold">❓ "Pretensão salarial?"</p>
                <p className="ml-4">✅ Pesquise o mercado antes. Diga uma faixa ou "Estou aberto a propostas compatíveis com o mercado"</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Após a Entrevista</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li><strong>Envie um e-mail de agradecimento:</strong> Agradeça a oportunidade e reforce seu interesse (em até 24h)</li>
              <li><strong>Anote pontos de melhoria:</strong> O que poderia ter respondido melhor? Use para próximas entrevistas</li>
              <li><strong>Mantenha contato (se apropriado):</strong> Conecte-se no LinkedIn com o recrutador</li>
              <li><strong>Continue buscando:</strong> Não espere apenas uma resposta — continue se candidatando</li>
            </ul>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">💡 Dica Extra: Entrevistas Online</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-blue-700 dark:text-blue-300">
              <li>Teste câmera, microfone e conexão antes</li>
              <li>Escolha um local iluminado e sem ruídos</li>
              <li>Fundo limpo e profissional (ou use fundo virtual neutro)</li>
              <li>Olhe para a câmera (não para sua imagem na tela)</li>
              <li>Tenha um copo d'água por perto</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Recursos Adicionais */}
      <section className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">📚 Recursos Gratuitos Recomendados</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
          <div>
            <h4 className="font-semibold mb-2">Educação Financeira:</h4>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>CVM - Investidor</li>
              <li>Tesouro Direto (cursos online)</li>
              <li>B3 Educação</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Currículo e Entrevistas:</h4>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>Canva (templates de currículo)</li>
              <li>LinkedIn Learning</li>
              <li>Vagas.com - Blog</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EducationPage;
