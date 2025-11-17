
import React, { useState, useContext } from 'react';
import { AppContext } from '../App';
import { Page } from '../types';
import { BriefcaseIcon } from './icons/BriefcaseIcon';
import { XMarkIcon } from './icons/XMarkIcon';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const context = useContext(AppContext);

  if (!context) return null;

  const { setPage } = context;

  const handleNavClick = (page: Page) => {
    setPage(page);
    setIsMenuOpen(false);
  };
  
  const NavLink: React.FC<{ page: Page, children: React.ReactNode }> = ({ page, children }) => (
    <button
      onClick={() => handleNavClick(page)}
      className="text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
    >
      {children}
    </button>
  );

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button onClick={() => handleNavClick('home')} className="flex-shrink-0 flex items-center gap-2">
              <BriefcaseIcon className="h-8 w-8 text-blue-600 dark:text-blue-500" />
              <span className="font-bold text-xl text-gray-800 dark:text-white">Job Finder Pro</span>
            </button>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink page="home">Início</NavLink>
              <NavLink page="employer">Publicar Vagas</NavLink>
              <NavLink page="news">Notícias</NavLink>
              <NavLink page="about">Quem Somos</NavLink>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" />
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
             <button onClick={() => handleNavClick('home')} className="text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium w-full text-left">Início</button>
             <button onClick={() => handleNavClick('employer')} className="text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium w-full text-left">Publicar Vagas</button>
             <button onClick={() => handleNavClick('news')} className="text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium w-full text-left">Notícias</button>
             <button onClick={() => handleNavClick('about')} className="text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium w-full text-left">Quem Somos</button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
