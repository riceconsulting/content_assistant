
import React from 'react';
import SparklesIcon from './icons/SparklesIcon';

const Header: React.FC = () => {
  return (
    <header className="p-4 sm:p-6 border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto flex items-center justify-center sm:justify-start">
        <SparklesIcon className="w-8 h-8 text-cyan-400" />
        <h1 className="ml-3 text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-200 to-slate-400 text-transparent bg-clip-text">
          AI Content Generator
        </h1>
      </div>
    </header>
  );
};

export default Header;
