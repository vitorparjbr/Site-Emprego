import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../App';
import * as fb from '../services/firebaseService';

interface Feedback {
  id: string;
  name: string;
  email: string;
  type: 'elogio' | 'critica' | 'duvida' | 'sugestao';
  message: string;
  date: string;
}

const FeedbackPage: React.FC = () => {
  const context = useContext(AppContext);
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loggedInUser, setLoggedInUser] = useState<{ email: string; name: string } | null>(null);

  // Formulário de feedback
  const [feedbackType, setFeedbackType] = useState<'elogio' | 'critica' | 'duvida' | 'sugestao'>('sugestao');
  const [message, setMessage] = useState('');
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!context) return <div>Carregando...</div>;

  // Simular login local (sem Firebase para não complicar)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Preencha e-mail e senha.');
      return;
    }
    setLoggedInUser({ email, name: email.split('@')[0] });
    setError('');
    setEmail('');
    setPassword('');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Preencha todos os campos.');
      return;
    }
    if (password.length < 6) {
      setError('Senha deve ter pelo menos 6 caracteres.');
      return;
    }
    setLoggedInUser({ email, name });
    setError('');
    setName('');
    setEmail('');
    setPassword('');
  };

  const handleLogout = () => {
    setLoggedInUser(null);
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setError('Escreva uma mensagem.');
      return;
    }

    setIsSubmitting(true);
    const newFeedback: Feedback = {
      id: `fb-${Date.now()}`,
      name: loggedInUser!.name,
      email: loggedInUser!.email,
      type: feedbackType,
      message,
      date: new Date().toISOString(),
    };

    try {
      if (fb.isEnabled()) {
        // Salvar no Firestore
        await fb.addFeedback(newFeedback);
      }
      // Adicionar à lista local
      setFeedbackList([newFeedback, ...feedbackList]);
      setMessage('');
      setError('');
    } catch (err) {
      setError('Erro ao enviar feedback. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Se não está logado, mostra formulário de login/registro
  if (!loggedInUser) {
    return (
      <div className="max-w-md mx-auto mt-10">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
          <div className="flex justify-center mb-6">
            <button
              onClick={() => setIsLoginView(true)}
              className={`px-4 py-2 font-semibold ${isLoginView ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLoginView(false)}
              className={`px-4 py-2 font-semibold ${!isLoginView ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            >
              Cadastro
            </button>
          </div>

          <form onSubmit={isLoginView ? handleLogin : handleRegister} className="space-y-6">
            <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
              {isLoginView ? 'Acesso' : 'Criar Conta'}
            </h2>

            {!isLoginView && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md"
            >
              {isLoginView ? 'Entrar' : 'Cadastrar'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Se está logado, mostra formulário de feedback e lista
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Feedback & Sugestões</h1>
        <button onClick={handleLogout} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">
          Sair
        </button>
      </div>

      <p className="text-lg text-gray-700 dark:text-gray-300">
        Bem-vindo(a), <strong>{loggedInUser.name}</strong>! Compartilhe suas opiniões, críticas, dúvidas ou sugestões.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulário de Feedback */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Enviar Feedback</h2>
          <form onSubmit={handleSubmitFeedback} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipo de Feedback</label>
              <select
                value={feedbackType}
                onChange={(e) => setFeedbackType(e.target.value as any)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="sugestao">💡 Sugestão</option>
                <option value="elogio">👍 Elogio</option>
                <option value="critica">⚠️ Crítica</option>
                <option value="duvida">❓ Dúvida</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Mensagem</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                placeholder="Escreva sua mensagem aqui..."
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md disabled:bg-gray-400"
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Feedback'}
            </button>
          </form>
        </div>

        {/* Lista de Feedbacks */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Feedbacks Recentes</h2>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {feedbackList.length > 0 ? (
              feedbackList.map((fb) => (
                <div key={fb.id} className="p-4 border rounded-md dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-white">{fb.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{fb.email}</p>
                    </div>
                    <span className="text-xs bg-blue-200 dark:bg-blue-700 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                      {fb.type === 'sugestao' && '💡 Sugestão'}
                      {fb.type === 'elogio' && '👍 Elogio'}
                      {fb.type === 'critica' && '⚠️ Crítica'}
                      {fb.type === 'duvida' && '❓ Dúvida'}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">{fb.message}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(fb.date).toLocaleDateString('pt-BR')} às{' '}
                    {new Date(fb.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400">Nenhum feedback ainda. Seja o primeiro!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;
