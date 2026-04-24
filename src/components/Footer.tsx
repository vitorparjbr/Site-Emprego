
import React, { useContext } from 'react';
import { AppContext } from '../App';

const Footer: React.FC = () => {
  const context = useContext(AppContext);
  const setPage = context?.setPage;

  return (
    <footer className="bg-white dark:bg-gray-800 shadow-inner mt-auto">
      <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-2">
        <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400">
          <button
            onClick={() => setPage?.('privacy')}
            className="hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-colors"
          >
            Política de Privacidade
          </button>
          <span>·</span>
          <button
            onClick={() => setPage?.('terms')}
            className="hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-colors"
          >
            Termos de Uso
          </button>
        </div>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} Vagas Para Todos. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
