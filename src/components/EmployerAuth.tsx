import React, { useState } from 'react';
import * as fb from '../services/firebaseService';
import { toast } from 'react-hot-toast';

export const EmployerAuth: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isLogin) {
                await fb.signIn(email, password);
                toast.success('Login realizado com sucesso!');
            } else {
                if (!companyName.trim()) {
                    toast.error('O nome da empresa é obrigatório.');
                    setLoading(false);
                    return;
                }
                await fb.signUp(companyName, email, password);
                toast.success('Conta criada com sucesso!');
            }
        } catch (error: any) {
            let message = 'Ocorreu um erro.';
            if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                message = 'Email ou senha inválidos.';
            } else if (error.code === 'auth/email-already-in-use') {
                message = 'Este email já está em uso.';
            } else if (error.code === 'auth/weak-password') {
                message = 'A senha deve ter pelo menos 6 caracteres.';
            } else if (error.code === 'auth/invalid-api-key') {
                message = 'Sua chave do Firebase é inválida.';
            } else {
                message = error.message;
            }
            toast.error(message);
        }
        setLoading(false);
    };

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

    return (
        <div className="flex justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                <div>
                    <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                        {isLogin ? 'Acessar Painel' : 'Criar Conta Empresarial'}
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                        Espaço exclusivo para publicadores de vagas
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm space-y-4">
                        {!isLogin && (
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
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Endereço de E-mail</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-700 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
                                placeholder="seunome@empresa.com"
                            />
                        </div>
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
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                        >
                            {loading ? (
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            ) : null}
                            {loading ? 'Aguarde...' : isLogin ? 'Entrar no Sistema' : 'Cadastrar Instituição'}
                        </button>
                    </div>
                </form>
                
                <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4 text-center">
                    <button 
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-sm font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                    >
                        {isLogin ? 'Não tem uma conta? Registre-se grátis' : 'Já possui cadastro? Volte para o Login'}
                    </button>
                </div>
            </div>
        </div>
    );
};
