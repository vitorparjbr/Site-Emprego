import React, { useState } from 'react';
import * as fb from '../services/firebaseService';
import { toast } from 'react-hot-toast';

type AuthView = 'login' | 'register' | 'forgot-password';

export const EmployerAuth: React.FC = () => {
    const [view, setView] = useState<AuthView>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [loading, setLoading] = useState(false);
    const [registrationDone, setRegistrationDone] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (view === 'login') {
                await fb.signIn(email, password);
                toast.success('Login realizado com sucesso!');
            } else if (view === 'register') {
                if (!companyName.trim()) {
                    toast.error('O nome da empresa é obrigatório.');
                    setLoading(false);
                    return;
                }
                await fb.signUp(companyName, email, password);
                // Mostra tela de confirmação em vez de logar direto
                setRegistrationDone(true);
            } else if (view === 'forgot-password') {
                await fb.resetPassword(email);
                toast.success('E-mail de redefinição enviado! Verifique sua caixa de entrada.');
                setView('login');
            }
        } catch (error: any) {
            let message = 'Ocorreu um erro.';
            if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                message = 'E-mail ou senha inválidos.';
            } else if (error.code === 'auth/email-already-in-use') {
                message = 'Este e-mail já está em uso.';
            } else if (error.code === 'auth/weak-password') {
                message = 'A senha deve ter pelo menos 6 caracteres.';
            } else if (error.code === 'auth/invalid-api-key') {
                message = 'Sua chave do Firebase é inválida.';
            } else if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-email') {
                message = 'E-mail não encontrado.';
            } else {
                message = error.message;
            }
            toast.error(message);
        }
        setLoading(false);
    };

    // --- Modo sem Firebase configurado ---
    if (!fb.isEnabled()) {
        return (
            <div className="flex justify-center items-center py-20 px-4">
                <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 text-yellow-800 dark:text-yellow-200 p-6 rounded-lg max-w-lg text-center shadow">
                    <h2 className="text-xl font-bold mb-4">Ação Necessária: Banco de Dados</h2>
                    <p className="mb-4 text-sm font-medium text-left">
                        A plataforma está operando em modo de "Demonstração Local". Para publicar vagas reais que fiquem salvas para todos os candidatos, as credenciais do Firebase precisam ser preenchidas no seu ambiente de nuvem.
                    </p>
                    <p className="text-sm text-left">
                        Adicione as seguintes variáveis no seu painel da <b>Vercel</b> (ou crie um <code>.env.local</code> localmente):
                    </p>
                    <ul className="text-left py-4 text-xs font-mono opacity-80 list-disc list-inside">
                        <li>VITE_FIREBASE_API_KEY</li>
                        <li>VITE_FIREBASE_AUTH_DOMAIN</li>
                        <li>VITE_FIREBASE_PROJECT_ID</li>
                        <li>... outras do SDK gerado</li>
                    </ul>
                </div>
            </div>
        );
    }

    // --- Tela de sucesso após cadastro (aguardar verificação de e-mail) ---
    if (registrationDone) {
        return (
            <div className="flex justify-center py-12 px-4">
                <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center space-y-4">
                    <div className="flex justify-center">
                        <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-4">
                            <svg className="h-10 w-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Verifique seu e-mail</h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Enviamos um link de verificação para <strong>{email}</strong>.
                        Clique no link recebido para ativar sua conta e depois faça login.
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                        Não recebeu? Verifique a caixa de spam.
                    </p>
                    <button
                        onClick={() => { setRegistrationDone(false); setView('login'); }}
                        className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
                    >
                        Ir para o Login
                    </button>
                </div>
            </div>
        );
    }

    const titles: Record<AuthView, string> = {
        'login': 'Painel do Empregador',
        'register': 'Criar Conta Empresarial',
        'forgot-password': 'Redefinir Senha',
    };

    const subtitles: Record<AuthView, string> = {
        'login': 'Espaço exclusivo para empresas',
        'register': 'Crie sua conta gratuita',
        'forgot-password': 'Enviaremos um link para seu e-mail',
    };

    return (
        <div className="flex justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                <div>
                    <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                        {titles[view]}
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                        {subtitles[view]}
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm space-y-4">
                        {/* Campo: Nome da empresa (só no cadastro) */}
                        {view === 'register' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome da Empresa</label>
                                <input
                                    type="text"
                                    required
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-700 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
                                    placeholder="Ex: Minha Empresa Ltda"
                                />
                            </div>
                        )}

                        {/* Campo: E-mail */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">E-mail</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-700 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
                                placeholder="seunome@empresa.com"
                            />
                        </div>

                        {/* Campo: Senha (não aparece em "esqueci senha") */}
                        {view !== 'forgot-password' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Senha</label>
                                <input
                                    type="password"
                                    required
                                    minLength={6}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-700 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        )}
                    </div>

                    {/* Link "Esqueci minha senha" (visível apenas no login) */}
                    {view === 'login' && (
                        <div className="flex justify-end -mt-2">
                            <button
                                type="button"
                                onClick={() => setView('forgot-password')}
                                className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                            >
                                Esqueci minha senha
                            </button>
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                        >
                            {loading ? (
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                            ) : null}
                            {loading
                                ? 'Aguarde...'
                                : view === 'login'
                                ? 'Entrar'
                                : view === 'register'
                                ? 'Cadastrar-se'
                                : 'Enviar link de redefinição'}
                        </button>
                    </div>
                </form>

                {/* Links de alternância entre views */}
                <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4 text-center space-y-2">
                    {view !== 'register' && (
                        <button
                            onClick={() => setView('register')}
                            className="block w-full text-sm font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                        >
                            Não tem uma conta? Registre-se grátis
                        </button>
                    )}
                    {view !== 'login' && (
                        <button
                            onClick={() => setView('login')}
                            className="block w-full text-sm font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                        >
                            Já possui cadastro? Volte para o Login
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
