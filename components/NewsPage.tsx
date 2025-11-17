
import React, { useContext } from 'react';
import { AppContext } from '../App';
import { ArrowRightIcon } from './icons/ArrowRightIcon';

const NewsPage: React.FC = () => {
    // Acessa os dados do contexto global
    const context = useContext(AppContext);

    if (!context) return <div>Carregando...</div>;

    const { newsContent } = context;

    return (
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 md:p-8">
            <h1 className="text-3xl font-bold mb-6 text-blue-600 dark:text-blue-400">Últimas Notícias e Oportunidades</h1>
            <div className="space-y-6">
                {/* Mapeia o array de notícias e renderiza um card para cada uma */}
                {newsContent.map((article, index) => (
                    <div key={index} className="p-4 border-l-4 border-blue-500 bg-gray-50 dark:bg-gray-700 rounded-r-lg">
                        <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-3">{article.description}</p>
                        {/* 
                          O link abre em uma nova aba ('_blank') por segurança e usabilidade.
                          'rel="noopener noreferrer"' é importante para segurança ao abrir links externos.
                        */}
                        <a 
                            href={article.link} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                        >
                            Ler mais em {article.source}
                            <ArrowRightIcon className="h-4 w-4 ml-2" />
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NewsPage;
