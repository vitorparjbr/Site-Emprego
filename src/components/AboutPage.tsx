
import React, { useContext } from 'react';
import { AppContext } from '../App';

const AboutPage: React.FC = () => {
    const context = useContext(AppContext);

    if (!context) return <div>Carregando...</div>;

    const { aboutContent } = context;

    return (
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 md:p-8">
            <div 
                className="prose dark:prose-invert max-w-none" 
                dangerouslySetInnerHTML={{ __html: aboutContent }} 
            />
        </div>
    );
};

export default AboutPage;
