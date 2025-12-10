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
  const [loggedInUser, setLoggedInUser] = useState<{ email: string; name: string } | null>(() => {
    try {
      const saved = localStorage.getItem('feedbackUser');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  // Formulário de feedback
  const [feedbackType, setFeedbackType] = useState<'elogio' | 'critica' | 'duvida' | 'sugestao'>('sugestao');
  const [message, setMessage] = useState('');
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Ouvir feedbacks do Firestore em tempo real
  useEffect(() => {
    if (!fb.isEnabled()) return;
    
    const unsubscribe = fb.listenFeedback((feedbacks) => {
      setFeedbackList(feedbacks);
    });

    return () => unsubscribe();
  }, []);

  if (!context) return <div>Carregando...</div>;

  // Simular login local (sem Firebase para não complicar)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Preencha e-mail e senha.');
      return;
    }
    const user = { email, name: email.split('@')[0] };
    setLoggedInUser(user);
    try {
      localStorage.setItem('feedbackUser', JSON.stringify(user));
    } catch (e) {
      // ignorar erro de storage
    }
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
    const user = { email, name };
    setLoggedInUser(user);
    try {
      localStorage.setItem('feedbackUser', JSON.stringify(user));
    } catch (e) {
      // ignorar erro de storage
    }
    setError('');
    setName('');
    setEmail('');
    setPassword('');
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    try {
      localStorage.removeItem('feedbackUser');
    } catch (e) {
      // ignorar erro de storage
    }
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
        try {
          // Salvar no Firestore (listener vai atualizar a lista automaticamente)
          await fb.addFeedback(newFeedback);
        } catch (fbError) {
          console.error('Firestore error:', fbError);
          setError('Erro ao enviar feedback. Tente novamente.');
          setIsSubmitting(false);
          return;
        }
      } else {
        setError('Firebase não está configurado.');
        setIsSubmitting(false);
        return;
      }
      setMessage('');
      setError('');
      setIsModalOpen(false);
    } catch (err) {
      console.error('Feedback error:', err);
      setError('Erro ao enviar feedback. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Renderização unificada: mostrar lista sempre e usar modal para login/enviar
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Comentários</h1>
        <div className="flex items-center gap-3">
          {loggedInUser && (
            <p className="text-sm text-gray-700 dark:text-gray-300">Olá, <strong>{loggedInUser.name}</strong></p>
          )}
          {loggedInUser && (
            <button onClick={handleLogout} className="px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">
              Sair
            </button>
          )}
        </div>
      </div>

      <p className="text-lg text-gray-700 dark:text-gray-300">Compartilhe suas opiniões, críticas, dúvidas ou sugestões.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Painel esquerdo: instruções / botão */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 flex items-center justify-center">
          <div className="text-center">
            <p className="mb-4 text-gray-600 dark:text-gray-300">Clique aqui para enviar o seu comentário</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-2 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Enviar Feedback
            </button>
          </div>
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

      {/* Modal: login/registro ou formulário de envio */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Enviar Feedback</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-600 hover:text-gray-800">Fechar</button>
            </div>

            {!loggedInUser ? (
              <div>
                <div className="flex justify-center mb-4">
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

                <form onSubmit={isLoginView ? handleLogin : handleRegister} className="space-y-4">
                  {!isLoginView && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="Seu nome"
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
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="seu@exemplo.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Senha</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Mínimo 6 caracteres"
                    />
                  </div>

                  {error && <p className="text-red-500 text-sm">{error}</p>}

                  <div className="flex gap-2">
                    <button type="submit" className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md">{isLoginView ? 'Entrar' : 'Cadastrar'}</button>
                    <button type="button" onClick={() => setIsModalOpen(false)} className="py-2 px-4 border rounded-md">Cancelar</button>
                  </div>
                </form>
              </div>
            ) : (
              <div>
                <form onSubmit={handleSubmitFeedback} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipo de Feedback</label>
                    <select
                      value={feedbackType}
                      onChange={(e) => setFeedbackType(e.target.value as any)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                      title="Tipo de feedback"
                    >
                      <option value="sugestao">Sugestão</option>
                      <option value="elogio">Elogio</option>
                      <option value="critica">Crítica</option>
                      <option value="duvida">Dúvida</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Mensagem</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={5}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Escreva sua mensagem aqui..."
                    />
                  </div>

                  {error && <p className="text-red-500 text-sm">{error}</p>}

                  <div className="flex gap-2">
                    <button type="submit" disabled={isSubmitting} className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md">
                      {isSubmitting ? 'Enviando...' : 'Enviar Feedback'}
                    </button>
                    <button type="button" onClick={() => setIsModalOpen(false)} className="py-2 px-4 border rounded-md">Fechar</button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackPage;
